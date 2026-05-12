# AUTH05-F — 첫 로그인 비밀번호 설정 (외부 사용자 계정 활성화)

> 화면 ID: **AUTH05-F**
> 모듈: AUTH (통합 인증)
> SFR: SFR-015
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-015, DB-001 §2.2 users / §2.6 invitation_tokens

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | AUTH05-F |
| 화면명 | 첫 로그인 비밀번호 설정 (계정 활성화) |
| URL | `/invitation/:token` |
| 화면 유형 | F (Form) |
| 접근 권한 | 비로그인 진입 가능 (초대 토큰 검증) |

## 2. 진입 경로

- 외부 사용자 초대 이메일의 `[계정 활성화 링크]` 클릭
- AUTH03-M 모달에서 초대 발송 후 사용자가 이메일 수신

## 3. 레이아웃

```
┌────────────────────────────────────────────────────┐
│   환영합니다, {회사명} {담당자명}님                  │
│                                                    │
│   담양 중대재해통합관리시스템 외부 사용자             │
│   계정이 발급되었습니다.                            │
│                                                    │
│   아이디: extco_abc1 (자동 생성됨)                  │
│                                                    │
│   첫 로그인 비밀번호를 설정해주세요.                 │
│   ┌────────────────────────────────┐               │
│   │ 비밀번호                        │               │
│   └────────────────────────────────┘               │
│   ┌────────────────────────────────┐               │
│   │ 비밀번호 확인                   │               │
│   └────────────────────────────────┘               │
│                                                    │
│   비밀번호 정책                                      │
│   ✓ 영문·숫자·특수문자 조합 8자 이상                 │
│                                                    │
│   약관 동의                                          │
│   ☐ 이용약관 동의 [내용 보기]                        │
│   ☐ 개인정보 처리방침 동의 [내용 보기]                │
│                                                    │
│   [계정 활성화]                                      │
└────────────────────────────────────────────────────┘
```

## 4. 입력 항목

| 필드 | 타입 | 필수 | 검증 |
|------|------|------|------|
| 비밀번호 | PASSWORD | ✅ | 비밀번호 정책 (AUTH04-F §7.3) |
| 비밀번호 확인 | PASSWORD | ✅ | 새 비밀번호와 일치 |
| 이용약관 동의 | CHECKBOX | ✅ | |
| 개인정보 처리방침 동의 | CHECKBOX | ✅ | |

## 5. 표시 항목

| 항목 | 데이터 소스 | 비고 |
|------|------------|------|
| 회사명 + 담당자명 | invitation_tokens JOIN users | 헤더 환영 메시지 |
| 자동 생성 아이디 | `users.local_login_id` | 사용자 확인용 (이후 로그인 시 사용) |
| 비밀번호 정책 | 정적 | AUTH04-F §7.3 동일 |
| 약관 본문 | 정적 또는 마스터 (단, 이용약관·개인정보 처리방침은 시스템 마스터 관리 권장) | [내용 보기] 모달 |

## 6. 버튼·링크 액션

| 요소 | 위치 | 액션 | 조건·비고 |
|------|------|------|---------|
| 약관 `[내용 보기]` (2개) | 본문 | 약관 전문 모달 (read-only) | |
| 비밀번호 입력 | 본문 | 실시간 정책 검증 표시 | |
| 약관 토글 | 본문 | 동의 체크 | 두 항목 모두 체크 시 [계정 활성화] 활성 |
| `[계정 활성화]` | 푸터 | 활성화 동작 (§7) | 비밀번호 + 약관 동의 모두 충족 시 활성 |

## 7. 자동 처리 로직

### 7.1 진입 시 토큰 검증

```
/invitation/:token 진입:
  1. invitation_tokens 조회 (WHERE token=:input)
  2. 토큰 유효성 검증:
     - 존재 + expires_at >= NOW() + used_at IS NULL + revoked_at IS NULL
     - 무효 → AUTH99-V (오류 코드별)
       • expired → `invitation_expired`
       • used_at → `invitation_used`
       • revoked → `invitation_used` (회수됨)
       • 미존재 → 404 또는 `invitation_expired`
  3. JOIN users → 회사명·담당자명·자동 아이디 노출
```

### 7.2 [계정 활성화] 클릭

```
검증:
  - 비밀번호 정책 충족
  - 비밀번호 확인 일치
  - 약관 동의 2개 모두 체크

저장:
  1. users UPDATE:
     - local_password_hash = bcrypt(input)
     - is_active = true
     - first_login_at = NOW()
  2. password_history INSERT (첫 비밀번호 기록)
  3. invitation_tokens.used_at = NOW()
  4. agreements INSERT (이용약관·개인정보 동의 이력 각 1건):
     - user_id, agreement_type, agreed_at, ip_address
  5. audit_logs INSERT (action='ACCOUNT_ACTIVATED')
  6. 새 세션 자동 발급 (사용자가 다시 로그인 안 해도 됨)
  7. /external/dashboard 리다이렉트 + "환영합니다" 토스트
```

### 7.3 `agreements` 테이블 (보조)

```sql
CREATE TABLE agreements (
  id              UUID PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users(id),
  agreement_type  ENUM('TERMS_OF_SERVICE', 'PRIVACY_POLICY') NOT NULL,
  version         VARCHAR(20),         -- 약관 버전 (이력 추적)
  agreed_at       TIMESTAMP NOT NULL,
  ip_address      VARCHAR(50)
);
```

## 8. 검증 규칙

| 항목 | 검증 |
|------|------|
| 토큰 | 유효한 invitation_tokens (만료·사용 안 됨·회수 안 됨) |
| 비밀번호 | 정책 충족 (AUTH04-F §7.3) |
| 비밀번호 확인 | 일치 |
| 약관 동의 | 2개 모두 체크 |

## 9. 오류 처리

| 케이스 | 메시지 | 처리 |
|--------|--------|------|
| 토큰 만료 | "초대가 만료되었습니다. 발급자에게 재발송을 요청하세요" | AUTH99-V `invitation_expired` |
| 토큰 사용됨·회수됨 | "이미 사용된 또는 회수된 초대입니다" | AUTH99-V `invitation_used` |
| 비밀번호 정책 위반 | "{위반 항목}을 충족해주세요" | 실시간 인라인 |
| 비밀번호 확인 불일치 | "비밀번호가 일치하지 않습니다" | 인라인 |
| 약관 미동의 | (버튼 비활성) | — |
| 저장 실패 | "활성화 중 오류가 발생했습니다. 다시 시도해주세요" | 토스트 + 폼 유지 |

## 10. 보안 정책

- 토큰 단일 사용 (used_at 갱신)
- 비밀번호 bcrypt 해시
- 약관 동의 시점·IP 기록
- 활성화 직후 자동 로그인 (UX 편의 — 다른 흐름과 차별점)

## 11. 관련 화면 흐름

```
외부 사용자 초대 이메일의 [계정 활성화 링크]
   → AUTH05-F (/invitation/:token)
   ↓ 토큰 검증
   ├─ 유효: 폼 노출
   │  ↓ [계정 활성화]
   │  → users 활성화 + 자동 로그인
   │  → /external/dashboard
   │
   └─ 무효: AUTH99-V (invitation_expired / invitation_used)
```

## 12. 관련 DB 테이블

- `users` (DB-001 §2.2): 비밀번호 설정 + 활성화
- `invitation_tokens` (DB-001 §2.6): 토큰 검증·소진
- `password_history` (DB-001 §2.8): 첫 비밀번호 이력
- `agreements` (본 문서 §7.3): 약관 동의 이력
- `audit_logs` (DB-001 §2.12): 활성화 감사

## 13. 관련 인터페이스

- 외부 인터페이스 없음 (자체 처리)

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. 토큰 검증 + 약관 동의 + 활성화 후 자동 로그인 |

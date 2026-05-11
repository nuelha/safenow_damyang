# AUTH06-S — 외부 사용자 관리

> 화면 ID: **AUTH06-S**
> 모듈: AUTH (통합 인증)
> SFR: SFR-015
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-015, DB-001 §2.2 users / §2.5 external_user_access / §2.6 invitation_tokens

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | AUTH06-S |
| 화면명 | 외부 사용자 관리 |
| URL | `/admin/external-users` |
| 화면 유형 | S (Settings, 관리자 전용) |
| 접근 권한 | CEO / GM / SHM |

## 2. 진입 경로

- GNB > 시스템 관리 > 외부 사용자 관리
- 새올 포틀릿 알림 (초대 회수 요청·만료 안내 등) 링크
- CON07-F에서 [외부 사용자 관리로] 링크 (선택 — 일괄 관리 시)

## 3. 레이아웃

```
┌────────────────────────────────────────────────────┐
│ 외부 사용자 관리                                     │
│                                                    │
│ 요약 카드                                            │
│ 활성 N명 | 초대대기 N명 | 만료 N명 | 회수·비활성 N명 │
│                                                    │
│ 필터: [회사명▼] [권한▼] [상태▼] [검색]              │
│                              [+ 직접 초대 발급]      │
│                                                    │
│ 회사       │담당자  │권한 │접근범위         │상태  │관리│
│ ──────────────────────────────────────────────────│
│ A건설      │김도급 │SUB  │도급계약 #2026-12 │활성  │[상세]│
│ B컨설팅    │이컨설 │CON  │자치행정과 위임   │활성  │[상세]│
│ C건설      │박과장 │SUB  │만료 (회수 가능)  │만료  │[재발송][회수]│
│ ...                                                │
│                                                    │
│ [페이지네이션]                                      │
└────────────────────────────────────────────────────┘
```

## 4. 표시 항목

### 4.1 요약 카드

| 항목 | 데이터 소스 |
|------|------------|
| 활성 | `COUNT(users WHERE auth_source='LOCAL' AND is_active=true)` |
| 초대대기 | `COUNT(invitation_tokens WHERE used_at IS NULL AND revoked_at IS NULL AND expires_at >= NOW())` |
| 만료 | `COUNT(invitation_tokens WHERE expires_at < NOW() AND used_at IS NULL AND revoked_at IS NULL)` |
| 회수·비활성 | `COUNT(users WHERE auth_source='LOCAL' AND is_active=false)` |

### 4.2 목록 컬럼

| 컬럼 | 데이터 소스 | 비고 |
|------|------------|------|
| 회사 | `users.external_company` | |
| 담당자 | `users.name + email` | |
| 권한 | `users.permission_role` 배지 | SUB / CON |
| 접근범위 | `external_user_access` 기반 산출 | 도급계약 ID / 위임 부서·관리대상 |
| 상태 | 산출 배지 (§4.3) | |
| 관리 | 상태별 액션 버튼 (§4.4) | |

### 4.3 상태 배지

| 코드 | 표시명 | 색상 | 조건 |
|------|--------|------|------|
| `ACTIVE` | 활성 | 초록 | users.is_active=true |
| `PENDING` | 초대대기 | 노랑 | invitation_tokens 유효, used_at IS NULL |
| `EXPIRED` | 만료 | 회색 | invitation_tokens.expires_at < NOW(), used_at IS NULL |
| `REVOKED` | 회수 | 빨강 | invitation_tokens.revoked_at IS NOT NULL OR users.is_active=false (회수 사유) |

### 4.4 관리 버튼 (상태별)

| 상태 | 노출 버튼 |
|------|---------|
| ACTIVE | [상세] [회수] |
| PENDING | [상세] [재발송] [회수] |
| EXPIRED | [상세] [재발송] |
| REVOKED | [상세] [재활성화] (별도 권한) |

## 5. 필터 옵션

| 필터 | 옵션 | 비고 |
|------|------|------|
| 회사명 | 전체 / external_company 자동완성 | |
| 권한 | 전체 / SUB / CON | |
| 상태 | 전체 / 활성 / 초대대기 / 만료 / 회수 | |
| 검색 | 회사명 / 담당자명 / 이메일 부분일치 | 디바운스 300ms |

## 6. 버튼·링크 액션

| 요소 | 위치 | 액션 | 조건·비고 |
|------|------|------|---------|
| `[회사명 ▼]` 필터 | 필터 바 | `external_company` 필터 | |
| `[권한 ▼]` 필터 | 필터 바 | `permission_role` 필터 | |
| `[상태 ▼]` 필터 | 필터 바 | 상태 필터 | |
| `[+ 직접 초대 발급]` | 우상단 | AUTH03-M 모달 (직접 발급 모드) | CEO/GM/SHM. 도급계약 외 컨설팅 위임 등 직접 발급 가능 |
| 행 클릭 / `[상세]` | 목록 | 사용자 상세 모달 (계정 정보·접근범위·로그인 이력) | |
| `[재발송]` | 만료·초대대기 행 | 신규 invitation_tokens 발급 + 이메일 재발송 (CON07-F §8.2 흐름) | SHM+ |
| `[회수]` | 초대대기·활성 행 | 확인 모달 → invitation_tokens 무효화 + users.is_active=false | SHM+ |
| `[재활성화]` | 회수 행 | 확인 모달 → users.is_active=true + 신규 초대 발급 | CEO/GM만 |

## 7. 자동 처리 로직

### 7.1 만료 자동 처리

```
배치 작업 (매일 00:00):
  invitation_tokens 중 expires_at < NOW() AND used_at IS NULL AND revoked_at IS NULL:
    - 상태는 자동으로 EXPIRED로 표시 (별도 DB 업데이트 없음 — 산출 로직)
    - 발급자(invitation_tokens 발급한 SHM+)에게 새올 포틀릿 알림
      "{회사명} 외부 사용자 초대가 만료되었습니다. 재발송이 필요합니다."
```

### 7.2 [재발송] 흐름

CON07-F §8.2와 동일:
1. 기존 invitation_tokens revoked_at = NOW()
2. 신규 invitation_tokens INSERT (expires_at = NOW + 7일)
3. email_queue INSERT (재발송 이메일, IF-006)
4. audit_logs INSERT

### 7.3 [회수] 흐름

CON07-F §8.3과 동일:
1. invitation_tokens.revoked_at = NOW()
2. users.is_active = false
3. 활성 세션 무효화
4. external_user_access 유지 (재활성화 시 복원)
5. audit_logs INSERT

### 7.4 [재활성화] 흐름

```
CEO/GM 확인 모달:
  "{회사명} 외부 사용자를 재활성화하시겠습니까?
   신규 초대 이메일이 발송되며, 사용자는 새 비밀번호를 설정해야 합니다."

처리:
  1. users.is_active = true
  2. local_password_hash = NULL (재설정 필요)
  3. 신규 invitation_tokens INSERT
  4. email_queue INSERT (초대 이메일 재발송)
  5. audit_logs INSERT
```

## 8. 데이터 스코프

| 권한 | 보이는 범위 |
|------|----------|
| CEO | 전체 외부 사용자 |
| GM | 본 부서의 도급계약·컨설팅 위임 관련 외부 사용자 |
| SHM | 본인이 발급한 외부 사용자 + 본 부서 관련 |

> SUB/CON 본인은 본 화면 접근 불가.

## 9. 오류 처리

| 케이스 | 메시지 | 처리 |
|--------|--------|------|
| 재발송 시 이메일 발송 실패 | "이메일 발송 실패. 잠시 후 재시도됩니다" | 토스트 + IF-006 재시도 큐 |
| 회수 권한 부족 | "회수 권한이 없습니다" | 차단 |
| 재활성화 시도 (CEO/GM 외) | "재활성화는 CEO/GM만 가능합니다" | 차단 |

## 10. 관련 화면 흐름

```
AUTH06-S
   ├─ 행 클릭 → 사용자 상세 모달
   ├─ [+ 직접 초대 발급] → AUTH03-M (직접 발급 모드)
   ├─ [재발송] → 토큰 재발급 + 이메일
   ├─ [회수] → 확인 모달 → UPDATE
   └─ [재활성화] → 확인 모달 → UPDATE + 토큰 재발급
```

## 11. 관련 DB 테이블

- `users` (DB-001 §2.2): 외부 사용자 (auth_source='LOCAL')
- `invitation_tokens` (DB-001 §2.6): 초대 토큰 + 만료·회수 관리
- `external_user_access` (DB-001 §2.5): 접근 범위 매핑
- `email_queue` (DB-001 §2.11): 재발송 이메일 큐
- `audit_logs` (DB-001 §2.12): 회수·재활성화 감사

## 12. 관련 인터페이스

- **IF-006 SMTP**: 재발송·재활성화 이메일

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성 |

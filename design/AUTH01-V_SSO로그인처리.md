# AUTH01-V — SSO 로그인 처리

> 화면 ID: **AUTH01-V**
> 모듈: AUTH (통합 인증)
> SFR: SFR-015
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-015, DB-001 §2.2 users / §2.9 permission_rules, IF-001 행정포털 SSO

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | AUTH01-V |
| 화면명 | SSO 로그인 처리 (리다이렉트·콜백) |
| URL | `/sso/login` (시작), `/sso/callback` (콜백) |
| 화면 유형 | V (View) — 처리 중 로딩 표시만, 사용자 직접 조작 화면 아님 |
| 접근 권한 | 비로그인 진입 가능 |
| 기본 진입 화면 | 내부 직원에 한해 ✅ |

## 2. 진입 경로

- 행정포털 메뉴에서 "담양 안전관리시스템" 링크 클릭
- 행정포털에서 본 시스템 `/sso/login` 으로 리다이렉트
- 본 시스템 `/sso/callback?code={auth_code}` 로 콜백 수신
- 비로그인 상태에서 보호된 URL 직접 접근 시 자동 리다이렉트

## 3. 레이아웃

```
┌────────────────────────────────────────────────────┐
│                                                    │
│                                                    │
│       담양 중대재해통합관리시스템                    │
│                                                    │
│       [로딩 인디케이터 (회전 스피너)]                │
│                                                    │
│       행정포털 인증 처리 중...                       │
│                                                    │
│                                                    │
└────────────────────────────────────────────────────┘
```

> 정상 흐름은 1-2초 내 자동 리다이렉트되어 사용자가 거의 인식 못 함. 단, 토큰 검증·사용자 정보 조회 시간이 길어질 경우 로딩 표시.

## 4. 표시 항목

| 항목 | 데이터 소스 | 비고 |
|------|------------|------|
| 시스템명 | 정적 | "담양 중대재해통합관리시스템" |
| 로딩 상태 텍스트 | 정적 | "행정포털 인증 처리 중..." |

## 5. 버튼·링크 액션

(사용자 직접 조작 없음 — 자동 처리)

## 6. 자동 처리 로직

### 6.1 전체 흐름

```
1. 사용자 → 행정포털 메뉴 클릭 (담양 안전관리시스템)
   행정포털 → 본 시스템 /sso/login 으로 리다이렉트 (인증 토큰 또는 auth_code 포함)

2. 본 시스템 /sso/callback 수신 시:
   a. auth_code 추출
   b. IF-001 §1.2 토큰 발급 API 호출:
      POST {portal}/oauth2/token
      Body: { code, client_id, client_secret, redirect_uri, grant_type='authorization_code' }
   c. access_token, refresh_token 응답 수신
   
3. 사용자 정보 조회:
   GET {portal}/userinfo
   Header: Authorization: Bearer {access_token}
   응답: IF-001 §1.3 페이로드

4. 본 시스템 users 테이블 처리:
   a. 조회: WHERE auth_source='SSO' AND external_id=:portal_user_id
   b. 존재:
      - last_login_at = NOW()
      - last_synced_at = NOW()
      - 사용자 정보 갱신 (이름·부서·직급 등 — 행정포털 동기화)
      - permission_role은 자동 덮어쓰지 않음 (담양 자체 관리)
   c. 미존재 (최초 로그인):
      - users INSERT (auth_source='SSO', source_type='PORTAL_SYNCED', external_id, ...)
      - departments 조회 (external_id 기반) → users.department_id 설정
      - 권한 자동 매핑: permission_rules 조회 (§6.2 참조)
      - audit_logs INSERT (action='SSO_FIRST_LOGIN')

5. is_active 검증:
   - false → §7 오류 케이스 'user_inactive'

6. 세션 발급:
   - HttpOnly + Secure + SameSite=Strict 쿠키
   - CSRF 토큰 발급
   - access_token / refresh_token 저장 (서버 측 세션 스토리지)

7. audit_logs INSERT (action='LOGIN_SUCCESS', ip, user_agent)

8. 권한별 대시보드 진입:
   - CEO → /dashboard/ceo
   - GM → /dashboard/manager
   - SM/SHM → /dashboard/safety
   - WKR → /dashboard/worker
   (모두 단일 진입점 /dashboard 에서 권한별 위젯 분기로 처리 가능)
```

### 6.2 권한 자동 매핑 로직

```
SELECT permission_role FROM permission_rules
WHERE portal_position = :userinfo.position
  AND is_active = true
ORDER BY priority DESC
LIMIT 1;

매핑 결과를 users.permission_role 설정
매핑 미존재 시: permission_role = 'WKR' (기본값)
              + audit_logs INSERT (action='PERMISSION_MAPPING_DEFAULT', metadata={position})
              + SHM+ 운영자에게 새올 포틀릿 알림 (system)
```

### 6.3 부서 매핑

```
SELECT id FROM departments
WHERE external_id = :userinfo.department.external_id;

매칭 부서 ID를 users.department_id 설정
매칭 미존재 시:
  - 부서 자동 INSERT (행정포털 조직도 동기화로 이미 들어와 있어야 정상)
  - 비정상 케이스: §7 'department_sync_error'
```

## 7. 오류 처리

| 코드 | 메시지 | 처리 |
|------|--------|------|
| `sso_token_invalid` | "인증이 만료되었습니다. 행정포털에서 다시 로그인해주세요" | AUTH99-V 이동 |
| `sso_api_error` | "행정포털 연결에 일시적 문제가 있습니다" | AUTH99-V + 재시도 버튼 |
| `user_inactive` | "계정이 비활성 상태입니다. 시스템 관리자에게 문의하세요" | AUTH99-V |
| `department_sync_error` | "부서 정보가 동기화되지 않았습니다. 잠시 후 다시 시도해주세요" | AUTH99-V + 자동 동기화 트리거 + 운영자 알림 |
| `permission_denied` | "접근 권한이 없습니다" | AUTH99-V |

## 8. 보안 정책

- 모든 통신 HTTPS (TLS 1.2+)
- auth_code 단일 사용 (재사용 시 검증 실패)
- state 파라미터 사용 (CSRF 방어)
- access_token / refresh_token 서버 측 저장 (클라이언트 노출 안 함)
- 세션 만료 30분 (비활성 시) — 행정포털 정책 협의 후 확정

## 9. 동시 로그인 정책

- 행정포للطل SSO 정책 따름 (협의)
- 기본: 동시 로그인 제한 없음 (행정포털 단일 토큰 발급 시 자동 제어됨)

## 10. 관련 화면 흐름

```
[행정포털 메뉴 클릭]
   ↓
AUTH01-V (/sso/login → /sso/callback)
   ↓ 정상
   → 권한별 대시보드 (DSH01-V 등)
   
   ↓ 오류
   → AUTH99-V (오류 코드별)
```

## 11. 관련 DB 테이블

- `users` (DB-001 §2.2): SSO 사용자 UPSERT
- `departments` (DB-001 §2.1): 부서 매칭
- `permission_rules` (DB-001 §2.9): 권한 자동 매핑
- `audit_logs` (DB-001 §2.12): 로그인 감사 로그

## 12. 관련 인터페이스

- **IF-001 행정포털 SSO**: 토큰 발급 + 사용자 정보 조회
- **IF-002 행정포털 조직도** (간접): users.department_id 매칭에 departments 마스터 사용

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. OAuth2 흐름 가정 — IF-001 협의 후 보강 |

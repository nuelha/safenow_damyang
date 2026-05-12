# CON07-F — 계약 STEP 4 초대+서약 (5분류 서약서 분기)

> 화면 ID: **CON07-F**
> 모듈: CON (도급관리)
> SFR: SFR-013 / SFR-015 (외부 사용자 초대)
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-013·015, DB-001 §5.5 agreement_forms / §5.6 contract_agreements / §2.6 invitation_tokens, IF-006 SMTP

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | CON07-F |
| 화면명 | 계약 STEP 4 — 초대 + 서약 |
| URL | `/contracts/:id/step4` |
| 화면 유형 | F (Form, 풀페이지) |
| 접근 권한 | SHM+ (초대 발급) / SUB (서약서 작성은 CON07-F-SUB 별도 흐름) |
| 형태 | 4-Step Wizard의 STEP 4 |

## 2. 진입 경로

- CON06-F `[다음 →]` (`approval_status='APPROVED'` 충족 후)
- CON01-D 스텝 인디케이터 [STEP 4] 클릭
- CON01-D 서약서 영역에서 초대 관리

## 3. 레이아웃 (관리자 측 — CON07-F)

```
┌──────────────────────────────────────────────────────────┐
│ ← 도급관리       [STEP 1 ●][STEP 2 ●][STEP 3 ●][STEP 4 ●]│
│                                                          │
│ 청사 시설 보수공사 — STEP 4 초대 + 서약                   │
│                                                          │
│ 적용 서약서: 공사 안전관리 서약서 (CONSTRUCTION) [보기]   │
│                                                          │
│ 선정 업체 초대                                             │
│ ─────────────────────────────────                       │
│ A건설                                                     │
│   담당자: 김도급 (kim@a.co.kr)                            │
│   초대 상태: [PENDING] 2026-04-01 발송  [재발송][회수]    │
│   서약 상태: 미완료                                       │
│                                                          │
│ B건설                                                     │
│   담당자: 미입력  [+ 초대 정보 입력]                       │
│   초대 상태: —                                            │
│                                                          │
│ ─────────────────────────────────                       │
│ [전체 초대 발송] [선택 항목 재발송]                        │
│                                                          │
│ 모든 업체 서약 완료 시 시공 시작 (status='IN_PROGRESS')     │
│                                                          │
│ [이전]                          [취소] [저장]            │
└──────────────────────────────────────────────────────────┘
```

## 4. 표시 항목

### 4.1 서약서 영역

| 항목 | 데이터 소스 |
|------|------------|
| 적용 서약서명 | `agreement_forms.title + code` (계약유형 자동 분기) |
| `[보기]` 링크 | 서약서 본문 모달 (read-only) |

### 4.2 서약서 자동 분기 (B-4)

```
계약유형(contracts.contract_type)에 따라 STEP 4 진입 시 서약서 자동 선택:
  CONSTRUCTION → agreement_forms.code = 'CONSTRUCTION_SAFETY_AGREEMENT'
  SERVICE → 'SERVICE_SAFETY_AGREEMENT'
  PURCHASE_INSTALL → 'INSTALL_SAFETY_AGREEMENT'
  CONSIGNMENT → 'CONSIGNMENT_SAFETY_AGREEMENT'
  OTHER → 'GENERAL_SAFETY_AGREEMENT'

agreement_forms 마스터:
  - title, content_html (HTML 본문)
  - required_attachments (JSON — 첨부 의무 항목)
  - signature_required (true/false)
```

### 4.3 선정 업체 초대 카드 (각 업체별)

| 항목 | 데이터 소스 |
|------|------------|
| 업체명 | JOIN `subcontractors.company_name` |
| 담당자 정보 | 초대 발급 시 입력한 담당자명·이메일 |
| 초대 상태 배지 | invitation_tokens 상태 산출 (§4.4) |
| 서약 상태 | `contract_subcontractors.signed_at` 기반 (완료/미완료) |
| 발송 일시 | `contract_subcontractors.invited_at` |
| `[재발송]` `[회수]` `[+ 초대 정보 입력]` | 상태별 노출 |

### 4.4 초대 상태 배지

| 코드 | 표시명 | 색상 | 조건 |
|------|--------|------|------|
| `PENDING` | 초대 발송 | 노랑 | invitation_tokens.expires_at >= NOW() AND used_at IS NULL |
| `ACCEPTED` | 활성 (첫 로그인 완료) | 초록 | invitation_tokens.used_at IS NOT NULL |
| `EXPIRED` | 만료 (7일 경과 + 미수락) | 회색 | invitation_tokens.expires_at < NOW() AND used_at IS NULL |
| `REVOKED` | 회수 (발급자 취소) | 빨강 | invitation_tokens.revoked_at IS NOT NULL |
| — | (미입력) | 회색 | 초대 정보 아직 입력 안 됨 |

## 5. 입력 항목 (초대 정보 입력 모달)

| 필드 | 타입 | 필수 | 비고 |
|------|------|------|------|
| 담당자 이름 | TEXT | ✅ | |
| 담당자 이메일 | EMAIL | ✅ | UNIQUE 검증 (다른 사용자와 중복 불가) |
| 담당자 연락처 | TEL | ❌ | |
| 권한 | 자동 | — | SUB (도급업체) 고정 |
| 접근 범위 | 자동 | — | 본 계약 한정 (external_user_access INSERT) |

## 6. 버튼·링크 액션

| 요소 | 위치 | 액션 | 조건·비고 |
|------|------|------|---------|
| 스텝 인디케이터 | 상단 | 현재 STEP 강조 | |
| 서약서 `[보기]` | 상단 안내 | 서약서 본문 모달 (read-only, agreement_forms.content_html) | |
| `[+ 초대 정보 입력]` | 업체 카드 (담당자 미입력) | 초대 정보 입력 모달 (AUTH03-M과 동일 패턴) | SHM+ |
| `[재발송]` | 초대 상태 | invitation_tokens 신규 발급 + 이메일 재발송 | PENDING 또는 EXPIRED |
| `[회수]` | 초대 상태 | 확인 모달 → invitation_tokens 무효화 + users.is_active=false | PENDING 시 |
| `[전체 초대 발송]` | 푸터 | 미발송 업체 일괄 초대 (담당자 정보 입력 완료된 업체만) | SHM+ |
| `[선택 항목 재발송]` | 푸터 | 체크박스 선택된 업체 재발송 | |
| `[이전]` | 푸터 좌측 | STEP 3 복귀 (read-only) | |
| `[취소]` | 푸터 | CON01-L 복귀 (alert) | |
| `[저장]` | 푸터 우측 | 현재 상태 유지 + CON01-D 이동 | |

## 7. 도급업체 측 서약서 작성 화면 (별도)

> 본 화면(CON07-F)은 관리자 측. 도급업체 담당자(SUB)는 별도 화면에서 서약서 작성.

### 7.1 도급업체 진입 흐름

```
1. 초대 이메일에서 [계정 활성화] 링크 클릭
   → AUTH05-F (첫 로그인 비밀번호 설정 + 약관 동의)
   → 자동 로그인 → /external/dashboard (SUB 사용자 대시보드)

2. 대시보드의 [서약서 작성하기] 카드 클릭
   → /external/contracts/:id/agreement 진입
```

### 7.2 도급업체 서약서 작성 레이아웃

```
┌──────────────────────────────────────────────────────────┐
│ A건설 — {사업명} 안전관리 서약서                          │
│                                                          │
│ [서약서 본문 — agreement_forms.content_html]              │
│ ...                                                      │
│                                                          │
│ 필수 첨부                                                 │
│ ● 안전보건관리계획서 [업로드]                              │
│ ● 사업자등록증 [업로드]                                   │
│ ● 안전관리자 선임 증빙 [업로드]                            │
│                                                          │
│ 전자 서명                                                 │
│ ┌──────────────────────────────────────┐                │
│ │ [서명 입력 영역]                       │                │
│ └──────────────────────────────────────┘                │
│                                                          │
│ ☐ 위 서약서 내용을 모두 확인하고 이행할 것을 서약합니다.   │
│                                                          │
│                                  [서약 + 제출]            │
└──────────────────────────────────────────────────────────┘
```

### 7.3 도급업체 측 입력 항목

| 필드 | 타입 | 필수 | 비고 |
|------|------|------|------|
| 필수 첨부 (각각) | FILE | ✅ (agreement_forms.required_attachments 기준) | PDF·이미지 |
| 전자 서명 | CANVAS / 서명 위젯 | signature_required=true 시 ✅ | base64 또는 이미지 URL |
| 동의 체크 | CHECKBOX | ✅ | |

### 7.4 도급업체 측 액션

| 요소 | 액션 |
|------|------|
| `[업로드]` (각 첨부) | 파일 업로드 → 임시 저장 |
| 서명 입력 | 마우스/터치 입력 → 서명 데이터 캡처 |
| 동의 체크 | 체크 시 [서약 + 제출] 활성화 |
| `[서약 + 제출]` | 필수 항목 검증 → 저장 동작 (§8 참조) |

## 8. 자동 처리 로직

### 8.1 관리자 측 — 초대 발급 [전체 초대 발송] / [+ 초대 정보 입력]

```
1. 입력 정보 검증 (이메일 UNIQUE 등)
2. users INSERT:
   - auth_source='LOCAL'
   - local_login_id = auto_generated (이메일 prefix + 4자리 랜덤)
   - local_password_hash = NULL (첫 로그인 시 설정)
   - source_type='LOCAL_INVITED'
   - external_company = subcontractors.company_name
   - permission_role='SUB'
   - is_active=false (첫 로그인 시 활성화)
3. invitation_tokens INSERT (token=UUID, expires_at=NOW+7일)
4. external_user_access INSERT (
     user_id, access_type='CONTRACT', reference_id=contracts.id,
     granted_by=current_user, expires_at=contracts.end_date)
5. IF-006 email_queue INSERT (template_code='invitation_email',
     변수: 회사명, 발급자, 초대 링크, 만료일)
6. contract_subcontractors.invited_at = NOW()
7. audit_logs INSERT
```

### 8.2 관리자 측 — 재발송

```
[재발송] 클릭:
  1. 기존 invitation_tokens 무효화 (revoked_at = NOW())
  2. 신규 invitation_tokens INSERT (expires_at = NOW + 7일)
  3. email_queue INSERT (재발송 이메일)
```

### 8.3 관리자 측 — 회수

```
[회수] 클릭 → 확인 모달:
  "{회사명} 초대를 회수하시겠습니까? 회수된 초대는 사용할 수 없습니다."
  
  처리:
  1. invitation_tokens.revoked_at = NOW()
  2. users.is_active = false
  3. external_user_access는 유지 (재초대 시 복원)
  4. audit_logs INSERT
```

### 8.4 도급업체 측 — [서약 + 제출] (별도 화면 §7.2)

```
필수 항목 검증:
  - 필수 첨부 모두 업로드됨
  - 전자 서명 입력됨 (signature_required=true 시)
  - 동의 체크 완료

검증 통과 시:
  1. contract_agreements INSERT (
       contract_subcontractor_id, agreement_form_id,
       signature_data, attachments JSON,
       signed_at=NOW(), signed_by_user_id=current_user,
       ip_address=request.ip)
  2. contract_subcontractors.signed_at = NOW()
  3. 새올 포틀릿 알림 (대상자: SHM+ 계약 담당자, category='contract',
     "{업체명} 서약서 제출 완료")
  4. 모든 선정 업체 서약 완료 검증:
     IF COUNT(contract_subcontractors WHERE selected=true AND signed_at IS NULL) = 0
     THEN:
       contracts.status='IN_PROGRESS' (시공 시작)
       새올 포틀릿 알림 (담당자: SHM+,
         "{사업명} 모든 도급업체 서약 완료 — 시공 시작")
  5. audit_logs INSERT
  6. SUB 사용자 화면: "서약서 제출 완료" 안내 + 대시보드 이동
```

### 8.5 모든 업체 서약 완료 시 자동 처리

```
contracts.status='IN_PROGRESS' 자동 전환 시:
  - CON01-D 스텝 인디케이터 [4. 초대] ● 표시
  - TBM 모듈 진입 가능 (도급공사인 경우)
  - 시공 진행 카드 노출 (CON01-D 개요 탭)
```

## 9. 데이터 스코프

| 권한 | 본 화면 접근 |
|------|----------|
| SHM+ | CON07-F (관리자 측 초대 발급 화면) |
| SUB | CON07-F-SUB (서약서 작성 화면 — 본인 계약만) |
| 기타 | 접근 불가 |

## 10. 검증 규칙

| 항목 | 검증 |
|------|------|
| 담당자 이메일 | 형식 검증 + 시스템 내 UNIQUE 검증 |
| 초대 발송 | 선정 업체(`selected=true`)만 대상 |
| 서약서 첨부 | agreement_forms.required_attachments 모두 업로드 필수 |
| 전자 서명 | signature_required=true일 때 필수 |
| 시공 시작 | 모든 선정 업체 signed_at IS NOT NULL일 때 자동 전환 |

## 11. 오류 처리

| 케이스 | 메시지 | 처리 |
|--------|--------|------|
| 이메일 중복 | "이미 등록된 이메일입니다. 다른 이메일을 사용하세요" | 인라인 에러 |
| 초대 만료 후 사용자가 링크 클릭 | "초대가 만료되었습니다. 발급자에게 재발송을 요청하세요" | AUTH99-V `invitation_expired` |
| 회수된 초대 사용 시도 | "회수된 초대입니다. 발급자에게 문의하세요" | AUTH99-V `invitation_used` |
| 서약서 필수 첨부 누락 | "{항목명}을(를) 첨부해주세요" | 인라인 에러 |
| 이메일 발송 실패 | "이메일 발송에 실패했습니다. 잠시 후 재시도됩니다" | 토스트 + IF-006 재시도 큐 |
| 도급업체 사용자가 다른 계약 접근 시도 | "접근 권한이 없습니다" | AUTH99-V `permission_denied` |

## 12. 관련 화면 흐름

### 12.1 관리자 측

```
CON06-F [다음 →] (APPROVED) ──→ CON07-F
                                  ↓ [+ 초대 정보 입력] → 입력 모달
                                  ↓ [전체 초대 발송]
                                      → users INSERT (auth_source='LOCAL')
                                      → invitation_tokens INSERT
                                      → 이메일 발송 (IF-006)
                                  ↓ [재발송] / [회수]
                                  ↓ 모든 업체 서약 완료 시
                                      → contracts.status='IN_PROGRESS' 자동
                                      → CON01-D 이동
```

### 12.2 도급업체 측

```
이메일 [계정 활성화 링크] ──→ AUTH05-F (첫 로그인)
                                ↓ 자동 로그인
                              /external/dashboard
                                ↓ [서약서 작성하기]
                              CON07-F-SUB (서약서 작성)
                                ↓ [서약 + 제출]
                              완료 안내 → 대시보드
```

## 13. 관련 DB 테이블

- `contracts` (DB-001 §5.1): status='IN_PROGRESS' 자동 전환
- `contract_subcontractors` (DB-001 §5.3): invited_at, signed_at
- `agreement_forms` (DB-001 §5.5): 서약서 마스터 (5분류 분기)
- `contract_agreements` (DB-001 §5.6): 서약 결과 본체
- `users` (DB-001 §2.2): 외부 사용자 INSERT (auth_source='LOCAL')
- `invitation_tokens` (DB-001 §2.6): 초대 토큰
- `external_user_access` (DB-001 §2.5): 접근 범위 매핑
- `email_queue` (DB-001 §2.11): 이메일 발송 큐
- `audit_logs` (DB-001 §2.12): 초대·회수·서약 감사

## 14. 관련 인터페이스

- **IF-006 SMTP**: 외부 사용자 초대 이메일 + 재발송 이메일 (`invitation_email` 템플릿)
- **IF-005 새올 포틀릿**: 서약 완료·시공 시작 알림 (SHM+ 대상)

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. 5분류 서약서 자동 분기 (B-4). 외부 사용자 초대 + 별도 로그인 발급 (B-2). 모든 업체 서약 완료 시 시공 자동 시작 |

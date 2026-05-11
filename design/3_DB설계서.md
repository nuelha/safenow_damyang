# 담양군 중대재해통합관리시스템 — DB설계서

> 문서 ID: DB-001
> 버전: v1.0
> 작성일: 2026-05-11
> 작성자: ㈜다온플레이스
> 관련 문서: SRS-001 (요구사항정의서), IA-001 (메뉴구조도·권한매트릭스)

---

## 0. 문서 개요

### 0.1 목적

본 문서는 담양군 중대재해통합관리시스템의 데이터베이스 설계를 정의한다. ERD, 테이블 정의서, 인덱스·제약·트리거 명세를 포함하며, 화면설계서·인터페이스정의서의 데이터 기준이 된다.

### 0.2 적용 범위

- Phase 1 핵심 테이블 (12종) — 본 문서 상세
- Phase 2/3 모듈별 테이블 — 개요 정의 (상세는 모듈별 화면설계 시점에 확장)

### 0.3 DBMS 표준

- DBMS: PostgreSQL 또는 MySQL (발주처 협의)
- 문자셋: UTF-8
- 시간대: KST (Asia/Seoul)
- ID 표준: UUID v4 (PRIMARY KEY)
- 타임스탬프 표준: TIMESTAMP WITHOUT TIME ZONE (UTC 저장, 표시 시 KST 변환)

### 0.4 명명 규칙

| 분류 | 규칙 | 예시 |
|------|------|------|
| 테이블명 | snake_case 복수형 | `targets`, `risk_assessments` |
| 컬럼명 | snake_case | `department_id`, `created_at` |
| FK 컬럼명 | `{참조테이블 단수형}_id` | `target_id`, `user_id` |
| 인덱스명 | `idx_{table}_{column}` | `idx_targets_department` |
| UNIQUE 제약명 | `uq_{table}_{column}` | `uq_users_email` |
| FK 제약명 | `fk_{table}_{column}` | `fk_targets_department` |
| ENUM 값 | UPPER_SNAKE_CASE | `RESPONSIBLE`, `IN_PROGRESS` |

---

## 1. 논리 ERD (개요)

```
┌─────────────┐
│ departments │ ← 행정포털 조직도 동기화
└─────┬───────┘
      │ 1:N
      ↓
┌─────────────┐       ┌──────────────────┐
│   targets   │←─N:M─→│ target_assignees │
└─────┬───────┘       └────────┬─────────┘
      │ 1:N                    │ N:1
      ↓                        ↓
┌──────────────────┐       ┌─────────┐
│risk_assessments  │       │  users  │←─ 행정포털 / 외부 초대
├──────────────────┤       └────┬────┘
│ contracts        │            │
│ improvements     │            │ N:M
│ inspections      │            ↓
│ compliance_...   │       ┌─────────────────────┐
│ safety_plans     │       │ external_user_access│
│ ...              │       └─────────────────────┘
└──────────────────┘

┌──────────────────┐
│  notifications   │ → 새올 포틀릿 적재 큐
└──────────────────┘

┌──────────────────┐
│  audit_logs      │ → 감사 로그
└──────────────────┘
```

---

## 2. 마스터 테이블 (Phase 1 핵심)

### 2.1 `departments` — 2단계 담당부서

**설명**: 행정포털 조직도와 동기화되는 부서 마스터. 시스템 백본.

| 컬럼 | 타입 | NULL | DEFAULT | 설명 |
|------|------|------|---------|------|
| id | UUID | NN | uuid_generate_v4() | PK |
| external_id | VARCHAR(100) | NN | — | 행정포털 부서 ID (UNIQUE) |
| name | VARCHAR(200) | NN | — | 부서명 |
| parent_id | UUID | Y | NULL | 상위 부서 ID (FK departments.id, 셀프 참조) |
| head_user_id | UUID | Y | NULL | 부서장 사용자 ID (FK users.id) |
| level | VARCHAR(20) | Y | — | 실/과/단/소/팀 |
| is_active | BOOLEAN | NN | true | 활성 여부 |
| synced_at | TIMESTAMP | Y | — | 행정포털 마지막 동기화 시각 |
| created_at | TIMESTAMP | NN | NOW() | |
| updated_at | TIMESTAMP | Y | — | |

**인덱스**
- `uq_departments_external_id` UNIQUE (external_id)
- `idx_departments_parent` (parent_id)
- `idx_departments_head` (head_user_id)

**트리거**
- `trg_departments_head_change` AFTER UPDATE OF head_user_id
  → 산하 targets의 target_assignees(role='RESPONSIBLE', source='AUTO') 자동 갱신
  → notifications INSERT (새 RESPONSIBLE 대상자에게)

---

### 2.2 `users` — 사용자 (인증 경로 분기)

**설명**: 내부 직원(SSO) + 외부 사용자(LOCAL) 통합 사용자 테이블.

| 컬럼 | 타입 | NULL | DEFAULT | 설명 |
|------|------|------|---------|------|
| id | UUID | NN | uuid_generate_v4() | PK |
| auth_source | ENUM | NN | 'SSO' | 'SSO' (행정포털) / 'LOCAL' (외부 사용자) |
| external_id | VARCHAR(100) | Y | — | 행정포털 사용자 ID (auth_source='SSO' 시 UNIQUE NOT NULL) |
| local_login_id | VARCHAR(50) | Y | — | 외부 사용자 로그인 ID (auth_source='LOCAL' 시 UNIQUE NOT NULL) |
| local_password_hash | VARCHAR(255) | Y | — | bcrypt 해시 (auth_source='LOCAL' 시) |
| source_type | ENUM | NN | 'MANUAL' | 'PORTAL_SYNCED' / 'MANUAL' / 'LOCAL_INVITED' |
| name | VARCHAR(100) | NN | — | 이름 |
| email | VARCHAR(255) | Y | — | 이메일 (UNIQUE) |
| phone | VARCHAR(20) | Y | — | 연락처 |
| department_id | UUID | Y | — | FK departments.id (SSO 사용자만 NOT NULL) |
| external_company | VARCHAR(200) | Y | — | 외부 사용자 회사명 (LOCAL 사용자) |
| position | VARCHAR(50) | Y | — | 직급 (5급/6급/팀장 등) |
| permission_role | ENUM | NN | 'WKR' | 'CEO'/'GM'/'SM'/'SHM'/'WKR'/'SUB'/'CON' |
| worker_type | VARCHAR(50) | Y | — | 'office'/'field'/'supervisor'/'safety_manager'/'etc' |
| is_active | BOOLEAN | NN | true | 활성 여부 |
| last_login_at | TIMESTAMP | Y | — | |
| last_synced_at | TIMESTAMP | Y | — | SSO 마지막 동기화 |
| login_failures | INTEGER | NN | 0 | 연속 로그인 실패 (LOCAL) |
| last_failure_at | TIMESTAMP | Y | — | |
| created_at | TIMESTAMP | NN | NOW() | |
| updated_at | TIMESTAMP | Y | — | |

**인덱스·제약**
- `uq_users_external_id` UNIQUE (external_id) WHERE auth_source='SSO'
- `uq_users_local_login` UNIQUE (local_login_id) WHERE auth_source='LOCAL'
- `uq_users_email` UNIQUE (email) — 이메일 중복 방지
- `idx_users_department` (department_id)
- `idx_users_permission` (permission_role, is_active)

**무결성 규칙 (앱 레이어 검증)**
- auth_source='SSO' → external_id NOT NULL, department_id NOT NULL
- auth_source='LOCAL' → local_login_id NOT NULL, local_password_hash NOT NULL, external_company 권장

---

### 2.3 `targets` — 3단계 관리대상

**설명**: 시스템의 작업 단위. 시설·업무·사업 통합 관리 (단일 테이블 + type ENUM).

| 컬럼 | 타입 | NULL | DEFAULT | 설명 |
|------|------|------|---------|------|
| id | UUID | NN | uuid_generate_v4() | PK |
| department_id | UUID | NN | — | FK departments.id |
| name | VARCHAR(200) | NN | — | 관리대상명 |
| target_type | ENUM | NN | — | 'FACILITY' / 'TASK' / 'BUSINESS' |
| description | TEXT | Y | — | 설명 (복합시설 등 추가 정보) |
| cdpa_category | ENUM | Y | — | 'PUBLIC_USE'/'RAW_MATERIAL'/'PUBLIC_TRANSPORT' (FACILITY일 때 NOT NULL) |
| facility_grade | ENUM | Y | — | 'GRADE_1'/'GRADE_2'/'GRADE_3' (FACILITY일 때 NOT NULL) |
| fms_id | VARCHAR(100) | Y | — | FMS 연동키 (FACILITY 한정, UNIQUE) |
| address | TEXT | Y | — | 주소 (FACILITY 한정) |
| status | ENUM | NN | 'ACTIVE' | 'ACTIVE'/'INACTIVE'/'PENDING' |
| created_at | TIMESTAMP | NN | NOW() | |
| updated_at | TIMESTAMP | Y | — | |

**인덱스**
- `idx_targets_department` (department_id)
- `idx_targets_type` (target_type, cdpa_category)
- `idx_targets_fms` (fms_id) WHERE fms_id IS NOT NULL

**트리거**
- `trg_targets_insert` AFTER INSERT
  → 해당 부서의 head_user_id 조회 → target_assignees INSERT (role='RESPONSIBLE', source='AUTO')
  → notifications INSERT (대상자: 부서장)

**무결성 규칙 (앱 레이어)**
- target_type='FACILITY' → cdpa_category, facility_grade NOT NULL
- target_type IN ('TASK','BUSINESS') → 시설 전용 필드 NULL 허용

---

### 2.4 `target_assignees` — 담당자 매핑 (N:M)

**설명**: 관리대상 ↔ 사용자 N:M 매핑. 역할 단위.

| 컬럼 | 타입 | NULL | DEFAULT | 설명 |
|------|------|------|---------|------|
| id | UUID | NN | uuid_generate_v4() | PK |
| target_id | UUID | NN | — | FK targets.id ON DELETE CASCADE |
| user_id | UUID | NN | — | FK users.id |
| role | ENUM | NN | — | 'RESPONSIBLE'/'SAFETY_MGR'/'HEALTH_MGR'/'SUPERVISOR'/'HEALTH_DOCTOR'/'WORKER' |
| is_primary | BOOLEAN | NN | false | 동일 역할 복수 시 주담당 |
| source | ENUM | NN | 'MANUAL' | 'AUTO' (부서장 자동 매핑) / 'MANUAL' (직접 지정) |
| appointed_at | DATE | Y | — | 선임일 |
| created_at | TIMESTAMP | NN | NOW() | |

**인덱스·제약**
- `uq_assignees_target_user_role` UNIQUE (target_id, user_id, role)
- `idx_assignees_target_role` (target_id, role)
- `idx_assignees_user` (user_id)

---

### 2.5 `external_user_access` — 외부 사용자 접근 범위

**설명**: SUB(도급)/CON(컨설팅) 사용자가 어떤 계약·부서에 접근 가능한지 매핑.

| 컬럼 | 타입 | NULL | DEFAULT | 설명 |
|------|------|------|---------|------|
| id | UUID | NN | uuid_generate_v4() | PK |
| user_id | UUID | NN | — | FK users.id ON DELETE CASCADE |
| access_type | ENUM | NN | — | 'CONTRACT' / 'CONSULTING' |
| reference_id | UUID | NN | — | contracts.id 또는 consulting_assignments.id |
| granted_by | UUID | NN | — | FK users.id (초대 발급자) |
| granted_at | TIMESTAMP | NN | NOW() | |
| expires_at | TIMESTAMP | Y | — | 계약 종료일 등 |

**인덱스**
- `idx_eua_user` (user_id)
- `idx_eua_reference` (access_type, reference_id)

---

### 2.6 `invitation_tokens` — 외부 사용자 초대 토큰

**설명**: 외부 사용자 초대 이메일 링크의 토큰 관리.

| 컬럼 | 타입 | NULL | DEFAULT | 설명 |
|------|------|------|---------|------|
| id | UUID | NN | uuid_generate_v4() | PK |
| user_id | UUID | NN | — | FK users.id |
| token | UUID | NN | — | 초대 토큰 (URL에 노출) |
| expires_at | TIMESTAMP | NN | — | 만료 시각 (발급 + 7일) |
| used_at | TIMESTAMP | Y | — | 사용 완료 시각 |
| revoked_at | TIMESTAMP | Y | — | 회수 시각 |
| created_at | TIMESTAMP | NN | NOW() | |

**인덱스**
- `uq_invitation_token` UNIQUE (token)
- `idx_invitation_user` (user_id)

---

### 2.7 `password_reset_tokens` — 비밀번호 재설정 토큰

**설명**: 외부 사용자 비밀번호 재설정 링크 토큰.

| 컬럼 | 타입 | NULL | DEFAULT | 설명 |
|------|------|------|---------|------|
| id | UUID | NN | uuid_generate_v4() | PK |
| user_id | UUID | NN | — | FK users.id |
| token | UUID | NN | — | UNIQUE |
| expires_at | TIMESTAMP | NN | — | 만료 (발급 + 1h) |
| used_at | TIMESTAMP | Y | — | |
| created_at | TIMESTAMP | NN | NOW() | |

---

### 2.8 `password_history` — 비밀번호 이력

**설명**: 외부 사용자 비밀번호 재사용 방지 (최근 3건).

| 컬럼 | 타입 | NULL | DEFAULT | 설명 |
|------|------|------|---------|------|
| id | UUID | NN | uuid_generate_v4() | PK |
| user_id | UUID | NN | — | FK users.id |
| password_hash | VARCHAR(255) | NN | — | |
| created_at | TIMESTAMP | NN | NOW() | |

**인덱스**
- `idx_password_history_user` (user_id, created_at DESC)

---

### 2.9 `permission_rules` — 권한 자동 매핑 규칙

**설명**: 행정포털 직급 → 시스템 권한 자동 매핑 마스터.

| 컬럼 | 타입 | NULL | DEFAULT | 설명 |
|------|------|------|---------|------|
| id | UUID | NN | uuid_generate_v4() | PK |
| portal_position | VARCHAR(50) | NN | — | 행정포털 직급/직위 |
| permission_role | ENUM | NN | — | 매핑되는 권한 코드 |
| priority | INTEGER | NN | 0 | 우선순위 |
| is_active | BOOLEAN | NN | true | |

**초기 셋업 (예시)**

| portal_position | permission_role | 비고 |
|----------------|----------------|------|
| 군수 | CEO | |
| 부군수 | CEO | |
| 실장 / 과장 / 단장 / 소장 | GM | |
| 팀장 | SM | |
| 안전보건담당 주무관 | SHM | 직무 코드 기준 |
| 그 외 주무관·근로자 | WKR | 기본값 |

---

### 2.10 `notifications` — 알림

**설명**: 새올 포틀릿 적재 큐 + 시스템 내 알림 내역.

| 컬럼 | 타입 | NULL | DEFAULT | 설명 |
|------|------|------|---------|------|
| id | UUID | NN | uuid_generate_v4() | PK |
| recipient_user_id | UUID | NN | — | FK users.id |
| category | ENUM | NN | — | 'approval'/'assignment'/'compliance'/'inspection'/'risk'/'opinion'/'contract'/'system' |
| title | VARCHAR(200) | NN | — | 알림 제목 |
| body | TEXT | Y | — | 알림 본문 |
| link_url | VARCHAR(500) | Y | — | 클릭 이동 URL |
| reference_type | VARCHAR(50) | Y | — | 출처 모듈 |
| reference_id | UUID | Y | — | 출처 레코드 ID |
| status | ENUM | NN | 'NEW' | 'NEW'/'SENT'/'FAILED'/'RETRY'/'IGNORED' |
| sent_at | TIMESTAMP | Y | — | 새올/이메일 적재 성공 시각 |
| error_message | TEXT | Y | — | |
| retry_count | INTEGER | NN | 0 | |
| read_at | TIMESTAMP | Y | — | 본 시스템 읽음 시각 |
| created_at | TIMESTAMP | NN | NOW() | |

**인덱스**
- `idx_notifications_recipient` (recipient_user_id, created_at DESC)
- `idx_notifications_status` (status, retry_count)
- `idx_notifications_reference` (reference_type, reference_id)

---

### 2.11 `email_queue` — 외부 사용자 이메일 발송 큐

**설명**: 외부 사용자(LOCAL) 이메일 발송 비동기 큐.

| 컬럼 | 타입 | NULL | DEFAULT | 설명 |
|------|------|------|---------|------|
| id | UUID | NN | uuid_generate_v4() | PK |
| recipient_email | VARCHAR(255) | NN | — | |
| recipient_user_id | UUID | Y | — | FK users.id |
| template_code | VARCHAR(50) | NN | — | 'invitation_email'/'password_reset'/... |
| template_data | JSON | NN | — | 템플릿 변수 |
| subject | VARCHAR(200) | NN | — | 렌더링된 제목 |
| body_html | TEXT | NN | — | 렌더링된 본문 |
| status | ENUM | NN | 'NEW' | |
| sent_at | TIMESTAMP | Y | — | |
| error_message | TEXT | Y | — | |
| retry_count | INTEGER | NN | 0 | |
| created_at | TIMESTAMP | NN | NOW() | |

---

### 2.12 `audit_logs` — 감사 로그

**설명**: 보안·규정 준수 감사 이력.

| 컬럼 | 타입 | NULL | DEFAULT | 설명 |
|------|------|------|---------|------|
| id | UUID | NN | uuid_generate_v4() | PK |
| user_id | UUID | Y | — | 액션 수행자 (FK users.id) |
| action | VARCHAR(50) | NN | — | 'LOGIN_SUCCESS'/'LOGIN_FAIL'/'PERMISSION_CHANGE'/'DATA_CHANGE'/... |
| target_type | VARCHAR(50) | Y | — | 대상 entity 종류 (예: 'users', 'targets') |
| target_id | UUID | Y | — | 대상 레코드 ID |
| ip_address | VARCHAR(50) | Y | — | |
| user_agent | TEXT | Y | — | |
| before_data | JSON | Y | — | 변경 전 |
| after_data | JSON | Y | — | 변경 후 |
| metadata | JSON | Y | — | 추가 정보 |
| created_at | TIMESTAMP | NN | NOW() | |

**인덱스**
- `idx_audit_user` (user_id, created_at DESC)
- `idx_audit_action` (action, created_at DESC)
- `idx_audit_target` (target_type, target_id)

---

## 3. 동기화 이력 테이블

### 3.1 `sync_logs` — 행정포털 조직도 동기화 이력

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| id | UUID | NN | PK |
| sync_type | ENUM | NN | 'PORTAL_ORG'/'FMS'/'EHOJO' |
| started_at | TIMESTAMP | NN | |
| finished_at | TIMESTAMP | Y | |
| result | ENUM | NN | 'SUCCESS'/'FAILED'/'IN_PROGRESS' |
| dept_added | INTEGER | NN DEFAULT 0 | |
| dept_updated | INTEGER | NN DEFAULT 0 | |
| user_added | INTEGER | NN DEFAULT 0 | |
| user_updated | INTEGER | NN DEFAULT 0 | |
| head_changed | INTEGER | NN DEFAULT 0 | 부서장 변경 수 |
| error_message | TEXT | Y | |
| log_detail | JSON | Y | 변경 상세 |

### 3.2 `fms_sync_logs` — FMS 동기화 이력

`sync_logs`와 유사 구조. FMS 전용.

---

## 4. 위험성평가 (SFR-007 RSK)

### 4.1 `risk_assessments`

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| id | UUID | NN | PK |
| target_id | UUID | NN | FK targets.id (PRC 폐기 — 직접 FK) |
| name | VARCHAR(200) | NN | |
| assessment_type | ENUM | NN | 'initial'/'regular'/'special' |
| confirmation_label | VARCHAR(20) | Y | "최초" / "수시" (시행확인 라벨) |
| method | VARCHAR(50) | Y | '4M'/'KRAS'/'CHECKLIST'/... |
| trigger_type | VARCHAR(50) | Y | 수시 평가 트리거 (사고/민원/...) |
| trigger_description | TEXT | Y | |
| start_date | DATE | NN | |
| end_date | DATE | NN | |
| owner_user_id | UUID | NN | FK users.id |
| participants | JSON | Y | 참여자 user_id 배열 |
| cycle_stage | ENUM | NN | 'PREPARING'/'IN_PROGRESS'/'DONE' |
| approval_status | ENUM | NN | 'NOT_REQUESTED'/'REQUESTED'/'APPROVED'/'REJECTED' |
| approval_requested_at | TIMESTAMP | Y | |
| approval_completed_at | TIMESTAMP | Y | |
| approver_name | VARCHAR(100) | Y | 온나라 결재자 수동 입력 |
| approval_doc_url | VARCHAR(500) | Y | |
| source | ENUM | NN | 'MANUAL'/'EHOJO_AUTO'/'INITIAL_AUTO'/'REGULAR_AUTO' |
| source_contract_id | UUID | Y | FK contracts.id (e호조 자동 생성 시) |
| created_at | TIMESTAMP | NN | |
| updated_at | TIMESTAMP | Y | |

**인덱스**
- `idx_assess_target` (target_id, assessment_type)
- `idx_assess_cycle` (cycle_stage)

### 4.2 `risk_factors`

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| id | UUID | NN | PK |
| assessment_id | UUID | NN | FK risk_assessments.id ON DELETE CASCADE |
| target_id | UUID | NN | FK targets.id (redundant, 통계 단순화용) |
| sort_order | INTEGER | NN | |
| step_or_zone_name | VARCHAR(100) | Y | 단계/구역 자유 메모 (PRC 폐기 영향) |
| description | TEXT | NN | 위험요인 |
| frequency | INTEGER | Y | 빈도 1~5 |
| severity | INTEGER | Y | 강도 1~5 |
| risk_score | INTEGER | Y | GENERATED ALWAYS AS (frequency * severity) |
| is_acceptable | BOOLEAN | Y | ○ 허용 / ✕ 불허 |
| control_measure | TEXT | Y | 감소대책 |
| factor_stage | ENUM | NN | 'identified'/'estimated'/'evaluated'/'controlled' |
| created_at | TIMESTAMP | NN | |

**인덱스**
- `idx_factor_assessment` (assessment_id)
- `idx_factor_target` (target_id)

### 4.3 `risk_assessment_intervals` — 정기 평가 주기 마스터

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| id | UUID | NN | PK |
| target_type | ENUM | NN | |
| cdpa_category | ENUM | Y | |
| interval_months | INTEGER | NN | 정기 평가 주기 (개월) |
| is_active | BOOLEAN | NN DEFAULT true | |

---

## 5. 도급관리 (SFR-013 CON)

### 5.1 `contracts`

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| id | UUID | NN | PK |
| target_id | UUID | NN | FK targets.id |
| contract_type | ENUM | NN | 'CONSTRUCTION'/'SERVICE'/'PURCHASE_INSTALL'/'CONSIGNMENT'/'OTHER' |
| name | VARCHAR(200) | NN | |
| start_date | DATE | NN | |
| end_date | DATE | NN | |
| budget | BIGINT | Y | |
| funder_department | VARCHAR(200) | Y | 발주처 |
| description | TEXT | Y | |
| step | INTEGER | NN DEFAULT 1 | 1·2·3·4 |
| status | ENUM | NN | 'DRAFT'/'EVALUATING'/'APPROVAL_REQUESTED'/'APPROVED'/'REJECTED'/'IN_PROGRESS'/'COMPLETED'/'BLOCKED' |
| source | ENUM | NN DEFAULT 'MANUAL' | 'MANUAL'/'EHOJO_AUTO' |
| ehojo_contract_no | VARCHAR(100) | Y | UNIQUE WHERE NOT NULL |
| approval_requested_at | TIMESTAMP | Y | |
| approval_completed_at | TIMESTAMP | Y | |
| approver_name | VARCHAR(100) | Y | |
| approval_doc_url | VARCHAR(500) | Y | |
| approval_result | ENUM | Y | 'APPROVED'/'REJECTED' |
| default_evaluator_id | UUID | Y | FK users.id |
| created_by | UUID | NN | FK users.id |
| created_at | TIMESTAMP | NN | |
| updated_at | TIMESTAMP | Y | |

### 5.2 `subcontractors` — 수급업체 마스터

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| id | UUID | NN | PK |
| company_name | VARCHAR(200) | NN | |
| business_number | VARCHAR(20) | Y | UNIQUE |
| ceo_name | VARCHAR(100) | Y | |
| industry | VARCHAR(50) | Y | 건설/설비/전기/운송/청소·시설관리/기타 |
| address | TEXT | Y | |
| contact_phone | VARCHAR(20) | Y | |
| is_active | BOOLEAN | NN DEFAULT true | |

### 5.3 `contract_subcontractors` — 계약 ↔ 수급업체

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| id | UUID | NN | PK |
| contract_id | UUID | NN | FK contracts.id ON DELETE CASCADE |
| subcontractor_id | UUID | NN | FK subcontractors.id |
| evaluator_id | UUID | Y | FK users.id |
| evaluation_form_id | UUID | Y | FK evaluation_forms.id |
| evaluation_status | ENUM | NN DEFAULT 'PENDING' | 'PENDING'/'IN_PROGRESS'/'DONE' |
| evaluation_score | INTEGER | Y | |
| evaluation_result | ENUM | Y | 'QUALIFIED'/'UNQUALIFIED' |
| management_plan_url | VARCHAR(500) | Y | |
| selected | BOOLEAN | NN DEFAULT false | |
| invited_at | TIMESTAMP | Y | |
| signed_at | TIMESTAMP | Y | |

**제약**
- `uq_cs_contract_sub` UNIQUE (contract_id, subcontractor_id)

### 5.4 `evaluation_forms` — 평가서 마스터

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| id | UUID | NN | PK |
| code | VARCHAR(50) | NN | UNIQUE |
| contract_type | ENUM | NN | 5분류 매칭 |
| title | VARCHAR(200) | NN | |
| items | JSON | NN | 평가 항목 배열 |
| max_score | INTEGER | NN | |
| pass_score | INTEGER | NN | 적격 기준 |
| is_active | BOOLEAN | NN DEFAULT true | |

### 5.5 `agreement_forms` — 서약서 마스터

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| id | UUID | NN | PK |
| code | VARCHAR(50) | NN | UNIQUE |
| contract_type | ENUM | NN | 5분류 매칭 |
| title | VARCHAR(200) | NN | |
| content_html | TEXT | NN | |
| required_attachments | JSON | Y | 첨부 의무 항목 |
| signature_required | BOOLEAN | NN DEFAULT true | |
| is_active | BOOLEAN | NN DEFAULT true | |

### 5.6 `contract_agreements` — 도급업체 서약 결과

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| id | UUID | NN | PK |
| contract_subcontractor_id | UUID | NN | FK ON DELETE CASCADE |
| agreement_form_id | UUID | NN | FK |
| signature_data | TEXT | NN | base64 또는 서명 이미지 URL |
| attachments | JSON | Y | |
| signed_at | TIMESTAMP | NN | |
| signed_by_user_id | UUID | NN | FK users.id |
| ip_address | VARCHAR(50) | Y | |

### 5.7 `tbm_records` — TBM (도급공사에만 — B-1)

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| id | UUID | NN | PK |
| contract_id | UUID | NN | FK contracts.id |
| subcontractor_id | UUID | Y | FK |
| work_name | VARCHAR(200) | NN | 작업명 (PRC 대체) |
| work_date | DATE | NN | |
| participants | JSON | Y | 참석자 목록 |
| hazards | JSON | Y | 위험요인 (RSK에서 자동) |
| safety_actions | JSON | Y | 안전조치 |
| created_by | UUID | NN | FK users.id |
| created_at | TIMESTAMP | NN | |

---

## 6. 전담인력 (SFR-006 ORG 보조)

### 6.1 `dedicated_personnel` — 부서 단위 법정 인원

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| id | UUID | NN | PK |
| department_id | UUID | NN | FK departments.id (사업장 → 부서) |
| role_type | VARCHAR(50) | NN | 'SAFETY_MGR'/'HEALTH_MGR'/'HEALTH_DOCTOR'/'SUPERVISOR' |
| required_count | INTEGER | NN | 법정 필요 수 |
| user_id | UUID | Y | FK users.id (선임된 사용자) |
| appointed_at | DATE | Y | |
| appointment_doc_url | VARCHAR(500) | Y | 선임공문 |
| created_at | TIMESTAMP | NN | |

### 6.2 `user_qualifications` — 사용자 자격증

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| id | UUID | NN | PK |
| user_id | UUID | NN | FK users.id |
| qualification_name | VARCHAR(200) | NN | |
| qualification_type | VARCHAR(50) | Y | '국가기술'/'국가전문'/'민간'/'기타' |
| acquired_date | DATE | Y | |
| expires_at | DATE | Y | NULL이면 만료 없음 |
| certificate_url | VARCHAR(500) | Y | |

### 6.3 `warnings` — 경고 이력 (자격 미보유 강제 선임 등)

| 컬럼 | 타입 | NULL | 설명 |
|------|------|------|------|
| id | UUID | NN | PK |
| warning_type | VARCHAR(50) | NN | 'unqualified_appointment'/... |
| user_id | UUID | Y | FK users.id (대상) |
| role_type | VARCHAR(50) | Y | |
| created_by | UUID | NN | FK users.id (조치자) |
| metadata | JSON | Y | |
| created_at | TIMESTAMP | NN | |

---

## 7. Phase 2/3 테이블 (개요)

> 모듈별 화면설계 진행 시 상세 정의 확장.

| 모듈 | 주요 테이블 | SFR |
|------|----------|-----|
| IMP (개선조치) | improvements, improvement_executions | 003 |
| PLN (안전계획) | safety_plans, plan_items | 004 |
| POL (안전경영방침) | policies, policy_kpis, policy_inspections | 005 |
| BGT (예산) | budgets, budget_items, budget_executions | 008 |
| EVL (인력평가) | evaluations, evaluation_items | 009 |
| OPN (의견청취) | opinions, opinion_processings, council_agenda | 011/019 |
| INS (안전점검) | inspections, inspection_items | 012 |
| CMP (이행관리) | compliance_schedules, compliance_tasks, compliance_executions, legal_references | 014 |
| DOC (업무문서) | documents, document_versions | 012 |
| STA (통계) | (집계 뷰) | 018 |
| CRT (제증명) | certificates, certificate_templates | 021 |

---

## 8. ENUM 값 정의 종합

### 8.1 사용자 관련

| ENUM | 값 | 사용 |
|------|---|------|
| `auth_source` | SSO, LOCAL | users |
| `source_type` (user) | PORTAL_SYNCED, MANUAL, LOCAL_INVITED | users |
| `permission_role` | CEO, GM, SM, SHM, WKR, SUB, CON | users |
| `worker_type` | office, field, supervisor, safety_manager, etc | users |

### 8.2 관리대상 관련

| ENUM | 값 | 사용 |
|------|---|------|
| `target_type` | FACILITY, TASK, BUSINESS | targets |
| `cdpa_category` | PUBLIC_USE, RAW_MATERIAL, PUBLIC_TRANSPORT | targets |
| `facility_grade` | GRADE_1, GRADE_2, GRADE_3 | targets |
| `target_status` | ACTIVE, INACTIVE, PENDING | targets |
| `assignee_role` | RESPONSIBLE, SAFETY_MGR, HEALTH_MGR, SUPERVISOR, HEALTH_DOCTOR, WORKER | target_assignees |
| `source` (assignee) | AUTO, MANUAL | target_assignees |

### 8.3 위험성평가 관련

| ENUM | 값 | 사용 |
|------|---|------|
| `assessment_type` | initial, regular, special | risk_assessments |
| `cycle_stage` | PREPARING, IN_PROGRESS, DONE | risk_assessments |
| `approval_status` | NOT_REQUESTED, REQUESTED, APPROVED, REJECTED | risk_assessments, contracts |
| `factor_stage` | identified, estimated, evaluated, controlled | risk_factors |

### 8.4 도급관리 관련

| ENUM | 값 | 사용 |
|------|---|------|
| `contract_type` | CONSTRUCTION, SERVICE, PURCHASE_INSTALL, CONSIGNMENT, OTHER | contracts, evaluation_forms, agreement_forms |
| `contract_status` | DRAFT, EVALUATING, APPROVAL_REQUESTED, APPROVED, REJECTED, IN_PROGRESS, COMPLETED, BLOCKED | contracts |
| `evaluation_status` | PENDING, IN_PROGRESS, DONE | contract_subcontractors |
| `evaluation_result` | QUALIFIED, UNQUALIFIED | contract_subcontractors |

### 8.5 알림 관련

| ENUM | 값 | 사용 |
|------|---|------|
| `notification_category` | approval, assignment, compliance, inspection, risk, opinion, contract, system | notifications |
| `notification_status` | NEW, SENT, FAILED, RETRY, IGNORED | notifications, email_queue |
| `access_type` | CONTRACT, CONSULTING | external_user_access |
| `sync_type` | PORTAL_ORG, FMS, EHOJO | sync_logs |
| `sync_result` | SUCCESS, FAILED, IN_PROGRESS | sync_logs |

---

## 9. 트리거·자동 처리 로직 종합

### 9.1 부서장 자동 매핑 (SFR-006)

```
TRIGGER trg_departments_head_change
AFTER UPDATE OF head_user_id ON departments
FOR EACH ROW:
  IF OLD.head_user_id != NEW.head_user_id THEN
    -- 산하 모든 targets의 RESPONSIBLE(AUTO) 갱신
    UPDATE target_assignees
    SET user_id = NEW.head_user_id
    WHERE target_id IN (SELECT id FROM targets WHERE department_id = NEW.id)
      AND role = 'RESPONSIBLE'
      AND source = 'AUTO';
    
    -- 매핑이 없는 targets에 신규 INSERT
    INSERT INTO target_assignees (target_id, user_id, role, source, appointed_at)
    SELECT t.id, NEW.head_user_id, 'RESPONSIBLE', 'AUTO', CURRENT_DATE
    FROM targets t
    WHERE t.department_id = NEW.id
      AND NOT EXISTS (
        SELECT 1 FROM target_assignees ta
        WHERE ta.target_id = t.id AND ta.role = 'RESPONSIBLE'
      );
    
    -- 알림 생성
    INSERT INTO notifications (recipient_user_id, category, title, ...);
END;
```

### 9.2 관리대상 등록 시 RESPONSIBLE 자동 매핑

```
TRIGGER trg_targets_insert
AFTER INSERT ON targets
FOR EACH ROW:
  DECLARE head_id UUID;
  SELECT head_user_id INTO head_id FROM departments WHERE id = NEW.department_id;
  
  IF head_id IS NOT NULL THEN
    INSERT INTO target_assignees (target_id, user_id, role, source, appointed_at)
    VALUES (NEW.id, head_id, 'RESPONSIBLE', 'AUTO', CURRENT_DATE);
    
    -- 알림 생성
    INSERT INTO notifications (recipient_user_id, category, title, link_url, ...)
    VALUES (head_id, 'assignment', NEW.name || '의 관리책임자로 자동 지정되었습니다', ...);
  END IF;
END;
```

### 9.3 위험요인 불허(불허용) → 개선조치 자동 생성

```
TRIGGER trg_risk_factor_unacceptable
AFTER UPDATE OF is_acceptable, control_measure ON risk_factors
FOR EACH ROW:
  IF NEW.is_acceptable = false AND NEW.control_measure IS NOT NULL THEN
    INSERT INTO improvements (source_type, source_id, target_id, description, status, ...)
    VALUES ('risk_assessment', NEW.id, NEW.target_id, NEW.description, 'PENDING', ...);
  END IF;
END;
```

### 9.4 정기 평가 자동 생성 배치 (00:00 일일)

```
FOR EACH target IN targets WHERE status='ACTIVE':
  interval = risk_assessment_intervals.SELECT(target.target_type, target.cdpa_category)
  last_done = MAX(risk_assessments.end_date 
                  WHERE target_id=target.id AND assessment_type='regular' AND cycle_stage='DONE')
  next_due = COALESCE(last_done, target.created_at) + interval
  
  IF next_due <= NOW() + INTERVAL '30 days'
    AND NOT EXISTS (해당 target에 미완료 정기 평가) THEN
    INSERT INTO risk_assessments (...) → cycle_stage='PREPARING', source='REGULAR_AUTO'
    INSERT INTO notifications (...)
  END IF;
END FOR;
```

### 9.5 차세대 e호조 동기화 (일일 06:00)

```
호출: 차세대 e호조 API → 신규/변경 계약 조회
FOR EACH 신규 계약:
  contracts INSERT (source='EHOJO_AUTO', status='DRAFT', step=1)
  IF contract_type='CONSTRUCTION' AND 자동 생성 설정 ON THEN
    risk_assessments INSERT (source='EHOJO_AUTO', source_contract_id=contracts.id)
    notifications INSERT (대상자: 담당자)
  END IF;
END FOR;
INSERT INTO sync_logs (...);
```

---

## 10. 인덱싱 전략

### 10.1 핵심 인덱스 (성능 영향 큰)

| 테이블 | 인덱스 | 용도 |
|--------|--------|------|
| users | (auth_source, external_id) | SSO 로그인 사용자 조회 |
| users | (department_id, permission_role) | 부서별 권한자 조회 |
| targets | (department_id) | 부서별 관리대상 목록 |
| targets | (target_type, cdpa_category) | 대시보드 통계 |
| target_assignees | (target_id, role) | 관리대상 담당자 목록 |
| target_assignees | (user_id) | 사용자의 담당 관리대상 목록 |
| risk_assessments | (target_id, assessment_type) | 관리대상 평가 이력 |
| contracts | (target_id) | 관리대상별 계약 |
| contracts | (status, step) | 진행 단계별 계약 |
| notifications | (recipient_user_id, created_at DESC) | 사용자 알림 목록 |
| audit_logs | (user_id, created_at DESC) | 사용자 감사 이력 |

### 10.2 파티셔닝 권장

| 테이블 | 파티션 키 | 보존 정책 |
|--------|---------|----------|
| audit_logs | created_at (월별) | 5년 |
| notifications | created_at (월별) | 1년 |
| email_queue | created_at (월별) | 6개월 |
| sync_logs | started_at (월별) | 1년 |

---

## 11. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|---------|
| v1.0 | 2026-05-11 | 초안 작성. Phase 1 12개 핵심 테이블 + 위험성평가·도급관리·전담인력 테이블. 트리거·자동 처리 로직 정의. ENUM 값 종합. Phase 2/3 모듈 개요만 표기 |

---

> 다음 산출물: **인터페이스정의서**, **화면설계서** (화면 단위), **요구사항추적매트릭스(RTM)**

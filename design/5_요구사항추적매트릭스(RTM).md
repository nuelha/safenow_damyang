# 담양군 중대재해통합관리시스템 — 요구사항추적매트릭스(RTM)

> 문서 ID: RTM-001
> 버전: **v1.1**
> 작성일: 2026-05-12
> 작성자: ㈜다온플레이스
> 관련 문서: SRS-001(요구사항정의서) / IA-001(메뉴구조도) / DB-001(DB설계서) / IF-001(인터페이스정의서) / 화면설계서 91개

---

## 0. 문서 개요

### 0.1 목적

본 문서는 담양군 중대재해통합관리시스템의 요구사항·설계·구현 산출물 간 추적성을 보장한다. SFR(시스템 기능 요구사항)부터 화면·DB 테이블·외부 인터페이스·비기능 요구사항·결정사항까지의 매핑을 매트릭스로 정리하여:

- **추적성 확보**: 각 요구사항이 어떤 산출물에서 구현되는지 추적
- **누락 방지**: 요구사항-구현 간 갭 식별
- **변경 영향도 분석**: 요구사항 변경 시 영향받는 산출물 식별
- **테스트 커버리지**: 테스트 케이스 작성 기준 제공

### 0.2 범위

- Phase 1 (★★★) 6개 SFR + 화면설계서 40개 — 완전 매핑
- Phase 2 (★★) 8개 SFR + 화면설계서 31개 — 완전 매핑
- Phase 3 (★) 6개 SFR + 화면설계서 20개 — 완전 매핑
- 공통 SFR-001 + 비기능 — 전 화면 적용
- **합계**: 21개 SFR / 91개 화면

### 0.3 추적 단위

| 추적 항목 | 단위 | 참조 문서 |
|---------|------|---------|
| 기능 요구사항 | SFR ID (001~021) | SRS-001 §3 |
| 비기능 요구사항 | NFR 카테고리 (성능/보안/접근성/...) | SRS-001 §4 |
| 화면 | 화면 ID ({모듈}{번호}-{유형}) | 화면설계서 + IA-001 §4 |
| DB 테이블 | 테이블명 | DB-001 §2~§7 |
| 인터페이스 | IF ID (001~006) | IF-001 |
| 결정사항 | 결정 # (1~23) | SRS-001 §7 |

---

## 1. SFR ↔ 화면 매트릭스 (전체 91개 화면)

### 1.1 ★★★ 우선순위 (Phase 1) — 40개 화면

| SFR | SFR명 | 주 화면 | 보조·관련 화면 |
|-----|-------|--------|------------|
| SFR-002 | 관리대상 관리 | TGT01-V, TGT02-D, TGT02-F | TGT03-M, TGT04-S |
| SFR-006 | 전담조직 관리 | ORG01-V, ORG02-L, ORG02-D, ORG03-V | ORG02-M, ORG02-M2, ORG03-M, ORG04-S |
| SFR-007 | 유해·위험요인 업무절차 수립·점검 | RSK01-V, RSK02-L, RSK02-D, RSK02-F | RSK03-L, RSK04-S |
| SFR-013 | 도급·용역·위탁 안전보건 점검 | CON01-L, CON01-D | CON02-L, CON03-L, CON04-F, CON05-F, CON06-F, CON07-F, CON08-D, CON09-L, CON10-S |
| SFR-015 | 통합 인증 체계 | AUTH01-V, AUTH02-F | AUTH03-M, AUTH04-F, AUTH05-F, AUTH06-S, AUTH99-V |
| SFR-017 | 통합 알림체계 | NTF01-L, NTF02-D, NTF03-S | (트리거는 전 모듈 분산) |

### 1.2 ★★ 우선순위 (Phase 2) — 31개 화면

| SFR | SFR명 | 주 화면 | 보조·관련 화면 |
|-----|-------|--------|------------|
| SFR-003 | 재발방지대책 / 개선·시정조치 | IMP01-V, IMP01-L, IMP01-D | (IMP02-L `/incident_prevention` 통합) |
| SFR-004 | 안전계획 / 의무이행 점검 | PLN01-V, PLN01-L, PLN02-D, PLN02-F | PLN03-V, PLN04-S |
| SFR-005 | 안전보건 목표 / 경영방침 | POL01-V, POL01-L, POL02-D, POL02-F, POL04-V | (POL03-V는 POL01-V에 통합) |
| SFR-008 | 인력·예산 편성·집행 | BGT01-V, BGT02-V, BGT03-F, BGT04-F | BGT05-S |
| SFR-009 | 평가기준 / 평가 관리 | EVL01-V, EVL01-L, EVL02-D | EVL03-S |
| SFR-010 | 안전관리자 인력 관리 | STF01-V, STF02-V | STF03-S |
| SFR-016 | 데이터 등록 서식 | (모듈별 일괄등록 모달로 분산) | ORG02-M2 등 |
| SFR-020 | 대시보드 개발 | DSH01-V, DSH02-V, DSH03-V, DSH04-V, DSH05-V | — |

### 1.3 ★ 우선순위 (Phase 3) — 20개 화면

| SFR | SFR명 | 주 화면 | 보조·관련 화면 |
|-----|-------|--------|------------|
| SFR-011 | 종사자 의견청취 | OPN01-V, OPN01-L, OPN01-F, OPN02-D, OPN03-L | OPN04-S |
| SFR-012 | 중대재해 예방 매뉴얼 점검 | INS01-V, INS02-L, INS02-D, DOC01-L, DOC02-L | INS03-S |
| SFR-014 | 의무 이행여부 점검 | CMP01-V, CMP02-L, CMP02-D | CMP03-S |
| SFR-018 | 현황·통계 관리 | STA01-V, STA02-V | STA03-S |
| SFR-019 | 유해/위험요인 신고 | (OPN 통합 — 결정사항 #13) | — |
| SFR-021 | 제증명 관리 | CRT01-V, CRT02-F | CRT03-S |

### 1.4 공통 SFR-001 적용 영역

| SFR | 적용 |
|-----|------|
| SFR-001 공통 시스템 환경 | 전 91개 화면에 일관 적용 |

---

## 2. 화면 ↔ SFR 역매핑 (전체 91개)

### 2.1 ★★★ 화면 (40개)

| 화면 ID | 화면명 | 주 SFR | 부 SFR |
|---------|-------|-------|-------|
| **AUTH (7)** | | | |
| AUTH01-V | SSO 로그인 처리 | 015 | 006 (조직도 동기화) |
| AUTH02-F | 외부 사용자 로그인 | 015 | — |
| AUTH03-M | 외부 사용자 초대 모달 | 015 | 013, Phase 2 컨설팅 |
| AUTH04-F | 비밀번호 재설정 | 015 | — |
| AUTH05-F | 첫 로그인 비밀번호 설정 | 015 | — |
| AUTH06-S | 외부 사용자 관리 | 015 | — |
| AUTH99-V | 인증 오류 | 015 | — |
| **ORG (8)** | | | |
| ORG01-V | 조직도 현황 | 006 | 010 (안전관리자 충족) |
| ORG02-L | 구성원 목록 | 006 | — |
| ORG02-D | 구성원 상세 | 006 | — |
| ORG02-M | 구성원 직접 등록 모달 | 006 | — |
| ORG02-M2 | 구성원 일괄 등록 모달 | 006 | 016 (일괄등록) |
| ORG03-V | 전담인력 현황 | 006 | 010 (법정 인원) |
| ORG03-M | 전담인력 선임 모달 | 006 | 010 |
| ORG04-S | 행정포털 동기화 설정 | 006 | — |
| **TGT (5)** | | | |
| TGT01-V | 관리대상 현황 | 002 | 010 (미할당 안전관리자) |
| TGT02-D | 관리대상 상세 | 002 | 007, 014, 003, 012 (위젯) |
| TGT02-F | 관리대상 등록·수정 | 002 | 006 (자동 매핑) |
| TGT03-M | 담당자 추가·변경 모달 | 002 | 006 |
| TGT04-S | FMS 동기화 설정 | 002 | 016 (등록대기) |
| **NTF (3)** | | | |
| NTF01-L | 내 알림 내역 | 017 | — |
| NTF02-D | 알림 드롭다운 | 017 | — |
| NTF03-S | 알림 운영 화면 | 017 | — |
| **RSK (6)** | | | |
| RSK01-V | 위험성평가 현황 | 007 | 003 (개선조치 위젯) |
| RSK02-L | 평가 목록 | 007 | — |
| RSK02-D | 평가 상세 | 007 | 003 (자동 INSERT) |
| RSK02-F | 평가 등록·수정 | 007 | — |
| RSK03-L | 개선조치 탭 | 007 | 003 |
| RSK04-S | 위험성평가 설정 | 007 | 013 (e호조 자동 생성 정책) |
| **CON (11)** | | | |
| CON01-L | 도급계약 목록 | 013 | 010 (미달 차단 안내) |
| CON01-D | 도급계약 상세 | 013 | 007, 010 |
| CON02-L | 수급업체 목록 | 013 | — |
| CON03-L | 협의체 운영 | 013 | — |
| CON04-F | STEP 1 기본정보 | 013 | — |
| CON05-F | STEP 2 수급업체 평가 | 013 | — |
| CON06-F | STEP 3 선정+결재 | 013 | 010 (미달 차단) |
| CON07-F | STEP 4 초대+서약 | 013 | 015 (외부 사용자 초대) |
| CON08-D | 수급업체 안전평가 | 013 | — |
| CON09-L | TBM 목록 | 013 | 007 (위험요인 가져오기) |
| CON10-S | 도급관리 설정 | 013 | — |

### 2.2 ★★ 화면 (31개)

| 화면 ID | 화면명 | 주 SFR | 부 SFR |
|---------|-------|-------|-------|
| **DSH (5)** | | | |
| DSH01-V | 군수 대시보드 | 020 | 전 SFR 위젯 |
| DSH02-V | 실과단소장 대시보드 | 020 | 010 (인력 충족), 003 (개선조치) |
| DSH03-V | 팀장·담당자 대시보드 | 020 | 003, 011 (의견청취 SHM 한정) |
| DSH04-V | 근로자 대시보드 | 020 | 011/019 (위험 신고) |
| DSH05-V | 외부 사용자 대시보드 | 020 | 013 (SUB 계약·서약·TBM) |
| **IMP (3)** | | | |
| IMP01-V | 개선조치 현황 | 003 | 015 (시기도래 색상) |
| IMP01-L | 개선조치 목록 | 003 | 007, 012, 011 (출처) |
| IMP01-D | 개선조치 상세 (재발방지 2단계) | 003 | 007, 012, 011 |
| **PLN (6)** | | | |
| PLN01-V | 안전계획 현황 | 004 | 014 (CMP 연계) |
| PLN01-L | 계획 목록 | 004 | — |
| PLN02-D | 계획 상세 | 004 | 014 (양방향 연계) |
| PLN02-F | 계획 등록·수정 | 004 | 014 |
| PLN03-V | 캘린더 뷰 | 004 | — |
| PLN04-S | 안전계획 설정 | 004 | 014 |
| **POL (5)** | | | |
| POL01-V | 안전경영방침 현황 (KPI 통합) | 005 | — |
| POL01-L | 방침 이력 | 005 | — |
| POL02-D | 방침 상세 | 005 | — |
| POL02-F | 방침 등록·수정 | 005 | — |
| POL04-V | 경영방침 점검 | 005 | 003 (개선조치 자동 INSERT) |
| **BGT (5)** | | | |
| BGT01-V | 예산 현황 | 008 | — |
| BGT02-V | 예방 항목 트리 | 008 | — |
| BGT03-F | 예산 편성 | 008 | — |
| BGT04-F | 예산 집행 | 008 | — |
| BGT05-S | 예산 설정 | 008 | — |
| **EVL (4)** | | | |
| EVL01-V | 인력평가 현황 | 009 | — |
| EVL01-L | 평가 목록 | 009 | — |
| EVL02-D | 평가 상세·점검표 | 009 | — |
| EVL03-S | 평가 마스터 설정 | 009 | — |
| **STF (3)** | | | |
| STF01-V | 전체 인력 현황 | 010 | 006 (자격증 만료) |
| STF02-V | 공사별 선임 현황 | 010 | 013 (e호조 연동) |
| STF03-S | 법정 인원 마스터 | 010 | — |

### 2.3 ★ 화면 (20개)

| 화면 ID | 화면명 | 주 SFR | 부 SFR |
|---------|-------|-------|-------|
| **OPN (6)** | | | |
| OPN01-V | 의견청취 현황 | 011 | 019 (통합) |
| OPN01-L | 의견 목록 | 011 | 019 |
| OPN01-F | 의견 등록 | 011 | 019 |
| OPN02-D | 의견 처리 (4단계) | 011 | 003 (채택 시 개선조치) |
| OPN03-L | 산업안전보건위원회 | 011 | 003 (가결 시 개선조치) |
| OPN04-S | 의견청취 설정 | 011 | — |
| **INS+DOC (6)** | | | |
| INS01-V | 안전점검 현황 | 012 | — |
| INS02-L | 점검 목록 | 012 | — |
| INS02-D | 점검 실시 (체크리스트) | 012 | 003 (불합격 시 개선조치) |
| INS03-S | 점검 설정 | 012 | — |
| DOC01-L | 매뉴얼 목록 | 012 | — |
| DOC02-L | 점검표 마스터 | 012 | — |
| **CMP (4)** | | | |
| CMP01-V | 이행 현황 | 014 | 015 (시기도래 색상) |
| CMP02-L | 이행 목록 | 014 | — |
| CMP02-D | 이행 상세·실행 | 014 | 004 (PLN 양방향 연계) |
| CMP03-S | 법령 마스터 | 014 | — |
| **STA (3)** | | | |
| STA01-V | 종합 통계 | 018 | 전 SFR 집계 |
| STA02-V | 모듈별 통계 | 018 | 전 SFR 집계 |
| STA03-S | 통계 설정 | 018 | — |
| **CRT (3)** | | | |
| CRT01-V | 발급 이력 | 021 | — |
| CRT02-F | 증명서 발급 | 021 | 014 (이행률 자동 산출) |
| CRT03-S | 제증명 설정 | 021 | — |

---

## 3. SFR ↔ DB 테이블 매트릭스

### 3.1 ★★★ SFR

| SFR | 주 테이블 | 참조 테이블 |
|-----|---------|----------|
| SFR-002 | targets, target_assignees | departments, users, fms_sync_logs |
| SFR-006 | departments, users, dedicated_personnel, user_qualifications | target_assignees, warnings, sync_logs |
| SFR-007 | risk_assessments, risk_factors, risk_assessment_intervals | targets, users, improvements, contracts |
| SFR-013 | contracts, contract_subcontractors, subcontractors, evaluation_forms, agreement_forms, contract_agreements, tbm_records, council_meetings | targets, users, target_assignees, dedicated_personnel, risk_assessments, external_user_access |
| SFR-015 | users, invitation_tokens, password_reset_tokens, password_history, external_user_access, permission_rules, agreements | departments, audit_logs |
| SFR-017 | notifications, email_queue | users, audit_logs |

### 3.2 ★★ SFR

| SFR | 주 테이블 |
|-----|---------|
| SFR-003 | improvements, improvement_executions, incidents |
| SFR-004 | safety_plans, plan_items, plan_templates, plan_categories |
| SFR-005 | policies, policy_kpis, policy_kpi_measurements, policy_inspections, policy_inspection_items, policy_inspection_template |
| SFR-008 | budgets, budget_categories, budget_items, budget_executions |
| SFR-009 | evaluation_cycles, evaluations, evaluation_items, evaluation_template_items, evaluator_mapping_rules |
| SFR-010 | legal_personnel_dept, legal_personnel_construction, qualification_mapping |
| SFR-016 | (각 모듈 일괄등록 모달 분산) |
| SFR-020 | (집계 view 활용 — 자체 테이블 없음) |

### 3.3 ★ SFR

| SFR | 주 테이블 |
|-----|---------|
| SFR-011 / 019 | opinions, opinion_executions, council_agenda, industrial_safety_meetings |
| SFR-012 | inspections, inspection_items, manuals, inspection_templates |
| SFR-014 | compliance_schedules, compliance_executions, legal_references |
| SFR-018 | statistics_reports, materialized views |
| SFR-021 | certificates |

### 3.4 공통·인프라 테이블

| 테이블 | 사용 SFR | 용도 |
|--------|---------|------|
| `audit_logs` | 전 SFR | 감사 로그 (보안·규정 준수) |
| `sync_logs` | 002, 006, 013 | 외부 동기화 이력 |
| `fms_sync_logs` | 002 | FMS 동기화 전용 이력 |

---

## 4. SFR ↔ 인터페이스 매트릭스

| SFR | IF-001 SSO | IF-002 조직도 | IF-003 FMS | IF-004 e호조 | IF-005 새올 | IF-006 SMTP |
|-----|-----------|-------------|-----------|-------------|------------|------------|
| 002 (관리대상) | — | — | ⭕ 주 | — | — | — |
| 003 (개선조치) | — | — | — | — | ⭕ | — |
| 004 (안전계획) | — | — | — | — | ⭕ | — |
| 005 (경영방침) | — | — | — | — | ⭕ (결재 안내) | — |
| 006 (전담조직) | — | ⭕ 주 | — | — | ⭕ | — |
| 007 (위험성평가) | — | — | — | ⭕ (자동 생성) | ⭕ | — |
| 008 (예산) | — | — | — | — | ⭕ (결재 안내) | — |
| 009 (인력평가) | — | — | — | — | ⭕ (결재 안내) | — |
| 010 (안전관리자) | — | — | — | ⭕ (공사별) | ⭕ | — |
| 011 / 019 (의견/신고) | — | — | — | — | ⭕ (긴급 즉시) | — |
| 012 (점검·매뉴얼) | — | — | — | — | ⭕ | — |
| 013 (도급관리) | — | — | — | ⭕ 주 | ⭕ | ⭕ (도급업체 초대) |
| 014 (이행관리) | — | — | — | — | ⭕ | — |
| 015 (인증) | ⭕ 주 | ⭕ (사용자 정보) | — | — | — | ⭕ (외부 사용자) |
| 017 (알림) | — | — | — | — | ⭕ 주 | ⭕ 주 |
| 018 (통계) | — | — | — | — | ⭕ (보고서 알림) | — |
| 020 (대시보드) | — | — | — | — | ⭕ (알림 위젯) | — |
| 021 (제증명) | — | — | — | — | ⭕ | ⭕ (외부 신청자) |

> "주" = SFR의 핵심 외부 의존, 그 외 = 보조 사용.

### 4.1 인터페이스 미해소 시 영향도

| 인터페이스 | 미해소 시 영향 SFR | 대안 |
|----------|----------------|------|
| IF-001 SSO | 015 (전체 진입 불가) | — (필수 의존) |
| IF-002 조직도 | 006, 002 | 부서·사용자 수동 등록 (MANUAL) |
| IF-003 FMS | 002, 016, 020 | 시설형 관리대상 수동 등록 |
| IF-004 e호조 | 007, 010, 013 | 도급계약 수동 등록 |
| IF-005 새올 포틀릿 | 017 | 본 시스템 내부 알림만 |
| IF-006 SMTP | 015, 017 (외부) | 외부 사용자 이메일 미발송 (초대 불가) |

---

## 5. 화면 ↔ DB 테이블 매트릭스 (전체 91개)

> 화면별 CRUD 의존 테이블 (주 → 보조 순)

### 5.1 ★★★ 화면 (40개)

> v1.0 §5 동일. AUTH (7) / ORG (8) / TGT (5) / NTF (3) / RSK (6) / CON (11) — 상세 매핑.

**예시 (핵심 화면)**:
- TGT02-F: targets (W), target_assignees (W via trigger), audit_logs (W) | departments, users, user_qualifications
- ORG03-M: dedicated_personnel (W), warnings (W), audit_logs (W) | users, user_qualifications
- RSK02-D: risk_assessments (RW), risk_factors (RW), audit_logs (W) | targets, users, improvements
- CON07-F: contract_subcontractors (RW), users (W), invitation_tokens (W), external_user_access (W), email_queue (W), contract_agreements (W) | agreement_forms

### 5.2 ★★ 화면 (31개)

| 화면 | 주 테이블 (R/W) | 참조 |
|------|--------------|------|
| DSH01-V | (집계만) | risk_assessments, contracts, compliance_executions, notifications, incidents, dedicated_personnel, opinions |
| IMP01-D | improvements (RW), improvement_executions (W) | incidents, risk_factors, targets, users |
| PLN02-D | safety_plans (R), plan_items (RW) | compliance_schedules |
| POL02-D | policies (R), policy_kpis (R) | policy_inspections |
| POL04-V | policy_inspections (RW), policy_inspection_items (W) | improvements (자동) |
| BGT02-V | budget_categories (R) | budget_items, budget_executions |
| BGT03-F | budgets (RW), budget_items (W) | budget_categories, audit_logs |
| BGT04-F | budget_executions (W) | budget_items |
| EVL02-D | evaluations (RW), evaluation_items (W) | evaluation_template_items |
| STF01-V | dedicated_personnel (R), target_assignees (R) | users, user_qualifications, legal_personnel_dept |
| STF02-V | contracts (R), dedicated_personnel (R) | legal_personnel_construction |

### 5.3 ★ 화면 (20개)

| 화면 | 주 테이블 (R/W) | 참조 |
|------|--------------|------|
| OPN02-D | opinions (RW), opinion_executions (W) | improvements (자동), users |
| OPN03-L | council_agenda (RW), industrial_safety_meetings (RW) | improvements |
| INS02-D | inspections (RW), inspection_items (W) | inspection_templates, improvements |
| CMP02-D | compliance_schedules (R), compliance_executions (W) | legal_references, plan_items |
| CRT02-F | certificates (W) | targets, inspections, audit_logs |

---

## 6. 결정사항 ↔ 화면 매트릭스 (v1.0 23개)

| # | 결정사항 | 반영 화면 |
|---|---------|---------|
| **기본 정책** | | |
| 1 | 새올 포틀릿 연계 | NTF01-L, NTF02-D, NTF03-S |
| 2 | 온나라 결재 안내 팝업 | RSK02-D, CON06-F, POL02-D, POL04-V, BGT03-F, EVL02-D, PLN02-D, CRT02-F |
| **데이터 구조** | | |
| 3 | 3단계 계층 | TGT01-V, ORG01-V (전반) |
| 4 | 관리대상 단일 테이블 + type ENUM | TGT01-V, TGT02-D, TGT02-F |
| 5 | 담당자 N:M + 부서장 자동 매핑 | ORG01-V, ORG02-D, TGT02-D, TGT02-F |
| 6 | Flat 구조 | TGT01-V, TGT02-D |
| 7 | 중대재해법·시설물 단일 분류 | TGT02-D, TGT02-F |
| 8 | 공정관리(PRC) 폐기 | RSK02-D, RSK02-F, CON09-L |
| **모듈 적용 범위** | | |
| 9 | TBM 도급공사에만 적용 | CON09-L, CON01-D (TBM 탭 조건부) |
| 10 | 외부 사용자 별도 로그인 | AUTH02-F, AUTH03-M, AUTH05-F, AUTH06-S |
| 11 | 이행관리 카테고리 10개 (CDPA·LOCAL 추가) | CMP01-V, CMP02-L, CMP03-S |
| 12 | 도급 5분류 평가서·서약서만 분기 | CON04-F, CON05-F, CON07-F, CON10-S |
| 13 | 유해/위험요인 신고 OPN 통합 | OPN 전체 (SFR-019 흡수) |
| **UI/UX** | | |
| 14 | 권한별 5종 대시보드 | DSH01-V ~ DSH05-V |
| 15 | 시기도래 색상 안전NOW 기본 | DSH 전체, IMP01-V, CMP01-V, PLN01-V 등 |
| 16 | 온나라 결재 안내 팝업 1회 (#2와 일관) | RSK02-D, CON06-F |
| 17 | 새올 알림 건별 적재 | NTF03-S |
| 18 | 점검표 공통 + 개별 양쪽 | INS+DOC, INS02-D, DOC02-L |
| **워크플로우** | | |
| 19 | 재발방지대책 2단계 | IMP01-D (사고 출처) |
| 20 | 산안위 안건 별도 메뉴 4단계 | OPN03-L |
| 21 | 공사별 안전관리자 미달 결재 차단 | CON06-F, CON01-D, CON01-L, STF02-V |
| 22 | 인력·예산 depth 3 부서별 별도 | BGT02-V |
| 23 | 제증명 2종 | CRT01-V, CRT02-F |

**전체 23개 결정사항 화면 반영 완료 (100%)**

---

## 7. 비기능 요구사항 ↔ 적용 영역 매트릭스

### 7.1 성능

| 요구사항 | 적용 화면/영역 | 구현 방안 |
|---------|-------------|---------|
| 페이지 응답 3초 이내 | 전 화면 | 인덱싱, 캐싱, 페이지네이션 |
| 동시접속 200명 | 전 시스템 | 로드밸런서, DB 커넥션 풀 |
| 일괄등록 1,000건/5분 | ORG02-M2, 모듈별 일괄 모달 | 트랜잭션 배치 처리 |
| 동기화 5,000명/30분 | ORG04-S, IF-002 | delta sync, 비동기 워커 |
| DB 응답 200ms/1초 | 전 화면 | 인덱스, materialized view |

### 7.2 보안

| 요구사항 | 적용 화면/영역 | 구현 방안 |
|---------|-------------|---------|
| SSO 인증 (내부) | AUTH01-V | IF-001 OAuth2/SAML |
| 자체 ID/PW (외부) | AUTH02-F | bcrypt 해시, 잠금 정책 |
| 비밀번호 정책 | AUTH04-F, AUTH05-F | 8자+3종 조합, 이력 3건 |
| 세션 보안 | 전 화면 | HttpOnly + Secure + SameSite=Strict |
| CSRF 방어 | 전 변경 요청 | CSRF 토큰 |
| 감사 로그 | 전 변경 요청 | audit_logs (DB-001 §2.12) |
| TLS 1.2+ | 전 통신 | HTTPS + 인증서 |
| 위변조 방지 | CRT 제증명 | PDF 워터마크 + QR 검증 |

### 7.3 가용성

| 요구사항 | 적용 영역 | 구현 방안 |
|---------|---------|---------|
| 99% 가용성 (업무시간) | 전 시스템 | 헬스 체크, 자동 재시작 |
| 외부 시스템 장애 대응 | 모든 외부 연동 화면 | 재시도 큐 + 운영자 알림 |
| 백업 (일일+주간) | DB | DBMS 차원 |
| RTO 4시간 / RPO 24시간 | 전 시스템 | 백업 복원 절차 |

### 7.4 접근성

| 요구사항 | 적용 영역 | 구현 방안 |
|---------|---------|---------|
| WCAG 2.1 AA | 전 화면 | 프론트엔드 컴포넌트 표준 |
| 브라우저 호환 (Chrome/Edge) | 전 화면 | 최신 2개 메이저 버전 |
| 화면 해상도 1280×720+ | 전 화면 | 반응형 디자인 |
| 모바일 웹 | 전 화면 | 반응형 + 터치 최적화 |

### 7.5 확장성

| 요구사항 | 적용 영역 | 구현 방안 |
|---------|---------|---------|
| 5년 누적 데이터 | DB | 파티셔닝 (DB-001 §10.2), 아카이빙 |
| 사용자 1,000명+ | 전 시스템 | 수평 확장 가능 아키텍처 |
| 외부 시스템 추가 | IF 표준화 | RESTful API 표준 |

---

## 8. 자동 처리 트리거 ↔ 화면 영향 매트릭스

| 트리거·자동 작업 | 영향 화면 |
|----------------|---------|
| 부서장 자동 매핑 | ORG01-V, TGT01-V, TGT02-D, ORG04-S |
| 관리대상 신규 등록 → RESPONSIBLE 자동 INSERT | TGT 전체 |
| 위험요인 불허 → improvements 자동 INSERT | RSK02-D, RSK03-L, IMP 전체 |
| 사고 등록 → 재발방지 improvements 자동 INSERT | IMP01-D |
| 점검 불합격 → improvements 자동 INSERT | INS02-D, IMP01-L |
| 의견 채택 → improvements 자동 INSERT | OPN02-D, IMP01-L |
| 산안위 안건 가결 → improvements 자동 INSERT | OPN03-L |
| 경영방침 점검 부적합 → improvements 자동 INSERT | POL04-V, IMP01-L |
| 정기 위험성평가 자동 생성 배치 (00:00) | RSK01-V, RSK02-L |
| 차세대 e호조 동기화 (06:00) | CON01-L, RSK02-L, STF02-V |
| 행정포털 조직도 동기화 (06:00) | ORG01-V, ORG02-L |
| FMS 동기화 (06:00) | TGT01-V, TGT04-S |
| 안전관리자 미달 자동 차단 | CON01-L, CON01-D, CON06-F, STF02-V |
| 계약 종료일 도달 → COMPLETED (00:00) | CON01-L, CON01-D |
| 새올 포틀릿 적재 (비동기 워커) | NTF 전체 |
| 외부 사용자 이메일 발송 | NTF03-S |
| 안전계획 항목 완료 ↔ CMP 양방향 연계 | PLN02-D, CMP02-D |
| 정기 통계 보고서 자동 생성 (월/분기/연) | STA01-V, STA03-S |

---

## 9. 테스트 케이스 추적 (개요)

> 화면별 핵심 테스트 시나리오. 상세 TC는 별도 테스트 문서에서 작성.

### 9.1 ★★★ 모듈 핵심 TC

| TC ID | 시나리오 | 화면 | 결과 기준 |
|-------|---------|------|---------|
| TC-AUTH-001 | SSO 정상 로그인 → 권한별 대시보드 진입 | AUTH01-V | audit_logs |
| TC-ORG-001 | 부서장 변경 → 산하 RESPONSIBLE 자동 갱신 | ORG04-S → TGT02-D | target_assignees(AUTO) UPDATE |
| TC-ORG-002 | 자격 미보유 강제 선임 | ORG03-M | warnings INSERT + 운영자 알림 |
| TC-TGT-001 | 시설형 신규 등록 + 부서장 자동 매핑 | TGT02-F | targets INSERT + target_assignees(AUTO) |
| TC-RSK-001 | 위험요인 불허 → 개선조치 자동 생성 | RSK02-D | improvements INSERT |
| TC-CON-001 | e호조 신규 계약 → 도급공사 위험성평가 자동 | CON01-L → RSK02-L | risk_assessments INSERT |
| TC-CON-003 | 안전관리자 미달 → 결재 차단 | CON06-F | status='BLOCKED' + 모달 |
| TC-NTF-001 | 새올 포틀릿 적재 성공 | NTF03-S | notifications.status='SENT' |

### 9.2 ★★ 모듈 핵심 TC

| TC ID | 시나리오 | 화면 | 결과 기준 |
|-------|---------|------|---------|
| TC-DSH-001 | 권한별 대시보드 자동 라우팅 | /dashboard | 권한별 DSH0X-V |
| TC-IMP-001 | 사고 등록 → 재발방지 2단계 | IMP01-D | improvements(source='incident') INSERT |
| TC-PLN-001 | 안전계획 항목 완료 → CMP 자동 갱신 | PLN02-D → CMP02-D | 양방향 연계 |
| TC-POL-001 | 경영방침 점검 부적합 → 개선조치 | POL04-V | improvements INSERT |
| TC-BGT-001 | 3 depth 부서별 트리 관리 | BGT02-V | 공통·부서 특화 분리 |
| TC-EVL-001 | 반기 평가 일괄 생성 | EVL01-L | evaluations 일괄 INSERT |
| TC-STF-001 | 공사별 안전관리자 미달 차단 | STF02-V → CON06-F | status='BLOCKED' |

### 9.3 ★ 모듈 핵심 TC

| TC ID | 시나리오 | 화면 | 결과 기준 |
|-------|---------|------|---------|
| TC-OPN-001 | 작업중지요청 긴급 즉시 알림 | OPN01-F → NTF | 즉시 새올 알림 (SHM+) |
| TC-OPN-002 | 산안위 안건 가결 → 개선조치 자동 | OPN03-L | improvements INSERT |
| TC-INS-001 | 점검 불합격 → 개선조치 | INS02-D | improvements INSERT |
| TC-CMP-001 | 정기 이행 항목 다음 주기 자동 생성 | CMP02-D | compliance_schedules.next_due_date UPDATE |
| TC-CRT-001 | 증명서 발급 + QR 검증 | CRT02-F | PDF + QR + verify URL |

---

## 10. 외부 협의 필요 항목 추적

| 항목 | 영향 SFR | 영향 화면 | 우선순위 |
|------|--------|---------|---------|
| 행정포털 SSO 프로토콜 (OAuth2/SAML) | 015 | AUTH01-V, AUTH99-V | ★★★ |
| 행정포털 조직도 API 스펙 | 006 | ORG01-V, ORG04-S | ★★★ |
| FMS API 스펙 | 002, 016, 020 | TGT01-V, TGT02-F, TGT04-S | ★★★ |
| 차세대 e호조 API 스펙 | 007, 010, 013 | CON01-L, CON10-S, RSK04-S, STF02-V | ★★★ |
| 새올 포틀릿 연계 방식 | 017 | NTF03-S | ★★★ |
| SMTP 설정 | 015, 017 | AUTH03-M, AUTH04-F, NTF03-S | ★★ |
| 권한 매핑 규칙 초기값 | 015 | AUTH01-V, ORG02-D | ★★ |
| 공사 규모별 법정 안전관리자 인원 | 010 | STF03-S, ORG03-V, CON06-F | ★★ |
| 평가서·서약서 5분류 마스터 초기값 | 013 | CON05-F, CON07-F, CON10-S | ★★ |
| 인력평가 항목·평가기준 마스터 | 009 | EVL02-D, EVL03-S | ★★ |
| 예방 항목 트리 초기값 (공통 + 부서별) | 008 | BGT02-V, BGT05-S | ★★ |
| 위험요인 마스터 / 평가 기법 마스터 | 007 | RSK02-D, RSK04-S | ★ |
| 담양 지자체 조례 (LOCAL 카테고리) | 014 | CMP02-L, CMP03-S | ★ |
| 점검표 표준 항목 (공통 + 개별) | 012 | DOC02-L, INS02-D | ★ |
| 산안위 회의 주기·정족수 | 011 | OPN03-L, OPN04-S | ★ |
| 제증명 템플릿·유효기간·수수료 | 021 | CRT02-F, CRT03-S | ★ |

---

## 11. 산출물 간 일관성 검증

### 11.1 SFR ↔ 화면 커버리지

| 우선순위 | SFR 수 | 화면 정의 완료 | 비고 |
|---------|--------|-------------|------|
| ★★★ | 6 | 40개 | ✅ 완전 정의 |
| ★★ | 8 | 31개 (SFR-016은 모듈별 분산) | ✅ |
| ★ | 6 | 20개 (SFR-019는 OPN 통합) | ✅ |
| 공통 | 1 | 전 화면 적용 | ✅ |
| **합계** | **21** | **91개** | **✅ 100%** |

### 11.2 결정사항 ↔ 화면 커버리지

| 분류 | 결정사항 수 | 화면 반영 |
|------|-----------|---------|
| 기본 정책 (1~2) | 2 | 2 (100%) |
| 데이터 구조 (3~8) | 6 | 6 (100%) |
| 모듈 적용 범위 (9~13) | 5 | 5 (100%) |
| UI/UX (14~18) | 5 | 5 (100%) |
| 워크플로우 (19~23) | 5 | 5 (100%) |
| **합계** | **23** | **23 (100%)** |

### 11.3 화면 ↔ DB 일관성

| 항목 | 검증 결과 |
|------|---------|
| 모든 화면이 참조하는 테이블은 DB-001에 정의되어 있음 | ✅ |
| 화면에서 사용하는 컬럼명은 DB-001 정의와 일치 | ✅ |
| ENUM 값 사용은 DB-001 §8와 일치 | ✅ |

### 11.4 화면 ↔ 인터페이스 일관성

| 항목 | 검증 결과 |
|------|---------|
| 외부 연동 호출 화면은 IF-001에 정의된 인터페이스만 사용 | ✅ |
| 페이로드 구조는 IF-001 §1~§6와 일치 | ⏸ (외부 시스템 스펙 미수령 — 추후 검증) |

---

## 12. 변경 영향도 분석

### 12.1 IF-004 차세대 e호조 페이로드 변경 시

```
→ 영향 SFR: 007, 010, 013
→ 영향 화면 (직접): CON01-L, CON04-F, CON10-S, RSK02-L, RSK04-S, STF02-V
→ 영향 테이블: contracts, risk_assessments
→ 영향 트리거: 도급공사 자동 위험성평가 생성, 안전관리자 미달 검증
→ 영향 자동 작업: e호조 동기화 배치 (06:00)
```

### 12.2 결정사항 #11 카테고리 추가 시

```
→ 영향 화면: CMP01-V, CMP02-L, CMP03-S
→ 영향 테이블: compliance_schedules.category ENUM 확장
→ 영향 코드: 시각화 색상 매핑, 정렬 순서
```

### 12.3 SFR 추가·삭제 시

```
예: SFR-002 관리대상 단위 변경 (시설/업무/사업 → 추가 type)
   → 영향 DB: targets.target_type ENUM 추가
   → 영향 화면: TGT01-V (탭·필터), TGT02-D (배지), TGT02-F (입력)
   → 영향 모듈: 전 모듈 (target_id 참조)
```

---

## 13. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|---------|
| v1.0 | 2026-05-11 | 초안 작성. SFR ↔ 화면 / DB / 인터페이스 매트릭스. Phase 1 40개 화면 완전 매핑. Phase 2/3는 모듈 단위 매핑 (화면 미정의). 결정사항 23개, 비기능 요구사항 매트릭스, 자동 트리거 영향도, 테스트 케이스 개요, 외부 협의 필요 항목, 변경 영향도 분석 |
| v1.1 | 2026-05-12 | **§1 SFR ↔ 화면 매트릭스를 Phase 1 40 → 전체 91로 확장.** Phase 2 31개 + Phase 3 20개 화면 매핑 추가. §2 화면 ↔ SFR 역매핑 91개 모두 정의. §5 화면 ↔ DB·인터페이스 매트릭스 확장. §6 결정사항 ↔ 화면 매트릭스 23개 모두 화면 반영 명시. §9 테스트 케이스 추적 확장 (★★/★ 모듈 추가). §10 외부 협의 필요 항목 확장 |

---

> 📌 본 RTM은 전체 SFR 21개 / 91개 화면의 완전 추적성을 보장. 외부 인터페이스 스펙 수령 후 IF 페이로드 일관성 재검증 필요 (§11.4). 발주처 검수 시점에 산출물 검증 기초 자료로 사용.

# 담양군 중대재해통합관리시스템 — 요구사항추적매트릭스(RTM)

> 문서 ID: RTM-001
> 버전: **v1.3**
> 작성일: 2026-05-14
> 작성자: ㈜다온플레이스
> 관련 문서: SRS-001 / IA-001 (v1.4) / DB-001 / IF-001 / 화면설계서 90개 / PRD-DAMYANG-001 / PRD-DAMYANG-002

---

## 0. 문서 개요

### 0.1 목적

본 문서는 담양군 중대재해통합관리시스템의 요구사항·설계·구현 산출물 간 추적성을 보장한다. SFR(시스템 기능 요구사항)부터 화면·DB 테이블·외부 인터페이스·비기능 요구사항·결정사항까지의 매핑을 매트릭스로 정리하여:

- **추적성 확보**: 각 요구사항이 어떤 산출물에서 구현되는지 추적
- **누락 방지**: 요구사항-구현 간 갭 식별
- **변경 영향도 분석**: 요구사항 변경 시 영향받는 산출물 식별
- **테스트 커버리지**: 테스트 케이스 작성 기준 제공

### 0.2 범위

- ★★★ 6개 SFR + 화면설계서 39개 — 완전 매핑
- ★★ 8개 SFR + 화면설계서 31개 — 완전 매핑
- ★ 6개 SFR + 화면설계서 20개 — 완전 매핑
- 공통 SFR-001 + 비기능 — 전 화면 적용
- **합계**: 21개 SFR / 90개 화면 (v1.2: 결정사항 #24 반영, 91→90)

### 0.3 v1.2 변경 사항

- **결정사항 #24 신규 반영**: 외부 시스템 연동 통합
  - SYS01-S 신규 (시스템 관리 — 외부 시스템 연동 통합)
  - ORG04-S, TGT04-S 폐기 (SYS01-S에 흡수)
  - RSK04-S, CON10-S, NTF03-S — 연동 부분 SYS01-S로 이관, 콘텐츠 마스터만 유지
- 화면 수: 91 → 90
- §10 외부 협의 필요 항목: SYS01-S 통합 관점에서 우선순위 재정렬

### 0.4 v1.3 변경 사항

- **IA v1.4 동기화**: GNB 18개 → 8개 업무 성격별 그룹핑 (PRD-DAMYANG-002)
- **PRD-DAMYANG-001 결과 통합 반영**: 부서별 전담인력 관리 ORG03 → STF04 이전
  - ORG03-V → STF04-V (URL `/organization/dedicated` → `/staff/dedicated`)
  - ORG03-M → STF04-M
  - SFR 매핑: SFR-006 → **SFR-006 + SFR-010 공동**
- **모듈 명칭 변경**:
  - "전담조직" → "조직"
  - "안전관리자 인력" → "안전보건 인력"
- §1.5 **GNB 그룹 매핑 표** 신규 추가
- §2.1 ★★★ 화면 역매핑: ORG -2건 / SFR-010(STF) +2건
- §6 결정사항 #21(공사별 안전관리자 미달 결재 차단) 반영 화면에 STF04-V 추가
- SFR ↔ 화면 ↔ DB ↔ 인터페이스 매핑은 변동 없음 (총 90개 유지) — IA 레벨 변경만

### 0.4 추적 단위

| 추적 항목 | 단위 | 참조 문서 |
|---------|------|---------|
| 기능 요구사항 | SFR ID (001~021) | SRS-001 §3 |
| 비기능 요구사항 | NFR 카테고리 | SRS-001 §4 |
| 화면 | 화면 ID ({모듈}{번호}-{유형}) | 화면설계서 + IA-001 §4 |
| DB 테이블 | 테이블명 | DB-001 §2~§7 |
| 인터페이스 | IF ID (001~006) | IF-001 |
| 결정사항 | 결정 # (1~24) | SRS-001 §7 |

---

## 1. SFR ↔ 화면 매트릭스 (전체 90개 화면)

### 1.1 ★★★ 우선순위 — 39개 화면

| SFR | SFR명 | 주 화면 | 보조·관련 화면 |
|-----|-------|--------|------------|
| SFR-002 | 관리대상 관리 | TGT01-V, TGT02-D, TGT02-F | TGT03-M ~~TGT04-S 폐기~~ → SYS01-S |
| SFR-006 | **조직** 관리 (v1.4 명칭 변경) | ORG01-V, ORG02-L, ORG02-D | ORG02-M, ORG02-M2 / ~~ORG03-V → STF04-V (v1.4 이전)~~ / ~~ORG03-M → STF04-M (v1.4 이전)~~ / ~~ORG04-S 폐기~~ → SYS01-S |
| SFR-007 | 유해·위험요인 업무절차 수립·점검 | RSK01-V, RSK02-L, RSK02-D, RSK02-F | RSK03-L, RSK04-S (콘텐츠 마스터만) |
| SFR-013 | 도급·용역·위탁 안전보건 점검 | CON01-L, CON01-D | CON02-L, CON03-L, CON04-F, CON05-F, CON06-F, CON07-F, CON08-D, CON09-L, CON10-S (콘텐츠 마스터만) |
| SFR-015 | 통합 인증 체계 | AUTH01-V, AUTH02-F | AUTH03-M, AUTH04-F, AUTH05-F, AUTH06-S, AUTH99-V |
| SFR-017 | 통합 알림체계 | NTF01-L, NTF02-D, NTF03-S (적재·실패 큐만) | (트리거는 전 모듈 분산) |
| **공통 (외부 연동)** | **외부 시스템 연동 통합 (결정사항 #24)** | **SYS01-S** ⭐ | (전 모듈 영향) |

### 1.2 ★★ 우선순위 — 31개 화면

| SFR | SFR명 | 주 화면 | 보조·관련 화면 |
|-----|-------|--------|------------|
| SFR-003 | 재발방지대책 / 개선·시정조치 | IMP01-V, IMP01-L, IMP01-D | — |
| SFR-004 | 안전계획 / 의무이행 점검 | PLN01-V, PLN01-L, PLN02-D, PLN02-F | PLN03-V, PLN04-S |
| SFR-005 | 안전보건 목표 / 경영방침 | POL01-V, POL01-L, POL02-D, POL02-F, POL04-V | — |
| SFR-008 | 인력·예산 편성·집행 | BGT01-V, BGT02-V, BGT03-F, BGT04-F | BGT05-S |
| SFR-009 | 평가기준 / 평가 관리 | EVL01-V, EVL01-L, EVL02-D | EVL03-S |
| SFR-010 | **안전보건 인력** 관리 (v1.4 명칭 변경) | STF01-V, STF02-V, **STF04-V** ⬅ v1.4 (구 ORG03-V) | STF03-S, **STF04-M** ⬅ v1.4 (구 ORG03-M) · SFR-006 공동 매핑 |
| SFR-016 | 데이터 등록 서식 | (모듈별 일괄등록 모달 분산) | ORG02-M2 등 |
| SFR-020 | 대시보드 개발 | DSH01-V, DSH02-V, DSH03-V, DSH04-V, DSH05-V | — |

### 1.3 ★ 우선순위 — 20개 화면

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
| SFR-001 공통 시스템 환경 | 전 90개 화면에 일관 적용 |

### 1.5 GNB 그룹 ↔ SFR ↔ 모듈 매핑 (v1.3 신규 — IA v1.4 동기화)

| GNB | 그룹명 | 포함 모듈 | 화면 수 | SFR |
|-----|------|---------|--------|-----|
| 홈 | 대시보드 | DSH | 5 | 020 |
| 1 | 위험성평가 | RSK | 6 | 007 |
| 2 | 점검·진단 | INS + DOC | 6 | 012 |
| 3 | 도급 관리 | CON | 11 | 013 |
| 4 | 종사자 참여 | OPN | 6 | 011, 019 |
| 5 | 이행·증명 | IMP + CMP + STA + CRT | 13 | 003, 014, 018, 021 |
| 6 | 안전보건 경영 | POL + PLN + BGT + EVL | 20 | 005, 004, 008, 009 |
| 7 | 기반 관리 | TGT + ORG + STF | 13 (TGT 4 + ORG 5 + STF 5 - STF04 신규 2 = ORG -2, STF +2 / 합계 유지) | 002, 006, 010 |
| 8 | 시스템 관리 | AUTH(06-S) + NTF(03-S) + SYS | 3 | 015, 017, 공통 |
| (인증 흐름) | (라우팅 외) | AUTH(01-V, 02-F, 04-F, 05-F, 99-V) + AUTH03-M | 6 | 015 |
| (알림 일반) | (GNB 상단) | NTF(01-L, 02-D) | 2 | 017 |
| **합계** | | | **90** | |

> v1.4 변경: ORG03-V/M (2건) → STF04-V/M로 이전. ORG 화면 수 7→5, STF 화면 수 3→5. GNB 7 "기반 관리" 내부 이전, 총합 90 유지.

---

## 2. 화면 ↔ SFR 역매핑 (90개 화면)

### 2.1 ★★★ 화면 (39개)

| 화면 ID | 화면명 | 주 SFR | 부 SFR |
|---------|-------|-------|-------|
| **AUTH (7)** | | | |
| AUTH01-V | SSO 로그인 처리 | 015 | 006 (조직도 동기화) |
| AUTH02-F | 외부 사용자 로그인 | 015 | — |
| AUTH03-M | 외부 사용자 초대 모달 | 015 | 013, 컨설팅 |
| AUTH04-F | 비밀번호 재설정 | 015 | — |
| AUTH05-F | 첫 로그인 비밀번호 설정 | 015 | — |
| AUTH06-S | 외부 사용자 관리 | 015 | — |
| AUTH99-V | 인증 오류 | 015 | — |
| **ORG (5)** ⬇ v1.4 -2 (ORG03 → STF04 이전) | | | |
| ORG01-V | 조직도 현황 | 006 | 010 (안전관리자 충족) |
| ORG02-L | 구성원 목록 | 006 | — |
| ORG02-D | 구성원 상세 | 006 | — |
| ORG02-M | 구성원 직접 등록 모달 | 006 | — |
| ORG02-M2 | 구성원 일괄 등록 모달 | 006 | 016 (일괄등록) |
| ~~ORG03-V~~ → **STF04-V** (v1.4 이전) | 부서별 전담인력 현황 | 006 + 010 공동 | (★★ STF 섹션 참조) |
| ~~ORG03-M~~ → **STF04-M** (v1.4 이전) | 부서별 전담인력 선임 모달 | 006 + 010 공동 | (★★ STF 섹션 참조) |
| **TGT (4)** | | | |
| TGT01-V | 관리대상 현황 | 002 | 010 (미할당 안전관리자) |
| TGT02-D | 관리대상 상세 | 002 | 007, 014, 003, 012 (위젯) |
| TGT02-F | 관리대상 등록·수정 | 002 | 006 (자동 매핑) |
| TGT03-M | 담당자 추가·변경 모달 | 002 | 006 |
| **NTF (3)** | | | |
| NTF01-L | 내 알림 내역 | 017 | — |
| NTF02-D | 알림 드롭다운 | 017 | — |
| NTF03-S | 알림 운영 (적재 현황·실패 큐) | 017 | — |
| **RSK (6)** | | | |
| RSK01-V | 위험성평가 현황 | 007 | 003 (개선조치 위젯) |
| RSK02-L | 평가 목록 | 007 | — |
| RSK02-D | 평가 상세 | 007 | 003 (자동 INSERT) |
| RSK02-F | 평가 등록·수정 | 007 | — |
| RSK03-L | 개선조치 탭 | 007 | 003 |
| RSK04-S | 위험성평가 설정 (콘텐츠 마스터) | 007 | — |
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
| CON10-S | 도급관리 설정 (콘텐츠 마스터) | 013 | — |
| **SYS (1) — v1.2 신규** ⭐ | | | |
| SYS01-S | 외부 시스템 연동 통합 관리 | 공통 (002·006·007·010·013·015·017) | 전 SFR 외부 의존 |

### 2.2 ★★ 화면 (33개 — v1.4)

> v1.1 매핑 유지 + v1.4 STF 추가:

| 화면 ID | 화면명 | 주 SFR | 부 SFR |
|---------|-------|-------|-------|
| **STF (5)** ⬆ v1.4 +2 | | | |
| STF01-V | 전체 인력 현황 | 010 | — |
| STF02-V | 공사별 선임 현황 | 010 | 013 (결재 차단 연계) |
| STF03-S | 법정 인원 마스터 설정 | 010 | — |
| ⭐ STF04-V | 부서별 전담인력 현황 (구 ORG03-V) | **010 + 006 공동** | — |
| ⭐ STF04-M | 부서별 전담인력 선임 모달 (구 ORG03-M) | **010 + 006 공동** | — |

> 그 외 ★★ 화면 (DSH·IMP·PLN·POL·BGT·EVL): v1.1과 동일.

### 2.3 ★ 화면 (20개)

> v1.1과 동일. 변경 없음.

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
| **공통 (외부 연동)** | **integration_configs, integration_mapping_rules** (신규 v1.2) | sync_logs, fms_sync_logs (기존), audit_logs |

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
| `audit_logs` | 전 SFR | 감사 로그 |
| `sync_logs` | 002, 006, 013 + SYS | 통합 동기화 이력 (SYS01-S 단일 진실 공급원) |
| `fms_sync_logs` | 002 + SYS | FMS 동기화 상세 이력 |
| `integration_configs` | SYS (v1.2 신규) | 외부 연동 설정 마스터 |
| `integration_mapping_rules` | SYS (v1.2 신규) | 매핑 규칙 마스터 |

---

## 4. SFR ↔ 인터페이스 매트릭스 (v1.2 — SYS 통합 관점)

> 모든 외부 인터페이스 IF-001~006은 SYS01-S에서 단일 진실 공급원으로 관리.

| SFR | IF-001 SSO | IF-002 조직도 | IF-003 FMS | IF-004 e호조 | IF-005 새올 | IF-006 SMTP | 관리 위치 |
|-----|-----------|-------------|-----------|-------------|------------|------------|---------|
| 002 (관리대상) | — | — | ⭕ 주 | — | — | — | SYS01-S FMS 탭 |
| 003 (개선조치) | — | — | — | — | ⭕ | — | SYS01-S 새올 탭 |
| 004 (안전계획) | — | — | — | — | ⭕ | — | SYS01-S 새올 탭 |
| 005 (경영방침) | — | — | — | — | ⭕ | — | SYS01-S 새올 탭 |
| 006 (조직) | — | ⭕ 주 | — | — | ⭕ | — | SYS01-S 조직도 + 새올 탭 |
| 007 (위험성평가) | — | — | — | ⭕ (자동 생성) | ⭕ | — | SYS01-S e호조 + 새올 탭 |
| 008 (예산) | — | — | — | — | ⭕ | — | SYS01-S 새올 탭 |
| 009 (인력평가) | — | — | — | — | ⭕ | — | SYS01-S 새올 탭 |
| 010 (안전관리자) | — | — | — | ⭕ (공사별) | ⭕ | — | SYS01-S e호조 + 새올 탭 |
| 011 / 019 (의견/신고) | — | — | — | — | ⭕ (긴급 즉시) | — | SYS01-S 새올 탭 |
| 012 (점검·매뉴얼) | — | — | — | — | ⭕ | — | SYS01-S 새올 탭 |
| 013 (도급관리) | — | — | — | ⭕ 주 | ⭕ | ⭕ (도급업체 초대) | SYS01-S e호조 + 새올 + SMTP 탭 |
| 014 (이행관리) | — | — | — | — | ⭕ | — | SYS01-S 새올 탭 |
| 015 (인증) | ⭕ 주 | ⭕ (사용자 정보) | — | — | — | ⭕ (외부 사용자) | SYS01-S SSO + 조직도 + SMTP 탭 |
| 017 (알림) | — | — | — | — | ⭕ 주 | ⭕ 주 | SYS01-S 새올 + SMTP 탭 |
| 018 (통계) | — | — | — | — | ⭕ | — | SYS01-S 새올 탭 |
| 020 (대시보드) | — | — | — | — | ⭕ | — | SYS01-S 새올 탭 |
| 021 (제증명) | — | — | — | — | ⭕ | ⭕ (외부 신청자) | SYS01-S 새올 + SMTP 탭 |

### 4.1 인터페이스 미해소 시 영향도

| 인터페이스 | 미해소 시 영향 SFR | 대안 |
|----------|----------------|------|
| IF-001 SSO | 015 (전체 진입 불가) | — (필수 의존) |
| IF-002 조직도 | 006, 002 | 부서·사용자 수동 등록 |
| IF-003 FMS | 002, 016, 020 | 시설형 관리대상 수동 등록 |
| IF-004 e호조 | 007, 010, 013 | 도급계약 수동 등록 |
| IF-005 새올 포틀릿 | 017 | 본 시스템 내부 알림만 |
| IF-006 SMTP | 015, 017 (외부) | 외부 사용자 이메일 미발송 |

---

## 5. 화면 ↔ DB 테이블 매트릭스 (90개)

### 5.1 ★★★ 화면 핵심 매핑

| 화면 | 주 테이블 (R/W) | 참조 |
|------|--------------|------|
| TGT02-F | targets (W), target_assignees (W via trigger), audit_logs (W) | departments, users, user_qualifications |
| ORG03-M | dedicated_personnel (W), warnings (W), audit_logs (W) | users, user_qualifications |
| RSK02-D | risk_assessments (RW), risk_factors (RW), audit_logs (W) | targets, users, improvements |
| CON07-F | contract_subcontractors (RW), users (W), invitation_tokens (W), external_user_access (W), email_queue (W), contract_agreements (W) | agreement_forms |
| **SYS01-S** ⭐ | **integration_configs (RW), integration_mapping_rules (RW), sync_logs (R), fms_sync_logs (R), notifications (R), email_queue (R)** | audit_logs |

### 5.2 ★★ 화면

> v1.1과 동일. 변경 없음.

### 5.3 ★ 화면

> v1.1과 동일. 변경 없음.

---

## 6. 결정사항 ↔ 화면 매트릭스 (v1.0 23개 + v1.2 신규 #24)

| # | 결정사항 | 반영 화면 |
|---|---------|---------|
| **기본 정책** | | |
| 1 | 새올 포틀릿 연계 | NTF01-L, NTF02-D, NTF03-S, **SYS01-S** |
| 2 | 온나라 결재 안내 팝업 | RSK02-D, CON06-F, POL02-D, POL04-V, BGT03-F, EVL02-D, PLN02-D, CRT02-F |
| **데이터 구조** | | |
| 3 | 3단계 계층 | TGT01-V, ORG01-V (전반) |
| 4 | 관리대상 단일 테이블 + type ENUM | TGT01-V, TGT02-D, TGT02-F |
| 5 | 담당자 N:M + 부서장 자동 매핑 | ORG01-V, ORG02-D, TGT02-D, TGT02-F |
| 6 | Flat 구조 | TGT01-V, TGT02-D |
| 7 | 중대재해법·시설물 단일 분류 | TGT02-D, TGT02-F |
| 8 | 공정관리(PRC) 폐기 | RSK02-D, RSK02-F, CON09-L |
| **모듈 적용 범위** | | |
| 9 | TBM 도급공사에만 적용 | CON09-L, CON01-D |
| 10 | 외부 사용자 별도 로그인 | AUTH02-F, AUTH03-M, AUTH05-F, AUTH06-S |
| 11 | 이행관리 카테고리 10개 | CMP01-V, CMP02-L, CMP03-S |
| 12 | 도급 5분류 평가서·서약서만 분기 | CON04-F, CON05-F, CON07-F, CON10-S |
| 13 | 유해/위험요인 신고 OPN 통합 | OPN 전체 |
| **UI/UX** | | |
| 14 | 권한별 5종 대시보드 | DSH01-V ~ DSH05-V |
| 15 | 시기도래 색상 안전NOW 기본 | DSH 전체, IMP01-V, CMP01-V, PLN01-V 등 |
| 16 | 온나라 결재 안내 팝업 1회 | RSK02-D, CON06-F |
| 17 | 새올 알림 건별 적재 | NTF03-S, **SYS01-S** |
| 18 | 점검표 공통 + 개별 양쪽 | INS+DOC, INS02-D, DOC02-L |
| **워크플로우** | | |
| 19 | 재발방지대책 2단계 | IMP01-D |
| 20 | 산안위 안건 별도 메뉴 4단계 | OPN03-L |
| 21 | 공사별 안전관리자 미달 결재 차단 | CON06-F, CON01-D, CON01-L, STF02-V, **STF04-V** (부서별 충족 확인 — v1.4) |
| 22 | 인력·예산 depth 3 부서별 별도 | BGT02-V |
| 23 | 제증명 2종 | CRT01-V, CRT02-F |
| **외부 연동 (v1.2 신규)** | | |
| ⭐ **24** | **외부 시스템 연동 통합 — 단일 진실 공급원(SSoT)** | **SYS01-S** (신규), ORG04-S/TGT04-S (폐기), RSK04-S/CON10-S/NTF03-S (연동 부분 이관) |

**전체 24개 결정사항 화면 반영 완료 (100%)**

---

## 7. 비기능 요구사항 ↔ 적용 영역 매트릭스

### 7.1 성능

| 요구사항 | 적용 화면/영역 | 구현 방안 |
|---------|-------------|---------|
| 페이지 응답 3초 이내 | 전 화면 | 인덱싱, 캐싱, 페이지네이션 |
| 동시접속 200명 | 전 시스템 | 로드밸런서, DB 풀 |
| 일괄등록 1,000건/5분 | ORG02-M2, 모듈별 일괄 모달 | 트랜잭션 배치 |
| 동기화 5,000명/30분 | **SYS01-S 조직도 탭** (이전 ORG04-S), IF-002 | delta sync, 비동기 워커 |
| DB 응답 200ms/1초 | 전 화면 | 인덱스, materialized view |

### 7.2 보안

| 요구사항 | 적용 영역 | 구현 방안 |
|---------|---------|---------|
| SSO 인증 (내부) | AUTH01-V | **SYS01-S SSO 탭에서 설정** |
| 자체 ID/PW (외부) | AUTH02-F | bcrypt, 잠금 |
| 비밀번호 정책 | AUTH04-F, AUTH05-F | 8자+3종 |
| 세션 보안 | 전 화면 | HttpOnly + Secure + SameSite=Strict |
| CSRF 방어 | 전 변경 요청 | 토큰 |
| 감사 로그 | 전 변경 요청 | audit_logs |
| TLS 1.2+ | 전 통신 | HTTPS |
| 위변조 방지 | CRT 제증명 | PDF 워터마크 + QR |
| **외부 연동 인증 정보 보안** | **SYS01-S** | 암호화 저장 + 마스킹 표시 + CEO 권한 |

### 7.3 가용성·접근성·확장성

> v1.1과 동일. 변경 없음.

---

## 8. 자동 처리 트리거 ↔ 화면 영향 (v1.2 — SYS 관점 통합)

| 트리거·자동 작업 | 관리 위치 | 영향 화면 |
|----------------|---------|---------|
| 부서장 자동 매핑 | RSK02-D 등 (DB trigger) | ORG01-V, TGT01-V, TGT02-D |
| 관리대상 신규 등록 → RESPONSIBLE 자동 INSERT | TGT (DB trigger) | TGT 전체 |
| 위험요인 불허 → improvements 자동 INSERT | RSK02-D | RSK02-D, RSK03-L, IMP 전체 |
| 사고 등록 → 재발방지 improvements 자동 INSERT | IMP01-D | IMP01-D |
| 점검 불합격 → improvements 자동 INSERT | INS02-D | INS02-D, IMP01-L |
| 의견 채택 → improvements 자동 INSERT | OPN02-D | OPN02-D, IMP01-L |
| 산안위 안건 가결 → improvements 자동 INSERT | OPN03-L | OPN03-L |
| 경영방침 점검 부적합 → improvements 자동 INSERT | POL04-V | POL04-V, IMP01-L |
| 정기 위험성평가 자동 생성 배치 (00:00) | (DB 배치) | RSK01-V, RSK02-L |
| **차세대 e호조 동기화 (06:00)** | **SYS01-S e호조 탭** | CON01-L, RSK02-L, STF02-V |
| **행정포털 조직도 동기화 (06:00)** | **SYS01-S 조직도 탭** | ORG01-V, ORG02-L |
| **FMS 동기화 (06:00)** | **SYS01-S FMS 탭** | TGT01-V |
| **안전관리자 미달 자동 차단** | CON 모듈 + STF 모듈 | CON01-L, CON01-D, CON06-F, STF02-V |
| 계약 종료일 도달 → COMPLETED (00:00) | (DB 배치) | CON01-L, CON01-D |
| **새올 포틀릿 적재 (비동기 워커)** | **SYS01-S 새올 탭** | NTF 전체 |
| **외부 사용자 이메일 발송** | **SYS01-S SMTP 탭** | NTF03-S, AUTH 흐름 |
| 안전계획 항목 완료 ↔ CMP 양방향 연계 | PLN+CMP | PLN02-D, CMP02-D |
| 정기 통계 보고서 자동 생성 (월/분기/연) | STA 배치 | STA01-V, STA03-S |

---

## 9. 테스트 케이스 추적 (개요)

> v1.1과 동일. 단, **외부 연동 관련 TC는 SYS01-S에서 통합 수행** 추가.

### 9.1 ★★★ 모듈 핵심 TC

| TC ID | 시나리오 | 화면 | 결과 기준 |
|-------|---------|------|---------|
| TC-AUTH-001 | SSO 정상 로그인 → 권한별 대시보드 진입 | AUTH01-V | audit_logs |
| TC-ORG-001 | 부서장 변경 → 산하 RESPONSIBLE 자동 갱신 | **SYS01-S 조직도 탭 → TGT02-D** | target_assignees(AUTO) UPDATE |
| TC-ORG-002 | 자격 미보유 강제 선임 | ORG03-M | warnings INSERT |
| TC-TGT-001 | 시설형 신규 등록 + 부서장 자동 매핑 | TGT02-F | targets INSERT + target_assignees(AUTO) |
| TC-RSK-001 | 위험요인 불허 → 개선조치 자동 생성 | RSK02-D | improvements INSERT |
| TC-CON-001 | e호조 신규 계약 → 도급공사 위험성평가 자동 | **SYS01-S e호조 탭 → CON01-L → RSK02-L** | risk_assessments INSERT |
| TC-CON-003 | 안전관리자 미달 → 결재 차단 | CON06-F | status='BLOCKED' |
| TC-NTF-001 | 새올 포틀릿 적재 성공 | **SYS01-S 새올 탭** | notifications.status='SENT' |
| **TC-SYS-001 ⭐** | **SYS01-S 통합 대시보드 시스템별 상태 표시** | **SYS01-S 대시보드 탭** | **6개 시스템 상태 정확 표시** |
| **TC-SYS-002 ⭐** | **e호조 동기화 정책 변경 → CON/RSK/STF 영향 검증** | **SYS01-S e호조 탭 → 정책 편집** | **integration_configs UPDATE + 다음 동기화 시 정책 반영** |
| **TC-SYS-003 ⭐** | **외부 연동 인증 만료 → 운영자 알림** | **SYS01-S** | **운영자 알림 + 상태 배지 변경** |

### 9.2 ★★ / ★ 모듈 TC

> v1.1과 동일.

---

## 10. 외부 협의 필요 항목 추적 (v1.2 — SYS 통합 관점 재정렬)

| 항목 | 영향 SFR | 영향 화면 | 우선순위 | 관리 위치 |
|------|--------|---------|---------|---------|
| 행정포털 SSO 프로토콜 (OAuth2/SAML) | 015 | **SYS01-S SSO 탭**, AUTH01-V, AUTH99-V | ★★★ | SYS01-S |
| 행정포털 조직도 API 스펙 | 006 | **SYS01-S 조직도 탭**, ORG01-V | ★★★ | SYS01-S |
| FMS API 스펙 | 002, 016, 020 | **SYS01-S FMS 탭**, TGT01-V, TGT02-F | ★★★ | SYS01-S |
| 차세대 e호조 API 스펙 | 007, 010, 013 | **SYS01-S e호조 탭**, CON01-L, CON10-S, RSK04-S, STF02-V | ★★★ | SYS01-S |
| 새올 포틀릿 연계 방식 | 017 | **SYS01-S 새올 탭**, NTF03-S | ★★★ | SYS01-S |
| SMTP 설정 | 015, 017 | **SYS01-S SMTP 탭**, AUTH03-M, NTF03-S | ★★ | SYS01-S |
| 권한 매핑 규칙 초기값 | 015 | **SYS01-S 조직도 탭 (규칙 편집)** | ★★ | SYS01-S |
| 공사 규모별 법정 안전관리자 인원 | 010 | STF03-S, ORG03-V, CON06-F | ★★ | STF03-S |
| 평가서·서약서 5분류 마스터 초기값 | 013 | CON05-F, CON07-F, CON10-S | ★★ | CON10-S |
| 인력평가 항목·평가기준 마스터 | 009 | EVL02-D, EVL03-S | ★★ | EVL03-S |
| 예방 항목 트리 초기값 (공통 + 부서별) | 008 | BGT02-V, BGT05-S | ★★ | BGT05-S |
| 위험요인 마스터 / 평가 기법 마스터 | 007 | RSK02-D, RSK04-S | ★ | RSK04-S |
| 담양 지자체 조례 (LOCAL 카테고리) | 014 | CMP02-L, CMP03-S | ★ | CMP03-S |
| 점검표 표준 항목 (공통 + 개별) | 012 | DOC02-L, INS02-D | ★ | DOC02-L |
| 산안위 회의 주기·정족수 | 011 | OPN03-L, OPN04-S | ★ | OPN04-S |
| 제증명 템플릿·유효기간·수수료 | 021 | CRT02-F, CRT03-S | ★ | CRT03-S |

### 10.1 SYS01-S 단일 진실 공급원으로 통합되는 협의 항목 (★★★ 6개)

**시스템 관리자(CEO) 한 곳에서 모든 외부 연동 협의·설정 진행**:

1. 행정포털 SSO 프로토콜
2. 행정포털 조직도 API
3. FMS API
4. 차세대 e호조 API
5. 새올 포틀릿 연계 방식
6. SMTP 설정

→ 외부 시스템 부서·담당자와의 협의는 시스템 관리자가 일괄 진행. 각 모듈 운영자는 콘텐츠 마스터만 관리.

---

## 11. 산출물 간 일관성 검증

### 11.1 SFR ↔ 화면 커버리지 (v1.3)

| 우선순위 | SFR 수 | 화면 정의 완료 | 비고 |
|---------|--------|-------------|------|
| ★★★ | 6 + 공통 외부 연동 | 37개 (v1.4: ORG -2 → STF로 이전) | ✅ |
| ★★ | 8 | 33개 (v1.4: STF +2 신규) | ✅ |
| ★ | 6 | 20개 | ✅ |
| 공통 | 1 (SFR-001) | 전 화면 적용 | ✅ |
| **합계** | **21 SFR** | **90개** (v1.4: ORG↔STF 이전, 총합 불변) | **✅ 100%** |

### 11.2 결정사항 ↔ 화면 커버리지

| 분류 | 결정사항 수 | 화면 반영 |
|------|-----------|---------|
| 기본 정책 (1~2) | 2 | 2 (100%) |
| 데이터 구조 (3~8) | 6 | 6 (100%) |
| 모듈 적용 범위 (9~13) | 5 | 5 (100%) |
| UI/UX (14~18) | 5 | 5 (100%) |
| 워크플로우 (19~23) | 5 | 5 (100%) |
| **외부 연동 (24 — v1.2 신규)** | **1** | **1 (100%)** |
| **합계** | **24** | **24 (100%)** |

### 11.3 화면 ↔ DB 일관성

| 항목 | 검증 결과 |
|------|---------|
| 모든 화면이 참조하는 테이블은 DB-001에 정의되어 있음 | ✅ |
| 화면에서 사용하는 컬럼명은 DB-001 정의와 일치 | ✅ |
| ENUM 값 사용은 DB-001 §8와 일치 | ✅ |
| **SYS01-S 신규 테이블** (integration_configs, integration_mapping_rules) | ⏸ DB-001에 추가 필요 |

### 11.4 화면 ↔ 인터페이스 일관성

| 항목 | 검증 결과 |
|------|---------|
| 외부 연동 호출 화면은 IF-001에 정의된 인터페이스만 사용 | ✅ |
| **외부 연동 단일 진실 공급원 (SYS01-S)** | ✅ v1.2에서 통합 |
| 페이로드 구조는 IF-001 §1~§6와 일치 | ⏸ (외부 시스템 스펙 미수령 — 추후 검증) |

---

## 12. 변경 영향도 분석 (v1.2 확장)

### 12.1 외부 시스템 연동 변경 시 (SYS01-S 단일 진실 공급원)

```
예: 차세대 e호조 페이로드 변경
   → 변경 위치: SYS01-S e호조 탭 (단일)
   → 영향 SFR: 007, 010, 013
   → 영향 화면 (자동 반영):
       - 운영 조회: CON01-L, RSK02-L, STF02-V
       - 콘텐츠 마스터: CON10-S, RSK04-S (상단 연동 위젯에서 상태 표시)
       - 모듈 처리: 자동 INSERT 정책 변경
   → 영향 테이블: contracts, risk_assessments, integration_configs UPDATE
   → 영향 트리거: 도급공사 자동 위험성평가, 안전관리자 미달 검증
   → 영향 자동 작업: e호조 동기화 배치 (06:00)
   → 운영자 알림: 정책 변경 시 운영자에게 알림

[변경 작업 분량 v1.1 대비 v1.2]
v1.1: CON10-S 1곳 + RSK04-S 1곳 = 2곳 변경 (중복)
v1.2: SYS01-S 1곳만 변경 (단일 진실 공급원) ✅
```

### 12.2 결정사항 #24 적용 효과

| 변경 영역 | v1.1 (이전) | v1.2 (현재) |
|---------|-----------|-----------|
| e호조 설정 변경 | CON10-S + RSK04-S 2곳 | SYS01-S 1곳 ✅ |
| 외부 연동 모니터링 | 각 모듈 설정 화면 5곳 | SYS01-S 대시보드 1곳 ✅ |
| 책임 분리 | 모듈 운영자가 연동도 관리 | 시스템 관리자(CEO) vs 모듈 운영자(SHM) 분리 ✅ |
| 데이터 정합성 | 중복 설정 가능 (위험) | 단일 진실 공급원 (안전) ✅ |

---

## 13. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|---------|
| v1.0 | 2026-05-11 | 초안 작성. Phase 1 (★★★) 40개 화면 완전 매핑. Phase 2/3 모듈 단위 매핑 |
| v1.1 | 2026-05-12 | §1 SFR ↔ 화면 매트릭스 91개로 확장. ★★/★ 31+20개 화면 매핑 추가 |
| v1.2 | 2026-05-13 | **결정사항 #24 신규 반영 — 외부 시스템 연동 통합**. SYS01-S 신규 (외부 연동 6개 통합). ORG04-S·TGT04-S 폐기 매핑 반영. RSK04-S·CON10-S·NTF03-S 연동 부분 SYS01-S로 이관 명시. §4 인터페이스 매트릭스에 "관리 위치" 컬럼 추가. §10 외부 협의 항목 SYS01-S 통합 관점에서 재정렬. §12 변경 영향도 분석에 v1.2 단일 진실 공급원 효과 추가. 화면 수 91 → 90 |
| **v1.3** | **2026-05-14** | **PRD-DAMYANG-001 + PRD-DAMYANG-002 통합 반영 — IA v1.4 동기화**.<br>① §1.5 GNB 그룹 매핑 표 신규 (8개 GNB ↔ SFR ↔ 모듈).<br>② SFR-006 ↔ ORG 매핑: ORG03-V/M 제거 (STF로 이전).<br>③ SFR-010 ↔ STF 매핑: **STF04-V/M 추가**, SFR-006 공동 매핑 표기. STF 화면 수 3→5.<br>④ §2.1 ★★★ ORG 섹션 -2건, §2.2 ★★ STF 섹션 +2건.<br>⑤ §6 결정사항 #21(공사별 안전관리자 미달 결재 차단) 반영 화면에 STF04-V 추가.<br>⑥ §11.1 화면 커버리지 표 갱신 (총합 90개 유지).<br>⑦ 모듈 명칭 변경 반영 (전담조직→조직, 안전관리자 인력→안전보건 인력).<br>⑧ DB·인터페이스·결정사항 매핑은 변동 없음 (IA 레벨 변경만). |

---

> 📌 본 RTM v1.3은 PRD-DAMYANG-001(조직·인력 통합) + PRD-DAMYANG-002(GNB 그룹핑 통합) 반영 완료. IA v1.4와 동기화. 전체 SFR 21개 / 90개 화면 / 결정사항 24개 / 8개 GNB 그룹 100% 매핑. 외부 인터페이스 스펙 수령 후 IF-001 §1~§6 페이로드 일관성 + SYS01-S 신규 테이블(integration_configs, integration_mapping_rules) DB-001 추가 필요.

# 담양군 중대재해통합관리시스템 — 요구사항추적매트릭스(RTM)

> 문서 ID: RTM-001
> 버전: v1.0
> 작성일: 2026-05-11
> 작성자: ㈜다온플레이스
> 관련 문서: SRS-001(요구사항정의서) / IA-001(메뉴구조도) / DB-001(DB설계서) / IF-001(인터페이스정의서) / 화면설계서 40개

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
- Phase 2 (★★) 8개 SFR — 모듈 단위 매핑 (화면 미정의)
- Phase 3 (★) 6개 SFR — 모듈 단위 매핑 (화면 미정의)

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

## 1. SFR ↔ 화면 매트릭스

### 1.1 Phase 1 (★★★) — 화면 정의 완료

| SFR | SFR명 | 주 화면 | 보조·관련 화면 |
|-----|-------|--------|------------|
| SFR-002 | 관리대상 관리 | TGT01-V, TGT02-D, TGT02-F | TGT03-M, TGT04-S |
| SFR-006 | 전담조직 관리 | ORG01-V, ORG02-L, ORG02-D, ORG03-V | ORG02-M, ORG02-M2, ORG03-M, ORG04-S |
| SFR-007 | 유해·위험요인 업무절차 수립·점검 | RSK01-V, RSK02-L, RSK02-D, RSK02-F | RSK03-L, RSK04-S |
| SFR-013 | 도급·용역·위탁 안전보건 점검 | CON01-L, CON01-D | CON02-L, CON03-L, CON04-F, CON05-F, CON06-F, CON07-F, CON08-D, CON09-L, CON10-S |
| SFR-015 | 통합 인증 체계 | AUTH01-V, AUTH02-F | AUTH03-M, AUTH04-F, AUTH05-F, AUTH06-S, AUTH99-V |
| SFR-017 | 통합 알림체계 | NTF01-L, NTF02-D, NTF03-S | (트리거는 전 모듈 분산) |

### 1.2 SFR-010 (Phase 2이나 Phase 1 화면에 검증 로직 포함)

| SFR | 적용 화면 | 적용 내용 |
|-----|---------|---------|
| SFR-010 안전관리자 인력 관리 | ORG03-V, CON01-D, CON06-F | 부서별 충족 산출 / 결재 차단 검증 |

### 1.3 Phase 2/3 (화면 미정의) — 모듈 단위 매핑

| SFR | SFR명 | 우선순위 | 주 모듈 |
|-----|-------|---------|--------|
| SFR-003 | 재발방지대책 / 개선·시정조치 | ★★ | IMP |
| SFR-004 | 안전계획 / 의무이행 점검 | ★★ | PLN |
| SFR-005 | 안전보건 목표 / 경영방침 | ★★ | POL |
| SFR-008 | 인력·예산 편성·집행 | ★★ | BGT |
| SFR-009 | 평가기준 / 평가 관리 | ★★ | EVL |
| SFR-016 | 데이터 등록 서식 | ★★ | (모듈별 일괄등록 모달로 분산) |
| SFR-020 | 대시보드 개발 | ★★ | DSH |
| SFR-011 | 종사자 의견청취 | ★ | OPN |
| SFR-012 | 중대재해 예방 매뉴얼 점검 | ★ | INS, DOC |
| SFR-014 | 의무 이행여부 점검 | ★ | CMP |
| SFR-018 | 현황·통계 관리 | ★ | STA |
| SFR-019 | 유해/위험요인 신고 | ★ | OPN (통합 — 결정사항 #13) |
| SFR-021 | 제증명 관리 | ★ | CRT |

---

## 2. 화면 ↔ SFR 역매핑 (40개 화면 — Phase 1)

| 화면 ID | 화면명 | 주 SFR | 부 SFR |
|---------|-------|-------|-------|
| **AUTH (7)** | | | |
| AUTH01-V | SSO 로그인 처리 | 015 | 006 (조직도 동기화) |
| AUTH02-F | 외부 사용자 로그인 | 015 | — |
| AUTH03-M | 외부 사용자 초대 모달 | 015 | 013 (도급), Phase 2 컨설팅 |
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

---

## 3. SFR ↔ DB 테이블 매트릭스

### 3.1 Phase 1 SFR

| SFR | 주 테이블 | 참조 테이블 |
|-----|---------|----------|
| SFR-002 | targets, target_assignees | departments, users, fms_sync_logs |
| SFR-006 | departments, users, dedicated_personnel, user_qualifications | target_assignees, warnings, sync_logs |
| SFR-007 | risk_assessments, risk_factors, risk_assessment_intervals | targets, users, improvements, contracts |
| SFR-013 | contracts, contract_subcontractors, subcontractors, evaluation_forms, agreement_forms, contract_agreements, tbm_records, council_meetings | targets, users, target_assignees, dedicated_personnel, risk_assessments, external_user_access |
| SFR-015 | users, invitation_tokens, password_reset_tokens, password_history, external_user_access, permission_rules, agreements | departments, audit_logs |
| SFR-017 | notifications, email_queue | users, audit_logs |

### 3.2 공통·인프라 테이블

| 테이블 | 사용 SFR | 용도 |
|--------|---------|------|
| `audit_logs` | 전 SFR | 감사 로그 (보안·규정 준수) |
| `sync_logs` | 002, 006, 013 | 외부 동기화 이력 (행정포털·FMS·e호조) |
| `fms_sync_logs` | 002 | FMS 동기화 전용 이력 |

### 3.3 테이블 ↔ SFR 역매핑 (주요)

| 테이블 | 주 SFR | 부 SFR |
|--------|-------|-------|
| `users` | 015 | 006 |
| `departments` | 006 | 002 (관리대상의 담당부서) |
| `targets` | 002 | 007 (FK), 013 (FK), 014 (FK) |
| `target_assignees` | 006 | 002, 010 |
| `risk_assessments` | 007 | 013 (자동 생성) |
| `risk_factors` | 007 | 003 (자동 개선조치) |
| `contracts` | 013 | 007 (자동 평가), 010 (미달 차단) |
| `notifications` | 017 | 전 SFR (트리거) |

---

## 4. SFR ↔ 인터페이스 매트릭스

### 4.1 외부 인터페이스 사용

| SFR | IF-001 SSO | IF-002 조직도 | IF-003 FMS | IF-004 e호조 | IF-005 새올 | IF-006 SMTP |
|-----|-----------|-------------|-----------|-------------|------------|------------|
| SFR-002 (관리대상) | — | — | ⭕ 주 | — | — | — |
| SFR-005 (경영방침) | — | — | — | — | ⭕ (결재 안내) | — |
| SFR-006 (전담조직) | — | ⭕ 주 | — | — | ⭕ | — |
| SFR-007 (위험성평가) | — | — | — | ⭕ (자동 생성) | ⭕ | — |
| SFR-008 (예산) | — | — | — | — | ⭕ (결재 안내) | — |
| SFR-009 (인력평가) | — | — | — | — | ⭕ (결재 안내) | — |
| SFR-010 (안전관리자) | — | — | — | ⭕ (공사별) | ⭕ | — |
| SFR-013 (도급관리) | — | — | — | ⭕ 주 | ⭕ | ⭕ (도급업체 초대) |
| SFR-015 (인증) | ⭕ 주 | ⭕ (사용자 정보) | — | — | — | ⭕ (외부 사용자) |
| SFR-017 (알림) | — | — | — | — | ⭕ 주 | ⭕ 주 |

> "주" = SFR의 핵심 외부 의존, 그 외 표시 = 보조 사용.

### 4.2 인터페이스 미해소 시 영향도

| 인터페이스 | 미해소 시 영향 SFR | 대안 |
|----------|----------------|------|
| IF-001 SSO | 015 (전체 진입 불가) | — (필수 의존) |
| IF-002 조직도 | 006, 002 | 부서·사용자 수동 등록 (MANUAL) |
| IF-003 FMS | 002, 016, 020 | 시설형 관리대상 수동 등록 |
| IF-004 e호조 | 007, 010, 013 | 도급계약 수동 등록 |
| IF-005 새올 포틀릿 | 017 | 본 시스템 내부 알림만 (포틀릿 미연계) |
| IF-006 SMTP | 015, 017 (외부) | 외부 사용자 이메일 미발송 (초대 불가) |

---

## 5. 화면 ↔ DB 테이블 매트릭스 (Phase 1 40개)

> 화면별 CRUD 의존 테이블 (주 → 보조 순)

### 5.1 AUTH (7)

| 화면 | 주 테이블 (R/W) | 참조 (R) |
|------|--------------|---------|
| AUTH01-V | users (RW), audit_logs (W) | departments, permission_rules |
| AUTH02-F | users (R), audit_logs (W) | — |
| AUTH03-M | users (W), invitation_tokens (W), external_user_access (W), email_queue (W) | audit_logs |
| AUTH04-F | password_reset_tokens (W), users (W), password_history (W) | email_queue |
| AUTH05-F | users (W), invitation_tokens (W), password_history (W), agreements (W) | audit_logs |
| AUTH06-S | users (RW), invitation_tokens (RW), external_user_access (R) | email_queue, audit_logs |
| AUTH99-V | audit_logs (W) | — |

### 5.2 ORG (8)

| 화면 | 주 테이블 (R/W) | 참조 (R) |
|------|--------------|---------|
| ORG01-V | departments (R), users (R) | sync_logs, dedicated_personnel, targets, target_assignees |
| ORG02-L | users (R) | departments, user_qualifications |
| ORG02-D | users (RW), user_qualifications (RW), target_assignees (R), audit_logs (W) | departments, targets |
| ORG02-M | users (W), audit_logs (W) | departments |
| ORG02-M2 | users (W batch), audit_logs (W) | departments |
| ORG03-V | dedicated_personnel (R), target_assignees (R) | users, user_qualifications, departments |
| ORG03-M | dedicated_personnel (W), warnings (W), audit_logs (W) | users, user_qualifications |
| ORG04-S | sync_logs (R) | departments, users |

### 5.3 TGT (5)

| 화면 | 주 테이블 (R/W) | 참조 (R) |
|------|--------------|---------|
| TGT01-V | targets (R) | departments, target_assignees, fms_sync_logs |
| TGT02-D | targets (RW), target_assignees (R) | departments, users, risk_assessments, improvements |
| TGT02-F | targets (W), target_assignees (W via trigger), audit_logs (W) | departments, users, user_qualifications |
| TGT03-M | target_assignees (W), audit_logs (W) | users, targets |
| TGT04-S | fms_sync_logs (R), targets (RW) | departments |

### 5.4 NTF (3)

| 화면 | 주 테이블 (R/W) | 참조 (R) |
|------|--------------|---------|
| NTF01-L | notifications (RW) | users |
| NTF02-D | notifications (RW) | users |
| NTF03-S | notifications (RW), email_queue (RW) | users, audit_logs |

### 5.5 RSK (6)

| 화면 | 주 테이블 (R/W) | 참조 (R) |
|------|--------------|---------|
| RSK01-V | risk_assessments (R), risk_factors (R) | targets, improvements, users |
| RSK02-L | risk_assessments (R) | targets, users, departments |
| RSK02-D | risk_assessments (RW), risk_factors (RW), audit_logs (W) | targets, users, improvements |
| RSK02-F | risk_assessments (W), audit_logs (W) | targets, users |
| RSK03-L | improvements (R), risk_factors (R), risk_assessments (R) | targets |
| RSK04-S | risk_assessment_intervals (RW), sync_logs (R) | — |

### 5.6 CON (11)

| 화면 | 주 테이블 (R/W) | 참조 (R) |
|------|--------------|---------|
| CON01-L | contracts (R) | contract_subcontractors, subcontractors, targets, departments |
| CON01-D | contracts (RW), contract_subcontractors (R), audit_logs (W) | subcontractors, target_assignees, dedicated_personnel, risk_assessments, tbm_records |
| CON02-L | subcontractors (R) | contract_subcontractors, contracts |
| CON03-L | council_meetings (RW), audit_logs (W) | contracts, users |
| CON04-F | contracts (W), audit_logs (W) | targets, departments, users |
| CON05-F | contracts (W), contract_subcontractors (RW), audit_logs (W) | subcontractors, evaluation_forms, users |
| CON06-F | contracts (RW), contract_subcontractors (R), audit_logs (W) | target_assignees, dedicated_personnel |
| CON07-F | contract_subcontractors (RW), users (W), invitation_tokens (W), external_user_access (W), email_queue (W), contract_agreements (W) | agreement_forms |
| CON08-D | contract_subcontractors (RW), audit_logs (W) | evaluation_forms, contracts |
| CON09-L | tbm_records (RW), audit_logs (W) | contracts, subcontractors, risk_factors |
| CON10-S | evaluation_forms (RW), agreement_forms (RW), sync_logs (R) | — |

---

## 6. 화면 ↔ 인터페이스 매트릭스 (Phase 1 40개)

> "주" = 화면이 직접 호출 / 표시 / "간접" = 다른 작업의 결과 반영

| 화면 ID | IF-001 SSO | IF-002 조직도 | IF-003 FMS | IF-004 e호조 | IF-005 새올 | IF-006 SMTP |
|---------|-----------|------------|-----------|-------------|------------|------------|
| AUTH01-V | 주 | 간접 | — | — | — | — |
| AUTH02-F | — | — | — | — | — | — |
| AUTH03-M | — | — | — | — | — | 주 |
| AUTH04-F | — | — | — | — | — | 주 |
| AUTH05-F | — | — | — | — | — | — |
| AUTH06-S | — | — | — | — | — | 주 |
| AUTH99-V | 간접 | — | — | — | — | — |
| ORG01-V | — | 주 (수동 동기화) | — | — | — | — |
| ORG02-L | — | 간접 | — | — | — | — |
| ORG02-D | — | 간접 | — | — | 간접 | — |
| ORG02-M | — | — | — | — | 간접 | — |
| ORG02-M2 | — | — | — | — | 간접 | — |
| ORG03-V | — | 간접 | — | — | — | — |
| ORG03-M | — | — | — | — | 간접 | — |
| ORG04-S | — | 주 (운영 콘솔) | — | — | — | — |
| TGT01-V | — | — | 간접 | — | — | — |
| TGT02-D | — | — | 주 (외부 링크) | — | — | — |
| TGT02-F | — | — | 주 (FMS 조회) | — | — | — |
| TGT03-M | — | — | — | — | 간접 | — |
| TGT04-S | — | — | 주 (운영 콘솔) | — | — | — |
| NTF01-L | — | — | — | — | 간접 | — |
| NTF02-D | — | — | — | — | — | — |
| NTF03-S | — | — | — | — | 주 (운영 콘솔) | 주 (운영 콘솔) |
| RSK01-V | — | — | — | 간접 | — | — |
| RSK02-L | — | — | — | 간접 | — | — |
| RSK02-D | — | — | — | — | 간접 (결재 알림) | — |
| RSK02-F | — | — | — | — | 간접 | — |
| RSK03-L | — | — | — | — | — | — |
| RSK04-S | — | — | — | 주 (운영 콘솔) | — | — |
| CON01-L | — | — | — | 주 (수동 동기화) | — | — |
| CON01-D | — | — | — | 간접 | 간접 | — |
| CON02-L | — | — | — | — | — | — |
| CON03-L | — | — | — | — | 간접 | — |
| CON04-F | — | — | — | 간접 (prefill) | — | — |
| CON05-F | — | — | — | — | 간접 | — |
| CON06-F | — | — | — | — | 주 (결재 알림) | — |
| CON07-F | — | — | — | — | 간접 | 주 (도급업체 초대) |
| CON08-D | — | — | — | — | 간접 | — |
| CON09-L | — | — | — | — | 간접 | — |
| CON10-S | — | — | — | 주 (운영 콘솔) | — | — |

---

## 7. 결정사항 ↔ 화면 매트릭스 (v1.0 23개)

| # | 결정사항 | 반영 화면 |
|---|---------|---------|
| **기본 정책** | | |
| 1 | 새올 포틀릿 연계 (SMS·알림톡·메일·Push 미사용) | NTF01-L, NTF02-D, NTF03-S |
| 2 | 온나라 결재 안내 팝업 (자체 결재 없음) | RSK02-D, CON06-F (+ Phase 2: POL, BGT, EVL) |
| **데이터 구조** | | |
| 3 | 3단계 계층 (관리주체→부서→관리대상) | ORG01-V, TGT01-V (전반) |
| 4 | 관리대상 단일 테이블 + type ENUM | TGT01-V, TGT02-D, TGT02-F |
| 5 | 담당자 N:M + 부서장 자동 매핑 | ORG01-V, ORG02-D, TGT02-D, TGT02-F |
| 6 | Flat 구조 (셀프 참조 없음) | TGT01-V, TGT02-D |
| 7 | 중대재해법 분류·시설물 종별 단일 분류 | TGT02-D, TGT02-F |
| 8 | 공정관리(PRC) 폐기 | RSK02-D, RSK02-F, CON09-L |
| **모듈 적용 범위** | | |
| 9 | TBM 도급공사에만 적용 | CON09-L, CON01-D (TBM 탭 조건부 노출) |
| 10 | 외부 사용자 별도 로그인 | AUTH02-F, AUTH03-M, AUTH05-F, AUTH06-S |
| 11 | 이행관리 카테고리 10개 (CDPA·LOCAL 추가) | (Phase 3: CMP 모듈) |
| 12 | 도급 5분류 공통+분기 (평가서·서약서만) | CON04-F (계약유형), CON05-F (평가서), CON07-F (서약서), CON10-S (마스터) |
| 13 | 유해/위험요인 신고 OPN에 통합 | (Phase 3: OPN 모듈) |
| **UI/UX** | | |
| 14 | 권한별 5종 대시보드 | (Phase 2: DSH 모듈) |
| 15 | 시기도래 색상 안전NOW 기본 | (Phase 2: DSH + Phase 3: CMP) |
| 16 | 온나라 결재 안내 팝업 1회 | RSK02-D, CON06-F |
| 17 | 새올 알림 건별 적재 (그룹화 없음) | NTF03-S |
| 18 | 점검표 공통 + 개별 양쪽 허용 | (Phase 3: INS, DOC) |
| **워크플로우** | | |
| 19 | 재발방지대책 2단계 | (Phase 2: IMP) |
| 20 | 산안위 안건 별도 메뉴 4단계 | (Phase 3: OPN) |
| 21 | 공사별 안전관리자 미달 결재 차단 | CON06-F, CON01-D, CON01-L (안내 배너) |
| 22 | 인력·예산 depth 3 (부서별) | (Phase 2: BGT) |
| 23 | 제증명 2종 (이행확인서·점검결과 증명서) | (Phase 3: CRT) |

> **Phase 1 화면에 반영된 결정사항**: #1, #2, #3, #4, #5, #6, #7, #8, #9, #10, #12, #16, #17, #21 (총 14개)
> **Phase 2/3 화면에서 반영 예정**: #11, #13, #14, #15, #18, #19, #20, #22, #23 (총 9개)

---

## 8. 비기능 요구사항 ↔ 적용 영역 매트릭스

### 8.1 성능

| 요구사항 | 적용 화면/영역 | 구현 방안 |
|---------|-------------|---------|
| 페이지 응답 3초 이내 | 전 화면 | 인덱싱 (DB-001 §10), 캐싱, 페이지네이션 |
| 동시접속 200명 | 전 시스템 | 로드밸런서, DB 커넥션 풀 |
| 일괄등록 1,000건/5분 | ORG02-M2, SFR-016 일괄등록 | 트랜잭션 배치 처리 |
| 동기화 5,000명/30분 | ORG04-S, IF-002 | 비동기 워커, delta sync |
| DB 응답 200ms / 1초 | 전 화면 | 인덱스, 캐싱, 적절한 정규화 |

### 8.2 보안

| 요구사항 | 적용 화면/영역 | 구현 방안 |
|---------|-------------|---------|
| SSO 인증 (내부) | AUTH01-V | IF-001 OAuth2/SAML |
| 자체 ID/PW (외부) | AUTH02-F | bcrypt 해시, 잠금 정책 |
| 비밀번호 정책 | AUTH04-F, AUTH05-F | 8자+3종 조합, 이력 3건 |
| 세션 보안 | 전 화면 | HttpOnly + Secure + SameSite=Strict |
| CSRF 방어 | 전 변경 요청 | CSRF 토큰 |
| 감사 로그 | 전 변경 요청 | audit_logs (DB-001 §2.12) |
| TLS 1.2+ | 전 통신 | HTTPS + 인증서 |

### 8.3 가용성

| 요구사항 | 적용 영역 | 구현 방안 |
|---------|---------|---------|
| 99% 가용성 (업무시간) | 전 시스템 | 헬스 체크, 자동 재시작 |
| 외부 시스템 장애 대응 | 모든 외부 연동 화면 | 재시도 큐 (IF-XXX §0.3.2) + 운영자 알림 |
| 백업 (일일+주간) | DB | DBMS 차원 |
| RTO 4시간 / RPO 24시간 | 전 시스템 | 백업 복원 절차 |

### 8.4 접근성

| 요구사항 | 적용 영역 | 구현 방안 |
|---------|---------|---------|
| WCAG 2.1 AA | 전 화면 | 프론트엔드 컴포넌트 표준 |
| 브라우저 호환 (Chrome/Edge) | 전 화면 | 최신 2개 메이저 버전 |
| 화면 해상도 1280×720+ | 전 화면 | 반응형 디자인 |
| 모바일 웹 | 전 화면 | 반응형 + 터치 최적화 (SUB 사용자 현장 작성 등) |

### 8.5 확장성

| 요구사항 | 적용 영역 | 구현 방안 |
|---------|---------|---------|
| 5년 누적 데이터 | DB | 파티셔닝 (DB-001 §10.2), 아카이빙 |
| 사용자 1,000명+ | 전 시스템 | 수평 확장 가능 아키텍처 |
| 외부 시스템 추가 | IF 표준화 | RESTful API 표준, 어댑터 패턴 |

---

## 9. 자동 처리 트리거 ↔ 화면 영향 매트릭스

> DB-001 §9 자동 처리 로직 + 외부 동기화 결과가 영향을 주는 화면 매핑.

| 트리거·자동 작업 | 영향 화면 |
|----------------|---------|
| 부서장 자동 매핑 (departments.head_user_id 변경) | ORG01-V, TGT01-V, TGT02-D |
| 관리대상 신규 등록 → RESPONSIBLE 자동 INSERT | TGT01-V, TGT02-D |
| 위험요인 불허 → improvements 자동 INSERT | RSK02-D, RSK03-L, RSK01-V (위젯) |
| 정기 평가 자동 생성 배치 (00:00) | RSK01-V, RSK02-L (source='REGULAR_AUTO') |
| 차세대 e호조 동기화 (06:00) | CON01-L (신규 계약), RSK02-L (자동 생성 평가) |
| 행정포털 조직도 동기화 (06:00) | ORG01-V (부서 트리), ORG02-L (사용자) |
| FMS 동기화 (06:00) | TGT01-V (PENDING 표시), TGT04-S (운영 콘솔) |
| 안전관리자 미달 자동 차단 | CON01-L (BLOCKED 배너), CON01-D (개요), CON06-F (결재 차단) |
| 계약 종료일 도달 → status='COMPLETED' (00:00 배치) | CON01-L, CON01-D |
| 새올 포틀릿 적재 (비동기 워커) | NTF01-L, NTF02-D, NTF03-S |
| 외부 사용자 이메일 발송 (비동기 워커) | NTF03-S (이력) |

---

## 10. 테스트 케이스 추적 (Phase 1 — 개요)

> 화면별 핵심 테스트 시나리오. 상세 TC는 별도 테스트 문서에서 작성.

### 10.1 인증 (AUTH)

| TC ID | 시나리오 | 화면 | 결과 기준 |
|-------|---------|------|---------|
| TC-AUTH-001 | SSO 정상 로그인 → 권한별 대시보드 진입 | AUTH01-V | 정상 진입 + audit_logs |
| TC-AUTH-002 | SSO 토큰 만료 시 오류 처리 | AUTH99-V | `sso_token_invalid` 화면 |
| TC-AUTH-003 | LOCAL 로그인 5회 실패 → 30분 잠금 | AUTH02-F | login_failures=5, 잠금 메시지 |
| TC-AUTH-004 | 초대 이메일 링크 → 첫 비밀번호 설정 | AUTH05-F | users.is_active=true, 자동 로그인 |
| TC-AUTH-005 | 비밀번호 재설정 토큰 만료 | AUTH04-F | "재설정 링크가 만료되었습니다" |

### 10.2 전담조직 (ORG)

| TC ID | 시나리오 | 화면 | 결과 기준 |
|-------|---------|------|---------|
| TC-ORG-001 | 부서장 변경 → 산하 RESPONSIBLE 자동 갱신 | ORG04-S → 트리거 → TGT02-D | target_assignees(AUTO) 일괄 UPDATE |
| TC-ORG-002 | 자격 미보유 강제 선임 | ORG03-M | warnings INSERT + 운영자 알림 |
| TC-ORG-003 | 일괄 등록 50건 (오류 5건 포함) | ORG02-M2 | 정상 45건 등록 + 오류 로그 |

### 10.3 관리대상 (TGT)

| TC ID | 시나리오 | 화면 | 결과 기준 |
|-------|---------|------|---------|
| TC-TGT-001 | 시설형 신규 등록 + 부서장 자동 매핑 | TGT02-F → 트리거 | targets INSERT + target_assignees(AUTO) |
| TC-TGT-002 | FMS 동기화 → PENDING 항목 부서 지정 | TGT04-S → TGT02-D | status='ACTIVE' 전환 + 매핑 |
| TC-TGT-003 | 부서 이동 시 RESPONSIBLE 재매핑 | TGT02-D | 새 부서장 매핑 + 알림 |

### 10.4 알림 (NTF)

| TC ID | 시나리오 | 화면 | 결과 기준 |
|-------|---------|------|---------|
| TC-NTF-001 | 새올 포틀릿 적재 성공 | (트리거) → NTF03-S | notifications.status='SENT' |
| TC-NTF-002 | 적재 5회 실패 → FAILED | NTF03-S | retry_count=5, 실패 큐 |
| TC-NTF-003 | 외부 사용자 이메일 발송 | (트리거) → NTF03-S | email_queue.status='SENT' |

### 10.5 위험성평가 (RSK)

| TC ID | 시나리오 | 화면 | 결과 기준 |
|-------|---------|------|---------|
| TC-RSK-001 | 위험요인 불허 + 감소대책 → 개선조치 자동 생성 | RSK02-D | improvements INSERT |
| TC-RSK-002 | 정기 평가 주기 도래 → 자동 생성 | (배치) → RSK02-L | source='REGULAR_AUTO' |
| TC-RSK-003 | 결재 요청 → 온나라 안내 팝업 → 결재 결과 등록 | RSK02-D | approval_status 변경 |
| TC-RSK-004 | 종료 조건 미충족 시 종료 차단 | RSK02-D | [종료 처리] 비활성 |

### 10.6 도급관리 (CON)

| TC ID | 시나리오 | 화면 | 결과 기준 |
|-------|---------|------|---------|
| TC-CON-001 | e호조 신규 계약 → 도급공사 위험성평가 자동 생성 | CON01-L → RSK02-L | contracts + risk_assessments INSERT |
| TC-CON-002 | 5분류 계약유형별 평가서·서약서 자동 분기 | CON05-F, CON07-F | evaluation_form / agreement_form 자동 매칭 |
| TC-CON-003 | 안전관리자 미달 → 결재 차단 | CON06-F | status='BLOCKED' + 모달 |
| TC-CON-004 | STEP 4 도급업체 초대 → 외부 로그인 발급 | CON07-F | users(LOCAL) + invitation_tokens INSERT |
| TC-CON-005 | 모든 업체 서약 완료 → 시공 자동 시작 | CON07-F-SUB | status='IN_PROGRESS' 자동 전환 |

---

## 11. 외부 협의 필요 항목 추적

| 항목 | 영향 SFR | 영향 화면 | 우선순위 |
|------|--------|---------|---------|
| 행정포털 SSO 프로토콜 (OAuth2/SAML) | 015 | AUTH01-V, AUTH99-V | ★★★ (전체 진입) |
| 행정포털 조직도 API 스펙 | 006 | ORG01-V, ORG04-S | ★★★ |
| FMS API 스펙 | 002, 016, 020 | TGT01-V, TGT02-F, TGT04-S | ★★★ |
| 차세대 e호조 API 스펙 | 007, 010, 013 | CON01-L, CON10-S, RSK04-S | ★★★ |
| 새올 포틀릿 연계 방식 | 017 | NTF03-S | ★★★ |
| SMTP 설정 | 015, 017 | AUTH03-M, AUTH04-F, NTF03-S | ★★ |
| 권한 매핑 규칙 초기값 | 015 | AUTH01-V, ORG02-D | ★★ |
| 공사 규모별 법정 안전관리자 인원 | 010 | ORG03-V, CON06-F | ★★ |
| 평가서·서약서 5분류 마스터 초기값 | 013 | CON05-F, CON07-F, CON10-S | ★★ |
| 위험요인 마스터 / 평가 기법 마스터 | 007 | RSK02-D, RSK04-S | ★ |

---

## 12. 산출물 간 일관성 검증

### 12.1 화면 ↔ DB 일관성

| 항목 | 검증 결과 |
|------|---------|
| 모든 화면이 참조하는 테이블은 DB-001에 정의되어 있음 | ✅ |
| 화면에서 사용하는 컬럼명은 DB-001 정의와 일치 | ✅ |
| ENUM 값 사용은 DB-001 §8와 일치 | ✅ |

### 12.2 화면 ↔ 인터페이스 일관성

| 항목 | 검증 결과 |
|------|---------|
| 외부 연동 호출 화면은 IF-001에 정의된 인터페이스만 사용 | ✅ |
| 페이로드 구조는 IF-001 §1~§6와 일치 | ⏸ (외부 시스템 스펙 미수령 — 추후 검증) |

### 12.3 SFR ↔ 화면 커버리지

| Phase | SFR 수 | 화면 정의 완료 | 비고 |
|-------|--------|-------------|------|
| Phase 1 (★★★) | 6 | 40개 | ✅ 완전 정의 |
| Phase 2 (★★) | 8 | 0 | ⏸ 차후 진행 |
| Phase 3 (★) | 6 | 0 | ⏸ 차후 진행 |
| SFR-001 (공통) | 1 | — | 전 화면 적용 |

### 12.4 결정사항 ↔ 화면 커버리지

| 분류 | 결정사항 수 | Phase 1 반영 | Phase 2/3 반영 예정 |
|------|-----------|------------|-----------------|
| 기본 정책 (1~2) | 2 | 2 | — |
| 데이터 구조 (3~8) | 6 | 6 | — |
| 모듈 적용 범위 (9~13) | 5 | 3 (#9, #10, #12) | 2 (#11, #13) |
| UI/UX (14~18) | 5 | 2 (#16, #17) | 3 (#14, #15, #18) |
| 워크플로우 (19~23) | 5 | 1 (#21) | 4 (#19, #20, #22, #23) |
| **합계** | **23** | **14 (61%)** | **9 (39%)** |

---

## 13. 변경 영향도 분석 (예시)

### 13.1 인터페이스 스펙 변경 시 영향

```
예: IF-002 행정포털 조직도 페이로드 변경
   → 영향 SFR: 006
   → 영향 화면: ORG01-V, ORG02-L, ORG02-D, ORG04-S (4개)
   → 영향 테이블: departments, users
   → 영향 트리거: 부서장 자동 매핑 (DB-001 §9.1)
   → 간접 영향: TGT (관리대상 자동 매핑), RSK·CON (담당자 영향)
```

### 13.2 결정사항 변경 시 영향

```
예: 결정사항 #2 (온나라 결재 안내) 변경 → 자동 연동으로 변경 시
   → 영향 화면: RSK02-D, CON06-F (Phase 1) + POL, BGT, EVL (Phase 2)
   → 영향 인터페이스: IF-007 (신규 — 온나라 API)
   → 영향 DB: contracts.approval_*, risk_assessments.approval_* 컬럼 추가
   → audit_logs 정책 변경
```

### 13.3 SFR 추가·삭제 시 영향

```
예: SFR-002 관리대상 단위 변경 (시설/업무/사업 → 추가 type)
   → 영향 DB: targets.target_type ENUM 추가
   → 영향 화면: TGT01-V (탭·필터), TGT02-D (배지), TGT02-F (입력)
   → 영향 모듈: 전 모듈 (target_id 참조)
```

---

## 14. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|---------|
| v1.0 | 2026-05-11 | 초안 작성. SFR ↔ 화면 / DB / 인터페이스 매트릭스, 결정사항 매핑, 비기능 요구사항 매트릭스, 자동 트리거 영향도, 테스트 케이스 개요, 외부 협의 필요 항목, 변경 영향도 분석 |

---

> 📌 본 문서는 산출물 간 추적성 확보와 변경 영향도 분석에 사용됨. 외부 인터페이스 스펙 수령 후 페이로드 일관성 항목 (§12.2) 재검증 필요. Phase 2/3 진행 시 본 RTM을 확장하여 SFR 커버리지를 100% 달성할 것.

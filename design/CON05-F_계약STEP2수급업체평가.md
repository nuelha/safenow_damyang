# CON05-F — 계약 STEP 2 수급업체 평가

> 화면 ID: **CON05-F**
> 모듈: CON (도급관리)
> SFR: SFR-013
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-013, DB-001 §5.1 contracts / §5.2 subcontractors / §5.3 contract_subcontractors / §5.4 evaluation_forms

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | CON05-F |
| 화면명 | 계약 STEP 2 — 수급업체 평가 (진행현황) |
| URL | `/contracts/:id/step2` |
| 화면 유형 | F (Form, 풀페이지) |
| 접근 권한 | SHM+ (진행현황·평가자 지정) / 지정된 평가자 (평가 작성 — CON08-D에서) |
| 형태 | 4-Step Wizard의 STEP 2 |

## 2. 진입 경로

- CON04-F `[다음 →]`
- CON01-D 스텝 인디케이터 [STEP 2] 클릭
- CON01-L 수급업체 행 클릭 → CON01-D → 스텝 [STEP 2]
- 임시저장 후 재진입 (`status='EVALUATING'`)

## 3. 핵심 역할 분리

| 역할 | 담당 업무 | 본 화면 접근 |
|------|---------|----------|
| 계약 담당자 (SHM+) | 업체 추가 + 평가자 지정 + 진행현황 모니터링 | ✅ 전체 |
| 평가자 (지정된 SHM/SM) | 실제 평가 작성·완료 처리 | ✅ 진행현황 열람 (평가는 CON08-D에서) |

> ⚠ 계약 담당자는 평가 점수 입력 직접 접근 불가 (평가자 지정 후 평가자가 작성)

## 4. 레이아웃

```
┌──────────────────────────────────────────────────────────┐
│ ← 도급관리       [STEP 1 ●][STEP 2 ●][STEP 3][STEP 4]    │
│                                                          │
│ 청사 시설 보수공사 — STEP 2 수급업체 평가                  │
│                                                          │
│ 평가서 영역                                                │
│ ┌────────────────────────────────────────────────────┐  │
│ │ 평가서: 공사 안전관리 평가서 (CONSTRUCTION_SAFETY)  │  │
│ │ 평가항목 N개 · 만점 100점 · 적격기준 70점 이상      │  │
│ │                                  [평가서 변경]      │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ 수급업체 목록                              [+ 업체 추가]   │
│ 업체명│사업자번호│대표자│관리계획서│평가자│점수│결과│상태│관리│
│ ──────────────────────────────────────────────────────  │
│ A건설 │123-456..│홍사장│제출      │김안전│85점│적격│완료│[수정]│
│ B건설 │234-567..│이사장│미제출    │미지정│ — │ — │대기│[지정]│
│ ...                                                      │
│                                                          │
│ 진행 조건 미충족 시 안내                                    │
│ "전체 업체 평가가 완료되어야 다음 단계로 진행할 수 있습니다  │
│  (현재 N/M 완료, 평가자 미지정 K건)"                       │
│                                                          │
│ [이전]                          [취소] [임시저장] [다음 →]│
└──────────────────────────────────────────────────────────┘
```

## 5. 표시 항목

### 5.1 평가서 영역

| 항목 | 데이터 소스 |
|------|------------|
| 평가서명 | `evaluation_forms.title + code` |
| 평가항목 수 | `evaluation_forms.items` JSON 길이 |
| 만점 | `evaluation_forms.max_score` |
| 적격기준 | `evaluation_forms.pass_score` |

### 5.2 평가서 자동 분기 (B-4)

```
계약유형(contracts.contract_type)에 따라 STEP 2 진입 시 평가서 자동 선택:
  CONSTRUCTION → evaluation_forms.code = 'CONSTRUCTION_SAFETY'
  SERVICE → 'SERVICE_SAFETY'
  PURCHASE_INSTALL → 'INSTALL_SAFETY'
  CONSIGNMENT → 'CONSIGNMENT_SAFETY'
  OTHER → 'GENERAL_SAFETY'

[평가서 변경] 클릭 시 수동 변경 가능 (CON05-M3 모달)
```

### 5.3 수급업체 목록 컬럼

| 컬럼 | 데이터 소스 | 관리 버튼 조건 |
|------|------------|--------------|
| 업체명 | JOIN `subcontractors.company_name` | |
| 사업자번호 | `business_number` | |
| 대표자 | `ceo_name` | |
| 관리계획서 | `contract_subcontractors.management_plan_url` | 제출/미제출 배지 |
| 평가자 | JOIN `users.name` (`evaluator_id`) | 미지정 시 [평가자 지정] |
| 평가점수 | `evaluation_score` | 완료 전 "—" |
| 결과 | `evaluation_result` 배지 | 적격(QUALIFIED) / 부적격(UNQUALIFIED) / 대기 |
| 상태 | `evaluation_status` 배지 | PENDING / IN_PROGRESS / DONE |
| 관리 | — | §5.4 조건별 |

### 5.4 관리 버튼 상태별

| 조건 | 버튼 |
|------|------|
| 평가자 미지정 (evaluator_id IS NULL) | [평가자 지정] → CON05-M2 |
| 평가자 지정됨 + 미완료 (status != 'DONE') | [평가 진행중] (비활성, 툴팁: "{평가자명}이 진행 중") |
| 평가 완료 (status='DONE') | [평가수정] (계약담당자는 read-only로 진입) |

### 5.5 평가 유형별 평가자 단위

| 평가 유형 | 단위 | 비고 |
|---------|------|------|
| 선정평가 | **업체별** | CON05-M2에서 업체별 지정 |
| 정기평가 | 계약 단위 기본 + 업체별 변경 가능 | CON04-F `default_evaluator_id` |
| 종료평가 | 계약 단위 기본 + 업체별 변경 가능 | 동일 |

> 본 화면은 신규 계약의 선정평가가 주 목적. 정기·종료평가는 시공 시작 후 별도 진입.

## 6. 진행 조건

```
[다음 →] 활성화:
  1. 등록된 업체 수 ≥ 1
  2. 모든 업체 evaluation_status = 'DONE'
  3. 모든 업체 evaluator_id IS NOT NULL

미충족 시 비활성 + 사유 배너:
  "전체 업체 평가가 완료되어야 다음 단계로 진행할 수 있습니다.
   (현재 N/M 완료, 평가자 미지정 K건)"
```

## 7. 버튼·링크 액션

| 요소 | 위치 | 액션 | 조건·비고 |
|------|------|------|---------|
| 스텝 인디케이터 | 상단 | 현재 STEP 강조. 완료 STEP은 read-only | |
| `[← 도급관리]` | 헤더 좌측 | CON01-L 복귀 (변경사항 확인 alert) | |
| `[평가서 변경]` | 평가서 카드 헤더 | CON05-M3 모달 (평가서 select) | 진행 중 평가 있으면 초기화 경고 |
| `[+ 업체 추가]` | 테이블 헤더 | CON05-M 모달 (가입 업체 검색 / 신규 입력) | SHM+ |
| `[평가자 지정]` (행) | 관리 컬럼 | CON05-M2 모달 (해당 행 컨텍스트) | evaluator_id IS NULL 행만 |
| `[평가 진행중]` (비활성) | 관리 컬럼 | 비활성 (title: "{평가자명}이 진행 중") | 지정됨 + 미완료 |
| `[평가수정]` (행) | 관리 컬럼 | CON08-D 편집 모드 (계약담당자는 read-only) | status='DONE' |
| 업체명 클릭 | 목록 | 수급업체 상세 모달 (선택) | |
| 관리계획서 클릭 | 관리계획서 컬럼 | 첨부 파일 새 탭 다운로드 | management_plan_url IS NOT NULL |
| `[이전]` | 푸터 좌측 | STEP 1 복귀 (입력값 유지) | |
| `[취소]` | 푸터 | CON01-L 복귀 (alert) | |
| `[임시저장]` | 푸터 우측 | contracts UPSERT (step=2 유지, status='EVALUATING') → 토스트 | |
| `[다음 →]` | 푸터 우측 (Primary) | 진행 조건 검증 → STEP 3 진입 | 미충족 시 비활성 |

## 8. 보조 모달 (개요)

### 8.1 CON05-M 업체 추가 모달

- 가입 업체 검색 탭: `subcontractors` 테이블 검색 (회사명·사업자번호)
- 신규 업체 입력 탭: 회사명·사업자번호·대표자·업종 등 입력 → `subcontractors` INSERT
- 선택·등록 후 `contract_subcontractors` INSERT

### 8.2 CON05-M2 평가자 지정 모달

- 구성원 검색 (권한 범위 내 SHM 또는 SM 권장)
- `contract_subcontractors.evaluator_id` 업데이트
- 새올 포틀릿 알림 (대상자: 평가자, category='contract',
  "{사업명} 수급업체 평가자로 지정되었습니다")

### 8.3 CON05-M3 평가서 선택·변경 모달

- evaluation_forms 마스터 조회 (계약유형 기준 자동 정렬, 다른 유형 선택 가능)
- 변경 시 contract_subcontractors.evaluation_status='PENDING' 일괄 초기화 (진행 중 평가 있으면 경고)

## 9. 자동 처리 로직

### 9.1 평가서 자동 선택

```
STEP 2 진입 시:
  - contracts.contract_type 기준 evaluation_forms 자동 매칭
  - 매칭 폼이 있으면 contract_subcontractors.evaluation_form_id 자동 설정
  - 매칭 폼이 없으면 GENERAL_SAFETY (기본) 사용
```

### 9.2 평가자 지정 시 알림

```
CON05-M2에서 평가자 지정 시:
  1. contract_subcontractors.evaluator_id UPDATE
  2. 새올 포틀릿 알림 (대상자: 평가자, category='contract')
  3. 평가자의 "내 업무" 영역에 평가 작업 추가
```

### 9.3 평가 완료 자동 산출

```
평가자가 CON08-D에서 평가 점수 입력·완료 시:
  - evaluation_score = SUM(평가 항목 점수)
  - evaluation_result = (score >= pass_score) ? 'QUALIFIED' : 'UNQUALIFIED'
  - evaluation_status='DONE'
  - 본 화면 자동 갱신
```

### 9.4 평가서 변경 시 영향

```
[평가서 변경] (CON05-M3):
  진행 중 평가(status != 'PENDING') 있으면 경고:
    "기존 평가 결과가 초기화됩니다. 계속하시겠습니까?"
  확인 시:
    - evaluation_form_id 일괄 UPDATE
    - evaluation_status='PENDING' / score=NULL / result=NULL 초기화
    - 평가자에게 새올 포틀릿 알림
```

## 10. 데이터 스코프

본 화면 진입은 CON01-D 진입 권한과 동일. 데이터 스코프 적용된 계약만 접근 가능.

## 11. 검증 규칙

| 항목 | 검증 |
|------|------|
| 업체 추가 시 사업자번호 | UNIQUE 권장 (마스터 차원에서 중복 방지) |
| 평가자 지정 시 | 권한 범위 내 SHM/SM만. 비활성 사용자 차단 |
| 진행 조건 (다음 진입) | §6 3가지 조건 모두 충족 |
| 평가서 변경 시 진행 중 평가 | 확인 모달 후 초기화 |

## 12. 오류 처리

| 케이스 | 메시지 | 처리 |
|--------|--------|------|
| 진행 조건 미충족 시 [다음 →] 시도 | 사유 배너 표시 | 버튼 비활성 |
| 업체 0건에서 [다음 →] | "업체를 1건 이상 추가해주세요" | 인라인 안내 |
| 평가서 변경 시 진행 중 평가 | "기존 평가 결과가 초기화됩니다" | 확인 모달 |
| 평가자 지정 시 권한 부족 | "권한 범위 외 사용자입니다" | 차단 |

## 13. 관련 화면 흐름

```
CON04-F [다음 →] ──→ CON05-F
                       ↓ [+ 업체 추가] → CON05-M (업체 추가 모달)
                       ↓ [평가자 지정] → CON05-M2 (평가자 지정 모달)
                       ↓ [평가서 변경] → CON05-M3 (평가서 선택 모달)
                       ↓ [평가수정] / 평가자가 [내 업무] → CON08-D
                       ↓ [다음 →] (진행 조건 충족 시) → CON06-F
```

## 14. 관련 DB 테이블

- `contracts` (DB-001 §5.1): step·status 갱신
- `contract_subcontractors` (DB-001 §5.3): 본 화면의 주요 데이터
- `subcontractors` (DB-001 §5.2): 업체 마스터
- `evaluation_forms` (DB-001 §5.4): 평가서 마스터 (5분류 분기)
- `users` (DB-001 §2.2): 평가자 검색·지정
- `audit_logs` (DB-001 §2.12): 평가자 지정·평가서 변경 감사

## 15. 관련 인터페이스

- **IF-005 새올 포틀릿**: 평가자 지정 알림 (간접)

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. 5분류 평가서 자동 분기 (B-4). 평가자 단위 (선정=업체별, 정기·종료=계약 단위) |

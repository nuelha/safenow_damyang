# CON01-L — 도급계약 목록

> 화면 ID: **CON01-L**
> 모듈: CON (도급관리)
> SFR: SFR-013
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-013, DB-001 §5.1 contracts, IF-004 차세대 e호조

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | CON01-L |
| 화면명 | 도급계약 목록 |
| URL | `/contracts` (도급관리 모듈의 기본 진입 = 도급계약 목록) |
| 화면 유형 | L (List) |
| 접근 권한 | SHM+ (열람·등록) / SUB는 본인 계약만 / CON은 위임 범위 |
| 기본 진입 화면 | ✅ (도급관리 모듈의 기본 진입) |

## 2. 진입 경로

- GNB **의무이행 관리** > LNB **도급계약**
- 대시보드 위젯 [도급계약 현황]
- TGT02-D 도급관리 위젯 [도급계약 보기]
- 새올 포틀릿 알림 (계약 결재·시공중 등) 링크
- CON01-D 상단 [← 목록]

> 모듈 내 다른 화면(수급업체 / 협의체 / TBM / 도급관리 설정)으로의 이동은 좌측 사이드 메뉴(LNB)로 처리.

## 3. 레이아웃

```
┌──────────────────────────────────────────────────────────┐
│ ● 도급계약                                                │
│   도급·용역·위탁 계약 등록 및 진행 관리                   │
│                                                          │
│ 요약 카드                                                  │
│ 진행중 N / 결재대기 N / 시공중 N / 종료 N                    │
│                                                          │
│ 필터: [부서▼][계약유형▼][상태▼][기간▼][검색]               │
│                              [차세대 e호조 동기화][+ 계약 등록]│
│                                                          │
│ ⚠ 안전관리자 미달로 결재 차단된 계약 N건 [확인 →]            │
│                                                          │
│ 계약유형│사업명         │수급업체│담당  │기간    │상태   │  │
│ ─────────────────────────────────────────────────────────│
│ 공사   │청사 시설 보수  │A건설  │김도급│04-08월│시공중 │  │
│ 용역   │청소·시설관리   │B용역  │이도급│연중   │진행중 │  │
│ ...                                                      │
│                                                          │
│ [페이지네이션]                                            │
└──────────────────────────────────────────────────────────┘
```

## 4. 표시 항목

### 4.1 요약 카드

| 항목 | 데이터 소스 |
|------|------------|
| 진행중 | `COUNT(contracts WHERE status IN ('DRAFT','EVALUATING','APPROVAL_REQUESTED'))` |
| 결재대기 | `COUNT(contracts WHERE status='APPROVAL_REQUESTED')` |
| 시공중 | `COUNT(contracts WHERE status='IN_PROGRESS')` |
| 종료 | `COUNT(contracts WHERE status='COMPLETED')` |

### 4.2 안전관리자 미달 차단 안내 배너

```
SFR-010 검증 로직 결과:
  - 공사 규모(예산)별 법정 안전관리자 N명 필요
  - target_assignees + dedicated_personnel SAFETY_MGR 수 집계
  - 미달 시 contracts.status='BLOCKED' 자동 전환

WHERE status='BLOCKED' COUNT 산출 → 1건 이상이면 배너 노출

[확인 →] 클릭: `?status=BLOCKED` 필터 적용
```

### 4.3 목록 컬럼

| 컬럼 | 데이터 소스 | 비고 |
|------|------------|------|
| 계약유형 | `contracts.contract_type` 배지 | 공사/용역/구매설치/위탁/기타 |
| 사업명 | `contracts.name` | 클릭 시 CON01-D |
| 수급업체 | `contract_subcontractors` JOIN `subcontractors.company_name` | 선정 업체. 복수 시 "N개" 표시 |
| 담당자 | `created_by` JOIN `users.name` | |
| 기간 | `start_date ~ end_date` | |
| 상태 | `contracts.status` 배지 | 8종 상태 (DRAFT/EVALUATING/APPROVAL_REQUESTED/APPROVED/REJECTED/IN_PROGRESS/COMPLETED/BLOCKED) |
| 출처 | `contracts.source` 배지 (선택) | 수동/e호조 자동 |

### 4.4 상태 배지

| 코드 | 표시명 | 색상 |
|------|--------|------|
| DRAFT | 작성중 | 회색 |
| EVALUATING | 평가중 | 노랑 |
| APPROVAL_REQUESTED | 결재 진행중 | 주황 |
| APPROVED | 결재 완료 | 파랑 |
| REJECTED | 반려 | 빨강 |
| IN_PROGRESS | 시공중 | 초록 |
| COMPLETED | 종료 | 회색 |
| BLOCKED | 결재 차단 | 빨강 (강조) |

## 5. 필터 옵션

| 필터 | 옵션 | 비고 |
|------|------|------|
| 부서 | 전체 / departments 목록 | 권한 범위 내. JOIN targets.department_id |
| 계약유형 | 전체 / 공사 / 용역 / 구매설치 / 위탁사업 / 기타 | |
| 상태 | 전체 / 8종 상태 | |
| 기간 | 전체 / 진행중 / 올해 / 지난 6개월 / 지난 1년 | `start_date` 또는 `end_date` 기준 |
| 검색 | `contracts.name` / `contract_subcontractors.company_name` 부분일치 | |

## 6. 버튼·링크 액션

| 요소 | 위치 | 액션 | 조건·비고 |
|------|------|------|---------|
| 필터 셋 | 필터 바 | 각 컬럼별 필터 + URL 동기화 | |
| `[차세대 e호조 동기화]` | 우상단 | 즉시 동기화 트리거 → 결과 모달 | SHM+. 진행 중 비활성 (§7.1 참조) |
| `[+ 계약 등록]` | 우상단 | CON04-F STEP 1 이동 (수동 등록) | SHM+ |
| ⚠ 차단 배너 `[확인 →]` | 배너 | `?status=BLOCKED` 필터 | 차단 1건 이상 시 |
| 행 클릭 | 목록 | CON01-D 이동 (`/contracts/:id`) | |
| 페이지 번호 | 페이지네이션 | 페이지 이동 (URL `?page=`) | |

## 7. 자동 처리 로직

### 7.1 차세대 e호조 수동 동기화

```
[차세대 e호조 동기화] 클릭 → 확인 모달:
   "차세대 e호조에서 신규 계약을 즉시 가져오시겠습니까?"
   [취소] [동기화 시작]

동기화 동작 (IF-004 §4.2 참조):
   1. e호조 도급계약 API 호출 (changed_since 기준)
   2. 신규/변경 계약 contracts UPSERT
      - 신규: source='EHOJO_AUTO', status='DRAFT', step=1
      - target_id 자동 매칭 (IF-004 §4.5, 미매칭 시 운영자 수동 매칭 필요)
   3. 도급공사(CONTRUCTION) 계약은 risk_assessments 자동 생성 (IF-004 §4.6)
   4. 결과 모달:
      "신규 N건 import 완료 / 변경 N건 / 매칭 실패 N건"
   5. 새올 포틀릿 알림 (담당자 지정 필요 안내)
   6. 목록 새로고침
```

### 7.2 정기 자동 동기화

```
스케줄러: 매일 06:00 (IF-004 §4.2)
   동기화 결과는 본 화면 목록 갱신에 자동 반영
```

### 7.3 안전관리자 미달 자동 차단

```
계약 등록·수정 또는 SFR-010 인력 변경 감지 시:
  - 공사 규모(budget)별 법정 안전관리자 N명 필요
  - target_assignees + dedicated_personnel SAFETY_MGR 수 집계
  - 미달 시 contracts.status='BLOCKED' 자동 전환
  - 운영자에게 새올 포틀릿 알림
본 화면의 차단 배너에 반영
```

## 8. 데이터 스코프

| 권한 | 보이는 범위 |
|------|----------|
| CEO | 전체 |
| GM | `contracts.target_id` JOIN `targets.department_id` 본 부서 산하 |
| SM/SHM | 본인이 담당자(`created_by` 또는 default_evaluator_id)인 계약 + target_assignees 매칭 |
| WKR | 본 화면 접근 불가 |
| SUB | `external_user_access.access_type='CONTRACT'` 연결 계약만 |
| CON | `external_user_access.access_type='CONSULTING'` 위임 범위 계약 |

## 9. 오류 처리

| 케이스 | 메시지 | 처리 |
|--------|--------|------|
| e호조 동기화 실패 | "차세대 e호조 연결 실패. 잠시 후 다시 시도해주세요" | 토스트 + 운영자 알림 |
| 데이터 스코프 결과 없음 | "조회 가능한 계약이 없습니다" | 빈 화면 + 안내 |
| 권한 부족 (WKR 접근) | "접근 권한이 없습니다" | AUTH99-V |

## 10. 관련 화면 흐름

```
CON01-L
   ├─ 행 클릭 → CON01-D (/contracts/:id)
   ├─ [+ 계약 등록] → CON04-F STEP 1
   ├─ LNB → CON02-L / CON03-L / CON09-L / CON10-S (좌측 사이드 메뉴 이동)
   └─ [e호조 동기화] → 결과 모달 → 목록 새로고침
```

## 11. 관련 DB 테이블

- `contracts` (DB-001 §5.1): 계약 마스터
- `contract_subcontractors` (DB-001 §5.3): 수급업체 매핑
- `subcontractors` (DB-001 §5.2): 업체 마스터
- `targets` / `departments` (JOIN): 부서별 필터

## 12. 관련 인터페이스

- **IF-004 차세대 e호조**: 도급계약 자동 import + 도급공사 위험성평가 자동 생성
- **IF-005 새올 포틀릿** (간접): 결재·시공 단계 변경 알림

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성 |
| v1.1 | 2026-05-12 | 모듈 화면 간 이동 탭 제거 → LNB 사이드 메뉴로 일원화. URL `?tab=list` 제거 (모듈 기본 URL = `/contracts`) |

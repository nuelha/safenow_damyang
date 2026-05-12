# POL04-V — 경영방침 점검

> 화면 ID: **POL04-V**
> 모듈: POL (안전경영방침)
> SFR: SFR-005
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-005

> 경영방침 점검은 SHM이 정기·수시 점검자 지정 후 점검표 작성. 결과는 적합/부적합/보완 판정.

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | POL04-V |
| 화면명 | 경영방침 점검 |
| URL | `/policies/inspection` |
| 화면 유형 | V (View + List) |
| 접근 권한 | CEO·GM·SHM (지정·결과 확인) / 지정된 점검자 (작성) |

## 2. 진입 경로

- GNB **안전보건 경영** > LNB **경영방침 점검** (POL 그룹)
- POL01-V [점검 상세 보기]
- 새올 포틀릿 알림 (점검자 지정·결과 보고 등) 링크

> 모듈 내 다른 화면으로의 이동은 좌측 사이드 메뉴(LNB)로 처리.

## 3. 레이아웃

```
┌────────────────────────────────────────────────────┐
│ ● 경영방침 점검                                       │
│   분기·반기 점검 및 결재 관리                          │
│                                                    │
│ 요약 카드                                            │
│ ┌──────────┐┌──────────┐┌──────────┐               │
│ │ 정기 점검 ││ 적합     ││ 부적합   │               │
│ │  분기 4회 ││  N건     ││  N건     │               │
│ └──────────┘└──────────┘└──────────┘               │
│                                                    │
│ ⚠ 점검 시기 도래 1건 [점검자 지정]                    │
│                                                    │
│ 필터: [연도▼][점검 유형▼][결과▼]      [+ 점검 지정]   │
│                                                    │
│ 점검일자  │ 점검 유형 │ 점검자  │ 결과 │ 결재 │ 관리   │
│ ──────────────────────────────────────────────────│
│ 2026-04-15│ 정기 (1Q)│ 김안전 │ 적합 │ 완료 │ [상세]│
│ 2026-01-10│ 정기 (4Q)│ 이안전 │ 부적합│ 완료 │ [상세]│
│ ...                                                │
└────────────────────────────────────────────────────┘
```

## 4. 표시 항목

### 4.1 요약 카드

| 카드 | 데이터 소스 |
|------|------------|
| 정기 점검 횟수 | 연도별 정기 점검 횟수 (분기별 4회 권장) |
| 적합 / 부적합 | `policy_inspections WHERE result GROUP BY` 카운트 |

### 4.2 점검 시기 도래 안내

```
정책 (POL05-S 마스터): 정기 점검은 분기당 1회 권장
직전 정기 점검일 + 3개월 < NOW() → 시기 도래 안내
[점검자 지정] 클릭 → 점검자 지정 모달
```

### 4.3 목록 컬럼

| 컬럼 | 데이터 소스 |
|------|------------|
| 점검일자 | `policy_inspections.inspection_date` |
| 점검 유형 | `inspection_type` (정기 / 수시) |
| 점검자 | JOIN `users.name` |
| 결과 | `result` 배지 (적합·부적합·보완) |
| 결재 | `approval_status` 배지 |
| 관리 | [상세] → POL04-D 이동 |

### 4.4 결과 배지

| 코드 | 표시명 | 색상 |
|------|--------|------|
| `COMPLIANT` | 적합 | 초록 |
| `NON_COMPLIANT` | 부적합 | 빨강 |
| `NEEDS_IMPROVEMENT` | 보완 필요 | 주황 |

## 5. 점검표 항목 (예시)

```
경영방침 점검표 (policy_inspection_template 마스터):

§1. 안전보건 목표 달성도
   1.1 KPI 목표값 대비 달성 여부               (O/X/텍스트)
   1.2 미달 KPI에 대한 원인 분석 수행 여부      (O/X/텍스트)

§2. 조직·인력 운영
   2.1 안전관리자 법정 인원 충족 여부           (O/X/텍스트)
   2.2 안전보건교육 이수율                      (O/X/텍스트)

§3. 위험성평가 시행
   3.1 정기 평가 시행률                         (O/X/텍스트)
   3.2 개선조치 이행률                          (O/X/텍스트)

§4. 도급사업 안전관리
   4.1 도급업체 평가 적격률                     (O/X/텍스트)
   4.2 협의체 운영 정기 시행                    (O/X/텍스트)

§5. 종사자 참여
   5.1 의견청취 정기 실시 여부                  (O/X/텍스트)
   5.2 산업안전보건위원회 회의 개최             (O/X/텍스트)

...

총 N개 항목 / 적합 N / 부적합 N / 보완 N
종합 결과: [적합 / 부적합 / 보완 필요]
```

## 6. POL04-D 점검 상세 (보조 — 본 문서에 통합 정의)

| 항목 | 내용 |
|------|------|
| URL | `/policies/inspections/:id` |
| 화면 유형 | D (Detail) |
| 접근 권한 | CEO·GM·SHM / 본인 점검자 |

### 6.1 표시 항목

- 점검 기본정보 (일자·유형·점검자·대상 방침 버전)
- 점검표 항목별 결과 (O/X/텍스트)
- 부적합·보완 항목 → 개선조치 자동 INSERT 연계 (IMP 모듈)
- 결재 흐름 (RSK02-D §7.1 동일 — 온나라 안내 팝업)

### 6.2 [개선조치 자동 등록]

```
부적합·보완 판정 항목에 대해:
  1. 자동: improvements INSERT (source_type='manual' 또는 신규 'policy_inspection' 추가, 
     source_id=:inspection_item_id, description='경영방침 점검 부적합: {항목명}',
     status='PENDING')
  2. 점검자가 [개선조치 생성] 버튼 수동 클릭 (자동 vs 수동 정책 협의 가능)
  3. 담당자 지정 후 IMP01-D에서 후속 실행
```

## 7. 버튼·링크 액션

| 요소 | 액션 |
|------|------|
| `[+ 점검 지정]` | 점검자 지정 모달 (점검자·예정일·유형 입력 → policy_inspections INSERT 'PLANNED') |
| 시기 도래 [점검자 지정] | 위와 동일 |
| 행 [상세] | POL04-D |
| 점검 결과 [결재요청] | 안내 팝업 → status='REQUESTED' |
| 부적합·보완 항목 [개선조치 생성] | improvements INSERT |

## 8. 자동 처리 로직

### 8.1 점검자 지정 시 알림

```
policy_inspections INSERT (inspection_date 예정, status='PLANNED'):
  - 점검자에게 새올 포틀릿 알림 (category='inspection',
    "경영방침 점검자로 지정되었습니다. 예정일: {date}")
```

### 8.2 점검 완료 시 결과 등록

```
점검자가 POL04-D에서 점검표 작성 후 [결과 등록]:
  1. policy_inspection_items 일괄 INSERT
  2. policy_inspections.result 자동 산출:
     - 모든 항목 적합 → 'COMPLIANT'
     - 부적합 1건 이상 → 'NON_COMPLIANT'
     - 부적합 0 + 보완 1건 이상 → 'NEEDS_IMPROVEMENT'
  3. status='COMPLETED'
  4. 부적합·보완 항목별 [개선조치 생성] 옵션 노출
  5. 새올 알림 (대상자: CEO/GM, 결과 보고)
```

### 8.3 시기 도래 자동 알림

```
배치 (매일 00:00):
  WHERE 직전 정기 점검 종료일 + 3개월 < NOW() + 7일
    AND 미시작 정기 점검 없음:
  → SHM+에게 새올 포틀릿 알림 ("경영방침 정기 점검 시기 도래 (D-N)")
```

## 9. 검증 규칙

| 항목 | 검증 |
|------|------|
| 점검자 지정 | 권한 범위 내 SHM/SM. 본인 셀프 지정 차단 |
| 점검 결과 등록 | 모든 항목 입력 필수 (또는 N/A 선택 가능) |
| 결재 요청 | 결과 등록 완료 후만 가능 |

## 10. 관련 화면 흐름

```
POL04-V
   ├─ [+ 점검 지정] → 점검자 지정 모달
   ├─ 행 [상세] → POL04-D
   │  ├─ 점검표 입력 → [결과 등록] → 결과 자동 산출
   │  ├─ [개선조치 생성] (부적합·보완) → improvements INSERT → IMP01-D
   │  └─ [결재요청] → 안내 팝업 → status 변경
   └─ 시기 도래 [점검자 지정]
```

## 11. 관련 DB 테이블

```sql
-- 점검 본체
CREATE TABLE policy_inspections (
  id              UUID PRIMARY KEY,
  policy_id       UUID NOT NULL REFERENCES policies(id),
  inspection_date DATE NOT NULL,
  inspection_type ENUM('REGULAR','SPECIAL') NOT NULL,
  inspector_id    UUID NOT NULL REFERENCES users(id),
  status          ENUM('PLANNED','IN_PROGRESS','COMPLETED') DEFAULT 'PLANNED',
  result          ENUM('COMPLIANT','NON_COMPLIANT','NEEDS_IMPROVEMENT') NULL,
  notes           TEXT,
  approval_status ENUM('NOT_REQUESTED','REQUESTED','APPROVED','REJECTED') DEFAULT 'NOT_REQUESTED',
  approver_name   VARCHAR(100),
  approval_doc_url VARCHAR(500),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP
);

-- 점검표 항목별 결과
CREATE TABLE policy_inspection_items (
  id              UUID PRIMARY KEY,
  inspection_id   UUID NOT NULL REFERENCES policy_inspections(id) ON DELETE CASCADE,
  template_item_id UUID,                              -- 점검표 마스터 항목 ID
  section         VARCHAR(50),                         -- §1, §2 등
  item_no         VARCHAR(20),                         -- 1.1, 1.2 등
  item_title      VARCHAR(500),
  result          ENUM('O','X','NA') NOT NULL,         -- 적합/부적합/N/A
  notes           TEXT,                                -- 평가 의견
  attachments     JSON,
  improvement_id  UUID REFERENCES improvements(id) NULL -- 부적합·보완 시 개선조치 연계
);

-- 점검표 마스터 (POL05-S에서 관리)
CREATE TABLE policy_inspection_template (
  id              UUID PRIMARY KEY,
  section         VARCHAR(50),
  item_no         VARCHAR(20),
  item_title      VARCHAR(500),
  evaluation_criteria TEXT,
  sort_order      INTEGER,
  is_active       BOOLEAN DEFAULT true
);
```

## 12. 관련 인터페이스

- IF-005 새올 포틀릿: 점검자 지정·결과 보고·시기 도래 알림

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. POL04-V + POL04-D 통합 정의. 점검표 항목별 결과 + 개선조치 자동 연계 (IMP 모듈) |

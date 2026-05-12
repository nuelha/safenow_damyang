# PLN01-V — 안전계획 현황

> 화면 ID: **PLN01-V**
> 모듈: PLN (안전계획)
> SFR: SFR-004
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-004

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | PLN01-V |
| 화면명 | 안전계획 현황 |
| URL | `/safety-plans` (기본) |
| 화면 유형 | V (View) |
| 접근 권한 | 전체 열람 (데이터 스코프) / SHM+ 등록 |
| 기본 진입 화면 | ✅ |

## 2. 진입 경로

- GNB > 안전계획
- 대시보드 위젯 [안전계획 보기]
- TGT02-D 점검·이행 탭 [안전계획 보기]

## 3. 레이아웃

```
┌────────────────────────────────────────────────────┐
│ 안전계획                                            │
│ [현황] [계획 목록] [캘린더] [설정]                    │
│                                                    │
│ 📅 기준연도 [2026년 ▼]   부서 [전체 ▼]               │
│                                                    │
│ 요약 카드                                            │
│ ┌──────────┐┌──────────┐┌──────────┐┌──────────┐│
│ │ 전체 계획 ││ 수립 완료 ││ 진행 중   ││ 미수립    ││
│ │  N건     ││  N건     ││  N건     ││  N건 ⚠   ││
│ └──────────┘└──────────┘└──────────┘└──────────┘│
│                                                    │
│ ⚠ 연간 계획 미수립 관리대상 N건 [확인 →]              │
│                                                    │
│ 이행 진행률 (전체 평균) ████████░░ 78%                │
│                                                    │
│ 시기도래 (이번 달 마감 항목)                          │
│ • 군청 청사 정기 점검 (D-5) [상세]                   │
│ • 정수장 안전교육 (D-12) [상세]                      │
│ ...                                                │
│                                                    │
│ 관리대상별 계획 수립 현황                              │
│ [그래프 — 부서별 막대]                                │
└────────────────────────────────────────────────────┘
```

## 4. 표시 항목

### 4.1 요약 카드

| 카드 | 데이터 소스 |
|------|------------|
| 전체 계획 | `COUNT(safety_plans WHERE year=:y)` |
| 수립 완료 | `WHERE status='ESTABLISHED'` |
| 진행 중 | `WHERE status='IN_PROGRESS'` (실행 단계) |
| 미수립 | 활성 관리대상 중 해당 연도 계획 없는 건 |

### 4.2 미수립 안내 배너

```
대상: status='ACTIVE'인 관리대상 중 :year 연도 안전계획 없는 건
표시: COUNT >= 1 시 노출 + [확인 →] → PLN02-L `?filter=no_plan` 이동
```

### 4.3 이행 진행률

```
모든 계획의 plan_items 중 완료 비율:
  COUNT(plan_items WHERE status='DONE') / COUNT(plan_items) × 100
```

### 4.4 시기도래 위젯

`plan_items.due_date` 기준 D-30 이내 미완료 항목 5건. 색상 정책 결정사항 #15 적용.

### 4.5 관리대상별 계획 수립 그래프

부서별 또는 관리대상별 계획 수립 현황 시각화.

## 5. 필터 옵션

| 필터 | 옵션 |
|------|------|
| 기준연도 | 2026 / 2025 / 2024 |
| 부서 | 전체 / departments |

## 6. 버튼·링크 액션

| 요소 | 액션 |
|------|------|
| 탭 [계획 목록] | PLN01-L |
| 탭 [캘린더] | PLN03-V (월별 캘린더 뷰) |
| 탭 [설정] | PLN04-S (계획 항목 마스터·템플릿) |
| 미수립 [확인 →] | PLN01-L `?filter=no_plan` |
| 시기도래 행 [상세] | PLN02-D 이동 |
| 그래프 막대 클릭 | 해당 부서/관리대상 필터 |

## 7. 데이터 스코프

| 권한 | 보이는 범위 |
|------|----------|
| CEO | 전체 |
| GM | 본 부서 산하 관리대상 |
| SM/SHM | 담당 관리대상 |
| WKR | 본인 소속 |

## 8. 관련 화면 흐름

```
PLN01-V
   ├─ 탭 → PLN01-L / PLN03-V / PLN04-S
   ├─ 미수립 [확인 →] → PLN01-L (?filter=no_plan)
   └─ 시기도래 → PLN02-D
```

## 9. 관련 DB 테이블

- `safety_plans` (Phase 2 — 본 모듈 핵심):

```sql
CREATE TABLE safety_plans (
  id              UUID PRIMARY KEY,
  target_id       UUID NOT NULL REFERENCES targets(id),
  year            INTEGER NOT NULL,
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  status          ENUM('DRAFT','ESTABLISHED','IN_PROGRESS','COMPLETED') DEFAULT 'DRAFT',
  established_at  TIMESTAMP,
  owner_user_id   UUID NOT NULL REFERENCES users(id),
  approval_status ENUM('NOT_REQUESTED','REQUESTED','APPROVED','REJECTED') DEFAULT 'NOT_REQUESTED',
  approval_doc_url VARCHAR(500),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP,
  UNIQUE (target_id, year)
);
```

- `plan_items` (계획 세부 항목):

```sql
CREATE TABLE plan_items (
  id              UUID PRIMARY KEY,
  plan_id         UUID NOT NULL REFERENCES safety_plans(id) ON DELETE CASCADE,
  category        VARCHAR(50),                          -- 교육/점검/평가/예산집행/...
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  scheduled_month INTEGER,                              -- 1~12
  due_date        DATE,
  assigned_to     UUID REFERENCES users(id),
  status          ENUM('PENDING','IN_PROGRESS','DONE','SKIPPED') DEFAULT 'PENDING',
  completed_at    TIMESTAMP,
  cmp_schedule_id UUID REFERENCES compliance_schedules(id), -- CMP 자동 연계
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_plan_items_plan ON plan_items(plan_id);
CREATE INDEX idx_plan_items_due ON plan_items(due_date, status);
```

## 10. 관련 인터페이스

- IF-005 새올 포틀릿 (간접): 시기도래·미수립 알림

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성 |

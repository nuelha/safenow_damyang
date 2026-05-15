# BGT01-V — 예산 현황 (예방 총괄표)

> 화면 ID: **BGT01-V**
> 모듈: BGT (예산)
> SFR: SFR-008
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-008, 결정사항 #22 (3 depth 부서별 별도)

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | BGT01-V |
| 화면명 | 예산 현황 (예방 총괄표) |
| URL | `/budgets` (기본 진입) |
| 화면 유형 | V (View) |
| 접근 권한 | CEO·GM·SHM (열람) / SM (본 부서 열람) |
| 기본 진입 화면 | ✅ |

## 2. 진입 경로

- GNB > 안전보건 경영 > 안전보건 예산
- 대시보드 [예산 보기] 위젯
- 새올 포틀릿 알림 (편성 결재·집행 진행 등) 링크

## 3. 레이아웃

```
┌──────────────────────────────────────────────────────────┐
│ 예산                                                       │
│ [현황] [예방 항목 트리] [편성] [집행] [설정]                 │
│                                                            │
│ 📅 [2026년 ▼]   부서 [전체 ▼]                                │
│                                                            │
│ 예방 총괄표                                                 │
│ ┌──────────────┐┌──────────────┐┌──────────────┐         │
│ │ 편성액 합계   ││ 집행액 합계   ││ 집행률        │         │
│ │ 1,250,000천원││   825,000천원││  66.0%       │         │
│ └──────────────┘└──────────────┘└──────────────┘         │
│                                                            │
│ 결재 상태                                                   │
│ ⚪ 미요청 1건 / 🟠 결재 진행 중 2건 / 🟢 결재 완료 8건       │
│                                                            │
│ 부서별 편성·집행 현황                                        │
│ ─────────────────────────────────────────                  │
│ 부서          │편성액      │집행액     │집행률│ 관리       │
│ 자치행정과    │ 250,000   │ 180,000  │ 72%  │[편성/집행] │
│ 농업기술센터  │ 320,000   │ 215,000  │ 67%  │[편성/집행] │
│ 보건소        │ 180,000   │  95,000  │ 53%  │[편성/집행] │
│ ...                                                        │
│                                                            │
│ 예방 항목별 집행 현황 (1단계)                                │
│ ─────────────────────────────────────────                  │
│ 1단계 카테고리    │편성액      │집행액     │집행률         │
│ 안전보건교육      │ 350,000   │ 245,000  │ 70%          │
│ 시설 안전 점검    │ 280,000   │ 180,000  │ 64%          │
│ 위험성평가 시행   │ 150,000   │  98,000  │ 65%          │
│ 보호장비 구입     │ 200,000   │ 150,000  │ 75%          │
│ 도급사업 안전관리 │ 270,000   │ 152,000  │ 56%          │
│                                                            │
│ 부서별 × 항목별 매트릭스 (선택)                              │
│ [매트릭스 보기]                                              │
│                                                            │
│ 월별 집행 추이                                               │
│ [그래프 — 1~12월 누적]                                       │
└──────────────────────────────────────────────────────────┘
```

## 4. 표시 항목

### 4.1 예방 총괄표 카드

| 카드 | 데이터 소스 |
|------|------------|
| 편성액 합계 | `SUM(budget_items.amount WHERE year=:y)` |
| 집행액 합계 | `SUM(budget_executions.amount WHERE year=:y)` |
| 집행률 | 집행 / 편성 × 100 |

### 4.2 결재 상태 요약

`budgets.approval_status` 별 카운트.

### 4.3 부서별 편성·집행

```
budgets / budget_items GROUP BY department_id:
  편성액 = SUM(budget_items.amount)
  집행액 = SUM(budget_executions.amount)
  집행률 = 집행 / 편성 × 100

권한 범위 내 부서만 노출 (GM은 본 부서만, CEO는 전체)
```

### 4.4 예방 항목별 집행 (1단계 카테고리)

```
budget_items JOIN budget_categories WHERE depth=1
GROUP BY category_id

1단계 카테고리는 안전관리 공통 분류 (안전보건교육·시설점검·위험성평가·보호장비·도급 등)
```

### 4.5 월별 집행 추이

`budget_executions` GROUP BY month → 누적 라인 그래프.

## 5. 필터 옵션

| 필터 | 옵션 |
|------|------|
| 기준연도 | 2026 / 2025 / 2024 |
| 부서 | 전체 / departments (권한 범위 내) |

## 6. 버튼·링크 액션

| 요소 | 액션 |
|------|------|
| 탭 [예방 항목 트리] | BGT02-V (3 depth 트리) |
| 탭 [편성] | BGT03-F (편성 입력) |
| 탭 [집행] | BGT04-F (집행 입력) |
| 탭 [설정] | BGT05-S (예방 항목 마스터) |
| 부서 행 [편성/집행] | BGT03-F 또는 BGT04-F (?department_id=) |
| 1단계 카테고리 행 클릭 | BGT02-V 해당 카테고리 펼침 |
| [매트릭스 보기] | 부서 × 카테고리 매트릭스 표 (별도 모달 또는 새 페이지) |

## 7. 데이터 스코프

| 권한 | 보이는 범위 |
|------|----------|
| CEO | 전체 |
| GM | 본 부서만 (부서별 행 1건) |
| SHM | 본 부서 + 권한 위임 시 다부서 |
| SM | 본 부서 (열람만) |

## 8. 자동 처리

본 화면 자체 트리거 없음. 다음 작업의 결과 반영:

- 편성 결재 완료 → `budgets.approval_status='APPROVED'`
- 집행 등록 → `budget_executions` INSERT → 집행률 갱신
- 새 회계연도 시작 시 → 마스터 항목 자동 복사 (BGT05-S 설정에 따라)

## 9. 관련 화면 흐름

```
BGT01-V
   ├─ 탭 → BGT02-V / BGT03-F / BGT04-F / BGT05-S
   ├─ 부서 행 [편성/집행] → BGT03-F 또는 BGT04-F
   └─ 1단계 카테고리 행 → BGT02-V 펼침
```

## 10. 관련 DB 테이블

```sql
-- 예산 편성 본체 (연도 + 부서 단위)
CREATE TABLE budgets (
  id              UUID PRIMARY KEY,
  year            INTEGER NOT NULL,
  department_id   UUID NOT NULL REFERENCES departments(id),
  total_amount    BIGINT NOT NULL DEFAULT 0,
  status          ENUM('DRAFT','REQUESTED','APPROVED','REJECTED') DEFAULT 'DRAFT',
  approval_status ENUM('NOT_REQUESTED','REQUESTED','APPROVED','REJECTED') DEFAULT 'NOT_REQUESTED',
  approval_requested_at TIMESTAMP,
  approval_completed_at TIMESTAMP,
  approver_name   VARCHAR(100),
  approval_doc_url VARCHAR(500),
  created_by      UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP,
  UNIQUE (year, department_id)
);

-- 예방 항목 마스터 (3 depth 트리 + 부서별 별도)
CREATE TABLE budget_categories (
  id              UUID PRIMARY KEY,
  code            VARCHAR(50) NOT NULL,
  name            VARCHAR(200) NOT NULL,
  parent_id       UUID REFERENCES budget_categories(id),  -- 셀프 참조 (3 depth)
  depth           INTEGER NOT NULL,                        -- 1, 2, 3
  department_id   UUID REFERENCES departments(id) NULL,    -- NULL=공통, 값=부서별
  sort_order      INTEGER,
  is_active       BOOLEAN DEFAULT true
);

CREATE INDEX idx_budget_categories_parent ON budget_categories(parent_id);
CREATE INDEX idx_budget_categories_dept ON budget_categories(department_id, depth);

-- 편성 항목 (예산 + 카테고리 + 관리대상)
CREATE TABLE budget_items (
  id              UUID PRIMARY KEY,
  budget_id       UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  category_id     UUID NOT NULL REFERENCES budget_categories(id),
  target_id       UUID REFERENCES targets(id) NULL,        -- 관리대상 한정 시
  amount          BIGINT NOT NULL,                          -- 편성액 (원)
  description     TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- 집행 이력
CREATE TABLE budget_executions (
  id              UUID PRIMARY KEY,
  budget_item_id  UUID NOT NULL REFERENCES budget_items(id),
  execution_date  DATE NOT NULL,
  amount          BIGINT NOT NULL,                          -- 집행액
  description     TEXT,
  vendor          VARCHAR(200),                              -- 거래처
  attachments     JSON,                                       -- 영수증·증빙
  created_by      UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_executions_item ON budget_executions(budget_item_id);
CREATE INDEX idx_executions_date ON budget_executions(execution_date);
```

## 11. 관련 인터페이스

- IF-005 새올 포틀릿: 결재 안내·집행 진행 알림
- 온나라 결재 (간접 — 안내 팝업만, 결정사항 #2)

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. 예방 총괄표 + 부서별·항목별 집행 매트릭스 |

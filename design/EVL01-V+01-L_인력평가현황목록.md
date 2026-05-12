# EVL01-V · EVL01-L — 인력평가 현황 + 목록

> 화면 ID: **EVL01-V** (현황) / **EVL01-L** (목록)
> 모듈: EVL (인력평가)
> SFR: SFR-009
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-009

> ※ 안전보건관리책임자(8항목) / 관리감독자(5항목) 반기 1회 평가. 결재 시 온나라 안내 팝업.

---

## A. EVL01-V 인력평가 현황

### A.1 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | EVL01-V |
| URL | `/evaluations` (기본) |
| 화면 유형 | V (View) |
| 접근 권한 | CEO·GM·SHM (열람) / SM 본 부서 한정 |
| 기본 진입 화면 | ✅ |

### A.2 진입 경로

- GNB > 인력평가
- 대시보드 [인력평가 보기]

### A.3 레이아웃

```
┌────────────────────────────────────────────────────┐
│ 인력평가                                            │
│ [현황] [평가 목록] [설정]                            │
│                                                    │
│ 📅 [2026년 ▼] [상반기 / 하반기 / 전체]                │
│                                                    │
│ 평가 사이클 요약                                     │
│ ┌──────────┐┌──────────┐┌──────────┐┌──────────┐  │
│ │대상자    ││ 완료      ││ 진행중    ││ 미시작    │  │
│ │ 32명     ││ 18명     ││  8명     ││  6명 ⚠   │  │
│ └──────────┘└──────────┘└──────────┘└──────────┘  │
│                                                    │
│ ⚠ 반기 평가 마감 D-15. 미시작 6건 [평가 시작]        │
│                                                    │
│ 역할별 평가 진행                                     │
│ ─────────────────────────────────                  │
│ 안전보건관리책임자 (8항목)                            │
│   대상 12명 / 완료 7명 / 평균 점수 82점               │
│                                                    │
│ 관리감독자 (5항목)                                   │
│   대상 20명 / 완료 11명 / 평균 점수 78점              │
│                                                    │
│ 부서별 진행률                                        │
│ [그래프 — 부서별 막대]                               │
└────────────────────────────────────────────────────┘
```

### A.4 표시 항목

| 위젯 | 데이터 소스 |
|------|------------|
| 평가 사이클 요약 | `evaluations` GROUP BY status (대상자·완료·진행중·미시작) |
| 마감 D-day 안내 | 평가 사이클 마감일 - NOW() |
| 역할별 평가 진행 | `evaluation_role` (책임자/감독자) GROUP BY |
| 부서별 진행률 | GROUP BY department_id |

### A.5 평가 사이클

```
반기 1회 (상반기·하반기):
  - 상반기: 4월~6월 (마감 6월말)
  - 하반기: 10월~12월 (마감 12월말)

evaluation_cycles 마스터에서 정의 (EVL03-S 설정에서 관리)
```

### A.6 데이터 스코프

| 권한 | 보이는 범위 |
|------|----------|
| CEO | 전체 군청 평가 |
| GM | 본 부서 산하 평가 |
| SHM | 본 부서 + 평가자 지정된 다른 부서 |
| SM | 본 부서 (열람만) |

---

## B. EVL01-L 평가 목록

### B.1 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | EVL01-L |
| URL | `/evaluations/list` |
| 화면 유형 | L (List) |
| 접근 권한 | CEO·GM·SHM |

### B.2 진입 경로

- GNB **안전보건 경영** > LNB **인력평가 목록** (EVL 그룹)
- EVL01-V 미시작 배너 [평가 시작]
- 새올 포틀릿 알림 (평가자 지정·완료 마감 등) 링크

> 모듈 내 다른 화면(현황 / 설정)으로의 이동은 좌측 사이드 메뉴(LNB)로 처리.

### B.3 레이아웃

```
┌────────────────────────────────────────────────────┐
│ ● 평가 목록                                          │
│   안전보건 인력 정량 평가 진행 및 결과 관리            │
│                                                    │
│ 필터: [연도/반기▼][부서▼][역할▼][상태▼][평가자▼]     │
│       [검색]                                       │
│                              [+ 평가 일괄 생성]      │
│                                                    │
│ 대상자    │ 부서       │ 역할          │ 평가자│점수│상태 │
│ ─────────────────────────────────────────────────│
│ 홍길동    │자치행정과   │안전보건관리책임자│김안전│82점│완료│
│ 박팀장    │행정지원팀   │관리감독자       │김안전│78점│완료│
│ 이팀장    │인사담당팀   │관리감독자       │김안전│-  │진행│
│ ...                                                │
│                                                    │
│ [페이지네이션]                                      │
└────────────────────────────────────────────────────┘
```

### B.4 목록 컬럼

| 컬럼 | 데이터 소스 |
|------|------------|
| 대상자 | JOIN `users.name` (`subject_user_id`) |
| 부서 | JOIN `departments.name` |
| 역할 | `evaluation_role` 배지 (책임자/감독자) |
| 평가자 | JOIN `users.name` (`evaluator_id`) |
| 점수 | `total_score` |
| 결과 | `result` 배지 (우수/적합/보완필요/미흡) |
| 상태 | `status` 배지 (미시작/진행중/완료) |
| 결재 | `approval_status` 배지 |

### B.5 평가 결과 배지

| 코드 | 표시명 | 점수 범위 | 색상 |
|------|--------|----------|------|
| `EXCELLENT` | 우수 | 90~100 | 파랑 |
| `GOOD` | 적합 | 70~89 | 초록 |
| `NEEDS_IMPROVEMENT` | 보완 필요 | 50~69 | 주황 |
| `INSUFFICIENT` | 미흡 | 0~49 | 빨강 |

### B.6 [+ 평가 일괄 생성] 동작

```
SHM+가 반기 시작 시 클릭:
  1. 평가 사이클 선택 (2026 상반기 등)
  2. 대상자 자동 추출:
     - 안전보건관리책임자: 부서장(departments.head_user_id) + RESPONSIBLE 매핑된 사용자
     - 관리감독자: dedicated_personnel WHERE role_type='SUPERVISOR'
  3. evaluations 일괄 INSERT (status='NOT_STARTED', cycle_id=:c)
  4. 평가자(SHM) 자동 매핑 (또는 사용자 별도 지정)
  5. 새올 알림 (대상자 + 평가자에게 평가 진행 안내)
```

### B.7 버튼·링크 액션

| 요소 | 액션 |
|------|------|
| 필터 셋 | URL `?param=` 동기화 |
| `[+ 평가 일괄 생성]` | 사이클 선택 모달 → 일괄 INSERT |
| 행 클릭 | EVL02-D (평가 상세) |
| 미시작 행 [평가 시작] | EVL02-F 또는 EVL02-D 진입 |

### B.8 데이터 스코프

EVL01-V §A.6과 동일.

---

## 공통 — 관련 화면 흐름

```
EVL01-V (현황) ↔ EVL01-L (목록)
   ├─ 행 클릭 → EVL02-D (평가 상세·점검표)
   ├─ [+ 평가 일괄 생성] → 사이클 선택 모달 → 일괄 INSERT
   └─ 탭 [설정] → EVL03-S
```

## 공통 — 관련 DB 테이블

```sql
-- 평가 사이클 (반기)
CREATE TABLE evaluation_cycles (
  id              UUID PRIMARY KEY,
  year            INTEGER NOT NULL,
  half            ENUM('H1','H2') NOT NULL,         -- 상반기·하반기
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  status          ENUM('UPCOMING','ACTIVE','CLOSED') DEFAULT 'UPCOMING',
  UNIQUE (year, half)
);

-- 평가 본체
CREATE TABLE evaluations (
  id              UUID PRIMARY KEY,
  cycle_id        UUID NOT NULL REFERENCES evaluation_cycles(id),
  subject_user_id UUID NOT NULL REFERENCES users(id),     -- 평가 대상자
  evaluator_id    UUID NOT NULL REFERENCES users(id),     -- 평가자 (SHM)
  evaluation_role ENUM('RESPONSIBLE','SUPERVISOR') NOT NULL, -- 안전보건관리책임자/관리감독자
  department_id   UUID NOT NULL REFERENCES departments(id),
  status          ENUM('NOT_STARTED','IN_PROGRESS','COMPLETED') DEFAULT 'NOT_STARTED',
  total_score     INTEGER,
  result          ENUM('EXCELLENT','GOOD','NEEDS_IMPROVEMENT','INSUFFICIENT'),
  approval_status ENUM('NOT_REQUESTED','REQUESTED','APPROVED','REJECTED') DEFAULT 'NOT_REQUESTED',
  approver_name   VARCHAR(100),
  approval_doc_url VARCHAR(500),
  completed_at    TIMESTAMP,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP,
  UNIQUE (cycle_id, subject_user_id, evaluation_role)
);

CREATE INDEX idx_evaluations_cycle_status ON evaluations(cycle_id, status);
CREATE INDEX idx_evaluations_subject ON evaluations(subject_user_id);
CREATE INDEX idx_evaluations_dept ON evaluations(department_id);

-- 평가 항목별 점수
CREATE TABLE evaluation_items (
  id              UUID PRIMARY KEY,
  evaluation_id   UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
  template_item_id UUID NOT NULL,                          -- 마스터 항목 ID
  item_no         INTEGER,                                  -- 1~8 (책임자) / 1~5 (감독자)
  item_title      VARCHAR(500),
  score           INTEGER,                                  -- 0~100 또는 0~max_score
  max_score       INTEGER NOT NULL,
  comment         TEXT,                                      -- 평가 의견
  evidence_attachments JSON
);
```

## 공통 — 관련 인터페이스

- IF-005 새올 포틀릿: 평가자 지정·완료 마감·결재 안내

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. EVL01-V · EVL01-L 통합 정의. 반기 사이클·역할별(책임자/감독자) 분기 |

# POL01-V — 안전경영방침 현황 + 목표·KPI

> 화면 ID: **POL01-V** (현황) / **POL03-V** (목표·KPI 통합)
> 모듈: POL (안전경영방침)
> SFR: SFR-005
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-005, 결정사항 #2 (온나라 결재 안내)

> ※ 안전경영방침은 1단계 관리주체(담양군) 단위 관리이므로 시스템 전체에 단일·소수 버전만 존재. 본 화면에서 현황과 목표·KPI를 통합 표시.

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | POL01-V |
| 화면명 | 안전경영방침 현황 (목표·KPI 통합) |
| URL | `/policies` (기본) |
| 화면 유형 | V (View) |
| 접근 권한 | 전체 열람 / CEO·GM·SHM 등록·점검 |
| 기본 진입 화면 | ✅ |

## 2. 진입 경로

- GNB > 안전경영방침
- 대시보드 [경영방침 보기] 위젯
- 새올 포틀릿 알림 (방침 점검 시기·결재 등) 링크

## 3. 레이아웃

```
┌────────────────────────────────────────────────────┐
│ 안전경영방침                                          │
│ [현황] [방침 이력] [경영방침 점검] [설정]              │
│                                                    │
│ 현재 적용 방침                                        │
│ ─────────────────────────────────                  │
│ 담양군 안전보건 경영방침 v2.5                         │
│ 제정·개정일: 2026-01-20  결재: 군수 결재 완료         │
│ [방침 본문 보기]  [PDF 다운로드]                       │
│                                                    │
│ 안전보건 목표 (KPI)                                   │
│ ─────────────────────────────────                  │
│ KPI                       │ 목표 │ 현재 │ 진행률    │
│ 산업재해 발생률           │ 0    │ 0    │ ████ 100%│
│ 정기 위험성평가 시행률    │ 100% │ 87%  │ ████░ 87%│
│ 안전보건교육 이수율       │ 100% │ 92%  │ ████░ 92%│
│ 안전점검 실시율           │ 100% │ 78%  │ ███░░ 78%│
│ 의견청취 처리율           │ 90%  │ 85%  │ ████░ 94%│
│ ...                                                │
│                                                    │
│ 경영방침 점검 결과                                    │
│ ─────────────────────────────────                  │
│ 최근 점검: 2026-04 (정기)                            │
│   ● 9개 항목 / 적합 8 / 부적합 1 / 보완 0           │
│   [점검 상세 보기]                                    │
│                                                    │
│ 근거 법령 (방침 ↔ 법령 매칭)                          │
│ ─────────────────────────────────                  │
│ • 중대재해처벌법 시행령 제4조 ↔ 본 방침 §1, §2       │
│ • 산업안전보건법 제5조 ↔ 본 방침 §3                  │
│ • 산업안전보건법 제15조 ↔ 본 방침 §4                 │
│ ...                                                │
│                                                    │
│ 결재 상태                                            │
│ ✓ 결재 완료 (2026-01-20)                            │
└────────────────────────────────────────────────────┘
```

## 4. 표시 항목

### 4.1 현재 적용 방침

| 항목 | 데이터 소스 |
|------|------------|
| 방침명 | `policies WHERE is_current=true` 1건 |
| 버전 | `policies.version` |
| 제정·개정일 | `policies.effective_date` |
| 결재 정보 | `policies.approval_status` + `approver_name` |

### 4.2 안전보건 목표 (KPI)

| KPI | 산출 |
|------|------|
| 산업재해 발생률 | `COUNT(incidents WHERE severity IN ('MAJOR','SERIOUS') AND year=:y)` / 목표 0 |
| 정기 위험성평가 시행률 | 완료 / 전체 (올해) |
| 안전보건교육 이수율 | (Phase 3 EDU) 이수 / 전체 |
| 안전점검 실시율 | (Phase 3 INS) 실시 / 계획 |
| 의견청취 처리율 | (Phase 3 OPN) 처리 / 접수 |

> KPI 항목·산출 공식은 `policy_kpis` 마스터 (POL02-F 등록 시 정의).

### 4.3 경영방침 점검 결과

`policy_inspections` 최근 점검 결과 요약. 적합/부적합/보완 카운트 + [점검 상세 보기] → POL04-V 이동.

### 4.4 근거 법령 매칭

```
policies.legal_references JSON 구조:
  [
    { "law": "중대재해처벌법 시행령 제4조",
      "policy_section": "§1, §2",
      "description": "안전보건관리체계 구축" },
    ...
  ]
```

## 5. 버튼·링크 액션

| 요소 | 액션 |
|------|------|
| 탭 [방침 이력] | POL01-L 이동 (버전 이력) |
| 탭 [경영방침 점검] | POL04-V 이동 |
| 탭 [설정] | POL05-S 이동 (KPI 마스터 등) |
| [방침 본문 보기] | POL02-D 이동 |
| [PDF 다운로드] | 방침 본문·근거법령·KPI 인쇄용 |
| [점검 상세 보기] | POL04-V 최근 점검 결과 |
| KPI 행 클릭 | 해당 모듈 화면 이동 (RSK02-L / INS02-L 등) |

## 6. 데이터 갱신·캐싱

| 위젯 | 갱신 |
|------|------|
| 현재 방침 | 진입 시 |
| KPI | 진입 시 + 30분 캐싱 (집계 비용 큼) |
| 점검 결과 | 진입 시 |

## 7. 데이터 스코프

방침은 군청 1단계 단위이므로 데이터 스코프 적용 없음. 모든 사용자가 동일 방침 조회.

## 8. 관련 화면 흐름

```
POL01-V
   ├─ 탭 → POL01-L / POL04-V / POL05-S
   ├─ [방침 본문 보기] → POL02-D
   ├─ [점검 상세] → POL04-V
   └─ KPI 행 → 해당 모듈 (RSK02-L, INS02-L 등)
```

## 9. 관련 DB 테이블

```sql
-- 안전경영방침 본체 (Phase 2)
CREATE TABLE policies (
  id              UUID PRIMARY KEY,
  version         VARCHAR(20) NOT NULL UNIQUE,        -- v1.0 / v2.5 등
  title           VARCHAR(200) NOT NULL,
  body_html       TEXT NOT NULL,                       -- 방침 본문 HTML
  legal_references JSON,                               -- 근거 법령 매칭 (§4.4)
  effective_date  DATE NOT NULL,                       -- 시행일
  is_current      BOOLEAN DEFAULT false,               -- 현재 적용 여부 (1건만 true)
  approval_status ENUM('NOT_REQUESTED','REQUESTED','APPROVED','REJECTED') DEFAULT 'NOT_REQUESTED',
  approval_requested_at TIMESTAMP,
  approval_completed_at TIMESTAMP,
  approver_name   VARCHAR(100),
  approval_doc_url VARCHAR(500),
  created_by      UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMP DEFAULT NOW()
);

-- KPI 정의 + 측정값
CREATE TABLE policy_kpis (
  id              UUID PRIMARY KEY,
  policy_id       UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
  name            VARCHAR(200) NOT NULL,
  target_value    VARCHAR(50),                         -- "0" / "100%" / "90%" 등
  formula         TEXT,                                -- 산출 공식 (문서)
  unit            VARCHAR(20),                         -- % / 건 / 시간
  sort_order      INTEGER
);

-- KPI 측정 이력 (분기별 또는 월별)
CREATE TABLE policy_kpi_measurements (
  id              UUID PRIMARY KEY,
  kpi_id          UUID NOT NULL REFERENCES policy_kpis(id),
  measure_date    DATE NOT NULL,
  measured_value  VARCHAR(50),
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);
```

## 10. 관련 인터페이스

- IF-005 새올 포틀릿 (간접): 결재·점검 임박 알림

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. 현재 방침 + KPI + 점검 결과 + 근거 법령 통합 표시 |

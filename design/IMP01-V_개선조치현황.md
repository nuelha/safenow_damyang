# IMP01-V — 개선조치 현황

> 화면 ID: **IMP01-V**
> 모듈: IMP (개선조치)
> SFR: SFR-003
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-003, 결정사항 #19 (재발방지대책 2단계)

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | IMP01-V |
| 화면명 | 개선조치 현황 |
| URL | `/improvements` (기본 진입) |
| 화면 유형 | V (View) |
| 접근 권한 | SHM+ (열람·등록) / 담당자(WKR) 본인 담당 한정 열람·실행 |
| 기본 진입 화면 | ✅ |

## 2. 진입 경로

- GNB > 개선조치
- 대시보드 위젯 [개선조치 전체 보기]
- RSK01-V·RSK03-L 개선조치 위젯
- 새올 포틀릿 알림 (자동 생성·기한 임박 등) 링크

## 3. 레이아웃

```
┌────────────────────────────────────────────────────┐
│ 개선조치                                            │
│ [현황] [전체 목록] [재발방지대책]                     │
│                                                    │
│ 📅 기준연도 [2026년 ▼]   부서 [전체 ▼]               │
│                                                    │
│ 요약 카드                                            │
│ ┌──────┐┌──────┐┌──────┐┌──────┐                  │
│ │ 전체  ││ 예정  ││ 진행중 ││ 완료  │                  │
│ │ N건  ││ N건  ││ N건  ││ N건  │                  │
│ └──────┘└──────┘└──────┘└──────┘                  │
│                                                    │
│ ⚠ 기한초과 N건 [확인 →]                              │
│                                                    │
│ 시기도래 (1주 이내)                                  │
│ ─────────────────────────────────                  │
│ • 본관 전기실 절연 점검 (D-2) [상세]                 │
│ ...                                                │
│                                                    │
│ 출처별 분포                                          │
│ 위험성평가 N / 안전점검 N / 의견청취 N / 사고 N      │
│                                                    │
│ 부서별 진행률                                        │
│ [그래프]                                            │
└────────────────────────────────────────────────────┘
```

## 4. 표시 항목

### 4.1 요약 카드

| 카드 | 데이터 소스 |
|------|------------|
| 전체 | `COUNT(improvements WHERE year=:y)` |
| 예정 | `WHERE status='PENDING'` |
| 진행중 | `WHERE status='IN_PROGRESS'` |
| 완료 | `WHERE status='DONE'` |

### 4.2 기한초과 안내 배너

```
WHERE due_date < NOW() AND status != 'DONE'
COUNT 산출 → 1건 이상이면 빨강 배너 노출
[확인 →] 클릭 시 IMP01-L `?filter=overdue` 이동
```

### 4.3 시기도래 위젯

```
WHERE status != 'DONE' AND due_date BETWEEN NOW() AND NOW()+7일
정렬: due_date ASC
표시: 제목 + 마감일 D-N + [상세] 버튼
색상 (결정사항 #15):
  D-1주: 노랑 / D-당일: 주황 / D+(초과): 빨강
```

### 4.4 출처별 분포 (source_type)

| source_type | 표시명 |
|------------|--------|
| risk_assessment | 위험성평가 |
| inspection | 안전점검 |
| opinion | 의견청취 |
| incident | 사고 (재발방지대책) |
| manual | 수동 등록 |

### 4.5 부서별 진행률

`improvements` GROUP BY `target_id` → `departments.name` 막대 그래프.

## 5. 필터 옵션

| 필터 | 옵션 |
|------|------|
| 기준연도 | 2026 / 2025 / 전체 |
| 부서 | 전체 / departments 목록 (권한 범위 내) |

## 6. 버튼·링크 액션

| 요소 | 액션 |
|------|------|
| LNB [개선조치 목록] | IMP01-L (`/improvements/list`) |
| LNB [재발방지대책] | IMP02-L (`/improvements/incident_prevention`) — 사고 출처 한정 |
| 카드 클릭 | IMP01-L 해당 상태 필터로 이동 |
| 기한초과 [확인 →] | IMP01-L `?filter=overdue` |
| 시기도래 행 [상세] | IMP01-D 이동 |

## 7. 데이터 스코프

| 권한 | 보이는 범위 |
|------|----------|
| CEO | 전체 |
| GM | 본 부서 산하 관리대상의 개선조치 |
| SM/SHM | 본인 담당 + 본 부서 (SHM) |
| WKR | 본인이 담당자(assigned_to)인 항목만 |

## 8. 관련 화면 흐름

```
IMP01-V
   ├─ 탭 → IMP01-L / IMP02-L
   ├─ 카드/시기도래 → IMP01-L 또는 IMP01-D
   └─ 부서별 그래프 → 부서 필터 적용
```

## 9. 관련 DB 테이블

- `improvements` (Phase 2 — 본 모듈 핵심 테이블):

```sql
CREATE TABLE improvements (
  id              UUID PRIMARY KEY,
  source_type     ENUM('risk_assessment','inspection','opinion','incident','manual') NOT NULL,
  source_id       UUID NULL,                          -- risk_factors.id 등 출처 FK
  target_id       UUID NOT NULL REFERENCES targets(id),
  department_id   UUID REFERENCES departments(id),
  description     TEXT NOT NULL,
  control_measure TEXT,                                -- 감소대책·시정조치 내용
  assigned_to     UUID REFERENCES users(id),           -- 담당자
  status          ENUM('PENDING','IN_PROGRESS','DONE') DEFAULT 'PENDING',
  due_date        DATE,
  completed_at    TIMESTAMP NULL,
  attachments     JSON,
  created_by      UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP
);

CREATE INDEX idx_improvements_status_due ON improvements(status, due_date);
CREATE INDEX idx_improvements_source ON improvements(source_type, source_id);
CREATE INDEX idx_improvements_target ON improvements(target_id);
CREATE INDEX idx_improvements_assignee ON improvements(assigned_to);
```

- `incidents` (Phase 2 — 사고 등록):

```sql
CREATE TABLE incidents (
  id              UUID PRIMARY KEY,
  target_id       UUID NOT NULL REFERENCES targets(id),
  incident_date   TIMESTAMP NOT NULL,
  severity        ENUM('NEAR_MISS','MINOR','MAJOR','SERIOUS') NOT NULL,
  description     TEXT NOT NULL,                       -- 사고 개요
  cause_analysis  TEXT,                                -- 원인 분석
  attachments     JSON,
  reporter_id     UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMP DEFAULT NOW()
);
```

## 10. 관련 인터페이스

- 외부 인터페이스 없음
- IF-005 새올 포틀릿 (간접): 자동 생성·기한 임박 알림

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성 |

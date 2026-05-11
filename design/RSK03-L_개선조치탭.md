# RSK03-L — 개선조치 탭

> 화면 ID: **RSK03-L**
> 모듈: RSK (위험성평가)
> SFR: SFR-007 / SFR-003 (개선조치 IMP 모듈)
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-007·003, DB-001 §4.2 risk_factors / IMP 모듈

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | RSK03-L |
| 화면명 | 개선조치 탭 (위험성평가 출처) |
| URL | `/risk-assessment?tab=improvements` |
| 화면 유형 | L (List) |
| 접근 권한 | SHM+ (열람·진행) / 데이터 스코프 적용 |

## 2. 역할

IMP01-L (개선조치 모듈) 의 source_type='risk_assessment' 필터링 뷰. 위험성평가에서 자동 생성된 개선조치만 별도 탭에서 조회.

> 본 화면은 RSK 모듈의 보조 탭. 실제 개선조치 CRUD는 IMP 모듈(Phase 2)에서 담당.

## 3. 진입 경로

- GNB > 위험성평가 > 탭 [개선조치]
- RSK01-V 개선조치 위젯 [전체보기]
- RSK02-D 위험요인 행의 [→ 개선조치 imp-N] 링크 (개별 항목)

## 4. 레이아웃

```
┌──────────────────────────────────────────────────────────┐
│ 위험성평가                                                │
│ [현황] [평가 목록] [개선조치] [설정]                       │
│                                                          │
│ 요약 카드                                                  │
│ 기한초과 N / 조치중 N / 예정 N / 완료 N                     │
│                                                          │
│ 필터: [부서▼][담당자▼][상태▼][기한▼][검색]                │
│                                                          │
│ 위험요인          │출처 평가│담당자 │기한      │상태  │   │
│ ─────────────────┼────────┼──────┼─────────┼─────│   │
│ 전기 누전·감전    │청사 평가│김안전│2026-06-30│진행중│   │
│ 추락 위험        │청사 평가│이안전│2026-05-30│기한초과⚠│   │
│ ...                                                      │
│                                                          │
│ [페이지네이션]                                            │
└──────────────────────────────────────────────────────────┘
```

## 5. 표시 항목

### 5.1 요약 카드

| 항목 | 데이터 소스 |
|------|------------|
| 기한초과 | `COUNT(improvements WHERE source_type='risk_assessment' AND due_date < NOW() AND status != 'DONE')` |
| 조치중 | `COUNT WHERE status='IN_PROGRESS'` |
| 예정 | `COUNT WHERE status='PENDING' AND due_date >= NOW()` |
| 완료 | `COUNT WHERE status='DONE'` |

### 5.2 목록 컬럼

| 컬럼 | 데이터 소스 | 비고 |
|------|------------|------|
| 위험요인 | JOIN `risk_factors.description` | improvements.source_id → risk_factor.id |
| 출처 평가 | JOIN `risk_assessments.name` | risk_factor.assessment_id → assessment.name |
| 관리대상 | JOIN `targets.name + type 배지` | |
| 담당자 | JOIN `users.name` (improvements.assignee_user_id) | |
| 기한 | `improvements.due_date` | 기한초과 시 빨강 강조 |
| 상태 | `improvements.status` 배지 | PENDING / IN_PROGRESS / DONE / CANCELLED |

### 5.3 데이터 소스 (SQL 예시)

```sql
SELECT i.*, rf.description AS risk_factor, r.name AS source_assessment,
       t.name AS target_name, u.name AS assignee_name
FROM improvements i
JOIN risk_factors rf ON i.source_id = rf.id
JOIN risk_assessments r ON rf.assessment_id = r.id
JOIN targets t ON rf.target_id = t.id
LEFT JOIN users u ON i.assignee_user_id = u.id
WHERE i.source_type = 'risk_assessment'
  AND [권한 범위 필터]
ORDER BY i.due_date ASC
```

## 6. 상태 배지

| status | 표시명 | 색상 | 조건 |
|--------|--------|------|------|
| `PENDING` | 대기 | 회색 | 등록만 됨, 진행 안 함 |
| `IN_PROGRESS` | 진행중 | 파랑 | 진행 시작 |
| `DONE` | 완료 | 초록 | 조치 완료 |
| `CANCELLED` | 취소 | 회색 | 위험요인 재평가로 불필요 |
| — | 기한초과 ⚠ | 빨강 | due_date < NOW() AND status != 'DONE' (별도 배지) |

## 7. 필터 옵션

| 필터 | 옵션 | 비고 |
|------|------|------|
| 부서 | 전체 / departments 목록 | 권한 범위 내. JOIN targets.department_id |
| 담당자 | 전체 / users 검색 | `assignee_user_id` |
| 상태 | 전체 / 대기 / 진행중 / 완료 / 취소 | |
| 기한 | 전체 / 기한초과 / 1주 내 / 1개월 내 | |
| 검색 | 위험요인·평가명 부분일치 | |

## 8. 버튼·링크 액션

| 요소 | 위치 | 액션 | 조건·비고 |
|------|------|------|---------|
| 탭 전환 | 상단 | URL `?tab=` 동기화 | |
| 필터 셋 | 필터 바 | 각 컬럼별 필터 + URL 동기화 | |
| 행 클릭 | 목록 | IMP01-D 이동 (`?from=risk_assessment`) | |
| 출처 평가 링크 | 목록 행 | RSK02-D 이동 (해당 평가) | |
| 위험요인 클릭 | 목록 행 | RSK02-D 이동 + 해당 위험요인 행 scroll | |
| 페이지 번호 | 페이지네이션 | 페이지 이동 (URL `?page=`) | |

## 9. 자동 처리 로직

본 화면 자체 트리거 없음. 다음 외부 자동 작업이 본 화면에 반영:

- **위험요인 불허 → improvements 자동 INSERT** (DB-001 §9.3): RSK02-D에서 위험성 결정 '불허' 선택 시 자동 생성
- **기한 임박·초과 알림** (IMP 모듈, Phase 2): D-7 / D-3 / D-1 / 초과 시점에 담당자에게 새올 포틀릿 알림

## 10. 데이터 스코프

| 권한 | 보이는 범위 |
|------|----------|
| CEO | 전체 |
| GM | 본 부서 산하 관리대상의 개선조치 |
| SM/SHM | 본인 담당 관리대상의 개선조치 + 본인이 담당자 |
| WKR | 본인 소속 관리대상의 개선조치 (열람만) |
| SUB | 본인 계약 관리대상의 개선조치 |
| CON | 위임 범위 |

## 11. 오류 처리

| 케이스 | 메시지 | 처리 |
|--------|--------|------|
| 데이터 스코프 결과 없음 | "조회 가능한 개선조치가 없습니다" | 빈 화면 + 안내 |
| 필터 조합 결과 없음 | "조건에 맞는 개선조치가 없습니다" | 빈 목록 + 필터 초기화 |

## 12. 관련 화면 흐름

```
RSK03-L
   ├─ 행 클릭 → IMP01-D (Phase 2)
   ├─ 출처 평가 링크 → RSK02-D
   └─ (Phase 2 IMP 모듈 진입 시 본 화면은 IMP01-L의 필터링 뷰로 통합 가능)
```

## 13. 관련 DB 테이블

- `improvements` (DB-001 §7 — Phase 2): 본 화면의 주요 데이터 (source_type='risk_assessment')
- `risk_factors` (DB-001 §4.2): JOIN 위험요인
- `risk_assessments` (DB-001 §4.1): JOIN 출처 평가
- `targets` (DB-001 §2.3): JOIN 관리대상
- `users` (DB-001 §2.2): 담당자

## 14. 관련 인터페이스

- 외부 인터페이스 없음
- IF-005 새올 포틀릿 (간접): 기한 임박·초과 알림 (IMP 모듈에서 발송)

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. IMP 모듈의 source_type='risk_assessment' 필터링 뷰로 정의 |

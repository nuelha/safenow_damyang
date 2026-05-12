# IMP01-D — 개선조치 상세 (+ 재발방지대책 2단계)

> 화면 ID: **IMP01-D**
> 모듈: IMP (개선조치)
> SFR: SFR-003
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-003, 결정사항 #19 (재발방지대책 2단계)

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | IMP01-D |
| 화면명 | 개선조치 상세 |
| URL | `/improvements/:id` |
| 화면 유형 | D (Detail) |
| 접근 권한 | SHM+ (담당) / 담당자 본인 (실행 처리) / WKR 본인 담당 |

## 2. 진입 경로

- IMP01-L 행 클릭
- IMP01-V 시기도래 행 [상세]
- RSK02-D 위험요인 행 [→ 개선조치 imp-N] 링크 (자동 생성된 경우)
- 새올 포틀릿 알림 (담당자 지정·기한 임박 등) 링크
- 사고(`source_type='incident'`) 상세에서 [재발방지조치 보기]

## 3. 레이아웃

```
┌────────────────────────────────────────────────────┐
│ ← 목록                          [수정][담당자 변경] │
│                                                    │
│ [출처 배지: 위험성평가] [관리대상: 군청 청사]         │
│ 전기 누전·감전 - 본관 2층 전기실 절연 점검·교체      │
│                                                    │
│ 기본정보                                            │
│ ─────────────────────────────────                  │
│ 출처: 위험성평가 (RSK 평가 ID #abc-123) [원본 보기] │
│ 관리대상: 군청 청사 [상세 보기]                     │
│ 담당부서: 자치행정과                                │
│ 담당자: 김안전 (자치행정과 7급)                     │
│ 기한: 2026-06-30 (D-50)                            │
│ 상태: [진행중] (2026-04-15 시작)                    │
│                                                    │
│ 감소대책·조치 내용                                   │
│ ─────────────────────────────────                  │
│ 본관 2층 전기실 전선 절연 상태 점검 후 노후 전선     │
│ 일괄 교체. 점검 주기 6개월로 단축.                  │
│                                                    │
│ 실행 이력                                            │
│ ─────────────────────────────────                  │
│ 2026-04-15  김안전  진행 시작                       │
│ 2026-04-20  김안전  현장 점검 완료 (보고서 첨부)    │
│ 2026-05-10  김안전  업체 견적 수령 (3건)            │
│                                              [+ 진행 기록]│
│                                                    │
│ 첨부                                                │
│ ─────────────────────────────────                  │
│ 📎 현장점검보고서_20260420.pdf                       │
│ 📎 견적서_A전기.pdf                                  │
│                                              [+ 파일 첨부]│
│                                                    │
│                                  [실행 시작] [완료 처리]│
└────────────────────────────────────────────────────┘
```

## 4. 표시 항목

### 4.1 기본정보

| 항목 | 데이터 소스 | 비고 |
|------|------------|------|
| 출처 배지 | `source_type` | 5종 |
| 관리대상 | JOIN `targets.name` + type 배지 | |
| 출처 원본 링크 | source_type별 분기 (§4.2) | [원본 보기] |
| 담당부서 | JOIN `departments.name` | |
| 담당자 | JOIN `users.name` (`assigned_to`) | 미지정 시 [지정] |
| 기한 | `due_date` + D-N 산출 | |
| 상태 | `status` 배지 | |
| 시작일 | `IN_PROGRESS` 전환 시각 | |
| 완료일 | `completed_at` | DONE 시 표시 |

### 4.2 출처 원본 링크 분기

| source_type | [원본 보기] 링크 |
|------------|----------------|
| `risk_assessment` | RSK02-D `?id=:source_id`의 위험요인 행 강조 |
| `inspection` | INS02-D `?id=:source_id` (Phase 3) |
| `opinion` | OPN02-D `?id=:source_id` (Phase 3) |
| `incident` | IMP02-D `?id=:incident_id` (사고 상세 — 재발방지 모드) |
| `manual` | (없음) |

### 4.3 감소대책·조치 내용

`improvements.control_measure` 표시. 등록 시 비어있으면 [+ 조치 내용 입력] 버튼.

### 4.4 실행 이력

```
improvement_executions (Phase 2 — 본 모듈에서 정의):
  CREATE TABLE improvement_executions (
    id              UUID PRIMARY KEY,
    improvement_id  UUID NOT NULL REFERENCES improvements(id) ON DELETE CASCADE,
    executor_id     UUID NOT NULL REFERENCES users(id),
    execution_date  TIMESTAMP NOT NULL,
    content         TEXT NOT NULL,
    attachments     JSON,
    created_at      TIMESTAMP DEFAULT NOW()
  );

표시: 시각 + 실행자 + 내용 + 첨부 다운로드 링크
```

### 4.5 첨부

`improvements.attachments` JSON + `improvement_executions.attachments` JSON 통합 표시.

## 5. 버튼·링크 액션

| 요소 | 위치 | 액션 | 조건·비고 |
|------|------|------|---------|
| `[← 목록]` | 상단 좌측 | IMP01-L 복귀 | |
| `[수정]` | 상단 우측 | IMP02-F 수정 모드 | SHM+. 자동 생성 항목도 수정 가능 (감소대책·기한·담당자 등) |
| `[담당자 변경]` | 상단 우측 | IMP01-M 모달 | SHM+ |
| `[원본 보기]` | 기본정보 | 출처 원본 화면 이동 (§4.2) | source_type별 분기 |
| `[상세 보기]` (관리대상) | 기본정보 | TGT02-D 이동 | |
| `[+ 진행 기록]` | 실행 이력 카드 | 진행 기록 등록 모달 (§7.1) | 담당자 또는 SHM+ |
| `[+ 파일 첨부]` | 첨부 카드 | 파일 업로드 모달 | |
| `[실행 시작]` | 푸터 | `status='IN_PROGRESS'` 전환 + 시작 기록 자동 INSERT | `status='PENDING'`일 때만 |
| `[완료 처리]` | 푸터 | `status='DONE'` 전환 + 완료 기록 모달 (§7.2) | 진행 기록 1건 이상 시 활성 권장 |

## 6. 입력 항목

### 6.1 진행 기록 등록 모달

| 필드 | 타입 | 필수 |
|------|------|------|
| 실행일자 | DATETIME | ✅ (기본: 현재) |
| 내용 | TEXTAREA | ✅ |
| 첨부 | FILE | ❌ |

### 6.2 완료 처리 모달

| 필드 | 타입 | 필수 |
|------|------|------|
| 완료일자 | DATE | ✅ (기본: 오늘) |
| 완료 내용 요약 | TEXTAREA | ✅ |
| 최종 결과 첨부 | FILE | ❌ (권장) |
| 효과성 평가 | RATING (1~5) | ❌ |

## 7. 자동 처리 로직

### 7.1 [+ 진행 기록] 저장

```
1. improvement_executions INSERT
2. improvements.status:
   - 'PENDING' → 'IN_PROGRESS' 자동 전환 (첫 진행 기록)
   - 'IN_PROGRESS' → 유지
3. updated_at 갱신
```

### 7.2 [완료 처리]

```
1. improvement_executions INSERT (완료 기록)
2. improvements:
   - status = 'DONE'
   - completed_at = NOW()
3. audit_logs INSERT
4. 새올 포틀릿 알림 (담당자 + 출처별 추가 대상):
   - source='risk_assessment' → 평가 담당자
   - source='incident' → 사고 보고자 + 부서장
   - source='opinion' → 의견 등록자 (Phase 3 OPN)
5. RSK02-D 등 출처 화면에서 종료 처리 조건 자동 재검증 (위험성평가 종료 가능 여부 등)
```

### 7.3 기한초과 자동 알림

```
배치 (매일 00:00):
  WHERE due_date < NOW() AND status != 'DONE' AND overdue_notified=false:
    - 담당자에게 새올 포틀릿 알림 ("기한 초과")
    - 부서 SHM+에게 새올 포틀릿 알림
    - overdue_notified=true 마킹 (중복 방지)
```

## 8. 사고(source_type='incident') 케이스 — 재발방지대책 2단계 (결정사항 #19)

### 8.1 흐름

```
1단계: 사고 등록
  → 사용자가 SFR-003 사고 등록 화면(IMP02-D 또는 별도 사고 폼)에서 사고 정보 입력
  → incidents INSERT
  → 자동: improvements INSERT (source_type='incident', source_id=:incident_id,
          description="재발방지조치 수립 필요", status='PENDING')

2단계: 재발방지조치 수립
  → 자동 생성된 improvements 항목에서 사용자가 본 화면(IMP01-D) 진입
  → 감소대책 입력 + 담당자 지정 + 기한 설정
  → 이후 실행 흐름은 일반 개선조치와 동일

표시:
  IMP01-D에서 source_type='incident'일 때 상단에 "재발방지조치 단계" 표시
  [원본 보기] → 사고 상세 화면 이동
```

### 8.2 재발방지대책 별도 화면 (IMP02-L)

```
URL: `/improvements/incident_prevention`
필터: WHERE source_type='incident'

LNB 별도 항목에서 사고 출처 재발방지대책만 모니터링.
산업안전보건법 관점에서 사고 분석·재발방지 효과성 추적 용도.
```

## 9. 검증 규칙

| 항목 | 검증 |
|------|------|
| [완료 처리] | 진행 기록 1건 이상 권장 (강제는 정책 협의) |
| 수정 | 자동 생성 항목의 source_id·source_type 변경 불가 |
| 담당자 변경 | SHM+ 또는 본인 담당 (위임 시) |
| 기한 변경 | SHM+ |

## 10. 오류 처리

| 케이스 | 메시지 |
|--------|--------|
| 미존재 | "개선조치를 찾을 수 없습니다" → 404 + IMP01-L 이동 |
| 권한 부족 | "접근 권한이 없습니다" → AUTH99-V |
| 완료 처리 시 진행 기록 0건 | "진행 기록을 1건 이상 등록해주세요" → 인라인 (정책 시 필수) |

## 11. 관련 화면 흐름

```
IMP01-L 행 클릭 → IMP01-D
   ├─ [원본 보기] → 출처별 분기
   │  - 위험성평가 → RSK02-D
   │  - 사고 → IMP02-D (사고 상세, 재발방지 2단계)
   │  - 점검 → INS02-D (Phase 3)
   │  - 의견 → OPN02-D (Phase 3)
   ├─ [+ 진행 기록] → 진행 기록 모달
   ├─ [실행 시작] → status='IN_PROGRESS'
   ├─ [완료 처리] → 완료 기록 모달 → status='DONE'
   └─ [관리대상 상세 보기] → TGT02-D
```

## 12. 관련 DB 테이블

- `improvements` (IMP01-V §9)
- `improvement_executions` (본 문서 §4.4)
- `incidents` (IMP01-V §9 — 사고 마스터)
- `risk_factors` (DB-001 §4.2 — 자동 생성 출처)
- `targets`, `users`, `departments` (JOIN)
- `audit_logs` (DB-001 §2.12)

## 13. 관련 인터페이스

- IF-005 새올 포틀릿: 담당자 지정·기한 임박·완료 알림
- IF-006 SMTP (간접): 외부 사용자(SUB·CON) 담당 시 이메일

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. 재발방지대책 2단계 흐름 명시 (결정사항 #19). 실행 이력·완료 처리 표준 흐름 |

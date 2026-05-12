# CON08-D — 수급업체 안전평가 (평가자용)

> 화면 ID: **CON08-D**
> 모듈: CON (도급관리)
> SFR: SFR-013
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-013, DB-001 §5.3 contract_subcontractors / §5.4 evaluation_forms

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | CON08-D |
| 화면명 | 수급업체 안전평가 (평가자 입력 화면) |
| URL | `/contracts/:contract_id/evaluations/:subcontractor_id` |
| 화면 유형 | D (Detail / Form) |
| 접근 권한 | 지정된 평가자 (작성·수정) / SHM+ (read-only 열람) |

## 2. 진입 경로

- 평가자의 "내 업무" 영역의 평가 작업 카드 클릭
- 새올 포틀릿 알림 (평가자 지정) 링크
- CON05-F 행 `[평가수정]` (계약담당자는 read-only로 진입)
- CON01-D 평가 영역에서 업체 행 클릭

## 3. 레이아웃

```
┌──────────────────────────────────────────────────────────┐
│ ← STEP 2                                                  │
│                                                          │
│ A건설 안전평가 — 청사 시설 보수공사                        │
│                                                          │
│ 평가서: 공사 안전관리 평가서 (CONSTRUCTION_SAFETY)        │
│ 만점 100점 · 적격기준 70점                                │
│                                                          │
│ 평가 항목                                                  │
│ ─────────────────────────────────                       │
│ 1. 안전보건관리계획 수립 여부 (배점 20점)                  │
│    [입력 점수: __] / 20                                   │
│    평가 기준: 안전관리계획서 제출 + 적정성 검토            │
│                                                          │
│ 2. 안전관리자 선임 (배점 15점)                             │
│    [입력 점수: __] / 15                                   │
│    평가 기준: 법정 자격 보유 안전관리자 선임 여부          │
│                                                          │
│ 3. 안전교육 이수 (배점 15점)                               │
│    [입력 점수: __] / 15                                   │
│ ...                                                      │
│                                                          │
│ 합계: __ / 100점                                           │
│ 결과: (산출) ○ 적격 ○ 부적격                              │
│                                                          │
│ 평가 의견                                                  │
│ [___________________________________________]            │
│ [___________________________________________]            │
│                                                          │
│ 첨부 (선택): [파일 첨부]                                  │
│                                                          │
│        [임시저장] [평가 완료]                              │
└──────────────────────────────────────────────────────────┘
```

## 4. 표시 항목

### 4.1 헤더

| 항목 | 데이터 소스 |
|------|------------|
| 업체명 | JOIN `subcontractors.company_name` |
| 사업명 | JOIN `contracts.name` |
| 평가서 정보 | JOIN `evaluation_forms.title + max_score + pass_score` |

### 4.2 평가 항목 동적 렌더링

```
evaluation_forms.items JSON 구조 (예):
[
  {
    "no": 1,
    "title": "안전보건관리계획 수립 여부",
    "max_score": 20,
    "criteria": "안전관리계획서 제출 + 적정성 검토",
    "score_type": "numeric"  // numeric / radio
  },
  {
    "no": 2,
    "title": "안전관리자 선임",
    "max_score": 15,
    "criteria": "법정 자격 보유 안전관리자 선임 여부",
    "score_type": "numeric"
  },
  ...
]

각 항목별로 점수 입력 필드 동적 렌더링
```

## 5. 입력 항목

| 필드 | 타입 | 필수 | 검증 |
|------|------|------|------|
| 항목별 점수 (N개) | NUMBER | ✅ (평가 완료 시) | 0 ≤ score ≤ max_score |
| 평가 의견 | TEXTAREA | ❌ | 최대 2000자 |
| 첨부 | FILE | ❌ | 평가 증빙 (이미지·PDF) |

## 6. 버튼·링크 액션

| 요소 | 위치 | 액션 | 조건·비고 |
|------|------|------|---------|
| `[← STEP 2]` | 헤더 좌측 | CON05-F 복귀 (변경사항 alert) | |
| 점수 입력 필드 | 본문 | 자동 합계 계산 (실시간) + 적격 여부 산출 | |
| `[파일 첨부]` | 본문 | 파일 업로드 | |
| `[임시저장]` | 푸터 | 현재 입력 상태 저장 (`evaluation_status='IN_PROGRESS'`) | 점수 일부만 입력해도 가능 |
| `[평가 완료]` | 푸터 (Primary) | 전체 검증 → `evaluation_status='DONE'` + 점수·결과 저장 → CON05-F 복귀 | 모든 항목 점수 입력 시 활성 |

## 7. 자동 처리 로직

### 7.1 실시간 합계·적격 산출

```
점수 입력 시 (blur 이벤트):
  total_score = SUM(항목별 입력 점수)
  result = (total_score >= evaluation_forms.pass_score) ? 'QUALIFIED' : 'UNQUALIFIED'
  
  본문 하단:
    "합계: {total_score} / 100점"
    "결과: {QUALIFIED ? '적격' : '부적격'}"
```

### 7.2 [평가 완료]

```
검증:
  - 모든 항목 점수 입력됨
  - 0 ≤ 각 항목 점수 ≤ max_score
  
저장:
  1. contract_subcontractors UPDATE:
     - evaluation_score = total_score
     - evaluation_result = QUALIFIED / UNQUALIFIED
     - evaluation_status = 'DONE'
     - evaluation_detail JSON (항목별 점수·의견 저장)
     - evaluation_completed_at = NOW()
  2. audit_logs INSERT
  3. 새올 포틀릿 알림 (대상자: 계약 담당자, category='contract',
     "{업체명} 평가 완료 — 결과: {적격/부적격}")
  4. CON05-F 복귀
```

### 7.3 [임시저장]

```
contract_subcontractors UPDATE:
  - evaluation_status='IN_PROGRESS'
  - evaluation_detail JSON 부분 저장
  - 점수·결과는 미완료
```

## 8. 검증 규칙

| 항목 | 검증 |
|------|------|
| 평가자 권한 | `contract_subcontractors.evaluator_id = :current_user` AND 권한이 SHM/SM |
| 평가 완료 | 모든 항목 점수 입력 필수 |
| 점수 범위 | 0 ≤ score ≤ max_score (항목별) |
| 계약담당자 진입 | read-only 모드 (점수 입력 차단) |

## 9. 오류 처리

| 케이스 | 메시지 | 처리 |
|--------|--------|------|
| 평가자 외 사용자 점수 입력 시도 | "평가자만 점수를 입력할 수 있습니다" | read-only |
| 점수 범위 초과 | "{항목명} 점수는 0 ~ {max_score} 사이여야 합니다" | 인라인 |
| 일부 항목 미입력 시 [평가 완료] | "모든 항목 점수를 입력해주세요" | 인라인 + 미입력 항목 강조 |
| 저장 실패 | "저장 중 오류가 발생했습니다" | 토스트 |

## 10. 관련 화면 흐름

```
CON05-F [평가자 지정] → 알림 → 평가자가 "내 업무"에서 진입
   → CON08-D
   ↓ 항목별 점수 입력
   ↓ [평가 완료]
   → contract_subcontractors UPDATE → CON05-F 복귀
   → CON05-F 진행 조건 충족 시 [다음 →] 활성
```

## 11. 관련 DB 테이블

- `contract_subcontractors` (DB-001 §5.3): 점수·결과·상태 갱신
- `evaluation_forms` (DB-001 §5.4): 평가 항목 마스터
- `contracts` (DB-001 §5.1): 계약 정보
- `subcontractors` (DB-001 §5.2): 업체 정보
- `audit_logs` (DB-001 §2.12): 평가 완료 감사

## 12. 관련 인터페이스

- 외부 인터페이스 없음
- IF-005 새올 포틀릿: 평가 완료 알림

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. 평가서 마스터 기반 항목 동적 렌더링 |

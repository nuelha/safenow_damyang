# CON06-F — 계약 STEP 3 선정+결재 (온나라 안내 팝업)

> 화면 ID: **CON06-F**
> 모듈: CON (도급관리)
> SFR: SFR-013 / SFR-010 (안전관리자 미달 차단)
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-013, DB-001 §5.1 contracts / §5.3 contract_subcontractors, 결정사항 #2 / #16 / #21

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | CON06-F |
| 화면명 | 계약 STEP 3 — 선정 + 결재 |
| URL | `/contracts/:id/step3` |
| 화면 유형 | F (Form, 풀페이지) |
| 접근 권한 | SHM+ |
| 형태 | 4-Step Wizard의 STEP 3 |

## 2. 진입 경로

- CON05-F `[다음 →]` (진행 조건 충족 후)
- CON01-D `[결재 진행]` 버튼
- CON01-D 스텝 인디케이터 [STEP 3] 클릭
- 임시저장 후 재진입 (`status='EVALUATING'` AND step=2 완료)

## 3. 레이아웃

```
┌──────────────────────────────────────────────────────────┐
│ ← 도급관리       [STEP 1 ●][STEP 2 ●][STEP 3 ●][STEP 4]  │
│                                                          │
│ 청사 시설 보수공사 — STEP 3 선정 + 결재                   │
│                                                          │
│ 평가 결과 요약                                             │
│ ─────────────────────────────────                       │
│ 적격 업체:                                                │
│   A건설  85점  [선정]                                     │
│   B건설  72점  [선정]                                     │
│ 부적격 업체:                                              │
│   C건설  65점  (적격기준 미달)                             │
│                                                          │
│ 최종 선정 업체                                             │
│ ✓ A건설 [선정 해제]                                        │
│                                                          │
│ ⚠ 안전관리자 인력 검증 (D-3)                              │
│ ─────────────────────────────────                       │
│ 공사 규모: 500,000,000원 (50억 이상)                     │
│ 법정 필요: 안전관리자 1명 / 안전보건관리책임자 1명          │
│ 현재 배치: 안전관리자 1명 / 안전보건관리책임자 1명          │
│ 결과: [충족] ✓                                            │
│                                                          │
│ 결재 진행                                                 │
│ ─────────────────────────────────                       │
│ [온나라 결재 요청하기]                                     │
│                                                          │
│ 결재 결과 등록 (온나라 진행 완료 후)                       │
│ 결재일자  │ ___________  결재자명 │ ___________          │
│ 결재 문서 │ [파일 첨부]                                   │
│ 결재 결과 │ ○ 승인 ○ 반려                                │
│   [결재 결과 저장]                                         │
│                                                          │
│ [이전]                          [취소] [임시저장] [다음 →]│
└──────────────────────────────────────────────────────────┘
```

## 4. 표시 항목

### 4.1 평가 결과 요약

| 항목 | 데이터 소스 |
|------|------------|
| 적격 업체 목록 | `contract_subcontractors WHERE evaluation_result='QUALIFIED' ORDER BY evaluation_score DESC` |
| 부적격 업체 목록 | `WHERE evaluation_result='UNQUALIFIED'` |
| 업체명·점수 | JOIN `subcontractors.company_name`, `evaluation_score` |
| 적격기준 미달 사유 표시 | `evaluation_forms.pass_score` 기준 부족 점수 표시 |

### 4.2 최종 선정 업체

| 항목 | 데이터 소스 |
|------|------------|
| 선정 업체 목록 | `contract_subcontractors WHERE selected=true` |
| `[선정]` / `[선정 해제]` 토글 | 적격 업체에 한해 활성 |

### 4.3 안전관리자 인력 검증 카드 (D-3)

```
공사 규모(예산)별 법정 안전관리자 N명 필요:
  - 공사금액 50억 이상 → 안전관리자 1명 이상
  - 공사금액 120억 이상 → 안전관리자 2명 이상
  - 공사금액 800억 이상 → 안전관리자 3명 이상
  - 공사금액 1500억 이상 → 안전관리자 4명 이상
  (시행령 기준 — 협의 후 확정)

현재 배치:
  contracts.target_id 의 target_assignees + 부서의 dedicated_personnel 집계
  - SAFETY_MGR (안전관리자)
  - HEALTH_MGR (안전보건관리책임자 — RESPONSIBLE 자동 매핑된 부서장이 보통 담당)

비교 결과:
  - 충족: [충족] ✓ 초록 배지
  - 미달: [미충족] ⚠ 빨강 배지 + 부족 인원 수 표시
```

### 4.4 결재 상태별 표시

| approval_status | 표시 영역 |
|----------------|----------|
| `NOT_REQUESTED` | [온나라 결재 요청하기] 버튼 노출 |
| `REQUESTED` | "결재 진행 중" + 결재 결과 등록 폼 노출 |
| `APPROVED` | "결재 완료 — {결재일} {결재자}" + STEP 4 진입 안내 |
| `REJECTED` | "결재 반려 — 사유 {message}" + [STEP 2 재진행] 버튼 |

## 5. 입력 항목 (결재 결과 등록)

| 필드 | 타입 | 필수 | 비고 |
|------|------|------|------|
| 결재일자 | DATE | ✅ | 온나라에서 결재된 실제 날짜 |
| 결재자명 | TEXT | ✅ | 군수/부군수 또는 위임된 결재권자 |
| 결재 문서 | FILE | ❌ | 온나라 결재 완료 문서 PDF·이미지 |
| 결재 결과 | RADIO | ✅ | 승인 / 반려 |
| 반려 사유 | TEXTAREA | 반려일 때 ✅ | |

## 6. 버튼·링크 액션

| 요소 | 위치 | 액션 | 조건·비고 |
|------|------|------|---------|
| 스텝 인디케이터 | 상단 | 현재 STEP 강조 | |
| `[← 도급관리]` | 헤더 좌측 | CON01-L 복귀 (변경사항 alert) | |
| `[선정]` (적격 업체) | 평가 결과 | 선정 업체 목록에 추가 + `contract_subcontractors.selected=true` | 적격 행만. 복수 선정 가능 |
| `[선정 해제]` | 선정 업체 | `selected=false` 토글 | |
| `[온나라 결재 요청하기]` | 결재 진행 카드 | 안전관리자 검증 → 안내 팝업 → 상태 갱신 (§7.1) | `approval_status='NOT_REQUESTED'` AND 충족 시 활성. 미달 시 비활성 + 안내 모달 |
| `[전담인력 화면으로]` | 안전관리자 미달 모달 | STF04-V 이동 (`?department_id=`) | 미달 시 모달에 노출 |
| `[파일 첨부]` (결재 문서) | 결재 결과 등록 | 파일 업로드 (PDF·이미지) | |
| `[결재 결과 저장]` | 결재 결과 등록 | 결과 저장 + 상태 갱신 (§7.2) | 필수 필드 입력 시 활성 |
| `[STEP 2 재진행]` | 반려 상태 | STEP 2 (CON05-F) 진입 + status='EVALUATING' 복귀 | 반려 상태일 때만 |
| `[이전]` | 푸터 좌측 | STEP 2 복귀 (입력값 유지) | |
| `[취소]` | 푸터 | CON01-L 복귀 (alert) | |
| `[임시저장]` | 푸터 우측 | contracts UPSERT (step=3 유지) | |
| `[다음 →]` | 푸터 우측 (Primary) | STEP 4 진입 | `approval_status='APPROVED'` 시 활성 |

## 7. 자동 처리 로직

### 7.1 [온나라 결재 요청하기] 클릭

```
검증 1. 선정 업체 1건 이상 (contract_subcontractors.selected=true COUNT >= 1)
검증 2. 안전관리자 인력 검증 (D-3):
  - target_assignees + dedicated_personnel SAFETY_MGR 수 집계
  - 공사 규모 대비 법정 필요 인원 비교
  - 미달 시:
    ⚠ 모달 표시:
       "안전관리자 인력이 미달되어 결재를 진행할 수 없습니다.
        부족 인원: 안전관리자 N명
        
        STF04-V 화면에서 추가 선임 후 다시 시도하세요.
        
        [전담인력 화면으로]  [닫기]"
    contracts.status = 'BLOCKED' 자동 전환
    새올 포틀릿 알림 (담당자: SHM+, system 카테고리)

검증 통과 시:
  안내 팝업 표시:
     "온나라 시스템에서 결재 진행 후
      본 시스템에서 결재 결과 상태를 업데이트하세요.
      [확인]"
  
  [확인] 클릭 시:
    - contracts.status='APPROVAL_REQUESTED'
    - contracts.approval_requested_at = NOW()
    - 새올 포틀릿 알림 (대상자: CEO/GM, category='approval',
      "{사업명} 수급업체 선정 결재 요청 — 온나라에서 결재 진행하세요")
    - audit_logs INSERT
```

### 7.2 [결재 결과 저장] 클릭

```
사용자가 온나라에서 결재 완료 후 본 시스템 복귀:
  결재일자·결재자명·결재 문서·결재 결과 입력 → [결재 결과 저장] 클릭

결과별 처리:
  ○ 승인:
    contracts.status='APPROVED'
    contracts.approval_completed_at=NOW()
    contracts.approval_result='APPROVED'
    contracts.approver_name = :input
    contracts.approval_doc_url = :파일 URL
    STEP 4 진입 가능 (자동 전환 안 함, 사용자가 [다음 →] 클릭)
    
    새올 포틀릿 알림 (담당자: SHM+, category='contract',
      "{사업명} 결재 완료 — 도급업체 초대 단계 진입 가능")
    audit_logs INSERT

  ○ 반려:
    contracts.status='REJECTED'
    contracts.approval_result='REJECTED'
    contracts.approver_name = :input
    반려 사유 저장
    
    새올 포틀릿 알림 (담당자: SHM+,
      "{사업명} 결재 반려 — STEP 2 재진행 필요")
    audit_logs INSERT
```

### 7.3 안전관리자 미달 자동 차단·복귀

```
계약 등록·수정 또는 SFR-010 인력 변경 감지 시 자동 검증:
  - 미달 → contracts.status='BLOCKED'
  - 충족 복귀 → contracts.status='EVALUATING' (또는 'DRAFT')

본 화면 진입 시 실시간 재검증 (사용자 STF04-V에서 선임 후 복귀할 수 있음)
```

### 7.4 반려 시 STEP 2 복귀

```
[STEP 2 재진행] 클릭:
  - contracts.status='EVALUATING'
  - approval_status='NOT_REQUESTED'로 초기화
  - 평가 결과 유지 (재평가 시 별도 처리)
  - STEP 2 (CON05-F) 진입
```

## 8. 데이터 스코프

본 화면 진입은 CON01-D 진입 권한과 동일. SUB/CON은 본 화면 접근 불가 (결재 진행은 내부 직원만).

## 9. 검증 규칙

| 항목 | 검증 |
|------|------|
| 선정 업체 | 적격 업체 1건 이상 필수 |
| 안전관리자 인력 | 공사 규모별 법정 필요 인원 충족 |
| 결재 요청 | NOT_REQUESTED 상태에서만 가능 |
| 결재 결과 저장 | REQUESTED 상태에서만 가능 |
| STEP 4 진입 | APPROVED 상태일 때만 [다음 →] 활성 |

## 10. 오류 처리

| 케이스 | 메시지 | 처리 |
|--------|--------|------|
| 적격 업체 0건에서 결재 요청 | "선정 업체를 1건 이상 지정해주세요" | 인라인 안내 |
| 안전관리자 미달 시 결재 요청 | (§7.1 미달 모달) | 차단 + [전담인력 화면으로] 링크 |
| BLOCKED 상태에서 결재 요청 시도 | "결재 차단 상태입니다. 안전관리자를 추가 선임해주세요" | 인라인 + STF04-V 링크 |
| 결재 결과 저장 시 필수 필드 누락 | "{필드명}을(를) 입력해주세요" | 인라인 에러 |
| APPROVED 후 결재 결과 재변경 시도 | "이미 결재 완료된 계약입니다" | 차단 |

## 11. 관련 화면 흐름

```
CON05-F [다음 →] (진행 조건 충족) ──→ CON06-F
                                       ↓ [선정] (적격 업체)
                                       ↓ [온나라 결재 요청하기]
                                          → 인력 검증 → 안내 팝업 → status='APPROVAL_REQUESTED'
                                       ↓ 사용자 온나라에서 결재 진행 후 복귀
                                       ↓ [결재 결과 저장]
                                          → status='APPROVED' or 'REJECTED'
                                       ↓ APPROVED 시 [다음 →] → CON07-F
                                       
                                       ↓ REJECTED 시 [STEP 2 재진행] → CON05-F
                                       
                                       ↓ BLOCKED 시 [전담인력 화면으로] → STF04-V
```

## 12. 관련 DB 테이블

- `contracts` (DB-001 §5.1): status·approval_* 갱신
- `contract_subcontractors` (DB-001 §5.3): 선정 업체 (`selected`)
- `target_assignees`, `dedicated_personnel` (DB-001 §2.4 / §6.1): 안전관리자 검증
- `audit_logs` (DB-001 §2.12): 결재 요청·결과·반려 감사

## 13. 관련 인터페이스

- **IF-005 새올 포틀릿**: 결재 안내 알림 적재 (CEO/GM), 결과·반려 알림 (SHM+)
- **온나라**: 시스템 외부 (안내 팝업만, 자동 동기화 없음 — 결정사항 #2)

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. 온나라 결재 안내 팝업 + 안전관리자 미달 자동 차단 (D-3) |

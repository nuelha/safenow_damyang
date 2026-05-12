# RSK02-D — 평가 상세

> 화면 ID: **RSK02-D**
> 모듈: RSK (위험성평가)
> SFR: SFR-007
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-007, DB-001 §4.1 risk_assessments / §4.2 risk_factors, IF-004 차세대 e호조

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | RSK02-D |
| 화면명 | 평가 상세 |
| URL | `/risk-assessment/:id` |
| 화면 유형 | D (Detail) |
| 접근 권한 | SHM+ (담당) / 열람은 권한별 |

## 2. 진입 경로

- RSK02-L 행 클릭
- RSK01-V 행 `[상세]` 버튼
- TGT02-D 위험성평가 영역에서 위젯 클릭
- 새올 포틀릿 알림 (평가 자동 생성·결재 안내 등) 링크
- RSK02-F 저장 후 자동 이동
- CON01-D 위험성평가 영역에서 도급사업 평가 클릭

## 3. 레이아웃

```
┌─────────────────────────────────────────────────────────────┐
│ ← 목록                                  [수정][결재요청][PDF]│
│                                                             │
│ 청사 위험성평가 2026 — [정기] [관리대상: 군청 청사]           │
│                                                             │
│ [ 1. 사전준비 ] ──●── [ 2. 진행중 ] ──────── [ 3. 완료 ]     │
│                                                             │
│ 진행중 서브: 파악 5 / 추정 3 / 결정 2 / 대책수립 1            │
│                                                             │
│ 기본정보                                                     │
│ 관리대상    │ 군청 청사 (시설/공중이용/1종)                  │
│ 평가유형    │ 정기                                            │
│ 시행확인 라벨│ 정기 평가 (라벨 미표시)                        │
│ 평가 기법   │ 4M 위험성평가                                   │
│ 트리거 유형 │ — (수시만 해당)                                 │
│ 평가 기간   │ 2026-04-01 ~ 2026-05-31                         │
│ 담당자      │ 김안전 (자치행정과 SHM)                          │
│ 결재 상태   │ 미요청  [온나라 결재 진행하기]                   │
│                                                             │
│ 위험요인 목록                       [+ 위험요인 추가]         │
│ No│ 단계/구역      │ 위험요인       │추정│결정│감소대책│단계 │
│ ──┼──────────────┼──────────────┼───┼───┼──────┼────│
│ 1 │본관 2층 전기실│전기 누전·감전 │ 9 │불허│절연 점검│대책│
│ 2 │본관 옥상     │추락 위험      │ 6 │허용│       │결정│
│ ...                                                         │
│                                                             │
│ 개선조치 현황                                                │
│ → IMP01-L 출처=위험성평가 필터 연동                          │
│                                                             │
│ [종료 처리]  ← 완료 조건 충족 시 활성                         │
└─────────────────────────────────────────────────────────────┘
```

## 4. 표시 항목

### 4.1 상단 헤더

| 항목 | 데이터 소스 | 비고 |
|------|------------|------|
| 평가명 | `risk_assessments.name` | |
| 평가유형 배지 | `assessment_type` | 정기/최초/수시 |
| 관리대상 | JOIN `targets.name + type + cdpa_category + facility_grade` | 클릭 시 TGT02-D |

### 4.2 스텝 인디케이터

| 항목 | 데이터 소스 | 표시 |
|------|------------|------|
| 현재 단계 강조 | `cycle_stage` | PREPARING / IN_PROGRESS / DONE 중 현재 단계 highlight |
| 진행중 서브 카운트 | `risk_factors` GROUP BY `factor_stage` | 파악/추정/결정/대책수립 별 카운트 |

### 4.3 기본정보 카드

| 항목 | 데이터 소스 |
|------|------------|
| 관리대상 | JOIN `targets` |
| 평가유형 | `assessment_type` |
| 시행확인 라벨 | `confirmation_label` ("최초"/"수시"). 정기는 "라벨 미표시" |
| 평가 기법 | `method` |
| 트리거 유형 | `trigger_type` (수시만) |
| 트리거 설명 | `trigger_description` (수시만) |
| 평가 기간 | `start_date ~ end_date` |
| 담당자 | JOIN `users.name + department.name + role` |
| 참여자 | `participants` JSON → 사용자 목록 |
| 결재 상태 | `approval_status` 배지 (§4.4) |
| 출처 | `source` 배지 (MANUAL / EHOJO_AUTO / INITIAL_AUTO / REGULAR_AUTO) |

### 4.4 결재 상태 배지

| approval_status | 표시명 | 색상 |
|----------------|--------|------|
| `NOT_REQUESTED` | 미요청 | 회색 |
| `REQUESTED` | 결재 진행 중 | 노랑 |
| `APPROVED` | 결재 완료 | 초록 |
| `REJECTED` | 결재 반려 | 빨강 |

### 4.5 위험요인 테이블

| 컬럼 | 데이터 소스 | 인라인 편집 |
|------|------------|----------|
| No | `sort_order` | drag-and-drop 정렬 가능 (선택) |
| 단계/구역 | `step_or_zone_name` | ⭕ (자유 메모, PRC 폐기 영향) |
| 위험요인 | `description` | ⭕ |
| 위험성 추정 | `frequency × severity` 계산값 | 빈도·강도 셀렉트 |
| 위험성 결정 | `is_acceptable` | ○ 허용 / ✕ 불허 |
| 감소대책 | `control_measure` | ⭕ (불허 시 필수) |
| 단계 배지 | `factor_stage` | 자동 산출 |
| 개선조치 링크 | improvements (자동 생성된 경우) | `[→ 개선조치 imp-N]` |

### 4.6 위험요인 단계 배지

| factor_stage | 표시명 | 색상 | 조건 |
|-------------|--------|------|------|
| `identified` | 파악됨 | 회색 | description 입력됨 |
| `estimated` | 추정됨 | 파랑 | frequency + severity 입력됨 |
| `evaluated` | 결정됨 | 주황 | is_acceptable 값 있음 |
| `controlled` | 대책수립됨 | 초록 | is_acceptable=true OR control_measure 입력됨 |

## 5. 버튼·링크 액션

| 요소 | 위치 | 액션 | 조건·비고 |
|------|------|------|---------|
| `[← 목록]` | 상단 좌측 | RSK02-L 복귀 | |
| `[PDF 출력]` | 상단 우측 | 평가 결과·위험요인·감소대책 인쇄용 레이아웃 (시행확인 라벨 포함) | `window.print()` 또는 서버 PDF 생성 |
| `[수정]` | 상단 우측 | RSK02-F 진입 (수정 모드) | `cycle_stage != 'DONE'` 시 활성. SHM+ |
| `[결재요청]` | 상단 우측 | 결재 흐름 (§7.1 참조) | SHM+. `approval_status='NOT_REQUESTED'` 시 활성 |
| `[온나라 결재 진행하기]` | 기본정보 결재 영역 | 안내 팝업 (§7.1 2단계 표시) | `approval_status='REQUESTED'` 시 노출 |
| `[결재 결과 업데이트]` | 기본정보 결재 영역 | 결재 결과 수동 업데이트 모달 (§7.1.2) | `approval_status='REQUESTED'` 시 노출. SHM+ |
| 스텝 인디케이터 `[1. 사전준비]` | 상단 스텝 | 사전준비 단계로 회귀 (확인 모달) → `cycle_stage='PREPARING'` | 진행중 상태에서만 노출 |
| 스텝 인디케이터 `[2. 진행중]` | 상단 스텝 | `cycle_stage='IN_PROGRESS'` 전환 (진행 시작) | 사전준비 상태에서 활성 |
| `[종료 처리]` | 기본정보 카드 헤더 | 종료 조건 검증 → `cycle_stage='DONE'` → RSK02-L 복귀 | §7.2 조건 충족 시 활성 |
| `[+ 위험요인 추가]` | 위험요인 카드 헤더 | 빈 행 추가 (`risk_factors` INSERT, `factor_stage='identified'`, sort_order 자동 채번) | 진행중에만 활성 |
| 단계/구역 입력 | 위험요인 행 | `step_or_zone_name` 자동 저장 (blur) | 자유 텍스트, 입력 선택 |
| 위험요인명 입력 | 위험요인 행 | `description` 자동 저장 (blur) → `factor_stage='identified'` | |
| 빈도·강도 셀렉트 | 위험성 추정 컬럼 | `frequency`, `severity` 저장 + `risk_score` 자동 계산 → `factor_stage='estimated'` | 1~5 |
| 위험성 결정 셀렉트 | 위험성 결정 컬럼 | 허용/불허 분기 처리 (§7.3) | |
| 감소대책 입력 | 감소대책 컬럼 | `control_measure` 저장 (blur) → `factor_stage='controlled'` | 불허 시 필수 |
| `[→ 개선조치 imp-N]` 링크 | 감소대책 컬럼 | IMP01-D 이동 | 자동 생성된 개선조치 행에서만 |
| 행 `[삭제]` | 위험요인 행 | 확인 모달 → `risk_factors` DELETE | 진행중에만 활성 |

## 6. 데이터 스코프

- 본 화면 진입은 RSK02-L 진입 시점에 데이터 스코프 검증 통과한 평가만 가능
- 수정은 SHM+ 권한 + 본인 담당(`owner_user_id=:current_user`) 또는 GM 이상

## 7. 자동 처리 로직

### 7.1 결재 흐름 (온나라 안내 팝업)

#### 7.1.1 [결재요청] 클릭

```
검증:
  - cycle_stage = 'DONE' 권장 (진행 중에도 결재 가능)
  - 위험요인 1건 이상 등록 필요

검증 통과 시 안내 팝업:
   ┌──────────────────────────────────────────┐
   │ 온나라 시스템에서 결재 진행 후              │
   │ 본 시스템에서 결재 결과 상태를 업데이트하세요. │
   │                                          │
   │   [확인]                                  │
   └──────────────────────────────────────────┘

[확인] 클릭 시:
  - risk_assessments.approval_status = 'REQUESTED'
  - approval_requested_at = NOW()
  - 새올 포틀릿 적재 (대상자: CEO/GM, category='approval',
    "{관리대상명} 위험성평가 결재 요청 — 온나라에서 결재 진행하세요")
```

#### 7.1.2 [결재 결과 업데이트]

```
사용자가 온나라에서 결재 진행 후 본 시스템에 돌아와서:
  [결재 결과 업데이트] 클릭 → 모달:
     결재일자  │ [DATE]
     결재자명  │ [TEXT]
     결재 문서 │ [파일 첨부]
     결재 결과 │ ○ 승인  ○ 반려

  결과별 처리:
    승인:
      - approval_status='APPROVED'
      - approval_completed_at=NOW()
      - approver_name, approval_doc_url 저장
      - audit_logs INSERT
    
    반려:
      - approval_status='REJECTED'
      - 새올 포틀릿 알림 (담당자: SHM+, "{관리대상명} 평가 결재 반려")
```

### 7.2 종료 처리 조건 검증

```
[종료 처리] 활성화 조건 (모두 충족):
  1. 모든 risk_factors 에 is_acceptable 값 있음 (NULL 없음)
  2. is_acceptable=false 항목 중 control_measure 미입력 건 없음
  3. is_acceptable=false 항목 중 improvements 미등록 건 없음

미충족 시:
  버튼 비활성 + 툴팁:
    "미판단 위험요인 N건 / 감소대책 미수립 N건 / 개선조치 미등록 N건"
  해당 행 하이라이트 표시

[종료 처리] 클릭 시:
  1. risk_assessments.cycle_stage = 'DONE'
  2. status = 'DONE'
  3. 연결된 improvements → CMP(이행관리)에서 별도 추적
  4. 토스트 안내 후 RSK02-L 복귀
  5. audit_logs INSERT
```

### 7.3 위험성 결정 → 감소대책 연동 로직

```
○ 허용 선택 → is_acceptable = true
             factor_stage = 'evaluated' (대책 없이도 가능)
             감소대책 입력 선택사항 (입력하면 factor_stage = 'controlled')

✕ 불허 선택 → is_acceptable = false
             감소대책(control_measure) 입력란 즉시 활성화 (필수)
             감소대책 입력 완료 시 factor_stage = 'controlled'
             improvements 자동 INSERT (DB-001 §9.3 트리거)
               (source_type='risk_assessment', source_id=risk_factor.id,
                target_id=target_id, status='PENDING')
             새올 포틀릿 알림 (담당자: 개선조치 담당자)
```

### 7.4 위험요인 인라인 편집 자동 저장

```
각 셀의 blur 이벤트마다 비동기 PATCH 호출:
  PATCH /api/risk-factors/:id
  Body: { 변경 필드 }

응답 성공: 셀 우측에 ✓ 표시 (1초 후 사라짐)
응답 실패: 셀 우측에 ⚠ 표시 + 재시도 버튼
```

## 8. 검증 규칙

| 항목 | 검증 |
|------|------|
| 빈도·강도 | 1~5 범위 |
| 감소대책 | 불허(`is_acceptable=false`) 시 필수 |
| 결재요청 시 | 위험요인 1건 이상 등록 필요 |
| 종료 처리 | §7.2 3가지 조건 모두 충족 |
| 수정 권한 | SHM+ + 담당자(owner) 또는 GM 이상 |

## 9. 오류 처리

| 케이스 | 메시지 | 처리 |
|--------|--------|------|
| 평가 미존재 | "평가를 찾을 수 없습니다" | 404 + RSK02-L 이동 |
| 종료 조건 미충족 시 종료 시도 | "미판단 위험요인 N건 / 감소대책 미수립 N건 / 개선조치 미등록 N건" | 버튼 비활성 + 툴팁 |
| 결재요청 시 위험요인 0건 | "위험요인을 1건 이상 등록해주세요" | 인라인 에러 |
| 인라인 저장 실패 | "저장 중 오류가 발생했습니다. 다시 시도해주세요" | 셀 우측 ⚠ + 재시도 |
| DONE 상태에서 위험요인 추가 시도 | "완료된 평가는 위험요인을 추가할 수 없습니다" | 버튼 비활성 |

## 10. 관련 화면 흐름

```
RSK02-D
   ├─ [← 목록] → RSK02-L
   ├─ [수정] → RSK02-F (수정 모드)
   ├─ [결재요청] → 안내 팝업 → approval_status='REQUESTED' + 새올 알림
   ├─ [결재 결과 업데이트] → 결과 입력 모달 → approval_status 변경
   ├─ [+ 위험요인 추가] → 빈 행 INSERT (인라인 편집)
   ├─ [→ 개선조치 imp-N] → IMP01-D (자동 생성된 경우)
   ├─ [종료 처리] → 조건 검증 → cycle_stage='DONE' → RSK02-L
   └─ 관리대상 헤더 클릭 → TGT02-D
```

## 11. 관련 DB 테이블

- `risk_assessments` (DB-001 §4.1): 평가 본체
- `risk_factors` (DB-001 §4.2): 위험요인 (인라인 편집 대상)
- `improvements` (DB-001 §7 — Phase 2): 자동 생성 + 본 화면에서 링크
- `targets` (DB-001 §2.3): JOIN 관리대상 정보
- `users` (DB-001 §2.2): 담당자·참여자
- `audit_logs` (DB-001 §2.12): 종료·결재 결과 감사

## 12. 관련 인터페이스

- **IF-005 새올 포틀릿**: 결재 알림·반려 알림 적재 (간접)
- **온나라**: 별도 시스템 — 본 시스템은 안내 팝업만 (자동 연동 없음)

## 13. 성능 고려

- 위험요인 인라인 편집은 비동기 PATCH (개별 행)
- 위험요인 1건이 많은 경우 (50건 이상) 가상 스크롤 (선택)
- 단계 배지 산출은 클라이언트 측 계산 (factor_stage 컬럼 기반)

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. PRC 폐기 반영 (단계/구역 자유 메모). 결재 흐름 온나라 안내 팝업. 종료 처리 조건 검증 명세 |

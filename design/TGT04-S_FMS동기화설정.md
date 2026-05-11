# TGT04-S — FMS 동기화 설정

> 화면 ID: **TGT04-S**
> 모듈: TGT (관리대상)
> SFR: SFR-002
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-002, DB-001 §3.2 fms_sync_logs / §2.3 targets, IF-003 FMS

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | TGT04-S |
| 화면명 | FMS 동기화 설정 |
| URL | `/targets?tab=fms_sync` |
| 화면 유형 | S (Settings, 관리자 전용) |
| 접근 권한 | CEO / GM / SHM |

## 2. 진입 경로

- GNB > 관리대상 > 탭 [FMS 동기화]
- 새올 포틀릿 알림 (FMS 동기화 실패·신규 시설 등록대기 등) 링크

## 3. 레이아웃

```
┌────────────────────────────────────────────────────┐
│ 관리대상                                            │
│ [전체] [시설] [업무] [사업] [FMS 동기화]              │
│                                                    │
│ FMS 연동 설정                                       │
│ ─────────────────────────────────                  │
│ 연동 상태:    [연결됨] 마지막 성공 2026-05-11 06:00  │
│ 동기화 주기:  매일 06:00                            │
│ 동기화 범위:  시설형 관리대상의 cdpa_category,        │
│              facility_grade, address               │
│ API 엔드포인트: https://fms.damyang.go.kr/api/...   │
│                                          [수정] [테스트]│
│                                                    │
│ 자동 동기화 정책                                     │
│ ─────────────────────────────────                  │
│ ● fms_id 가 있는 관리대상만 동기화 대상              │
│ ● 신규 fms_id 가 FMS에 추가되면 등록대기(PENDING)    │
│   상태로 자동 INSERT (담당자가 부서 지정 후 활성화)   │
│ ● 기존 항목 변경 시 자동 갱신                        │
│ ● FMS에서 삭제된 경우 비활성(INACTIVE)으로 전환       │
│   (시스템에서 직접 삭제 안 함)                       │
│                                                    │
│ 동기화 이력 (최근 30건)                              │
│ ─────────────────────────────────                  │
│ 일시         │ 결과 │ 신규  │ 변경  │ 비활성 │ 로그 │
│ 2026-05-11   │ 성공 │ +0   │ ~5   │ +0    │[보기]│
│ ...                                                │
│                                                    │
│ 수동 동기화                                          │
│ ─────────────────────────────────                  │
│ [전체 동기화] [등록대기 항목만]                       │
│ 진행률: ████████░░ 80%                              │
│                                                    │
│ 등록대기 항목 (PENDING) — N건                        │
│ ─────────────────────────────────                  │
│ FMS-001245 │ 도서관 분관       │ 부서 미지정 [지정]  │
│ FMS-001246 │ 어린이 놀이터    │ 부서 미지정 [지정]  │
└────────────────────────────────────────────────────┘
```

## 4. 표시 항목

### 4.1 연동 설정 카드

| 항목 | 데이터 소스 |
|------|------------|
| 연동 상태 | 마지막 fms_sync_logs.result 기반 |
| 마지막 성공 시각 | `MAX(fms_sync_logs.finished_at WHERE result='SUCCESS')` |
| 동기화 주기·범위 | 환경 설정 |
| API 엔드포인트 | 환경 설정 |

### 4.2 동기화 이력 목록

| 컬럼 | 데이터 소스 |
|------|------------|
| 일시 | `started_at ~ finished_at` |
| 결과 | result 배지 (SUCCESS/FAILED/IN_PROGRESS) |
| 신규 | `dept_added` 또는 facility_added 카운트 |
| 변경 | `~updated` |
| 비활성 | FMS 삭제 항목 수 |
| 로그 | `[보기]` 버튼 |

### 4.3 등록대기 항목 (PENDING)

```sql
SELECT * FROM targets
WHERE status='PENDING' AND fms_id IS NOT NULL AND department_id IS NULL
ORDER BY created_at DESC
```

| 컬럼 | 데이터 소스 |
|------|------------|
| FMS ID | `targets.fms_id` |
| 관리대상명 | `targets.name` (FMS에서 가져온 값) |
| 부서 상태 | "부서 미지정" |
| `[지정]` 버튼 | 부서 선택 모달 진입 |

## 5. 버튼·링크 액션

| 요소 | 위치 | 액션 | 조건·비고 |
|------|------|------|---------|
| `[수정]` (연동 설정) | 설정 영역 | 동기화 주기·API 엔드포인트 수정 모달 | CEO만 |
| `[테스트]` | 설정 영역 | FMS API 단순 호출 → 응답·소요시간 표시 | CEO/GM |
| `[전체 동기화]` | 수동 동기화 | 전체 동기화 작업 시작 (비동기) | 진행 중일 때 비활성 |
| `[등록대기 항목만]` | 수동 동기화 | 신규 항목만 재확인 동기화 | |
| 이력 행 `[보기]` | 동기화 이력 | fms_sync_logs 상세 모달 (변경 내역 JSON) | |
| 등록대기 행 `[지정]` | 등록대기 목록 | 부서 지정 모달 → 부서 선택 + status='ACTIVE' 전환 | SHM+ |

## 6. 자동 처리 로직

### 6.1 정기 자동 동기화 흐름

```
스케줄러: 매일 06:00
  1. fms_sync_logs INSERT (result='IN_PROGRESS', sync_type='FMS')
  2. IF-003 FMS API 호출 (changed_since 기준)
  3. targets UPSERT:
     - 신규 fms_id: INSERT (status='PENDING', department_id=NULL)
     - 기존 fms_id: UPDATE (cdpa_category, facility_grade, address)
     - FMS에서 삭제: status='INACTIVE'
  4. fms_sync_logs UPDATE (result='SUCCESS' / 'FAILED', 카운트, log_detail)
  5. 등록대기 1건 이상이면 SHM+에게 새올 포틀릿 알림
     (category='system', "신규 시설 등록대기: N건 — 부서 지정 필요")
```

### 6.2 등록대기 항목 [지정] 처리

```
[지정] 클릭 → 부서 선택 모달:
  - departments 트리 selector (권한 범위 내)
  - 확인 시:
    1. targets UPDATE (department_id, status='ACTIVE')
    2. trg_targets_insert 트리거 발동:
       - departments.head_user_id 조회
       - target_assignees INSERT (role='RESPONSIBLE', source='AUTO')
       - 새올 포틀릿 알림 (부서장)
    3. audit_logs INSERT
    4. 등록대기 목록 새로고침
```

### 6.3 한글 → ENUM 매핑 (IF-003 §3.4)

```
FMS 응답의 한글 값:
  "공중이용시설" → 'PUBLIC_USE'
  "원료·제조물" → 'RAW_MATERIAL'
  "공중교통수단" → 'PUBLIC_TRANSPORT'
  "1종" → 'GRADE_1' / "2종" → 'GRADE_2' / "3종" → 'GRADE_3'

매핑 미존재 시: status='PENDING' + 운영자 알림 (수동 검토 필요)
```

### 6.4 FMS 외부 URL 패턴

```
TGT02-D 기본정보 탭의 [FMS에서 보기] 링크:
  외부 URL = {fms_external_url_pattern}.replace('{fms_id}', target.fms_id)
  (예: https://fms.damyang.go.kr/facilities/{fms_id})

본 화면(TGT04-S)에서 URL 패턴 설정 가능 (협의 후 확정).
```

## 7. 검증·오류 처리

| 케이스 | 메시지 | 처리 |
|--------|--------|------|
| API 응답 없음 | "FMS 연결 실패: {오류 메시지}" | 토스트 + fms_sync_logs FAILED |
| 한글 → ENUM 매핑 실패 | "[행 N] FMS 분류 매핑 실패: {원본 값}" | 해당 행 PENDING + 운영자 알림 |
| 부서 지정 권한 부족 | "부서 지정 권한이 없습니다" | 차단 |
| 진행 중 재클릭 | "동기화가 이미 진행 중입니다" | 토스트 |

## 8. 관련 화면 흐름

```
TGT04-S
   ├─ [전체 동기화] → 비동기 진행 → 결과 모달
   ├─ [등록대기 항목만] → 신규 항목 재확인
   ├─ 등록대기 [지정] → 부서 선택 모달 → status='ACTIVE'
   │     → target_assignees RESPONSIBLE(AUTO) 자동 매핑
   ├─ 이력 [보기] → fms_sync_logs 상세 모달
   └─ [수정] → 연동 설정 수정 모달
```

## 9. 관련 DB 테이블

- `fms_sync_logs` (DB-001 §3.2): 동기화 이력
- `targets` (DB-001 §2.3): UPSERT 대상 (FACILITY 한정)
- `target_assignees` (DB-001 §2.4): 부서 지정 후 자동 매핑 트리거
- `departments` (DB-001 §2.1): 부서 selector
- `audit_logs` (DB-001 §2.12): 설정 변경·부서 지정 감사

## 10. 관련 인터페이스

- **IF-003 FMS**: 본 화면의 핵심 연동 대상

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성 |

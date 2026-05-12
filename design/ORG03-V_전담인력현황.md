# ORG03-V — 전담인력 현황

> 화면 ID: **ORG03-V**
> 모듈: ORG (전담조직)
> SFR: SFR-006 (전담조직) / SFR-010 (안전관리자 인력)
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-006·010, DB-001 §6.1 dedicated_personnel / §2.4 target_assignees / §6.2 user_qualifications

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | ORG03-V |
| 화면명 | 전담인력 현황 |
| URL | `/organization/dedicated` |
| 화면 유형 | V (View) |
| 접근 권한 | 전체 열람 / SHM+ 선임·해제 |
| 법적 근거 | 중대재해처벌법 시행령 제4조 / 산업안전보건법 제17조·제18조 |

## 2. 진입 경로

- GNB **전담조직** > LNB **전담인력**
- ORG01-V 우측 패널 [전담인력 관리]
- ORG01-V 우측 패널 안전·보건 충족 행 클릭 (해당 역할 카드로 scroll)
- CON06-F 안전관리자 미달 모달 [전담인력 화면으로]
- 새올 포틀릿 알림 (안전관리자 자격 미보유 강제 선임 등) 링크

> 모듈 내 다른 화면(조직도 / 구성원 / 행정포털 동기화)으로의 이동은 좌측 사이드 메뉴(LNB)로 처리.

## 3. 레이아웃

```
┌────────────────────────────────────────────────────┐
│ ● 전담인력                                          │
│   부서별 안전관리자·보건관리자 선임 현황              │
│                                                    │
│ 필터: [부서▼ 전체] [충족여부▼]                       │
│                                                    │
│ ─── 자치행정과 (15명) ─────────────────              │
│ ┌─────────────────────────────────────────┐       │
│ │ 안전관리자       [충족] 1/1명           │       │
│ │ 김안전 (7급, 산업안전기사)    [수정]      │       │
│ ├─────────────────────────────────────────┤       │
│ │ 보건관리자       [미충족] 0/1명 ⚠         │       │
│ │ 담당자 미지정                  [선임]     │       │
│ ├─────────────────────────────────────────┤       │
│ │ 관리감독자       [자동] 1명             │       │
│ │ 홍길동 (부서장 자동 매핑)                │       │
│ └─────────────────────────────────────────┘       │
│                                                    │
│ ─── 농업기술센터 (22명) ────────                    │
│ ...                                                │
└────────────────────────────────────────────────────┘
```

## 4. 표시 항목

### 4.1 부서 단위 카드 그룹

| 항목 | 데이터 소스 |
|------|------------|
| 부서명 + 인원수 | `departments.name + COUNT(users WHERE department_id)` |

### 4.2 역할 카드 (안전관리자 / 보건관리자 / 관리감독자 / 산업보건의)

| 항목 | 데이터 소스 |
|------|------------|
| 역할명 | 정적 (4종: SAFETY_MGR / HEALTH_MGR / SUPERVISOR / HEALTH_DOCTOR) |
| 충족 배지 | 산출 결과 (§4.3) |
| 충족 인원수 | `COUNT(dedicated_personnel WHERE department_id AND role_type AND user_id IS NOT NULL)` |
| 법정 필요 인원 | `dedicated_personnel.required_count` |
| 선임자 정보 | JOIN `users.name + position` + 자격증 표시 |

### 4.3 충족 여부 산출 로직

```
부서 인원수 → legal_requirements 마스터 조회 (협의 후 확정)
  → 안전관리자 N명 필요 여부 판단
  → 보건관리자 N명 필요 여부 판단
  → 산업보건의 필요 여부 판단

target_assignees 집계 (부서 산하 관리대상의 역할별 COUNT):
  - SAFETY_MGR: 부서 산하 targets 중 SAFETY_MGR 매핑 사용자 수
  - HEALTH_MGR: 동일
  - HEALTH_DOCTOR: 동일

dedicated_personnel vs target_assignees 비교 → 충족/미충족 배지

관리감독자(SUPERVISOR):
  - 부서장(departments.head_user_id) 자동 매핑 → "자동" 배지
  - target_assignees.RESPONSIBLE(source='AUTO')와 동일 사용자
```

### 4.4 충족·미충족 배지

| 코드 | 표시명 | 색상 |
|------|--------|------|
| MET | 충족 | 초록 |
| UNMET | 미충족 | 빨강 |
| AUTO | 자동 (관리감독자) | 파랑 |
| OPTIONAL | 선택 (법정 비대상) | 회색 |

## 5. 필터 옵션

| 필터 | 옵션 | 비고 |
|------|------|------|
| 부서 | 전체 / departments 목록 | 권한 범위 내. URL `?department_id=` |
| 충족여부 | 전체 / 충족 / 미충족 | 미충족만 보기로 빠른 점검 가능 |

## 6. 버튼·링크 액션

| 요소 | 위치 | 액션 | 조건·비고 |
|------|------|------|---------|
| `[부서 ▼]` 필터 | 필터 바 | 부서 필터링 + URL 동기화 | |
| `[충족여부 ▼]` 필터 | 필터 바 | MET/UNMET 필터링 | |
| `[선임]` | 미충족 카드 우측 | ORG03-M 모달 (선임 모드) | SHM+ |
| `[수정]` | 충족 카드 우측 | ORG03-M 모달 (수정 모드, prefill) | SHM+ |
| `[+ 선임하기]` | 담당자 미지정 카드 | ORG03-M 모달 (선임 모드) | SHM+ |
| `[해제]` | 충족 카드 우측 | 확인 모달 → `dedicated_personnel.user_id=NULL` | SHM+ |
| 사용자명 클릭 | 카드 | ORG02-D 이동 | |
| 자격증 텍스트 hover | 카드 | 툴팁: 자격증 상세 (유효/만료/D-N) | |
| 충족·미충족 배지 | 카드 헤더 | (배지만, 클릭 액션 없음) | |
| 관리감독자 카드 | 부서 카드 하단 | 부서장 자동 매핑 정보 (`source='AUTO'`) | 수정 불가 — 부서장 변경 시 자동 갱신 |

## 7. 자동 처리 로직

### 7.1 자격증 보유 검증 (ORG03-M 선임 시점에 수행)

```
선임 대상자 선택 시:
  user_qualifications 조회 → 역할별 필수 자격증 매칭
    - SAFETY_MGR: 산업안전기사·산업안전산업기사 등
    - HEALTH_MGR: 산업위생기사·간호사 등
    - HEALTH_DOCTOR: 의사 면허
  
  보유 시: ✅ 자격증 보유 배지
  미보유 시: ⚠ 자격증 미보유 배지 + 강제 선임 경고 모달
```

### 7.2 강제 선임 처리

```
자격 미보유 + 강제 선임 확인 시:
  1. dedicated_personnel UPSERT
  2. warnings INSERT (warning_type='unqualified_appointment', user_id, role_type)
  3. audit_logs INSERT
  4. 선임자에게 새올 포틀릿 알림
  5. 운영자(CEO/GM)에게 새올 포틀릿 알림 (system 카테고리)
```

### 7.3 관리감독자 자동 매핑

```
부서장(departments.head_user_id) → 관리감독자 카드 자동 표시
부서장 변경 시 (IF-002 동기화 트리거) → 본 화면도 자동 갱신
수동 변경 불가 (정보 표시 전용)
```

### 7.4 충족 여부 산출 (DB View 또는 캐싱)

```
v_dedicated_status (예시):
  SELECT department_id, role_type, required_count,
         COUNT(user_id) AS assigned_count,
         CASE WHEN COUNT(user_id) >= required_count THEN 'MET' ELSE 'UNMET' END AS status
  FROM dedicated_personnel
  GROUP BY department_id, role_type, required_count;

캐싱: 5분 — dedicated_personnel 변경 시 invalidate
```

## 8. 데이터 스코프

| 권한 | 보이는 범위 |
|------|----------|
| CEO | 전체 부서 |
| GM | 본 부서 + 산하 |
| SM/SHM | 본 부서 |
| WKR | 본인 소속 부서만 (열람만, 선임 불가) |
| SUB/CON | 본 화면 접근 불가 |

## 9. 오류 처리

| 케이스 | 메시지 | 처리 |
|--------|--------|------|
| 자격 미보유 + 강제 선임 시 | 경고 모달: "자격증을 보유하지 않았습니다. 강제 선임하시겠습니까?" | [취소] [강제 선임] |
| 동일 사용자 중복 선임 시도 | "이미 다른 부서에 선임된 사용자입니다. 진행하시겠습니까?" | 확인 모달 |
| 비활성 사용자 선임 시도 | "비활성 사용자는 선임할 수 없습니다" | 차단 |

## 10. 관련 화면 흐름

```
ORG03-V
   ├─ [선임] / [+ 선임하기] → ORG03-M 모달
   ├─ [수정] → ORG03-M 모달 (수정 모드)
   ├─ [해제] → 확인 모달 → UPDATE
   ├─ 사용자명 클릭 → ORG02-D
   └─ (부서장 변경 시 관리감독자 카드 자동 갱신)
```

## 11. 관련 DB 테이블

- `dedicated_personnel` (DB-001 §6.1): 부서 단위 법정 인원 매핑
- `users` (DB-001 §2.2): 선임자 정보
- `user_qualifications` (DB-001 §6.2): 자격증 검증
- `departments` (DB-001 §2.1): 부서명·부서장
- `target_assignees` (DB-001 §2.4): 관리대상 단위 안전관리자 집계 (산출 로직)
- `warnings` (DB-001 §6.3): 자격 미보유 강제 선임 이력
- `legal_requirements` (Phase 2 마스터, 협의 후 확정): 부서 인원 vs 법정 인원 산출 기준

## 12. 관련 인터페이스

- 외부 인터페이스 없음 (자체 산출)

## 13. 성능 고려

- 충족 여부 산출 view 캐싱 (5분)
- `idx_dedicated_dept_role` (department_id, role_type) 인덱스 활용
- 부서별 카드 lazy 로딩 (스크롤 시 추가 로드)

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. dedicated_personnel(부서 단위)와 target_assignees(관리대상 단위) 분리 운영 명시 |
| v1.1 | 2026-05-12 | 모듈 탭 제거 → LNB 사이드 메뉴로 이동. URL `?tab=dedicated` → `/dedicated` |

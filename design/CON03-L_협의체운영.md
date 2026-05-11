# CON03-L — 협의체 운영

> 화면 ID: **CON03-L**
> 모듈: CON (도급관리)
> SFR: SFR-013
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-013, 산업안전보건법 제64조 (도급사업 안전보건 협의체)

> ⚠ 본 화면은 도급 안전보건협의체 운영. 산업안전보건위원회 안건 관리는 별도 메뉴 (SFR-011 OPN 모듈, Phase 3 — 결정사항 #20)

---

## 1. 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | CON03-L |
| 화면명 | 도급 안전보건협의체 운영 |
| URL | `/contracts?tab=council` |
| 화면 유형 | L (List) |
| 접근 권한 | SHM+ |

## 2. 진입 경로

- GNB > 도급관리 > 탭 [협의체 운영]
- CON01-D 협의체 탭

## 3. 레이아웃

```
┌──────────────────────────────────────────────────────────┐
│ 도급관리                                                  │
│ [도급계약 목록][수급업체 목록][협의체 운영][TBM][설정]      │
│                                                          │
│ 필터: [계약▼][기간▼]                       [+ 회의 등록]   │
│                                                          │
│ 회의일자  │계약           │회의명          │참석자│의결 │ 관리│
│ ─────────────────────────────────────────────────────────│
│ 2026-04-15│청사 시설 보수│4월 정기 협의체 │ 8명 │ 3건 │[상세]│
│ 2026-03-20│청소·시설관리 │분기 협의체 1Q  │ 5명 │ 2건 │[상세]│
│ ...                                                      │
│                                                          │
│ [페이지네이션]                                            │
└──────────────────────────────────────────────────────────┘
```

## 4. 표시 항목

### 4.1 목록 컬럼

| 컬럼 | 데이터 소스 | 비고 |
|------|------------|------|
| 회의일자 | `council_meetings.meeting_date` | |
| 계약 | JOIN `contracts.name` + 계약유형 배지 | 클릭 시 CON01-D |
| 회의명 | `council_meetings.title` | |
| 참석자 수 | `council_meetings.participants` JSON 길이 | |
| 의결사항 수 | `council_meetings.decisions` JSON 길이 | |
| 회의록 첨부 | `meeting_record_url` | 아이콘으로 첨부 여부 표시 |

## 5. 필터 옵션

| 필터 | 옵션 | 비고 |
|------|------|------|
| 계약 | 전체 / 진행 중 contracts 목록 | URL `?contract_id=` |
| 기간 | 전체 / 이번 분기 / 올해 / 작년 | `meeting_date` 기준 |

## 6. 버튼·링크 액션

| 요소 | 위치 | 액션 | 조건·비고 |
|------|------|------|---------|
| 탭 `[협의체 운영]` | 상단 탭 | 현재 화면 | 활성 |
| 필터 셋 | 필터 바 | 각 컬럼별 필터 + URL 동기화 | |
| `[+ 회의 등록]` | 우상단 | CON03-M 모달 (회의 등록) | SHM+ |
| 행 클릭 / `[상세]` | 목록 | 회의 상세 모달 또는 CON03-D 페이지 | |
| 회의록 아이콘 | 목록 | 회의록 새 탭 다운로드 | 첨부 있을 때 |

## 7. CON03-M 회의 등록 모달 (보조)

| 필드 | 타입 | 필수 | 비고 |
|------|------|------|------|
| 계약 | SELECT (contracts) | ✅ | 진행 중·시공 중 계약만 |
| 회의일자 | DATETIME | ✅ | |
| 회의명 | TEXT | ✅ | 예: "4월 정기 협의체" |
| 참석자 | 복합 입력 | ✅ | 내부 직원(USER_SEARCH) + 외부 SUB 멤버(TEXT 입력) |
| 안건 | TEXTAREA | ✅ | |
| 의결사항 | TEXTAREA | ❌ | |
| 회의록 첨부 | FILE | ❌ | PDF·이미지 |

### 7.1 참석자 입력

```
참석자는 두 가지 형태:
  1. 내부 직원: 구성원 검색으로 user_id 매핑
  2. 외부 SUB 직원: 회사명 + 이름·직위 자유 입력
  
council_meetings.participants JSON:
  [
    {"type": "internal", "user_id": "uuid", "name": "김안전", "position": "SHM"},
    {"type": "external", "company": "A건설", "name": "박직원", "position": "안전관리자"}
  ]

권장: 5인 이상 (안내만, 차단 안 함)
```

### 7.2 저장 동작

```
1. council_meetings INSERT (
     contract_id, meeting_date, title,
     participants JSON, agenda, decisions JSON, meeting_record_url, created_by)
2. audit_logs INSERT
3. 새올 포틀릿 알림 (대상자: 계약 담당자, category='contract',
   "{사업명} 안전보건협의체 회의 등록")
4. 모달 닫기 + 목록 새로고침
```

## 8. CON03-D 회의 상세 (보조 — 본 문서에 통합 정의)

| 항목 | 내용 |
|------|------|
| URL | `/contracts/:contract_id/council/:meeting_id` |
| 화면 유형 | D (Detail) |
| 접근 권한 | SHM+ |

### 8.1 표시 항목

- 회의 기본정보 (계약·일자·회의명)
- 참석자 명단 (내부·외부 구분)
- 안건 내용
- 의결사항 목록
- 회의록 첨부 다운로드
- 후속 조치 (선택 — 의결사항별 개선조치 연계)

### 8.2 버튼·링크 액션

| 요소 | 액션 |
|------|------|
| `[수정]` | CON03-M 모달 (수정 모드) — SHM+ + 본인 등록 또는 GM 이상 |
| `[삭제]` | 확인 모달 → council_meetings DELETE — CEO/GM |
| `[PDF 출력]` | 회의록 인쇄용 레이아웃 |

## 9. 데이터 스코프

| 권한 | 보이는 범위 |
|------|----------|
| CEO | 전체 |
| GM | 본 부서 계약의 협의체 |
| SM/SHM | 본인 담당 계약의 협의체 |
| 외부 (SUB/CON) | 본 화면 접근 불가 (외부 SUB는 회의 참석자 정보로만 입력) |

## 10. 검증 규칙

| 항목 | 검증 |
|------|------|
| 회의일자 | 미래 일자 입력 가능 (예정 회의) |
| 참석자 | 1명 이상 필수. 5인 미만 시 안내 (차단 안 함) |
| 안건 | 1~5000자 |

## 11. 오류 처리

| 케이스 | 메시지 | 처리 |
|--------|--------|------|
| 참석자 0명 | "참석자를 1명 이상 입력해주세요" | 인라인 |
| 5인 미만 참석 | "협의체는 5인 이상이 권장됩니다. 그래도 등록하시겠습니까?" | 확인 모달 |
| 종료 계약에 회의 등록 시도 | "종료된 계약입니다" | 인라인 안내 (가능은 함 — 사후 기록) |

## 12. 관련 화면 흐름

```
CON03-L
   ├─ [+ 회의 등록] → CON03-M
   ├─ 행 클릭 → CON03-D (회의 상세)
   └─ 계약명 클릭 → CON01-D
```

## 13. 관련 DB 테이블

- `council_meetings` (Phase 2 — 본 문서에서 정의):

```sql
CREATE TABLE council_meetings (
  id              UUID PRIMARY KEY,
  contract_id     UUID NOT NULL REFERENCES contracts(id),
  meeting_date    TIMESTAMP NOT NULL,
  title           VARCHAR(200) NOT NULL,
  participants    JSON NOT NULL,
  agenda          TEXT NOT NULL,
  decisions       JSON,
  meeting_record_url VARCHAR(500),
  created_by      UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP
);
```

- `contracts` (DB-001 §5.1): 계약 JOIN
- `users` (DB-001 §2.2): 내부 참석자 매핑
- `audit_logs` (DB-001 §2.12): 등록·수정 감사

## 14. 관련 인터페이스

- 외부 인터페이스 없음
- IF-005 새올 포틀릿 (간접): 등록 알림

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. CON03-D 회의 상세 통합 정의. 산안위 안건(SFR-011 OPN)과 분리 운영 명시 |

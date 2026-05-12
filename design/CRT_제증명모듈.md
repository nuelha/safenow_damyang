# CRT 모듈 — 제증명 관리

> 화면 ID: **CRT01-V** / **CRT02-F** / **CRT03-S**
> 모듈: CRT (제증명)
> SFR: SFR-021
> 버전: v1.0 | 작성일: 2026-05-11
> 관련 문서: SRS-001 §3 SFR-021, 결정사항 #23 (제증명 2종 — 이행확인서 + 점검결과 증명서)

> ※ 외부 기관·시민에게 발급하는 안전관리 증명서. PDF + 워터마크 + QR 코드로 위변조 방지.

---

## 0. 모듈 GNB

```
GNB > 제증명
   ├─ [발급 이력] (CRT01-V)
   ├─ [+ 증명서 발급] (CRT02-F)
   └─ [설정] (CRT03-S — 템플릿·정책)
```

---

## A. CRT01-V 발급 이력 (현황·목록 통합)

### A.1 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | CRT01-V |
| URL | `/certificates` (기본) |
| 화면 유형 | V (View + List) |
| 접근 권한 | CEO·GM·SHM (발급·열람) / SM 본 부서 |
| 기본 진입 화면 | ✅ |

### A.2 진입 경로

- GNB > 제증명
- 새올 포틀릿 알림 (외부 발급 요청 등) 링크

### A.3 레이아웃

```
┌──────────────────────────────────────────────────────────┐
│ 제증명                                                     │
│ [발급 이력] [+ 증명서 발급] [설정]                          │
│                                                            │
│ 📅 [2026 ▼]  유형 [전체 ▼]                                  │
│                                                            │
│ 요약 카드                                                   │
│ ┌──────────┐┌──────────┐┌──────────┐                       │
│ │ 이행확인서││ 점검결과 ││ 총 발급   │                       │
│ │  N건     ││ 증명서  N││  N건     │                       │
│ └──────────┘└──────────┘└──────────┘                       │
│                                                            │
│ 발급 이력                                                   │
│ ─────────────────────────────────                          │
│ 필터: [유형▼][발급일▼][신청자▼][검색]                       │
│                                                            │
│ 발급일자│ 유형         │ 신청자  │ 대상       │ 상태  │관리 │
│ ──────────────────────────────────────────────────────  │
│ 05-11  │이행확인서    │홍길동  │군청 청사   │발급완료│[보기]│
│ 05-10  │점검결과 증명 │A건설   │청사 시설  │발급완료│[보기]│
│ 05-08  │이행확인서    │농기계임대│농업기술센터│ 발급 중│[취소]│
│ ...                                                        │
└──────────────────────────────────────────────────────────┘
```

### A.4 결정사항 #23 — 제증명 2종

| 코드 | 표시명 | 용도 |
|------|--------|------|
| `compliance_certificate` | 이행확인서 | 안전관리 의무이행 사실 확인 (외부 기관 제출용) |
| `inspection_result` | 점검결과 증명서 | 시설·관리대상 안전점검 결과 증명 (외부 발급용) |

### A.5 발급 이력 컬럼

| 컬럼 | 데이터 소스 |
|------|------------|
| 발급일자 | `certificates.issued_at` |
| 유형 | `cert_type` 배지 (2종) |
| 신청자 | `applicant_name` |
| 대상 | `target_id` JOIN 관리대상명 또는 부서명 |
| 상태 | `status` (PENDING/ISSUED/REVOKED) |
| 관리 | [보기] / [재발급] / [취소] |

### A.6 데이터 스코프

| 권한 | 보이는 범위 |
|------|----------|
| CEO | 전체 |
| GM | 본 부서 발급 |
| SHM | 본 부서 + 본인 발급 |
| SM | 본 부서 (열람만) |

---

## B. CRT02-F 증명서 발급

### B.1 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | CRT02-F |
| URL | `/certificates/new` |
| 화면 유형 | F (Form) |
| 접근 권한 | SHM+ |

### B.2 레이아웃

```
┌──────────────────────────────────────────────────────────┐
│ ← 발급 이력                                                 │
│                                                            │
│ 증명서 발급                                                 │
│                                                            │
│ 1. 증명서 유형                                              │
│    ○ 이행확인서                                             │
│    ○ 점검결과 증명서                                         │
│                                                            │
│ 2. 신청 정보                                                │
│    신청자명     [________________]                          │
│    신청자 구분  ○ 개인 ○ 법인                               │
│    신청자 연락처 [________________]                          │
│    신청 사유    [________________________________]          │
│                                                            │
│ 3. 대상 정보                                                │
│    대상 관리대상 [관리대상 selector ▼]                       │
│    또는 대상 부서 [부서 selector ▼]                          │
│    기간          [DATE] ~ [DATE]                            │
│                                                            │
│ 4. 증명 내용 자동 산출 (이행확인서)                          │
│    ─────────────────────────────────                       │
│    ☑ 의무이행률: 92% (해당 기간)                            │
│    ☑ 위험성평가 시행: 8건 완료                              │
│    ☑ 안전보건교육 이수율: 100%                              │
│    ☑ 안전점검 실시율: 95%                                   │
│    ☑ 사고 발생 0건                                          │
│    ☑ 도급사업 평가 적격률: 100%                             │
│    (자동 산출, 사용자 편집 가능)                             │
│                                                            │
│ 5. 첨부 서류                                                │
│    [신청자 신분증·법인 등기부 등]                            │
│                                                            │
│ 6. 발급자 정보                                              │
│    발급 부서: 자치행정과                                     │
│    발급 책임자: 자치행정과장 홍길동                          │
│    [결재요청 (온나라)]                                        │
│                                                            │
│              [임시저장] [PDF 미리보기] [발급]                │
└──────────────────────────────────────────────────────────┘
```

### B.3 입력 항목

| 필드 | 타입 | 필수 |
|------|------|------|
| 증명서 유형 | RADIO | ✅ |
| 신청자명 | TEXT | ✅ |
| 신청자 구분 | RADIO (개인/법인) | ✅ |
| 신청자 연락처 | TEL | ✅ |
| 신청 사유 | TEXTAREA | ✅ |
| 대상 관리대상 또는 부서 | SELECT | ✅ |
| 기간 | DATE × 2 | ✅ |
| 증명 내용 항목 | CHECKBOX (자동 산출) | ✅ |
| 첨부 (신분증·등기부) | FILE | ❌ |

### B.4 PDF 자동 생성

```
1. 미리보기:
   [PDF 미리보기] → PDF 임시 생성 → 새 탭 표시 (워터마크: "미리보기")
2. 발급:
   1. certificates INSERT (status='PENDING_APPROVAL')
   2. 결재 진행 (온나라 안내 팝업 — 결정사항 #2)
   3. 결재 완료 후 [발급 완료] 클릭:
      - PDF 최종 생성:
        ● 워터마크: 발급일·증명번호
        ● QR 코드: 위변조 검증 URL (https://safety.damyang.go.kr/verify/:cert_no)
        ● 발급자 도장 이미지 (옵션)
        ● 발급 책임자 서명 이미지 (옵션)
      - pdf_url에 저장
      - certificates.status='ISSUED' + issued_at=NOW()
      - 신청자에게 SMS/이메일 알림 (협의)
```

### B.5 점검결과 증명서 특이사항

```
대상이 INSPECTION 관련일 때:
  - inspection_id 직접 선택 가능
  - 점검 항목·결과·증빙 사진 자동 포함
  - 점검자 정보 자동 포함
```

### B.6 위변조 방지 (QR 코드)

```
QR 코드 URL: https://safety.damyang.go.kr/verify/:cert_no

검증 페이지 (비로그인 진입 가능):
  - 증명번호 입력 또는 QR 스캔
  - 발급 정보 표시 (발급일·발급자·신청자 일부 비식별 처리)
  - 발급 진위 확인
```

---

## C. CRT03-S 설정

### C.1 화면 정보

| 항목 | 내용 |
|------|------|
| 화면 ID | CRT03-S |
| URL | `/certificates?tab=settings` |
| 화면 유형 | S (Settings) |
| 접근 권한 | CEO / GM |

### C.2 탭

#### C.2.1 증명서 템플릿

```
각 증명서 유형별 PDF 템플릿:
  - 헤더 (담양군 로고·주소·연락처)
  - 증명 내용 형식
  - 푸터 (발급자·발급일·증명번호·QR 코드 위치)
  - 워터마크 위치·디자인

HTML 템플릿 (Handlebars 또는 유사) + 변수:
  {{applicant_name}}, {{cert_number}}, {{issued_date}}, 
  {{target_name}}, {{compliance_rate}}, ...
```

#### C.2.2 발급 정책

| 정책 | 내용 |
|------|------|
| 결재 요건 | 모든 증명서 결재 필수 / 일부만 결재 / 결재 면제 |
| 유효 기간 | 발급일로부터 N개월 (기본 6개월) |
| 갱신 | 만료 시 [재발급] 옵션 |
| 무료/유료 | 발급 수수료 정책 (조례 기준) |

#### C.2.3 QR 코드·워터마크 설정

- 검증 URL 도메인 설정
- 워터마크 텍스트·투명도
- QR 코드 위치 (좌하/우하 등)

---

## 공통 — 자동 처리

### 발급 후 검증 페이지

```
/verify/:cert_no (비로그인 진입 가능)
  - certificates 조회
  - status='ISSUED' AND issued_at + valid_months >= NOW():
    "✓ 진위 확인됨 — 발급일: {date}, 발급기관: 담양군 자치행정과"
  - 만료:
    "⚠ 만료된 증명서입니다 (만료일: {date})"
  - 회수:
    "⚠ 회수된 증명서입니다 (회수일: {date})"
  - 미존재:
    "❌ 등록되지 않은 증명서 번호입니다"
```

## 공통 — 관련 DB 테이블

```sql
CREATE TABLE certificates (
  id              UUID PRIMARY KEY,
  cert_no         VARCHAR(50) UNIQUE NOT NULL,           -- 증명번호 (자동 채번: YYYYMMDDNNN)
  cert_type       ENUM('compliance_certificate','inspection_result') NOT NULL,
  applicant_name  VARCHAR(100) NOT NULL,
  applicant_type  ENUM('INDIVIDUAL','CORPORATE') NOT NULL,
  applicant_contact VARCHAR(50),
  application_reason TEXT,
  
  target_id       UUID REFERENCES targets(id),
  target_department_id UUID REFERENCES departments(id),
  inspection_id   UUID REFERENCES inspections(id),       -- 점검결과 증명서일 때
  period_start    DATE,
  period_end      DATE,
  
  content_data    JSON,                                   -- 증명 내용 JSON (자동 산출 항목)
  pdf_url         VARCHAR(500),                            -- 최종 PDF
  verify_url      VARCHAR(500),                            -- QR 검증 URL
  
  status          ENUM('DRAFT','PENDING_APPROVAL','ISSUED','REVOKED','EXPIRED') DEFAULT 'DRAFT',
  approval_status ENUM('NOT_REQUESTED','REQUESTED','APPROVED','REJECTED') DEFAULT 'NOT_REQUESTED',
  approver_name   VARCHAR(100),
  
  issued_by       UUID REFERENCES users(id),
  issued_at       TIMESTAMP,
  valid_until     DATE,
  revoked_at      TIMESTAMP,
  revoke_reason   TEXT,
  
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP
);

CREATE INDEX idx_certificates_cert_no ON certificates(cert_no);
CREATE INDEX idx_certificates_status ON certificates(status);
CREATE INDEX idx_certificates_issued ON certificates(issued_at);
```

## 공통 — 관련 인터페이스

- 외부 인터페이스 없음 (자체 발급)
- IF-005 새올 포틀릿: 발급 요청·완료 알림
- IF-006 SMTP (간접): 외부 신청자에게 발급 알림 이메일 (협의)

---

## 변경 이력

| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2026-05-11 | 초안 작성. CRT01·02·03 통합 정의. 제증명 2종 (#23) + PDF 워터마크·QR 위변조 방지 |

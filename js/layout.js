/* =========================================================================
 * 담양군 중대재해예방 시스템 — 공통 레이아웃
 * design/0_디자인시스템.md 의 §5 (레이아웃) / §6.1~6.3 (헤더·GNB·사이드바) 구현.
 *
 * 사용법:
 *   <body data-dy-page="safety-policy">  <!-- 활성 페이지 ID -->
 *     <main class="dy-main"> ...본문... </main>
 *     <script src="./js/layout.js"></script>
 *   </body>
 * ========================================================================= */
(function () {
    'use strict';

    /* --- 아이콘 (Lucide 스타일, stroke 1.75) --- */
    const ICON = {
        shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
        pocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-20 0V5a2 2 0 0 1 2-2z"/><polyline points="8 10 12 14 16 10"/></svg>',
        grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
        building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M16 10h.01"/></svg>',
        alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m10.29 3.86-8.4 14.74A2 2 0 0 0 3.62 22h16.76a2 2 0 0 0 1.73-3.4L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>',
        cog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
        chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
        bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
        menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
        chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
        user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
        list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
        file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
        calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
        coins: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>',
        dot: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/></svg>',
        external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>',
    };

    /* --- 네비게이션 데이터 ---
     *   메뉴구조도 v1.0 (design/2_메뉴구조도_권한매트릭스.md §2.1) 기준.
     *   시안 GNB 6개 그룹 디자인에 맞춰, 메뉴구조도의 18개 모듈을 의미적으로 그룹핑.
     *
     *   각 사이드바 아이템:
     *     id    — body[data-dy-page] 와 매칭되면 활성 표시
     *     label — 표시명 (메뉴구조도 §5.1의 화면명)
     *     href  — 구현된 페이지 (Phase 1 일부)
     *     soon  — 미구현 모듈의 "준비 중" 토스트 라벨 (화면 ID 포함)
     *     screen— 메뉴구조도의 화면 ID (참고용)
     */
    /* ─── PRD-DAMYANG-002 GNB 그룹핑 통합 v1.0 (IA v1.4) ────────────────
     *   18개 GNB → 8개 업무 성격별 그룹 + 홈
     *   순서: 사용 빈도 기준 (위험성평가→시스템 관리)
     *   화면 ID·URL·DB·SFR 매핑은 변동 없음 — IA 레벨 그룹핑만
     */
    const NAV = [
        // 홈 — 대시보드 (DSH / SFR-020)
        { id: 'dashboard', label: '홈', icon: 'grid', items: [
            { id: 'index', label: '통합 대시보드', icon: 'grid', href: 'index.html', screen: 'DSH01-V' },
        ]},

        // GNB 1. 위험성평가 (RSK / SFR-007) — 가장 자주 진입
        //    개선조치 통합 정책: RSK03-L 폐지 → IMP01-L?source=risk_assessment로 조회
        { id: 'risk', label: '위험성평가', icon: 'alert', items: [
            { id: 'rsk-status',   label: '현황',                 icon: 'chart', href: 'risk-assessment.html', screen: 'RSK01-V' },
            { id: 'rsk-list',     label: '평가 목록',            icon: 'list',  href: 'risk-list.html',        screen: 'RSK02-L' },
            { id: 'rsk-improve',  label: '개선조치 (위험성평가)', icon: 'check', href: 'imp-status.html?source=risk_assessment', screen: 'RSK03-L', external: true },
            { id: 'rsk-settings', label: '설정',                 icon: 'cog',   href: 'risk-settings.html',    screen: 'RSK04-S' },
        ]},

        // GNB 2. 점검·진단 (INS + DOC / SFR-012)
        { id: 'inspect', label: '점검·진단', icon: 'check', items: [
            { id: 'ins-status',     label: '안전점검 현황', icon: 'check', href: 'ins-status.html',  screen: 'INS01-V' },
            { id: 'ins-list',       label: '안전점검 목록', icon: 'list',  href: 'ins-list.html',     screen: 'INS02-L' },
            { id: 'ins-settings',   label: '안전점검 설정', icon: 'cog',   href: 'ins-settings.html', screen: 'INS03-S' },
            // 업무문서 (DOC) — DOC01-L 내부 탭으로 [매뉴얼]·[점검표] 통합
            { id: 'doc-manual',     label: '업무문서',      icon: 'file',  href: 'doc-manual.html',   screen: 'DOC01-L' },
        ]},

        // GNB 3. 도급 관리 (CON / SFR-013) — 외부 사용자(SUB) 협업 워크플로우
        { id: 'contract', label: '도급 관리', icon: 'building', items: [
            { id: 'contractor',   label: '도급계약',    icon: 'building', href: 'contractor.html',    screen: 'CON01-L' },
            { id: 'con-sub',      label: '수급업체',    icon: 'users',    href: 'con-sub.html',       screen: 'CON02-L' },
            { id: 'con-council',  label: '협의체',      icon: 'list',     href: 'con-council.html',   screen: 'CON03-L' },
            { id: 'con-tbm',      label: 'TBM',         icon: 'check',    href: 'con-tbm.html',       screen: 'CON09-L' },
            { id: 'con-settings', label: '설정',        icon: 'cog',      href: 'con-settings.html',  screen: 'CON10-S' },
        ]},

        // GNB 4. 종사자 참여 (OPN / SFR-011·019)
        { id: 'opinion', label: '종사자 참여', icon: 'bell', items: [
            { id: 'opn-status',    label: '현황',                icon: 'chart', href: 'opn-status.html',     screen: 'OPN01-V' },
            { id: 'opinion',       label: '의견 목록',           icon: 'list',  href: 'opinion.html',         screen: 'OPN01-L' },
            { id: 'opn-committee', label: '산업안전보건위원회', icon: 'users', href: 'opn-committee.html',   screen: 'OPN03-L' },
            { id: 'opn-settings',  label: '설정',                icon: 'cog',   href: 'opn-settings.html',    screen: 'OPN04-S' },
        ]},

        // GNB 5. 이행·증명 (IMP + CMP + STA + CRT / SFR-003·014·018·021) — 사후 추적·집계·증명
        { id: 'comply', label: '이행·증명', icon: 'check', items: [
            // 개선조치 (IMP / SFR-003) — IMP01-V 내부 탭으로 [전체 목록]·[재발방지대책] 통합
            { id: 'imp-status',   label: '개선조치',       icon: 'check', href: 'imp-status.html', screen: 'IMP01-V' },
            // 이행 관리 (CMP / SFR-014)
            { id: 'cmp-status',   label: '이행 현황',       icon: 'check', href: 'cmp-status.html',   screen: 'CMP01-V' },
            { id: 'cmp-list',     label: '이행 목록',       icon: 'list',  href: 'cmp-list.html',     screen: 'CMP02-L' },
            { id: 'cmp-settings', label: '법령 마스터',     icon: 'cog',   href: 'cmp-settings.html', screen: 'CMP03-S' },
            // 통계 (STA / SFR-018)
            { id: 'sta-status',   label: '종합 통계',       icon: 'chart', href: 'sta-status.html',   screen: 'STA01-V' },
            { id: 'sta-module',   label: '모듈별 통계',     icon: 'chart', href: 'sta-module.html',   screen: 'STA02-V' },
            { id: 'sta-settings', label: '통계 설정',       icon: 'cog',   href: 'sta-settings.html', screen: 'STA03-S' },
            // 제증명 (CRT / SFR-021) — CRT02-F 발급 폼은 CRT01-V의 [+ 증명서 발급] 버튼으로 진입 (다른 폼들과 일관)
            { id: 'crt-history',  label: '제증명 발급 이력', icon: 'file',  href: 'crt-status.html',   screen: 'CRT01-V' },
            { id: 'crt-settings', label: '제증명 설정',      icon: 'cog',   href: 'crt-settings.html', screen: 'CRT03-S' },
        ]},

        // GNB 6. 안전보건 경영 (POL + PLN + BGT + EVL / SFR-005·004·008·009) — 연간 사이클
        { id: 'safety', label: '안전보건 경영', icon: 'shield', items: [
            // 안전보건 방침 (POL / SFR-005) — POL01-L 내부 탭으로 [방침 이력]·[경영방침 점검]·[설정] 통합
            { id: 'safety-policy', label: '방침 관리',      icon: 'shield',   href: 'safety-policy.html', screen: 'POL01-L' },
            // 안전보건 계획 (PLN / SFR-004) — PLN01-V 내부 탭으로 [목록]·[캘린더]·[설정] 통합
            { id: 'pln-status',    label: '계획 관리',      icon: 'chart',    href: 'pln-status.html',    screen: 'PLN01-V' },
            // 안전보건 예산 (BGT / SFR-008) — BGT01-V 내부 탭으로 [트리]·[편성]·[집행]·[설정] 통합
            { id: 'bgt-status',    label: '예산 관리',      icon: 'coins',    href: 'bgt-status.html',    screen: 'BGT01-V' },
            // 인력 평가 (EVL / SFR-009) — EVL01-V 내부 탭으로 [평가 목록]·[설정] 통합
            { id: 'evl-list',      label: '인력 평가',      icon: 'user',     href: 'evl-list.html',      screen: 'EVL01-V' },
        ]},

        // GNB 7. 기반 관리 (TGT + ORG + STF / SFR-002·006·010) — 초기 셋팅·가끔 업데이트
        //    선행 PRD-001 결과: ORG03-V → STF04-V 이전 통합
        { id: 'base', label: '기반 관리', icon: 'building', items: [
            // 관리대상 (TGT / SFR-002)
            { id: 'target-status', label: '관리대상 현황',     icon: 'building', href: 'target-status.html', screen: 'TGT01-V' },
            // 조직 (ORG / SFR-006) — PRD v1.4 "전담조직" → "조직"
            { id: 'org-chart',     label: '조직도',            icon: 'users',    href: 'org-chart.html',     screen: 'ORG01-V' },
            { id: 'organization',  label: '구성원',            icon: 'users',    href: 'organization.html',  screen: 'ORG02-L' },
            // 안전보건 인력 (STF / SFR-010 + SFR-006 공동) — PRD v1.4 "안전관리자 인력" → "안전보건 인력"
            { id: 'stf-status',    label: '전체 인력 현황',    icon: 'chart',    href: 'stf-status.html',    screen: 'STF01-V' },
            { id: 'org-dedicated', label: '부서별 전담인력',   icon: 'user',     href: 'org-dedicated.html', screen: 'STF04-V' },
            { id: 'stf-const',     label: '공사별 선임 현황',  icon: 'building', soon: '공사별 선임 (STF02-V)', screen: 'STF02-V' },
            { id: 'stf-settings',  label: '안전보건 인력 설정', icon: 'cog',     soon: '법정 인원 마스터 (STF03-S)', screen: 'STF03-S' },
        ]},

        // GNB 8. 시스템 관리 (SYS + AUTH06-S + NTF03-S + 감사로그) — CEO/GM/SHM 전용
        //    결정사항 #24: 외부 시스템 연동 단일 진실 공급원(SSoT) = SYS01-S.
        { id: 'system', label: '시스템 관리', icon: 'cog', items: [
            { id: 'sys-integration', label: '외부 시스템 연동', icon: 'cog',    href: 'sys-integration.html', screen: 'SYS01-S' },
            { id: 'sys-ext-users',   label: '외부 사용자 관리', icon: 'users',  href: 'auth-external-users.html', screen: 'AUTH06-S' },
            { id: 'sys-notif',       label: '알림 운영',        icon: 'bell',   href: 'ntf-admin.html',       screen: 'NTF03-S' },
            { id: 'sys-audit',       label: '감사 로그',        icon: 'shield', href: 'audit-log.html', screen: 'AUDIT-L' },
        ]},
    ];

    /* sidebar item id → GNB group 매핑 (자동 생성) */
    function findGroup(pageId) {
        for (const g of NAV) {
            if (g.items.some(it => it.id === pageId)) return g;
        }
        return NAV[0];
    }

    function html(strings, ...values) {
        // 단순 템플릿 (escape 없음 — 내부 정적 데이터만 사용)
        return strings.reduce((out, s, i) => out + s + (values[i] == null ? '' : values[i]), '');
    }

    function renderHeader() {
        return html`
            <header class="dy-header">
                <div style="display:flex;align-items:center;">
                    <button class="dy-mobile-menu" id="dy-mobile-menu-btn" aria-label="메뉴">${ICON.menu}</button>
                    <a class="dy-brand" href="index.html">
                        <span class="dy-brand-icon">${ICON.pocket}</span>
                        <span class="dy-brand-name"><strong>담양군</strong><span>중대재해예방 시스템</span></span>
                    </a>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                    <div class="dy-ntf-wrap" id="dy-ntf-wrap" style="position:relative;">
                        <button class="dy-ntf-btn" id="dy-ntf-btn" type="button" aria-label="알림">
                            ${ICON.bell}
                            <span class="dy-ntf-badge" id="dy-ntf-badge">3</span>
                        </button>
                        <div class="dy-ntf-dropdown" id="dy-ntf-dropdown" role="dialog" aria-hidden="true">
                            <div class="dy-ntf-dropdown-head">
                                <span class="dy-ntf-dropdown-title">알림 <span class="dy-ntf-count">(안 읽음 3건)</span></span>
                                <button class="dy-ntf-read-all" type="button" onclick="window.DYLayout._soon(event, '모두 읽음 처리')">모두 읽음</button>
                            </div>
                            <div class="dy-ntf-dropdown-list">
                                <a class="dy-ntf-item is-unread" href="safety-policy.html">
                                    <span class="dy-ntf-dot approval"></span>
                                    <div class="dy-ntf-item-body">
                                        <div class="dy-ntf-item-head">
                                            <span class="dy-ntf-item-cat approval">결재</span>
                                        </div>
                                        <div class="dy-ntf-item-title">안전경영방침 v2.5 결재 요청</div>
                                        <div class="dy-ntf-item-time">14:23</div>
                                    </div>
                                </a>
                                <a class="dy-ntf-item is-unread" href="target-detail.html">
                                    <span class="dy-ntf-dot assignment"></span>
                                    <div class="dy-ntf-item-body">
                                        <div class="dy-ntf-item-head">
                                            <span class="dy-ntf-item-cat assignment">지정</span>
                                        </div>
                                        <div class="dy-ntf-item-title">군청 청사 관리책임자로 자동 지정</div>
                                        <div class="dy-ntf-item-time">09:15</div>
                                    </div>
                                </a>
                                <a class="dy-ntf-item is-unread" href="cmp-detail.html">
                                    <span class="dy-ntf-dot compliance"></span>
                                    <div class="dy-ntf-item-body">
                                        <div class="dy-ntf-item-head">
                                            <span class="dy-ntf-item-cat compliance">이행</span>
                                        </div>
                                        <div class="dy-ntf-item-title">화학물질 정기 검사 기한 초과 (D+8)</div>
                                        <div class="dy-ntf-item-time">08:00</div>
                                    </div>
                                </a>
                                <a class="dy-ntf-item" href="ins-detail.html">
                                    <span class="dy-ntf-dot inspection"></span>
                                    <div class="dy-ntf-item-body">
                                        <div class="dy-ntf-item-head">
                                            <span class="dy-ntf-item-cat inspection">점검</span>
                                        </div>
                                        <div class="dy-ntf-item-title">청사 소방설비 분기 점검 D-1</div>
                                        <div class="dy-ntf-item-time">어제 18:00</div>
                                    </div>
                                </a>
                                <a class="dy-ntf-item" href="risk-detail.html">
                                    <span class="dy-ntf-dot risk"></span>
                                    <div class="dy-ntf-item-body">
                                        <div class="dy-ntf-item-head">
                                            <span class="dy-ntf-item-cat risk">위험성평가</span>
                                        </div>
                                        <div class="dy-ntf-item-title">청사 위험성평가 2026 평가자 지정</div>
                                        <div class="dy-ntf-item-time">어제 14:30</div>
                                    </div>
                                </a>
                            </div>
                            <a class="dy-ntf-dropdown-foot" href="ntf-list.html">전체 보기 (42건) →</a>
                        </div>
                    </div>
                    <button class="dy-user-pill" type="button" aria-label="사용자 메뉴">
                        <span class="dy-user-avatar">박</span>
                        <span class="dy-user-text">
                            <span class="dy-user-name">박안전 님</span>
                            <span class="dy-user-org">담양군청 · 안전건설과</span>
                        </span>
                        ${ICON.chevron}
                    </button>
                </div>
            </header>
        `;
    }

    function renderGnb(activeGroupId) {
        return html`
            <nav class="dy-gnb">
                ${NAV.map(g => {
                    const first = g.items[0];
                    const href = first.href || '#';
                    const onclick = first.soon
                        ? `onclick="return window.DYLayout._soon(event, '${first.soon}')"`
                        : '';
                    return html`<a class="dy-gnb-item ${g.id === activeGroupId ? 'is-active' : ''}" href="${href}" ${onclick}>${g.label}</a>`;
                }).join('')}
            </nav>
        `;
    }

    function renderSidebar(activeGroup, activePageId) {
        return html`
            <aside class="dy-sidebar" id="dy-sidebar">
                <div class="dy-sidebar-inner">
                    <div class="dy-sidebar-title">${activeGroup.label}</div>
                    <nav class="dy-sidebar-nav">
                        ${activeGroup.items.map(it => {
                            const isActive = it.id === activePageId;
                            const href = it.href || '#';
                            const onclick = it.soon
                                ? `onclick="return window.DYLayout._soon(event, '${it.soon}')"`
                                : '';
                            const externalIcon = it.external
                                ? `<span class="dy-sidebar-item-external" aria-label="다른 메뉴로 이동" title="다른 GNB로 이동">${ICON.external}</span>`
                                : '';
                            return html`
                                <a class="dy-sidebar-item ${isActive ? 'is-active' : ''} ${it.external ? 'is-external' : ''}" href="${href}" ${onclick}>
                                    <span class="dy-sidebar-item-icon">${ICON[it.icon] || ICON.dot}</span>
                                    <span>${it.label}</span>
                                    ${externalIcon}
                                </a>
                            `;
                        }).join('')}
                    </nav>
                    ${activeGroup.id === 'dashboard' ? renderRoleSwitcher() : ''}
                </div>
            </aside>
            <div class="dy-sidebar-backdrop" id="dy-sidebar-backdrop"></div>
        `;
    }

    /* 권한 선택기 (대시보드 그룹 LNB 하단) — 프로토타입 임시
     * data-role attribute(body) 또는 localStorage('dy-role')로 현재 권한 식별
     */
    const ROLE_MAP = {
        ceo: { label: '군수 (CEO)',               href: 'index.html'         },
        gm:  { label: '실·과·단·소장 (GM)',       href: 'dashboard-gm.html'  },
        mgr: { label: '팀장·담당자 (SM/SHM)',     href: 'dashboard-mgr.html' },
        wkr: { label: '근로자 (WKR)',             href: 'dashboard-wkr.html' },
        ext: { label: '외부 사용자 (SUB/CON)',    href: 'dashboard-ext.html' },
    };

    function getCurrentRole() {
        const dataRole = document.body.getAttribute('data-role');
        if (dataRole && ROLE_MAP[dataRole]) return dataRole;
        try {
            const stored = localStorage.getItem('dy-role');
            if (stored && ROLE_MAP[stored]) return stored;
        } catch (e) {}
        return 'ceo';
    }

    function renderRoleSwitcher() {
        const current = getCurrentRole();
        const options = Object.keys(ROLE_MAP).map(k =>
            `<option value="${k}"${k === current ? ' selected' : ''}>${ROLE_MAP[k].label}</option>`
        ).join('');
        return html`
            <div class="dy-role-switcher">
                <span class="dy-role-switcher-label">권한 전환 (임시)</span>
                <select onchange="window.DYLayout._switchRole(this.value)">${options}</select>
                <span class="dy-role-switcher-help">DSH01~05 권한별 대시보드 (프로토타입 둘러보기용)</span>
            </div>
        `;
    }

    function switchRole(role) {
        if (!ROLE_MAP[role]) return;
        try { localStorage.setItem('dy-role', role); } catch (e) {}
        window.location.href = ROLE_MAP[role].href;
    }

    function mount() {
        try {
            const pageId = document.body.getAttribute('data-dy-page') || 'index';
            const group = findGroup(pageId);

            /* 기존 레거시 chrome 제거 */
            const legacyAside = document.getElementById('sidebar');
            if (legacyAside) legacyAside.remove();
            const legacyHeader = document.querySelector('header.header');
            if (legacyHeader) legacyHeader.remove();

            /* 기존 outer wrapper(<div class="flex h-screen overflow-hidden">) → .dy-layout 로 변환 */
            const outer = document.querySelector('body > div.flex.h-screen.overflow-hidden');
            const main = document.querySelector('main');

            const layout = document.createElement('div');
            layout.className = 'dy-layout';
            layout.innerHTML = renderHeader() + renderGnb(group.id) +
                '<div class="dy-body">' + renderSidebar(group, pageId) + '</div>';

            const bodyGrid = layout.querySelector('.dy-body');
            if (main) {
                main.classList.add('dy-main');
                // 기존 main 의 flex/scroll 유틸리티 제거 (.dy-main 이 담당)
                main.classList.remove('flex-1', 'overflow-y-auto', 'p-6', 'p-4', 'space-y-6');

                // body[data-page-title]/[data-page-subtitle] 가 있으면 페이지 헤더 자동 주입
                injectPageTitle(main);

                // [data-pagination] 마커 자동 렌더
                renderPaginationMarkers(main);

                bodyGrid.appendChild(main);
            } else {
                const ph = document.createElement('main');
                ph.className = 'dy-main';
                injectPageTitle(ph);
                bodyGrid.appendChild(ph);
            }

            if (outer) {
                outer.replaceWith(layout);
            } else {
                document.body.insertBefore(layout, document.body.firstChild);
            }

            wireMobileMenu();
            wireNotification();
        } finally {
            // 마운트 성공/실패와 무관하게 화면 표시 — visibility:hidden 잠금 해제
            document.body.classList.add('dy-mounted');
        }
    }

    /* 안전장치: mount()가 어떤 이유로 호출되지 않더라도 1초 후엔 강제로 본문 표시
     *   (CSS의 body:not(.dy-mounted) > main { display: none } 잠금을 해제)
     */
    setTimeout(() => {
        if (!document.body.classList.contains('dy-mounted')) {
            document.body.classList.add('dy-mounted');
        }
    }, 1000);

    /* body[data-page-title]/[data-page-subtitle]가 있으면 main 시작 부분에 페이지 헤더 자동 주입
     *  - 페이지에 이미 .dy-page-title 마크업이 있으면 건너뜀
     *  - data-back-href 가 있으면 백 링크도 함께 주입
     */
    function injectPageTitle(mainEl) {
        if (!mainEl || mainEl.querySelector('.dy-page-title')) return;
        const title = document.body.getAttribute('data-page-title');
        const subtitle = document.body.getAttribute('data-page-subtitle');
        const backHref = document.body.getAttribute('data-back-href');
        const backLabel = document.body.getAttribute('data-back-label') || '목록';
        if (!title && !backHref) return;

        const frag = document.createDocumentFragment();

        if (backHref) {
            const topbar = document.createElement('div');
            topbar.className = 'detail-topbar';
            topbar.innerHTML =
                '<a class="detail-back-link" href="' + backHref + '">' +
                  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
                  backLabel +
                '</a>';
            frag.appendChild(topbar);
        }

        if (title) {
            const titleEl = document.createElement('div');
            titleEl.className = 'dy-page-title';
            titleEl.innerHTML = '<span class="dy-page-dot"></span><h1>' + title + '</h1>';
            frag.appendChild(titleEl);
            if (subtitle) {
                const sub = document.createElement('div');
                sub.className = 'dy-page-subtitle';
                sub.textContent = subtitle;
                frag.appendChild(sub);
            }
        }

        mainEl.insertBefore(frag, mainEl.firstChild);
    }

    /* main 안의 [data-pagination] 마커를 renderPagination 결과로 자동 교체
     *   <div data-pagination data-current="1" data-total="4"></div>
     */
    function renderPaginationMarkers(mainEl) {
        if (!mainEl) return;
        mainEl.querySelectorAll('[data-pagination]').forEach(el => {
            const current = parseInt(el.getAttribute('data-current'), 10) || 1;
            const total = parseInt(el.getAttribute('data-total'), 10) || 1;
            const html = renderPagination({ current, total });
            if (!html) {
                el.remove();
                return;
            }
            const temp = document.createElement('div');
            temp.innerHTML = html;
            el.replaceWith(temp.firstElementChild);
        });
    }

    function wireNotification() {
        const wrap = document.getElementById('dy-ntf-wrap');
        const btn = document.getElementById('dy-ntf-btn');
        const dropdown = document.getElementById('dy-ntf-dropdown');
        if (!wrap || !btn || !dropdown) return;

        const close = () => {
            dropdown.classList.remove('is-open');
            dropdown.setAttribute('aria-hidden', 'true');
        };
        const open = () => {
            dropdown.classList.add('is-open');
            dropdown.setAttribute('aria-hidden', 'false');
        };

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.contains('is-open') ? close() : open();
        });

        document.addEventListener('click', (e) => {
            if (!wrap.contains(e.target)) close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });

        /* 알림 아이템 클릭 시 드롭다운 닫기 (기본 링크 동작은 유지) */
        dropdown.querySelectorAll('.dy-ntf-item, .dy-ntf-dropdown-foot').forEach(item => {
            item.addEventListener('click', () => close());
        });
    }

    function wireMobileMenu() {
        const btn = document.getElementById('dy-mobile-menu-btn');
        const sidebar = document.getElementById('dy-sidebar');
        const backdrop = document.getElementById('dy-sidebar-backdrop');
        if (!btn || !sidebar || !backdrop) return;

        const isMobile = () => window.matchMedia('(max-width: 1023px)').matches;
        const open = () => {
            sidebar.classList.add('is-open');
            backdrop.classList.add('is-open');
        };
        const close = () => {
            sidebar.classList.remove('is-open');
            backdrop.classList.remove('is-open');
        };
        btn.addEventListener('click', () => {
            sidebar.classList.contains('is-open') ? close() : open();
        });
        backdrop.addEventListener('click', close);

        /* GNB 클릭(모바일): 다음 페이지로 이동하기 전에 "도착 후 드로어 열기" 플래그를 세팅.
           새 페이지 mount() 시 플래그를 보고 드로어를 열어줘서 사용자가 LNB를 즉시 발견할 수 있게 한다.
           일반 href 동작은 그대로 두어 데스크탑/단축키(Ctrl·Cmd 클릭) 동작을 깨지 않는다. */
        document.querySelectorAll('.dy-gnb-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!isMobile()) return;
                if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
                try { sessionStorage.setItem('dy-open-lnb-on-load', '1'); } catch (_) {}
            });
        });

        /* 도착 후 플래그가 있으면 드로어 자동 오픈 */
        try {
            if (isMobile() && sessionStorage.getItem('dy-open-lnb-on-load') === '1') {
                sessionStorage.removeItem('dy-open-lnb-on-load');
                open();
            }
        } catch (_) {}

        /* LNB 아이템 클릭 시 드로어를 즉시 닫아 페이지 전환을 시각적으로 명확하게.
           soon 토스트(href='#')인 경우엔 닫지 않아 토스트가 보이도록. */
        sidebar.querySelectorAll('.dy-sidebar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!isMobile()) return;
                const href = item.getAttribute('href');
                if (href && href !== '#') {
                    close();
                }
            });
        });

        /* viewport가 데스크탑 폭으로 늘어나면 드로어 상태를 정리 */
        window.addEventListener('resize', () => {
            if (!isMobile() && sidebar.classList.contains('is-open')) close();
        });
    }

    /* 비활성 메뉴 클릭 시 토스트 (#toast 가 페이지에 있으면 사용) */
    function showComingSoon(e, label) {
        if (e) e.preventDefault();
        const t = document.getElementById('toast');
        if (!t) { alert((label ? '[' + label + '] ' : '') + '준비 중인 기능입니다.'); return false; }
        t.textContent = (label ? '[' + label + '] ' : '') + '준비 중인 기능입니다.';
        t.classList.add('show');
        clearTimeout(window.__toastTimer);
        window.__toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
        return false;
    }

    /* =========================================
     * 마크업 헬퍼 — 페이지에서 반복되는 보일러플레이트를 줄임
     * ========================================= */

    /* 페이지네이션 HTML 생성
     *   opts: { current, total, onPage (optional — JS handler name) }
     *   total ≤ 1 이면 빈 문자열 반환.
     */
    function renderPagination(opts) {
        opts = opts || {};
        const current = opts.current || 1;
        const total = opts.total || 1;
        if (total <= 1) return '';
        const prev = current > 1 ? current - 1 : null;
        const next = current < total ? current + 1 : null;
        const onclick = opts.onPage || "window.DYLayout._soon(event, '페이지 이동')";

        let html = '<div class="pagination">';
        // prev
        html += '<a class="pagination-item' + (prev ? '' : ' is-disabled') + '" href="#" aria-label="이전"' +
                (prev ? ' onclick="' + onclick.replace('event', 'event, ' + prev) + '"' : '') +
                '><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></a>';
        // pages
        for (let p = 1; p <= total; p++) {
            const isActive = p === current;
            html += '<a class="pagination-item' + (isActive ? ' is-active' : '') + '" href="#"' +
                    (isActive ? '' : ' onclick="' + onclick.replace('event', 'event, ' + p) + '"') +
                    '>' + p + '</a>';
        }
        // next
        html += '<a class="pagination-item' + (next ? '' : ' is-disabled') + '" href="#" aria-label="다음"' +
                (next ? ' onclick="' + onclick.replace('event', 'event, ' + next) + '"' : '') +
                '><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></a>';
        html += '</div>';
        return html;
    }

    /* 필터 행 HTML 생성
     *   filters: [{label, options:[string,...]}, ...]
     *   search:  { placeholder } (optional) — 합본 검색 바
     *   clear:   boolean — '초기화' 텍스트 버튼 표시 여부
     */
    function renderFilterRow(filters, options) {
        options = options || {};
        let html = '<div class="rsk-filter-row">';
        (filters || []).forEach(f => {
            html += '<div class="form-group">' +
                      '<span class="form-label-inline">' + f.label + '</span>' +
                      '<select class="select">' +
                        (f.options || []).map(o => '<option>' + o + '</option>').join('') +
                      '</select>' +
                    '</div>';
        });
        if (options.search) {
            const ph = options.search.placeholder || '검색';
            html += '<div class="search-bar">' +
                      '<input class="search-input" type="text" placeholder="' + ph + '">' +
                      '<button class="search-submit" type="button">' +
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
                        '검색' +
                      '</button>' +
                    '</div>';
        }
        if (options.clear !== false) {
            html += '<button class="clear-filters" type="button" onclick="window.DYLayout._soon(event, \'필터 초기화\')">초기화</button>';
        }
        html += '</div>';
        return html;
    }

    /* 외부 노출 */
    window.DYLayout = {
        mount,
        _soon: showComingSoon,
        _switchRole: switchRole,
        renderPagination,
        renderFilterRow,
        NAV,
    };

    /* 호환: 기존 페이지의 inline showComingSoon() 콜백 유지 */
    if (typeof window.showComingSoon !== 'function') {
        window.showComingSoon = showComingSoon;
    }

    /* DOM ready 후 자동 mount */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();

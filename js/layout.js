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
        grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
        building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M16 10h.01"/></svg>',
        alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m10.29 3.86-8.4 14.74A2 2 0 0 0 3.62 22h16.76a2 2 0 0 0 1.73-3.4L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>',
        cog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
        chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
        bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
        menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
        dot: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/></svg>',
    };

    /* --- 네비게이션 데이터 ---
     *   GNB 6개 그룹 × 각 그룹의 서브메뉴(L2).
     *   sidebar item 의 id 가 body[data-dy-page] 와 일치하면 활성화.
     */
    const NAV = [
        { id: 'dashboard', label: '대시보드', icon: 'grid', items: [
            { id: 'index', label: '통합 대시보드', icon: 'grid', href: 'index.html' },
        ]},
        { id: 'target', label: '관리대상 관리', icon: 'building', items: [
            { id: 'target-status', label: '관리대상 현황', icon: 'building', soon: '관리대상 현황' },
        ]},
        { id: 'safety', label: '안전보건 경영', icon: 'shield', items: [
            { id: 'safety-policy', label: '안전보건 목표·경영방침', icon: 'shield', href: 'safety-policy.html' },
            { id: 'organization', label: '전담조직 관리', icon: 'check', href: 'organization.html' },
            { id: 'hazard', label: '유해·위험요인 관리', icon: 'alert', soon: '유해·위험요인 관리' },
            { id: 'budget', label: '인력·예산 관리', icon: 'chart', soon: '인력·예산 관리' },
            { id: 'contractor', label: '도급·용역·위탁 관리', icon: 'building', href: 'contractor.html' },
            { id: 'opinion', label: '종사자 의견청취', icon: 'bell', href: 'opinion.html' },
        ]},
        { id: 'risk', label: '위험성평가', icon: 'alert', items: [
            { id: 'risk-mgmt', label: '위험성평가 현황', icon: 'alert', soon: '위험성평가' },
        ]},
        { id: 'duty', label: '의무이행 관리', icon: 'check', items: [
            { id: 'duty-check', label: '의무이행 점검', icon: 'check', soon: '의무이행 점검' },
            { id: 'stats', label: '현황 및 통계', icon: 'chart', soon: '현황 및 통계' },
        ]},
        { id: 'system', label: '시스템관리', icon: 'cog', items: [
            { id: 'cert', label: '제증명 관리', icon: 'cog', soon: '제증명 관리' },
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
                        <span class="dy-brand-icon">${ICON.shield}</span>
                        <span class="dy-brand-name"><strong>담양군</strong> 중대재해예방 시스템</span>
                    </a>
                </div>
                <div style="display:flex;align-items:center;gap:8px;">
                    <button class="dy-mobile-menu" aria-label="알림" style="display:inline-flex;position:relative;">
                        ${ICON.bell}
                        <span style="position:absolute;top:8px;right:8px;width:7px;height:7px;background:#C2353A;border-radius:50%;"></span>
                    </button>
                    <button class="dy-user-pill" type="button">
                        <span class="dy-user-avatar">박</span>
                        <span class="dy-user-text">
                            <span class="dy-user-name">박안전 님</span>
                            <span class="dy-user-org">담양군청 · 안전건설과</span>
                        </span>
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
                <div class="dy-sidebar-title">${activeGroup.label}</div>
                <nav class="dy-sidebar-nav">
                    ${activeGroup.items.map(it => {
                        const isActive = it.id === activePageId;
                        const href = it.href || '#';
                        const onclick = it.soon
                            ? `onclick="return window.DYLayout._soon(event, '${it.soon}')"`
                            : '';
                        return html`
                            <a class="dy-sidebar-item ${isActive ? 'is-active' : ''}" href="${href}" ${onclick}>
                                <span class="dy-sidebar-item-icon">${ICON[it.icon] || ICON.dot}</span>
                                <span>${it.label}</span>
                            </a>
                        `;
                    }).join('')}
                </nav>
            </aside>
            <div class="dy-sidebar-backdrop" id="dy-sidebar-backdrop"></div>
        `;
    }

    function mount() {
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
            bodyGrid.appendChild(main);
        } else {
            const ph = document.createElement('main');
            ph.className = 'dy-main';
            bodyGrid.appendChild(ph);
        }

        if (outer) {
            outer.replaceWith(layout);
        } else {
            document.body.insertBefore(layout, document.body.firstChild);
        }

        wireMobileMenu();
    }

    function wireMobileMenu() {
        const btn = document.getElementById('dy-mobile-menu-btn');
        const sidebar = document.getElementById('dy-sidebar');
        const backdrop = document.getElementById('dy-sidebar-backdrop');
        if (!btn || !sidebar || !backdrop) return;

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

    /* 외부 노출 */
    window.DYLayout = {
        mount,
        _soon: showComingSoon,
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

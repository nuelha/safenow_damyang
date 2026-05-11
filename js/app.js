/* =========================================
   안전NOW 프로토타입 - 메인 스크립트
   ========================================= */

// =========================================
// 1. 전역 상태 (localStorage 연동)
// =========================================
const AppState = {
    get currentRole() {
        return localStorage.getItem('safenow_role') || 'ceo';
    },
    set currentRole(value) {
        localStorage.setItem('safenow_role', value);
    },
    get currentWorkplace() {
        return localStorage.getItem('safenow_workplace') || '본사 사업장';
    },
    set currentWorkplace(value) {
        localStorage.setItem('safenow_workplace', value);
    },
    get currentUser() {
        return localStorage.getItem('safenow_user') || '김대표';
    },
    set currentUser(value) {
        localStorage.setItem('safenow_user', value);
    },
    get currentAvatar() {
        return localStorage.getItem('safenow_avatar') || '본';
    },
    set currentAvatar(value) {
        localStorage.setItem('safenow_avatar', value);
    }
};

// 권한별 한글명
const RoleNames = {
    'ceo': '경영책임자',
    'manager': '안전관리자',
    'worker': '근로자',
    'contractor': '도급담당자',
    'consulting': '컨설팅담당자'
};

// =========================================
// GNB 동적 렌더링 (company_type + role 기반)
//   로그인_사업장선택_GNB분기_개발스펙.md §6 참조
// =========================================
const GNB_MENUS = {
    principal_manager: ['dashboard','tasks','risk','tbm','inspection','education',
                        'policy','budget','opinion','improvement','compliance',
                        'documents','process','contractor','workplace','support','myinfo'],
    principal_worker:  ['dashboard','tasks','tbm','opinion','support','myinfo'],
    subcontractor:     ['dashboard','tasks','tbm','opinion','support','myinfo'],
    consulting:        ['dashboard','tasks','opinion','support','myinfo']
};

// href 파일명 → 메뉴 키 매핑
const HREF_TO_MENU = {
    'index.html': 'dashboard',
    'dashboard-sub.html': 'dashboard',
    'my-tasks.html': 'tasks',
    'risk-assessment.html': 'risk',
    'tbm.html': 'tbm',
    'safety-inspection.html': 'inspection',
    'safety-education.html': 'education',
    'safety-policy.html': 'policy',
    'safety-budget.html': 'budget',
    'opinion.html': 'opinion',
    'improvement.html': 'improvement',
    'compliance.html': 'compliance',
    'documents.html': 'documents',
    'process.html': 'process',
    'contractor.html': 'contractor',
    'workplace.html': 'workplace',
    'support.html': 'support',
    'my-info.html': 'myinfo'
};

function deriveCompanyType(appRole) {
    if (appRole === 'contractor') return 'subcontractor';
    if (appRole === 'consulting')  return 'consulting';
    return 'principal';
}

function getAllowedMenuKeys() {
    const appRole = AppState.currentRole;
    const company_type = localStorage.getItem('safenow_company_type') || deriveCompanyType(appRole);
    if (company_type === 'subcontractor') return GNB_MENUS.subcontractor;
    if (company_type === 'consulting')    return GNB_MENUS.consulting;
    if (appRole === 'worker')             return GNB_MENUS.principal_worker;
    return GNB_MENUS.principal_manager;
}

function applyGnbByContext() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    const allowed = new Set(getAllowedMenuKeys());
    const company_type = localStorage.getItem('safenow_company_type') || deriveCompanyType(AppState.currentRole);
    const inPagesFolder = window.location.pathname.includes('/pages/');

    // 1) 메뉴 항목 가시성 + 대시보드 링크 동적 재작성 (컨텍스트별 진입 화면 분기)
    sidebar.querySelectorAll('.sidebar-nav > ul > li').forEach(li => {
        if (li.classList.contains('sidebar-section')) return;
        const a = li.querySelector('a.sidebar-item');
        if (!a) return;
        const href = a.getAttribute('href') || '';
        const file = href.split('/').pop().split('?')[0].split('#')[0];
        const key = HREF_TO_MENU[file];
        li.classList.toggle('hidden', !(key && allowed.has(key)));

        // 대시보드 링크: SUB/CON은 dashboard-sub.html로, principal은 index.html로
        if (key === 'dashboard') {
            let target;
            if (company_type === 'subcontractor' || company_type === 'consulting') {
                target = inPagesFolder ? 'dashboard-sub.html' : 'pages/dashboard-sub.html';
            } else {
                target = inPagesFolder ? '../index.html' : 'index.html';
            }
            a.setAttribute('href', target);
        }
    });

    // 2) 섹션 라벨: 다음 섹션까지 보이는 메뉴가 없으면 라벨도 숨김
    const lis = Array.from(sidebar.querySelectorAll('.sidebar-nav > ul > li'));
    lis.forEach((li, i) => {
        if (!li.classList.contains('sidebar-section')) return;
        let hasVisible = false;
        for (let j = i + 1; j < lis.length; j++) {
            if (lis[j].classList.contains('sidebar-section')) break;
            if (!lis[j].classList.contains('hidden')) { hasVisible = true; break; }
        }
        li.classList.toggle('hidden', !hasVisible);
    });
}

// =========================================
// 2. 사업장/권한 선택기
// =========================================
function toggleWorkspaceDropdown() {
    const dropdown = document.getElementById('workspace-dropdown');
    const chevron = document.getElementById('workspace-chevron');
    if (dropdown) {
        dropdown.classList.toggle('hidden');
        if (chevron) {
            chevron.classList.toggle('rotate-180');
        }
    }
}

function selectWorkspace(element) {
    const role = element.dataset.role;
    const name = element.dataset.name;
    const avatar = element.dataset.avatar;
    const user = element.dataset.user;

    // 상태 저장 (localStorage)
    AppState.currentRole = role;
    AppState.currentWorkplace = name;
    AppState.currentUser = user;
    AppState.currentAvatar = avatar;
    // GNB 분기를 위한 company_type 동기화
    localStorage.setItem('safenow_company_type', deriveCompanyType(role));

    // UI 업데이트
    applyCurrentRole();

    // 드롭다운 닫기
    const dropdown = document.getElementById('workspace-dropdown');
    const chevron = document.getElementById('workspace-chevron');
    if (dropdown) dropdown.classList.add('hidden');
    if (chevron) chevron.classList.remove('rotate-180');
}

// 현재 권한 상태를 UI에 적용
function applyCurrentRole() {
    const role = AppState.currentRole;
    const name = AppState.currentWorkplace;
    const user = AppState.currentUser;
    const avatar = AppState.currentAvatar;

    // 사업장 선택기 UI 업데이트
    const workspaceAvatar = document.getElementById('workspace-avatar');
    const workspaceName = document.getElementById('workspace-name');
    const workspaceRole = document.getElementById('workspace-role');

    if (workspaceAvatar) workspaceAvatar.textContent = avatar;
    if (workspaceName) workspaceName.textContent = name;
    if (workspaceRole) workspaceRole.textContent = RoleNames[role] || '근로자';

    // 헤더 사용자 정보 업데이트
    const headerAvatar = document.getElementById('header-avatar') || document.querySelector('.header-avatar');
    const headerUsername = document.getElementById('header-username') || document.querySelector('.header-username');
    if (headerAvatar) headerAvatar.textContent = user.charAt(0);
    if (headerUsername) headerUsername.textContent = user;

    // 체크 아이콘 업데이트
    document.querySelectorAll('.workspace-option').forEach(opt => {
        opt.classList.remove('active');
        const checkIcon = opt.querySelector('.check-icon');
        if (checkIcon) checkIcon.classList.add('hidden');

        // 현재 선택된 옵션 표시
        if (opt.dataset.role === role && opt.dataset.name === name) {
            opt.classList.add('active');
            if (checkIcon) checkIcon.classList.remove('hidden');
        }
    });

    // 대시보드 전환 (index.html에서만)
    const dashboard = document.getElementById('dashboard-' + role);
    if (dashboard) {
        document.querySelectorAll('.dashboard-content').forEach(d => d.classList.add('hidden'));
        dashboard.classList.remove('hidden');
    }

    // 헤더 탭 업데이트 (index.html에서만)
    document.querySelectorAll('.role-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.role === role) {
            tab.classList.add('active');
        }
    });

    // 사이드바 메뉴 — company_type + role 기반 GNB 동적 렌더링
    applyGnbByContext();
}

// =========================================
// 3. 대시보드 역할 전환
// =========================================
function switchDashboardRole(role) {
    // 해당 권한의 워크스페이스 옵션 찾아서 선택
    const workspaceOption = document.querySelector(`.workspace-option[data-role="${role}"][data-name="본사 사업장"]`);
    if (workspaceOption) {
        selectWorkspace(workspaceOption);
    } else {
        // 워크스페이스 옵션이 없는 경우 직접 상태 변경
        AppState.currentRole = role;
        applyCurrentRole();
    }
}

// =========================================
// 4. 탭 전환
// =========================================
function switchTab(tabGroupId, tabId) {
    const tabGroup = document.querySelector(`[data-tab-group="${tabGroupId}"]`);
    if (!tabGroup) return;

    // 모든 탭 버튼 비활성화
    tabGroup.querySelectorAll('.sub-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabId) {
            tab.classList.add('active');
        }
    });

    // 탭 콘텐츠 전환
    const contentContainer = document.querySelector(`[data-tab-content="${tabGroupId}"]`);
    if (contentContainer) {
        contentContainer.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.add('hidden');
        });
        const targetPane = contentContainer.querySelector(`[data-pane="${tabId}"]`);
        if (targetPane) {
            targetPane.classList.remove('hidden');
        }
    }
}

// =========================================
// 5. 체크박스 토글
// =========================================
function toggleTaskComplete(checkbox, taskId) {
    const listItem = checkbox.closest('.list-item');
    const title = listItem.querySelector('.list-item-title');
    const badge = listItem.querySelector('.badge');

    if (checkbox.checked) {
        title.classList.add('completed');
        if (badge) {
            badge.className = 'badge badge-success';
            badge.textContent = '완료';
        }
    } else {
        title.classList.remove('completed');
    }
}

// =========================================
// 6. 알림 표시
// =========================================
function showNotification(type, title, message) {
    console.log(`[${type}] ${title}: ${message}`);
}

// =========================================
// 7. 모달
// =========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// =========================================
// 8. 목표 아코디언 토글
// =========================================
function toggleGoal(header) {
    const accordion = header.closest('.goal-accordion');
    const content = accordion.querySelector('.goal-content');
    const chevron = header.querySelector('.goal-chevron');

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        chevron.classList.add('rotate-180');
    } else {
        content.classList.add('hidden');
        chevron.classList.remove('rotate-180');
    }
}

// =========================================
// 9. 초기화
// =========================================
function init() {
    // 저장된 권한 상태 적용
    applyCurrentRole();

    // 역할 탭 클릭 이벤트 (대시보드 전용)
    document.querySelectorAll('.role-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            const role = btn.dataset.role;
            if (role) {
                switchDashboardRole(role);
            }
        });
    });

    // 서브 탭 클릭 이벤트
    document.querySelectorAll('.sub-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabGroup = tab.closest('[data-tab-group]');
            if (tabGroup) {
                switchTab(tabGroup.dataset.tabGroup, tab.dataset.tab);
            }
        });
    });

    // 체크박스 이벤트
    document.querySelectorAll('.list-item-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            toggleTaskComplete(e.target);
        });
    });

    // 드롭다운 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        const selector = document.querySelector('.workspace-selector');
        const dropdown = document.getElementById('workspace-dropdown');
        if (selector && dropdown && !selector.contains(e.target)) {
            dropdown.classList.add('hidden');
            const chevron = document.getElementById('workspace-chevron');
            if (chevron) chevron.classList.remove('rotate-180');
        }
    });
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', init);

// =========================================
// 10. 유틸리티 함수
// =========================================
const Utils = {
    // 날짜 포맷
    formatDate(date) {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },

    // 상대 시간
    relativeTime(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return '방금 전';
        if (minutes < 60) return `${minutes}분 전`;
        if (hours < 24) return `${hours}시간 전`;
        return `${days}일 전`;
    },

    // 숫자 포맷 (천단위 콤마)
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // 금액 포맷
    formatCurrency(amount) {
        if (amount >= 100000000) {
            return `${Math.floor(amount / 100000000)}억 ${Math.floor((amount % 100000000) / 10000)}만원`;
        }
        if (amount >= 10000) {
            return `${Math.floor(amount / 10000)}만원`;
        }
        return `${this.formatNumber(amount)}원`;
    },
};

// =========================================
// 11. 모바일 사이드바 드로어
//     - 1024px 이하에서 .sidebar가 좌측 드로어로 전환됨 (style.css §17)
//     - 헤더 좌측에 햄버거 버튼 주입, body 끝에 backdrop 주입
//     - 토글: 햄버거 클릭 / Escape / 백드롭 클릭 / 메뉴 항목 클릭 / 데스크탑 복귀 시 닫힘
// =========================================
(function setupMobileSidebarDrawer() {
    function init() {
        const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
        const headerLeft = document.querySelector('.header-left');
        if (!sidebar || !headerLeft) return; // 사이드바/헤더가 없는 페이지는 적용 대상 아님

        // 햄버거 버튼 (이미 있으면 재사용)
        let btn = headerLeft.querySelector('.mobile-menu-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'mobile-menu-btn';
            btn.setAttribute('aria-label', '메뉴 열기');
            btn.setAttribute('aria-controls', sidebar.id || 'sidebar');
            btn.setAttribute('aria-expanded', 'false');
            btn.innerHTML =
                '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
                '  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />' +
                '</svg>';
            headerLeft.insertBefore(btn, headerLeft.firstChild);
        }

        // 백드롭 (이미 있으면 재사용)
        let backdrop = document.querySelector('.sidebar-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'sidebar-backdrop';
            backdrop.setAttribute('aria-hidden', 'true');
            document.body.appendChild(backdrop);
        }

        function open() {
            sidebar.classList.add('open');
            backdrop.classList.add('open');
            document.body.classList.add('sidebar-locked');
            btn.setAttribute('aria-expanded', 'true');
        }
        function close() {
            sidebar.classList.remove('open');
            backdrop.classList.remove('open');
            document.body.classList.remove('sidebar-locked');
            btn.setAttribute('aria-expanded', 'false');
        }
        function toggle() {
            sidebar.classList.contains('open') ? close() : open();
        }

        btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
        backdrop.addEventListener('click', close);

        // 메뉴 항목 클릭 시 닫기 (실제 페이지 이동 전 시각적 닫힘)
        sidebar.querySelectorAll('.sidebar-item').forEach(a => {
            a.addEventListener('click', () => {
                if (sidebar.classList.contains('open')) close();
            });
        });

        // Escape 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('open')) close();
        });

        // 1024px 이상으로 리사이즈되면 드로어 상태 정리
        let lastWide = window.innerWidth >= 1024;
        window.addEventListener('resize', () => {
            const wide = window.innerWidth >= 1024;
            if (wide && !lastWide) close();
            lastWide = wide;
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// =========================================
// 12. 데이터 흐름 인스펙터 (프로토타입 검토용)
//     - 우하단 플로팅 버튼 → 사이드 패널
//     - 현재 페이지가 어떤 데이터 노드인지, 입출력 흐름, 세션 상태를 표시
//     - 키보드 단축키: Alt+D
// =========================================
(function setupFlowInspector() {
    const NODES = {
        prc: { label: '공정관리',       url: 'process.html',          color: '#0F6E56', bg: '#E1F5EE' },
        wrk: { label: '구성원·자격증',   url: 'workplace.html',        color: '#0F6E56', bg: '#E1F5EE' },
        rsk: { label: '위험성평가',     url: 'risk-assessment.html',  color: '#534AB7', bg: '#EEEDFE' },
        tbm: { label: 'TBM',            url: 'tbm.html',              color: '#534AB7', bg: '#EEEDFE' },
        ins: { label: '안전점검',       url: 'safety-inspection.html', color: '#534AB7', bg: '#EEEDFE' },
        opn: { label: '의견청취',       url: 'opinion.html',          color: '#534AB7', bg: '#EEEDFE' },
        imp: { label: '개선조치',       url: 'improvement.html',      color: '#993C1D', bg: '#FAECE7' },
        cmp: { label: '이행관리',       url: 'compliance.html',       color: '#993C1D', bg: '#FAECE7' },
        edu: { label: '안전보건교육',   url: 'safety-education.html', color: '#993C1D', bg: '#FAECE7' },
        dsh: { label: '대시보드·내업무', url: 'index.html',            color: '#185FA5', bg: '#E6F1FB' },
        con: { label: '도급관리',       url: 'contractor.html',       color: '#BA7517', bg: '#FAEEDA' },
        doc: { label: '업무문서관리',   url: 'documents.html',        color: '#0F6E56', bg: '#E1F5EE' }
    };

    const EDGES = [
        { f: 'wrk', t: 'prc', label: '자격 데이터 검증' },
        { f: 'prc', t: 'rsk', label: '공정 기반 평가' },
        { f: 'prc', t: 'tbm', label: '작업·장비 정보 자동 로드' },
        { f: 'wrk', t: 'tbm', label: '참석자 자동 로드' },
        { f: 'rsk', t: 'tbm', label: '위험요인 자동 로드' },
        { f: 'doc', t: 'rsk', label: '체크리스트 양식 제공' },
        { f: 'doc', t: 'ins', label: '점검지 양식 제공' },
        { f: 'opn', t: 'ins', label: '의견 → 특별점검 생성' },
        { f: 'rsk', t: 'imp', label: '위험요인 → 개선조치 자동' },
        { f: 'rsk', t: 'cmp', label: '이행 회차 자동 완료' },
        { f: 'tbm', t: 'imp', label: 'TBM 결과 → 개선조치' },
        { f: 'tbm', t: 'edu', label: 'TBM 시간 → 교육시간 합산' },
        { f: 'ins', t: 'imp', label: '부적합 → 개선조치 자동' },
        { f: 'opn', t: 'imp', label: '의견 → 직접 개선조치' },
        { f: 'imp', t: 'dsh', label: '개선 현황 집계' },
        { f: 'cmp', t: 'dsh', label: '이행 현황 집계' },
        { f: 'edu', t: 'dsh', label: '교육 현황 집계' },
        { f: 'con', t: 'dsh', label: '도급 현황 집계' }
    ];

    const URL_TO_NODE = {
        'process.html': 'prc',
        'workplace.html': 'wrk',
        'risk-assessment.html': 'rsk',
        'tbm.html': 'tbm',
        'safety-inspection.html': 'ins',
        'opinion.html': 'opn',
        'opinion-register.html': 'opn',
        'improvement.html': 'imp',
        'compliance.html': 'cmp',
        'safety-education.html': 'edu',
        'index.html': 'dsh',
        'dashboard-sub.html': 'dsh',
        'my-tasks.html': 'dsh',
        'contractor.html': 'con',
        'contractor-register.html': 'con',
        'documents.html': 'doc'
    };

    function currentFile() {
        const path = window.location.pathname;
        const file = path.split('/').pop() || 'index.html';
        return file === '' ? 'index.html' : file;
    }

    function relPath(targetFile) {
        const inPages = window.location.pathname.includes('/pages/');
        if (targetFile === 'index.html') {
            return inPages ? '../index.html' : 'index.html';
        }
        return inPages ? targetFile : 'pages/' + targetFile;
    }

    function dataFlowPath() {
        return relPath('data-flow.html');
    }

    function nodeBadge(nodeId) {
        const n = NODES[nodeId];
        if (!n) return '';
        return '<span class="flow-edge-node" style="background:' + n.bg + ';color:' + n.color + ';border-color:' + n.color + '33">' + n.label + '</span>';
    }

    function edgeItemHtml(edge, currentNodeId) {
        const otherNodeId = edge.f === currentNodeId ? edge.t : edge.f;
        const other = NODES[otherNodeId];
        if (!other) return '';
        const arrow = edge.f === currentNodeId ? '→' : '←';
        return (
            '<a class="flow-edge-item" href="' + relPath(other.url) + '">' +
            '  <span class="flow-edge-arrow">' + arrow + '</span>' +
            nodeBadge(otherNodeId) +
            '  <span class="flow-edge-label">' + edge.label + '</span>' +
            '</a>'
        );
    }

    function buildSessionRows() {
        const role = localStorage.getItem('safenow_role') || '-';
        const workplace = localStorage.getItem('safenow_workplace') || '-';
        const user = localStorage.getItem('safenow_user') || '-';
        const company = localStorage.getItem('safenow_company_type') || '-';
        const roleNames = { ceo: '경영책임자', manager: '안전관리자', worker: '근로자', contractor: '도급담당자', consulting: '컨설팅담당자' };
        return [
            { k: '권한',        v: (roleNames[role] || role) },
            { k: '사업장',      v: workplace },
            { k: '사용자',      v: user },
            { k: 'company_type', v: company }
        ].map(r => '<div class="flow-state-row"><span class="flow-state-key">' + r.k + '</span><span class="flow-state-val">' + r.v + '</span></div>').join('');
    }

    function buildPanelBody(nodeId) {
        let html = '';

        // 현재 화면
        html += '<div class="flow-section">';
        html += '<div class="flow-section-title">현재 화면</div>';
        if (nodeId && NODES[nodeId]) {
            const n = NODES[nodeId];
            html += '<div class="flow-current-card" style="background:' + n.bg + ';color:' + n.color + ';border-color:' + n.color + '">';
            html += n.label;
            html += '<div class="flow-current-meta">' + currentFile() + '</div>';
            html += '</div>';
        } else {
            html += '<div class="flow-empty">데이터 흐름 다이어그램에 매핑되지 않은 화면입니다.<br>(' + currentFile() + ')</div>';
        }
        html += '</div>';

        if (nodeId) {
            const incoming = EDGES.filter(e => e.t === nodeId);
            const outgoing = EDGES.filter(e => e.f === nodeId);

            html += '<div class="flow-section">';
            html += '<div class="flow-section-title">← 받는 데이터 (' + incoming.length + ')</div>';
            html += incoming.length
                ? '<div class="flow-edge-list">' + incoming.map(e => edgeItemHtml(e, nodeId)).join('') + '</div>'
                : '<div class="flow-empty">받는 데이터 없음</div>';
            html += '</div>';

            html += '<div class="flow-section">';
            html += '<div class="flow-section-title">→ 보내는 데이터 (' + outgoing.length + ')</div>';
            html += outgoing.length
                ? '<div class="flow-edge-list">' + outgoing.map(e => edgeItemHtml(e, nodeId)).join('') + '</div>'
                : '<div class="flow-empty">보내는 데이터 없음</div>';
            html += '</div>';
        }

        // 세션 상태
        html += '<div class="flow-section">';
        html += '<div class="flow-section-title">세션 상태</div>';
        html += buildSessionRows();
        html += '</div>';

        // 전체 흐름도 링크
        html += '<a class="flow-fullmap-link" href="' + dataFlowPath() + '">전체 데이터 흐름도 보기 →</a>';

        return html;
    }

    function init() {
        if (document.querySelector('.flow-inspector-panel')) return;

        // FAB
        const fab = document.createElement('button');
        fab.type = 'button';
        fab.className = 'flow-inspector-fab';
        fab.setAttribute('aria-label', '데이터 흐름 인스펙터 열기 (Alt+D)');
        fab.title = '데이터 흐름 인스펙터 (Alt+D)';
        fab.innerHTML =
            '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
            '  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>' +
            '</svg>';
        document.body.appendChild(fab);

        // Panel
        const panel = document.createElement('div');
        panel.className = 'flow-inspector-panel';
        panel.setAttribute('role', 'complementary');
        panel.setAttribute('aria-label', '데이터 흐름 인스펙터');
        document.body.appendChild(panel);

        function render() {
            const file = currentFile();
            const nodeId = URL_TO_NODE[file] || null;
            panel.innerHTML =
                '<div class="flow-inspector-header">' +
                '  <span class="flow-inspector-title">' +
                '    <svg class="flow-inspector-title-icon" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' +
                '    데이터 흐름 인스펙터' +
                '  </span>' +
                '  <button type="button" class="flow-inspector-close" aria-label="닫기">' +
                '    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>' +
                '  </button>' +
                '</div>' +
                '<div class="flow-inspector-body">' + buildPanelBody(nodeId) + '</div>';
            panel.querySelector('.flow-inspector-close').addEventListener('click', close);
        }

        function open()  { render(); panel.classList.add('open'); fab.style.display = 'none'; }
        function close() { panel.classList.remove('open'); fab.style.display = ''; }
        function toggle() { panel.classList.contains('open') ? close() : open(); }

        fab.addEventListener('click', toggle);

        document.addEventListener('keydown', (e) => {
            if (e.altKey && (e.key === 'd' || e.key === 'D')) {
                e.preventDefault();
                toggle();
            } else if (e.key === 'Escape' && panel.classList.contains('open')) {
                close();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// =========================================
// 13. 안내 배너 닫기 버튼 자동 주입 (.alert-info)
//     - .no-dismiss 클래스가 있으면 제외
// =========================================
(function setupDismissibleAlerts() {
    function init() {
        document.querySelectorAll('.alert-info:not(.no-dismiss)').forEach(alert => {
            if (alert.querySelector(':scope > .alert-close')) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'alert-close';
            btn.setAttribute('aria-label', '닫기');
            btn.innerHTML =
                '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
                '  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>' +
                '</svg>';
            btn.addEventListener('click', () => alert.remove());
            alert.appendChild(btn);
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// 헤더 사용자 영역 클릭 → 마이페이지 이동
// 헤더 사용자 영역 클릭 → 드롭다운 (내 정보 관리 / 로그아웃)
(function setupHeaderUserMenu() {
    function init() {
        const userEl = document.querySelector('.header-user');
        if (!userEl) return;

        // 경로 해석 (페이지 위치에 따라 다름)
        const inPagesFolder = window.location.pathname.includes('/pages/');
        const myInfoPath = inPagesFolder ? 'my-info.html' : 'pages/my-info.html';
        const loginPath  = inPagesFolder ? '../login.html' : 'login.html';

        // 트리거 셋업
        userEl.style.cursor = 'pointer';
        userEl.style.position = 'relative';
        userEl.setAttribute('role', 'button');
        userEl.setAttribute('tabindex', '0');
        userEl.setAttribute('aria-haspopup', 'menu');
        userEl.setAttribute('aria-expanded', 'false');
        userEl.setAttribute('title', '내 정보 관리 / 로그아웃');

        // 드롭다운 화살표 아이콘
        const chev = document.createElement('span');
        chev.id = 'header-user-chev';
        chev.style.marginLeft = '4px';
        chev.style.fontSize = '10px';
        chev.style.color = '#9CA3AF';
        chev.style.transition = 'transform 0.15s';
        chev.textContent = '▾';
        userEl.appendChild(chev);

        // 드롭다운 메뉴
        const menu = document.createElement('div');
        menu.id = 'header-user-menu';
        menu.className = 'hidden absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50';
        menu.setAttribute('role', 'menu');
        menu.innerHTML =
            '<a href="' + myInfoPath + '" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">' +
            '  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
            '    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>' +
            '  </svg>' +
            '  내 정보 관리' +
            '</a>' +
            '<button type="button" id="header-user-logout" class="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100" role="menuitem">' +
            '  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
            '    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>' +
            '  </svg>' +
            '  로그아웃' +
            '</button>';
        userEl.appendChild(menu);

        function openMenu() {
            menu.classList.remove('hidden');
            userEl.setAttribute('aria-expanded', 'true');
            chev.style.transform = 'rotate(180deg)';
        }
        function closeMenu() {
            menu.classList.add('hidden');
            userEl.setAttribute('aria-expanded', 'false');
            chev.style.transform = '';
        }
        function toggleMenu() {
            menu.classList.contains('hidden') ? openMenu() : closeMenu();
        }

        // 트리거 클릭
        userEl.addEventListener('click', (e) => {
            // 드롭다운 내부 클릭은 메뉴 자체 핸들러에 위임
            if (e.target.closest('#header-user-menu')) return;
            e.stopPropagation();
            toggleMenu();
        });
        // 키보드 접근성
        userEl.addEventListener('keydown', (e) => {
            if (e.target.closest('#header-user-menu')) return;
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
            else if (e.key === 'Escape') closeMenu();
        });
        // 외부 클릭 닫기
        document.addEventListener('click', (e) => {
            if (!userEl.contains(e.target)) closeMenu();
        });

        // 로그아웃 핸들러
        document.getElementById('header-user-logout').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            ['safenow_session_user_email','safenow_session_user_name','safenow_logged_in',
             'safenow_role','safenow_workplace','safenow_user','safenow_avatar',
             'safenow_company_type','safenow_company_name','safenow_just_added_company','safenow_pending_invite']
                .forEach(k => localStorage.removeItem(k));
            window.location.replace(loginPath);
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

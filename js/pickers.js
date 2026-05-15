/* =========================================================================
 * 담양군 중대재해예방 시스템 — 공통 Picker 컴포넌트
 *   - DYPicker.openMember(opts)  : 구성원 검색·선택 모달 (단일/다중)
 *   - DYPicker.openDept(opts)    : 부서 트리 선택 모달
 *
 * 사용처 (스펙 매핑):
 *   - TGT02-F STEP 3 담당자 (다중 선택, 역할별 자격 검증)
 *   - TGT03-M 담당자 추가 모달 (다중, 자격 검증 + 강제지정 경고)
 *   - STF04-M 전담인력 선임 모달 (단일, 부서 prefilter + 자격 검증) — 구 ORG03-M
 *   - ORG02-D 부서 이동 (단일 부서 — MANUAL 사용자만)
 *
 * 페이지에 <script src="./js/pickers.js"></script> 한 줄만 추가하면
 * 어디서든 DYPicker.openMember/openDept 호출 가능.
 *
 * 의존성 없음. 첫 호출 시 자동으로 <style>·모달 HTML을 DOM에 주입.
 * ========================================================================= */
(function () {
    'use strict';
    if (window.DYPicker) return; // idempotent

    /* ─── Mock 데이터 (실제 구현 시 API/DB 대체) ─────────────────────── */
    const MEMBERS = [
        { id: 'u1',  name: '김안전',   dept: '안전건설과',     position: '6급 주사',    perm: 'SM',  source: 'SSO', quals: ['산업안전기사', '건설안전기사'] },
        { id: 'u2',  name: '박안전',   dept: '자치행정과',     position: '7급 주사보',  perm: 'WKR', source: 'SSO', quals: [] },
        { id: 'u3',  name: '이안전',   dept: '시설관리과',     position: '7급 주사보',  perm: 'WKR', source: 'SSO', quals: ['건설안전산업기사'] },
        { id: 'u4',  name: '정담당',   dept: '안전건설과',     position: '6급 주사',    perm: 'SHM', source: 'SSO', quals: ['위험물산업기사'] },
        { id: 'u5',  name: '박보건',   dept: '보건소',         position: '6급 주사',    perm: 'SHM', source: 'SSO', quals: ['산업보건지도사'] },
        { id: 'u6',  name: '강의사',   dept: '보건소',         position: '진료과장',    perm: 'WKR', source: 'SSO', quals: ['의사면허'] },
        { id: 'u7',  name: '이건설',   dept: '안전건설과',     position: '6급 주사',    perm: 'SM',  source: 'SSO', quals: ['건설안전기사'] },
        { id: 'u8',  name: '한시설',   dept: '시설관리과',     position: '6급 주사',    perm: 'WKR', source: 'SSO', quals: [] },
        { id: 'u9',  name: '박팀장',   dept: '자치행정과',     position: '6급 주사',    perm: 'WKR', source: 'SSO', quals: [] },
        { id: 'u10', name: '정주임',   dept: '환경과',         position: '7급 주사보',  perm: 'WKR', source: 'SSO', quals: [] },
        { id: 'u11', name: '오환경',   dept: '환경과',         position: '6급 주사',    perm: 'SHM', source: 'SSO', quals: ['화공안전기사'] },
        { id: 'u12', name: '윤소장',   dept: '환경과',         position: '4급 서기관',  perm: 'GM',  source: 'SSO', quals: [] },
        { id: 'u13', name: '이건강',   dept: '안전건설과',     position: '7급 주사보',  perm: 'WKR', source: 'SSO', quals: ['산업위생기사'] },
        { id: 'u14', name: '강보건',   dept: '보건소',         position: '6급 주사',    perm: 'SHM', source: 'SSO', quals: ['간호사', '산업보건지도사'] },
        { id: 'u15', name: '윤보건',   dept: '농업기술센터',   position: '6급 주사',    perm: 'SHM', source: 'SSO', quals: ['간호사'] },
        { id: 'u16', name: '정농업',   dept: '농업기술센터',   position: '6급 주사',    perm: 'SM',  source: 'SSO', quals: ['산업안전기사'] },
        { id: 'u17', name: '신상수',   dept: '상수도사업소',   position: '6급 주사',    perm: 'SM',  source: 'SSO', quals: ['산업안전기사'] },
        { id: 'u18', name: '조보건',   dept: '상수도사업소',   position: '7급 주사보',  perm: 'SHM', source: 'SSO', quals: ['간호사'] },
        { id: 'u19', name: '서지역',   dept: '담양읍사무소',   position: '7급 주사보',  perm: 'SM',  source: 'SSO', quals: ['산업안전산업기사'] }
    ];

    const DEPT_TREE = [{
        id: 'root', name: '담양군청', head: '이○○ 군수', position: '경영책임자',
        count: 320, targetCount: 0, tag: 'ceo', tagLabel: '경영책임자',
        children: [
            {
                id: 'jachi', name: '자치행정과', head: '홍길동', position: '5급 사무관',
                count: 15, targetCount: 3,
                children: [
                    { id: 'jachi-1', name: '행정지원팀', head: '김팀장', position: '6급 주사', count: 5, targetCount: 1 },
                    { id: 'jachi-2', name: '인사담당팀', head: '박팀장', position: '6급 주사', count: 4, targetCount: 0 }
                ]
            },
            {
                id: 'safety', name: '안전건설과', head: '한건설', position: '5급 사무관',
                count: 22, targetCount: 8, tag: 'dedicated', tagLabel: '전담부서',
                children: [
                    { id: 'safety-1', name: '안전관리팀', head: '김안전', position: '6급 주사', count: 6, targetCount: 5, tag: 'dedicated', tagLabel: '전담팀' },
                    { id: 'safety-2', name: '시설관리팀', head: '최성호', position: '6급 주사', count: 9, targetCount: 3 },
                    { id: 'safety-3', name: '건설지원팀', head: '이건설', position: '6급 주사', count: 6, targetCount: 0 }
                ]
            },
            {
                id: 'farm', name: '농업기술센터', head: '이센터장', position: '4급 서기관',
                count: 22, targetCount: 2,
                children: [
                    { id: 'farm-1', name: '농업지도팀', head: '정지도', position: '6급 주사', count: 8, targetCount: 1 },
                    { id: 'farm-2', name: '농업정책팀', head: '윤정책', position: '6급 주사', count: 6, targetCount: 1 }
                ]
            },
            { id: 'water',   name: '상수도사업소', head: '정소장', position: '5급 사무관', count: 12, targetCount: 4 },
            { id: 'env',     name: '환경과',       head: '윤과장', position: '5급 사무관', count: 14, targetCount: 3 },
            { id: 'health',  name: '보건소',       head: '정보건', position: '4급 서기관', count: 22, targetCount: 5 },
            { id: 'eup',     name: '담양읍사무소', head: '서지역', position: '6급 주사',   count: 18, targetCount: 2 },
            { id: 'culture', name: '문화관광과',   head: '한과장', position: '5급 사무관', count: 16, targetCount: 4 },
            { id: 'facility',name: '시설관리과',   head: '한시설', position: '5급 사무관', count: 14, targetCount: 6 }
        ]
    }];

    /* ─── 역할 기본 정의 (자격 검증용) ───────────────────────────────── */
    const ROLE_DEFAULTS = {
        SAFETY_MGR:    { label: '안전관리자', checkQual: true,  qualKeywords: ['산업안전', '건설안전', '화공안전', '전기안전'] },
        HEALTH_MGR:    { label: '보건관리자', checkQual: true,  qualKeywords: ['보건', '위생', '간호'] },
        HEALTH_DOCTOR: { label: '산업보건의', checkQual: true,  qualKeywords: ['의사'] },
        SUPERVISOR:    { label: '관리감독자', checkQual: false, qualKeywords: [] },
        WORKER:        { label: '종사자',     checkQual: false, qualKeywords: [] }
    };

    /* ─── 스타일 주입 ─────────────────────────────────────────────── */
    function injectStyles() {
        if (document.getElementById('dy-picker-styles')) return;
        const style = document.createElement('style');
        style.id = 'dy-picker-styles';
        style.textContent = `
        .dy-picker-backdrop {
            position: fixed; inset: 0;
            background: rgba(15, 23, 42, 0.55);
            z-index: 1100;
            display: none;
            align-items: center; justify-content: center;
            padding: 24px;
        }
        .dy-picker-backdrop.is-open { display: flex; }
        .dy-picker {
            background: white;
            border-radius: 14px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            width: 100%;
            max-width: 760px;
            max-height: calc(100vh - 48px);
            display: flex; flex-direction: column;
            overflow: hidden;
            animation: dy-picker-in .14s ease-out;
        }
        .dy-picker.dept { max-width: 580px; }
        .dy-picker.warn { max-width: 460px; }
        @keyframes dy-picker-in {
            from { opacity: 0; transform: translateY(10px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dy-picker-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 18px 24px;
            border-bottom: 1px solid var(--card-line);
            flex-shrink: 0;
        }
        .dy-picker-title {
            font-size: 17px; font-weight: 700;
            color: var(--main-dark2);
            display: flex; align-items: center; gap: 8px;
        }
        .dy-picker-role-tag {
            font-size: 11px; font-weight: 700;
            padding: 2px 10px;
            border-radius: 999px;
            background: var(--brand-100);
            color: var(--main-dark);
            letter-spacing: 0;
        }
        .dy-picker-role-tag.info { background: var(--status-info-bg); color: var(--status-info-fg); }
        .dy-picker-close {
            display: inline-flex; align-items: center; justify-content: center;
            width: 30px; height: 30px;
            background: none; border: none; cursor: pointer;
            border-radius: 8px;
            color: var(--text-gray);
            transition: all .12s;
        }
        .dy-picker-close:hover { background: var(--gray-100); color: var(--main-dark2); }

        .dy-picker-filter {
            display: flex; gap: 10px; flex-wrap: wrap;
            padding: 14px 24px;
            background: var(--gray-50, #fafafa);
            border-bottom: 1px solid var(--card-line);
        }
        .dy-picker-filter input,
        .dy-picker-filter select {
            font-size: 13px;
            padding: 8px 12px;
            border: 1px solid var(--card-line);
            border-radius: 7px;
            background: white;
            color: var(--text-black);
        }
        .dy-picker-filter .search { flex: 1; min-width: 200px; }
        .dy-picker-filter input:focus,
        .dy-picker-filter select:focus {
            outline: none; border-color: var(--main);
            box-shadow: 0 0 0 3px var(--brand-100);
        }
        .dy-picker-filter-btn {
            display: inline-flex; align-items: center; gap: 4px;
            padding: 8px 12px;
            font-size: 12px; font-weight: 600;
            background: white;
            border: 1px solid var(--card-line);
            color: var(--text-gray);
            border-radius: 7px;
            cursor: pointer;
            white-space: nowrap;
        }
        .dy-picker-filter-btn:hover { border-color: var(--main); color: var(--main); }

        .dy-picker-meta {
            padding: 10px 24px;
            font-size: 12px;
            color: var(--text-gray);
            background: white;
            border-bottom: 1px solid var(--card-line);
        }
        .dy-picker-meta strong { color: var(--main); font-weight: 700; }
        .dy-picker-meta .warn-text { color: var(--status-warning-fg); margin-left: 8px; }

        .dy-picker-list {
            flex: 1;
            overflow-y: auto;
            padding: 4px 0;
        }

        /* 구성원 행 */
        .dy-picker-member {
            display: grid;
            grid-template-columns: 24px 36px 1fr 130px 60px 130px;
            gap: 12px;
            align-items: center;
            padding: 12px 24px;
            border-bottom: 1px solid var(--card-line);
            cursor: pointer;
            transition: background .12s;
        }
        .dy-picker-member:hover { background: var(--brand-50, #f0fbf6); }
        .dy-picker-member.is-selected { background: var(--brand-50, #f0fbf6); }
        .dy-picker-member.is-disabled {
            opacity: .5; cursor: not-allowed;
            background: var(--gray-100);
        }
        .dy-picker-member.is-disabled:hover { background: var(--gray-100); }

        .dy-picker-check {
            display: inline-flex; align-items: center; justify-content: center;
            width: 18px; height: 18px;
            border: 1.5px solid var(--card-line);
            border-radius: 5px;
            background: white;
            color: white;
            flex-shrink: 0;
        }
        .dy-picker-check.radio { border-radius: 50%; }
        .dy-picker-member.is-selected .dy-picker-check {
            background: var(--main);
            border-color: var(--main);
        }
        .dy-picker-member.is-selected .dy-picker-check.radio::after {
            content: '';
            width: 6px; height: 6px;
            border-radius: 50%;
            background: white;
        }
        .dy-picker-check svg { display: none; }
        .dy-picker-member.is-selected .dy-picker-check:not(.radio) svg { display: block; }

        .dy-picker-avatar {
            display: inline-flex; align-items: center; justify-content: center;
            width: 32px; height: 32px;
            border-radius: 50%;
            background: var(--brand-100);
            color: var(--main-dark);
            font-size: 13px; font-weight: 700;
            flex-shrink: 0;
        }
        .dy-picker-member-main {
            display: flex; flex-direction: column; gap: 2px;
            min-width: 0;
        }
        .dy-picker-member-name {
            font-size: 14px; font-weight: 700;
            color: var(--text-black);
            display: flex; align-items: center; gap: 6px;
        }
        .dy-picker-member-name .src-mini {
            font-size: 9px; font-weight: 700;
            padding: 1px 5px;
            border-radius: 3px;
            background: var(--status-info-bg);
            color: var(--status-info-fg);
        }
        .dy-picker-member-name .src-mini.manual { background: var(--status-warning-bg); color: var(--status-warning-fg); }
        .dy-picker-member-name .already {
            font-size: 10px; font-weight: 700;
            color: var(--status-warning-fg);
        }
        .dy-picker-member-meta {
            font-size: 11px; color: var(--text-gray);
        }
        .dy-picker-member-dept {
            font-size: 12px; color: var(--text-gray);
        }
        .dy-picker-perm {
            display: inline-flex; align-items: center; justify-content: center;
            padding: 2px 8px;
            font-size: 10px; font-weight: 700;
            border-radius: 4px;
            white-space: nowrap;
        }
        .dy-picker-perm.gm  { background: var(--status-warning-bg); color: var(--status-warning-fg); }
        .dy-picker-perm.sm  { background: var(--brand-100); color: var(--main-dark); }
        .dy-picker-perm.shm { background: var(--status-info-bg); color: var(--status-info-fg); }
        .dy-picker-perm.wkr { background: var(--gray-100); color: var(--text-gray); }
        .dy-picker-member-qual {
            font-size: 11px; font-weight: 600;
            display: inline-flex; align-items: center; gap: 4px;
        }
        .dy-picker-member-qual.has   { color: var(--status-success-fg); }
        .dy-picker-member-qual.warn  { color: var(--status-warning-fg); }
        .dy-picker-member-qual.none  { color: var(--text-lightgray); }

        /* 부서 트리 행 */
        .dy-picker-dept-list {
            flex: 1;
            overflow-y: auto;
            padding: 8px 12px;
            background: white;
        }
        .dy-picker-dept-node { display: flex; flex-direction: column; }
        .dy-picker-dept-row {
            display: flex; align-items: center; gap: 6px;
            padding: 8px 10px;
            border-radius: 8px;
            cursor: pointer;
            user-select: none;
            transition: background .12s ease;
        }
        .dy-picker-dept-row:hover { background: var(--brand-50, #f0fbf6); }
        .dy-picker-dept-row.is-selected {
            background: var(--brand-100);
            box-shadow: inset 3px 0 0 var(--main);
        }
        .dy-picker-dept-toggle {
            width: 18px; height: 18px;
            display: inline-flex; align-items: center; justify-content: center;
            color: var(--text-lightgray);
            flex-shrink: 0;
            transition: transform .15s ease;
            cursor: pointer;
        }
        .dy-picker-dept-toggle.is-placeholder { visibility: hidden; }
        .dy-picker-dept-node.is-collapsed > .dy-picker-dept-row .dy-picker-dept-toggle { transform: rotate(-90deg); }
        .dy-picker-dept-icon {
            width: 18px; height: 18px;
            display: inline-flex; align-items: center; justify-content: center;
            color: var(--main);
            flex-shrink: 0;
        }
        .dy-picker-dept-icon.root { color: var(--main-dark); }
        .dy-picker-dept-name {
            flex: 1;
            display: flex; align-items: center; gap: 6px;
            font-weight: 500; color: var(--text-black);
            min-width: 0;
        }
        .dy-picker-dept-name .name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dy-picker-dept-head {
            font-size: 12px; color: var(--text-gray);
            white-space: nowrap;
        }
        .dy-picker-dept-head.unassigned {
            color: var(--status-warning-fg);
            font-weight: 600;
        }
        .dy-picker-dept-count {
            display: inline-flex; align-items: center;
            min-width: 56px; justify-content: flex-end;
            font-size: 12px; color: var(--text-gray);
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
        }
        .dy-picker-dept-children {
            display: flex; flex-direction: column;
            margin-left: 22px;
            border-left: 1px dashed var(--card-line);
            padding-left: 4px;
        }
        .dy-picker-dept-node.is-collapsed > .dy-picker-dept-children { display: none; }
        .dy-picker-dept-tag {
            display: inline-flex; align-items: center;
            padding: 1px 6px;
            font-size: 10px; font-weight: 700;
            border-radius: 4px;
            border: 1px solid transparent;
            margin-left: 2px;
        }
        .dy-picker-dept-tag.dedicated {
            background: var(--status-success-bg);
            border-color: var(--status-success-border);
            color: var(--status-success-fg);
        }
        .dy-picker-dept-tag.ceo {
            background: var(--status-warning-bg);
            border-color: var(--status-warning-border);
            color: var(--status-warning-fg);
        }

        .dy-picker-dept-selected-bar {
            display: flex; align-items: center; gap: 8px;
            padding: 10px 24px;
            font-size: 13px;
            background: var(--brand-50, #f0fbf6);
            border-top: 1px solid var(--status-success-border);
            color: var(--text-black);
        }
        .dy-picker-dept-selected-bar .label {
            font-weight: 600; color: var(--text-gray);
        }
        .dy-picker-dept-selected-bar .value {
            font-weight: 700; color: var(--main-dark2);
        }
        .dy-picker-dept-selected-bar .resp {
            margin-left: auto;
            font-size: 12px; color: var(--text-gray);
        }
        .dy-picker-dept-selected-bar .resp strong {
            color: var(--main-dark2); font-weight: 700;
        }

        .dy-picker-empty {
            padding: 48px 20px;
            text-align: center;
            font-size: 13px;
            color: var(--text-gray);
        }

        .dy-picker-footer {
            display: flex; align-items: center; justify-content: space-between;
            gap: 10px;
            padding: 14px 24px;
            border-top: 1px solid var(--card-line);
            background: var(--gray-50, #fafafa);
            flex-shrink: 0;
        }
        .dy-picker-footer .info {
            font-size: 13px; color: var(--text-gray);
        }
        .dy-picker-footer .info strong { color: var(--main); font-weight: 700; }
        .dy-picker-footer .btn-group { display: flex; gap: 8px; }

        /* 자격 미보유 경고 모달 */
        .dy-picker.warn .warn-banner {
            display: flex; align-items: flex-start; gap: 10px;
            padding: 12px 14px;
            background: var(--status-warning-bg);
            border: 1px solid var(--status-warning-border);
            border-radius: 8px;
            font-size: 13px;
            color: var(--status-warning-fg);
            line-height: 1.6;
            margin-bottom: 8px;
        }
        .dy-picker.warn .warn-banner svg { flex-shrink: 0; margin-top: 1px; }
        .dy-picker.warn .warn-banner strong { font-weight: 700; }

        @media (max-width: 720px) {
            .dy-picker-member {
                grid-template-columns: 22px 32px 1fr;
                gap: 10px;
            }
            .dy-picker-member > :nth-child(n+4) { display: none; }
        }
        `;
        document.head.appendChild(style);
    }

    /* ─── 모달 HTML 주입 ──────────────────────────────────────────── */
    function injectModalHTML() {
        if (document.getElementById('dy-member-picker')) return;
        const html = `
        <!-- 구성원 선택 모달 -->
        <div class="dy-picker-backdrop" id="dy-member-picker" role="dialog" aria-modal="true">
            <div class="dy-picker">
                <div class="dy-picker-header">
                    <div class="dy-picker-title">
                        <span id="dy-member-title">구성원 선택</span>
                        <span class="dy-picker-role-tag" id="dy-member-role-tag" style="display:none;"></span>
                    </div>
                    <button class="dy-picker-close" type="button" onclick="DYPicker.closeMember()" aria-label="닫기">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="dy-picker-filter">
                    <input type="text" class="search" id="dy-member-search" placeholder="이름·이메일·자격증으로 검색">
                    <select id="dy-member-dept-filter">
                        <option value="">전체 부서</option>
                        <option value="자치행정과">자치행정과</option>
                        <option value="안전건설과">안전건설과</option>
                        <option value="환경과">환경과</option>
                        <option value="상수도사업소">상수도사업소</option>
                        <option value="문화관광과">문화관광과</option>
                        <option value="농업기술센터">농업기술센터</option>
                        <option value="보건소">보건소</option>
                        <option value="시설관리과">시설관리과</option>
                        <option value="담양읍사무소">담양읍사무소</option>
                    </select>
                    <select id="dy-member-qual-filter">
                        <option value="">자격증 무관</option>
                        <option value="has">자격증 보유자만</option>
                    </select>
                </div>
                <div class="dy-picker-meta" id="dy-member-meta">
                    전체 <strong>0</strong>명 중 표시 <strong>0</strong>명
                </div>
                <div class="dy-picker-list" id="dy-member-list"></div>
                <div class="dy-picker-footer">
                    <span class="info" id="dy-member-selected">선택됨 <strong>0</strong>명</span>
                    <div class="btn-group">
                        <button class="btn btn-secondary" type="button" onclick="DYPicker.closeMember()">취소</button>
                        <button class="btn btn-primary" type="button" onclick="DYPicker._confirmMember()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            <span id="dy-member-confirm-label">선택</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 부서 선택 모달 -->
        <div class="dy-picker-backdrop" id="dy-dept-picker" role="dialog" aria-modal="true">
            <div class="dy-picker dept">
                <div class="dy-picker-header">
                    <div class="dy-picker-title">
                        <span id="dy-dept-title">부서 선택</span>
                        <span class="dy-picker-role-tag info" id="dy-dept-subtitle" style="display:none;"></span>
                    </div>
                    <button class="dy-picker-close" type="button" onclick="DYPicker.closeDept()" aria-label="닫기">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div class="dy-picker-filter">
                    <input type="text" class="search" id="dy-dept-search" placeholder="부서명·부서장명으로 검색">
                    <button class="dy-picker-filter-btn" type="button" onclick="DYPicker._expandAllDepts(true)">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        모두 펼치기
                    </button>
                    <button class="dy-picker-filter-btn" type="button" onclick="DYPicker._expandAllDepts(false)">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        모두 접기
                    </button>
                </div>
                <div class="dy-picker-meta" id="dy-dept-meta">
                    부서장 자동 매핑 안내 — 선택한 부서의 <strong>부서장</strong>이 자동 매핑됩니다.
                </div>
                <div class="dy-picker-dept-list" id="dy-dept-tree-list"></div>
                <div class="dy-picker-dept-selected-bar" id="dy-dept-selected-bar" style="display:none;">
                    <span class="label">선택됨:</span>
                    <span class="value" id="dy-dept-selected-name">—</span>
                    <span class="resp">부서장 → <strong id="dy-dept-selected-resp">—</strong></span>
                </div>
                <div class="dy-picker-footer">
                    <span class="info" id="dy-dept-warn"></span>
                    <div class="btn-group">
                        <button class="btn btn-secondary" type="button" onclick="DYPicker.closeDept()">취소</button>
                        <button class="btn btn-primary" type="button" onclick="DYPicker._confirmDept()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            선택
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 자격 미보유 강제 지정 경고 모달 -->
        <div class="dy-picker-backdrop" id="dy-warn-picker" role="dialog" aria-modal="true">
            <div class="dy-picker warn">
                <div class="dy-picker-header">
                    <div class="dy-picker-title">자격 미보유 강제 지정 확인</div>
                    <button class="dy-picker-close" type="button" onclick="DYPicker._closeWarn(false)" aria-label="닫기">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div style="padding: 18px 24px; display: flex; flex-direction: column; gap: 12px;">
                    <div class="warn-banner">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.29 3.86-8.4 14.74A2 2 0 0 0 3.62 22h16.76a2 2 0 0 0 1.73-3.4L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        <span><strong id="dy-warn-names">—</strong> 은(는) <strong id="dy-warn-role">—</strong> 역할에 권장되는 자격증을 보유하고 있지 않습니다.</span>
                    </div>
                    <p style="font-size:13px; color:var(--text-black); line-height:1.6; margin:0;">
                        그래도 강제로 지정하시겠습니까? 강제 지정 시 <code style="background:var(--gray-100); padding:1px 6px; border-radius:4px; font-size:11px;">warnings</code> 테이블에 사유가 기록되며,
                        추후 인력평가에서 경고로 표시됩니다.
                    </p>
                </div>
                <div class="dy-picker-footer">
                    <span></span>
                    <div class="btn-group">
                        <button class="btn btn-secondary" type="button" onclick="DYPicker._closeWarn(false)">취소</button>
                        <button class="btn btn-primary" type="button"
                                style="background:var(--status-warning-fg); border-color:var(--status-warning-fg);"
                                onclick="DYPicker._closeWarn(true)">강제 지정</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        const wrap = document.createElement('div');
        wrap.innerHTML = html;
        while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
    }

    /* ─── 이벤트 와이어링 ─────────────────────────────────────────── */
    function wireEvents() {
        if (window._dyPickerWired) return;
        window._dyPickerWired = true;

        document.getElementById('dy-member-search').addEventListener('input', renderMemberList);
        document.getElementById('dy-member-dept-filter').addEventListener('change', renderMemberList);
        document.getElementById('dy-member-qual-filter').addEventListener('change', renderMemberList);
        document.getElementById('dy-dept-search').addEventListener('input', renderDeptTree);

        // 배경 클릭 / ESC 닫기
        document.querySelectorAll('.dy-picker-backdrop').forEach(bd => {
            bd.addEventListener('click', e => { if (e.target === bd) bd.classList.remove('is-open'); });
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.dy-picker-backdrop.is-open').forEach(bd => bd.classList.remove('is-open'));
            }
        });
    }

    /* ─── 자격 검증 ──────────────────────────────────────────────── */
    function hasQual(member, opts) {
        if (!opts || !opts.checkQual) return true;
        if (!member.quals || member.quals.length === 0) return false;
        const kws = opts.qualKeywords || [];
        if (kws.length === 0) return true;
        return member.quals.some(q => kws.some(k => q.includes(k)));
    }

    /* ─── 구성원 모달 상태 ────────────────────────────────────────── */
    let memberOpts = null;
    let memberSelected = new Set();

    function openMember(opts) {
        injectStyles();
        injectModalHTML();
        wireEvents();

        // 옵션 병합 — roleCode가 있으면 ROLE_DEFAULTS에서 검증 정보 채움
        const defaults = opts.roleCode ? ROLE_DEFAULTS[opts.roleCode] : null;
        memberOpts = Object.assign({
            title: '구성원 선택',
            roleCode: null,
            roleLabel: null,
            checkQual: false,
            qualKeywords: [],
            multi: true,
            excludeIds: [],
            prefilterDept: '',
            onSelect: () => {}
        }, defaults || {}, opts || {});
        memberSelected = new Set();

        // 헤더
        document.getElementById('dy-member-title').textContent = memberOpts.title || '구성원 선택';
        const tag = document.getElementById('dy-member-role-tag');
        if (memberOpts.roleCode) {
            tag.style.display = '';
            tag.textContent = memberOpts.roleCode + ' · ' + (memberOpts.roleLabel || ROLE_DEFAULTS[memberOpts.roleCode].label);
        } else {
            tag.style.display = 'none';
        }

        // 푸터 라벨
        document.getElementById('dy-member-confirm-label').textContent = memberOpts.multi ? '지정' : '선택';

        // 필터 초기화
        document.getElementById('dy-member-search').value = '';
        document.getElementById('dy-member-dept-filter').value = memberOpts.prefilterDept || '';
        document.getElementById('dy-member-qual-filter').value = '';

        renderMemberList();
        document.getElementById('dy-member-picker').classList.add('is-open');
    }

    function renderMemberList() {
        if (!memberOpts) return;
        const list = document.getElementById('dy-member-list');
        const search = document.getElementById('dy-member-search').value.trim().toLowerCase();
        const deptFilter = document.getElementById('dy-member-dept-filter').value;
        const qualFilter = document.getElementById('dy-member-qual-filter').value;
        const excludeSet = new Set(memberOpts.excludeIds || []);

        const filtered = MEMBERS.filter(m => {
            if (deptFilter && m.dept !== deptFilter) return false;
            if (qualFilter === 'has' && !hasQual(m, memberOpts)) return false;
            if (search) {
                const hay = (m.name + ' ' + m.dept + ' ' + (m.quals || []).join(' ')).toLowerCase();
                if (!hay.includes(search)) return false;
            }
            return true;
        });

        list.innerHTML = '';
        if (filtered.length === 0) {
            list.innerHTML = '<div class="dy-picker-empty">검색 조건에 맞는 구성원이 없습니다</div>';
        } else {
            filtered.forEach(m => {
                const has = hasQual(m, memberOpts);
                const isAlready = excludeSet.has(m.id);
                const isSelected = memberSelected.has(m.id);
                const qualText = (m.quals && m.quals.length)
                    ? m.quals.join(', ')
                    : (memberOpts.checkQual ? '미보유' : '—');
                const qualCls = (m.quals && m.quals.length)
                    ? (has ? 'has' : 'warn')
                    : (memberOpts.checkQual ? 'warn' : 'none');
                const qualIcon = (memberOpts.checkQual && !has) ? '⚠ ' : (has && memberOpts.checkQual ? '✓ ' : '');

                const row = document.createElement('div');
                row.className = 'dy-picker-member' +
                    (isSelected ? ' is-selected' : '') +
                    (isAlready ? ' is-disabled' : '');
                row.dataset.userId = m.id;
                if (!isAlready) {
                    row.addEventListener('click', () => {
                        if (memberOpts.multi) {
                            if (memberSelected.has(m.id)) memberSelected.delete(m.id);
                            else memberSelected.add(m.id);
                        } else {
                            // 단일 선택: 다른 것 모두 해제
                            memberSelected = new Set([m.id]);
                        }
                        renderMemberList();
                    });
                }

                row.innerHTML = `
                    <span class="dy-picker-check ${memberOpts.multi ? '' : 'radio'}">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span class="dy-picker-avatar">${m.name.charAt(0)}</span>
                    <span class="dy-picker-member-main">
                        <span class="dy-picker-member-name">
                            ${m.name}
                            <span class="src-mini ${m.source.toLowerCase()}">${m.source}</span>
                            ${isAlready ? '<span class="already">이미 지정됨</span>' : ''}
                        </span>
                        <span class="dy-picker-member-meta">${m.position}</span>
                    </span>
                    <span class="dy-picker-member-dept">${m.dept}</span>
                    <span class="dy-picker-perm ${m.perm.toLowerCase()}">${m.perm}</span>
                    <span class="dy-picker-member-qual ${qualCls}" title="${qualText}">${qualIcon}${qualText}</span>
                `;
                list.appendChild(row);
            });
        }

        // 메타·푸터
        const metaEl = document.getElementById('dy-member-meta');
        const selectedNoQual = memberOpts.checkQual
            ? Array.from(memberSelected).map(id => MEMBERS.find(m => m.id === id)).filter(m => m && !hasQual(m, memberOpts)).length
            : 0;
        metaEl.innerHTML = `전체 <strong>${MEMBERS.length}</strong>명 중 표시 <strong>${filtered.length}</strong>명` +
            (selectedNoQual > 0 ? `<span class="warn-text">⚠ 선택 중 자격 미보유 ${selectedNoQual}명</span>` : '');
        document.getElementById('dy-member-selected').innerHTML = `선택됨 <strong>${memberSelected.size}</strong>명`;
    }

    function _confirmMember() {
        if (memberSelected.size === 0) {
            _toast('선택된 구성원이 없습니다');
            return;
        }
        const chosen = Array.from(memberSelected).map(id => MEMBERS.find(m => m.id === id)).filter(Boolean);
        const noQual = memberOpts.checkQual
            ? chosen.filter(m => !hasQual(m, memberOpts))
            : [];

        // closeMember()가 memberOpts를 null로 만들기 전에 필요한 값들을 미리 캡처
        const cb = memberOpts.onSelect;
        const isMulti = memberOpts.multi;
        const doFire = (forced) => {
            closeMember();
            try {
                const metaInfo = { forced: forced && noQual.length > 0 };
                if (isMulti) cb(chosen, metaInfo);
                else cb(chosen[0], metaInfo);
            } catch (e) { console.error('DYPicker onSelect callback error:', e); }
        };

        if (noQual.length > 0) {
            document.getElementById('dy-warn-names').textContent = noQual.map(m => m.name).join(', ');
            document.getElementById('dy-warn-role').textContent =
                (memberOpts.roleCode || '') + (memberOpts.roleLabel ? ' (' + memberOpts.roleLabel + ')' : '');
            _pendingForce = doFire;
            document.getElementById('dy-warn-picker').classList.add('is-open');
        } else {
            doFire(false);
        }
    }

    let _pendingForce = null;
    function _closeWarn(force) {
        document.getElementById('dy-warn-picker').classList.remove('is-open');
        if (force && _pendingForce) _pendingForce(true);
        _pendingForce = null;
    }

    function closeMember() {
        document.getElementById('dy-member-picker').classList.remove('is-open');
        memberOpts = null;
        memberSelected = new Set();
    }

    /* ─── 부서 모달 상태 ──────────────────────────────────────────── */
    let deptOpts = null;
    let deptCollapsed = new Set();
    let deptSelected = null;

    function openDept(opts) {
        injectStyles();
        injectModalHTML();
        wireEvents();

        deptOpts = Object.assign({
            title: '부서 선택',
            subtitle: '담당부서',
            currentName: '',
            onSelect: () => {}
        }, opts || {});

        deptCollapsed = new Set();
        deptSelected = null;
        if (deptOpts.currentName) {
            deptSelected = _findDeptByName(DEPT_TREE, deptOpts.currentName);
        }

        document.getElementById('dy-dept-title').textContent = deptOpts.title;
        const sub = document.getElementById('dy-dept-subtitle');
        if (deptOpts.subtitle) {
            sub.style.display = '';
            sub.textContent = deptOpts.subtitle;
        } else {
            sub.style.display = 'none';
        }

        document.getElementById('dy-dept-search').value = '';
        renderDeptTree();
        _updateDeptSelectedBar();
        document.getElementById('dy-dept-picker').classList.add('is-open');
    }

    function _findDeptByName(nodes, name) {
        for (const n of nodes) {
            if (n.name === name) return n;
            if (n.children) {
                const r = _findDeptByName(n.children, name);
                if (r) return r;
            }
        }
        return null;
    }

    function _findDeptById(nodes, id) {
        for (const n of nodes) {
            if (n.id === id) return n;
            if (n.children) {
                const r = _findDeptById(n.children, id);
                if (r) return r;
            }
        }
        return null;
    }

    function renderDeptTree() {
        if (!deptOpts) return;
        const list = document.getElementById('dy-dept-tree-list');
        const search = (document.getElementById('dy-dept-search').value || '').trim().toLowerCase();

        const matchIds = new Set();
        const matchParent = new Set();
        function matchWalk(node, parents) {
            const hay = (node.name + ' ' + (node.head || '') + ' ' + (node.position || '')).toLowerCase();
            const isMatch = search && hay.includes(search);
            if (isMatch) {
                matchIds.add(node.id);
                parents.forEach(p => matchParent.add(p));
            }
            if (node.children) node.children.forEach(c => matchWalk(c, [...parents, node.id]));
        }
        if (search) DEPT_TREE.forEach(n => matchWalk(n, []));

        function renderNode(node) {
            const hasChildren = node.children && node.children.length;
            const isCollapsed = deptCollapsed.has(node.id) && !matchParent.has(node.id);
            const isSelected = deptSelected && deptSelected.id === node.id;
            const isVisible = !search || matchIds.has(node.id) || matchParent.has(node.id);
            if (!isVisible) return '';

            const tagHtml = node.tagLabel
                ? `<span class="dy-picker-dept-tag ${node.tag || ''}">${node.tagLabel}</span>` : '';
            const headHtml = node.head
                ? `<span class="dy-picker-dept-head">${node.head} <span style="color:var(--text-lightgray);">· ${node.position || ''}</span></span>`
                : `<span class="dy-picker-dept-head unassigned">⚠ 부서장 미지정</span>`;

            let html = `<div class="dy-picker-dept-node ${isCollapsed ? 'is-collapsed' : ''}" data-id="${node.id}">`;
            html += `<div class="dy-picker-dept-row ${isSelected ? 'is-selected' : ''}" data-id="${node.id}">`;
            if (hasChildren) {
                html += `<span class="dy-picker-dept-toggle" data-toggle="${node.id}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </span>`;
            } else {
                html += `<span class="dy-picker-dept-toggle is-placeholder"></span>`;
            }
            html += `<span class="dy-picker-dept-icon ${node.id === 'root' ? 'root' : ''}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10"/></svg>
            </span>`;
            html += `<span class="dy-picker-dept-name"><span class="name">${node.name}</span>${tagHtml}</span>`;
            html += headHtml;
            html += `<span class="dy-picker-dept-count">${node.count}명${node.targetCount > 0 ? ` · 대상 ${node.targetCount}` : ''}</span>`;
            html += `</div>`;
            if (hasChildren) {
                html += `<div class="dy-picker-dept-children">`;
                node.children.forEach(c => { html += renderNode(c); });
                html += `</div>`;
            }
            html += `</div>`;
            return html;
        }

        list.innerHTML = DEPT_TREE.map(n => renderNode(n)).join('');

        list.querySelectorAll('.dy-picker-dept-toggle[data-toggle]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = el.dataset.toggle;
                if (deptCollapsed.has(id)) deptCollapsed.delete(id);
                else deptCollapsed.add(id);
                renderDeptTree();
            });
        });
        list.querySelectorAll('.dy-picker-dept-row').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.dataset.id;
                const node = _findDeptById(DEPT_TREE, id);
                if (!node) return;
                deptSelected = node;
                renderDeptTree();
                _updateDeptSelectedBar();
            });
        });
    }

    function _updateDeptSelectedBar() {
        const bar = document.getElementById('dy-dept-selected-bar');
        const warn = document.getElementById('dy-dept-warn');
        if (!deptSelected) {
            bar.style.display = 'none';
            warn.textContent = '';
            return;
        }
        bar.style.display = '';
        document.getElementById('dy-dept-selected-name').textContent = deptSelected.name;
        const respEl = document.getElementById('dy-dept-selected-resp');
        respEl.innerHTML = deptSelected.head
            ? `${deptSelected.head} <span style="color:var(--text-gray); font-weight:500;">(${deptSelected.position || ''})</span>`
            : `<span style="color:var(--status-warning-fg);">⚠ 부서장 미지정</span>`;

        if (deptSelected.id === 'root') {
            warn.innerHTML = '⚠ <strong>최상위 부서(담양군청)</strong>는 일반적으로 선택하지 않습니다';
            warn.style.color = 'var(--status-warning-fg)';
        } else {
            warn.textContent = '';
        }
    }

    function _confirmDept() {
        if (!deptSelected) {
            _toast('부서를 선택해주세요');
            return;
        }
        if (deptSelected.id === 'root') {
            if (!confirm('최상위 부서(담양군청)를 정말 선택하시겠습니까?\n일반적으로 구체적인 실·과·소를 선택하는 것을 권장합니다.')) return;
        }
        const cb = deptOpts.onSelect;
        const sel = deptSelected;
        closeDept();
        try { cb(sel); } catch (e) { console.error(e); }
    }

    function _expandAllDepts(expand) {
        if (expand) {
            deptCollapsed = new Set();
        } else {
            deptCollapsed = new Set();
            function collectIds(nodes) {
                nodes.forEach(n => {
                    if (n.children && n.children.length && n.id !== 'root') deptCollapsed.add(n.id);
                    if (n.children) collectIds(n.children);
                });
            }
            collectIds(DEPT_TREE);
        }
        renderDeptTree();
    }

    function closeDept() {
        document.getElementById('dy-dept-picker').classList.remove('is-open');
        deptOpts = null;
        deptSelected = null;
    }

    /* ─── 토스트 (페이지 토스트가 있으면 그것 사용) ──────────────────── */
    function _toast(msg) {
        const t = document.getElementById('toast');
        if (t) {
            t.textContent = msg;
            t.classList.add('show');
            clearTimeout(window.__toastTimer);
            window.__toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
        } else {
            alert(msg);
        }
    }

    /* ─── Public API ─────────────────────────────────────────────── */
    window.DYPicker = {
        // 외부 API
        openMember: openMember,
        closeMember: closeMember,
        openDept: openDept,
        closeDept: closeDept,
        // 데이터 노출 (필요시 페이지에서 참조 가능)
        MEMBERS: MEMBERS,
        DEPT_TREE: DEPT_TREE,
        ROLE_DEFAULTS: ROLE_DEFAULTS,
        // 내부 핸들러 (모달 HTML onclick에서 호출)
        _confirmMember: _confirmMember,
        _closeWarn: _closeWarn,
        _confirmDept: _confirmDept,
        _expandAllDepts: _expandAllDepts
    };
})();

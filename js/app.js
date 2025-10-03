// ESTADO GLOBAL E LÓGICA DE APLICAÇÃO
let activeTab = 'daily';
let currentAgeGroup = '0-3m';
let activeDomainFilter = 'all';

function switchTab(tabName) {
    activeTab = tabName;
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-btn-${tabName}`).classList.add('active');
    renderApp();
}

function switchAgeGroup(groupId) {
    currentAgeGroup = groupId;
    document.querySelectorAll('.age-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll(`.age-btn-${groupId}`).forEach(btn => btn.classList.add('active'));
    if (['daily', 'milestones', 'arsenal', 'adapted'].includes(activeTab)) {
        renderApp();
    }
}

function switchDomainFilter(domain) {
    activeDomainFilter = domain;
    document.querySelectorAll('.arsenal-filter-btn').forEach(btn => btn.classList.remove('active-filter'));
    document.getElementById(`filter-btn-${domain}`).classList.add('active-filter');
    renderActivityArsenal();
}

function renderApp() {
    const mainContent = document.getElementById('main-content');
    
    mainContent.classList.add('fade-out');
    
    setTimeout(() => {
        document.querySelectorAll('.age-group-selector').forEach(el => el.classList.add('hidden'));
        if (['daily', 'milestones', 'arsenal', 'adapted'].includes(activeTab)) {
            document.getElementById('age-selector-container').classList.remove('hidden');
        }

        switch (activeTab) {
            case 'daily': renderDailyActivity(); break;
            case 'milestones': renderMilestones(); break;
            case 'arsenal': renderActivityArsenal(); break;
            case 'adapted': renderAdaptedActivityGenerator(); break;
            case 'alerts': renderAlertsAndGuidelines(); break;
            case 'tips': renderTips(); break;
            case 'references': renderReferences(); break;
            default: switchTab('daily');
        }
        
        mainContent.classList.remove('fade-out');
        mainContent.classList.add('fade-in');
    }, 150);
}

function setupEventListeners() {
    document.querySelectorAll('.tab-button').forEach(button => {
        const tabName = button.id.replace('tab-btn-', '');
        button.onclick = () => switchTab(tabName);
    });
    renderApp();
}

document.addEventListener('DOMContentLoaded', setupEventListeners);
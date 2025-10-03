// GERADOR DE ATIVIDADES ADAPTADAS

function renderAdaptedActivityGenerator() {
    const domainCheckboxes = Object.entries(DOMAIN_MAP).map(([key, value]) => `
        <div>
            <input type="checkbox" id="domain-check-${key}" name="domains" value="${key}" class="domain-checkbox">
            <label for="domain-check-${key}" class="domain-checkbox-label">
                <span class="text-2xl mr-3">${value.icon}</span> ${value.label}
            </label>
        </div>
    `).join('');

    document.getElementById('main-content').innerHTML = `
        <div class="card p-4 sm:p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Gerador de Atividade Inovadora</h2>
            <p class="text-sm text-gray-500 mb-6">Selecione os critérios abaixo para encontrar uma atividade criativa e com estímulos associados.</p>
            
            <div class="space-y-6">
                <!-- Passo 1: Faixa Etária -->
                <div>
                    <label class="text-lg font-semibold text-gray-700 mb-2 block">1. Faixa Etária</label>
                    <div class="flex flex-wrap gap-3">
                        <button onclick="switchAgeGroup('0-3m')" class="age-button age-btn-0-3m ${currentAgeGroup === '0-3m' ? 'active' : ''} px-4 py-2 rounded-xl font-medium text-sm transition">0 a 3 meses</button>
                        <button onclick="switchAgeGroup('4-6m')" class="age-button age-btn-4-6m ${currentAgeGroup === '4-6m' ? 'active' : ''} px-4 py-2 rounded-xl font-medium text-sm transition">4 a 6 meses</button>
                        <button onclick="switchAgeGroup('7-9m')" class="age-button age-btn-7-9m ${currentAgeGroup === '7-9m' ? 'active' : ''} px-4 py-2 rounded-xl font-medium text-sm transition">7 a 9 meses</button>
                        <button onclick="switchAgeGroup('10-12m')" class="age-button age-btn-10-12m ${currentAgeGroup === '10-12m' ? 'active' : ''} px-4 py-2 rounded-xl font-medium text-sm transition">10 a 12 meses</button>
                    </div>
                </div>

                <!-- Passo 2: O que estimular -->
                <div>
                    <label class="text-lg font-semibold text-gray-700 mb-2 block">2. O que quer estimular? (Opcional)</label>
                    <div id="domain-selector" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        ${domainCheckboxes}
                    </div>
                </div>

                <!-- Botão Gerador -->
                <div class="flex justify-center pt-4">
                    <button onclick="handleGenerateAdaptedActivity()" class="btn-primary flex items-center justify-center">
                        ✨ Gerar Atividade
                    </button>
                </div>
            </div>
        </div>
        <div id="adapted-activity-result" class="mt-8"></div>
    `;
}

function handleGenerateAdaptedActivity() {
    const resultDiv = document.getElementById('adapted-activity-result');
    const selectedDomains = Array.from(document.querySelectorAll('input[name="domains"]:checked')).map(el => el.value);

    resultDiv.innerHTML = `
        <div class="card text-center p-8">
            <div class="flex justify-center items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-lg font-semibold text-gray-700">Procurando uma atividade inovadora...</p>
            </div>
        </div>`;

    setTimeout(() => {
        let pool = INNOVATIVE_ACTIVITIES.filter(a => a.ages.includes(currentAgeGroup));

        if (selectedDomains.length > 0) {
            pool.sort((a, b) => {
                const aMatches = a.domains.filter(d => selectedDomains.includes(d)).length;
                const bMatches = b.domains.filter(d => selectedDomains.includes(d)).length;
                return bMatches - aMatches;
            });
            let filteredByDomain = pool.filter(a => a.domains.some(d => selectedDomains.includes(d)));
            if (filteredByDomain.length > 0) pool = filteredByDomain;
        }

        const activity = pool.length > 0 ? pool[0] : null; 
        
        if (!activity) {
             resultDiv.innerHTML = `<div class="card p-8 text-center bg-red-50 border border-red-200"><p class="text-xl font-semibold text-red-700">Nenhuma atividade inovadora encontrada com esses filtros.</p><p class="text-red-500 mt-2">Tente selecionar menos domínios ou uma faixa etária diferente.</p></div>`;
             return;
        }
        
        const domainsHtml = activity.domains.map(domainKey => {
            const domainData = DOMAIN_MAP[domainKey] || { label: domainKey, color: '#6b7280', icon: '❓' };
            return `<span class="tag-domain text-xs" style="background-color: ${domainData.color}1a; color: ${domainData.color};">${domainData.icon} ${domainData.label}</span>`;
        }).join('');

        resultDiv.innerHTML = `
            <div class="card p-4 sm:p-6 bg-cyan-50 border-l-8 border-cyan-500">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">${activity.title}</h2>
                    <div class="flex flex-wrap gap-2">${domainsHtml}</div>
                </div>
                <p class="activity-detail-title">Por Que Fazer?</p><p class="text-gray-600">${activity.why}</p>
                <p class="activity-detail-title">Como Fazer (Passo a Passo)</p><p class="text-gray-600">${activity.how}</p>
                <p class="activity-detail-title">Materiais</p><p class="text-gray-600">${activity.materials}</p>
                <p class="activity-detail-title">Segurança <span class="text-red-600">(ALERTA)</span></p><p class="text-gray-600">${activity.safety}</p>
            </div>`;
        
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1500);
}
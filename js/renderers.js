// FUNÇÕES DE RENDERIZAÇÃO DAS DIFERENTES SEÇÕES

function renderDailyActivity() {
    const availableActivities = ACTIVITIES.filter(a => a.ages.includes(currentAgeGroup));
    const activity = availableActivities[Math.floor(Math.random() * availableActivities.length)];
    const mainContent = document.getElementById('main-content');
    if (!activity) {
        mainContent.innerHTML = `<div class="card p-6 daily-activity-card"><h2 class="text-xl font-bold text-gray-800">Nenhuma atividade encontrada para esta faixa etária.</h2></div>`;
        return;
    }
    const domainData = DOMAIN_MAP[activity.domain] || { label: activity.domain, color: '#6b7280', icon: '❓' };
    mainContent.innerHTML = `
        <div class="card p-4 sm:p-6 daily-activity-card">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">${activity.title}</h2>
                <span class="tag-domain text-sm mt-2 sm:mt-0" style="background-color: ${domainData.color}1a; color: ${domainData.color};">${domainData.icon} ${domainData.label}</span>
            </div>
            <p class="text-gray-500 italic mb-4">Recomendação do dia para ${AGE_GROUPS.find(g => g.id === currentAgeGroup).label}.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div><p class="activity-detail-title">Materiais Necessários</p><p class="text-gray-600">${activity.materials}</p></div>
                <div><p class="activity-detail-title">Segurança e Cuidados <span class="text-red-600">(ALERTA)</span></p><p class="text-gray-600">${activity.safety}</p></div>
            </div>
            <p class="activity-detail-title">Por Que Fazer?</p><p class="text-gray-600">${activity.why}</p>
            <p class="activity-detail-title">Como Fazer (Passo a Passo)</p><p class="text-gray-600">${activity.how}</p>
            <div class="flex justify-center mt-8">
                <button onclick="renderDailyActivity()" class="btn-primary flex items-center justify-center">🔄 Tentar Outra Atividade</button>
            </div>
        </div>`;
}

function renderMilestones() {
    const ageLabel = AGE_GROUPS.find(g => g.id === currentAgeGroup).label;
    let html = `
        <div class="card p-4 sm:p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Marcos de Desenvolvimento: ${ageLabel}</h2>
            <p class="text-sm text-gray-500 mb-6">Estes são marcos esperados. Lembre-se que cada criança tem seu ritmo, mas a ausência de vários marcos pode ser um sinal para acompanhamento pediátrico.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`;
    for (const domainKey in MARCOS) {
        const domainMarcos = MARCOS[domainKey].find(m => m.idade === ageLabel);
        const domainData = DOMAIN_MAP[domainKey] || { label: domainKey, color: '#6b7280', icon: '❓' };
        if (domainMarcos) {
            html += `
                <div class="p-4 rounded-xl shadow-lg border-t-4" style="border-color: ${domainData.color}; background-color: white;">
                    <h3 class="text-xl font-bold mb-3 text-gray-800 flex items-center"><span class="mr-2 text-2xl">${domainData.icon}</span> ${domainData.label}</h3>
                    <ul class="space-y-2 list-none pl-0">${domainMarcos.marcos.map(marco => `<li class="flex items-start text-gray-600"><span class="mr-2 text-green-500 font-bold">✓</span>${marco}</li>`).join('')}</ul>
                </div>`;
        }
    }
    html += `</div></div>`;
    document.getElementById('main-content').innerHTML = html;
}

function renderActivityArsenal() {
    let filteredActivities = ACTIVITIES.filter(a => a.ages.includes(currentAgeGroup));
    if (activeDomainFilter !== 'all') {
        filteredActivities = filteredActivities.filter(a => a.domain.toLowerCase().includes(activeDomainFilter));
    }
    const domainFilters = Object.entries(DOMAIN_MAP).map(([key, value]) => `<button id="filter-btn-${key}" onclick="switchDomainFilter('${key}')" class="arsenal-filter-btn px-4 py-2 rounded-full font-semibold text-sm transition ${activeDomainFilter === key ? 'active-filter' : ''}">${value.icon} ${value.label}</button>`).join('');
    const allFilterButton = `<button id="filter-btn-all" onclick="switchDomainFilter('all')" class="arsenal-filter-btn px-4 py-2 rounded-full font-semibold text-sm transition ${activeDomainFilter === 'all' ? 'active-filter' : ''}">⭐ Todos</button>`;
    let activitiesHtml = filteredActivities.map(activity => {
        const domainData = DOMAIN_MAP[activity.domain] || { label: activity.domain, color: '#6b7280', icon: '❓' };
        return `<div class="activity-card p-6 bg-white border-l-4" style="border-color: ${domainData.color};">
                <div class="flex justify-between items-start mb-2"><h3 class="text-xl font-bold text-gray-800">${activity.title}</h3><span class="tag-domain text-xs px-3 py-1" style="background-color: ${domainData.color}1a; color: ${domainData.color};">${domainData.icon} ${domainData.label}</span></div>
                <p class="text-gray-600 text-sm italic mb-4">Quando: ${activity.when}</p>
                <div class="space-y-3 text-sm">
                    <p><strong>Por que fazer?</strong> ${activity.why}</p><p><strong>Materiais:</strong> ${activity.materials}</p><p><strong>Segurança:</strong> <span class="text-red-600">${activity.safety}</span></p>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-100"><p class="text-gray-800 font-semibold">Passo a Passo:</p><p class="text-gray-600">${activity.how}</p></div>
            </div>`;
    }).join('');
    if (filteredActivities.length === 0) activitiesHtml = `<div class="card col-span-full p-8 text-center bg-red-50 border border-red-200"><p class="text-xl font-semibold text-red-700">Nenhuma atividade encontrada.</p><p class="text-red-500 mt-2">Tente remover o filtro de domínio ou mudar a faixa etária.</p></div>`;
    document.getElementById('main-content').innerHTML = `<div class="mb-6"><h2 class="text-2xl font-bold text-gray-800 mb-4">Arsenal de Atividades para ${AGE_GROUPS.find(g => g.id === currentAgeGroup).label}</h2><p class="text-sm text-gray-500 mb-4">Filtre por domínio para focar em áreas específicas do desenvolvimento.</p><div class="flex flex-wrap gap-2 p-3 bg-white rounded-xl shadow-inner">${allFilterButton}${domainFilters}</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="activities-list">${activitiesHtml}</div>`;
}

function renderAlertsAndGuidelines() {
    let html = `<div class="card p-4 sm:p-6 bg-red-100 border-l-8 border-red-500 mb-8"><h2 class="text-2xl font-bold text-red-800 mb-2 flex items-center"><span class="text-3xl mr-3">⚠️</span> Sinais de Alerta (Red Flags)</h2><p class="text-red-700 text-sm">Estes são indicativos de que a criança pode precisar de uma avaliação profissional. Não se trata de diagnóstico. Em caso de dúvida, sempre consulte um pediatra.</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">`;
    for (const domainKey in RED_FLAGS) {
        const domainData = DOMAIN_MAP[domainKey] || { label: domainKey, color: '#6b7280', icon: '❓' };
        html += `<div class="p-4 rounded-xl shadow-lg bg-white border-t-4 border-red-500"><h3 class="text-xl font-bold mb-3 text-red-800 flex items-center">${domainData.icon} ${domainData.label}</h3><ul class="space-y-2 list-none pl-0">${RED_FLAGS[domainKey].map(flag => `<li class="flex items-start text-gray-600"><span class="mr-2 text-red-500 font-bold">X</span>${flag}</li>`).join('')}</ul></div>`;
    }
    html += `</div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card p-6 bg-green-50 border-l-8 border-green-500"><h3 class="text-2xl font-bold text-green-800 mb-4 flex items-center"><span class="text-2xl mr-3">✅</span> Indicações de Ouro</h3><ul class="space-y-3 list-none pl-0 text-gray-700">${GUIDELINES.indications.map(item => `<li class="flex items-start"><span class="mr-2 text-green-500 font-bold">→</span>${item}</li>`).join('')}</ul></div>
            <div class="card p-6 bg-yellow-50 border-l-8 border-yellow-500"><h3 class="text-2xl font-bold text-yellow-800 mb-4 flex items-center"><span class="text-2xl mr-3">🛑</span> Contraindicações (O que evitar)</h3><ul class="space-y-3 list-none pl-0 text-gray-700">${GUIDELINES.contraindications.map(item => `<li class="flex items-start"><span class="mr-2 text-yellow-600 font-bold">!</span>${item}</li>`).join('')}</ul></div>
        </div>`;
    document.getElementById('main-content').innerHTML = html;
}

function renderTips() {
    let tipsHtml = TIPS_CONTENT.map(tip => `<div class="card p-6 border-l-8" style="border-color: ${tip.color};"><h3 class="text-2xl font-bold text-gray-800 mb-3 flex items-center"><span class="mr-3 text-3xl">${tip.icon}</span> ${tip.title}</h3><ul class="space-y-2 list-disc ml-6">${tip.body.map(item => `<li class="text-gray-600 leading-relaxed">${item}</li>`).join('')}</ul></div>`).join('');
    document.getElementById('main-content').innerHTML = `<div class="mb-6"><h2 class="text-3xl font-extrabold text-gray-900 mb-2">Dicas Essenciais para o Sucesso</h2><p class="text-lg text-gray-600">O objetivo é construir uma base emocional e cognitiva forte através do vínculo e da brincadeira segura.</p></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6">${tipsHtml}</div><div class="card mt-6 p-6 bg-yellow-50 border-l-4 border-yellow-500 text-center"><p class="text-gray-700 font-semibold italic">Lembre-se: Você é o guia, e o seu bebê é o explorador! Concentre-se no processo, e não apenas nos marcos alcançados.</p></div>`;
}

function renderReferences() {
    document.getElementById('main-content').innerHTML = `<div class="card p-6"><h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center"><span class="text-3xl mr-3">📚</span> Referências Bibliográficas (ABNT)</h2><p class="text-sm text-gray-500 mb-6">O conteúdo deste guia é baseado em diretrizes e estudos do desenvolvimento infantil. Sempre busque orientação profissional para casos específicos.</p><ul class="space-y-4 list-none pl-0">${REFERENCES.map(ref => `<li class="text-gray-700 leading-relaxed border-b pb-2 border-gray-100">${ref}</li>`).join('')}</ul></div>`;
}
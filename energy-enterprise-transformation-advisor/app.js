'use strict';
/* ============================================================
   Energy Enterprise AI Advisor — app.js
   Premium dark-mode portal with enterprise chat
   All data: synthetic CSVs. No LLM API. No system writes.
   ============================================================ */

// ── CSV paths ─────────────────────────────────────────────────
const CSV = {
  demandForecast:  'Demand-Planning-Agent/sample-data/demand_forecast.csv',
  demandScenarios: 'Demand-Planning-Agent/sample-data/demand_scenarios.csv',
  productionPlan:  'Supply-Planning-Agent/sample-data/production_plan.csv',
  inventoryPlan:   'Supply-Planning-Agent/sample-data/inventory_plan.csv',
  datasourceInv:   'Data-Analytics-Agent/sample-data/datasource_inventory.csv',
  docCatalog:      'Knowledge-Repository-Agent/sample-data/document_catalog.csv',
  appInventory:    'Enterprise-Architecture-Agent/sample-data/application_inventory.csv',
};

// ── Data cache ────────────────────────────────────────────────
const D = {};

// ── Agent registry ────────────────────────────────────────────
const AGENTS = [
  { id:'demand',       name:'Demand Planning',        icon:'🔢', category:'planning',    readiness:'conditional',
    desc:'Versioned baseline and scenario demand forecasts for human review.',
    status:'⚠ Major Gaps — data dictionary missing' },
  { id:'supply',       name:'Supply Planning',         icon:'🏭', category:'planning',    readiness:'conditional',
    desc:'Constrained and unconstrained supply alternatives from approved demand.',
    status:'⚠ Minor Gaps — Material_ID crosswalk pending' },
  { id:'analytics',   name:'Data Analytics',          icon:'🔍', category:'governance',  readiness:'ready',
    desc:'Data quality, lineage, source validation and governed data products.',
    status:'● Ready — fixture-backed prototype' },
  { id:'architecture',name:'Enterprise Architecture', icon:'🏗️', category:'governance',  readiness:'ready',
    desc:'Application inventory, lifecycle status, standards compliance.',
    status:'● Ready — fixture-backed prototype' },
  { id:'knowledge',   name:'Knowledge Repository',    icon:'📚', category:'governance',  readiness:'ready',
    desc:'Permission-aware citation, document retrieval and knowledge freshness.',
    status:'● Ready — fixture-backed prototype' },
];

// ── Welcome prompts ───────────────────────────────────────────
const WELCOME_PROMPTS = [
  'What are the top supply risks this planning cycle?',
  'Which applications are approaching end of support?',
  'Show me data quality issues across all sources.',
  'Compare baseline vs cold-winter demand for Winter Diesel.',
  'Which documents are overdue for review?',
  'Summarize all P0 alerts across all agents.',
];

// ── Suggested prompts (chat input area) ───────────────────────
const SUGGESTED_PROMPTS = [
  'Top supply risks', 'EOL app exposure',
  'Low DQ sources', 'Compare scenarios',
  'Overdue reviews', 'P0 alerts',
];

// ── Chat mode state ───────────────────────────────────────────
let chatMode = 'all';               // 'all' | 'single'
let selectedAgents = new Set(AGENTS.map(a => a.id)); // all selected by default
let chatHistory = [];               // {role, content, agents}

// ── Active filter for recommendations ────────────────────────
let recFilter = 'all';

// ── Chart registry ────────────────────────────────────────────
const CHARTS = {};

// ══════════════════════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════════════════════
// ── Theme ─────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

async function init() {
  initTheme();
  await Promise.all(Object.entries(CSV).map(([k, v]) => loadCSV(k, v)));

  populatePeriods();
  initNav();
  initSidebarToggle();
  initGlobalSearch();
  renderHomeKPIs();
  renderHomeAgents();
  renderHomeAlerts();
  buildAgentCatalog();
  buildChatAgentSelector();
  buildWelcomePrompts();
  buildSuggestedChips();
  initChat();
  initChatModes();
  initRecFilters();
  initAgentHubFilters();
  initAgentSearch();
  renderRecommendations();
  renderWorkflows();
  updateRecBadge();
}

async function loadCSV(key, path) {
  try {
    const r = await fetch(path);
    if (!r.ok) { D[key] = []; return; }
    const t = await r.text();
    D[key] = Papa.parse(t, { header:true, skipEmptyLines:true, dynamicTyping:true }).data;
  } catch { D[key] = []; }
}

// ══════════════════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════════════════
function initNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.page));
  });
}

function navigate(pageId) {
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === pageId);
  });
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const p = document.getElementById('page-' + pageId);
  if (p) p.classList.add('active');
  onPageActivate(pageId);
}

function onPageActivate(id) {
  if (id === 'dashboard') renderDashboard();
  if (id === 'home')      { renderHomeKPIs(); renderHomeAlerts(); }
  if (id === 'recommendations') renderRecommendations();
}

function initSidebarToggle() {
  const btn = document.getElementById('sidebar-toggle');
  const shell = document.getElementById('shell');
  if (btn) btn.addEventListener('click', () => shell.classList.toggle('collapsed'));
}

// ══════════════════════════════════════════════════════════════
// GLOBAL SEARCH → route to chat
// ══════════════════════════════════════════════════════════════
function initGlobalSearch() {
  const inp = document.getElementById('global-search');
  const go  = document.getElementById('search-go');
  const fire = () => {
    const q = inp.value.trim();
    if (!q) return;
    inp.value = '';
    navigate('chat');
    setTimeout(() => dispatchChat(q), 150);
  };
  if (go)  go.addEventListener('click', fire);
  if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') fire(); });
}

// ══════════════════════════════════════════════════════════════
// PERIOD FILTER
// ══════════════════════════════════════════════════════════════
function populatePeriods() {
  const fc = D.demandForecast || [];
  const months = [...new Set(fc.map(r => r.Month).filter(Boolean))].sort();
  const sel = document.getElementById('global-period');
  if (!sel) return;
  sel.innerHTML = months.map(m => `<option value="${m}">${m}</option>`).join('');
  sel.addEventListener('change', () => { renderHomeKPIs(); onPageActivate('dashboard'); });
  const lr = document.getElementById('last-refresh');
  if (lr) lr.textContent = months[0] ? 'As of ' + months[0] : 'No data';
  const tag = document.getElementById('dash-period-tag');
  if (tag) tag.textContent = months[0] || '';
}

function period() {
  const s = document.getElementById('global-period');
  return s ? s.value : null;
}

// ══════════════════════════════════════════════════════════════
// KPI CALCULATIONS
// ══════════════════════════════════════════════════════════════
function calcGap(p) {
  const fc = D.demandForecast || [];
  const pp = D.productionPlan || [];
  const d = fc.filter(r => r.Month === p).reduce((s, r) => s + (+r.Forecast_Volume || 0), 0);
  const s = pp.filter(r => r.Month === p).reduce((s, r) => s + (+r.Planned_Qty || 0), 0);
  return d > 0 ? +((d - s) / d * 100).toFixed(1) : null;
}

function calcDQ() {
  const ds = D.datasourceInv || [];
  const sc = ds.map(r => +r.Data_Quality_Score).filter(n => !isNaN(n));
  return sc.length ? +(sc.reduce((a, b) => a + b, 0) / sc.length).toFixed(1) : null;
}

function calcCitation() {
  const docs = D.docCatalog || [];
  if (!docs.length) return null;
  return +((docs.filter(r => r.Review_Status === 'Current').length / docs.length) * 100).toFixed(1);
}

function calcEOL() {
  return (D.appInventory || []).filter(r => ['EOL','Unsupported','End of Life'].includes(r.Lifecycle_Status)).length;
}

function calcOverdue() {
  return (D.docCatalog || []).filter(r => r.Review_Status === 'Overdue').length;
}

function calcAppCov() {
  const apps = D.appInventory || [];
  if (!apps.length) return null;
  return +((apps.filter(r => r.TIME_Disposition).length / apps.length) * 100).toFixed(1);
}

// ══════════════════════════════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════════════════════════════
function renderHomeKPIs() {
  const p = period();
  const gap = calcGap(p);
  const dq  = calcDQ();
  const cit = calcCitation();
  const eol = calcEOL();

  set('qval-gap',     gap !== null ? gap + '%' : '—');
  set('qstat-gap',    gap !== null ? (Math.abs(gap) > 20 ? '⚠ Review Required' : 'Conditional') : 'No data');
  set('qval-dq',      dq !== null ? dq : '—');
  set('qstat-dq',     dq !== null ? (dq >= 85 ? 'On Track' : 'Attention') : 'No data');
  set('qval-eol',     eol);
  set('qstat-eol',    eol > 0 ? '⚠ Review Required' : 'On Track');
  set('qval-citation', cit !== null ? cit + '%' : '—');
  set('qstat-citation', cit !== null ? (cit >= 95 ? '● On Track' : '⚠ Below 95%') : 'No data');
}

function renderHomeAgents() {
  const grid = document.getElementById('home-agents-grid');
  if (!grid) return;
  grid.innerHTML = AGENTS.map(a => `
    <div class="agent-home-card" onclick="navigate('chat')">
      <div class="ahc-top">
        <span class="ahc-icon">${a.icon}</span>
        <span class="ahc-name">${a.name}</span>
      </div>
      <div class="ahc-status">
        <span class="status-dot ${a.readiness === 'ready' ? 'status-dot-green' : 'status-dot-amber'}"></span>
        <span>${a.status}</span>
      </div>
      <div class="ahc-desc">${a.desc}</div>
    </div>`).join('');
}

function renderHomeAlerts() {
  const list = document.getElementById('home-alerts-list');
  if (!list) return;
  const alerts = buildAlerts().slice(0, 5);
  list.innerHTML = alerts.map(a => `
    <div class="home-alert-row">
      <span class="${a.p.toLowerCase()}">${a.p}</span>
      <span class="ha-desc">${a.desc}</span>
      <span class="ha-agent">${a.agent}</span>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════
function renderDashboard() {
  renderDashKPIs();
  renderDashCharts();
  renderAlertsTable();
}

function renderDashKPIs() {
  const p = period();
  const gap = calcGap(p);
  const dq  = calcDQ();
  const ds = D.datasourceInv || [];
  const cit = calcCitation();
  const od  = calcOverdue();
  const eol = calcEOL();
  const cov = calcAppCov();
  const apps = D.appInventory || [];
  const today = new Date();
  const cutoff = new Date(today); cutoff.setFullYear(today.getFullYear() + 1);
  const exp = apps.filter(r => {
    if (!r.Support_End_Date) return false;
    const d = new Date(r.Support_End_Date);
    return d >= today && d <= cutoff;
  }).length;

  const cards = [
    { label:'Revenue Growth Rate', value:'—', target:'10% YoY', status:'unavailable', note:'Finance source not connected', cls:'unavailable' },
    { label:'EBITDA Margin',        value:'—', target:'25%',     status:'unavailable', note:'Finance source not connected', cls:'unavailable' },
    { label:'Demand-Supply Gap',    value: gap !== null ? gap + '%' : '—',
      target:'< 20%', status: gap !== null ? (Math.abs(gap)>20?'review':'conditional') : 'unavailable',
      note:'Conditional — UoM pending', cls: gap !== null && Math.abs(gap)>20 ? 'warn' : '' },
    { label:'Avg Data Quality',     value: dq || '—', target:'Owner-defined',
      status: dq ? (dq>=85?'measured':'conditional') : 'unavailable', note: ds.length + ' sources', cls:'' },
    { label:'Citation Coverage',    value: cit !== null ? cit+'%' : '—', target:'≥ 95%',
      status: cit !== null ? (cit>=95?'measured':'review') : 'unavailable', note:'Proxy: current docs / total', cls: cit < 95 ? 'warn' : '' },
    { label:'Overdue Doc Reviews',  value: od, target:'0',
      status: od>0?'review':'measured', note:'document_catalog.csv', cls: od>0?'warn':'' },
    { label:'EOL / Unsupported Apps', value: eol, target:'0 critical',
      status: eol>0?'review':'measured', note:'application_inventory.csv', cls: eol>0?'warn':'' },
    { label:'Apps Expiring ≤12mo',  value: exp, target:'0',
      status: exp>0?'review':'measured', note:'Support_End_Date column', cls: exp>0?'warn':'' },
  ];

  const grid = document.getElementById('dash-kpi-grid');
  if (!grid) return;
  grid.innerHTML = cards.map(c => `
    <div class="kpi-card ${c.cls}">
      <div class="kpi-label">${c.label}</div>
      <div class="kpi-value">${c.value}</div>
      <div class="kpi-target">Target: ${c.target}</div>
      <span class="kpi-status status-${c.status}">${c.status.replace('_',' ').toUpperCase()}</span>
      <div class="kpi-note">${c.note}</div>
    </div>`).join('');

  const tag = document.getElementById('dash-period-tag');
  if (tag) tag.textContent = period() || '';
}

function renderDashCharts() {
  const p = period();
  const fc = D.demandForecast || [];
  const filt = fc.filter(r => r.Month === p);
  const prodMap = {};
  filt.forEach(r => { prodMap[r.Product] = (prodMap[r.Product]||0) + (+r.Forecast_Volume||0); });
  const pKeys = Object.keys(prodMap).sort();

  destroyChart('chart-demand');
  if (pKeys.length && el('chart-demand')) {
    CHARTS['chart-demand'] = new Chart(el('chart-demand'), {
      type:'bar',
      data:{ labels:pKeys, datasets:[{ label:'Forecast Volume', data:pKeys.map(k=>prodMap[k]),
        backgroundColor:'rgba(0,212,255,.35)', borderColor:'#00d4ff', borderWidth:1 }] },
      options:darkChart('Volume (litres)')
    });
  }

  const sc = D.demandScenarios || [];
  destroyChart('chart-scenario');
  if (sc.length && el('chart-scenario')) {
    const scProds = sc.map(r => r.Product);
    const scVals  = sc.map(r => +r.Demand_Impact||0);
    CHARTS['chart-scenario'] = new Chart(el('chart-scenario'), {
      type:'bar',
      data:{ labels:scProds, datasets:[{ label:'Impact', data:scVals,
        backgroundColor: scVals.map(v=>v>=0?'rgba(16,185,129,.4)':'rgba(239,68,68,.4)'),
        borderColor: scVals.map(v=>v>=0?'#10b981':'#ef4444'), borderWidth:1 }] },
      options:darkChart('Impact Multiplier')
    });
  }

  const pp = D.productionPlan || [];
  const plantMap = {};
  pp.forEach(r => { plantMap[r.Plant] = (plantMap[r.Plant]||0) + (+r.Planned_Qty||0); });
  const plants = Object.keys(plantMap).sort();
  destroyChart('chart-supply-plant');
  if (plants.length && el('chart-supply-plant')) {
    CHARTS['chart-supply-plant'] = new Chart(el('chart-supply-plant'), {
      type:'bar',
      data:{ labels:plants, datasets:[{ label:'Planned Qty', data:plants.map(k=>plantMap[k]),
        backgroundColor:'rgba(16,185,129,.35)', borderColor:'#10b981', borderWidth:1 }] },
      options:darkChart('Planned Qty (tonnes)')
    });
  }

  const ds = D.datasourceInv || [];
  const sorted = [...ds].sort((a,b)=>+a.Data_Quality_Score - +b.Data_Quality_Score).slice(0,10);
  destroyChart('chart-dq-sources');
  if (sorted.length && el('chart-dq-sources')) {
    const dqVals = sorted.map(r=>+r.Data_Quality_Score||0);
    CHARTS['chart-dq-sources'] = new Chart(el('chart-dq-sources'), {
      type:'bar',
      data:{ labels:sorted.map(r=>(r.Source_System||'').substring(0,28)),
        datasets:[{ label:'DQ Score', data:dqVals,
          backgroundColor: dqVals.map(v=>v>=85?'rgba(16,185,129,.4)':v>=70?'rgba(245,158,11,.4)':'rgba(239,68,68,.4)'),
          borderColor: dqVals.map(v=>v>=85?'#10b981':v>=70?'#f59e0b':'#ef4444'), borderWidth:1 }] },
      options:{ ...darkChart('DQ Score'), indexAxis:'y',
        scales:{ x:{min:0,max:100,...darkScaleX()}, y:{...darkScaleY()} } }
    });
  }
}

function renderAlertsTable() {
  const tbody = document.getElementById('alerts-body');
  if (!tbody) return;
  tbody.innerHTML = buildAlerts().map(a => `<tr>
    <td><span class="${a.p.toLowerCase()}">${a.p}</span></td>
    <td>${a.agent}</td>
    <td>${a.desc}</td>
    <td style="max-width:140px;white-space:normal;font-size:.73rem">${a.scope}</td>
    <td>${a.owner}</td>
    <td style="font-size:.73rem">${a.action}</td>
  </tr>`).join('');
}

function buildAlerts() {
  const ds  = D.datasourceInv  || [];
  const docs = D.docCatalog    || [];
  const apps = D.appInventory  || [];
  const alerts = [];

  alerts.push({ p:'P3', agent:'Finance', desc:'Revenue Growth & EBITDA unavailable',
    scope:'All BUs', owner:'Finance Owner', action:'Connect Finance data source' });

  ds.filter(r=>+r.Data_Quality_Score < 80).slice(0,3).forEach(r =>
    alerts.push({ p:'P1', agent:'Data Analytics', desc:'DQ Score below 80',
      scope:r.Source_System||'—', owner:r.Owner||'Data Steward', action:'Investigate and remediate' }));

  const od = docs.filter(r=>r.Review_Status==='Overdue').length;
  if (od) alerts.push({ p:'P1', agent:'Knowledge Repository', desc:`${od} docs overdue for review`,
    scope:'Document Catalog', owner:'Document Owner', action:'Complete overdue reviews' });

  const eols = apps.filter(r=>['EOL','Unsupported','End of Life'].includes(r.Lifecycle_Status));
  if (eols.length) alerts.push({ p:'P0', agent:'Enterprise Architecture',
    desc:`${eols.length} EOL/Unsupported applications`,
    scope:eols.slice(0,2).map(a=>a.Application_Name).join(', ')+(eols.length>2?'…':''),
    owner:'Architecture Board', action:'Plan remediation or risk acceptance' });

  const today = new Date(); const cut = new Date(today); cut.setFullYear(today.getFullYear()+1);
  const exp = apps.filter(r=>{ if(!r.Support_End_Date)return false; const d=new Date(r.Support_End_Date); return d>=today&&d<=cut; });
  if (exp.length) alerts.push({ p:'P2', agent:'Enterprise Architecture',
    desc:`${exp.length} apps support ending within 12 months`,
    scope:exp.slice(0,2).map(a=>a.Application_Name).join(', ')+(exp.length>2?'…':''),
    owner:'Architecture Board', action:'Plan upgrade or migration' });

  return alerts;
}

// ══════════════════════════════════════════════════════════════
// AGENT HUB
// ══════════════════════════════════════════════════════════════
function buildAgentCatalog(filter='all') {
  const cat = document.getElementById('agent-catalog');
  if (!cat) return;
  const filtered = filter==='all' ? AGENTS : AGENTS.filter(a=>a.category===filter);
  cat.innerHTML = filtered.map(a => `
    <div class="agent-cat-card ${a.category}">
      <div class="acc-header">
        <span class="acc-icon">${a.icon}</span>
        <div>
          <div class="acc-name">${a.name}</div>
          <div class="acc-category">${a.category}</div>
        </div>
      </div>
      <div class="acc-desc">${a.desc}</div>
      <div class="acc-footer">
        <span class="acc-readiness ${a.readiness}">${a.readiness==='ready'?'● Ready':'⚠ Conditional'}</span>
        <button class="acc-chat-btn" onclick="openAgentChat('${a.id}')">💬 Chat</button>
      </div>
    </div>`).join('');
}

function initAgentHubFilters() {
  document.querySelectorAll('.atab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.atab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      buildAgentCatalog(btn.dataset.filter);
    });
  });
}

function initAgentSearch() {
  const inp = document.getElementById('agent-search');
  if (!inp) return;
  inp.addEventListener('input', () => {
    const q = inp.value.toLowerCase();
    document.querySelectorAll('.agent-cat-card').forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

function openAgentChat(agentId) {
  navigate('chat');
  setTimeout(() => {
    chatMode = 'single';
    selectedAgents = new Set([agentId]);
    updateChatModeUI();
    document.querySelectorAll('.cap-agent-item').forEach(item => {
      item.classList.toggle('selected', item.dataset.agent === agentId);
    });
  }, 100);
}

// ══════════════════════════════════════════════════════════════
// ENTERPRISE CHAT
// ══════════════════════════════════════════════════════════════
function buildChatAgentSelector() {
  const cont = document.getElementById('chat-agent-selector');
  if (!cont) return;
  cont.innerHTML = AGENTS.map(a => `
    <div class="cap-agent-item selected" data-agent="${a.id}">
      <span class="cap-agent-icon">${a.icon}</span>
      <span class="cap-agent-name">${a.name}</span>
      <span class="cap-agent-status ${a.readiness==='ready'?'status-dot-green':'status-dot-amber'}"></span>
    </div>`).join('');

  document.querySelectorAll('.cap-agent-item').forEach(item => {
    item.addEventListener('click', () => {
      if (chatMode === 'all') return;
      item.classList.toggle('selected');
      const id = item.dataset.agent;
      if (item.classList.contains('selected')) selectedAgents.add(id);
      else selectedAgents.delete(id);
      updateActiveAgentsList();
    });
  });
}

function buildWelcomePrompts() {
  const cont = document.getElementById('welcome-prompts');
  if (!cont) return;
  cont.innerHTML = WELCOME_PROMPTS.map(p => `
    <span class="wp-chip" data-prompt="${p}">${p}</span>`).join('');
  cont.querySelectorAll('.wp-chip').forEach(chip => {
    chip.addEventListener('click', () => dispatchChat(chip.dataset.prompt));
  });
}

function buildSuggestedChips() {
  const cont = document.getElementById('chat-suggested');
  if (!cont) return;
  cont.innerHTML = SUGGESTED_PROMPTS.map(p => `
    <span class="sug-chip">${p}</span>`).join('');
  cont.querySelectorAll('.sug-chip').forEach(chip => {
    chip.addEventListener('click', () => dispatchChat(chip.textContent));
  });
}

function initChat() {
  const btn  = document.getElementById('main-send-btn');
  const inp  = document.getElementById('main-chat-input');
  const clr  = document.getElementById('chat-clear');
  if (btn) btn.addEventListener('click', () => sendMain());
  if (inp) inp.addEventListener('keydown', e => {
    if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMain(); }
  });
  if (clr) clr.addEventListener('click', clearChat);
}

function initChatModes() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      chatMode = btn.dataset.mode;
      if (chatMode==='all') {
        selectedAgents = new Set(AGENTS.map(a=>a.id));
        document.querySelectorAll('.cap-agent-item').forEach(i=>i.classList.add('selected'));
      }
      updateChatModeUI();
    });
  });
}

function updateChatModeUI() {
  const lbl = document.getElementById('chat-mode-label');
  if (lbl) lbl.textContent = chatMode==='all' ? 'All Agents Mode' : 'Single Agent Mode';
  updateActiveAgentsList();
}

function updateActiveAgentsList() {
  const cont = document.getElementById('chat-active-agents');
  if (!cont) return;
  const active = AGENTS.filter(a=>selectedAgents.has(a.id));
  cont.innerHTML = active.map(a => `<span class="cap-active-pill">${a.icon} ${a.name}</span>`).join('');
}

function sendMain() {
  const inp = document.getElementById('main-chat-input');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;
  inp.value = '';
  dispatchChat(text);
}

function clearChat() {
  chatHistory = [];
  const msgs = document.getElementById('main-chat-msgs');
  if (!msgs) return;
  msgs.innerHTML = `<div class="chat-welcome">
    <div class="chat-welcome-icon">⚡</div>
    <h3>Energy Enterprise AI Advisor</h3>
    <p>Ask anything. Select one agent, multiple agents, or all agents at once.</p>
    <div class="welcome-prompts" id="welcome-prompts"></div>
  </div>`;
  buildWelcomePrompts();
}

function dispatchChat(text) {
  // Remove welcome screen
  const welcome = document.querySelector('.chat-welcome');
  if (welcome) welcome.remove();

  // Append user message
  appendUserMsg(text);

  // Show thinking indicator
  const thinkId = 'think-' + Date.now();
  appendThinking(thinkId);

  // Determine which agents respond
  const respondingAgents = chatMode==='all'
    ? AGENTS
    : AGENTS.filter(a=>selectedAgents.has(a.id));

  // Update context panel KPIs
  updateContextPanel();

  setTimeout(() => {
    removeEl(thinkId);
    if (chatMode==='all' && respondingAgents.length > 1) {
      renderConsolidatedResponse(text, respondingAgents);
    } else {
      respondingAgents.forEach(a => renderSingleAgentResponse(text, a));
    }
    updateContextSources(respondingAgents);
    scrollChat();
  }, 600 + Math.random()*400);
}

function appendUserMsg(text) {
  const msgs = document.getElementById('main-chat-msgs');
  if (!msgs) return;
  const d = document.createElement('div');
  d.className = 'chat-msg-user';
  d.textContent = text;
  msgs.appendChild(d);
}

function appendThinking(id) {
  const msgs = document.getElementById('main-chat-msgs');
  if (!msgs) return;
  const d = document.createElement('div');
  d.id = id;
  d.className = 'agent-msg-thinking';
  d.innerHTML = `<span>Agents thinking</span>
    <span class="thinking-dots"><span></span><span></span><span></span></span>`;
  msgs.appendChild(d);
  scrollChat();
}

function renderConsolidatedResponse(text, agents) {
  const msgs = document.getElementById('main-chat-msgs');
  if (!msgs) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'chat-msg-agent';

  const hdr = document.createElement('div');
  hdr.className = 'agent-msg-header';
  hdr.innerHTML = agents.map(a=>`<span class="agent-msg-name">${a.icon} ${a.name}</span>`).join('');
  wrapper.appendChild(hdr);

  const bubble = document.createElement('div');
  bubble.className = 'agent-msg-bubble';

  const ch = document.createElement('div');
  ch.className = 'consolidated-header';
  ch.textContent = '⚡ Consolidated Response — ' + agents.length + ' agents participated';
  bubble.appendChild(ch);

  agents.forEach(a => {
    const resp = classify(a.id, text);
    const sub = document.createElement('div');
    sub.className = 'agent-sub-response';
    sub.innerHTML = `<strong>${a.icon} ${a.name}</strong>
      <span class="msg-status kpi-status status-${resp.status}" style="margin-left:.5rem">
        ${resp.status.replace('_',' ').toUpperCase()}</span>
      <pre>${resp.body}</pre>
      ${resp.next ? `<div class="agent-msg-next">⚡ ${resp.next}</div>` : ''}`;
    bubble.appendChild(sub);
  });

  // Provenance
  const prov = document.createElement('div');
  prov.className = 'agent-msg-provenance';
  prov.textContent = '📄 Sources: ' + agents.map(a => classify(a.id, text).provenance).join(' · ');
  bubble.appendChild(prov);

  wrapper.appendChild(bubble);
  msgs.appendChild(wrapper);
}

function renderSingleAgentResponse(text, agent) {
  const msgs = document.getElementById('main-chat-msgs');
  if (!msgs) return;
  const resp = classify(agent.id, text);
  const statusClass = {
    completed:'status-completed', review_required:'status-review',
    conditional:'status-conditional', blocked:'status-blocked', unavailable:'status-unavailable'
  }[resp.status] || 'status-conditional';

  const wrapper = document.createElement('div');
  wrapper.className = 'chat-msg-agent';
  wrapper.innerHTML = `
    <div class="agent-msg-header">
      <span class="agent-msg-icon">${agent.icon}</span>
      <span class="agent-msg-name">${agent.name}</span>
    </div>
    <div class="agent-msg-bubble">
      <span class="msg-status kpi-status ${statusClass}">${resp.status.replace('_',' ').toUpperCase()}</span>
      <pre>${resp.body}</pre>
      <div class="agent-msg-provenance">📄 ${resp.provenance}</div>
      ${resp.next ? `<div class="agent-msg-next">⚡ ${resp.next}</div>` : ''}
    </div>`;
  msgs.appendChild(wrapper);
}

function scrollChat() {
  const msgs = document.getElementById('main-chat-msgs');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

// ══════════════════════════════════════════════════════════════
// CONTEXT PANEL
// ══════════════════════════════════════════════════════════════
function updateContextPanel() {
  const p = period();
  const kpis = [
    { label:'D-S Gap', val: calcGap(p) !== null ? calcGap(p)+'%' : '—' },
    { label:'Data Quality', val: calcDQ() || '—' },
    { label:'Citation', val: calcCitation() !== null ? calcCitation()+'%' : '—' },
    { label:'EOL Apps', val: calcEOL() },
  ];
  const cont = document.getElementById('ctx-kpis');
  if (cont) cont.innerHTML = kpis.map(k=>`
    <div class="ctx-kpi-item">
      <div class="ctx-kpi-label">${k.label}</div>
      <div class="ctx-kpi-val">${k.val}</div>
    </div>`).join('');
}

function updateContextSources(agents) {
  const cont = document.getElementById('ctx-sources');
  if (!cont) return;
  const sources = [...new Set(agents.flatMap(a => AGENT_SOURCES[a.id] || []))];
  cont.innerHTML = sources.map(s=>`<div class="ctx-source-item">📄 ${s}</div>`).join('');
}

const AGENT_SOURCES = {
  demand:       ['demand_forecast.csv v1', 'demand_scenarios.csv v1'],
  supply:       ['production_plan.csv v1', 'inventory_plan.csv v1', 'Mock Procurement Plan', 'Mock Asset Status'],
  analytics:    ['datasource_inventory.csv v1', 'datasphere_objects.csv'],
  architecture: ['application_inventory.csv v1', 'technology_standards.csv'],
  knowledge:    ['document_catalog.csv v1'],
};

// ══════════════════════════════════════════════════════════════
// AGENT RESPONSE SIMULATION
// ══════════════════════════════════════════════════════════════
const RESPONSES = {
  demand: [
    { kw:['mape','accuracy','bias','error'],   status:'unavailable',
      body:'MAPE and Signed Forecast Bias cannot be calculated.\nAligned actuals and approved KPI formula are not supplied for this MVP.',
      provenance:'demand_forecast.csv v1 · No actuals fixture',
      next:'Provide aligned actuals and approve KPI formula, then rerun.' },
    { kw:['cold','winter','scenario','compare','scenario'],   status:'review_required',
      body:`Baseline vs Cold-Winter 2026-27 scenario comparison:

Product                         | Baseline | Scenario Impact
Winter Diesel No. 1             | —        | ×5.4  (+440%)  ⚠ >20% threshold
Ultra-Low Sulphur Diesel No. 2  | —        | ×1.4  (+40%)
Regular Unleaded 87             | —        | ×−1.1 (−10%)
Premium Unleaded 91             | —        | ×−0.9 (−10%)

Status: review_required — variance exceeds 20% for Winter Diesel.
Planner approval required before Supply Planning consumes this forecast.`,
      provenance:'demand_forecast.csv v1 · demand_scenarios.csv v1',
      next:'Demand Planner to approve or reject forecast version before downstream use.' },
    { kw:['risk','supply','planning'],   status:'conditional',
      body:'Top demand-side supply risks this planning cycle:\n\n• Cold-winter scenario creates +540% demand multiplier for Winter Diesel — planner review required\n• Aligned actuals not available — MAPE/bias cannot validate forecast accuracy\n• UoM reconciliation between demand (litres) and supply (tonnes) is pending\n• Data dictionary incomplete — forecast grain and unit semantics unconfirmed',
      provenance:'demand_forecast.csv v1 · demand_scenarios.csv v1',
      next:'Resolve UoM alignment and actuals before integrated supply run.' },
    { kw:['variance','20','threshold'],   status:'review_required',
      body:'Variance check complete:\n\nWinter Diesel No. 1 cold-winter impact: +5.4× — exceeds 20% review threshold.\nUltra-Low Sulphur Diesel: +1.4× — within acceptable range.\n\nNo consensus forecast was approved or released.',
      provenance:'demand_scenarios.csv v1',
      next:'Demand Planner to review and approve variance.' },
    { kw:['p0','alert','all'],   status:'completed',
      body:'Demand Planning P0 Alerts:\n\n• Aligned actuals missing — MAPE/bias unavailable\n• Forecast dictionary incomplete — grain and unit semantics unconfirmed\n• Cold-winter scenario variance exceeds 20% for Winter Diesel — planner review required',
      provenance:'demand_forecast.csv v1 · demand_scenarios.csv v1',
      next:'Resolve prerequisites and rerun evaluation.' },
    { kw:[],   status:'completed',
      body:'Demand Planning Agent ready.\n\nCapabilities: baseline forecasts, scenario comparison, variance checks, data quality exceptions.\n\nNote: MAPE, Bias and FVA are unavailable — aligned actuals not supplied.',
      provenance:'demand_forecast.csv v1 · demand_scenarios.csv v1 · Synthetic',
      next:'Ask me to compare scenarios, check variance, or summarize demand risks.' },
  ],
  supply: [
    { kw:['risk','supply','planning','top'],   status:'conditional',
      body:`Top supply risks this planning cycle:

1. Canonical Material_ID missing → procurement/inventory joins blocked
2. Procurement Plan is mock → no firm supply confirmed
3. Asset Status is mock → capacity contributions unverified
4. UoM mismatch (litres vs tonnes) → demand-supply balance blocked
5. Aligned actuals unavailable → Supply Plan Attainment unavailable`,
      provenance:'production_plan.csv v1 · inventory_plan.csv v1 · Mock dependencies',
      next:'Resolve Material_ID crosswalk and approve Procurement Plan/Asset Status contracts.' },
    { kw:['constrained','unconstrained','alternatives','build'],   status:'conditional',
      body:'Constrained and unconstrained alternatives prepared (conditional):\n\nLimitations:\n• Procurement Plan: mock fixture — no firm supply\n• Asset Status: mock — capacity unverified\n• UoM reconciliation pending\n• Material_ID crosswalk missing\n\nResult is conditional until all prerequisites resolved.',
      provenance:'production_plan.csv v1 · inventory_plan.csv v1 · Mock fixtures',
      next:'Planner/S&OP to review after prerequisites resolved.' },
    { kw:['asset','stale','status'],   status:'review_required',
      body:'Asset Status review:\n\nAll Asset Status inputs in this prototype are mock fixtures.\nThey cannot be verified as live or current operational status.\n\nMock Asset Status payloads do not represent actual plant availability.',
      provenance:'Mock Asset Status fixture v1 · Not a production interface',
      next:'Asset Reliability/Operations Owner to confirm current Asset Status.' },
    { kw:['safety stock','inventory','gap'],   status:'conditional',
      body:`Safety stock review from inventory_plan.csv:\n\nSafety stock is defined by Material and Plant.\nMissing inventory rows are NOT treated as zero stock.\n\nCanonical Material_ID is absent — procurement and stock joins blocked.`,
      provenance:'inventory_plan.csv v1 · master-data/products.csv',
      next:'Master Data Steward to create and approve canonical Material_ID crosswalk.' },
    { kw:['p0','alert','all'],   status:'conditional',
      body:'Supply Planning P0 Alerts:\n\n• Canonical Material_ID missing — procurement/inventory joins blocked\n• Procurement Plan is mock — no firm supply\n• Asset Status is mock — capacity unverified\n• UoM mismatch — demand-supply balance blocked',
      provenance:'production_plan.csv v1 · Mock dependencies',
      next:'Resolve all prerequisites before integrated planning run.' },
    { kw:[],   status:'completed',
      body:'Supply Planning Agent ready.\n\nCapabilities: constrained/unconstrained alternatives, inventory/safety stock checks, dependency validation.\n\nAll inputs are synthetic mock data.',
      provenance:'production_plan.csv v1 · inventory_plan.csv v1 · Synthetic',
      next:'Ask me to build alternatives, check safety stock, or validate dependencies.' },
  ],
  analytics: [
    { kw:['quality','low','below 80','score','data quality','issue'],   status:'completed',
      body: (() => {
        const ds = D.datasourceInv || [];
        const low = ds.filter(r=>+r.Data_Quality_Score < 80).slice(0,5);
        if (!low.length) return 'No data sources with DQ Score < 80 in current fixture.';
        return 'Sources with Data Quality Score < 80:\n\n' +
          low.map(r=>`• ${r.Source_System} — Score: ${r.Data_Quality_Score} — Owner: ${r.Owner||'Unknown'}`).join('\n');
      })(),
      provenance:'datasource_inventory.csv v1 · Data_Quality_Score column',
      next:'Data Steward to investigate and remediate low-scoring sources.' },
    { kw:['all','active','source','status'],   status:'completed',
      body: (() => {
        const ds = D.datasourceInv || [];
        const active = ds.filter(r=>r.Status==='Active').length;
        return `Source status summary:\n• Active: ${active}\n• Other/Inactive: ${ds.length-active}\n• Total: ${ds.length}`;
      })(),
      provenance:'datasource_inventory.csv v1 · Status column',
      next:'Review inactive sources and confirm decommission or reactivation.' },
    { kw:['lineage','missing','coverage'],   status:'conditional',
      body:'Lineage Coverage is conditional.\n\nThe owner-defined denominator and scope are not yet established.\nWithout these, lineage coverage cannot be measured as a percentage.',
      provenance:'datasource_inventory.csv v1 · datasphere_objects.csv',
      next:'Data Owner to define and approve lineage denominator and scope.' },
    { kw:['p0','alert','all'],   status:'completed',
      body: (() => {
        const ds = D.datasourceInv || [];
        const low = ds.filter(r=>+r.Data_Quality_Score < 80);
        return `Data Analytics P0/P1 Alerts:\n\n• ${low.length} sources with DQ Score < 80\n• Lineage coverage conditional — denominator not approved\n• Citation coverage proxy only — owner formula required`;
      })(),
      provenance:'datasource_inventory.csv v1',
      next:'Investigate and remediate low-quality sources.' },
    { kw:[],   status:'completed',
      body:'Data Analytics Agent ready.\n\nCapabilities: data quality scores, source status, lineage gaps, exception review.',
      provenance:'datasource_inventory.csv v1 · Synthetic',
      next:'Ask me about low-quality sources, active/inactive sources, or lineage gaps.' },
  ],
  architecture: [
    { kw:['expiring','end of support','12 month','support end'],   status:'completed',
      body: (() => {
        const apps = D.appInventory || [];
        const today = new Date(); const cut = new Date(today); cut.setFullYear(today.getFullYear()+1);
        const exp = apps.filter(r=>{ if(!r.Support_End_Date)return false; const d=new Date(r.Support_End_Date); return d>=today&&d<=cut; }).slice(0,5);
        if (!exp.length) return 'No applications found with support ending within 12 months.';
        return `Applications with support ending within 12 months:\n\n` +
          exp.map(r=>`• ${r.Application_Name}\n  End: ${r.Support_End_Date} | Disposition: ${r.TIME_Disposition||'N/A'}`).join('\n');
      })(),
      provenance:'application_inventory.csv v1 · Support_End_Date column',
      next:'Architecture Board to initiate upgrade or migration planning.' },
    { kw:['eol','unsupported','end of life','lifecycle'],   status:'completed',
      body: (() => {
        const apps = D.appInventory || [];
        const eol = apps.filter(r=>['EOL','Unsupported','End of Life'].includes(r.Lifecycle_Status)).slice(0,5);
        if (!eol.length) return 'No EOL or unsupported applications in this fixture.';
        return `EOL / Unsupported Applications:\n\n` +
          eol.map(r=>`• ${r.Application_Name}\n  Status: ${r.Lifecycle_Status} | Disposition: ${r.TIME_Disposition||'N/A'}`).join('\n');
      })(),
      provenance:'application_inventory.csv v1 · Lifecycle_Status column',
      next:'Architecture Board to approve remediation or formal risk acceptance.' },
    { kw:['risk','supply','top','all','p0','alert'],   status:'completed',
      body: (() => {
        const apps = D.appInventory || [];
        const eol = apps.filter(r=>['EOL','Unsupported','End of Life'].includes(r.Lifecycle_Status)).length;
        const today = new Date(); const cut = new Date(today); cut.setFullYear(today.getFullYear()+1);
        const exp = apps.filter(r=>{ if(!r.Support_End_Date)return false; const d=new Date(r.Support_End_Date); return d>=today&&d<=cut; }).length;
        return `Enterprise Architecture Alerts:\n\n• ${eol} EOL/Unsupported applications — immediate review required\n• ${exp} applications approaching end of support (≤12 months)\n• Standards compliance: conditional — denominator requires owner approval`;
      })(),
      provenance:'application_inventory.csv v1',
      next:'Architecture Board to prioritize EOL and expiring applications.' },
    { kw:[],   status:'completed',
      body:'Enterprise Architecture Agent ready.\n\nCapabilities: application lifecycle, TIME disposition, EOL exposure, standards compliance, end-of-support timelines.',
      provenance:'application_inventory.csv v1 · technology_standards.csv · Synthetic',
      next:'Ask me about expiring apps, EOL exposure, or disposition breakdown.' },
  ],
  knowledge: [
    { kw:['overdue','review','expired'],   status:'completed',
      body: (() => {
        const docs = D.docCatalog || [];
        const od = docs.filter(r=>r.Review_Status==='Overdue').slice(0,5);
        if (!od.length) return 'No overdue documents in this fixture.';
        return `Overdue Documents (${od.length} shown):\n\n` +
          od.map(r=>`• ${r.Title}\n  Domain: ${r.Domain} | Updated: ${r.Last_Updated}`).join('\n');
      })(),
      provenance:'document_catalog.csv v1 · Review_Status column',
      next:'Document Owner/SME to schedule and complete overdue reviews.' },
    { kw:['refin','refinery'],   status:'completed',
      body: (() => {
        const docs = D.docCatalog || [];
        const ref = docs.filter(r=>r.Domain&&r.Domain.toLowerCase().includes('refin')).slice(0,5);
        if (!ref.length) return 'No Refining Operations documents found.';
        return `Refining Operations documents:\n\n` + ref.map(r=>`• ${r.Title} (${r.Status}) — v${r.Version}`).join('\n');
      })(),
      provenance:'document_catalog.csv v1 · Domain column',
      next:'Verify review status and update stale Refining documents.' },
    { kw:['risk','supply','top','all','p0','alert'],   status:'completed',
      body: (() => {
        const docs = D.docCatalog || [];
        const od = docs.filter(r=>r.Review_Status==='Overdue').length;
        const cit = calcCitation();
        return `Knowledge Repository Alerts:\n\n• ${od} documents overdue for review\n• Citation coverage: ${cit!==null?cit+'%':'—'} (target ≥95%)\n• ACL and publication status: not fully validated in MVP fixtures`;
      })(),
      provenance:'document_catalog.csv v1',
      next:'Complete overdue reviews and validate ACL before MVP release.' },
    { kw:[],   status:'completed',
      body:'Knowledge Repository Agent ready.\n\nCapabilities: document review status, overdue reviews, domain search, citation coverage.',
      provenance:'document_catalog.csv v1 · Synthetic',
      next:'Ask me about overdue reviews, domain documents, or citation coverage.' },
  ],
};

function classify(agentId, text) {
  const t = text.toLowerCase();
  const responses = RESPONSES[agentId] || [];
  for (const r of responses) {
    if (r.kw.length === 0) continue;
    if (r.kw.some(k => t.includes(k))) return r;
  }
  return responses[responses.length - 1];
}

// ══════════════════════════════════════════════════════════════
// RECOMMENDATIONS
// ══════════════════════════════════════════════════════════════
const ALL_RECS = [
  { p:'P0', agent:'Enterprise Architecture', title:'EOL Application Exposure',
    scope:'Application Inventory', rationale:'Applications with verified EOL or Unsupported status require immediate remediation or risk acceptance.',
    evidence:'application_inventory.csv v1 · Lifecycle_Status column',
    owner:'Architecture Board', decision:'Prioritize EOL apps for migration, replacement or formal risk acceptance.' },
  { p:'P0', agent:'Demand Planning', title:'Missing Aligned Actuals',
    scope:'Forecast Accuracy KPIs', rationale:'MAPE and Signed Bias cannot be calculated without aligned actuals. Forecast quality is unverified.',
    evidence:'demand_forecast.csv v1 · No actuals fixture provided',
    owner:'Demand Planner / KPI Owner', decision:'Provide aligned actuals and approve KPI formula before forecast evaluation.' },
  { p:'P0', agent:'Supply Planning', title:'Material_ID Crosswalk Missing',
    scope:'All Supply Plans', rationale:'Canonical Material_ID is absent. Procurement and inventory joins are blocked until a governed crosswalk is approved.',
    evidence:'inventory_plan.csv v1 · master-data/products.csv',
    owner:'Master Data Steward', decision:'Create and approve canonical Material_ID crosswalk.' },
  { p:'P1', agent:'Data Analytics', title:'Low Data Quality Sources',
    scope:'Sources with DQ Score < 80', rationale:'Multiple source systems are below the 80-point quality threshold. Dependent KPIs may be conditional.',
    evidence:'datasource_inventory.csv v1 · Data_Quality_Score column',
    owner:'Data Steward / Source Owner', decision:'Investigate and remediate low-scoring sources.' },
  { p:'P1', agent:'Knowledge Repository', title:'Overdue Document Reviews',
    scope:'Document Catalog', rationale:'Citation coverage target of ≥95% is at risk. Overdue documents may contain stale or superseded information.',
    evidence:'document_catalog.csv v1 · Review_Status column',
    owner:'Document Owner / SME', decision:'Schedule and complete overdue reviews; update or supersede stale documents.' },
  { p:'P1', agent:'Supply Planning', title:'Mock Procurement Plan / Asset Status',
    scope:'All Supply Alternatives', rationale:'Procurement Plan and Asset Status are mock inputs and must not be treated as firm supply or live capacity.',
    evidence:'Mock dependency fixtures v1 · Not a production interface',
    owner:'Procurement Owner / Operations', decision:'Approve real Procurement Plan and Asset Status contracts before integration.' },
  { p:'P2', agent:'Enterprise Architecture', title:'Applications Near End of Support',
    scope:'≤ 12 months to support end', rationale:'Applications approaching support end date need upgrade or migration plans before support lapses.',
    evidence:'application_inventory.csv v1 · Support_End_Date column',
    owner:'Architecture Board / IT Owner', decision:'Initiate upgrade or migration planning.' },
  { p:'P2', agent:'Data Analytics', title:'Lineage Coverage Conditional',
    scope:'All Data Products', rationale:'Lineage coverage metric is conditional. Owner-defined denominator and scope required before it can be measured.',
    evidence:'datasource_inventory.csv v1 · datasphere_objects.csv',
    owner:'Data Owner / KPI Owner', decision:'Define and approve lineage denominator and scope.' },
  { p:'P3', agent:'Finance', title:'Finance KPIs Unavailable',
    scope:'Revenue Growth Rate · EBITDA Margin', rationale:'Revenue Growth Rate and EBITDA Margin cannot be displayed. Finance data source and formula approvals are not established.',
    evidence:'Finance-Agent/sample-data/revenue.csv — present but KPI formula not approved',
    owner:'Finance Owner', decision:'Connect and approve Finance data source and KPI formula.' },
];

function initRecFilters() {
  document.querySelectorAll('.rec-ftab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.rec-ftab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      recFilter = btn.dataset.pf;
      renderRecommendations();
    });
  });
}

function renderRecommendations() {
  const grid = document.getElementById('rec-grid');
  if (!grid) return;
  const filtered = recFilter==='all' ? ALL_RECS : ALL_RECS.filter(r=>r.p===recFilter);
  grid.innerHTML = filtered.map(r=>`
    <div class="rec-card ${r.p.toLowerCase()}-card">
      <div class="rec-card-top">
        <span class="${r.p.toLowerCase()}">${r.p}</span>
        <span class="rec-card-title">${r.title}</span>
      </div>
      <div class="rec-scope">📍 ${r.scope} · ${r.agent}</div>
      <div class="rec-body-text">${r.rationale}</div>
      <div class="rec-evidence">📄 ${r.evidence}</div>
      <div class="rec-owner">👤 Owner: ${r.owner}</div>
      <div class="rec-decision">⚡ ${r.decision}</div>
    </div>`).join('');
}

function updateRecBadge() {
  const badge = document.getElementById('rec-count-badge');
  if (badge) badge.textContent = ALL_RECS.filter(r=>r.p==='P0'||r.p==='P1').length;
}

// ══════════════════════════════════════════════════════════════
// WORKFLOWS
// ══════════════════════════════════════════════════════════════
const WORKFLOWS = [
  { icon:'🔄', name:'Demand-to-Supply Handoff', status:'pending', statusCls:'wf-pending',
    desc:'Demand Planning emits versioned forecast → Supply Planning consumes after human approval.',
    agents:['Demand Planning','Supply Planning'],
    meta:'Blocked — awaiting planner consensus approval and Material_ID crosswalk.' },
  { icon:'✅', name:'Data Quality Gate', status:'active', statusCls:'wf-active',
    desc:'Data Analytics validates source schema and quality before downstream agent consumption.',
    agents:['Data Analytics'],
    meta:'Running — synthetic fixture validation only.' },
  { icon:'🏗️', name:'Architecture Review', status:'active', statusCls:'wf-active',
    desc:'Enterprise Architecture assesses EOL exposure and standards compliance.',
    agents:['Enterprise Architecture'],
    meta:'Running — evidence from application_inventory.csv.' },
  { icon:'📚', name:'Knowledge Citation Eval', status:'active', statusCls:'wf-active',
    desc:'Knowledge Repository evaluates citation coverage against 95% golden-suite target.',
    agents:['Knowledge Repository'],
    meta:'Running — proxy evaluation from document_catalog.csv.' },
  { icon:'⚠️', name:'Variance Review — Winter Diesel', status:'pending', statusCls:'wf-pending',
    desc:'Cold-winter scenario exceeds 20% variance threshold. Planner review required before forecast is promoted.',
    agents:['Demand Planning'],
    meta:'Blocked — Demand Planner approval required.' },
  { icon:'🔒', name:'Finance KPI Activation', status:'blocked', statusCls:'wf-blocked',
    desc:'Revenue Growth Rate and EBITDA Margin require Finance source, formula and ownership approval.',
    agents:['Finance (outside MVP)'],
    meta:'Blocked — Finance data source not connected.' },
];

function renderWorkflows() {
  const grid = document.getElementById('workflow-grid');
  if (!grid) return;
  grid.innerHTML = WORKFLOWS.map(w=>`
    <div class="workflow-card">
      <div class="wf-header">
        <span class="wf-icon">${w.icon}</span>
        <span class="wf-name">${w.name}</span>
        <span class="wf-status-pill ${w.statusCls}">${w.status}</span>
      </div>
      <div class="wf-desc">${w.desc}</div>
      <div class="wf-agents">${w.agents.map(a=>`<span class="wf-agent-pill">${a}</span>`).join('')}</div>
      <div class="wf-meta">${w.meta}</div>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════════════
// CHART HELPERS
// ══════════════════════════════════════════════════════════════
function destroyChart(id) { const c = Chart.getChart(id); if (c) c.destroy(); }

function darkChart(yLabel) {
  return {
    responsive: true,
    plugins: { legend:{ display:false }, tooltip:{ backgroundColor:'rgba(10,14,26,.9)', titleColor:'#f1f5f9', bodyColor:'#cbd5e1' } },
    scales: { x: darkScaleX(), y: { ...darkScaleY(), title:{ display:true, text:yLabel, color:'#64748b', font:{size:10} } } }
  };
}
function darkScaleX() { return { grid:{color:'rgba(255,255,255,.05)'}, ticks:{color:'#64748b',font:{size:9},maxRotation:35} }; }
function darkScaleY() { return { grid:{color:'rgba(255,255,255,.05)'}, ticks:{color:'#64748b',font:{size:9}} }; }

// ══════════════════════════════════════════════════════════════
// UTILITIES
// ══════════════════════════════════════════════════════════════
function el(id) { return document.getElementById(id); }
function set(id, val) { const e = el(id); if (e) e.textContent = val; }
function removeEl(id) { const e = el(id); if (e) e.remove(); }

document.addEventListener('DOMContentLoaded', init);

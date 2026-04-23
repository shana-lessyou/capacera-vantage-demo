

// ─── ENVELOPE ────────────────────────────────────────────────────────────
var SM=4,SR=10,EB=2.4,BASE=6,bC=1.8,bE=3.1;
function pct(x){return Math.max(0,Math.min(100,((x-SM)/SR)*100))}
function renderEnv(fl,cl){
  var fp=pct(fl),bp=pct(BASE),cp=pct(cl);
  function g(id){return document.getElementById(id)}
  g('eC').style.left=fp+'%';g('eC').style.width=Math.max(0,bp-fp)+'%';
  g('eE').style.left=bp+'%';g('eE').style.width=Math.max(0,cp-bp)+'%';
  g('eBl').style.left='calc('+bp+'% - 1.5px)';
  g('eF').style.left='calc('+fp+'% - 1px)';
  g('eCl').style.left='calc('+cp+'% - 1px)';
  g('lF').style.left=fp+'%';g('lF').textContent=fl.toFixed(1)+'x';
  g('lB').style.left=bp+'%';g('lB').textContent=BASE.toFixed(1)+'x';
  g('lCl').style.left=cp+'%';g('lCl').textContent=cl.toFixed(1)+'x';
  var fEV=(fl*EB).toFixed(1),cEV=(cl*EB).toFixed(1),sp=((cl-fl)*EB).toFixed(1);
  g('evF').textContent='$'+fEV+'M';g('evCl').textContent='$'+cEV+'M';g('evSp').textContent='$'+sp+'M';
  g('m-floor').textContent=fl.toFixed(1)+'x';g('m-floor-ev').textContent='−'+((BASE-fl).toFixed(1))+'x · $'+fEV+'M EV';
  g('m-ceil').textContent=cl.toFixed(1)+'x';g('m-ceil-ev').textContent='+'+((cl-BASE).toFixed(1))+'x · $'+cEV+'M EV';
}
// renderEnv called in ghlReady below

// ─── SIMULATOR ────────────────────────────────────────────────────────────
var simData=[
  {id:'s1',name:'Rationalize application portfolio',owner:'Technology',domain:'cto',oc:'rgba(58,79,122,0.12)',otc:'#253561',c:0.4,e:0,det:'Removes −0.4x compression · floor rises to $11.1M'},
  {id:'s2',name:'Right-size cloud infrastructure',owner:'Technology',domain:'cto',oc:'rgba(58,79,122,0.12)',otc:'#253561',c:0.3,e:0,det:'Removes −0.3x compression · EBITDA uplift from waste'},
  {id:'s3',name:'Accelerate AI / automation',owner:'Tech + Ops',domain:'cto',oc:'rgba(58,79,122,0.12)',otc:'#253561',c:0,e:1.2,det:'Adds +1.2x expansion · ceiling to $24.7M'},
  {id:'s4',name:'Retain Vantage Partners + renewals',owner:'Revenue',domain:'cro',oc:'rgba(201,160,48,0.15)',otc:'#8a6b15',c:0.4,e:0,det:'Removes −0.4x compression · highest single ROI action'},
  {id:'s5',name:'Fix pricing model inefficiency',owner:'Revenue',domain:'cro',oc:'rgba(201,160,48,0.15)',otc:'#8a6b15',c:0,e:0.8,det:'Adds +0.8x expansion · ceiling to $22.7M'},
  {id:'s6',name:'Reduce key-person dependency',owner:'People',domain:'chro',oc:'rgba(100,100,100,0.1)',otc:'#4a4a4a',c:0.3,e:0,det:'Removes −0.3x compression · confidence score +9pts'},
  {id:'s7',name:'Implement governance controls',owner:'Financial',domain:'cfo',oc:'rgba(28,43,74,0.1)',otc:'#1C2B4A',c:0.3,e:0,det:'Removes −0.3x compression · SOC2 path enabled'},
];
var simFilter='',simDomain='all';

function buildSim(){
  var c=document.getElementById('simLevers');c.innerHTML='';
  simData.forEach(function(l){
    if(simFilter&&!l.name.toLowerCase().includes(simFilter)&&!l.owner.toLowerCase().includes(simFilter))return;
    var dim=simDomain!=='all'&&l.domain!==simDomain;
    var div=document.createElement('div');
    div.className='sim-lev';div.style.opacity=dim?'0.35':'1';
    div.innerHTML='<div class="sim-lev-info"><span class="sim-own-tag" style="background:'+l.oc+';color:'+l.otc+'">'+l.owner+'</span>'
      +'<div class="sim-lev-name">'+l.name+'</div>'
      +'<div class="sim-lev-det">'+l.det+'</div></div>'
      +'<label class="stog"><input type="checkbox" id="'+l.id+'" onchange="calcSim()"><div class="stog-tr"><div class="stog-th"></div></div></label>';
    c.appendChild(div);
  });
}

function filterSim(v){simFilter=v.toLowerCase();buildSim()}

function calcSim(){
  var cr=0,er=0;
  simData.forEach(function(l){var el=document.getElementById(l.id);if(el&&el.checked){cr+=l.c;er+=l.e}});
  var nf=Math.round((BASE-Math.max(0,bC-cr))*10)/10;
  var nc=Math.round((BASE+bE+er)*10)/10;
  document.getElementById('sr-floor').textContent='$'+(nf*EB).toFixed(1)+'M · '+nf.toFixed(1)+'x';
  document.getElementById('sr-ceil').textContent='$'+(nc*EB).toFixed(1)+'M · '+nc.toFixed(1)+'x';
  document.getElementById('sr-spread').textContent='$'+((nc-nf)*EB).toFixed(1)+'M';
  renderEnv(nf,nc);
}

function openSimTray(){document.getElementById('simTray').classList.add('open');document.getElementById('simOpenBtn').classList.add('tray-open')}
function closeSimTray(){document.getElementById('simTray').classList.remove('open');document.getElementById('simOpenBtn').classList.remove('tray-open')}
// buildSim called in ghlReady below

// ─── DATA ROOM COLLAPSE ────────────────────────────────────────────────────
function toggleDataRoom(){
  var panel=document.getElementById('dataroom-panel');
  var lbl=document.getElementById('drToggleLabel');
  panel.classList.toggle('expanded');
  lbl.textContent=panel.classList.contains('expanded')?'▴ collapse':'▾ expand';
}

// ─── SCENARIO SWITCHER ────────────────────────────────────────────────────
function setScenario(mode,btn){
  document.querySelectorAll('.s-tab').forEach(function(t){t.classList.remove('active')});btn.classList.add('active');
  var ddP=document.getElementById('dd-panel'),paP=document.getElementById('postacq-panel'),drP=document.getElementById('dataroom-panel');
  var dipTitle=document.getElementById('dip-title');
  var dipSub=document.getElementById('dip-subtitle');
  var dipLeader=document.getElementById('dip-leader-note');
  var dipDdNote=document.getElementById('dip-dd-note');
  if(mode==='macc'){
    ddP.style.display='block';paP.style.display='none';drP.style.display='block';
    document.getElementById('scen-name').textContent='Mid-Market SaaS Acquisition — Buy-Side View';
    document.getElementById('status-label').textContent='Buy-side diligence in progress';
    document.getElementById('m4-lbl').textContent='Assessment confidence';
    document.getElementById('m4-val').textContent='71%';document.getElementById('m4-val').className='mc-val cg';
    document.getElementById('m4-sub').textContent='4 unknowns flagged';
    // Decisions panel in buy-side = target company's decisions (DD signal)
    if(dipTitle)dipTitle.textContent='Target company · decisions in flight';
    if(dipSub)dipSub.textContent='Decisions the target team is actively working through — signals operational discipline and prioritization';
    if(dipLeader)dipLeader.textContent='DD signal';
    if(dipDdNote)dipDdNote.style.display='block';
  } else {
    ddP.style.display='none';paP.style.display='block';drP.style.display='none';
    document.getElementById('scen-name').textContent='Post-Acquisition Monitoring — 90 days post-close';
    document.getElementById('status-label').textContent='Active monitoring · post-close';
    document.getElementById('m4-lbl').textContent='Adviser coverage';
    document.getElementById('m4-val').textContent='All 5';document.getElementById('m4-val').className='mc-val cn';
    document.getElementById('m4-sub').textContent='Domains active and monitoring';
    // Decisions panel in monitoring = your team's active decisions
    if(dipTitle)dipTitle.textContent='Decisions in progress';
    if(dipSub)dipSub.textContent='Your team\'s active decisions — visible to all users and leadership for alignment and oversight';
    if(dipLeader)dipLeader.textContent='Leader view';
    if(dipDdNote)dipDdNote.style.display='none';
  }
}

// ─── CXO TABS ─────────────────────────────────────────────────────────────
var ALL_DOMS=['cto','cro','chro','cfo','coo'];
var DEC_MAP={cto:['dec-cto'],cro:['dec-cro'],chro:['dec-chro'],cfo:[],coo:[]};
var curTab='all';

function setTab(domain,btn){
  curTab=domain;
  document.querySelectorAll('.cxo-tab').forEach(function(t){t.classList.remove('active')});btn.classList.add('active');
  // domain sections
  ALL_DOMS.forEach(function(d){
    var el=document.getElementById('sec-'+d);
    if(el)el.classList.toggle('show',domain!=='all'&&d===domain);
  });
  document.getElementById('sec-all').classList.toggle('show',domain==='all');
  // decisions
  ['dec-cto','dec-cro','dec-chro'].forEach(function(id){
    var el=document.getElementById(id);if(!el)return;
    var show=domain==='all'||(DEC_MAP[domain]&&DEC_MAP[domain].includes(id));
    el.style.display=show?'block':'none';
  });
  // fr-grid highlight
  document.querySelectorAll('.fr-card').forEach(function(c){
    c.style.opacity=(domain==='all'||c.dataset.domain===domain)?'1':'0.35';
  });
  // guided trigger (only tech tab)
  document.getElementById('guided-trigger').style.display=(domain==='cto')?'block':'none';
  // sim tray domain filter
  simDomain=domain;buildSim();
}

// ─── DOMAIN DATA TABLES ───────────────────────────────────────────────────
var ctoApps=[
  {name:'HubSpot CRM',type:'CRM',cost:'$890',status:'Active',flag:''},
  {name:'Salesforce Classic',type:'CRM',cost:'$1,200',status:'Redundant',flag:'redundant'},
  {name:'Redshift',type:'Data Warehouse',cost:'$3,800',status:'Active',flag:'18% utilisation'},
  {name:'Looker',type:'BI / Analytics',cost:'$2,100',status:'Active',flag:''},
  {name:'Jira',type:'Project Mgmt',cost:'$340',status:'Active',flag:''},
  {name:'Asana',type:'Project Mgmt',cost:'$280',status:'Redundant',flag:'redundant'},
  {name:'QuickBooks',type:'Finance',cost:'$450',status:'Active',flag:''},
  {name:'Workday',type:'HRIS',cost:'$1,100',status:'Active',flag:''},
  {name:'Zendesk',type:'Customer Support',cost:'$780',status:'Active',flag:''},
  {name:'Zapier',type:'Automation',cost:'$560',status:'Active',flag:''},
  {name:'Custom Billing',type:'Billing',cost:'$2,400',status:'Legacy',flag:'no vendor support'},
  {name:'Dev Sandbox',type:'Infrastructure',cost:'$1,890',status:'Orphaned',flag:'orphaned'},
  {name:'Slack',type:'Communications',cost:'$1,100',status:'Active',flag:''},
  {name:'Notion',type:'Documentation',cost:'$220',status:'Active',flag:''},
];

var croAccounts=[
  {name:'Vantage Partners',arr:'$1.65M',health:19,logins:0,tickets:5,renewal:'9 days',risk:'Critical'},
  {name:'Meridian Financial',arr:'$820K',health:31,logins:4,tickets:3,renewal:'23 days',risk:'High'},
  {name:'Apex Logistics',arr:'$580K',health:44,logins:12,tickets:1,renewal:'38 days',risk:'Medium'},
  {name:'Clearwater Group',arr:'$1.1M',health:52,logins:18,tickets:2,renewal:'74 days',risk:'Medium'},
  {name:'Pinnacle Health',arr:'$750K',health:61,logins:24,tickets:0,renewal:'110 days',risk:'Low'},
  {name:'Redwood Capital',arr:'$900K',health:68,logins:31,tickets:1,renewal:'145 days',risk:'Low'},
  {name:'Summit Analytics',arr:'$640K',health:72,logins:38,tickets:0,renewal:'180 days',risk:'Low'},
  {name:'Horizon Ventures',arr:'$480K',health:79,logins:42,tickets:0,renewal:'210 days',risk:'Low'},
  {name:'Orion Systems',arr:'$920K',health:83,logins:55,tickets:0,renewal:'255 days',risk:'Low'},
  {name:'Bluewave Tech',arr:'$1.2M',health:87,logins:61,tickets:0,renewal:'300 days',risk:'Low'},
  {name:'Kestrel Partners',arr:'$560K',health:91,logins:70,tickets:0,renewal:'330 days',risk:'Low'},
  {name:'Altitude Corp',arr:'$400K',health:94,logins:82,tickets:0,renewal:'365 days',risk:'Low'},
];

var chroRoster=[
  {role:'Lead Engineer',tenure:'3.2 yrs',gap:'−22%',contact:'6 weeks ago',succession:'None',risk:'Critical'},
  {role:'Backend Engineer Sr.',tenure:'1.8 yrs',gap:'−18%',contact:'3 weeks ago',succession:'None',risk:'Critical'},
  {role:'DevOps Lead',tenure:'2.1 yrs',gap:'−14%',contact:'—',succession:'None',risk:'High'},
  {role:'CTO',tenure:'5.1 yrs',gap:'−8%',contact:'2 months ago',succession:'None',risk:'Medium'},
  {role:'CFO',tenure:'3.8 yrs',gap:'−5%',contact:'—',succession:'None',risk:'Medium'},
  {role:'Product Manager',tenure:'4.5 yrs',gap:'+2%',contact:'—',succession:'Named',risk:'Low'},
];

var cfoKPIs=[
  {metric:'Days to close (monthly books)',current:'12 days',bench:'≤5 days',status:'High risk',ev:'−0.15x'},
  {metric:'Forecast accuracy',current:'71%',bench:'≥85%',status:'Below benchmark',ev:'−0.10x'},
  {metric:'Revenue concentration (top 3)',current:'24%',bench:'<15%',status:'Concentrated',ev:'−0.15x'},
  {metric:'Gross margin',current:'78%',bench:'75–80%',status:'In range',ev:'Neutral'},
  {metric:'EBITDA margin',current:'20%',bench:'18–25%',status:'In range',ev:'Neutral'},
  {metric:'Cash conversion cycle',current:'45 days',bench:'≤30 days',status:'Above benchmark',ev:'−0.10x'},
  {metric:'KPI governance maturity',current:'Low',bench:'Medium+',status:'Flagged',ev:'−0.10x'},
];

var cooProcesses=[
  {workflow:'Customer onboarding',auto:'15%',manual:'8.5',roi:'High',owner:'COO / CTO'},
  {workflow:'Invoice reconciliation',auto:'0%',manual:'6.0',roi:'High',owner:'CFO / COO'},
  {workflow:'Renewal reminders',auto:'40%',manual:'3.2',roi:'High',owner:'CRO'},
  {workflow:'Support ticket triage',auto:'25%',manual:'4.8',roi:'Medium',owner:'COO'},
  {workflow:'Financial reporting',auto:'10%',manual:'12.0',roi:'High',owner:'CFO'},
  {workflow:'Employee onboarding',auto:'30%',manual:'5.5',roi:'Medium',owner:'CHRO'},
  {workflow:'Contract approvals',auto:'0%',manual:'3.8',roi:'Medium',owner:'CFO / Legal'},
];

function hc(h){return h<35?'var(--dng)':h<55?'#c0802a':h<70?'#8ab040':'var(--suc)'}
function rc(r){return{Critical:'r-crit',High:'r-high',Medium:'r-med',Low:'r-low'}[r]||'r-low'}
function flagHtml(f){if(!f)return'<span style="color:var(--tmu);font-size:11px">—</span>';return'<span class="r-flag">⚑ '+f+'</span>'}
function statusHtml(s,bench,curr){
  var ok=s==='In range'||s==='Named';
  return'<span class="'+(ok?'r-ok':'r-flag')+'">'+s+'</span>';
}
function roiHtml(r){var c=r==='High'?'var(--suc)':r==='Medium'?'var(--wrn)':'var(--tmu)';return'<span style="font-size:11px;font-weight:500;color:'+c+'">'+r+'</span>'}

function renderCTO(){
  var tbody=document.getElementById('cto-body');
  if(!tbody)return;
  tbody.innerHTML=ctoApps.map(function(a){
    var sBg={Active:'',Redundant:'background:rgba(184,48,48,0.04)',Orphaned:'background:rgba(201,160,48,0.06)',Legacy:'background:rgba(184,48,48,0.04)'}[a.status]||'';
    var sc={Active:'r-ok',Redundant:'r-crit',Orphaned:'r-high',Legacy:'r-med'}[a.status]||'r-ok';
    return'<tr style="'+sBg+'"><td style="font-weight:500">'+a.name+'</td><td style="color:var(--tmu)">'+a.type+'</td><td>'+a.cost+'</td><td><span class="rpill '+sc+'">'+a.status+'</span></td><td>'+flagHtml(a.flag)+'</td></tr>';
  }).join('');
  document.getElementById('cto-count').textContent=ctoApps.length+' applications · $17,110/mo total spend';
}

function renderCRO(){
  var tbody=document.getElementById('cro-body');
  if(!tbody)return;
  tbody.innerHTML=croAccounts.map(function(a){
    var hColor=hc(a.health);
    var renStyle=parseInt(a.renewal)<45?'color:var(--dng);font-weight:500':'';
    return'<tr><td style="font-weight:500">'+a.name+'</td><td>'+a.arr+'</td>'
      +'<td><div class="hbw"><div class="hb-bg"><div class="hb-f" style="width:'+a.health+'%;background:'+hColor+'"></div></div><span style="font-size:11px;color:'+hColor+';font-weight:500;min-width:22px">'+a.health+'</span></div></td>'
      +'<td>'+a.logins+'</td><td>'+a.tickets+'</td>'
      +'<td style="'+renStyle+'">'+a.renewal+'</td>'
      +'<td><span class="rpill '+rc(a.risk)+'">'+a.risk+'</span></td></tr>';
  }).join('');
}

function renderCHRO(){
  var tbody=document.getElementById('chro-body');
  if(!tbody)return;
  tbody.innerHTML=chroRoster.map(function(r){
    var gColor=r.gap.startsWith('-')?'var(--dng)':r.gap==='+2%'?'var(--suc)':'var(--wrn)';
    return'<tr><td style="font-weight:500">'+r.role+'</td><td>'+r.tenure+'</td>'
      +'<td style="color:'+gColor+';font-weight:500">'+r.gap+'</td>'
      +'<td style="'+(r.contact!=='—'?'color:var(--dng)':'color:var(--tmu)')+'">'+r.contact+'</td>'
      +'<td><span class="rpill '+(r.succession==='Named'?'r-ok':'r-crit')+'">'+r.succession+'</span></td>'
      +'<td><span class="rpill '+rc(r.risk)+'">'+r.risk+'</span></td></tr>';
  }).join('');
}

function renderCFO(){
  var tbody=document.getElementById('cfo-body');
  if(!tbody)return;
  tbody.innerHTML=cfoKPIs.map(function(k){
    var ok=k.status==='In range';
    return'<tr><td style="font-weight:500">'+k.metric+'</td><td>'+k.current+'</td><td style="color:var(--tmu)">'+k.bench+'</td>'
      +'<td><span class="rpill '+(ok?'r-ok':'r-flag')+'">'+k.status+'</span></td>'
      +'<td style="font-weight:500;color:'+(k.ev==='Neutral'?'var(--tmu)':'var(--dng)')+'">'+k.ev+'</td></tr>';
  }).join('');
}

function renderCOO(){
  var tbody=document.getElementById('coo-body');
  if(!tbody)return;
  tbody.innerHTML=cooProcesses.map(function(p){
    var autoPct=parseInt(p.auto);
    var aColor=autoPct<20?'var(--dng)':autoPct<50?'var(--wrn)':'var(--suc)';
    return'<tr><td style="font-weight:500">'+p.workflow+'</td>'
      +'<td><span style="color:'+aColor+';font-weight:500">'+p.auto+'</span></td>'
      +'<td>'+p.manual+' hrs</td>'
      +'<td>'+roiHtml(p.roi)+'</td>'
      +'<td style="font-size:11px;color:var(--tmu)">'+p.owner+'</td></tr>';
  }).join('');
}

function filterDT(tableId,val){
  var tbody=document.getElementById(tableId);
  if(!tbody)return;
  var v=val.toLowerCase();
  Array.from(tbody.querySelectorAll('tr')).forEach(function(tr){
    tr.style.display=!v||tr.textContent.toLowerCase().includes(v)?'':'none';
  });
}
function filterDTSel(tableId,type,val){
  var tbody=document.getElementById(tableId);
  if(!tbody||!val)return;
  Array.from(tbody.querySelectorAll('tr')).forEach(function(tr){
    tr.style.display=!val||tr.textContent.includes(val)?'':'none';
  });
}

// renderCTO/CRO/CHRO/CFO/COO/DecisionsPanel all called in ghlReady below

// ─── ADVISER ──────────────────────────────────────────────────────────────
var advConfig={
  cto:{title:'Technology Adviser',domain:'Enterprise Architecture · Cloud · Applications',
    init:[{role:'adv',text:'Technology health loaded from live cloud and application integrations. I\'ve analysed cloud spend patterns, application inventory, and architecture maturity.',
      data:[{l:'Cloud waste',v:'$9,100/mo · 41% of spend'},{l:'Orphaned services',v:'3 confirmed · Redshift at 18% util.'},{l:'Redundant apps',v:'4 flagged · $180K annual overlap'},{l:'Architecture rating',v:'Fragmented · Complex · 3.4/5'},{l:'EV compression',v:'−0.6x · largest single driver'}]}],
    suggestions:['What is driving the most architecture compression?','Which cloud waste can we eliminate in 30 days?','How does our tech stack compare to SaaS benchmarks?','Walk me through the application replacement scenario']},
  cro:{title:'Revenue Adviser',domain:'Customer Health · Renewal Risk · Pricing',
    init:[{role:'adv',text:'Revenue signals loaded from Salesforce integration. 12 accounts active. 3 renewals in the critical window.',
      data:[{l:'ARR at risk ≤45 days',v:'$3.05M · 3 accounts'},{l:'Most urgent',v:'Vantage Partners · 9 days · score 19'},{l:'Est. churn exposure',v:'$763K · 25% model'},{l:'Revenue rating',v:'Concentrated · At-Risk · 3.8/5'},{l:'Expansion opportunity',v:'+0.6x · pricing inefficiency'}]}],
    suggestions:['What is our actual churn risk next quarter?','What is the fastest action to protect Vantage Partners?','How does revenue concentration affect our multiple?','Which customers are most likely to expand vs. churn?']},
  chro:{title:'People Adviser',domain:'Talent Stability · Leadership Risk · Compensation',
    init:[{role:'adv',text:'People signals loaded from BambooHR integration. Cross-referenced with technology and financial domains for compounding risk analysis.',
      data:[{l:'Roles below market rate',v:'3 · Lead Eng, Sr. Backend, DevOps'},{l:'Recruiter contact (90d)',v:'2 of 3 at-risk roles contacted'},{l:'Succession gaps',v:'Tech and Financial leadership'},{l:'People rating',v:'Dependent · Transitional · 3.1/5'},{l:'EV compression',v:'−0.3x · key-person dependency'}]}],
    suggestions:['Are we at risk of losing key technology talent?','Which roles carry the highest retention risk right now?','What would a leadership departure cost in EV terms?','How do we address succession without triggering departures?']},
  cfo:{title:'Financial Adviser',domain:'Governance · Controls · Financial Integrity',
    init:[{role:'adv',text:'Financial Physical not yet complete — cross-domain signals loaded. Full scoring available after QuickBooks 24-month export is approved by the CFO.',
      data:[{l:'Governance risk',v:'Estimated from cross-domain signals'},{l:'SOC2 status',v:'Type I in progress · Type II Phase 2'},{l:'KPI governance',v:'Flagged — non-standard definitions'},{l:'Data room grade',v:'B+ · completeness 82% · recency 68%'},{l:'EV compression',v:'−0.3x · governance gaps'}]}],
    suggestions:['What governance gaps are most visible in diligence?','How does our SOC2 timeline affect enterprise readiness?','What is the financial impact of the Vantage Partners churn risk?','Which financial KPIs will the Financial Physical score?']},
  coo:{title:'Operations Adviser',domain:'Process Efficiency · Automation · Program Execution',
    init:[{role:'adv',text:'Operations signals estimated from cross-domain data. The Process Physical launches Q2 2026 for full scored assessment — current view is indicative.',
      data:[{l:'Automation coverage',v:'~22% estimated · below SaaS median (38%)'},{l:'Manual workflow exposure',v:'7 workflows · 43.8 hrs/wk total'},{l:'Highest ROI target',v:'Financial reporting · 12 hrs/wk · High ROI'},{l:'Automation opportunity',v:'+0.8x expansion · second largest lever'},{l:'Process Physical',v:'Q2 2026 · full scored assessment'}]}],
    suggestions:['Which workflows have the highest automation ROI?','How does our automation compare to SaaS benchmarks?','What does the Process Physical cover that this view doesn\'t?','What is the ops team\'s role in the AI adoption initiative?']},
};

var cxoResponses={
  cto:{
    'What is driving the most architecture compression?':'Systems fragmentation is the primary driver at −0.6x. Four redundant applications are creating $180K in annual licensing waste and doubling the integration surface area. The Redshift cluster is the most urgent single point — running at 18% utilisation and directly linked to the Vantage Partners login drop. Recommend starting there.',
    'Which cloud waste can we eliminate in 30 days?':'Three orphaned services can be terminated immediately — combined $3,200/mo, zero downstream dependencies confirmed. Redshift right-sizing requires a 2-week engineering window — $4,800/mo savings. Total 30-day achievable: ~$8K/mo reduction, annualised to $96K.',
    'default':'Based on the Technology Physical data, architecture risk is driven by fragmentation across 14 applications, 41% cloud waste, and zero ML in production. The +1.2x AI utilization gap is the largest single value lever available. What would you like to explore first?',
  },
  cro:{
    'What is our actual churn risk next quarter?':'Modelling health scores against historical patterns: Vantage Partners ($1.65M) is 87% likely to churn without intervention in 9 days. Meridian Financial ($820K) is 62% likely. Apex Logistics ($580K) is 34% likely. Expected churn at current trajectory: $1.85–2.1M ARR. This question benefits from Technology cross-validation on the product fix timeline.',
    'What is the fastest action to protect Vantage Partners?':'Two parallel actions with the highest combined probability: (1) Technology team patches the Redshift latency issue — root cause of the zero-login pattern — within 7 days. (2) CSM schedules an executive call this week with the fix timeline in hand. A credible technical resolution plus executive attention has the highest probability of securing the renewal.',
    'default':'Revenue signals show $3.05M ARR at risk across 3 accounts ≤45 days. The pattern points to product friction, not relationship failure — a technical fix has higher impact than a discount or relationship play. What do you want to dig into?',
  },
  chro:{
    'Are we at risk of losing key technology talent?':'High risk confirmed. Three engineering roles are 14–22% below market. Two have had recruiter contact in the past 90 days. All three are on the Redshift remediation team — the same critical path as the Vantage Partners renewal. Technology, People, and Financial signals all point to the same compounding risk.',
    'default':'People assessment shows 3 roles at elevated flight risk, succession gaps in technology and financial leadership, and a compensation correction need of $120–150K annually. Retention ROI vs. replacement cost is 3–4x in favour of acting now. What aspect would you like to explore?',
  },
  cfo:{
    'default':'Financial assessment is partially loaded pending the Q3 2026 Financial Physical. Cross-domain signals show governance risk at approximately 2.8/5 — primarily KPI definition inconsistency and absent SOC2 documentation. The Financial Physical will add financial integrity, reporting latency, and EBITDA normalisation scoring. What can I help you think through with the current signals?',
  },
  coo:{
    'Which workflows have the highest automation ROI?':'Three workflows stand out: (1) Financial reporting — 12 hrs/wk manual, fully automatable with existing QuickBooks integration, High ROI. (2) Customer onboarding — 8.5 hrs/wk, currently 15% automated, High ROI. (3) Invoice reconciliation — 6 hrs/wk, zero automation currently, straightforward integration available. Combined estimated saving: 26+ hours/week operational capacity.',
    'default':'Operations signals show automation coverage at approximately 22% — well below the SaaS median of 38%. The automation deficit is a +0.8x expansion opportunity. The Process Physical launching Q2 2026 gives a full scored breakdown by workflow. What would you like to explore?',
  },
};

// ─── DECISIONS IN PROGRESS STATE ─────────────────────────────────────────
var decisionsInProgress=[
  // Pre-seeded example for monitoring view
  {id:'d1',domain:'cro',domainLabel:'Revenue',title:'Renewal process restructuring',status:'analysis',owner:'Sarah K. (CRO)',lastActivity:'Mar 3, 2026',evImpact:'+0.4x',context:'Evaluating formal 90-day renewal motion. Vantage Partners (9 days) is the immediate trigger. CSM capacity gap identified as constraint.'},
  {id:'d2',domain:'cto',domainLabel:'Technology',title:'Application portfolio rationalization',status:'exploring',owner:'Marcus L. (CTO)',lastActivity:'Feb 28, 2026',evImpact:'+0.4x',context:'Technology Adviser guided scenario completed. Business case and project plan exported. Awaiting CFO review before approval.'},
];

function renderDecisionsPanel(){
  var container=document.getElementById('dip-rows');
  if(!container)return;
  var domainColors={cto:'rgba(58,79,122,0.12)',cro:'rgba(201,160,48,0.15)',chro:'rgba(100,100,100,0.1)',cfo:'rgba(28,43,74,0.1)',coo:'rgba(140,100,20,0.12)'};
  var domainTextColors={cto:'#253561',cro:'#8a6b15',chro:'#4a4a4a',cfo:'#1C2B4A',coo:'#7a5510'};
  var statusLabel={'exploring':'Exploring','analysis':'Analysis complete','approved':'Approved','project':'Project in flight','closed':'Closed'};
  var statusClass={'exploring':'ds-exploring','analysis':'ds-analysis','approved':'ds-approved','project':'ds-project','closed':'ds-closed'};
  if(decisionsInProgress.length===0){
    container.innerHTML='<div class="dip-empty">No decisions in progress yet. When your team explores a decision through any adviser, you\'ll be prompted to save it here.</div>';
    return;
  }
  container.innerHTML='<div class="dip-rows">'+decisionsInProgress.map(function(d){
    var dc=domainColors[d.domain]||'rgba(100,100,100,0.1)';
    var dtc=domainTextColors[d.domain]||'#4a4a4a';
    var sc=statusClass[d.status]||'ds-exploring';
    var sl=statusLabel[d.status]||d.status;
    return'<div class="dip-row">'
      +'<div class="dip-row-left">'
        +'<span class="dip-domain-tag" style="background:'+dc+';color:'+dtc+'">'+d.domainLabel+'</span>'
        +'<div class="dip-content">'
          +'<div class="dip-title">'+d.title+'</div>'
          +'<div class="dip-meta">'+d.owner+' · Last activity: '+d.lastActivity+' · EV potential: '+d.evImpact+'</div>'
          +'<div class="dip-meta" style="margin-top:3px;font-style:italic">'+d.context+'</div>'
        +'</div>'
      +'</div>'
      +'<div class="dip-row-right">'
        +'<span class="dip-status '+sc+'">'+sl+'</span>'
        +(d.status!=='closed'&&d.status!=='project'?'<button class="dip-resume-btn" onclick="resumeDecision(\''+d.id+'\')">Resume →</button>':'')
        +'<button class="dip-add-note" onclick="addLeaderNote(\''+d.id+'\')">+ Note</button>'
      +'</div>'
    +'</div>';
  }).join('')+'</div>';
}

function resumeDecision(id){
  var d=decisionsInProgress.find(function(x){return x.id===id});
  if(!d)return;
  openAdviser(d.domain);
  setTimeout(function(){
    appendMsg({role:'adv',text:'Resuming your decision: "'+d.title+'". Here\'s where we left off:\n\n'+d.context+'\n\nWhat would you like to explore next?'});
  },500);
}

function addLeaderNote(id){
  var note=prompt('Add a leadership note to this decision (visible to all team members):');
  if(!note||!note.trim())return;
  var d=decisionsInProgress.find(function(x){return x.id===id});
  if(d)d.context+='\n\nLeadership note: '+note.trim();
  renderDecisionsPanel();
}

function saveAsDecision(title,status,context){
  var newId='d'+(decisionsInProgress.length+1+Math.floor(Math.random()*100));
  var domainLabels={cto:'Technology',cro:'Revenue',chro:'People',cfo:'Financial',coo:'Operations'};
  decisionsInProgress.unshift({
    id:newId,domain:curDomain,domainLabel:domainLabels[curDomain]||curDomain,
    title:title,status:status,owner:'You (current session)',
    lastActivity:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}),
    evImpact:'TBD',context:context
  });
  renderDecisionsPanel();
}

// Decision save prompt — shown after 3+ adviser exchanges
var advExchangeCount=0;
var savePromptShown=false;

function maybeShowSavePrompt(){
  if(savePromptShown||guidedState.active)return;
  advExchangeCount++;
  if(advExchangeCount>=3){
    savePromptShown=true;
    setTimeout(function(){showSaveDecisionPrompt()},1200);
  }
}

function showSaveDecisionPrompt(){
  var msgs=document.getElementById('advMsgs');
  var wrap=document.createElement('div');wrap.className='msg adv';
  var bub=document.createElement('div');bub.className='msg-bub';
  var domainLabels={cto:'Technology',cro:'Revenue',chro:'People',cfo:'Financial',coo:'Operations'};
  bub.textContent='You\'ve been exploring a decision in the '+domainLabels[curDomain]+' domain. Should I save this as a decision in progress?';
  wrap.appendChild(bub);
  var prompt=document.createElement('div');
  prompt.className='save-prompt';
  prompt.style.marginTop='5px';
  prompt.innerHTML='<div class="save-prompt-t">Save to Decisions in Progress?</div>'
    +'<div class="save-prompt-s">Your leadership team will see it\'s being explored — and any adviser can pick it back up with full context next time, even if you close this session.</div>'
    +'<div class="save-prompt-btns">'
      +'<button class="sp-btn sp-save" onclick="confirmSaveDecision(\'exploring\',this.closest(\'.msg\'))">Save as exploring</button>'
      +'<button class="sp-btn sp-project" onclick="confirmSaveDecision(\'approved\',this.closest(\'.msg\'))">Save as approved for implementation</button>'
      +'<button class="sp-btn sp-skip" onclick="this.closest(\'.msg\').remove()">Not yet</button>'
    +'</div>';
  wrap.appendChild(prompt);
  var meta=document.createElement('div');meta.className='msg-meta';
  meta.textContent=advConfig[curDomain]?advConfig[curDomain].title:'Adviser';
  wrap.appendChild(meta);
  msgs.appendChild(wrap);msgs.scrollTop=msgs.scrollHeight;
}

function confirmSaveDecision(status,msgEl){
  var domainTitles={cto:'Application portfolio rationalization',cro:'Customer renewal strategy',chro:'Leadership succession planning',cfo:'Governance and controls improvement',coo:'Process automation initiative'};
  var title=domainTitles[curDomain]||'Decision in progress';
  var context='Started via '+advConfig[curDomain].title+'. Context and exchange history captured.';
  saveAsDecision(title,status,context);
  if(msgEl)msgEl.remove();
  appendMsg({role:'adv',text:'Saved. This decision is now visible to your leadership team in the Decisions in Progress panel on the dashboard. Any adviser can resume it with full context. What would you like to explore next?'});
}

// ─── INSUFFICIENT INFO PATTERN ───────────────────────────────────────────
// When the adviser doesn't have enough data, it walks the user through how to GET it.
var dataAcquisitionGuides={
  cfo:{
    'forecast accuracy':{
      what:'Forecast vs. actual data for the last 12 months',
      where:'QuickBooks (financial reporting module) or NetSuite',
      who:'CFO or Controller',
      steps:['Export revenue forecast vs. actual from QuickBooks → Reports → Custom Reports','Filter by month for the last 12 months, export as CSV','Import to Vantage via Financial data intake (Settings → Data Sources → Finance)'],
      email:{to:'CFO / Controller',subject:'Request: Forecast vs. actual export for Financial Physical',body:'Hi [Name],\n\nI\'m working through the Financial Physical assessment in Vantage and need a 12-month forecast vs. actual export from QuickBooks to complete the forecast accuracy scoring.\n\nCould you export: Revenue forecast vs. actual, monthly, for the past 12 months (CSV format)?\n\nThis will help us identify any KPI governance gaps before our next board review.\n\nThanks,\n[Your name]'}
    },
    'days to close':{
      what:'Monthly close cycle duration for the last 12 months',
      where:'QuickBooks or NetSuite (accounting close dates)',
      who:'Controller or accounting team',
      steps:['Pull the date of each month-end close from QuickBooks audit log','Compare to the last business day of each month','Calculate days delta per month'],
      email:{to:'Controller',subject:'Request: Monthly close dates for Financial Physical',body:'Hi [Name],\n\nFor our Financial Physical assessment, I need the actual close date for each month in the last 12 months — just the date you marked books as closed each month.\n\nA quick table or even a list of dates would be perfect.\n\nThanks,\n[Your name]'}
    },
    'default':{
      what:'Financial data for this metric',
      where:'QuickBooks · NetSuite · your ERP system',
      who:'CFO, Controller, or Finance team',
      steps:['Identify which financial system holds this data','Export the relevant report as CSV','Import to Vantage via Settings → Data Sources → Finance'],
      email:{to:'CFO / Finance team',subject:'Request: Data for Financial Physical assessment',body:'Hi [Name],\n\nI\'m completing the Financial Physical in Vantage and need [specific data]. Could you share a quick export?\n\nHappy to set up a 15-minute call if it\'s easier to walk through it together.\n\nThanks,\n[Your name]'}
    }
  },
  chro:{
    'compensation benchmark':{
      what:'Current salary by role vs. market benchmark',
      where:'BambooHR compensation module, or HR consultant benchmarking data (Radford, Mercer, Levels.fyi for tech)',
      who:'CHRO or HR Business Partner',
      steps:['Export current compensation by role from BambooHR → Reports → Compensation','Pull matching market benchmarks from Radford, Mercer, or Levels.fyi for tech roles','Import to Vantage via Settings → Data Sources → HRIS'],
      email:{to:'CHRO / HRBP',subject:'Request: Compensation benchmarking data for People Physical',body:'Hi [Name],\n\nFor the People Physical in Vantage, I need current salaries by role alongside market benchmark data.\n\nIf BambooHR has this, a report export would be great. If not, can we use our last benchmarking study from [Radford/Mercer/other]?\n\nI\'d also like to schedule 20 minutes to review the at-risk role list — some of these have implications for our Vantage Partners situation.\n\nThanks,\n[Your name]'}
    },
    'default':{
      what:'People data for this analysis',
      where:'BambooHR · your HRIS · HR consultant reports',
      who:'CHRO or HR Business Partner',
      steps:['Identify the data in your HRIS','Export as CSV or connect via BambooHR integration in Vantage (Settings → Data Sources → HRIS)','Re-run the People Physical with updated data'],
      email:{to:'CHRO / HR team',subject:'Request: HR data for People Physical assessment',body:'Hi [Name],\n\nI need [specific people data] to complete the People Physical analysis in Vantage. Could you pull a quick export?\n\nAlternatively, I can set up the BambooHR integration to pull this automatically — happy to walk through setup together.\n\nThanks,\n[Your name]'}
    }
  },
  cto:{
    'vendor pricing':{
      what:'Current contract pricing for applications under review',
      where:'Your procurement/finance system, or direct vendor contracts',
      who:'Procurement, Finance, or the vendor directly',
      steps:['Pull contract values from QuickBooks (vendor payments) or ask procurement for the contract database','Cross-reference with AWS Cost Explorer for cloud spend (already integrated)','For SaaS tools, check vendor invoice in email or accounting system'],
      email:{to:'Procurement / Finance',subject:'Request: Application contract pricing for Technology Physical',body:'Hi [Name],\n\nFor the Technology Physical in Vantage, I\'m auditing application spend across 14 tools. I have AWS costs from Cost Explorer, but I need the annual contract values for the SaaS tools.\n\nCould you pull a vendor payment summary from QuickBooks for the last 12 months? Or share access to the contract database?\n\nThanks,\n[Your name]'}
    },
    'default':{
      what:'Technology data for this analysis',
      where:'AWS Cost Explorer (already connected) · vendor contracts · your ITSM or asset management system',
      who:'Technology lead, DevOps, or Finance for contract data',
      steps:['Check if the data is available in AWS Cost Explorer (already integrated)','For application-specific data, export from your ITSM or asset management tool','Import additional data via Settings → Data Sources → Technology'],
      email:{to:'Technology / Finance team',subject:'Request: Technology data for assessment',body:'Hi [Name],\n\nI\'m working through the Technology Physical in Vantage and need [specific data]. Could you help me pull this?\n\nIf you have access to [specific system], a quick export would be ideal. Happy to set up a 15-min call to walk through it.\n\nThanks,\n[Your name]'}
    }
  },
  coo:{
    'process timing':{
      what:'Time-per-task data for the workflows under review',
      where:'Your project management tool (Jira/Asana/ClickUp) or time-tracking system',
      who:'Operations lead or process owners for each workflow',
      steps:['Export time logs from Jira/Asana/ClickUp for the workflows flagged','If no time tracking, run a 2-week spot measurement — ask workflow owners to log time on each task','Import results to Vantage via Settings → Data Sources → Operations'],
      email:{to:'Operations team / Process owners',subject:'Request: Process timing data for Operations assessment',body:'Hi [Name],\n\nFor the Operations assessment in Vantage, I need time estimates for 7 workflows — specifically how many manual hours per week each takes.\n\nCould you ask the process owners for each workflow to estimate: (1) how many people touch it weekly, (2) roughly how many hours each?\n\nIf we have time tracking in [Jira/Asana], I can pull it directly — just point me to the right project.\n\nThanks,\n[Your name]'}
    },
    'default':{
      what:'Operational process data',
      where:'Jira · Asana · ClickUp · your project management or time tracking system',
      who:'Operations lead or department process owners',
      steps:['Identify which processes are tracked in your PM system','Export time logs or task completion data','Import to Vantage via Settings → Data Sources → Operations'],
      email:{to:'Operations / Process owners',subject:'Request: Operations data for Process assessment',body:'Hi [Name],\n\nI\'m completing the Operations Physical in Vantage and need data on [specific workflows]. Could you help me gather this?\n\nA quick export from [Jira/Asana/other] or a brief conversation with process owners would be perfect.\n\nThanks,\n[Your name]'}
    }
  },
  cro:{
    'pipeline data':{
      what:'CRM pipeline data — stage, value, close probability, age',
      where:'Salesforce or HubSpot (partially integrated)',
      who:'CRO or RevOps',
      steps:['Check if Salesforce pipeline report is already flowing through the CRM integration','If not: Salesforce → Reports → Pipeline Report → Export CSV','Import to Vantage via Settings → Data Sources → CRM · Revenue'],
      email:{to:'CRO / RevOps',subject:'Request: Pipeline data for Revenue Physical',body:'Hi [Name],\n\nFor the Revenue Physical in Vantage, I need current pipeline data — stage, value, close probability, and deal age.\n\nCan you confirm the Salesforce integration is pushing pipeline data, or pull a quick pipeline report export? The integration is already configured — it may just need the pipeline field mapping completed.\n\nThanks,\n[Your name]'}
    },
    'default':{
      what:'Revenue data for this analysis',
      where:'Salesforce · HubSpot · your CRM system (integration already configured)',
      who:'CRO, RevOps, or CSM team',
      steps:['Check CRM integration status in Vantage (Settings → Data Sources → CRM)','If data isn\'t flowing, complete the field mapping setup','For manual data: export from Salesforce → Reports and import to Vantage'],
      email:{to:'CRO / RevOps team',subject:'Request: CRM data for Revenue Physical',body:'Hi [Name],\n\nThe Revenue Physical in Vantage needs [specific data] and our CRM integration may not be fully mapped yet.\n\nCould you review the Salesforce integration (Settings → Data Sources) and confirm the field mapping is complete? Or pull a manual export?\n\nThanks,\n[Your name]'}
    }
  }
};

function getDataAcquisitionGuide(domain,question){
  var guides=dataAcquisitionGuides[domain];
  if(!guides)return null;
  var q=question.toLowerCase();
  for(var key in guides){
    if(key!=='default'&&q.includes(key))return guides[key];
  }
  return guides['default']||null;
}

function isInsufficientInfoQuestion(question){
  var markers=['how much','what is the exact','do we have data on','what are our actual','I don\'t see','where can I find','what data do we need','can you pull','can you show me the actual'];
  var q=question.toLowerCase();
  return markers.some(function(m){return q.includes(m)});
}

function renderDataAcqBlock(guide,domain){
  if(!guide)return'';
  var stepsHtml=guide.steps.map(function(s,i){return'<div class="da-row"><div class="da-icon" style="color:var(--navy);font-weight:600">'+(i+1)+'</div><div class="da-content"><div class="da-detail">'+s+'</div></div></div>'}).join('');
  return'<div class="data-acq">'
    +'<div class="da-t">How to get this data</div>'
    +'<div class="da-row"><div class="da-icon">📋</div><div class="da-content"><div class="da-label">Data needed</div><div class="da-detail">'+guide.what+'</div></div></div>'
    +'<div class="da-row"><div class="da-icon">🗄</div><div class="da-content"><div class="da-label">Where it lives</div><div class="da-detail">'+guide.where+'</div></div></div>'
    +'<div class="da-row"><div class="da-icon">👤</div><div class="da-content"><div class="da-label">Who to coordinate with</div><div class="da-detail">'+guide.who+'</div></div></div>'
    +'<div style="margin:.65rem 0;font-size:10px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--tmu)">Steps to get it</div>'
    +stepsHtml
    +'<div class="da-actions">'
      +'<button class="da-btn primary" onclick="showEmailDraft(\''+domain+'\')">Draft request email</button>'
      +'<button class="da-btn" onclick="showMeetingRequest(\''+domain+'\')">Schedule a meeting</button>'
      +'<button class="da-btn" onclick="showImportGuide(\''+domain+'\')">Import guide</button>'
    +'</div></div>';
}

function showEmailDraft(domain){
  var guides=dataAcquisitionGuides[domain];
  if(!guides)return;
  var guide=guides['default'];
  var e=guide.email;
  var msgs=document.getElementById('advMsgs');
  var wrap=document.createElement('div');wrap.className='msg adv';
  var bub=document.createElement('div');bub.className='msg-bub';
  bub.textContent='Here\'s a draft email you can send. Update the bracketed fields before sending.';
  wrap.appendChild(bub);
  var draft=document.createElement('div');draft.className='email-draft';draft.style.marginTop='5px';
  draft.innerHTML='<div class="email-hd">Draft email</div>'
    +'<div class="email-field"><strong>To:</strong> '+e.to+'</div>'
    +'<div class="email-field"><strong>Subject:</strong> '+e.subject+'</div>'
    +'<div class="email-body" style="white-space:pre-line">'+e.body+'</div>'
    +'<div class="email-actions">'
      +'<button class="da-btn primary" onclick="copyEmailToClipboard(this)">Copy email</button>'
    +'</div>'
    +'<div class="email-note">With enterprise integrations, Vantage can send this directly through your connected email system — no copy-paste required.</div>';
  wrap.appendChild(draft);
  var meta=document.createElement('div');meta.className='msg-meta';meta.textContent=advConfig[curDomain]?advConfig[curDomain].title:'Adviser';
  wrap.appendChild(meta);
  msgs.appendChild(wrap);msgs.scrollTop=msgs.scrollHeight;
}

function copyEmailToClipboard(btn){
  var emailBody=btn.closest('.email-draft').querySelector('.email-body').textContent;
  var subject=btn.closest('.email-draft').querySelector('.email-field:nth-child(3)').textContent.replace('Subject: ','');
  var full='Subject: '+subject+'\n\n'+emailBody;
  navigator.clipboard.writeText(full).then(function(){btn.textContent='Copied!';setTimeout(function(){btn.textContent='Copy email'},2000)});
}

function showMeetingRequest(domain){
  var domainLabels={cto:'Technology',cro:'Revenue',chro:'People',cfo:'Financial',coo:'Operations'};
  appendMsg({role:'adv',text:'Here\'s a suggested meeting request. Update attendees and time before sending.',
    html:'<div class="email-draft" style="margin-top:5px"><div class="email-hd">Meeting request</div>'
      +'<div class="email-field"><strong>To:</strong> '+{cto:'Technology lead + Finance (for contract data)',cro:'CRO + RevOps lead',chro:'CHRO or HR Business Partner',cfo:'CFO + Controller',coo:'Operations lead + process owners'}[domain]+'</div>'
      +'<div class="email-field"><strong>Subject:</strong> 30 mins: '+domainLabels[domain]+' data review for Vantage assessment</div>'
      +'<div class="email-body" style="white-space:pre-line">Hi team,\n\nI\'m pulling together data for the '+domainLabels[domain]+' Physical assessment in Vantage and would love 30 minutes to walk through what we need and where it lives.\n\nAgenda:\n• What data Vantage needs for this domain\n• Where it currently lives in our systems\n• Import or integration path (Vantage already has most integrations configured)\n• Any gaps that need manual collection\n\nThis is quick — the goal is to make sure the data we have actually reflects the decision I\'m trying to make.\n\nWould [proposed time] work?\n\nThanks,\n[Your name]</div>'
      +'<div class="email-actions"><button class="da-btn primary" onclick="copyEmailToClipboard(this)">Copy</button></div>'
      +'<div class="email-note">With calendar integration, Vantage can send this as a calendar invite directly.</div></div>'});
}

function showImportGuide(domain){
  appendMsg({role:'adv',text:'Import path for '+{cto:'technology',cro:'CRM and revenue',chro:'people and HRIS',cfo:'financial',coo:'operations'}[domain]+' data:',
    html:'<div class="data-acq" style="margin-top:5px"><div class="da-t">Vantage import guide</div>'
      +'<div class="da-row"><div class="da-icon">1</div><div class="da-content"><div class="da-label">Go to Settings → Data Sources</div><div class="da-detail">The integration for this domain is already configured. You may need to complete field mapping.</div></div></div>'
      +'<div class="da-row"><div class="da-icon">2</div><div class="da-content"><div class="da-label">Check integration status</div><div class="da-detail">Green = live data flowing. Yellow = connected but incomplete field mapping. Red = needs reconnection.</div></div></div>'
      +'<div class="da-row"><div class="da-icon">3</div><div class="da-content"><div class="da-label">For manual imports: Upload → CSV</div><div class="da-detail">Download the Vantage import template for this domain, fill in your data, and upload. I\'ll re-run the analysis automatically.</div></div></div>'
      +'<div class="da-row"><div class="da-icon">4</div><div class="da-content"><div class="da-label">After import: return here</div><div class="da-detail">Come back to this conversation — I\'ll have the updated analysis ready based on the new data.</div></div></div>'
    +'</div>'});
}

// ─── ADVISER CORE ────────────────────────────────────────────────────────
var curDomain=null;
var guidedState={active:false,step:0,answers:{},multiSel:[]};
var advExchangeCount=0;
var savePromptShown=false;

function appendMsg(m){
  var msgs=document.getElementById('advMsgs');
  var wrap=document.createElement('div');wrap.className='msg '+(m.role==='adv'?'adv':'usr');
  var bub=document.createElement('div');bub.className='msg-bub';bub.textContent=m.text;wrap.appendChild(bub);
  if(m.data){
    var dt=document.createElement('div');dt.className='msg-data';
    m.data.forEach(function(r){var row=document.createElement('div');row.className='msg-dr';row.innerHTML='<span class="mdl">'+r.l+'</span><span class="mdv">'+r.v+'</span>';dt.appendChild(row)});
    wrap.appendChild(dt);
  }
  if(m.html){var d=document.createElement('div');d.style.marginTop='5px';d.innerHTML=m.html;wrap.appendChild(d)}
  var meta=document.createElement('div');meta.className='msg-meta';meta.textContent=m.role==='adv'?(curDomain&&advConfig[curDomain]?advConfig[curDomain].title:'Adviser'):'You';wrap.appendChild(meta);
  msgs.appendChild(wrap);msgs.scrollTop=msgs.scrollHeight;
}

function showTyping(){
  var msgs=document.getElementById('advMsgs');
  var t=document.createElement('div');t.className='msg adv';t.id='typing-indicator';
  t.innerHTML='<div class="msg-bub" style="background:var(--cream);border:1px solid var(--bd)"><div style="display:flex;gap:4px;align-items:center"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>';
  msgs.appendChild(t);msgs.scrollTop=msgs.scrollHeight;
}
function hideTyping(){var t=document.getElementById('typing-indicator');if(t)t.remove()}

function openAdviser(domain){
  curDomain=domain;guidedState={active:false,step:0,answers:{},multiSel:[]};
  advExchangeCount=0;savePromptShown=false;
  var cfg=advConfig[domain];
  document.getElementById('advTitle').textContent=cfg.title;
  document.getElementById('advDomain').textContent=cfg.domain;
  var msgs=document.getElementById('advMsgs');msgs.innerHTML='';
  cfg.init.forEach(function(m){appendMsg(m)});
  document.getElementById('quickReplyZone').innerHTML='';
  document.getElementById('advSugg').style.display='block';
  var pills=document.getElementById('advPills');pills.innerHTML='';
  cfg.suggestions.forEach(function(s){
    var btn=document.createElement('button');btn.className='sugg-pill';btn.textContent=s;
    btn.onclick=function(){sendToAdviser(s)};pills.appendChild(btn);
  });
  document.getElementById('advOverlay').classList.add('open');
  document.getElementById('advDrawer').classList.add('open');
  document.getElementById('advInput').value='';
}

function sendMsg(){
  var input=document.getElementById('advInput');
  var text=input.value.trim();if(!text||!curDomain)return;
  input.value='';sendToAdviser(text);
}

function sendToAdviser(q){
  if(guidedState.active){return}
  appendMsg({role:'usr',text:q});
  document.getElementById('advSugg').style.display='none';
  showTyping();
  setTimeout(function(){
    hideTyping();
    var resp=cxoResponses[curDomain];
    var baseText=(resp&&(resp[q]||resp['default']))||'';

    // Check if we need to walk through data acquisition
    var guide=getDataAcquisitionGuide(curDomain,q);
    var needsMoreData=!baseText||isInsufficientInfoQuestion(q);

    if(needsMoreData&&guide){
      var aqHtml=renderDataAcqBlock(guide,curDomain);
      appendMsg({role:'adv',
        text:'I don\'t have enough data in the current integration to answer that precisely. Here\'s how to get it:',
        html:aqHtml});
    } else {
      appendMsg({role:'adv',text:baseText||'Analysing signals from the '+advConfig[curDomain].title+'...'});
    }
    maybeShowSavePrompt();
  },1000);
}
var guidedSteps = [
  {q:'Which application are you evaluating for replacement?',sub:'I\'ll tailor the business case and plan to the specific context.',
    type:'single',opts:['Legacy CRM (Salesforce Classic) — redundant with HubSpot','Redshift data warehouse — 18% utilisation, latency issues','Custom billing tool — no vendor support','Other application']},
  {q:'What is the primary reason you\'re considering this?',sub:'This determines whether we lead with cost, risk, or strategic fit.',
    type:'single',opts:['Performance or reliability — impacting customers','Cost — licensing or infrastructure too high','Functionality gaps — can\'t support current needs','Vendor risk — support ending or company stability','Strategic fit — doesn\'t align with future architecture']},
  {q:'Who needs to approve this decision?',sub:'Approver scope determines the format and depth of the business case.',
    type:'single',opts:['I have operational authority to decide','Technology leadership — needs a technical brief','Financial leadership — needs ROI model and cost impact','CEO or board — needs full business case with strategic framing']},
  {q:'What is your target timeline?',sub:'This affects which deliverables are realistic now vs. later.',
    type:'single',opts:['Next 30 days — already approved, need the plan','This quarter (60–90 days) — need to move fast','This year — building the roadmap now','No fixed timeline — evaluating options']},
  {q:'Which deliverables would you like me to prepare?',sub:'Select all that apply — I\'ll generate each one.',
    type:'multi',opts:['Business case with ROI model','Project plan with milestones and owners','Vendor solution selection criteria','Data migration risk assessment','Stakeholder communication brief']},
];

function appendMsg(m){
  var msgs=document.getElementById('advMsgs');
  var wrap=document.createElement('div');wrap.className='msg '+(m.role==='adv'?'adv':'usr');
  var bub=document.createElement('div');bub.className='msg-bub';bub.textContent=m.text;wrap.appendChild(bub);
  if(m.data){
    var dt=document.createElement('div');dt.className='msg-data';
    m.data.forEach(function(r){var row=document.createElement('div');row.className='msg-dr';row.innerHTML='<span class="mdl">'+r.l+'</span><span class="mdv">'+r.v+'</span>';dt.appendChild(row)});
    wrap.appendChild(dt);
  }
  if(m.html){var d=document.createElement('div');d.style.marginTop='5px';d.innerHTML=m.html;wrap.appendChild(d)}
  var meta=document.createElement('div');meta.className='msg-meta';meta.textContent=m.role==='adv'?advConfig[curDomain].title:'You';wrap.appendChild(meta);
  msgs.appendChild(wrap);msgs.scrollTop=msgs.scrollHeight;
}

function showTyping(){
  var msgs=document.getElementById('advMsgs');
  var t=document.createElement('div');t.className='msg adv';t.id='typing-indicator';
  t.innerHTML='<div class="msg-bub" style="background:var(--cream);border:1px solid var(--bd)"><div style="display:flex;gap:4px;align-items:center"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>';
  msgs.appendChild(t);msgs.scrollTop=msgs.scrollHeight;
}
function hideTyping(){var t=document.getElementById('typing-indicator');if(t)t.remove()}

function openAdviser(domain){
  curDomain=domain;guidedState={active:false,step:0,answers:{},multiSel:[]};
  var cfg=advConfig[domain];
  document.getElementById('advTitle').textContent=cfg.title;
  document.getElementById('advDomain').textContent=cfg.domain;
  var msgs=document.getElementById('advMsgs');msgs.innerHTML='';
  cfg.init.forEach(function(m){appendMsg(m)});
  // suggestions
  document.getElementById('quickReplyZone').innerHTML='';
  document.getElementById('advSugg').style.display='block';
  var pills=document.getElementById('advPills');pills.innerHTML='';
  cfg.suggestions.forEach(function(s){
    var btn=document.createElement('button');btn.className='sugg-pill';btn.textContent=s;
    btn.onclick=function(){sendToAdviser(s)};pills.appendChild(btn);
  });
  document.getElementById('advOverlay').classList.add('open');
  document.getElementById('advDrawer').classList.add('open');
  document.getElementById('advInput').value='';
}

function sendMsg(){
  var input=document.getElementById('advInput');
  var text=input.value.trim();if(!text||!curDomain)return;
  input.value='';sendToAdviser(text);
}

function sendToAdviser(q){
  if(guidedState.active){return}
  appendMsg({role:'usr',text:q});
  document.getElementById('advSugg').style.display='none';
  showTyping();
  setTimeout(function(){
    hideTyping();
    var resp=cxoResponses[curDomain];
    var text=(resp&&(resp[q]||resp['default']))||'Analysing signals from the '+advConfig[curDomain].title+'...';
    appendMsg({role:'adv',text:text});
  },1000);
}

function closeAdviser(){
  document.getElementById('advOverlay').classList.remove('open');
  document.getElementById('advDrawer').classList.remove('open');
  curDomain=null;guidedState={active:false,step:0,answers:{},multiSel:[]};
  advExchangeCount=0;savePromptShown=false;
}

// ─── GUIDED SCENARIO IN CHAT ──────────────────────────────────────────────
function startGuidedInChat(){
  openAdviser('cto');
  setTimeout(function(){runGuidedStep()},400);
}

function runGuidedStep(){
  guidedState.active=true;
  document.getElementById('advSugg').style.display='none';
  if(guidedState.step>=guidedSteps.length){showGuidedOutput();return}
  var step=guidedSteps[guidedState.step];
  showTyping();
  setTimeout(function(){
    hideTyping();
    appendMsg({role:'adv',text:(guidedState.step===0?'Let me help you think through this. I\'ll ask a few quick questions first — then I\'ll generate your deliverables.\n\n':'')+'Step '+(guidedState.step+1)+' of '+guidedSteps.length+' — '+step.sub+'\n\n'+step.q});
    renderQuickReplies(step);
  },700);
}

function renderQuickReplies(step){
  var zone=document.getElementById('quickReplyZone');
  var multi=step.type==='multi';
  var html='<div class="quick-replies"><div class="qr-prompt">'+(multi?'Select all that apply':'Choose one')+'</div>';
  if(multi)html+='<div class="qr-multi-hint">Tap to select · confirm when ready</div>';
  html+='<div class="qr-btns">';
  step.opts.forEach(function(o,i){html+='<button class="qr-btn" id="qr-'+i+'" onclick="selectQR('+i+',this,\''+step.type+'\')">'+o+'</button>'});
  html+='</div>';
  if(multi)html+='<div class="qr-actions"><button class="qr-confirm" onclick="confirmMulti()">Confirm selection →</button></div>';
  html+='</div>';
  zone.innerHTML=html;
}

function selectQR(idx,btn,type){
  if(type==='multi'){
    btn.classList.toggle('selected');
    var i=guidedState.multiSel.indexOf(idx);
    if(i>-1)guidedState.multiSel.splice(i,1);else guidedState.multiSel.push(idx);
  } else {
    document.querySelectorAll('.qr-btn').forEach(function(b){b.classList.remove('selected')});
    btn.classList.add('selected');
    var step=guidedSteps[guidedState.step];
    var answer=step.opts[idx];
    guidedState.answers[guidedState.step]=answer;
    document.getElementById('quickReplyZone').innerHTML='';
    appendMsg({role:'usr',text:answer});
    guidedState.step++;
    setTimeout(function(){runGuidedStep()},500);
  }
}

function confirmMulti(){
  var step=guidedSteps[guidedState.step];
  var sel=guidedState.multiSel.map(function(i){return step.opts[i]});
  if(sel.length===0)sel=step.opts.slice(0,3);
  guidedState.answers[guidedState.step]=sel;
  document.getElementById('quickReplyZone').innerHTML='';
  appendMsg({role:'usr',text:'Selected: '+sel.join(' · ')});
  guidedState.step++;
  setTimeout(function(){runGuidedStep()},500);
}

function showGuidedOutput(){
  document.getElementById('quickReplyZone').innerHTML='';
  showTyping();
  var app=guidedState.answers[0]||'the target application';
  var reason=guidedState.answers[1]||'cost and performance';
  setTimeout(function(){
    hideTyping();
    appendMsg({role:'adv',text:'I\'ve reviewed your answers. Here\'s your application replacement plan — all three deliverables below.'});
  },600);
  setTimeout(function(){
    appendMsg({role:'adv',text:'Business case · '+app,
      html:'<div style="background:var(--cream);border:1px solid var(--bd);border-radius:var(--r);padding:.75rem .9rem;font-size:12px;color:var(--tm);line-height:1.6">'
        +'<strong style="color:var(--navy)">Application:</strong> '+app+'<br/>'
        +'<strong style="color:var(--navy)">Primary driver:</strong> '+reason+'<br/>'
        +'<strong style="color:var(--navy)">3-year TCO reduction:</strong> Estimated $828K from licensing savings ($180K/yr) and right-sizing ($96K/yr).<br/>'
        +'<strong style="color:var(--navy)">Architecture impact:</strong> Removes −0.4x valuation compression from architecture score.<br/>'
        +'<strong style="color:var(--navy)">Approval path:</strong> Financial leadership sign-off + board brief at next cycle.</div>'
        +'<button onclick="askExportFormat(\'bc\')" style="margin-top:8px;display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:500;color:var(--gold);cursor:pointer;padding:5px 12px;border:1px solid var(--gold-b);border-radius:var(--rp);background:rgba(201,160,48,0.07);font-family:var(--fb)">↓ Export business case</button>'});
  },1400);
  setTimeout(function(){
    appendMsg({role:'adv',text:'Project plan — recommended sequencing',
      html:'<div style="background:var(--cream);border:1px solid var(--bd);border-radius:var(--r);padding:.75rem .9rem;font-size:12px;color:var(--tm);line-height:1.7">'
        +'<strong style="color:var(--navy)">Phase 1 (Wks 1–2):</strong> Data audit and migration requirements mapping.<br/>'
        +'<strong style="color:var(--navy)">Phase 2 (Wks 3–6):</strong> Vendor evaluation using solution criteria below.<br/>'
        +'<strong style="color:var(--navy)">Phase 3 (Wks 7–12):</strong> Migration, parallel run, user acceptance testing.<br/>'
        +'<strong style="color:var(--navy)">Phase 4 (Wk 13):</strong> Cutover and decommission.<br/>'
        +'<strong style="color:var(--dng)">Risk flag:</strong> Sequence migration after Vantage Partners renewal (9 days). Cutover downtime must not overlap.</div>'
        +'<button onclick="askExportFormat(\'plan\')" style="margin-top:8px;display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:500;color:var(--gold);cursor:pointer;padding:5px 12px;border:1px solid var(--gold-b);border-radius:var(--rp);background:rgba(201,160,48,0.07);font-family:var(--fb)">↓ Export project plan</button>'});
  },2200);
  setTimeout(function(){
    appendMsg({role:'adv',text:'Solution selection criteria for replacement',
      html:'<div style="background:var(--cream);border:1px solid var(--bd);border-radius:var(--r);padding:.75rem .9rem;font-size:12px;color:var(--tm);line-height:1.7">'
        +'<strong style="color:var(--navy)">Must-have:</strong> API-first architecture · SOC2 Type II · sub-100ms query response · migration support included.<br/>'
        +'<strong style="color:var(--navy)">Nice-to-have:</strong> Native CRM integration · ML/AI capability · usage-based pricing.<br/>'
        +'<strong style="color:var(--dng)">Disqualifying:</strong> Vendor under $50M ARR or single-investor dependency.<br/>'
        +'<strong style="color:var(--navy)">Shortlist:</strong> Snowflake · Databricks · BigQuery — all meet baseline criteria.</div>'
        +'<button onclick="askExportFormat(\'criteria\')" style="margin-top:8px;display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:500;color:var(--gold);cursor:pointer;padding:5px 12px;border:1px solid var(--gold-b);border-radius:var(--rp);background:rgba(201,160,48,0.07);font-family:var(--fb)">↓ Export selection criteria</button>'});
    guidedState.active=false;
    setTimeout(function(){
      document.getElementById('advSugg').style.display='block';
      appendMsg({role:'adv',text:'All three deliverables are ready. Use the export buttons to download editable files, or ask me anything to go deeper on any of these.'});
    },600);
  },3200);
}

// ─── EXPORT FLOW ─────────────────────────────────────────────────────────
var exportFormats={
  bc:{
    label:'business case',
    opts:['PowerPoint deck (editable slides)','Cut and paste — I\'ll grab from the chat']
  },
  plan:{
    label:'project plan',
    opts:['Excel spreadsheet (editable timeline)','PowerPoint summary slide','Both Excel + slide','Cut and paste — I\'ll grab from the chat']
  },
  criteria:{
    label:'solution selection criteria',
    opts:['Excel scorecard (editable)','PowerPoint summary slide','Both Excel + slide','Cut and paste — I\'ll grab from the chat']
  }
};

function askExportFormat(type){
  var fmt=exportFormats[type];
  appendMsg({role:'adv',text:'How would you like to export the '+fmt.label+'?'});
  var zone=document.getElementById('quickReplyZone');
  var html='<div class="quick-replies"><div class="qr-prompt">Choose format</div><div class="qr-btns">';
  fmt.opts.forEach(function(o,i){html+='<button class="qr-btn" onclick="handleExport(\''+type+'\','+i+',this)">'+o+'</button>'});
  html+='</div></div>';
  zone.innerHTML=html;
}

function handleExport(type,idx,btn){
  document.getElementById('quickReplyZone').innerHTML='';
  var fmt=exportFormats[type];
  var choice=fmt.opts[idx];
  appendMsg({role:'usr',text:choice});
  if(choice.startsWith('Cut and paste')){
    appendMsg({role:'adv',text:'No problem — the content is already in the chat above, ready to copy. Select the text in the deliverable block and paste it wherever you need.'});
    return;
  }
  var app=guidedState.answers[0]||'Application Replacement';
  showTyping();
  setTimeout(function(){
    hideTyping();
    appendMsg({role:'adv',text:'Generating your '+fmt.label+' — download will start in a moment...'});
    try {
      if(type==='bc'){
        genPptxBC(app);
      } else if(type==='plan'){
        if(choice.includes('Excel')&&choice.includes('slide')){genXlsxPlan(app);setTimeout(function(){genPptxPlan(app)},600)}
        else if(choice.includes('Excel')){genXlsxPlan(app)}
        else if(choice.includes('PowerPoint')){genPptxPlan(app)}
      } else if(type==='criteria'){
        if(choice.includes('Excel')&&choice.includes('slide')){genXlsxCriteria(app);setTimeout(function(){genPptxCriteria(app)},600)}
        else if(choice.includes('Excel')){genXlsxCriteria(app)}
        else if(choice.includes('PowerPoint')){genPptxCriteria(app)}
      }
      setTimeout(function(){
        appendMsg({role:'adv',text:'Download complete. The file is editable — update names, dates, and figures to match your actual situation before sharing.'});
      },1200);
    } catch(e){
      appendMsg({role:'adv',text:'The file generator encountered an issue loading — you can still copy the content from the chat above and paste it into your preferred tool.'});
    }
  },900);
}

// ─── PPTX: BUSINESS CASE ─────────────────────────────────────────────────
function genPptxBC(app){
  if(typeof PptxGenJS==='undefined'){throw new Error('PptxGenJS not loaded')}
  var pres=new PptxGenJS();
  pres.layout='LAYOUT_16x9';
  pres.title='Application Replacement Business Case';

  // Slide 1 — Title
  var s1=pres.addSlide();
  s1.background={color:'1C2B4A'};
  s1.addShape(pres.shapes.RECTANGLE,{x:0,y:4.5,w:10,h:1.125,fill:{color:'C9A030'}});
  s1.addText('Application Replacement',{x:0.6,y:1.0,w:8.8,h:0.6,fontSize:16,color:'C9A030',fontFace:'Calibri',bold:false});
  s1.addText('Business Case',{x:0.6,y:1.55,w:8.8,h:1.1,fontSize:44,color:'FFFFFF',fontFace:'Calibri',bold:true});
  s1.addText(app,{x:0.6,y:2.75,w:8.8,h:0.5,fontSize:18,color:'C9A030',fontFace:'Calibri',italic:true});
  s1.addText('Prepared by Vantage Technology Adviser · Capacera',{x:0.6,y:4.6,w:8.8,h:0.4,fontSize:11,color:'1C2B4A',fontFace:'Calibri'});

  // Slide 2 — Executive summary
  var s2=pres.addSlide();
  s2.background={color:'F7F5F0'};
  s2.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.15,h:5.625,fill:{color:'C9A030'}});
  s2.addText('Executive Summary',{x:0.4,y:0.35,w:9.2,h:0.55,fontSize:28,color:'1C2B4A',fontFace:'Calibri',bold:true});
  var summRows=[
    [{text:'Metric',options:{bold:true,fill:{color:'1C2B4A'},color:'FFFFFF',fontFace:'Calibri',fontSize:12}},{text:'Detail',options:{bold:true,fill:{color:'1C2B4A'},color:'FFFFFF',fontFace:'Calibri',fontSize:12}}],
    ['Application under review',app],
    ['Primary driver',guidedState.answers[1]||'Cost and performance'],
    ['3-year TCO reduction','$828K (licensing $540K + right-sizing $288K)'],
    ['Architecture EV impact','Removes −0.4x valuation compression · $1.7M at 6x multiple'],
    ['Payback period','14–18 months from project start'],
    ['Approval required',guidedState.answers[2]||'Financial leadership + board'],
    ['Recommended timeline',guidedState.answers[3]||'This year'],
  ];
  s2.addTable(summRows,{x:0.4,y:1.1,w:9.2,h:3.8,colW:[3.5,5.7],border:{pt:0.5,color:'D8D4C8'},
    fill:{color:'FFFFFF'},fontFace:'Calibri',fontSize:12,color:'4A4640',
    rowH:0.43,valign:'middle',align:'left',margin:6});

  // Slide 3 — Cost-benefit
  var s3=pres.addSlide();
  s3.background={color:'F7F5F0'};
  s3.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.15,h:5.625,fill:{color:'1C2B4A'}});
  s3.addText('Cost–Benefit Analysis',{x:0.4,y:0.35,w:9.2,h:0.55,fontSize:28,color:'1C2B4A',fontFace:'Calibri',bold:true});
  // Cost side
  s3.addShape(pres.shapes.RECTANGLE,{x:0.4,y:1.05,w:4.2,h:3.9,fill:{color:'FFFFFF'},line:{color:'D8D4C8',pt:0.5}});
  s3.addText('Costs',{x:0.5,y:1.15,w:4.0,h:0.4,fontSize:14,color:'B83030',fontFace:'Calibri',bold:true});
  s3.addText([
    {text:'Implementation & migration',options:{bullet:true,breakLine:true,color:'4A4640'}},
    {text:'$120,000–$180,000',options:{bold:true,breakLine:true,color:'1C2B4A'}},
    {text:'Engineering time (13 weeks)',options:{bullet:true,breakLine:true,color:'4A4640'}},
    {text:'$65,000 est. (loaded rate)',options:{bold:true,breakLine:true,color:'1C2B4A'}},
    {text:'Vendor selection & procurement',options:{bullet:true,breakLine:true,color:'4A4640'}},
    {text:'$15,000–$25,000',options:{bold:true,breakLine:true,color:'1C2B4A'}},
    {text:'Training & change management',options:{bullet:true,breakLine:true,color:'4A4640'}},
    {text:'$20,000',options:{bold:true,color:'1C2B4A'}},
  ],{x:0.5,y:1.65,w:4.0,h:3.0,fontFace:'Calibri',fontSize:11,valign:'top'});
  // Benefit side
  s3.addShape(pres.shapes.RECTANGLE,{x:4.8,y:1.05,w:4.8,h:3.9,fill:{color:'FFFFFF'},line:{color:'D8D4C8',pt:0.5}});
  s3.addText('Benefits (3-year)',{x:4.9,y:1.15,w:4.6,h:0.4,fontSize:14,color:'2A6030',fontFace:'Calibri',bold:true});
  s3.addText([
    {text:'Licensing cost elimination',options:{bullet:true,breakLine:true,color:'4A4640'}},
    {text:'$180,000/yr → $540,000 total',options:{bold:true,breakLine:true,color:'1C2B4A'}},
    {text:'Infrastructure right-sizing',options:{bullet:true,breakLine:true,color:'4A4640'}},
    {text:'$96,000/yr → $288,000 total',options:{bold:true,breakLine:true,color:'1C2B4A'}},
    {text:'Valuation compression removed',options:{bullet:true,breakLine:true,color:'4A4640'}},
    {text:'−0.4x → +$1.7M enterprise value',options:{bold:true,breakLine:true,color:'1C2B4A'}},
    {text:'Architecture score improvement',options:{bullet:true,breakLine:true,color:'4A4640'}},
    {text:'3.4 → 2.2 (from Fragmented to Lean)',options:{bold:true,color:'1C2B4A'}},
  ],{x:4.9,y:1.65,w:4.6,h:3.0,fontFace:'Calibri',fontSize:11,valign:'top'});

  // Slide 4 — Risk & sequencing
  var s4=pres.addSlide();
  s4.background={color:'F7F5F0'};
  s4.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.15,h:5.625,fill:{color:'C9A030'}});
  s4.addText('Key Risks & Sequencing',{x:0.4,y:0.35,w:9.2,h:0.55,fontSize:28,color:'1C2B4A',fontFace:'Calibri',bold:true});
  s4.addText([
    {text:'Critical sequencing constraint',options:{bold:true,color:'B83030',breakLine:true,fontSize:14}},
    {text:'Migration cutover must not overlap with Vantage Partners renewal window (9 days). Any service interruption directly impacts customer health score for the largest at-risk account ($1.65M ARR).',options:{color:'4A4640',breakLine:true,fontSize:12}},
    {text:' ',options:{breakLine:true}},
    {text:'Data migration risk',options:{bold:true,color:'8A5A10',breakLine:true,fontSize:14}},
    {text:'3 years of transactional data with 2 legacy format dependencies. Full data audit required before cutover. Engineering estimate: 8–10 days for audit and remediation.',options:{color:'4A4640',breakLine:true,fontSize:12}},
    {text:' ',options:{breakLine:true}},
    {text:'Team capacity risk',options:{bold:true,color:'8A5A10',breakLine:true,fontSize:14}},
    {text:'Same engineering team owns both the Vantage Partners Redshift patch and this migration. Do not run in parallel. Recommended order: patch → renewal secured → migration kickoff.',options:{color:'4A4640',fontSize:12}},
  ],{x:0.4,y:1.1,w:9.2,h:4.1,fontFace:'Calibri',valign:'top'});

  // Slide 5 — Recommendation
  var s5=pres.addSlide();
  s5.background={color:'1C2B4A'};
  s5.addShape(pres.shapes.RECTANGLE,{x:0,y:4.0,w:10,h:1.625,fill:{color:'C9A030'}});
  s5.addText('Recommendation',{x:0.6,y:0.5,w:8.8,h:0.55,fontSize:20,color:'C9A030',fontFace:'Calibri'});
  s5.addText('Proceed — with sequencing.',{x:0.6,y:1.1,w:8.8,h:0.8,fontSize:36,color:'FFFFFF',fontFace:'Calibri',bold:true});
  s5.addText([
    {text:'1.  ',options:{bold:true,color:'C9A030'}},{text:'Secure Vantage Partners renewal first (9-day window).',options:{color:'FFFFFF',breakLine:true}},
    {text:'2.  ',options:{bold:true,color:'C9A030'}},{text:'Ship Redshift patch — root cause of zero-login behaviour.',options:{color:'FFFFFF',breakLine:true}},
    {text:'3.  ',options:{bold:true,color:'C9A030'}},{text:'Begin data audit and vendor selection (parallel safe).',options:{color:'FFFFFF',breakLine:true}},
    {text:'4.  ',options:{bold:true,color:'C9A030'}},{text:'Migration kickoff after renewal is confirmed.',options:{color:'FFFFFF'}},
  ],{x:0.6,y:2.1,w:8.8,h:1.7,fontFace:'Calibri',fontSize:14,valign:'top'});
  s5.addText('Prepared by Vantage Technology Adviser · Capacera · Not valuation advisory',{x:0.6,y:4.15,w:8.8,h:0.4,fontSize:10,color:'1C2B4A',fontFace:'Calibri'});

  pres.writeFile({fileName:'Vantage_Business_Case_'+safeFileName(app)+'.pptx'});
}

// ─── XLSX: PROJECT PLAN ──────────────────────────────────────────────────
function genXlsxPlan(app){
  if(typeof XLSX==='undefined'){throw new Error('XLSX not loaded')}
  var wb=XLSX.utils.book_new();
  // Sheet 1: Project plan
  var planData=[
    ['Vantage · Application Replacement Project Plan','','','','','',''],
    ['Application: '+app,'','','','','',''],
    ['Generated by Vantage Technology Adviser · Capacera','','','','','',''],
    ['','','','','','',''],
    ['Phase','Task','Owner','Start (week)','End (week)','Status','Notes'],
    ['Phase 1 — Data Audit','Application dependency mapping','Technology lead','1','1','Not started','Identify all integrations and data flows'],
    ['Phase 1 — Data Audit','Data volume and format audit','Technology lead','1','2','Not started','3 years of transactional data'],
    ['Phase 1 — Data Audit','Legacy format remediation scoping','Technology lead','2','2','Not started','2 legacy format dependencies identified'],
    ['Phase 2 — Vendor Selection','Shortlist vendor evaluation','Technology + Financial','3','4','Not started','Snowflake · Databricks · BigQuery'],
    ['Phase 2 — Vendor Selection','Proof of concept (top 2 vendors)','Technology lead','4','5','Not started','Test query performance and migration tooling'],
    ['Phase 2 — Vendor Selection','Contract negotiation and sign','Financial lead','5','6','Not started','Requires CFO approval'],
    ['Phase 3 — Migration','Migration environment setup','Technology lead','7','7','Not started','Parallel run infrastructure'],
    ['Phase 3 — Migration','Data migration (batch 1 — historical)','Technology lead','7','9','Not started','3-year historical dataset'],
    ['Phase 3 — Migration','Parallel run — validation','Technology + Operations','9','11','Not started','Compare results to legacy system'],
    ['Phase 3 — Migration','User acceptance testing','All stakeholders','11','12','Not started','Functional and performance sign-off'],
    ['Phase 4 — Cutover','Production cutover','Technology lead','13','13','Not started','Must not overlap Vantage Partners renewal'],
    ['Phase 4 — Cutover','Legacy system decommission','Technology lead','13','13','Not started','After 2-week parallel run post-cutover'],
    ['','','','','','',''],
    ['RISK FLAGS','','','','','',''],
    ['Vantage Partners renewal (9 days)','Do not begin cutover until renewal is secured','CRO + Technology','Before Phase 3','','High',''],
    ['Engineering capacity','Same team owns Redshift patch — sequence carefully','Technology lead','Ongoing','','High',''],
    ['Data format compatibility','2 legacy formats require remediation before migration','Technology lead','Phase 1','','Medium',''],
  ];
  var ws1=XLSX.utils.aoa_to_sheet(planData);
  ws1['!cols']=[{wch:30},{wch:40},{wch:22},{wch:14},{wch:14},{wch:14},{wch:40}];
  ws1['!merges']=[
    {s:{r:0,c:0},e:{r:0,c:6}},
    {s:{r:1,c:0},e:{r:1,c:6}},
    {s:{r:2,c:0},e:{r:2,c:6}},
  ];
  XLSX.utils.book_append_sheet(wb,ws1,'Project Plan');

  // Sheet 2: RACI
  var raciData=[
    ['RACI Matrix · '+app+' Replacement','','','','',''],
    ['Task','Technology Lead','Financial Lead','CRO','Operations','Board'],
    ['Data audit','R','I','I','I',''],
    ['Vendor selection','R','A','C','I','I'],
    ['Contract approval','C','A','','','I'],
    ['Migration execution','R','I','I','C',''],
    ['Cutover go/no-go','A','A','A','A',''],
    ['Decommission','R','I','','I',''],
    ['','','','','',''],
    ['R = Responsible  A = Accountable  C = Consulted  I = Informed','','','','',''],
  ];
  var ws2=XLSX.utils.aoa_to_sheet(raciData);
  ws2['!cols']=[{wch:30},{wch:18},{wch:18},{wch:10},{wch:14},{wch:10}];
  XLSX.utils.book_append_sheet(wb,ws2,'RACI');

  XLSX.writeFile(wb,'Vantage_Project_Plan_'+safeFileName(app)+'.xlsx');
}

// ─── PPTX: PROJECT PLAN SLIDE ────────────────────────────────────────────
function genPptxPlan(app){
  if(typeof PptxGenJS==='undefined'){throw new Error('PptxGenJS not loaded')}
  var pres=new PptxGenJS();
  pres.layout='LAYOUT_16x9';

  // Slide 1 — Timeline
  var s1=pres.addSlide();
  s1.background={color:'F7F5F0'};
  s1.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.15,h:5.625,fill:{color:'C9A030'}});
  s1.addText('Project Plan · Application Replacement',{x:0.4,y:0.3,w:9.2,h:0.5,fontSize:24,color:'1C2B4A',fontFace:'Calibri',bold:true});
  s1.addText(app,{x:0.4,y:0.82,w:9.2,h:0.35,fontSize:14,color:'8A8680',fontFace:'Calibri',italic:true});

  var phases=[
    {label:'Phase 1',sub:'Data Audit',weeks:'Wks 1–2',color:'253561',x:0.4},
    {label:'Phase 2',sub:'Vendor Selection',weeks:'Wks 3–6',color:'1C2B4A',x:2.8},
    {label:'Phase 3',sub:'Migration & UAT',weeks:'Wks 7–12',color:'253561',x:5.2},
    {label:'Phase 4',sub:'Cutover',weeks:'Wk 13',color:'C9A030',x:7.9},
  ];
  var phaseW=[2.2,2.2,2.5,1.8];
  phases.forEach(function(p,i){
    s1.addShape(pres.shapes.RECTANGLE,{x:p.x,y:1.35,w:phaseW[i],h:1.4,fill:{color:p.color}});
    s1.addText(p.label,{x:p.x+0.1,y:1.45,w:phaseW[i]-0.2,h:0.38,fontSize:13,color:'FFFFFF',fontFace:'Calibri',bold:true});
    s1.addText(p.sub,{x:p.x+0.1,y:1.82,w:phaseW[i]-0.2,h:0.38,fontSize:11,color:'FFFFFF',fontFace:'Calibri'});
    s1.addText(p.weeks,{x:p.x+0.1,y:2.2,w:phaseW[i]-0.2,h:0.38,fontSize:10,color:p.color==='C9A030'?'1C2B4A':'C9A030',fontFace:'Calibri',bold:true});
  });

  // Risk flag bar
  s1.addShape(pres.shapes.RECTANGLE,{x:0.4,y:2.95,w:9.2,h:0.05,fill:{color:'D8D4C8'}});
  s1.addText('Key tasks',{x:0.4,y:3.1,w:9.2,h:0.35,fontSize:13,color:'1C2B4A',fontFace:'Calibri',bold:true});
  var tasks=[
    {t:'Dependency + data audit',p:0},{t:'Legacy format remediation',p:0},
    {t:'Vendor POC (Snowflake/BigQuery)',p:1},{t:'Contract sign-off',p:1},
    {t:'Data migration (batch)',p:2},{t:'Parallel run & UAT',p:2},
    {t:'Production cutover',p:3},{t:'Legacy decommission',p:3},
  ];
  var cols=[[],[],[],[]];
  tasks.forEach(function(t){cols[t.p].push(t.t)});
  var colX=[0.4,2.8,5.2,7.9];
  cols.forEach(function(col,i){
    col.forEach(function(task,j){
      s1.addText('· '+task,{x:colX[i],y:3.5+j*0.38,w:phaseW[i],h:0.35,fontSize:10,color:'4A4640',fontFace:'Calibri'});
    });
  });

  // Risk callout
  s1.addShape(pres.shapes.RECTANGLE,{x:0.4,y:5.0,w:9.2,h:0.45,fill:{color:'FDF0EE'},line:{color:'B83030',pt:0.5}});
  s1.addText('Risk: Cutover must not overlap Vantage Partners renewal window. Secure renewal first → ship Redshift patch → begin migration.',
    {x:0.5,y:5.05,w:9.0,h:0.35,fontSize:10,color:'B83030',fontFace:'Calibri'});

  pres.writeFile({fileName:'Vantage_Project_Plan_'+safeFileName(app)+'.pptx'});
}

// ─── XLSX: SELECTION CRITERIA ────────────────────────────────────────────
function genXlsxCriteria(app){
  if(typeof XLSX==='undefined'){throw new Error('XLSX not loaded')}
  var wb=XLSX.utils.book_new();
  var critData=[
    ['Vantage · Solution Selection Criteria','','','',''],
    ['Application being replaced: '+app,'','','',''],
    ['Generated by Vantage Technology Adviser · Capacera','','','',''],
    ['','','','',''],
    ['Category','Criterion','Weight','Vendor A score (1–5)','Vendor B score (1–5)'],
    ['MUST-HAVE','API-first architecture','Critical','',''],
    ['MUST-HAVE','SOC2 Type II certified','Critical','',''],
    ['MUST-HAVE','Sub-100ms query response at scale','Critical','',''],
    ['MUST-HAVE','Migration support included in contract','Critical','',''],
    ['','','','',''],
    ['NICE-TO-HAVE','Native Salesforce/CRM integration','High','',''],
    ['NICE-TO-HAVE','ML / AI capability built-in','Medium','',''],
    ['NICE-TO-HAVE','Usage-based pricing model','Medium','',''],
    ['NICE-TO-HAVE','Multi-cloud deployment option','Low','',''],
    ['','','','',''],
    ['DISQUALIFYING','Vendor ARR under $50M','Instant reject','',''],
    ['DISQUALIFYING','Single investor or concentration risk','Instant reject','',''],
    ['DISQUALIFYING','No data migration tooling available','Instant reject','',''],
    ['','','','',''],
    ['SHORTLIST','Snowflake','Meets all must-haves','',''],
    ['SHORTLIST','Databricks','Meets all must-haves','',''],
    ['SHORTLIST','Google BigQuery','Meets all must-haves','',''],
    ['','','','',''],
    ['Instructions: Score each vendor 1 (poor) to 5 (excellent) for each nice-to-have criterion. Must-haves are pass/fail — any miss = disqualified.','','','',''],
  ];
  var ws=XLSX.utils.aoa_to_sheet(critData);
  ws['!cols']=[{wch:18},{wch:40},{wch:16},{wch:22},{wch:22}];
  ws['!merges']=[
    {s:{r:0,c:0},e:{r:0,c:4}},{s:{r:1,c:0},e:{r:1,c:4}},{s:{r:2,c:0},e:{r:2,c:4}},
    {s:{r:22,c:0},e:{r:22,c:4}},
  ];
  XLSX.utils.book_append_sheet(wb,ws,'Selection Criteria');
  XLSX.writeFile(wb,'Vantage_Selection_Criteria_'+safeFileName(app)+'.xlsx');
}

// ─── PPTX: SELECTION CRITERIA SLIDE ─────────────────────────────────────
function genPptxCriteria(app){
  if(typeof PptxGenJS==='undefined'){throw new Error('PptxGenJS not loaded')}
  var pres=new PptxGenJS();
  pres.layout='LAYOUT_16x9';

  var s1=pres.addSlide();
  s1.background={color:'F7F5F0'};
  s1.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.15,h:5.625,fill:{color:'1C2B4A'}});
  s1.addText('Solution Selection Criteria',{x:0.4,y:0.3,w:9.2,h:0.5,fontSize:26,color:'1C2B4A',fontFace:'Calibri',bold:true});
  s1.addText(app,{x:0.4,y:0.82,w:9.2,h:0.3,fontSize:13,color:'8A8680',fontFace:'Calibri',italic:true});

  // Must-have column
  s1.addShape(pres.shapes.RECTANGLE,{x:0.4,y:1.25,w:2.9,h:0.42,fill:{color:'2A6030'}});
  s1.addText('Must-have',{x:0.4,y:1.27,w:2.9,h:0.38,fontSize:12,color:'FFFFFF',fontFace:'Calibri',bold:true,align:'center'});
  s1.addText([
    {text:'API-first architecture',options:{bullet:true,breakLine:true}},
    {text:'SOC2 Type II certified',options:{bullet:true,breakLine:true}},
    {text:'Sub-100ms query response',options:{bullet:true,breakLine:true}},
    {text:'Migration support in contract',options:{bullet:true}},
  ],{x:0.4,y:1.75,w:2.9,h:2.0,fontFace:'Calibri',fontSize:12,color:'2A6030',valign:'top'});

  // Nice-to-have column
  s1.addShape(pres.shapes.RECTANGLE,{x:3.55,y:1.25,w:2.9,h:0.42,fill:{color:'8A5A10'}});
  s1.addText('Nice-to-have',{x:3.55,y:1.27,w:2.9,h:0.38,fontSize:12,color:'FFFFFF',fontFace:'Calibri',bold:true,align:'center'});
  s1.addText([
    {text:'Native CRM integration',options:{bullet:true,breakLine:true}},
    {text:'ML / AI capability built-in',options:{bullet:true,breakLine:true}},
    {text:'Usage-based pricing',options:{bullet:true,breakLine:true}},
    {text:'Multi-cloud deployment',options:{bullet:true}},
  ],{x:3.55,y:1.75,w:2.9,h:2.0,fontFace:'Calibri',fontSize:12,color:'8A5A10',valign:'top'});

  // Disqualifying column
  s1.addShape(pres.shapes.RECTANGLE,{x:6.7,y:1.25,w:2.9,h:0.42,fill:{color:'B83030'}});
  s1.addText('Disqualifying',{x:6.7,y:1.27,w:2.9,h:0.38,fontSize:12,color:'FFFFFF',fontFace:'Calibri',bold:true,align:'center'});
  s1.addText([
    {text:'Vendor ARR under $50M',options:{bullet:true,breakLine:true}},
    {text:'Single investor dependency',options:{bullet:true,breakLine:true}},
    {text:'No migration tooling available',options:{bullet:true,breakLine:true}},
  ],{x:6.7,y:1.75,w:2.9,h:2.0,fontFace:'Calibri',fontSize:12,color:'B83030',valign:'top'});

  // Shortlist
  s1.addShape(pres.shapes.RECTANGLE,{x:0.4,y:4.0,w:9.2,h:0.38,fill:{color:'1C2B4A'}});
  s1.addText('Shortlist (all pass must-haves): Snowflake · Databricks · Google BigQuery',
    {x:0.5,y:4.05,w:9.0,h:0.3,fontSize:12,color:'C9A030',fontFace:'Calibri',bold:true});
  s1.addText('Score each nice-to-have 1–5 per vendor using the companion Excel scorecard.',
    {x:0.4,y:4.55,w:9.2,h:0.3,fontSize:10,color:'8A8680',fontFace:'Calibri',italic:true});
  s1.addText('Prepared by Vantage Technology Adviser · Capacera',
    {x:0.4,y:5.1,w:9.2,h:0.3,fontSize:9,color:'8A8680',fontFace:'Calibri'});

  pres.writeFile({fileName:'Vantage_Selection_Criteria_'+safeFileName(app)+'.pptx'});
}

function safeFileName(s){return(s||'Export').replace(/[^a-zA-Z0-9]/g,'_').substring(0,30)}

// ─── GUIDED TOUR ─────────────────────────────────────────────────────────────
var TOUR_PHYSICAL_URL='https://capacera.com/#physical';   // TODO: update
var TOUR_PARTNER_URL ='https://capacera.com/#design-partner'; // TODO: update

function _tourScenBtn(mode){return Array.from(document.querySelectorAll('.s-tab')).find(function(b){return b.getAttribute('onclick')&&b.getAttribute('onclick').indexOf("'"+mode+"'")>-1});}
function _tourTabBtn(domain){
  if(domain==='all')return document.querySelector('.cxo-tab');
  return Array.from(document.querySelectorAll('.cxo-tab')).find(function(b){return b.getAttribute('onclick')&&b.getAttribute('onclick').indexOf("'"+domain+"'")>-1});
}

var tourSteps=[
  {title:'AcmeSaaS Acquisition Simulation',
   text:'Archer Partners is evaluating AcmeSaaS — a $2.4M EBITDA SaaS platform — for acquisition at 6.0x EBITDA baseline. This is a live Vantage Physical. Walk through the full analysis in under 3 minutes.',
   target:null,
   enter:function(){
     var b=_tourScenBtn('macc');if(b)setScenario('macc',b);
     var t=_tourTabBtn('all');if(t)setTab('all',t);
     closeSimTray();window.scrollTo({top:0,behavior:'smooth'});
   }
  },
  {title:'Valuation Envelope',
   text:'Vantage calculates a real-time floor-to-ceiling range from five CXO signal layers. AcmeSaaS has a $9.1M floor and $22.1M ceiling — a $13M spread. That spread is the acquisition opportunity.',
   target:'.env-wrap',
   enter:function(){
     var el=document.querySelector('.env-wrap')||document.querySelector('.env-card');
     if(el)el.scrollIntoView({behavior:'smooth',block:'center'});
   }
  },
  {title:'Remediation Simulator',
   text:'Each lever shows its exact impact on the valuation. "Retain Vantage Partners" is the single highest-ROI action — +0.4x to the floor. Toggle it and watch the envelope move.',
   target:'#simTray',
   enter:function(){
     openSimTray();
     setTimeout(function(){var cb=document.getElementById('s4');if(cb&&!cb.checked){cb.checked=true;calcSim();}},450);
   },
   leave:function(){
     var cb=document.getElementById('s4');if(cb&&cb.checked){cb.checked=false;calcSim();}
     closeSimTray();
   }
  },
  {title:'Two Scenario Lenses',
   text:'Buy-Side M&A and Post-Acquisition Monitoring use the same signals but ask different questions. Switch lenses and the entire page — valuation framing, decisions, data room context — reconfigures instantly.',
   target:'.scen-bar',
   enter:function(){
     var el=document.querySelector('.scen-bar');
     if(el)el.scrollIntoView({behavior:'smooth',block:'center'});
   }
  },
  {title:'Financial Signals',
   text:'Cash flow consistency, EBITDA quality, and governance gaps — pre-loaded from structured intake, no manual upload. The CFO layer tells you exactly where the numbers are soft before you sign.',
   target:'#sec-cfo',
   enter:function(){
     var b=_tourScenBtn('macc');if(b)setScenario('macc',b);
     var t=_tourTabBtn('cfo');if(t)setTab('cfo',t);
     setTimeout(function(){var el=document.getElementById('sec-cfo');if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},300);
   }
  },
  {title:'Technology Risk',
   text:'Application portfolio compression, cloud waste, and automation deficit combine for −1.3x floor compression. These are the numbers that justify adjusting your offer — and that the target can remediate post-close.',
   target:'#sec-cto',
   enter:function(){
     var t=_tourTabBtn('cto');if(t)setTab('cto',t);
     setTimeout(function(){var el=document.getElementById('sec-cto');if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},300);
   }
  },
  {title:'CXO Adviser',
   text:'Every domain has a live AI adviser that knows the company data. Ask anything — or run a guided scenario to generate a board-ready business case, project plan, or vendor scorecard in minutes.',
   target:'#advDrawer',
   enter:function(){
     var t=_tourTabBtn('all');if(t)setTab('all',t);
     openAdviser('cto');
   },
   leave:function(){
     var o=document.getElementById('advOverlay'),d=document.getElementById('advDrawer');
     if(o)o.classList.remove('open');if(d)d.classList.remove('open');
   }
  },
  {title:'Ready to see this on a real company?',
   text:'Vantage delivers a full Frictionless Physical in 48 hours — structured data intake, live signals, and adviser access from day one.',
   target:null,cta:true,
   enter:function(){
     var o=document.getElementById('advOverlay'),d=document.getElementById('advDrawer');
     if(o)o.classList.remove('open');if(d)d.classList.remove('open');
   }
  }
];

var tourState={active:false,step:0};

function startTour(){tourState.active=true;tourState.step=0;document.getElementById('tourOverlay').style.display='block';_tourRender();}

function tourNext(){
  var cur=tourSteps[tourState.step];if(cur.leave)cur.leave();
  if(tourState.step>=tourSteps.length-1){tourEnd();return;}
  tourState.step++;_tourRender();
}
function tourPrev(){if(tourState.step===0)return;tourState.step--;_tourRender();}

function tourEnd(){
  tourState.active=false;
  ['tourOverlay','tourSpot','tourCard'].forEach(function(id){var el=document.getElementById(id);if(el)el.style.display='none';});
  var cur=tourSteps[tourState.step];if(cur&&cur.leave)cur.leave();
  closeSimTray();
  var o=document.getElementById('advOverlay'),d=document.getElementById('advDrawer');
  if(o)o.classList.remove('open');if(d)d.classList.remove('open');
}

function _tourSpot(targetEl){
  var spot=document.getElementById('tourSpot');
  if(!targetEl){spot.style.display='none';return;}
  spot.style.display='block';
  setTimeout(function(){
    var r=targetEl.getBoundingClientRect(),pad=12;
    spot.style.left=(r.left-pad)+'px';spot.style.top=(r.top-pad)+'px';
    spot.style.width=(r.width+pad*2)+'px';spot.style.height=(r.height+pad*2)+'px';
  },380);
}

function _tourCard(stepIdx,targetEl){
  var card=document.getElementById('tourCard');
  var s=tourSteps[stepIdx];
  var isLast=stepIdx===tourSteps.length-1;
  card.innerHTML=
    '<div class="tc-prog">Step '+(stepIdx+1)+' of '+tourSteps.length+'</div>'+
    '<div class="tc-title">'+s.title+'</div>'+
    '<div class="tc-text">'+s.text+'</div>'+
    (s.cta?'<div class="tc-ctas"><a href="'+TOUR_PHYSICAL_URL+'" class="tc-cta1">Start your free Physical →</a><a href="'+TOUR_PARTNER_URL+'" class="tc-cta2">Become a design partner →</a></div>':'')+
    '<div class="tc-nav">'+
      (stepIdx>0?'<button class="tc-back" onclick="tourPrev()">← Back</button>':'')+
      '<div style="margin-left:auto;display:flex;gap:8px">'+
        '<button class="tc-exit" onclick="tourEnd()">Exit tour</button>'+
        (!isLast?'<button class="tc-fwd" onclick="tourNext()">Next →</button>':'')+
      '</div>'+
    '</div>';
  card.style.display='block';
  if(!targetEl){
    card.style.cssText='display:block;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1002;width:420px;max-width:92vw;background:#fff;border-radius:16px;padding:32px 36px;box-shadow:0 28px 80px rgba(0,0,0,0.35),0 0 0 1px rgba(0,0,0,0.05)';
  } else {
    card.style.cssText='display:block;position:fixed;z-index:1002;width:380px;max-width:92vw;background:#fff;border-radius:16px;padding:24px 28px;box-shadow:0 24px 72px rgba(0,0,0,0.32),0 0 0 1px rgba(0,0,0,0.05)';
    setTimeout(function(){
      var r=targetEl.getBoundingClientRect(),cw=card.offsetWidth||380,ch=card.offsetHeight||260;
      var vw=window.innerWidth,vh=window.innerHeight,pad=16,left,top;
      if(r.right+cw+pad<vw){left=r.right+pad;top=Math.max(pad,Math.min(r.top,vh-ch-pad));}
      else if(r.left-cw-pad>0){left=r.left-cw-pad;top=Math.max(pad,Math.min(r.top,vh-ch-pad));}
      else if(r.bottom+ch+pad<vh){left=Math.max(pad,r.left);top=r.bottom+pad;}
      else{left=Math.max(pad,r.left);top=Math.max(pad,r.top-ch-pad);}
      card.style.left=left+'px';card.style.top=top+'px';
    },390);
  }
}

function _tourRender(){
  var s=tourSteps[tourState.step];
  if(s.enter)s.enter();
  var targetEl=s.target?document.querySelector(s.target):null;
  _tourSpot(targetEl);
  _tourCard(tourState.step,targetEl);
}

function _tourInit(){
  document.body.insertAdjacentHTML('beforeend',
    '<div id="tourOverlay" style="display:none;position:fixed;inset:0;z-index:999;pointer-events:none"></div>'+
    '<div id="tourSpot" style="display:none;position:fixed;z-index:1000;border-radius:10px;box-shadow:0 0 0 9999px rgba(10,15,40,0.72);pointer-events:none;transition:left .3s ease,top .3s ease,width .3s ease,height .3s ease"></div>'+
    '<div id="tourCard" style="display:none"></div>');
  var css=document.createElement('style');
  css.textContent=
    '.tc-prog{font-size:11px;color:var(--tmu);letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px}'+
    '.tc-title{font-family:var(--fd);font-size:20px;font-weight:600;color:var(--navy);margin-bottom:10px;line-height:1.3}'+
    '.tc-text{font-size:14px;color:var(--tm);line-height:1.65;margin-bottom:20px}'+
    '.tc-ctas{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}'+
    '.tc-cta1,.tc-cta2{display:block;text-decoration:none;padding:13px 20px;border-radius:var(--rp);font-size:14px;font-weight:500;text-align:center;font-family:var(--fb);transition:opacity .15s}'+
    '.tc-cta1{background:var(--navy);color:#fff}.tc-cta1:hover{opacity:.85}'+
    '.tc-cta2{background:var(--gold);color:var(--navy)}.tc-cta2:hover{opacity:.85}'+
    '.tc-nav{display:flex;align-items:center}'+
    '.tc-back{background:none;border:1px solid var(--bd);color:var(--tm);padding:8px 16px;border-radius:var(--rp);font-size:13px;cursor:pointer;font-family:var(--fb)}.tc-back:hover{border-color:var(--navy);color:var(--navy)}'+
    '.tc-fwd{background:var(--navy);color:#fff;border:none;padding:9px 20px;border-radius:var(--rp);font-size:13px;font-weight:500;cursor:pointer;font-family:var(--fb)}.tc-fwd:hover{opacity:.85}'+
    '.tc-exit{background:none;border:none;color:var(--tmu);font-size:12px;cursor:pointer;font-family:var(--fb);padding:8px}.tc-exit:hover{color:var(--text)}';
  document.head.appendChild(css);
}

// ─── GHL DOM-READY INIT ───────────────────────────────────────────────────
// GHL custom HTML blocks embed our fragment inside their own page shell.
// Scripts may execute before all DOM elements are parsed.
// This guard ensures init runs only once the DOM is fully ready,
// and moves position:fixed elements to document.body so they aren't
// trapped inside any GHL section that has CSS transform (which breaks fixed).
function ghlReady(fn){
  if(document.readyState!=='loading'){setTimeout(fn,0)}
  else{document.addEventListener('DOMContentLoaded',fn)}
}

function _ensureShells(){
  // Inject sim tray + open button if missing from HTML
  if(!document.getElementById('simTray')){
    document.body.insertAdjacentHTML('beforeend',
      '<div id="simTray" class="sim-tray">'+
        '<div class="sim-tray-hd"><span class="sim-tray-t">Remediation Simulator</span><button class="sim-close-btn" onclick="closeSimTray()">&#x2715;</button></div>'+
        '<div class="sim-body">'+
          '<input class="sim-search" type="text" placeholder="Filter levers\u2026" oninput="filterSim(this.value)">'+
          '<div id="simLevers"></div>'+
          '<div class="sim-result" style="margin-top:1rem">'+
            '<div class="sim-r-lbl">Simulated outcome</div>'+
            '<div class="sim-r-row"><span class="sim-r-k">New floor EV</span><span class="sim-r-v" id="sr-floor">\u2014</span></div>'+
            '<div class="sim-r-row"><span class="sim-r-k">New ceiling EV</span><span class="sim-r-v" id="sr-ceil">\u2014</span></div>'+
            '<div class="sim-r-row"><span class="sim-r-k">At-stake spread</span><span class="sim-r-v" id="sr-spread">\u2014</span></div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<button id="simOpenBtn" class="sim-open-btn" onclick="openSimTray()">Simulator</button>'
    );
  }
  // Inject adviser overlay + drawer if missing from HTML
  if(!document.getElementById('advOverlay')){
    document.body.insertAdjacentHTML('beforeend',
      '<div id="advOverlay" class="adv-overlay" onclick="closeAdviser()"></div>'+
      '<div id="advDrawer" class="adv-drawer">'+
        '<div class="adv-hd">'+
          '<div><div class="adv-ey">CXO Adviser \u00b7 Vantage AI</div><div class="adv-title" id="advTitle">Adviser</div><div class="adv-domain" id="advDomain"></div></div>'+
          '<button class="adv-close-btn" onclick="closeAdviser()">&#x2715;</button>'+
        '</div>'+
        '<div class="adv-msgs" id="advMsgs"></div>'+
        '<div class="adv-sugg" id="advSugg" style="display:none">'+
          '<div class="adv-sugg-lbl">Suggested questions</div>'+
          '<div id="advPills" style="display:flex;flex-wrap:wrap;gap:6px"></div>'+
        '</div>'+
        '<div class="adv-input-row">'+
          '<input class="adv-input" id="advInput" type="text" placeholder="Ask a follow-up question\u2026" onkeydown="if(event.key===\'Enter\')sendToAdviser()">'+
          '<button class="adv-send" onclick="sendToAdviser()">Send</button>'+
        '</div>'+
      '</div>'
    );
  }
}

ghlReady(function(){
  _ensureShells();
  // Escape GHL transformed containers — move fixed-position elements to body root
  ['simTray','simOpenBtn','advOverlay','advDrawer'].forEach(function(id){
    var el=document.getElementById(id);
    if(el&&el.parentNode!==document.body)document.body.appendChild(el);
  });
  _tourInit();
  // Run all DOM-dependent init
  renderEnv(BASE-bC,BASE+bE);
  buildSim();
  renderCTO();renderCRO();renderCHRO();renderCFO();renderCOO();
  renderDecisionsPanel();
});


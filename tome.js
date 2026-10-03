/* Generated from the Lazy DM Tome. Runs inside the main page (no iframe). */
(function(){

// ══════════════════════════════════════════════════════
//  CONFIG — edit these to match your GitHub repo
// ══════════════════════════════════════════════════════
const GITHUB_CONFIG = {
  user: 'Lachiee',
  repo: 'DnD_Lucia',
  branch: 'main',
  folder: 'characters',   // ← lowercase — GitHub stores it as 'characters'
  characterFiles: [
    'stuart-warryn.json',
    'jon-dorrik.json',
    'jason-derrick.json',
    'jordan-sarick.json'
  ]
};
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_CONFIG.user}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.folder}/`;


// ══════════════════════════════════════════════════════
//  DELEGATED EVENT DISPATCH (replaces inline onclick)
// ══════════════════════════════════════════════════════
document.addEventListener('click', function(e) {
  const el = e.target.closest('[data-ac]');
  if (!el) return;
  const ac = el.getAttribute('data-ac');
  // Tab switching
  if (ac.startsWith('tab-')) { sw(ac.slice(4), el); return; }
  // Function dispatch
  const fnMap = {
    'fn-loadGH': loadGH,
    'fn-openParse': openParseModal,
    'fn-addHook': addHook,
    'fn-addScene': addScene,
    'fn-addEnc': addEnc,
    'fn-addSecret': addSecret,
    'fn-addLoc': addLoc,
    'fn-addNPC': addNPC,
    'fn-addMon': addMon,
    'fn-addTreas': addTreas,
    'fn-nextTurn': nextTurn,
    'fn-resetCombat': resetCombat,
    'fn-applyDmg': applyDmg,
    'fn-applyHeal': applyHeal,
    'fn-addCond': addCond,
    'fn-addCombatant': addCombatant,
    'fn-rollAllInit': rollAllInit,
    'fn-addFromChars': addFromChars,
    'fn-addFaction': addFaction,
    'fn-loadHistSession': loadHistSession,
    'fn-fileUpload': () => document.getElementById('file-upload').click(),
    'fn-saveAll': saveAll,
    'fn-loadSave': loadSave,
    'fn-exportSession': exportSession,
    'fn-print': () => window.print(),
    'fn-clearAll': clearAll,
    'fn-loadSessionFile': () => document.getElementById('session-file-input').click(),
    'fn-loadSessionURL': openSessionURLModal,
    'fn-loadSessionURLConfirm': loadSessionFromURL,
    'fn-closeSessionURLModal': closeSessionURLModal,
    'fn-addConseq': addConseq,
    'fn-genNPC': genNPC,
    'fn-genNPCSend': genNPCSend,
    'fn-genNPCCopy': genNPCCopy,
    'fn-genLoc': genLoc,
    'fn-genLocSend': genLocSend,
    'fn-genEnc': genEnc,
    'fn-genEncSend': genEncSend,
    'fn-genSec': genSec,
    'fn-genSecSend': genSecSend,
    'fn-genTown': genTown,
    'fn-genTownSend': genTownSend,
    'fn-genItem': genItem,
    'fn-genItemSend': genItemSend,
    'fn-genTrap': genTrap,
    'fn-genStart': genStart,
    'fn-genStartSend': genStartSend,
    'fn-genFork': genFork,
    'fn-genForkSend': genForkSend,
    'fn-genForkCopy': genForkCopy,
    'fn-addFork': addFork,
    'fn-calcBench': calcBenchmark,
    'fn-benchFromSheets': benchFromSheets,
    'fn-openPrepCheck': openPrepCheck,
    'fn-closePrepCheck': closePrepCheck,
    'fn-renderRun': renderRunMode,
    'fn-csOpenAll': ()=>document.querySelectorAll('.cs-card').forEach(d=>{ if(!document.getElementById('body-'+d.id).classList.contains('open')) toggleCS(d.id); }),
    'fn-csCloseAll': ()=>document.querySelectorAll('.cs-card').forEach(d=>{ if(document.getElementById('body-'+d.id).classList.contains('open')) toggleCS(d.id); }),
    'fn-printSheet': printPrepSheet,
    'fn-newKit': ()=>{ if(!improvKit || confirm('Replace the current improv kit with a new one?')){ improvKit=newImprovKit(); renderKit(); } },
    'fn-closeCombatPanel': closeCombatPanel,
    'fn-openNextSession': openNextSession,
    'fn-closeNextSession': closeNextSession,
    'fn-startNextExport': ()=>startNextSession(true),
    'fn-startNextNoExport': ()=>startNextSession(false),
    'fn-partyShortRest': ()=>partyRest('short'),
    'fn-partyLongRest': ()=>partyRest('long'),
    'fn-loadCarryForward': loadCarryForward,
    'fn-closeParse': closeParseModal,
    'fn-parseAndLoad': parseAndLoad,
    'fn-tabsLeft': () => {},
    'fn-tabsRight': () => {},
    'fn-webAddNode': webAddNodeDispatch,
    'fn-webAddRel': webAddRelDispatch,
    'fn-webDeleteNode': webDeleteNodeDispatch,
    'fn-webClosePanel': webClosePanelDispatch,
    'fn-webReset': webResetDispatch,
    'fn-webSave': webSaveDispatch,
    'fn-filterMonsters': filterMonsters,
    'fn-rollMonstersInit': rollMonstersInit,
    'fn-toggleShare': toggleShare,
    'fn-toggleHideNames': toggleHideNames,
  };
  if (fnMap[ac]) fnMap[ac](e);
});

// ══════════════════════════════════════════════════════
//  TAB SWITCHING
// ══════════════════════════════════════════════════════
function sw(name,el){
  const root=document.getElementById('tome'); if(!root) return;
  const pane=document.getElementById('tab-'+name); if(!pane) return;
  root.querySelectorAll('.pane').forEach(p=>p.classList.remove('active'));
  root.querySelectorAll('.tb').forEach(b=>b.classList.remove('active'));
  pane.classList.add('active');
  if(el)el.classList.add('active');
  else{const btn=root.querySelector('[data-ac="tab-'+name+'"]');if(btn)btn.classList.add('active');}
  if(name==='init'&&typeof window.__tomeFightRefresh==='function') window.__tomeFightRefresh();
  if(typeof window.__growAll==='function') window.__growAll();
  if(typeof window.__tomeOnPane==='function') window.__tomeOnPane(name);
}

// ══════════════════════════════════════════════════════
//  CARD FACTORY
// ══════════════════════════════════════════════════════
function mkCard(listId,fields){
  const list=document.getElementById(listId);if(!list)return null;
  const card=document.createElement('div');card.className='card';
  fields.forEach(row=>{
    const rowEl=document.createElement('div');
    rowEl.className='cr '+(row.cols===2?'c2':row.cols===3?'c3':row.cols===4?'c4':row.cols===5?'c5':'');
    row.items.forEach(f=>{
      const wrap=document.createElement('div');
      if(f.span)wrap.style.gridColumn='1/-1';
      const lbl=document.createElement('label');lbl.textContent=f.label;wrap.appendChild(lbl);
      let inp;
      if(f.type==='textarea'){inp=document.createElement('textarea');inp.rows=f.rows||2;}
      else{inp=document.createElement('input');inp.type='text';}
      inp.placeholder=f.placeholder||'';inp.dataset.key=f.key;wrap.appendChild(inp);rowEl.appendChild(wrap);
    });
    card.appendChild(rowEl);
  });
  const rm=document.createElement('button');rm.className='rbtn';rm.textContent='✕';rm.onclick=()=>card.remove();
  card.appendChild(rm);list.appendChild(card);return card;
}

function addHook(){mkCard('hook-list',[
  {cols:2,items:[{key:'hk-char',label:'Character',placeholder:'Warryn'},{key:'hk-player',label:'Player',placeholder:'Stuart'}]},
  {cols:1,items:[{key:'hk-text',label:'Session Hook',type:'textarea',rows:2,placeholder:'What connects this character to this session?',span:true}]}
]);}
function addScene(){mkCard('scenes-list',[
  {cols:3,items:[{key:'sc-name',label:'Scene',placeholder:'Ambush at the Ford'},{key:'sc-type',label:'Type',placeholder:'Combat/Social/Explore'},{key:'sc-trig',label:'Trigger',placeholder:'What causes this?'}]},
  {cols:1,items:[{key:'sc-notes',label:'Notes',type:'textarea',rows:1,placeholder:'Stakes, key beats, possible outcomes…',span:true}]}
]);}
let encN=0;
function addEnc(){
  encN++;const list=document.getElementById('enc-list');
  const card=document.createElement('div');card.className='enc-card';
  card.innerHTML=`<div class="enc-num">Encounter ${encN}</div>
    <div class="cr c2"><div><label>Name</label><input type="text" data-key="en-name" placeholder="e.g. Goblin Ambush"></div><div><label>Difficulty</label><input type="text" data-key="en-diff" placeholder="Easy/Medium/Hard/Deadly"></div></div>
    <div class="cr c2" style="margin-top:.4rem"><div><label>Location</label><input type="text" data-key="en-loc" placeholder="Where?"></div><div><label>Monsters</label><input type="text" data-key="en-mon" placeholder="e.g. 4 Goblins, 1 Bugbear"></div></div>
    <div style="margin-top:.4rem"><label>Tactics &amp; Memorable Elements</label><textarea rows="2" data-key="en-notes" placeholder="How might it end non-violently? What do enemies want?"></textarea></div>
    <button class="rbtn" class="rbtn enc-rm">✕</button>`;
  const rmb=card.querySelector('.enc-rm');
  if(rmb)rmb.addEventListener('click',()=>card.remove());
  list.appendChild(card);
}
function addSecret(){mkCard('secrets-list',[
  {cols:1,items:[{key:'sec',label:'Secret / Clue',type:'textarea',rows:2,placeholder:"e.g. The blacksmith is a wererat informant. (Don't decide HOW they discover this — leave it for the table.)"}]}
]);}
function addLoc(){mkCard('loc-list',[
  {cols:3,items:[{key:'lo-name',label:'Name',placeholder:'Hall of Storms'},{key:'lo-type',label:'Type',placeholder:'Dungeon/City/Wilds'},{key:'lo-scale',label:'Scale',placeholder:'Room/District/Region'}]},
  {cols:1,items:[{key:'lo-desc',label:'Evocative Description (senses)',type:'textarea',rows:1,placeholder:'Stench of brine, drowned shadows…',span:true}]},
  {cols:1,items:[{key:'lo-asp',label:'Fantastic Aspects (1–3 interactive features)',type:'textarea',rows:1,placeholder:'Lightning-charged throne, pit dropping to sky below…',span:true}]}
]);}
function addNPC(){mkCard('npc-list',[
  {cols:3,items:[{key:'np-name',label:'Name',placeholder:'Mira Ashveil'},{key:'np-role',label:'Role',placeholder:'Innkeeper / Spy'},{key:'np-fac',label:'Allegiance',placeholder:'Harpers'}]},
  {cols:2,items:[{key:'np-trait',label:'One Distinguishing Trait',placeholder:'Never makes eye contact'},{key:'np-want',label:'What They Want',placeholder:'Find missing brother'}]},
  {cols:2,items:[{key:'np-goal',label:'Active Quest / Goal',placeholder:'What are they doing to get it?'},{key:'np-fic',label:'Based On (fiction)',placeholder:'e.g. Tyrion Lannister'}]},
  {cols:1,items:[{key:'np-notes',label:'Notes / Secrets',type:'textarea',rows:1,placeholder:'Hooks, attitude to party…',span:true}]}
]);}
function addMon(){
  const card = mkCard('mon-list',[
    {cols:5,items:[{key:'mn-name',label:'Name',placeholder:'Vampire Spawn'},{key:'mn-cr',label:'CR',placeholder:'5'},{key:'mn-hp',label:'HP',placeholder:'82'},{key:'mn-ac',label:'AC',placeholder:'15'},{key:'mn-n',label:'Count',placeholder:'2'}]},
    {cols:2,items:[{key:'mn-mot',label:'Motivation',placeholder:'Feed and obey Strahd'},{key:'mn-tac',label:'Tactics',placeholder:'Bite first, charm if outnumbered'}]},
    {cols:1,items:[{key:'mn-notes',label:'What Makes This Monster Interesting?',type:'textarea',rows:1,placeholder:'Beyond the stat block…',span:true}]}
  ]);
  if(card) addInitBtnToMonCard(card);
}

function addInitBtnToMonCard(card){
  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'margin-top:.5rem;display:flex;gap:.4rem;flex-wrap:wrap;align-items:center';

  function getMonData(){
    const name  = (card.querySelector('[data-key="mn-name"]')?.value || 'Monster').trim();
    const hp    = parseInt(card.querySelector('[data-key="mn-hp"]')?.value)  || 10;
    const ac    = parseInt(card.querySelector('[data-key="mn-ac"]')?.value)  || 10;
    const count = Math.max(1, parseInt(card.querySelector('[data-key="mn-n"]')?.value) || 1);
    return {name, hp, ac, count};
  }

  function pushToTracker(rollRandom, splitByInit){
    const {name, hp, ac, count} = getMonData();
    if(count > 1 && splitByInit){
      // Each member gets their own initiative — add as individual rows
      for(let i=0;i<count;i++){
        const roll = Math.floor(Math.random()*20)+1;
        let finalName = `${name} ${i+1}`;
        let n = 2;
        while(combatants.find(x=>x.name===finalName)){ finalName=`${name} ${i+1} (${n++})`; }
        combatants.push({name:finalName, type:'monster', initiative:roll,
          hp, hpMax:hp, ac, dex:(findMonsterData(name)||{}).dex||10, conditions:[]});
      }
    } else if(count > 1){
      // Group with shared initiative, but store individual rolls on members if rolling
      const groupRoll = rollRandom ? Math.floor(Math.random()*20)+1 : 0;
      let groupName = name;
      let n = 2;
      while(combatants.find(x=>x.name===groupName && x.isGroup)){ groupName=`${name} (${n++})`; }
      const members = Array.from({length:count},(_,i)=>({
        name:`${name} ${i+1}`, hp, hpMax:hp, conditions:[], dead:false,
        initiative: rollRandom ? Math.floor(Math.random()*20)+1 : groupRoll
      }));
      combatants.push({name:groupName, type:'monster', initiative:groupRoll,
        hp, hpMax:hp, ac, dex:(findMonsterData(name)||{}).dex||10, conditions:[], isGroup:true, count, members, expanded:false});
    } else {
      const roll = rollRandom ? Math.floor(Math.random()*20)+1 : 0;
      let finalName = name;
      let n = 2;
      while(combatants.find(x=>x.name===finalName)){ finalName=`${name} (${n++})`; }
      combatants.push({name:finalName, type:'monster', initiative:roll,
        hp, hpMax:hp, ac, dex:(findMonsterData(name)||{}).dex||10, conditions:[]});
    }
    combatants.sort((a,b)=>b.initiative-a.initiative);
    renderInitList();
    updateInitSelects();
    toast('Added '+(count>1?count+' × ':'')+name+' to the fight','Open Combat',()=>sw('init'));
  }

  const initBtn = document.createElement('button');
  initBtn.className = 'abtn';
  initBtn.style.cssText = 'border-color:var(--red);color:var(--red);font-size:calc(max(.62,.8)*var(--tu))';
  initBtn.textContent = '⚔ Add to fight';
  initBtn.dataset.role = 'add-init';
  initBtn.addEventListener('click', () => {
    const {count} = getMonData();
    pushToTracker(false);
    initBtn.textContent = count>1 ? `✓ Group of ${count} added` : '✓ Added';
    initBtn.style.background = 'rgba(139,26,26,.1)';
    setTimeout(()=>{ initBtn.textContent='⚔ Add to fight'; initBtn.style.background=''; }, 1800);
  });

  const rollInitBtn = document.createElement('button');
  rollInitBtn.className = 'abtn';
  rollInitBtn.style.cssText = 'font-size:calc(max(.62,.8)*var(--tu))';
  rollInitBtn.textContent = '🎲 Add + roll';
  rollInitBtn.dataset.role = 'roll-init';
  rollInitBtn.addEventListener('click', () => {
    const {count} = getMonData();
    pushToTracker(true);
    rollInitBtn.textContent = count>1 ? `✓ Group rolled & added` : '✓ Rolled & added';
    rollInitBtn.style.background = 'rgba(180,130,60,.15)';
    setTimeout(()=>{ rollInitBtn.textContent='🎲 Add + roll'; rollInitBtn.style.background=''; }, 1800);
  });

  const splitInitBtn = document.createElement('button');
  splitInitBtn.className = 'abtn';
  splitInitBtn.style.cssText = 'font-size:calc(max(.62,.8)*var(--tu));border-color:var(--blue);color:var(--blue)';
  splitInitBtn.textContent = '🎲 Add + roll each';
  splitInitBtn.dataset.role = 'roll-indiv';
  splitInitBtn.title = 'Roll a separate initiative for each monster — adds them as individual rows';
  splitInitBtn.addEventListener('click', () => {
    const {count} = getMonData();
    if(count < 2){ pushToTracker(true, false); }
    else { pushToTracker(true, true); }
    splitInitBtn.textContent = `✓ ${count} individual rolls`;
    splitInitBtn.style.background = 'rgba(26,42,74,.1)';
    setTimeout(()=>{ splitInitBtn.textContent='🎲 Add + roll each'; splitInitBtn.style.background=''; }, 1800);
  });

  btnRow.appendChild(initBtn);
  btnRow.appendChild(rollInitBtn);
  btnRow.appendChild(splitInitBtn);
  card.appendChild(btnRow);
}
function addTreas(){mkCard('treas-list',[
  {cols:4,items:[{key:'tr-name',label:'Item / Reward',placeholder:'+1 Longsword'},{key:'tr-type',label:'Type',placeholder:'Magic/Coin/Info'},{key:'tr-meth',label:'Method',placeholder:'Chosen/Random'},{key:'tr-for',label:'Best For',placeholder:'Character or Any'}]},
  {cols:1,items:[{key:'tr-desc',label:'Description / Lore',type:'textarea',rows:1,placeholder:'Where found, what it does…',span:true}]}
]);}
function addFaction(){mkCard('faction-list',[
  {cols:3,items:[{key:'fa-name',label:'Faction',placeholder:'Iron Circle'},{key:'fa-att',label:'Attitude',placeholder:'Hostile/Neutral/Allied'},{key:'fa-pow',label:'Resources',placeholder:'Mercenaries, noble…'}]},
  {cols:2,items:[{key:'fa-goal',label:'What They Want',placeholder:'Control trade routes…'},{key:'fa-act',label:'Current Action',placeholder:'What are they doing now?'}]},
  {cols:1,items:[{key:'fa-notes',label:'Notes',type:'textarea',rows:1,placeholder:'Key members, recent events…',span:true}]}
]);}

// ══════════════════════════════════════════════════════
//  CHARACTER SHEET RENDERING
// ══════════════════════════════════════════════════════
const loadedChars=[];
let pendingCharHooks={};
let revealedSecrets=[];
let pcState={};
let improvKit=null;
const loadedUrls=new Set();

function mod(s){const m=Math.floor((s-10)/2);return(m>=0?'+':'')+m;}

function renderChar(c){
  const container=document.getElementById('char-sheets');
  const sid='cs-'+c.name.replace(/[^a-z0-9]/gi,'-').toLowerCase();
  if(document.getElementById(sid))return;
  loadedChars.push(c);updateInitSelects();

  const E=s=>String(s==null?'':s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const short=(c.name||'Character').split(' ')[0];
  const rest=(c.name||'').split(' ').slice(1).join(' ');
  const stats=c.stats||[10,10,10,10,10,10];
  const abil=['Strength','Dexterity','Constitution','Intelligence','Wisdom','Charisma'];
  const abbr=['STR','DEX','CON','INT','WIS','CHA'];
  const hpMax=c.hp_max||c.hp||'?';
  const hpCur=c.hp_current!==undefined?c.hp_current:hpMax;
  const savesArr=Array.isArray(c.saves)?c.saves:String(c.saves||'').split(',').map(s=>s.trim()).filter(Boolean);
  const pb=c.proficiency||c.proficiencyBonus||2;
  const pp=c.passive_perception||(10+Math.floor(((stats[4]||10)-10)/2));
  const casting=(c.spellcasting||[]);
  const castText=casting.map(s=>s.desc||'').join(' ');
  const dcM=castText.match(/save DC\s*(\d+)/i), atkM=castText.match(/attack\s*\+(\d+)/i);
  const isPersonality=f=>/^personality$/i.test(f.name||'');
  const isDMNote=f=>/dm note/i.test(f.name||'');
  const featList=[...(c.class_features||c.features||[]),...(c.traits||[])].filter(f=>f&&typeof f==='object'&&!isPersonality(f)&&!isDMNote(f));
  const dmNotes=[...(c.class_features||[]),...(c.traits||[])].filter(f=>f&&isDMNote(f));
  const personality=(c.traits||[]).find(isPersonality);
  const actions=(c.actions||[]).filter(a=>a&&!/^cast a spell$/i.test(a.name||''));
  const lvl=parseInt(c.level)||'?';

  // Header pills
  const pill=(label,val,cls)=>`<span class="cs-pill${cls?' '+cls:''}"><span class="cs-pill-l">${label}</span>${E(val)}</span>`;
  const hpCls=(typeof hpCur==='number'&&typeof hpMax==='number'&&hpCur<hpMax/2)?'is-low':'';
  const pills=[pill('AC',c.ac||'?'),pill('HP',`${hpCur}/${hpMax}`,hpCls),pill('Speed',(c.speed||'30 ft.').replace(/\s*ft\.?/,' ft')),pill('Perception',pp)];
  if(dcM) pills.push(pill('Spell DC',dcM[1]));

  // Combat tab
  const firstSentence=t=>{ const s=String(t||''); const m=s.match(/^(.{20,160}?[.!?])(\s|$)/); return m?m[1]:(s.length>160?s.slice(0,157)+'…':s); };
  const abilHtml=stats.map((v,i)=>{
    const m=Math.floor(((v||10)-10)/2), sv=savesArr.find(s=>s.toLowerCase().startsWith(abbr[i].toLowerCase())||s.toLowerCase().startsWith(abil[i].toLowerCase()));
    return `<div class="cs-ab${sv?' is-prof':''}" title="${abil[i]} ${v}">
      <div class="cs-ab-l">${abbr[i]}</div><div class="cs-ab-m">${m>=0?'+':''}${m}</div><div class="cs-ab-s">${v||10}</div>
      ${sv?`<div class="cs-ab-save">Save ${E(sv.replace(/^[A-Za-z]+\s*/,''))}</div>`:''}</div>`;
  }).join('');
  const attackHtml=actions.length?actions.map(a=>{
    const d=a.desc||'', hit=d.match(/([+-]\d+)\s*to hit/i), dmg=d.match(/Hit:\s*([^.]+)/i);
    return `<div class="cs-atk"><div class="cs-atk-n">${E(a.name)}</div>
      <div class="cs-atk-d">${hit||dmg?`${hit?`<b>${E(hit[1])}</b> to hit`:''}${hit&&dmg?', ':''}${dmg?E(dmg[1].trim()):''}`:E(d)}</div></div>`;
  }).join(''):'<p class="cs-empty">No attacks listed on the sheet.</p>';
  const skillItems=(c.skills||[]).map(s=>{ const m=String(s).match(/^(.*?)\s*([+-]\d+)$/); return m?{n:m[1],v:parseInt(m[2])}:{n:String(s),v:null}; })
    .sort((a,b)=>(b.v??-99)-(a.v??-99));
  const skillHtml=skillItems.length?`<ul class="cs-skills">${skillItems.map(s=>`<li><span>${E(s.n)}</span><b>${s.v===null?'':(s.v>=0?'+':'')+s.v}</b></li>`).join('')}</ul>`:'<p class="cs-empty">No skills listed.</p>';
  let resHtml='';
  if(typeof pcTrackers==='function'){
    const trs=pcTrackers(c);
    if(trs.length) resHtml=`<h4 class="cs-h">Limited resources</h4><ul class="cs-res">${trs.map(t=>`<li><span>${E(t.label)}</span><b>${t.max}</b><i>${t.reset==='combat'?'per fight':t.reset==='short'?'short rest':'long rest'}</i></li>`).join('')}</ul>`;
  }

  // Spells tab
  const spellNames=(c.spells||[]).map(s=>typeof s==='object'?(s.name||''):String(s)).filter(Boolean);
  const cantrips=spellNames.filter(s=>/cantrip/i.test(s)), leveled=spellNames.filter(s=>!/cantrip/i.test(s));
  const spellTab=(spellNames.length||casting.length)?`
    ${dcM||atkM?`<div class="cs-spellstats">${dcM?`<div><span>Save DC</span><b>${dcM[1]}</b></div>`:''}${atkM?`<div><span>Spell attack</span><b>+${atkM[1]}</b></div>`:''}</div>`:''}
    ${casting.map(s=>`<p class="cs-text"><b>${E(s.name||'Spellcasting')}.</b> ${E(s.desc||'')}</p>`).join('')}
    ${leveled.length?`<h4 class="cs-h">Spells</h4><ul class="cs-spells">${leveled.map(s=>`<li>${E(s)}</li>`).join('')}</ul>`:''}
    ${cantrips.length?`<h4 class="cs-h">Cantrips</h4><ul class="cs-spells">${cantrips.map(s=>`<li>${E(s.replace(/\s*\(cantrip[^)]*\)/i,''))}</li>`).join('')}</ul>`:''}`:'';

  // Features tab
  const featTab=featList.length?featList.map(f=>{
    const d=f.desc||'', fs=firstSentence(d), more=d.length>fs.length+2;
    return more?`<details class="cs-feat"><summary><b>${E(f.name)}</b><span>${E(fs)}</span></summary><p>${E(d)}</p></details>`
               :`<div class="cs-feat cs-feat-plain"><b>${E(f.name)}</b><span>${E(d)}</span></div>`;
  }).join(''):'<p class="cs-empty">No features listed.</p>';

  // Story tab
  const goals=(c.goals||[]);
  const backstory=c.backstory||(c.notes&&c.notes.backstory)||'';
  const notes=typeof c.notes==='string'?c.notes:'';
  const storyTab=`
    ${goals.length?`<h4 class="cs-h">Wants</h4><ul class="cs-goals">${goals.map(g=>`<li>${E(g)}</li>`).join('')}</ul>`:''}
    ${personality?`<h4 class="cs-h">Personality</h4>${String(personality.desc||'').split(/(?<=\.)\s+(?=(?:Traits?|Ideals?|Bonds?|Flaws?)\s*:)/).map(p=>`<p class="cs-text">${E(p).replace(/^(Traits?|Ideals?|Bonds?|Flaws?):/,'<b>$1:</b>')}</p>`).join('')}`:''}
    ${backstory?`<h4 class="cs-h">Backstory</h4>${String(backstory).split(/\n\s*\n|\n/).filter(Boolean).map(p=>`<p class="cs-text">${E(p)}</p>`).join('')}`:''}
    ${notes||dmNotes.length?`<div class="cs-dmnote"><h4 class="cs-h">DM notes</h4>${notes?`<p class="cs-text">${E(notes)}</p>`:''}${dmNotes.map(n=>`<p class="cs-text">${E(n.desc||'')}</p>`).join('')}</div>`:''}`;

  // Gear tab
  const equip=(c.equipment||[]).map(e=>typeof e==='object'?(e.name||''):String(e)).filter(Boolean);
  const gearTab=`
    ${equip.length?`<ul class="cs-gear">${equip.map(e=>{ const m=e.match(/^([^(]+?)\s*(\(.*\))?$/); return `<li><b>${E(m?m[1]:e)}</b>${m&&m[2]?` <span>${E(m[2].slice(1,-1))}</span>`:''}</li>`; }).join('')}</ul>`:'<p class="cs-empty">No equipment listed.</p>'}
    <div class="cs-facts">
      <div><span>Languages</span>${E((c.languages||['Common']).join(', '))}</div>
      <div><span>Proficiency bonus</span>+${E(pb)}</div>
      ${c.background?`<div><span>Background</span>${E(c.background)}</div>`:''}
      ${c.alignment?`<div><span>Alignment</span>${E(c.alignment)}</div>`:''}
    </div>`;

  const tabs=[['combat','Combat',`
      <div class="cs-abils">${abilHtml}</div>
      <div class="cs-two">
        <div><h4 class="cs-h">Attacks</h4>${attackHtml}${resHtml}</div>
        <div><h4 class="cs-h">Skills</h4>${skillHtml}</div>
      </div>`]];
  if(spellTab) tabs.push(['spells','Spells',spellTab]);
  tabs.push(['features','Features',featTab],['story','Story',storyTab],['gear','Gear',gearTab]);

  const div=document.createElement('div');
  div.className='char-card cs-card';div.id=sid;
  div.innerHTML=`
    <button class="cs-hdr" data-char-toggle="${sid}" aria-expanded="false" aria-controls="body-${sid}">
      <span class="cs-id">
        <span class="cs-short">${E(short)}${c.inspiration?'<span class="ip-badge" title="Has Inspiration"></span>':''}</span>
        ${rest?`<span class="cs-full">${E(rest)}</span>`:''}
        <span class="cs-meta">${E([c.race,c.class?`${c.class} ${lvl}`:'',c.subclass].filter(Boolean).join(' · '))}${c.player?` · <i>${E(c.player)}</i>`:''}</span>
      </span>
      <span class="cs-pills">${pills.join('')}</span>
      <span class="chev" id="chev-${sid}" aria-hidden="true">▶</span>
    </button>
    <div class="cs-hook">
      <label for="hook-${sid}">Session hook</label>
      <input type="text" id="hook-${sid}" data-char-hook="${E(c.name)}" placeholder="What pulls ${E(short)} into this session?">
    </div>
    <div class="char-body cs-body" id="body-${sid}">
      <div class="cs-tabs" role="tablist">${tabs.map(([k,l],i)=>`<button role="tab" class="cs-tab${i===0?' on':''}" data-cs-tab="${k}" aria-selected="${i===0}">${l}</button>`).join('')}</div>
      ${tabs.map(([k,,h],i)=>`<div class="cs-panel${i===0?' on':''}" data-cs-panel="${k}" role="tabpanel">${h}</div>`).join('')}
      <div class="cs-foot"><button class="abtn" data-char-import="${sid}">⚔ Add ${E(short)} to initiative</button></div>
    </div>`;
  container.appendChild(div);
  div.querySelector('[data-char-toggle]').addEventListener('click',()=>toggleCS(sid));
  div.querySelector('[data-char-import]').addEventListener('click',()=>importToInit(sid));
  div.querySelectorAll('[data-cs-tab]').forEach(t=>t.addEventListener('click',()=>{
    div.querySelectorAll('[data-cs-tab]').forEach(x=>{ const on=x===t; x.classList.toggle('on',on); x.setAttribute('aria-selected',on); });
    div.querySelectorAll('[data-cs-panel]').forEach(p=>p.classList.toggle('on',p.dataset.csPanel===t.dataset.csTab));
  }));
  const hookInp=div.querySelector('[data-char-hook]');
  const markHook=()=>div.querySelector('.cs-hook').classList.toggle('is-empty',!hookInp.value.trim());
  if(hookInp && pendingCharHooks[c.name]!==undefined) hookInp.value=pendingCharHooks[c.name];
  hookInp.addEventListener('input',markHook); markHook();
  wrapSpellsInElement(div);
  if(typeof webSyncPCs === 'function') webSyncPCs();
}

function toggleCS(id){
  const body=document.getElementById('body-'+id);
  const chev=document.getElementById('chev-'+id);
  const open=body.classList.toggle('open');
  chev.classList.toggle('open',open);
  const hdr=document.querySelector(`[data-char-toggle="${id}"]`); if(hdr) hdr.setAttribute('aria-expanded',open);
}

// ══════════════════════════════════════════════════════
//  GITHUB LOADER
// ══════════════════════════════════════════════════════
function setGhStatus(id,type,msg){const el=document.getElementById(id);el.className='gh-status '+type;el.textContent=msg;}

async function loadGH(){
  const urlEl=document.getElementById('gh-url');
  const url=urlEl.value.trim();
  if(!url){setGhStatus('gh-status','err','Please enter a URL.');return;}
  if(loadedUrls.has(url)){setGhStatus('gh-status','err','Already loaded.');return;}
  setGhStatus('gh-status','ld','⟳ Fetching…');
  try{
    const fetchUrl=url.replace('github.com','raw.githubusercontent.com').replace('/blob/','/');;
    const res=await fetch(fetchUrl);
    if(!res.ok)throw new Error(`HTTP ${res.status}`);
    const data=await res.json();
    if(!data.name)throw new Error('JSON missing "name" field.');
    loadedUrls.add(url);
    renderChar(data);
    addChip(url,data.name);
    setGhStatus('gh-status','ok','✓ Loaded '+data.name);
    urlEl.value='';
  }catch(e){setGhStatus('gh-status','err','✗ '+e.message);}
}

function addChip(url,name){
  const chips=document.getElementById('gh-chips');
  const chip=document.createElement('div');chip.className='chip';
  chip.innerHTML=`${name} <span class="cx">✕</span>`;
  chip.querySelector('.cx').onclick=e=>{
    e.stopPropagation();loadedUrls.delete(url);chip.remove();
    const sid='cs-'+name.replace(/[^a-z0-9]/gi,'-').toLowerCase();
    const el=document.getElementById(sid);if(el)el.remove();
    loadedChars.splice(loadedChars.findIndex(c=>c.name===name),1);
    updateInitSelects();
  };
  chips.appendChild(chip);
}

// ══════════════════════════════════════════════════════
//  PASTE / PARSE MODAL
// ══════════════════════════════════════════════════════
function openParseModal(){document.getElementById('parse-modal').classList.add('open');}
function closeParseModal(){document.getElementById('parse-modal').classList.remove('open');}

function parseAndLoad(){
  const raw=document.getElementById('parse-text').value.trim();
  if(!raw){setGhStatus('parse-status','err','Nothing to parse.');return;}
  try{
    // Try JSON first
    let data;
    try{data=JSON.parse(raw);}catch(e){data=parseYAMLLike(raw);}
    if(!data||!data.name){setGhStatus('parse-status','err','Could not find a "name:" field.');return;}
    renderChar(data);
    setGhStatus('parse-status','ok','✓ Loaded: '+data.name);
    document.getElementById('parse-text').value='';
    setTimeout(closeParseModal,1200);
  }catch(e){setGhStatus('parse-status','err','Parse error: '+e.message);}
}

function parseYAMLLike(text){
  const obj={};const lines=text.split('\n');
  let currentKey=null;let multilineBuffer=[];

  const flush=()=>{if(currentKey&&multilineBuffer.length){obj[currentKey]=multilineBuffer.join('\n').trim();currentKey=null;multilineBuffer=[];}};

  for(let i=0;i<lines.length;i++){
    const line=lines[i];
    // Detect key: value
    const kv=line.match(/^([a-zA-Z_][a-zA-Z0-9_\s]*?):\s*(.*)$/);
    if(kv){
      flush();
      const key=kv[1].trim().toLowerCase().replace(/\s+/g,'_');
      const val=kv[2].trim();
      if(val===''){currentKey=key;continue;}
      // array notation [a,b,c]
      if(val.startsWith('[')){
        try{obj[key]=JSON.parse(val.replace(/'/g,'"'));}
        catch{obj[key]=val.slice(1,-1).split(',').map(s=>s.trim());}
      } else if(val.startsWith('-')||val.startsWith('"')){
        obj[key]=val;
      } else {
        // Check if it's a pure number
        const n=Number(val);
        obj[key]=isNaN(n)?val:n;
      }
    } else if(line.trim().startsWith('-')&&currentKey){
      // list item under multiline key — handle actions/traits etc
      multilineBuffer.push(line);
    } else if(currentKey){
      multilineBuffer.push(line);
    }
  }
  flush();

  // Fix name — might be "name: Stuart - Warryn Umpen..." strip leading player tag
  if(obj.name){
    const nameStr=String(obj.name);
    // If "Stuart - Warryn..." format, split
    const dash=nameStr.indexOf(' - ');
    if(dash>0){obj.player=nameStr.slice(0,dash).trim();obj.name=nameStr.slice(dash+3).trim();}
  }

  // Parse stats array
  if(obj.stats&&Array.isArray(obj.stats)){/* already array */}
  else if(obj.stats&&typeof obj.stats==='string'){
    try{obj.stats=JSON.parse(obj.stats);}catch{obj.stats=[10,10,10,10,10,10];}
  }

  // Parse actions/features from remaining text
  obj.class_features=obj.class_features||[];
  obj.actions=obj.actions||[];
  obj.traits=obj.traits||[];
  obj.saves=Array.isArray(obj.saves)?obj.saves:(obj.saves?[obj.saves]:[]);
  obj.skills=Array.isArray(obj.skills)?obj.skills:(obj.skills?[obj.skills]:[]);
  obj.languages=Array.isArray(obj.languages)?obj.languages:(obj.languages?[obj.languages]:[]);
  obj.equipment=Array.isArray(obj.equipment)?obj.equipment:(obj.equipment?[{name:obj.equipment}]:[]);

  // raw actions/traits text block scanning
  const actMatch=text.match(/actions:\s*([\s\S]+?)(?=\n[a-zA-Z_]|\n\n[a-zA-Z]|$)/);
  if(actMatch){
    const actLines=actMatch[1].split('\n').filter(l=>l.trim().startsWith('-'));
    actLines.forEach(l=>{
      const nm=l.match(/name:\s*(.+)/);const dc=l.match(/desc:\s*"?(.+?)"?$/);
      if(nm)obj.actions.push({name:nm[1].trim(),desc:dc?dc[1].trim():''});
    });
  }
  const traitMatch=text.match(/traits:\s*([\s\S]+?)(?=\n[a-zA-Z_]|\n\n[a-zA-Z]|$)/);
  if(traitMatch){
    const lines2=traitMatch[1].split('\n');
    let cur=null;
    lines2.forEach(l=>{
      const nm=l.match(/name:\s*(.+)/);const dc=l.match(/desc:\s*"?(.+)/);
      if(nm){cur={name:nm[1].trim(),desc:''};obj.traits.push(cur);}
      else if(dc&&cur){cur.desc+=dc[1].trim().replace(/^"|"$/g,'');}
    });
  }
  const cfMatch=text.match(/class_features:\s*([\s\S]+?)(?=\n[a-zA-Z_]|\n\n[a-zA-Z]|$)/);
  if(cfMatch){
    const lines3=cfMatch[1].split('\n');let cur=null;
    lines3.forEach(l=>{
      const nm=l.match(/name:\s*(.+)/);const dc=l.match(/desc:\s*"?(.+)/);
      if(nm){cur={name:nm[1].trim(),desc:''};obj.class_features.push(cur);}
      else if(dc&&cur){cur.desc+=dc[1].trim().replace(/^"|"$/g,'');}
    });
  }

  // Parse spellcasting
  obj.spellcasting=[];
  const scMatch=text.match(/spellcasting:\s*([\s\S]+?)(?=\n[a-zA-Z_]|\n\n[a-zA-Z]|$)/);
  if(scMatch){
    const lines4=scMatch[1].split('\n');let cur=null;
    lines4.forEach(l=>{
      const nm=l.match(/name:\s*(.+)/);const dc=l.match(/desc:\s*"?(.+)/);
      if(nm){cur={name:nm[1].trim(),desc:''};obj.spellcasting.push(cur);}
      else if(dc&&cur){cur.desc+=dc[1].trim().replace(/^"|"$/g,'');}
    });
  }

  // Bonus actions
  const baMatch=text.match(/bonus_actions:\s*([\s\S]+?)(?=\n[a-zA-Z_]|\n\n[a-zA-Z]|$)/);
  if(baMatch){
    const bl=baMatch[1].split('\n');let cur=null;
    bl.forEach(l=>{
      const nm=l.match(/name:\s*(.+)/);const dc=l.match(/desc:\s*"?(.+)/);
      if(nm){cur={name:'Bonus: '+nm[1].trim(),desc:''};obj.class_features.push(cur);}
      else if(dc&&cur){cur.desc+=dc[1].trim().replace(/^"|"$/g,'');}
    });
  }

  // Freeform backstory / notes block
  const bsMatch=text.match(/(?:backstory|background notes?)\s*\n([\s\S]+?)(?=\n[A-Z][a-z]+\s*\n|$)/i);
  if(bsMatch)obj.backstory=bsMatch[1].trim();

  // Pact of the Tome / custom ability paragraphs
  const pactMatch=text.match(/\*\*Pact of the Tome\*\*([\s\S]+?)(?=\n\*\*|$)/);
  if(pactMatch)obj.class_features.push({name:'Pact of the Tome',desc:pactMatch[1].trim().replace(/\*\*/g,'').replace(/\n/g,' ')});
  const abilMatch=text.match(/Ability \(Combat\)([\s\S]+?)(?=\nBackstory|$)/);
  if(abilMatch)obj.class_features.push({name:'Combat Ability: The Argument',desc:abilMatch[1].trim().replace(/\n/g,' ')});

  // Wants
  const wantMatch=text.match(/Wants\s*\n([\s\S]+?)(?=\n[A-Z]|$)/);
  if(wantMatch&&!obj.goals){obj.goals=wantMatch[1].split('\n').map(l=>l.replace(/^-\s*/,'').trim()).filter(Boolean);}

  return obj;
}

// ══════════════════════════════════════════════════════
//  INITIATIVE TRACKER
// ══════════════════════════════════════════════════════
let combatants=[];
let currentTurn=-1;
let round=1;

function updateInitSelects(){
  ['dmg-target','cond-target'].forEach(id=>{
    const sel=document.getElementById(id);if(!sel)return;
    const cur=sel.value;sel.innerHTML='<option value="">— select —</option>';
    combatants.forEach((c,i)=>{
      const opt=document.createElement('option');opt.value=i;opt.textContent=c.name;
      sel.appendChild(opt);
    });
    sel.value=cur;
  });
}

function renderInitList(){
  const list=document.getElementById('init-list');
  if(combatants.length===0){list.innerHTML='<div style="padding:1rem;text-align:center;font-family:var(--bfont);font-style:italic;color:var(--ink-light);font-size:calc(.9*var(--tu))">No combatants. Add below.</div>';return;}
  const sorted=[...combatants].map((c,i)=>({...c,origIdx:i})).sort((a,b)=>b.initiative-a.initiative);
  list.innerHTML='';
  sorted.forEach((c)=>{
    if(c.isGroup){
      renderGroupRow(list,c);
    } else {
      renderSingleRow(list,c);
    }
  });
  document.getElementById('round-label').textContent=`Round ${round}`;
  if(currentTurn>=0&&currentTurn<combatants.length){
    document.getElementById('turn-label').textContent=combatants[currentTurn].name+"'s Turn";
  }
}

function initNumCell(c){
  const d=document.createElement('div'); d.className='init-num';
  const i=document.createElement('input'); i.type='number'; i.inputMode='numeric'; i.className='init-num-in';
  i.value=c.initiative?c.initiative:''; i.placeholder='?'; i.setAttribute('aria-label',c.name+' initiative');
  i.addEventListener('focus',()=>i.select());
  i.addEventListener('change',()=>setInitiative(c.origIdx,i.value));
  d.appendChild(i); return d;
}
function setInitiative(idx,val){
  const me=combatants[idx]; if(!me) return;
  const cur=currentTurn>=0?combatants[currentTurn]:null;
  me.initiative=parseInt(val)||0;
  if(me.isGroup) (me.members||[]).forEach(m=>{ m.initiative=me.initiative; });
  combatants.sort((a,b)=>b.initiative-a.initiative);
  if(cur) currentTurn=combatants.indexOf(cur);
  renderInitList(); updateInitSelects();
}
function renderSingleRow(list,c){
  const isDown=c.type==='pc'&&c.hp<=0&&!(c.death&&c.death.dead);
  const isDead=c.hp<=0&&!isDown;
  const isActive=c.origIdx===currentTurn;
  const typeIcon=c.type==='pc'?'🧙':c.type==='monster'?'👹':'🧑';
  const row=document.createElement('div');
  row.className='init-row'+(isActive?' active-turn':'')+(isDead?' dead':'')+(isDown?' dying':'');

  const numDiv=initNumCell(c);
  const typeDiv=document.createElement('div');typeDiv.className='init-type';typeDiv.textContent=typeIcon;
  const nameDiv=buildInitName(c);

  const hpCell=document.createElement('div');hpCell.className='init-hp-cell';
  const hpInput=document.createElement('input');hpInput.type='number';hpInput.value=c.hp;hpInput.min=0;hpInput.inputMode='numeric';hpInput.className='init-hp-in';hpInput.setAttribute('aria-label',c.name+' hit points');hpInput.addEventListener('focus',()=>hpInput.select());
  hpInput.addEventListener('change',()=>updateHP(c.origIdx,hpInput.value));
  const hpMax=document.createElement('span');hpMax.className='init-hp-max';hpMax.textContent='/'+(c.hpMax||'?');
  hpCell.appendChild(hpInput);hpCell.appendChild(hpMax);

  const acDiv=document.createElement('div');acDiv.className='init-ac';acDiv.textContent='🛡 '+(c.ac||'?');

  const condDiv=document.createElement('div');condDiv.className='cond-cell';
  (c.conditions||[]).forEach(cn=>{
    const pip=document.createElement('span');pip.className='cond-pip';pip.title='Click to remove';pip.textContent=cn.slice(0,3);
    pip.addEventListener('click',()=>{removeCond(c.origIdx,cn);});
    condDiv.appendChild(pip);
  });

  const btnsDiv=document.createElement('div');btnsDiv.className='init-btns';
  const upBtn=document.createElement('button');upBtn.className='ibtn';upBtn.title='Move up';upBtn.textContent='▲';upBtn.addEventListener('click',()=>moveUp(c.origIdx));
  const killBtn=document.createElement('button');killBtn.className='ibtn';killBtn.title='Kill/KO';killBtn.textContent='☠';killBtn.style.color='var(--red)';killBtn.addEventListener('click',()=>killCombatant(c.origIdx));
  const rmBtn=document.createElement('button');rmBtn.className='ibtn';rmBtn.title='Remove';rmBtn.textContent='✕';rmBtn.addEventListener('click',()=>removeCombatant(c.origIdx));
  btnsDiv.appendChild(upBtn);btnsDiv.appendChild(killBtn);if(c.type!=='pc')btnsDiv.appendChild(eyeBtn(c));btnsDiv.appendChild(rmBtn);

  row.appendChild(numDiv);row.appendChild(typeDiv);row.appendChild(nameDiv);row.appendChild(hpCell);row.appendChild(acDiv);row.appendChild(condDiv);row.appendChild(btnsDiv);
  list.appendChild(row);
}

function renderGroupRow(list,c){
  const isActive=c.origIdx===currentTurn;
  const aliveCount=(c.members||[]).filter(m=>!m.dead).length;
  const totalCount=(c.members||[]).length;
  const allDead=aliveCount===0;

  // ── Group header row ──
  const groupWrap=document.createElement('div');
  groupWrap.className='init-group'+(isActive?' active-turn':'')+(allDead?' dead':'');

  const header=document.createElement('div');
  header.className='init-group-header';
  header.style.cursor='pointer';
  header.title='Click to expand/collapse members';

  const chevron=document.createElement('span');
  chevron.className='init-group-chev';
  chevron.textContent=c.expanded?'▾':'▸';

  const initNum=initNumCell(c);
  initNum.addEventListener('click',e=>e.stopPropagation());

  const icon=document.createElement('div');icon.className='init-type';icon.textContent='👹';

  const nameEl=document.createElement('div');nameEl.className='init-name';
  nameEl.innerHTML=`<strong>${c.name}</strong> <span style="font-family:var(--hfont);font-size:calc(max(.65,.8)*var(--tu));color:var(--red);letter-spacing:.08em">×${aliveCount}/${totalCount}</span>`;
  const bookBtn=document.createElement('button');bookBtn.className='init-book';bookBtn.textContent='Stats';bookBtn.title='Show stat block';
  bookBtn.addEventListener('click',e=>{e.stopPropagation();openCombatPanel({kind:'combatant',idx:c.origIdx});});
  nameEl.appendChild(bookBtn);
  { const af=aliasField(c); if(af) nameEl.appendChild(af); }

  const acEl=document.createElement('div');acEl.className='init-ac';acEl.textContent='🛡 '+(c.ac||'?');

  // Group damage bar
  const dmgCell=document.createElement('div');dmgCell.className='init-dmg-cell';
  const dmgInput=document.createElement('input');dmgInput.type='number';dmgInput.placeholder='dmg';dmgInput.inputMode='numeric';dmgInput.className='init-dmg-in';dmgInput.setAttribute('aria-label','Damage for '+c.name);
  dmgInput.title='Enter damage amount';
  const dmgBtn=document.createElement('button');dmgBtn.className='ibtn';dmgBtn.title='Apply damage to one member (lowest HP first)';dmgBtn.textContent='💥';
  dmgBtn.style.cssText='font-size:calc(.85*var(--tu));color:var(--red)';
  dmgBtn.addEventListener('click',e=>{e.stopPropagation();applyGroupDamage(c.origIdx,parseInt(dmgInput.value)||0);dmgInput.value='';});
  const aoeBtn=document.createElement('button');aoeBtn.className='ibtn';aoeBtn.title='Apply damage to ALL members (AoE)';aoeBtn.style.cssText='font-size:calc(max(.75,.8)*var(--tu));color:var(--red)';aoeBtn.textContent='AoE';
  aoeBtn.addEventListener('click',e=>{e.stopPropagation();applyGroupAoE(c.origIdx,parseInt(dmgInput.value)||0);dmgInput.value='';});
  dmgCell.appendChild(dmgInput);dmgCell.appendChild(dmgBtn);dmgCell.appendChild(aoeBtn);

  const btnsDiv=document.createElement('div');btnsDiv.className='init-btns';
  const upBtn=document.createElement('button');upBtn.className='ibtn';upBtn.textContent='▲';upBtn.addEventListener('click',e=>{e.stopPropagation();moveUp(c.origIdx);});
  const splitBtn=document.createElement('button');splitBtn.className='ibtn';splitBtn.title='Split into individual rows (keep shared initiative)';splitBtn.textContent='⊕';splitBtn.addEventListener('click',e=>{e.stopPropagation();splitGroup(c.origIdx);});
  const splitInitBtnG=document.createElement('button');splitInitBtnG.className='ibtn';splitInitBtnG.title='Split and roll individual initiatives';splitInitBtnG.textContent='🎲⊕';splitInitBtnG.style.fontSize='.7rem';splitInitBtnG.addEventListener('click',e=>{e.stopPropagation();splitGroupWithInit(c.origIdx);});
  const rmBtn=document.createElement('button');rmBtn.className='ibtn';rmBtn.title='Remove group';rmBtn.textContent='✕';rmBtn.style.color='var(--red)';rmBtn.addEventListener('click',e=>{e.stopPropagation();removeCombatant(c.origIdx);});
  btnsDiv.appendChild(upBtn);btnsDiv.appendChild(splitBtn);btnsDiv.appendChild(splitInitBtnG);btnsDiv.appendChild(eyeBtn(c));btnsDiv.appendChild(rmBtn);

  header.appendChild(chevron);
  header.appendChild(initNum);
  header.appendChild(icon);
  header.appendChild(nameEl);
  header.appendChild(acEl);
  header.appendChild(dmgCell);
  header.appendChild(btnsDiv);
  header.addEventListener('click',()=>toggleGroup(c.origIdx));
  groupWrap.appendChild(header);

  // ── Member rows (shown when expanded) ──
  if(c.expanded){
    const membersDiv=document.createElement('div');
    membersDiv.className='init-group-members';
    (c.members||[]).forEach((m,mi)=>{
      const mRow=document.createElement('div');
      mRow.className='init-group-member'+(m.dead?' dead':'');

      const mName=document.createElement('span');mName.className='init-member-name';mName.textContent=m.name;

      const mHpWrap=document.createElement('span');mHpWrap.className='init-hp-cell';
      const mHpIn=document.createElement('input');mHpIn.type='number';mHpIn.value=m.hp;mHpIn.min=0;mHpIn.inputMode='numeric';mHpIn.className='init-hp-in';mHpIn.setAttribute('aria-label',m.name+' hit points');mHpIn.addEventListener('focus',()=>mHpIn.select());
      mHpIn.addEventListener('change',()=>updateMemberHP(c.origIdx,mi,mHpIn.value));
      const mHpMax=document.createElement('span');mHpMax.className='init-hp-max';mHpMax.textContent='/'+m.hpMax;
      mHpWrap.appendChild(mHpIn);mHpWrap.appendChild(mHpMax);

      // HP bar
      const pct=Math.max(0,Math.min(100,Math.round((m.hp/m.hpMax)*100)));
      const barColor=pct>50?'var(--green)':pct>25?'var(--gold)':'var(--red)';
      const bar=document.createElement('div');bar.className='init-bar';
      bar.style.cssText=`height:8px;background:rgba(180,130,60,.2);border-radius:4px;overflow:hidden`;
      const fill=document.createElement('div');fill.style.cssText=`height:100%;width:${pct}%;background:${barColor};transition:width .3s`;
      bar.appendChild(fill);

      const condPips=document.createElement('span');condPips.className='init-cond';
      (m.conditions||[]).forEach(cn=>{
        const pip=document.createElement('span');pip.className='cond-pip';pip.textContent=cn.slice(0,3);pip.title='Click to remove';
        pip.addEventListener('click',()=>removeMemberCond(c.origIdx,mi,cn));
        condPips.appendChild(pip);
      });

      const mBtns=document.createElement('span');mBtns.className='init-mbtns';
      const mKill=document.createElement('button');mKill.className='ibtn';mKill.textContent='☠';mKill.title='Kill this member';mKill.style.color='var(--red)';
      mKill.addEventListener('click',()=>killMember(c.origIdx,mi));
      const mRm=document.createElement('button');mRm.className='ibtn';mRm.textContent='✕';mRm.title='Remove this member';
      mRm.addEventListener('click',()=>removeMember(c.origIdx,mi));
      mBtns.appendChild(mKill);mBtns.appendChild(mRm);

      mRow.appendChild(mName);mRow.appendChild(mHpWrap);mRow.appendChild(bar);mRow.appendChild(condPips);mRow.appendChild(mBtns);
      membersDiv.appendChild(mRow);
    });
    groupWrap.appendChild(membersDiv);
  }

  list.appendChild(groupWrap);
}

function addCombatant(){
  const name=document.getElementById('new-name').value.trim();
  if(!name)return;
  const init=parseInt(document.getElementById('new-init').value)||0;
  const hp=parseInt(document.getElementById('new-hp').value)||10;
  const ac=parseInt(document.getElementById('new-ac').value)||10;
  const type=document.getElementById('new-type').value;
  const count=Math.max(1,parseInt(document.getElementById('new-count').value)||1);

  if(count > 1 && type === 'monster'){
    // Create a group
    const members = Array.from({length:count},(_,i)=>({
      name:`${name} ${i+1}`, hp, hpMax:hp, conditions:[], dead:false
    }));
    combatants.push({name, type, initiative:init, hp, hpMax:hp, ac,
      conditions:[], isGroup:true, count, members, expanded:false});
  } else {
    for(let i=0;i<count;i++){
      const label = count>1 ? `${name} ${i+1}` : name;
      combatants.push({name:label,type,initiative:init,hp,hpMax:hp,ac,conditions:[]});
    }
  }
  document.getElementById('new-name').value='';
  document.getElementById('new-init').value='';
  document.getElementById('new-hp').value='';
  document.getElementById('new-ac').value='';
  document.getElementById('new-count').value='';
  renderInitList();updateInitSelects();
}

function rollAllInit(){
  combatants.forEach(c=>{
    const dexMod=Math.floor(((c.dex||10)-10)/2);
    c.initiative=Math.floor(Math.random()*20)+1+dexMod;
  });
  combatants.sort((a,b)=>b.initiative-a.initiative);
  currentTurn=0;renderInitList();updateInitSelects();
}

/* ===== placeholder names, fight id, saved fight ===== */
let fightId=null, anonCount=0, hideNames=false;
window.__tomeInitSeen=window.__tomeInitSeen||{};
const anonLetter=n=>{let s='';n++;while(n>0){n--;s=String.fromCharCode(65+n%26)+s;n=Math.floor(n/26)}return s};
function ensureFight(){ if(!fightId) fightId=String(Date.now()); return fightId; }
/* what players call a creature: your placeholder, else "Creature A" when names are hidden by default, else the real name */
function playerName(c){
  if(c.type==='pc') return String(c.name);
  const a=String(c.alias||'').trim(); if(a) return a;
  if(hideNames){ if(c.anon==null) c.anon=anonCount++; return 'Creature '+anonLetter(c.anon); }
  return String(c.name);
}
function aliasField(c){
  if(c.type==='pc') return null;
  const w=document.createElement('div'); w.className='init-alias';
  const i=document.createElement('input'); i.type='text'; i.className='init-alias-in'; i.maxLength=40;
  i.value=c.alias||'';
  const dflt=playerName({type:c.type,name:c.name,alias:'',anon:c.anon});
  i.placeholder='Players see: '+(hideNames?'Creature …':dflt);
  i.setAttribute('aria-label','Name players see for '+c.name);
  i.addEventListener('click',e=>e.stopPropagation());
  i.addEventListener('change',()=>{ const o=combatants[c.origIdx]; if(o){ o.alias=i.value.trim(); renderInitList(); } });
  w.appendChild(i);
  const shown=playerName(c);
  if(shown!==String(c.name)){
    const r=document.createElement('button'); r.type='button'; r.className='init-reveal'; r.textContent='🔓 Reveal';
    r.title='Players see “'+shown+'”. Tap to show them the real name';
    r.addEventListener('click',e=>{ e.stopPropagation(); const o=combatants[c.origIdx]; if(o){ o.alias=o.name; renderInitList(); } });
    w.appendChild(r);
  }
  return w;
}
function toggleHideNames(){
  hideNames=!hideNames; renderInitList(); updateHideLabel();
  toast(hideNames?'Players will see “Creature A, B…” unless you give one a name':'Players see real names unless you give one a placeholder');
}
function updateHideLabel(){
  const b=document.getElementById('hide-btn'); if(!b) return;
  b.textContent=hideNames?'🎭 Hide monster names by default: ON':'🎭 Hide monster names by default: off';
  b.classList.toggle('on',hideNames);
}
function fightState(){
  return {v:1,upd:Date.now(),round:round,currentTurn:currentTurn,fightId:fightId,anonCount:anonCount,hideNames:hideNames,
    initSeen:Object.assign({},window.__tomeInitSeen),combatants:JSON.parse(JSON.stringify(combatants))};
}
window.__tomeFightState=fightState;
window.__tomeRestoreFight=function(st){
  if(!st||!Array.isArray(st.combatants)||!st.combatants.length) return false;
  combatants=st.combatants; currentTurn=typeof st.currentTurn==='number'?st.currentTurn:-1; round=st.round||1;
  fightId=st.fightId||null; anonCount=st.anonCount||0; hideNames=!!st.hideNames;
  window.__tomeInitSeen=Object.assign({},st.initSeen||{});
  renderInitList(); updateInitSelects(); updateHideLabel();
  if(typeof refreshCombatPanel==='function') refreshCombatPanel();
  return true;
};
function eyeBtn(c){
  const b=document.createElement('button'); b.className='ibtn eye'+(c.hidden?' off':'');
  b.title=c.hidden?'Hidden from players. Tap to show them':'Players can see this one. Tap to hide it';
  b.setAttribute('aria-label',b.title); b.textContent=c.hidden?'🙈':'👁';
  b.addEventListener('click',e=>{ e.stopPropagation(); const o=combatants[c.origIdx]; if(o){ o.hidden=!o.hidden; renderInitList(); } });
  return b;
}
/* what players are allowed to see: order, names, conditions. Never HP, AC or notes. */
function combatPayload(){
  const B=window.PartyBridge;
  const ord=combatants.map((c,i)=>({c,i})).sort((a,b)=>(b.c.initiative||0)-(a.c.initiative||0)||a.i-b.i);
  const cur=currentTurn>=0?combatants[currentTurn]:null;
  const out=[]; let turn=-1, unseen=false;
  ord.forEach(({c})=>{
    if(c.hidden&&c.type!=='pc'){ if(c===cur) unseen=true; return; }
    const e={n:playerName(c),t:c.type==='pc'?'pc':(c.type==='npc'?'npc':'monster'),i:c.initiative||0};
    if(c.type==='pc'&&B&&B.idOf){ const k=B.idOf(c.name); if(k) e.k=k; }
    if(c.isGroup){ const alive=(c.members||[]).filter(m=>!m.dead).length; e.g=alive; if(!alive) e.d=1; }
    else{
      if(c.type!=='pc'&&c.hp<=0) e.d=1;
      if(c.type==='pc'&&c.hp<=0) e.dn=1;
      const cs=(c.conditions||[]).filter(x=>typeof x==='string'); if(cs.length) e.cs=cs.slice(0,6);
    }
    if(c===cur) turn=out.length;
    out.push(e);
  });
  return {round:round,turn:turn,unseen:unseen,order:out,started:currentTurn>=0,fid:ensureFight()};
}
window.__tomeCombatPayload=combatPayload;
function toggleShare(){ if(window.__tomeToggleShare) window.__tomeToggleShare(); }
window.__tomeShareLabel=function(on){
  const b=document.getElementById('share-btn'); if(!b) return;
  b.textContent=on?'📡 Sharing with players: ON':'📡 Share order with players: off';
  b.classList.toggle('on',!!on);
  const h=document.getElementById('share-hint');
  if(h) h.textContent=on?'Players see the order, whose turn it is, names and conditions. Never HP or AC. Tap the eye on a monster to hide it.':'Players can’t see the fight until you turn this on.';
};
function rollMonstersInit(){
  const cur=currentTurn>=0?combatants[currentTurn]:null; let n=0;
  combatants.forEach(c=>{
    if(c.type==='pc'||c.initiative) return;
    const mod=Math.floor(((c.dex||10)-10)/2), r=Math.floor(Math.random()*20)+1+mod; c.initiative=r; n++;
    if(c.isGroup) (c.members||[]).forEach(m=>{ m.initiative=r; });
  });
  combatants.sort((a,b)=>b.initiative-a.initiative);
  currentTurn=cur?combatants.indexOf(cur):(combatants.length?0:-1);
  renderInitList(); updateInitSelects();
  toast(n?('Rolled initiative for '+n+' monster'+(n>1?'s':'')):'Every monster already has an initiative');
}
function nextTurn(){
  if(combatants.length===0)return;
  const prevT=currentTurn;
  currentTurn=(currentTurn+1)%combatants.length;
  if(currentTurn===0&&prevT>=0)round++;
  renderInitList();
}

function updateHP(idx,val){
  combatants[idx].hp=Math.max(0,parseInt(val)||0);
  renderInitList();
}

function killCombatant(idx){combatants[idx].hp=0;renderInitList();}

function removeCombatant(idx){
  combatants.splice(idx,1);
  if(currentTurn>=combatants.length)currentTurn=combatants.length-1;
  renderInitList();updateInitSelects();
}

function moveUp(idx){
  if(idx===0)return;
  [combatants[idx-1],combatants[idx]]=[combatants[idx],combatants[idx-1]];
  renderInitList();updateInitSelects();
}

function applyDmg(){
  const idx=parseInt(document.getElementById('dmg-target').value);
  const amt=parseInt(document.getElementById('dmg-amount').value)||0;
  if(isNaN(idx))return;
  combatants[idx].hp=Math.max(0,combatants[idx].hp-amt);
  renderInitList();
}

function applyHeal(){
  const idx=parseInt(document.getElementById('dmg-target').value);
  const amt=parseInt(document.getElementById('dmg-amount').value)||0;
  if(isNaN(idx))return;
  combatants[idx].hp=Math.min(combatants[idx].hpMax,combatants[idx].hp+amt);
  renderInitList();
}

function addCond(){
  const idx=parseInt(document.getElementById('cond-target').value);
  const cond=document.getElementById('cond-pick').value;
  if(isNaN(idx)||!cond)return;
  if(!combatants[idx].conditions.includes(cond))combatants[idx].conditions.push(cond);
  renderInitList();
}

function removeCond(idx,cond){
  combatants[idx].conditions=combatants[idx].conditions.filter(c=>c!==cond);
  renderInitList();
}

function resetCombat(){
  if(!confirm('Reset combat?'))return;
  combatants=[];currentTurn=-1;round=1;fightId=null;anonCount=0;window.__tomeInitSeen={};
  renderInitList();updateInitSelects();
}

function importToInit(sid){
  const char=loadedChars.find(c=>'cs-'+c.name.replace(/[^a-z0-9]/gi,'-').toLowerCase()===sid);
  if(!char)return;
  const short=pcShortName(char);
  if(combatants.find(c=>c.type==='pc'&&(c.name===char.name||c.name===short))){alert(short+' is already in the tracker.');return;}
  const stats=char.stats||[10,10,10,10,10,10];
  const dex=stats[1]||10;
  const hpMax=char.hp_max||char.hp||10, hp=(char.hp_current!==undefined?char.hp_current:hpMax);
  combatants.push({name:short,type:'pc',initiative:0,hp,hpMax,ac:char.ac||10,dex,conditions:[]});
  renderInitList();updateInitSelects();
  sw('init',document.querySelector('[data-ac="tab-init"]'));
}

function pcShortName(c){ return (c.name||'PC').split(' ')[0]; }
function addFromChars(){
  let added=0, updated=0;
  loadedChars.forEach(c=>{
    const stats=c.stats||[10,10,10,10,10,10];
    const hpMax=c.hp_max||c.hp||10;
    const hpNow=(c.hp_current!==undefined?c.hp_current:hpMax);
    const short=pcShortName(c);
    const existing=combatants.find(x=>x.type==='pc'&&(x.name===c.name||x.name===short));
    if(existing){
      existing.name=short; existing.ac=c.ac||existing.ac; existing.hpMax=hpMax;
      existing.dex=stats[1]||10; updated++;
    } else {
      combatants.push({name:short,type:'pc',initiative:0,hp:hpNow,hpMax,ac:c.ac||10,dex:stats[1]||10,conditions:[]});
      added++;
    }
  });
  renderInitList();updateInitSelects();
  const s=document.getElementById('sst');
  if(s){ s.textContent = added?`✓ Added ${added} PC${added>1?'s':''}`:`✓ PCs already in combat`; s.classList.add('vis'); setTimeout(()=>{s.classList.remove('vis');s.textContent='✓ Saved';},2000); }
}

// ══════════════════════════════════════════════════════
//  SESSION HISTORY
// ══════════════════════════════════════════════════════
const histSessions=[];

function renderHistList(){
  const list=document.getElementById('hist-list');
  if(histSessions.length===0){list.innerHTML='<p style="font-family:var(--bfont);font-style:italic;color:var(--ink-light);font-size:calc(.9*var(--tu))">No sessions loaded yet.</p>';return;}
  list.innerHTML='';
  histSessions.forEach((s,i)=>{
    const card=document.createElement('div');card.className='hist-card';
    const preview=s['strong-start']?s['strong-start'].slice(0,120)+'…':'No strong start recorded.';
    card.innerHTML=`
      <div class="hist-top">
        <span class="hist-title">${s['campaign-name']||'Unnamed Campaign'} · ${s['session-num']||'?'}</span>
        <span class="hist-date">${s['session-date']||''}</span>
      </div>
      <div class="hist-preview">${preview}</div>
      <div class="hist-detail" id="hd-${i}">
        ${s['strong-start']?`<div class="hist-section"><div class="hist-section-title">Strong Start</div><p>${s['strong-start']}</p></div>`:''}
        ${s['summary']?`<div class="hist-section"><div class="hist-section-title">What Happened</div><p>${s['summary']}</p></div>`:''}
        ${s['worked-well']?`<div class="hist-section"><div class="hist-section-title">What Worked</div><p>${s['worked-well']}</p></div>`:''}
        ${s['loose-threads']?`<div class="hist-section"><div class="hist-section-title">Loose Threads</div><p>${s['loose-threads']}</p></div>`:''}
        ${s['next-prep']?`<div class="hist-section"><div class="hist-section-title">Next Prep</div><p>${s['next-prep']}</p></div>`:''}
      </div>`;
    card.onclick=()=>{
      const det=document.getElementById('hd-'+i);
      det.classList.toggle('open');
    };
    list.prepend(card);
  });
}

async function loadHistSession(){
  const url=document.getElementById('hist-url').value.trim();
  if(!url){setGhStatus('hist-status','err','Enter a URL.');return;}
  setGhStatus('hist-status','ld','⟳ Fetching…');
  try{
    const fetchUrl=url.replace('github.com','raw.githubusercontent.com').replace('/blob/','/');
    const res=await fetch(fetchUrl);
    if(!res.ok)throw new Error(`HTTP ${res.status}`);
    const data=await res.json();
    histSessions.push(data);
    renderHistList();
    setGhStatus('hist-status','ok','✓ Session loaded');
    document.getElementById('hist-url').value='';
  }catch(e){setGhStatus('hist-status','err','✗ '+e.message);}
}

function handleFileUpload(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const data=JSON.parse(e.target.result);
      histSessions.push(data);renderHistList();
      document.getElementById('upload-drop').classList.remove('drag');
    }catch{alert('Invalid JSON file.');}
  };
  reader.readAsText(file);
}

function handleDrop(e){
  e.preventDefault();
  document.getElementById('upload-drop').classList.remove('drag');
  const file=e.dataTransfer.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try{histSessions.push(JSON.parse(ev.target.result));renderHistList();}
    catch{alert('Invalid JSON.');}
  };
  reader.readAsText(file);
}

function addConseq(){
  const card = mkCard('conseq-list',[
    {cols:3, items:[
      {key:'cq-char', label:'Assigned To', placeholder:'Character name or "Party"'},
      {key:'cq-type', label:'Type', placeholder:'Injury / Curse / Debt / Reputation / Bond / Other'},
      {key:'cq-severity', label:'Severity', placeholder:'Minor / Moderate / Major / Critical'}
    ]},
    {cols:2, items:[
      {key:'cq-title', label:'Consequence', placeholder:'e.g. Broken ribs from the cave-in'},
      {key:'cq-source', label:'Source / Cause', placeholder:'e.g. Failed Str save vs rockfall in Session 7'}
    ]},
    {cols:1, items:[{key:'cq-desc', label:'Mechanical Effect / Ongoing Condition', type:'textarea', rows:2,
      placeholder:'e.g. Disadvantage on Athletics checks until healed. Needs a week of rest or magical healing.', span:true}]},
    {cols:2, items:[
      {key:'cq-resolved', label:'Resolved?', placeholder:'No / Yes — how?'},
      {key:'cq-session', label:'Session Introduced', placeholder:'e.g. Session 7'}
    ]}
  ]);
  // Style the card with a left red border to make it stand out
  if(card) card.style.borderLeft = '4px solid var(--red)';
}

// ══════════════════════════════════════════════════════
//  SAVE / LOAD / EXPORT
// ══════════════════════════════════════════════════════
function collectData(){
  const data={};
  const ids=['campaign-name','session-num','session-date','party-level',
    'strong-start','adv-hook','scene-hook','enc-bench','world-truths','camp-notes',
    'summary','worked-well','improve','loose-threads','secrets-used','next-prep','prev-recap'];
  ids.forEach(id=>{const el=document.getElementById(id);if(el)data[id]=el.value;});
  const cardLists=['hook-list','scenes-list','forks-list','secrets-list','loc-list',
    'npc-list','mon-list','treas-list','faction-list','conseq-list'];
  cardLists.forEach(lid=>{
    const list=document.getElementById(lid);if(!list)return;
    data[lid]=Array.from(list.querySelectorAll('.card')).map(card=>
      Object.fromEntries(Array.from(card.querySelectorAll('[data-key]')).map(i=>[i.dataset.key,i.value]))
    );
  });
  const encEl=document.getElementById('enc-list');
  if(encEl)data['enc-list-html']=encEl.innerHTML;
  data.encN=encN;
  data['char-hooks']={};
  document.querySelectorAll('[data-char-hook]').forEach(i=>{ if(i.value.trim()) data['char-hooks'][i.dataset.charHook]=i.value; });
  // keep hooks for characters that aren't loaded right now
  Object.entries(pendingCharHooks).forEach(([k,v])=>{ if(!(k in data['char-hooks']) && !document.querySelector('[data-char-hook="'+CSS.escape(k)+'"]')) data['char-hooks'][k]=v; });
  data['revealed-secrets']=revealedSecrets.slice();
  data['pc-state']=JSON.parse(JSON.stringify(pcState,(k,v)=>k==='__proxy'?undefined:v));
  if(improvKit) data['improv-kit']=improvKit;
  data.savedAt=new Date().toISOString();
  return data;
}

function saveAll(){
  localStorage.setItem('lazy-dm-v3',JSON.stringify(collectData()));
  const s=document.getElementById('sst');s.classList.add('vis');
  setTimeout(()=>s.classList.remove('vis'),2500);
}

function loadSave(){
  const raw=localStorage.getItem('lazy-dm-v3');
  if(!raw){alert('No saved session found.');return;}
  applyData(JSON.parse(raw));
  alert('Session loaded!');
}

function applyData(data){
  const ids=['campaign-name','session-num','session-date','party-level',
    'strong-start','adv-hook','scene-hook','enc-bench','world-truths','camp-notes',
    'summary','worked-well','improve','loose-threads','secrets-used','next-prep','prev-recap'];
  ids.forEach(id=>{const el=document.getElementById(id);if(el&&data[id]!==undefined)el.value=data[id];});
  const restorers={'hook-list':addHook,'scenes-list':addScene,'forks-list':addFork,'secrets-list':addSecret,
    'loc-list':addLoc,'npc-list':addNPC,'mon-list':addMon,
    'treas-list':addTreas,'faction-list':addFaction,'conseq-list':addConseq};
  Object.keys(restorers).forEach(lid=>{
    const list=document.getElementById(lid);if(!list||!data[lid])return;
    list.innerHTML='';
    data[lid].forEach(row=>{
      restorers[lid]();
      const card=list.lastElementChild;
      Object.entries(row).forEach(([key,val])=>{
        const inp=card.querySelector('[data-key="'+key+'"]');if(inp)inp.value=val;
      });
      // Re-add initiative button for monster cards
      if(lid==='mon-list' && card) addInitBtnToMonCard(card);
    });
  });
  if(data['enc-list-html'])document.getElementById('enc-list').innerHTML=data['enc-list-html'];
  if(data.encN)encN=data.encN;
  pendingCharHooks=data['char-hooks']||{};
  document.querySelectorAll('[data-char-hook]').forEach(i=>{ i.value=pendingCharHooks[i.dataset.charHook]||''; });
  revealedSecrets=Array.isArray(data['revealed-secrets'])?data['revealed-secrets'].slice():[];
  pcState=data['pc-state']&&typeof data['pc-state']==='object'?data['pc-state']:{};
  improvKit=data['improv-kit']||null;
  if(typeof benchFromSheets==='function' && !benchManual && loadedChars.length) benchFromSheets(); else if(typeof calcBenchmark==='function') calcBenchmark();
  if(document.getElementById('tab-run') && document.getElementById('tab-run').classList.contains('active')) renderRunMode();
}

function exportSession(){
  const data=collectData();
  const sn=(data['session-num']||'unknown').replace(/\s+/g,'-').toLowerCase();
  const cn=data['campaign-name']?'-'+data['campaign-name'].replace(/\s+/g,'-').toLowerCase():'';
  const name='session'+cn+'-'+sn+'.json';
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();
}

function clearAll(){
  if(!confirm('Clear all session data?'))return;
  localStorage.removeItem('lazy-dm-v3');
  location.reload();
}

// ══════════════════════════════════════════════════════
//  BOOT
// ══════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded',()=>{
  if(!localStorage.getItem('lazy-dm-v3')){
    addHook();addScene();addScene();
    addSecret();addSecret();addSecret();
    addLoc();addLoc();addNPC();addNPC();
    addTreas();
  } else {
    try{ applyData(JSON.parse(localStorage.getItem('lazy-dm-v3'))); }catch(e){ console.warn('Could not load saved campaign',e); }
  }
  window.__tomeReady=true;
  renderInitList();
  filterMonsters();
  initSpellUI();
  setTimeout(()=>wrapSpellsInElement(document.getElementById('tome')), 600);
  initSecretCounter();
  // CF file input
  setTimeout(()=>{
    const cfFile = document.getElementById('cf-file-input');
    if(cfFile) cfFile.addEventListener('change', ()=>handleCFFile(cfFile));
  }, 200);
  renderConditions();
  // Init web when its tab is first clicked
  document.querySelector('[data-ac="tab-web"]').addEventListener('click', ()=>{
    if(!webCanvas || !webCtx){ setTimeout(webInit, 50); }
    else { webSyncPCs(); }  // re-sync every time tab is opened
  });
  // tab scroll arrows removed — using grouped layout now
});

async function autoLoadCharacters(){
  const statusEl = document.getElementById('autoload-status');
  if(statusEl) statusEl.textContent = '⟳ Loading character sheets from GitHub…';
  let loaded = 0, failed = [];
  for(const fname of GITHUB_CONFIG.characterFiles){
    const url = RAW_BASE + fname;
    console.log('Fetching character:', url);
    if(loadedUrls.has(url)) continue;
    try{
      const res = await fetch(url);
      if(!res.ok) throw new Error('HTTP '+res.status);
      const data = await res.json();
      if(!data.name) throw new Error('No name field');
      loadedUrls.add(url);
      renderChar(data);
      addChip(url, data.name);
      loaded++;
    } catch(e){
      console.error('Failed:', url, e.message);
      failed.push(fname+' ('+e.message+')');
    }
  }
  if(statusEl){
    if(failed.length === 0 && loaded > 0){
      statusEl.className='gh-status ok';
      statusEl.textContent = `✓ Loaded ${loaded} character sheet${loaded>1?'s':''} from GitHub`;
    } else if(GITHUB_CONFIG.characterFiles.length === 0){
      statusEl.className='gh-status';
      statusEl.textContent = '(No character files configured)';
    } else if(failed.length > 0 && loaded === 0){
      statusEl.className='gh-status err';
      statusEl.textContent = 'Failed to load: '+failed.join(', ')+'. Check browser console (F12) for exact URL.';
    } else if(failed.length > 0){
      statusEl.className='gh-status ok';
      statusEl.textContent = `✓ Loaded ${loaded} · Failed: `+failed.join(', ');
    }
  }
}

// scrollTabs / updateTabArrows removed — using grouped tab layout

// ══════════════════════════════════════════════════════
//  MONSTER DATABASE (D&D 5e SRD)
// ══════════════════════════════════════════════════════
let MONSTERS = [];

let filteredMonsters = [...MONSTERS];

function filterMonsters(){
  window.__mdbLimit=60;
  const q = (document.getElementById('mdb-search').value||'').toLowerCase();
  const cr = document.getElementById('mdb-cr').value;
  const type = document.getElementById('mdb-type').value;
  filteredMonsters = MONSTERS.filter(m=>{
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.type.toLowerCase().includes(q) || String(m.cr).includes(q);
    const matchCR = !cr || String(m.cr) === cr;
    const matchType = !type || m.type === type;
    return matchQ && matchCR && matchType;
  });
  renderMDB();
}

function renderMDB(){
  const list = document.getElementById('mdb-list');
  const count = document.getElementById('mdb-count');
  if(!list) return;
  count.textContent = `${filteredMonsters.length} monster${filteredMonsters.length!==1?'s':''} found`;
  list.innerHTML = '';
  const mdbShown = Math.min(filteredMonsters.length, window.__mdbLimit||60);
  filteredMonsters.slice(0,mdbShown).forEach((m,i)=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cursor = 'pointer';
    const statNames = ['STR','DEX','CON','INT','WIS','CHA'];
    const statVals = [m.str,m.dex,m.con,m.int,m.wis,m.cha];
    const modStr = s => { const v=Math.floor((s-10)/2); return (v>=0?'+':'')+v; };

    card.innerHTML = `
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:.5rem">
        <span style="font-family:var(--hfont);font-size:calc(.9*var(--tu));font-weight:600;color:var(--red)">${m.name}</span>
        <span style="font-family:var(--bfont);font-style:italic;font-size:calc(.8*var(--tu));color:var(--ink-light)">${m.type} · CR ${m.cr}</span>
      </div>
      <div class="mdb-detail" id="mdb-${i}" style="display:none;margin-top:.6rem">
        <div class="hp-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:.6rem">
          <div class="hpbox"><label>HP</label><div class="hpval">${m.hp}</div></div>
          <div class="hpbox"><label>AC</label><div class="hpval">${m.ac}</div></div>
          <div class="hpbox" style="grid-column:span 2"><label>Speed</label><div class="hpval" style="font-size:calc(.85*var(--tu))">${m.speed}</div></div>
        </div>
        <div class="stat-grid" style="margin-bottom:.6rem">
          ${statVals.map((s,si)=>`<div class="sbox"><div class="slbl">${statNames[si]}</div><div class="sval">${s}</div><div class="smod">${modStr(s)}</div></div>`).join('')}
        </div>
        ${m.saves?`<div class="db" style="margin-bottom:.4rem"><label>Saves</label><p>${m.saves}</p></div>`:''}
        ${m.skills?`<div class="db" style="margin-bottom:.4rem"><label>Skills</label><p>${m.skills}</p></div>`:''}
        ${m.senses?`<div class="db" style="margin-bottom:.4rem"><label>Senses</label><p>${m.senses}</p></div>`:''}
        ${m.traits?`<div class="db" style="margin-bottom:.4rem"><label>Traits</label><p>${m.traits}</p></div>`:''}
        ${m.actions?`<div class="db" style="margin-bottom:.4rem"><label>Actions</label><p>${m.actions}</p></div>`:''}
        ${m.reactions?`<div class="db" style="margin-bottom:.4rem"><label>Reactions</label><p>${m.reactions}</p></div>`:''}
        <div class="mdb-actions">
          <label class="mdb-count-l">How many<input type="number" class="mdb-count" min="1" max="30" value="1" inputmode="numeric"></label>
          <button class="btnp" data-mdb-add="${i}">⚔ Add to fight</button>
          <button class="btns" data-mdb-step7="${i}">＋ Prep for session</button>
        </div>
      </div>`;

    card.addEventListener('click', e => {
      if(e.target.closest('[data-mdb-add]')||e.target.closest('[data-mdb-step7]')||e.target.closest('.mdb-actions')) return;
      const det = document.getElementById('mdb-'+i);
      if(det) det.style.display = det.style.display==='none' ? 'block' : 'none';
    });

    const addBtn = card.querySelector('[data-mdb-add]');
    if(addBtn) addBtn.addEventListener('click', e=>{ e.stopPropagation(); addMonsterToInit(m,card.querySelector('.mdb-count').value); });
    const s7Btn = card.querySelector('[data-mdb-step7]');
    if(s7Btn) s7Btn.addEventListener('click', e=>{ e.stopPropagation(); addMonsterToStep7(m,card.querySelector('.mdb-count').value); });

    list.appendChild(card);
    wrapSpellsInElement(card);
  });
  if(filteredMonsters.length>mdbShown){
    const more=document.createElement('button'); more.className='abtn'; more.style.width='100%';
    more.textContent='Show more ('+(filteredMonsters.length-mdbShown)+' left)';
    more.addEventListener('click',()=>{ window.__mdbLimit=(window.__mdbLimit||60)+60; renderMDB(); });
    list.appendChild(more);
  }
}

function addMonsterToInit(m,count,roll){
  count=Math.max(1,Math.min(30,parseInt(count)||1));
  const dex=m.dex||10, d20=()=>Math.floor(Math.random()*20)+1, mod=Math.floor((dex-10)/2);
  if(count>1){
    let gname=m.name, n=2; while(combatants.find(x=>x.isGroup&&x.name===gname)) gname=m.name+' ('+(n++)+')';
    const gi=roll?d20()+mod:0;
    const members=Array.from({length:count},(_,i)=>({name:m.name+' '+(i+1),hp:m.hp,hpMax:m.hp,conditions:[],dead:false,initiative:gi}));
    combatants.push({name:gname,type:'monster',initiative:gi,hp:m.hp,hpMax:m.hp,ac:m.ac,dex,conditions:[],isGroup:true,count,members,expanded:false});
  } else {
    let name=m.name, n=2; while(combatants.find(x=>x.name===name)) name=m.name+' '+(n++);
    combatants.push({name,type:'monster',initiative:roll?d20()+mod:0,hp:m.hp,hpMax:m.hp,ac:m.ac,dex,conditions:[]});
  }
  if(roll){ const cur=currentTurn>=0?combatants[currentTurn]:null; combatants.sort((a,b)=>b.initiative-a.initiative); if(cur) currentTurn=combatants.indexOf(cur); }
  renderInitList(); updateInitSelects();
  toast('Added '+(count>1?count+' × ':'')+m.name+' to the fight','Open Combat',()=>sw('init'));
}

function addMonsterToStep7(m,count){
  const card = mkCard('mon-list',[
    {cols:5,items:[{key:'mn-name',label:'Name',placeholder:'Monster'},{key:'mn-cr',label:'CR',placeholder:'CR'},{key:'mn-hp',label:'HP',placeholder:'HP'},{key:'mn-ac',label:'AC',placeholder:'AC'},{key:'mn-n',label:'Count',placeholder:'1'}]},
    {cols:2,items:[{key:'mn-mot',label:'Motivation',placeholder:''},{key:'mn-tac',label:'Tactics',placeholder:''}]},
    {cols:1,items:[{key:'mn-notes',label:'What Makes It Interesting?',type:'textarea',rows:1,placeholder:'',span:true}]}
  ]);
  if(card){
    const setK = (k,v) => { const el=card.querySelector('[data-key="'+k+'"]'); if(el)el.value=v; };
    setK('mn-name',m.name); setK('mn-cr',m.cr); setK('mn-hp',m.hp); setK('mn-ac',m.ac); setK('mn-n',String(Math.max(1,parseInt(count)||1)));
    setK('mn-tac', m.actions ? m.actions.split(',')[0] : '');
  }
  if(card) addInitBtnToMonCard(card);
  if(typeof renderEncTester==='function') setTimeout(renderEncTester,50);
  toast('Prepared '+(parseInt(count)>1?parseInt(count)+' × ':'')+m.name,'Open prepared list',()=>{ if(window.__tomeGoPrepared) window.__tomeGoPrepared(); else sw('s7'); });
}

// Also hook MDB search inputs (no onclick, use input/change events)
document.addEventListener('input', e => {
  if(e.target && e.target.id==='mdb-search') filterMonsters();
});
document.addEventListener('change', e => {
  if(e.target && (e.target.id==='mdb-cr'||e.target.id==='mdb-type')) filterMonsters();
});


// ══════════════════════════════════════════════════════
//  SPELL DATABASE (D&D 5e SRD)
// ══════════════════════════════════════════════════════
let SPELLS = [];

// Spell lookup map
const SPELL_MAP = {};
let SPELL_RE = null;
const SPELL_STOP = new Set(['light','command','message','shield','resistance','sleep','fear','haste','slow','silence','fly','web','darkness','guidance','blur','bane','bless','heroism','sanctuary','invisibility','fog cloud','jump','longstrider','shatter','banishment','confusion','blight','contagion','harm','heal','sending','teleport','wish','gate','antimagic field']);

// ──────────────────────────────────────────────────────
//  SPELL TOOLTIP SYSTEM
// ──────────────────────────────────────────────────────
let spellTooltipEl = null;
let spellModalEl = null;

function initSpellUI(){
  // Create tooltip element
  spellTooltipEl = document.createElement('div');
  spellTooltipEl.className = 'spell-tooltip';
  spellTooltipEl.id = 'spell-tooltip';
  (document.getElementById('tome')||document.body).appendChild(spellTooltipEl);

  // Create spell modal
  spellModalEl = document.createElement('div');
  spellModalEl.className = 'spell-modal-bg';
  spellModalEl.id = 'spell-modal-bg';
  spellModalEl.innerHTML = `<div class="spell-modal" id="spell-modal-inner">
    <button class="spell-modal-close" id="spell-modal-close">✕</button>
    <div class="spell-modal-name" id="sm-name"></div>
    <div class="spell-modal-meta" id="sm-meta"></div>
    <div class="spell-modal-stat-row" id="sm-stats"></div>
    <div class="spell-modal-desc" id="sm-desc"></div>
    <div class="spell-class-tags" id="sm-classes"></div>
  </div>`;
  (document.getElementById('tome')||document.body).appendChild(spellModalEl);

  spellModalEl.addEventListener('click', e => {
    if(e.target === spellModalEl) closeSpellModal();
  });
  document.getElementById('spell-modal-close').addEventListener('click', closeSpellModal);
}

function openSpellModal(spell){
  const lvlStr = spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`;
  document.getElementById('sm-name').textContent = spell.name;
  document.getElementById('sm-meta').textContent = `${lvlStr} · ${spell.school} · ${spell.castTime}`;
  document.getElementById('sm-stats').innerHTML = [
    {l:'Range', v:spell.range},
    {l:'Components', v:spell.components},
    {l:'Duration', v:spell.duration},
  ].map(s=>`<div class="spell-modal-stat"><label>${s.l}</label><p>${s.v}</p></div>`).join('');
  document.getElementById('sm-desc').innerHTML = spell.desc.split('\n').map(p=>`<p>${p}</p>`).join('');
  document.getElementById('sm-classes').innerHTML = spell.classes.map(c=>`<span class="spell-class-tag">${c}</span>`).join('');
  spellModalEl.classList.add('open');
}

function closeSpellModal(){
  if(spellModalEl) spellModalEl.classList.remove('open');
}

function showSpellTooltip(spell, x, y){
  const lvlStr = spell.level === 0 ? 'Cantrip' : `${spell.level}${spell.level===1?'st':spell.level===2?'nd':spell.level===3?'rd':'th'}-level`;
  spellTooltipEl.innerHTML = `
    <div class="spell-tooltip-name">${spell.name}</div>
    <div class="spell-tooltip-meta">${lvlStr} ${spell.school} · ${spell.castTime} · ${spell.range}</div>
    <div class="spell-tooltip-desc">${spell.desc.slice(0,220)}${spell.desc.length>220?'…':''}</div>
    <div class="spell-tooltip-components">${spell.components} · ${spell.duration} · Click for full details</div>`;
  
  // Position tooltip
  const vw = window.innerWidth, vh = window.innerHeight;
  spellTooltipEl.style.left = Math.min(x + 12, vw - 360) + 'px';
  spellTooltipEl.style.top = Math.min(y - 10, vh - 200) + 'px';
  spellTooltipEl.classList.add('visible');
}

function hideSpellTooltip(){
  if(spellTooltipEl) spellTooltipEl.classList.remove('visible');
}

function wrapSpellsInElement(el){
  // Walk text nodes and wrap spell names with clickable buttons
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  let node;
  while(node = walker.nextNode()) nodes.push(node);
  
  if(!SPELL_RE) return;
  nodes.forEach(textNode => {
    const parent = textNode.parentNode;
    if(!parent || parent.classList.contains('spell-link') || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || (parent.closest && parent.closest('button,label,select,option,textarea,.dmg-bar-title,.stitle,.tab-groups,.modal-title,.run-h,.cp-sec,.cs-hdr,[data-cs-panel="story"],[data-cs-panel="features"],[data-cs-panel="gear"]'))) return;
    
    let text = textNode.textContent;
    let changed = false;
    const frag = document.createDocumentFragment();
    let lastIdx = 0;
    
    const regex = SPELL_RE; if(!regex) return;
    regex.lastIndex = 0;
    let match;
    
    while((match = regex.exec(text)) !== null){
      const spellKey = match[0].toLowerCase();
      const spell = SPELL_MAP[spellKey];
      if(!spell) continue;
      if(SPELL_STOP.has(spellKey) && !/^[A-Z]/.test(match[0])) continue;
      changed = true;
      
      if(match.index > lastIdx){
        frag.appendChild(document.createTextNode(text.slice(lastIdx, match.index)));
      }
      const btn = document.createElement('button');
      btn.className = 'spell-link';
      btn.textContent = match[0];
      btn.addEventListener('mouseenter', e => showSpellTooltip(spell, e.clientX, e.clientY));
      btn.addEventListener('mousemove', e => showSpellTooltip(spell, e.clientX, e.clientY));
      btn.addEventListener('mouseleave', hideSpellTooltip);
      btn.addEventListener('click', e => { e.stopPropagation(); hideSpellTooltip(); openSpellModal(spell); });
      frag.appendChild(btn);
      lastIdx = match.index + match[0].length;
    }
    
    if(changed){
      if(lastIdx < text.length) frag.appendChild(document.createTextNode(text.slice(lastIdx)));
      parent.replaceChild(frag, textNode);
    }
  });
}


// ══════════════════════════════════════════════════════
//  CONDITIONS REFERENCE
// ══════════════════════════════════════════════════════
const CONDITIONS = [
  {name: 'Blinded', icon: '👁', summary: 'Can\'t see and fail any check that needs sight. Attacks against you have Advantage, and your attacks have Disadvantage.', effects: ['Can\'t See. You can\'t see and automatically fail any ability check that requires sight.', 'Attacks Affected. Attack rolls against you have Advantage, and your attack rolls have Disadvantage.']},
  {name: 'Charmed', icon: '💕', summary: 'Can\'t attack the charmer or target them with harmful effects. The charmer has Advantage on social checks against you.', effects: ['Can\'t Harm the Charmer. You can\'t attack the charmer or target the charmer with damaging abilities or magical effects.', 'Social Advantage. The charmer has Advantage on ability checks to interact socially with you.']},
  {name: 'Deafened', icon: '🔇', summary: 'Can\'t hear and fail any check that needs hearing.', effects: ['Can\'t Hear. You can\'t hear and automatically fail any ability check that requires hearing.']},
  {name: 'Exhaustion', icon: '😴', summary: 'Each level: −2 to every D20 Test and −5 ft Speed. Level 6 is death. A long rest removes 1 level.', effects: ['Exhaustion Levels. This condition is cumulative. Each time you receive it, you gain 1 Exhaustion level. You die if your Exhaustion level is 6.', 'D20 Tests Affected. When you make a D20 Test, the roll is reduced by 2 times your Exhaustion level.', 'Speed Reduced. Your Speed is reduced by a number of feet equal to 5 times your Exhaustion level.', 'Removing Exhaustion Levels. Finishing a Long Rest removes 1 of your Exhaustion levels. When your Exhaustion level reaches 0, the condition ends.']},
  {name: 'Frightened', icon: '😨', summary: 'Disadvantage on checks and attacks while you can see the source of fear. You can\'t willingly move closer to it.', effects: ['Ability Checks and Attacks Affected. You have Disadvantage on ability checks and attack rolls while the source of fear is within line of sight.', 'Can\'t Approach. You can\'t willingly move closer to the source of your fear.']},
  {name: 'Grappled', icon: '🤼', summary: 'Speed 0. Disadvantage on attacks against anyone except the grappler, who can drag you along.', effects: ['Speed 0. Your Speed is 0 and can\'t increase.', 'Attacks Affected. You have Disadvantage on attack rolls against any target other than the grappler.', 'Movable. The grappler can drag or carry you when it moves, but every foot of movement costs it 1 extra foot unless you are Tiny or two or more sizes smaller.']},
  {name: 'Incapacitated', icon: '💫', summary: 'No actions, bonus actions or reactions. Concentration breaks. You can\'t speak.', effects: ['Inactive. You can\'t take any action, Bonus Action, or Reaction.', 'No Concentration. Your Concentration is broken.', 'Speechless. You can\'t speak.', 'Surprised. If you\'re Incapacitated when you roll Initiative, you have Disadvantage on the roll.']},
  {name: 'Invisible', icon: '👻', summary: 'Attacks against you have Disadvantage and yours have Advantage. Effects that need to see you can\'t target you. Advantage on initiative.', effects: ['Surprise. If you\'re Invisible when you roll Initiative, you have Advantage on the roll.', 'Concealed. You aren\'t affected by any effect that requires its target to be seen unless the effect\'s creator can somehow see you. Any equipment you are wearing or carrying is also concealed.', 'Attacks Affected. Attack rolls against you have Disadvantage, and your attack rolls have Advantage. If a creature can somehow see you, you don\'t gain this benefit against that creature.']},
  {name: 'Paralyzed', icon: '⚡', summary: 'Incapacitated, Speed 0. Auto-fail Str and Dex saves. Attacks against you have Advantage, and hits from within 5 ft are critical hits.', effects: ['Incapacitated. You have the Incapacitated condition.', 'Speed 0. Your Speed is 0 and can\'t increase.', 'Saving Throws Affected. You automatically fail Strength and Dexterity saving throws.', 'Attacks Affected. Attack rolls against you have Advantage.', 'Automatic Critical Hits. Any attack roll that hits you is a Critical Hit if the attacker is within 5 feet of you.']},
  {name: 'Petrified', icon: '🗿', summary: 'Turned to stone: Incapacitated, Speed 0, Resistance to all damage, immune to Poisoned. Auto-fail Str and Dex saves. Attacks against you have Advantage.', effects: ['Turned to Inanimate Substance. You are transformed, along with any nonmagical objects you are wearing and carrying, into a solid inanimate substance (usually stone). Your weight increases by a factor of ten, and you cease aging.', 'Incapacitated. You have the Incapacitated condition.', 'Speed 0. Your Speed is 0 and can\'t increase.', 'Attacks Affected. Attack rolls against you have Advantage.', 'Saving Throws Affected. You automatically fail Strength and Dexterity saving throws.', 'Resist Damage. You have Resistance to all damage.', 'Poison Immunity. You have Immunity to the Poisoned condition.', 'Saving Throws Affected. You automatically fail Strength and Dexterity saving throws.', 'Resist Damage. You have Resistance to all damage.', 'Poison Immunity. You have Immunity to the Poisoned condition.']},
  {name: 'Poisoned', icon: '☠', summary: 'Disadvantage on attack rolls and ability checks.', effects: ['Ability Checks and Attacks Affected. You have Disadvantage on attack rolls and ability checks.']},
  {name: 'Prone', icon: '🛌', summary: 'You crawl, or spend half your Speed to stand up. Disadvantage on your attacks. Attacks against you have Advantage from within 5 ft, otherwise Disadvantage.', effects: ['Restricted Movement. Your only movement options are to crawl or to spend an amount of movement equal to half your Speed (round down) to right yourself and thereby end the condition. If your Speed is 0, you can\'t right yourself.', 'Attacks Affected. You have Disadvantage on attack rolls. An attack roll against you has Advantage if the attacker is within 5 feet of you. Otherwise, that attack roll has Disadvantage.']},
  {name: 'Restrained', icon: '⛓', summary: 'Speed 0. Attacks against you have Advantage and yours have Disadvantage. Disadvantage on Dex saves.', effects: ['Speed 0. Your Speed is 0 and can\'t increase.', 'Attacks Affected. Attack rolls against you have Advantage, and your attack rolls have Disadvantage.', 'Saving Throws Affected. You have Disadvantage on Dexterity saving throws.']},
  {name: 'Stunned', icon: '😵', summary: 'Incapacitated. Auto-fail Str and Dex saves. Attacks against you have Advantage.', effects: ['Incapacitated. You have the Incapacitated condition.', 'Saving Throws Affected. You automatically fail Strength and Dexterity saving throws.', 'Attacks Affected. Attack rolls against you have Advantage.']},
  {name: 'Unconscious', icon: '💤', summary: 'Incapacitated and Prone, you drop what you hold, Speed 0, unaware. Auto-fail Str and Dex saves. Attacks have Advantage, and hits from within 5 ft are critical hits.', effects: ['Inert. You have the Incapacitated and Prone conditions, and you drop whatever you\'re holding.', '**When this condition ends, you remain Prone.', 'Speed 0. Your Speed is 0 and can\'t increase.', 'Attacks Affected. Attack rolls against you have Advantage.', 'Saving Throws Affected. You automatically fail Strength and Dexterity saving throws.', 'Automatic Critical Hits. Any attack roll that hits you is a Critical Hit if the attacker is within 5 feet of you.', 'Unaware. You\'re unaware of your surroundings.']}
];

function renderConditions(){
  const grid = document.getElementById('cond-grid');
  if(!grid) return;
  grid.innerHTML = '';
  CONDITIONS.forEach((cond, i) => {
    const card = document.createElement('div');
    card.className = 'cond-card';
    card.innerHTML = `
      <div class="cond-card-name">
        <span>${cond.name}</span>
        <span class="cond-icon">${cond.icon}</span>
      </div>
      <div class="cond-card-summary">${cond.summary}</div>
      <div class="cond-card-detail" id="cond-detail-${i}">
        <ul>${cond.effects.map(e=>`<li>${e}</li>`).join('')}</ul>
        <div class="cond-apply-bar">
          <span style="font-family:var(--hfont);font-size:calc(max(.6,.8)*var(--tu));letter-spacing:.09em;text-transform:uppercase;color:var(--ink-light)">Apply to:</span>
          <select id="cond-apply-sel-${i}" style="font-size:calc(.82*var(--tu));padding:.2rem .4rem;min-width:100px">
            <option value="">— combatant —</option>
          </select>
          <button class="abtn" style="font-size:calc(max(.6,.8)*var(--tu));padding:.2rem .55rem" data-cond-apply="${i}">Apply</button>
        </div>
      </div>`;
    card.addEventListener('click', e => {
      if(e.target.closest('[data-cond-apply]') || e.target.closest('select')) return;
      card.classList.toggle('open');
      // Populate combatant select when opened
      if(card.classList.contains('open')){
        const sel = document.getElementById('cond-apply-sel-'+i);
        sel.innerHTML = '<option value="">— combatant —</option>';
        combatants.forEach((cb, ci) => {
          const opt = document.createElement('option');
          opt.value = ci; opt.textContent = cb.name;
          sel.appendChild(opt);
        });
      }
    });
    const applyBtn = card.querySelector('[data-cond-apply]');
    if(applyBtn) applyBtn.addEventListener('click', e => {
      e.stopPropagation();
      const sel = document.getElementById('cond-apply-sel-'+i);
      const idx = parseInt(sel.value);
      if(isNaN(idx)) return;
      if(!combatants[idx].conditions.includes(cond.name)){
        combatants[idx].conditions.push(cond.name);
        renderInitList();
      }
      // Flash feedback
      applyBtn.textContent = '✓';
      setTimeout(()=>applyBtn.textContent='Apply', 1200);
    });
    grid.appendChild(card);
  });
}

// ══════════════════════════════════════════════════════
//  RELATIONSHIP WEB  (canvas-based force graph)
// ══════════════════════════════════════════════════════
const WEB_COLORS = {
  pc:       '#8b1a1a',
  npc:      '#1a2a4a',
  faction:  '#1a4a2e',
  location: '#5a3a12',
  concept:  '#4a1a4a'
};

const REL_COLORS = {
  ally:     '#1a4a2e',
  enemy:    '#8b1a1a',
  neutral:  '#7a5c2e',
  romantic: '#8b1a4a',
  family:   '#1a3a6a',
  rivalry:  '#c0392b',
  secret:   '#4a1a4a',
  debt:     '#5a3a12',
  member:   '#1a4a3a'
};

let webNodes = [];
let webEdges = [];
let webDragging = null;
let webDragOffX = 0, webDragOffY = 0;
let webSelectedNode = null;
let webCanvas, webCtx;
let webAnimFrame = null;

function webInit(){
  webCanvas = document.getElementById('web-canvas');
  if(!webCanvas) return;
  webCtx = webCanvas.getContext('2d');

  // Size canvas
  webResizeCanvas();
  window.addEventListener('resize', webResizeCanvas);

  // Load saved web
  webLoad();

  // If no nodes yet, seed with Warryn
  if(webNodes.length === 0){
    webAddNodeData('Warryn', 'pc');
    webAddNodeData('Albus', 'npc');
    webAddNodeData('Warryn\'s Wife', 'npc');
    webAddEdge('Warryn', 'Albus', 'enemy', '20 years of grief — the man who took everything');
    webAddEdge('Warryn', 'Warryn\'s Wife', 'romantic', 'Lost — left with Albus 20 years ago');
    webAddEdge('Albus', 'Warryn\'s Wife', 'romantic', 'Stole her from Warryn');
  }

  // Pull in loaded PCs
  webSyncPCs();

  // Mouse / touch events
  webCanvas.addEventListener('mousedown', webOnMouseDown);
  webCanvas.addEventListener('mousemove', webOnMouseMove);
  webCanvas.addEventListener('mouseup',   webOnMouseUp);
  webCanvas.addEventListener('click',     webOnClick);
  webCanvas.addEventListener('touchstart', webOnTouchStart, {passive:false});
  webCanvas.addEventListener('touchmove',  webOnTouchMove,  {passive:false});
  webCanvas.addEventListener('touchend',   webOnTouchEnd);

  // Sync any already-loaded PCs into the web AFTER loading saved state
  webSyncPCs();
  webRender();
}

function webResizeCanvas(){
  if(!webCanvas) return;
  const rect = webCanvas.parentElement.getBoundingClientRect();
  webCanvas.width = rect.width || 800;
  webCanvas.height = 520;
}

function webShortName(ch){
  // Use player name if available, otherwise first word of character name
  if(ch.player) return ch.player + ' (' + ch.name.split(' ')[0] + ')';
  return ch.name.split(' ')[0];
}

function webSyncPCs(){
  if(!webCanvas) return; // Canvas not ready yet — will be called again in webInit
  let changed = false;
  loadedChars.forEach(ch => {
    const shortName = webShortName(ch);
    const fullName = ch.name;

    // Check for exact match on short name, full name, or first word of full name
    const firstWord = fullName.split(' ')[0];
    const existing = webNodes.find(n =>
      n.name === fullName ||
      n.name === shortName ||
      n.name === firstWord ||
      fullName.toLowerCase().startsWith(n.name.toLowerCase()) ||
      n.name.toLowerCase().startsWith(firstWord.toLowerCase())
    );

    if(existing){
      // Rename existing node to the short display name and mark as PC
      const oldName = existing.name;
      if(oldName !== shortName){
        // Update all edges referencing old name
        webEdges.forEach(e => {
          if(e.from === oldName) e.from = shortName;
          if(e.to === oldName) e.to = shortName;
        });
        existing.name = shortName;
        changed = true;
      }
      existing.type = 'pc';
    } else {
      webAddNodeData(shortName, 'pc');
      changed = true;
    }
  });
  webUpdateNodePanel();
  webUpdateRelTarget();
  if(changed) webSave();
}

function webAddNodeData(name, type){
  if(webNodes.find(n=>n.name===name)) return;
  const cx = webCanvas ? webCanvas.width/2 : 400;
  const cy = webCanvas ? webCanvas.height/2 : 260;
  const angle = Math.random()*Math.PI*2;
  const r = 80 + Math.random()*160;
  webNodes.push({
    name, type,
    x: cx + Math.cos(angle)*r,
    y: cy + Math.sin(angle)*r,
    vx: 0, vy: 0, r: 28
  });
}

function webAddEdge(from, to, type, note=''){
  const already = webEdges.find(e=>(e.from===from&&e.to===to)||(e.from===to&&e.to===from));
  if(already){ already.type=type; already.note=note; return; }
  webEdges.push({from, to, type, note});
}

function webGetNode(name){ return webNodes.find(n=>n.name===name); }

function webNodeAt(x, y){
  return webNodes.find(n => Math.hypot(n.x-x, n.y-y) <= n.r);
}

// ── MOUSE EVENTS ──
function webOnMouseDown(e){
  const {x,y} = webXY(e);
  const node = webNodeAt(x,y);
  if(node){ webDragging=node; webDragOffX=x-node.x; webDragOffY=y-node.y; webCanvas.style.cursor='grabbing'; }
}
function webOnMouseMove(e){
  if(!webDragging) return;
  const {x,y} = webXY(e);
  webDragging.x = x - webDragOffX;
  webDragging.y = y - webDragOffY;
}
function webOnMouseUp(){ webDragging=null; webCanvas.style.cursor='grab'; webSave(); }
function webOnClick(e){
  const {x,y} = webXY(e);
  const node = webNodeAt(x,y);
  if(node) webSelectNode(node);
  else webClosePanel();
}
function webXY(e){
  const rect = webCanvas.getBoundingClientRect();
  const scaleX = webCanvas.width / rect.width;
  const scaleY = webCanvas.height / rect.height;
  return { x:(e.clientX-rect.left)*scaleX, y:(e.clientY-rect.top)*scaleY };
}

// ── TOUCH EVENTS ──
function webOnTouchStart(e){ e.preventDefault(); const t=e.touches[0]; webOnMouseDown({clientX:t.clientX,clientY:t.clientY}); }
function webOnTouchMove(e){ e.preventDefault(); const t=e.touches[0]; webOnMouseMove({clientX:t.clientX,clientY:t.clientY}); }
function webOnTouchEnd(e){ webOnMouseUp(); }

// ── NODE PANEL ──
function webSelectNode(node){
  webSelectedNode = node;
  const panel = document.getElementById('web-node-panel');
  document.getElementById('wnp-name').textContent = node.name;
  document.getElementById('wnp-type').textContent = node.type.charAt(0).toUpperCase()+node.type.slice(1);
  // List relationships
  const relList = document.getElementById('wnp-rels');
  const rels = webEdges.filter(e=>e.from===node.name||e.to===node.name);
  if(rels.length===0){
    relList.innerHTML = '<div style="font-family:var(--bfont);font-style:italic;font-size:calc(.8*var(--tu));color:var(--ink-light)">No connections yet.</div>';
  } else {
    relList.innerHTML = rels.map(e=>{
      const other = e.from===node.name ? e.to : e.from;
      const col = REL_COLORS[e.type]||'#7a5c2e';
      return `<div class="web-rel-item">
        <span class="web-rel-dot" style="background:${col}"></span>
        <span><strong>${e.type}</strong> → ${other}${e.note?` <em style="font-size:calc(max(.78,.8)*var(--tu));color:var(--ink-light)"> · ${e.note}</em>`:''}</span>
        <button style="margin-left:auto;background:none;border:none;color:var(--parch-shadow);cursor:pointer;font-size:calc(max(.75,.8)*var(--tu))" data-del-edge="${e.from}||${e.to}">✕</button>
      </div>`;
    }).join('');
    relList.querySelectorAll('[data-del-edge]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const [f,t]=btn.dataset.delEdge.split('||');
        webEdges=webEdges.filter(e=>!(e.from===f&&e.to===t)&&!(e.from===t&&e.to===f));
        webSelectNode(node); webSave();
      });
    });
  }
  webUpdateRelTarget();
  panel.classList.add('open');
}

function webClosePanel(){
  const panel = document.getElementById('web-node-panel');
  if(panel) panel.classList.remove('open');
  webSelectedNode = null;
}

function webUpdateRelTarget(){
  const sel = document.getElementById('wnp-rel-target');
  if(!sel) return;
  const cur = sel.value;
  sel.innerHTML = '<option value="">— select node —</option>';
  webNodes.filter(n=>!webSelectedNode||n.name!==webSelectedNode.name).forEach(n=>{
    const opt=document.createElement('option');opt.value=n.name;opt.textContent=n.name;sel.appendChild(opt);
  });
  if(cur) sel.value=cur;
}

function webUpdateNodePanel(){
  if(webSelectedNode) webSelectNode(webSelectedNode);
}

// ── RENDER ──
function webRender(){
  if(!webCtx || !webCanvas) return;
  const W=webCanvas.width, H=webCanvas.height;
  webCtx.clearRect(0,0,W,H);

  // Faint grid
  webCtx.strokeStyle='rgba(180,130,60,.08)';
  webCtx.lineWidth=1;
  for(let x=0;x<W;x+=40){ webCtx.beginPath();webCtx.moveTo(x,0);webCtx.lineTo(x,H);webCtx.stroke(); }
  for(let y=0;y<H;y+=40){ webCtx.beginPath();webCtx.moveTo(0,y);webCtx.lineTo(W,y);webCtx.stroke(); }

  // Gentle repulsion to avoid overlap
  for(let i=0;i<webNodes.length;i++){
    for(let j=i+1;j<webNodes.length;j++){
      const a=webNodes[i],b=webNodes[j];
      const dx=b.x-a.x, dy=b.y-a.y;
      const dist=Math.max(Math.hypot(dx,dy),1);
      const minDist=a.r+b.r+20;
      if(dist<minDist&&a!==webDragging&&b!==webDragging){
        const force=(minDist-dist)/minDist*0.5;
        a.x-=dx/dist*force*4; a.y-=dy/dist*force*4;
        b.x+=dx/dist*force*4; b.y+=dy/dist*force*4;
      }
      // Keep in bounds
      [a,b].forEach(n=>{
        n.x=Math.max(n.r+4,Math.min(W-n.r-4,n.x));
        n.y=Math.max(n.r+4,Math.min(H-n.r-4,n.y));
      });
    }
  }

  // Draw edges
  webEdges.forEach(edge=>{
    const fromN=webGetNode(edge.from), toN=webGetNode(edge.to);
    if(!fromN||!toN) return;
    const col = REL_COLORS[edge.type]||'#7a5c2e';
    webCtx.save();
    webCtx.strokeStyle=col;
    webCtx.lineWidth=edge.type==='enemy'||edge.type==='rivalry'?2.5:1.8;
    if(edge.type==='secret'){ webCtx.setLineDash([6,4]); }
    else if(edge.type==='debt'){ webCtx.setLineDash([3,3]); }
    else { webCtx.setLineDash([]); }
    webCtx.globalAlpha=0.7;
    webCtx.beginPath();
    webCtx.moveTo(fromN.x,fromN.y);
    webCtx.lineTo(toN.x,toN.y);
    webCtx.stroke();

    // Edge label
    const mx=(fromN.x+toN.x)/2, my=(fromN.y+toN.y)/2;
    webCtx.setLineDash([]);
    webCtx.globalAlpha=1;
    webCtx.fillStyle=col;
    webCtx.font='bold 9px Cinzel, serif';
    webCtx.textAlign='center';
    webCtx.textBaseline='middle';
    const label=edge.type.toUpperCase();
    const lw=webCtx.measureText(label).width;
    webCtx.fillStyle='rgba(244,232,193,.85)';
    webCtx.fillRect(mx-lw/2-3,my-7,lw+6,14);
    webCtx.fillStyle=col;
    webCtx.fillText(label,mx,my);
    webCtx.restore();
  });

  // Draw nodes
  webNodes.forEach(node=>{
    const col=WEB_COLORS[node.type]||'#7a5c2e';
    const isSelected=webSelectedNode&&webSelectedNode.name===node.name;
    webCtx.save();

    // Shadow
    webCtx.shadowColor='rgba(0,0,0,.25)';
    webCtx.shadowBlur=8;

    // Circle
    webCtx.beginPath();
    webCtx.arc(node.x,node.y,node.r,0,Math.PI*2);
    webCtx.fillStyle=isSelected?'rgba(244,232,193,.95)':'rgba(244,232,193,.88)';
    webCtx.fill();
    webCtx.strokeStyle=col;
    webCtx.lineWidth=isSelected?3.5:2;
    webCtx.stroke();

    webCtx.shadowBlur=0;

    // Type dot
    webCtx.beginPath();
    webCtx.arc(node.x+node.r-6,node.y-node.r+6,5,0,Math.PI*2);
    webCtx.fillStyle=col;
    webCtx.fill();

    // Name text — wrap if needed
    webCtx.fillStyle='#2c1a0e';
    webCtx.textAlign='center';
    webCtx.textBaseline='middle';
    const words=node.name.split(' ');
    const maxW=node.r*1.6;
    let lines=[],line='';
    words.forEach(w=>{
      const test=line?line+' '+w:w;
      webCtx.font='bold 10px Crimson Text, serif';
      if(webCtx.measureText(test).width>maxW&&line){ lines.push(line);line=w; }
      else line=test;
    });
    if(line)lines.push(line);
    const lineH=13, startY=node.y-(lines.length-1)*lineH/2;
    lines.forEach((l,li)=>{
      webCtx.font='bold 10px Crimson Text, serif';
      webCtx.fillText(l,node.x,startY+li*lineH);
    });

    webCtx.restore();
  });

  webAnimFrame = requestAnimationFrame(webRender);
}

// ── PUBLIC ACTIONS (called from dispatch) ──
function webAddNode(){
  const nameEl=document.getElementById('web-new-name');
  const typeEl=document.getElementById('web-new-type');
  const name=nameEl.value.trim();
  if(!name)return;
  webAddNodeData(name,typeEl.value);
  nameEl.value='';
  webUpdateRelTarget();
  webSave();
}

function webAddRel(){
  if(!webSelectedNode)return;
  const target=document.getElementById('wnp-rel-target').value;
  const type=document.getElementById('wnp-rel-type').value;
  const note=document.getElementById('wnp-rel-note').value.trim();
  if(!target)return;
  webAddEdge(webSelectedNode.name, target, type, note);
  document.getElementById('wnp-rel-note').value='';
  webSelectNode(webSelectedNode);
  webSave();
}

function webDeleteNode(){
  if(!webSelectedNode)return;
  if(!confirm(`Delete "${webSelectedNode.name}" and all its connections?`))return;
  webEdges=webEdges.filter(e=>e.from!==webSelectedNode.name&&e.to!==webSelectedNode.name);
  webNodes=webNodes.filter(n=>n.name!==webSelectedNode.name);
  webClosePanel();
  webSave();
}

function webResetFn(){
  if(!confirm('Reset the entire relationship web? This cannot be undone.'))return;
  webNodes=[];webEdges=[];webSelectedNode=null;
  webClosePanel();
  localStorage.removeItem('lazy-dm-web');
  // Re-seed
  webAddNodeData('Warryn','pc');
  webAddNodeData('Albus','npc');
  webAddNodeData("Warryn's Wife",'npc');
  webAddEdge('Warryn','Albus','enemy','The man who took everything');
  webAddEdge('Warryn',"Warryn's Wife",'romantic','Lost — left with Albus');
  webSyncPCs();
}

// ── SAVE / LOAD ──
function webSave(){
  localStorage.setItem('lazy-dm-web', JSON.stringify({
    nodes: webNodes.map(n=>({name:n.name,type:n.type,x:n.x,y:n.y})),
    edges: webEdges
  }));
}

function webLoad(){
  const raw=localStorage.getItem('lazy-dm-web');
  if(!raw)return;
  try{
    const data=JSON.parse(raw);
    if(data.nodes) webNodes=data.nodes.map(n=>({...n,vx:0,vy:0,r:28}));
    if(data.edges) webEdges=data.edges;
    // Remove any obviously duplicate PC nodes — keep the shorter/player-named one
    const seen = new Set();
    webNodes = webNodes.filter(n => {
      const key = n.name.split(' ')[0].toLowerCase();
      if(n.type === 'pc' && seen.has(key)){ return false; }
      if(n.type === 'pc') seen.add(key);
      return true;
    });
  }catch(e){ console.warn('Web load error',e); }
}

// ── DISPATCH WRAPPERS ──
function webAddNodeDispatch(){ webAddNode(); }
function webAddRelDispatch(){ webAddRel(); }
function webDeleteNodeDispatch(){ webDeleteNode(); }
function webClosePanelDispatch(){ webClosePanel(); }
function webResetDispatch(){ webResetFn(); }
function webSaveDispatch(){ webSave(); const s=document.getElementById('sst');s.classList.add('vis');setTimeout(()=>s.classList.remove('vis'),1500); }


// ══════════════════════════════════════════════════════
//  SCENES — FORK CARDS
// ══════════════════════════════════════════════════════
function addFork(){
  const card = mkCard('forks-list',[
    {cols:1, items:[{key:'fork-title', label:'Fork / Player Choice', placeholder:'e.g. Do they pursue Albus directly, or follow the gnome expedition first?'}]},
    {cols:2, items:[
      {key:'fork-a', label:'Path A', placeholder:'e.g. Follow Albus\'s trail north — faster but dangerous'},
      {key:'fork-b', label:'Path B', placeholder:'e.g. Join the expedition — slower, but may yield a clue'}
    ]},
    {cols:1, items:[{key:'fork-notes', label:'What changes based on their choice?', type:'textarea', rows:1, placeholder:'How does each path affect the session? What do they risk or gain?', span:true}]}
  ]);
  if(card) card.classList.add('fork-card');
}

// ══════════════════════════════════════════════════════
//  SECRETS — COUNTER + CARRY-FORWARD
// ══════════════════════════════════════════════════════
function updateSecretCounter(){
  const list = document.getElementById('secrets-list');
  const counter = document.getElementById('secret-counter');
  if(!list || !counter) return;
  const count = list.querySelectorAll('.card').length;
  counter.textContent = count + ' / 10';
  counter.classList.toggle('at-limit', count >= 10);
}

// Observe secrets list for changes
function initSecretCounter(){
  const list = document.getElementById('secrets-list');
  if(!list) return;
  const obs = new MutationObserver(updateSecretCounter);
  obs.observe(list, {childList: true});
  updateSecretCounter();
}

// Load a past session JSON and show undiscovered secrets
async function loadCarryForward(){
  const urlEl = document.getElementById('cf-url');
  const statusEl = document.getElementById('cf-status');
  const url = urlEl.value.trim();
  if(!url){ statusEl.className='gh-status err'; statusEl.textContent='Enter a session URL.'; return; }

  statusEl.className='gh-status ld'; statusEl.textContent='⟳ Loading past session…';
  try{
    const fetchUrl = url.replace('github.com','raw.githubusercontent.com').replace('/blob/','/');
    const res = await fetch(fetchUrl);
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data = await res.json();
    processCFData(data);
    statusEl.className='gh-status ok'; statusEl.textContent='✓ Loaded. Click secrets below to carry them forward.';
  } catch(e){
    statusEl.className='gh-status err'; statusEl.textContent='✗ '+e.message;
  }
}

function handleCFFile(input){
  const file = input.files[0]; if(!file) return;
  const statusEl = document.getElementById('cf-status');
  const reader = new FileReader();
  reader.onload = e => {
    try{
      const data = JSON.parse(e.target.result);
      processCFData(data);
      statusEl.className='gh-status ok';
      statusEl.textContent='✓ File loaded. Click secrets below to carry them forward.';
    } catch{ statusEl.className='gh-status err'; statusEl.textContent='Invalid JSON file.'; }
  };
  reader.readAsText(file);
}

function processCFData(data){
  // Extract secrets from past session
  // They're stored as [{sec: "text"}, ...] in secrets-list
  const pastSecrets = data['secrets-list'] || [];
  const pastDiscovered = (data['secrets-used'] || '').toLowerCase();

  // Filter to ones NOT mentioned in the post-session "secrets discovered" field
  const undiscovered = pastSecrets.filter(s => {
    const text = (s.sec || '').trim();
    if(!text) return false;
    // If the secret text (first 20 chars) appears in the post-session notes, consider it discovered
    const snippet = text.slice(0,20).toLowerCase();
    return !pastDiscovered.includes(snippet);
  });

  const panel = document.getElementById('carry-forward-panel');
  const list = document.getElementById('carry-forward-list');
  list.innerHTML = '';

  if(undiscovered.length === 0){
    list.innerHTML = '<div style="font-family:var(--bfont);font-style:italic;font-size:calc(.88*var(--tu));color:var(--ink-light)">All secrets from that session appear to have been discovered — or none were recorded.</div>';
    panel.style.display='block';
    return;
  }

  undiscovered.forEach((s, i) => {
    const text = s.sec || '';
    const item = document.createElement('div');
    item.className = 'cf-secret-item';
    item.id = 'cf-item-'+i;
    item.innerHTML = `<span class="cf-icon">📜</span>
      <span class="cf-text">${text}</span>
      <button class="cf-btn">Carry Forward</button>`;
    item.querySelector('.cf-btn').addEventListener('click', e => {
      e.stopPropagation();
      carryForwardSecret(text, i);
    });
    item.addEventListener('click', () => carryForwardSecret(text, i));
    list.appendChild(item);
  });

  panel.style.display = 'block';
}

function carryForwardSecret(text, idx){
  // Add to current session secrets list
  addSecret();
  const list = document.getElementById('secrets-list');
  const lastCard = list.lastElementChild;
  if(lastCard){
    const inp = lastCard.querySelector('[data-key="sec"]');
    if(inp) inp.value = text;
  }
  // Mark as carried in the carry-forward panel
  const item = document.getElementById('cf-item-'+idx);
  if(item){
    item.classList.add('carried');
    item.querySelector('.cf-btn').textContent = '✓ Added';
  }
  updateSecretCounter();
}

// Also override addSecret to update counter
const _origAddSecret = addSecret;
// We'll hook into it via MutationObserver set up in initSecretCounter


// ══════════════════════════════════════════════════════
//  RANDOM GENERATORS
//  Tables drawn from Lazy GM's Resource Document (CC BY 4.0)
//  slyflourish.com/lazy_gm_resource_document.html
// ══════════════════════════════════════════════════════

// ── UTILITY ──
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function pickN(arr,n){ const s=[...arr]; const out=[]; for(let i=0;i<n&&s.length;i++){const j=Math.floor(Math.random()*s.length);out.push(s.splice(j,1)[0]);} return out; }
function d(n){ return Math.floor(Math.random()*n)+1; }

function copyText(text){
  navigator.clipboard.writeText(text).catch(()=>{
    const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);
  });
}

function addToHistory(histId, text){
  const hist = document.getElementById(histId);
  if(!hist) return;
  const item = document.createElement('div');
  item.className = 'gen-history-item';
  item.textContent = text.length>80 ? text.slice(0,80)+'…' : text;
  item.title = text;
  item.addEventListener('click', ()=>copyText(text));
  hist.insertBefore(item, hist.firstChild);
  while(hist.children.length > 5) hist.removeChild(hist.lastChild);
}

function setResult(elId, text){
  const el = document.getElementById(elId);
  if(!el) return;
  el.textContent = text;
  el.classList.remove('fresh');
  void el.offsetWidth; // force reflow
  el.classList.add('fresh');
  el.onclick = ()=>copyText(text);
}

// ── NAME TABLES ──
const NAMES = {
  human: {
    m: ['Aldric','Brynn','Caelan','Dax','Edric','Faolan','Gareth','Hadwin','Idris','Joren','Kellan','Lucian','Maren','Nolan','Osric','Peregrine','Quinn','Rowan','Soren','Tavish','Ulric','Vance','Wren','Xavier','Yoren','Zane'],
    f: ['Aelith','Briar','Calla','Dena','Elara','Fiona','Gwen','Hilda','Isla','Jessa','Kira','Lyra','Mira','Nessa','Orla','Penna','Quinn','Rhea','Sera','Tara','Una','Vesper','Willa','Xara','Yara','Zola'],
    n: ['Ash','Bay','Cael','Dale','Eden','Fern','Glen','Haven','Indigo','Jade','Kael','Lane','Marsh','North','Onyx','Pine','Reed','Sage','Thorn','Vale','West','Yew'],
    surname: ['Ashford','Blackwood','Crane','Duskmantle','Embervale','Fairweather','Goldenrod','Hawthorne','Ironwood','Justcroft','Kettleworth','Lightwood','Moorhill','Nighthollow','Oakenshield','Pendleton','Quickwater','Ravenscroft','Silverstone','Thornwick','Underhill','Vance','Waterford','Yarrow'],
  },
  elf: {
    m: ['Aelindor','Berrian','Carric','Darathas','Erevan','Filarion','Galinndan','Heian','Immeral','Jorildyn','Kaeldrak','Lucan','Mindartis','Nuvian','Orist','Paelias','Quarion','Riardon','Soveliss','Thamior','Urbem','Varis','Zinnadan'],
    f: ['Adrie','Birel','Caelynn','Dara','Enna','Faral','Gennal','Hadarai','Ilanis','Jelenneth','Keyleth','Leshanna','Mialee','Naivara','Quillathe','Rania','Sariel','Thia','Urvel','Valanthe','Xanaphia','Yalanue','Zylvara'],
    n: ['Aelith','Caer','Dae','Elin','Faen','Gaer','Iril','Laer','Mael','Nael','Orin','Pael','Raen','Sael','Taer','Vael','Xael'],
    surname: ['Amakiir','Brightwood','Celebrant','Dawnwhisper','Evenwood','Galanodel','Holimion','Ilphelkiir','Liadon','Meliamne','Naïlo','Ostoroth','Siannodel','Trisimia','Xiloscient','Yambala'],
  },
  dwarf: {
    m: ['Adrik','Baern','Brottor','Dain','Darrak','Delg','Eberk','Einkil','Fargrim','Gardain','Harbek','Kildrak','Morgran','Orsik','Oskar','Rangrim','Rurik','Taklinn','Thoradin','Thorin','Tordek','Traubon','Travok','Ulfgar','Veit','Vondal'],
    f: ['Amber','Artin','Audhild','Bardryn','Dagnal','Diesa','Eldeth','Falkrunn','Finellen','Gunnloda','Gurdis','Helja','Hlin','Kathra','Kristryd','Ilde','Liftrasa','Mardred','Riswynn','Sannl','Torbera','Torgga','Vistra'],
    n: ['Bram','Daen','Eld','Garn','Helm','Keld','Mord','Orn','Reld','Teld','Veld'],
    surname: ['Balderk','Battlehammer','Boulderhold','Dankil','Fireforge','Frostbeard','Goblinbane','Hardcheese','Highpeak','Holderhek','Ironfist','Loderr','Lutgehr','Rumnaheim','Strakeln','Torunn','Ungart'],
  },
  halfling: {
    m: ['Alton','Ander','Cade','Corrin','Eldon','Errich','Finnan','Garret','Lindal','Lyle','Merric','Milo','Osborn','Perrin','Reed','Roscoe','Wellby'],
    f: ['Andry','Bree','Callie','Cora','Euphemia','Jillian','Kithri','Lavinia','Lidda','Merla','Nedda','Paela','Portia','Seraphina','Shaena','Trym','Vani','Verna','Wella'],
    n: ['Cob','Del','Fen','Gill','Hay','Lob','Mel','Nob','Rob','Tob'],
    surname: ['Brushgather','Goodbarrel','Greenbottle','High-hill','Hilltopple','Leagallow','Tealeaf','Thorngage','Tosscobble','Underbough'],
  },
  gnome: {
    m: ['Alston','Alvyn','Boddynock','Brocc','Burgell','Dimble','Eldon','Erky','Fonkin','Frug','Gerbo','Gimble','Glim','Jebeddo','Kellen','Namfoodle','Orryn','Roondar','Seebo','Sindri','Warryn','Wrenn','Zook'],
    f: ['Bimpnottin','Breena','Caramip','Carlin','Donella','Duvamil','Ella','Ellyjobell','Ellywick','Lilli','Loopmottin','Lorilla','Mardnab','Nissa','Nyx','Oda','Orla','Roywyn','Shamil','Tana','Waywocket','Zanna'],
    n: ['Bim','Dim','Fim','Glim','Nim','Pim','Rim','Tim','Vim','Wim','Zim'],
    surname: ['Beren','Daergel','Folkor','Garrick','Nackle','Murnig','Ningel','Raulnor','Scheppen','Turen','Zabble'],
  },
  'half-orc': {
    m: ['Dench','Feng','Gell','Henk','Holg','Imsh','Keth','Krusk','Mhurren','Ront','Shump','Thokk'],
    f: ['Baggi','Emen','Engong','Kansif','Myev','Neega','Ovak','Ownka','Shautha','Sutha','Vola','Volen','Yevelda'],
    n: ['Grak','Hrak','Krak','Mrak','Nrak','Rak','Srak','Trak','Vrak','Wrak'],
    surname: ['Bloodtusk','Breakbone','Doomhammer','Giantkin','Gnarlhide','Ironjaw','Manyarrows','Orcbane','Skullsmasher','Stonebones','Warcry','Wurmspeaker'],
  },
  tiefling: {
    m: ['Akmenos','Amnon','Barakas','Damakos','Ekemon','Iados','Kairon','Leucis','Melech','Mordai','Morthos','Pelaios','Skamos','Therai'],
    f: ['Akta','Anakis','Bryseis','Criella','Damaia','Ea','Kallista','Lerissa','Makaria','Nemeia','Orianna','Phelaia','Rieta'],
    virtue: ['Art','Carrion','Chant','Creed','Despair','Excellence','Fear','Glory','Hope','Ideal','Infamy','Insight','Iscariot','Languish','Laughter','Malice','Music','Nowhere','Open','Pain','Poetry','Quest','Random','Reverence','Sorrow','Temerity','Torment','Travail','Uncertainty','Vengeance','Vice','Virtue','Weary','Windfall'],
    surname: ['Charcoal','Embermane','Flamehair','Hellstep','Infernalis','Morningstar','Nightflame','Onyxblaze','Pitfire','Redclaw','Smokefang','Sultana'],
  },
  dragonborn: {
    m: ['Arjhan','Balasar','Bharash','Donaar','Ghesh','Heskan','Kriv','Medrash','Mehen','Nadarr','Pandjed','Patrin','Rhogar','Shamash','Shedinn','Tarhun','Torinn'],
    f: ['Akra','Biri','Dazzlewing','Farideh','Harann','Havilar','Jheri','Kava','Korinn','Mishann','Nala','Perra','Raiann','Sora','Surina','Thava','Uadjit'],
    n: ['Dax','Fex','Hex','Jex','Kex','Lex','Mex','Nex','Rex','Vex'],
    clan: ['Clethtinthiallor','Daardendrian','Delmirev','Drachedandion','Fenkenkabradon','Kepeshkmolik','Kerrhylon','Kimbatuul','Linxakasendalor','Myastan','Nemmonis','Norixius','Ophinshtalajiir','Prexijandilin','Shestendeliath','Turnuroth','Yarjerit'],
  },
};

function genName(race, genderPref){
  const r = race==='any' ? pick(['human','human','human','elf','dwarf','halfling','gnome','half-orc','tiefling','dragonborn']) : race;
  const table = NAMES[r] || NAMES.human;
  const g = genderPref==='any' ? pick(['m','f','n']) : genderPref;
  const firstName = pick(table[g] || table.m || table.f);
  const surnameKey = table.clan ? 'clan' : table.virtue ? (Math.random()<0.4?'virtue':'surname') : 'surname';
  const surname = table[surnameKey] ? pick(table[surnameKey]) : '';
  return { name: surname ? firstName+' '+surname : firstName, race: r.charAt(0).toUpperCase()+r.slice(1) };
}

// ── NPC TABLES ──
const NPC_OCCUPATIONS = [
  'Blacksmith','Innkeeper','Guard','Merchant','Herbalist','Sage','Fisherman','Farmer','Priest',
  'Thief','Soldier','Scholar','Apothecary','Hunter','Miner','Cook','Courier','Dockworker',
  'Beggar','Noble','Spy','Assassin','Bard','Cartographer','Alchemist','Gravedigger',
  'Tax collector','Fence','Acolyte','Seamstress','Miller','Chandler','Glassblower','Scribe',
  'Jailer','Bounty hunter','Fortune teller','Rat catcher','Undertaker','Midwife',
];

const NPC_APPEARANCES = [
  'A livid scar across one cheek','Burns on both hands','Mismatched eyes','Constantly wringing hands',
  'Never makes eye contact','Speaks only in whispers','Extremely tall, stooped to fit through doors',
  'Fingers stained with ink','Missing two fingers on the left hand','Wears a hood indoors',
  'Smells strongly of pipe smoke','Ostentatiously expensive clothing, worn and dirty',
  'Blind in one eye, milky white','Nervous laugh after every sentence','Fidgets with a ring constantly',
  'Never stops eating','Heavily tattooed forearms','A limp that worsens when nervous',
  'Speaks three languages, switches mid-sentence','Extraordinarily beautiful, clearly knows it',
  'Chews a toothpick endlessly','Has a tell: touches their ear when lying',
  'Carries a lute but refuses to play','Always has dirt under their fingernails',
  'A permanent look of mild disappointment','Wears medals from a forgotten war',
  'One hand is mechanical — gears visible at the wrist','Laughs at their own jokes, alone',
];

const NPC_TRAITS = [
  'Believes they are always the smartest person in the room','Compulsively generous to a fault',
  'Harbours a secret shame they can never mention','Would do anything for a warm meal and a bed',
  'Deeply superstitious — won\'t walk under ladders, fears black cats','Collects strange trinkets',
  'Fiercely loyal to the first person who was kind to them','Has a code of honour no one else understands',
  'Desperately lonely but pushes everyone away','Keeps meticulous records of perceived slights',
  'Genuinely believes they are cursed','Speaks about themselves in the third person when nervous',
  'Has strong opinions about the correct way to do everything','Refuses to sleep indoors',
  'Obsessively tidy — cannot focus if something is out of place','Lies reflexively, even about trivial things',
  'Has a complicated relationship with a dead parent','Dreams of escaping to the sea',
  'Deeply religious but privately doubts everything','Gambles compulsively and always loses',
];

const NPC_WANTS = [
  'To find a missing family member','To pay off a crushing debt before it ruins them',
  'To expose a corrupt official without getting killed','To find proof of something everyone thinks is a myth',
  'To retire somewhere no one knows their name','To be respected — properly, not feared',
  'To get revenge on someone who wronged them years ago','To protect someone who doesn\'t know they\'re in danger',
  'To sell something very valuable without anyone knowing what it is',
  'To learn the truth about their own past','To quietly disappear from their current life',
  'To find a cure for an illness afflicting someone they love',
  'To complete a task their dead mentor left unfinished','To impress someone who doesn\'t notice them',
  'To stop a deal they made years ago from coming due','To leave their faction without being hunted',
  'To find somewhere safe for people who depend on them',
  'To acquire a specific rare item, no questions asked',
  'To be forgiven — by anyone, for anything','To find out who has been watching them',
];

const NPC_SECRETS = [
  'Is working for someone the party would recognise','Was present at a famous crime or disaster',
  'Has a second identity no one knows about','Owes a life debt to a very dangerous person',
  'Knows the location of something valuable and hidden','Is being blackmailed',
  'Has been replaced — this is not the real person','Is dying and has months left',
  'Is secretly a member of a banned organisation','Has information that could start a war',
  'Was once someone important under a different name','Witnessed something they were paid to forget',
];

let lastNPC = null;

function genNPC(){
  const race = document.getElementById('npc-race-filter').value;
  const genderPref = document.getElementById('npc-gender-filter').value;
  const {name, race: raceName} = genName(race, genderPref);
  const occ = pick(NPC_OCCUPATIONS);
  const app = pick(NPC_APPEARANCES);
  const trait = pick(NPC_TRAITS);
  const want = pick(NPC_WANTS);
  const secret = Math.random()<0.5 ? pick(NPC_SECRETS) : null;

  lastNPC = { name, race: raceName, occupation: occ, appearance: app, trait, want, secret };

  const el = document.getElementById('npc-result');
  el.innerHTML = `
    <div class="gen-npc-name">${name}</div>
    <div class="gen-npc-detail">
      <strong>${raceName} ${occ}</strong><br>
      <em>Appearance:</em> ${app}<br>
      <em>Trait:</em> ${trait}<br>
      <em>Wants:</em> ${want}
      ${secret?`<br><em style="color:var(--red)">Secret:</em> ${secret}`:''}
    </div>`;

  const summary = `${name} (${raceName} ${occ}). ${app}. ${trait}. Wants: ${want}.${secret?' Secret: '+secret:''}`;
  addToHistory('npc-history', summary);
}

function genNPCSend(){
  if(!lastNPC){ genNPC(); }
  const card = mkCard('npc-list',[
    {cols:3,items:[{key:'np-name',label:'Name',placeholder:''},{key:'np-role',label:'Role',placeholder:''},{key:'np-fac',label:'Allegiance',placeholder:''}]},
    {cols:2,items:[{key:'np-trait',label:'One Distinguishing Trait',placeholder:''},{key:'np-want',label:'What They Want',placeholder:''}]},
    {cols:2,items:[{key:'np-goal',label:'Active Quest / Goal',placeholder:''},{key:'np-fic',label:'Based On (fiction)',placeholder:''}]},
    {cols:1,items:[{key:'np-notes',label:'Notes / Secrets',type:'textarea',rows:1,placeholder:'',span:true}]}
  ]);
  if(card && lastNPC){
    const set=(k,v)=>{const el=card.querySelector(`[data-key="${k}"]`);if(el)el.value=v;};
    set('np-name', lastNPC.name);
    set('np-role', lastNPC.race+' '+lastNPC.occupation);
    set('np-trait', lastNPC.appearance+'. '+lastNPC.trait);
    set('np-want', lastNPC.want);
    if(lastNPC.secret) set('np-notes', 'Secret: '+lastNPC.secret);
  }
  // Switch to NPC tab
  const btn = document.querySelector('[data-ac="tab-s6"]');
  if(btn) sw('s6', btn);
}

function genNPCCopy(){
  if(!lastNPC) return;
  const text = `${lastNPC.name} (${lastNPC.race} ${lastNPC.occupation})\n${lastNPC.appearance}. ${lastNPC.trait}\nWants: ${lastNPC.want}${lastNPC.secret?'\nSecret: '+lastNPC.secret:''}`;
  copyText(text);
}

// ── LOCATION TABLES ──
const LOC_PREFIXES = {
  any:       ['The Sunken','The Shattered','The Bleeding','The Forsaken','The Howling','The Ruined','The Forgotten','The Cursed','The Ancient','The Burning','The Frozen','The Hidden','The Crimson','The Black','The Gilded','The Weeping','The Hollow','The Silent','The Drowned','The Ashen'],
  dungeon:   ['The Shattered','The Sunken','The Forgotten','The Cursed','The Black','The Hollow','The Silent','The Bleeding'],
  city:      ['The Gilded','The Burning','The Hidden','The Crimson','The Weeping','The Old','The Merchant\'s','The Scholar\'s'],
  wilderness:['The Howling','The Ancient','The Frozen','The Hidden','The Whispering','The Feral','The Tangled','The Drowned'],
  arcane:    ['The Shimmering','The Pulsing','The Fractured','The Astral','The Warded','The Sealed','The Dreaming','The Unravelling'],
  underdark: ['The Lightless','The Fungal','The Drowned','The Chittering','The Deep','The Blind','The Slumbering','The Webbed'],
};
const LOC_NOUNS = {
  any:       ['Citadel','Spire','Vault','Hall','Sanctum','Chamber','Crypt','Tower','Pit','Library','Garden','Throne Room','Archives','Gate','Shrine','Tomb','Forge','Court','Cathedral','Keep'],
  dungeon:   ['Crypt','Vault','Pit','Chamber','Tomb','Dungeon','Forge','Gate','Throne Room','Cistern'],
  city:      ['Quarter','Market','Court','Square','Gate','Bridge','Harbour','Archive','Hall','Tower'],
  wilderness:['Glen','Pass','Falls','Gorge','Ruins','Mire','Grove','Peak','Ford','Hollow'],
  arcane:    ['Sanctum','Observatory','Nexus','Orrery','Labyrinth','Mirror Hall','Sphere','Library','Workshop','Void'],
  underdark: ['Cavern','Grotto','Chasm','Colony','Lake','Maze','Den','Rift','Bastion','Web'],
};
const LOC_ASPECTS = [
  'A pool of perfectly still water that reflects a different sky','Chains hanging from the ceiling, old bloodstains on the floor',
  'A massive crack in the wall through which cold wind howls','Hundreds of candles that never seem to burn down',
  'A throne made of weapons fused together by heat','A mosaic floor depicting a war no one has heard of',
  'Giant stone doors carved with faces that seem to watch','A clockwork mechanism of unknown purpose, still turning',
  'Shelves of jars containing things suspended in amber fluid','A circular pit descending beyond sight into darkness',
  'Scorch marks radiating from a central point on the ceiling','Writing in three languages covering every surface',
  'A mirror that shows the room as it was a hundred years ago','A massive scales, balanced perfectly, with no weights',
  'A trapdoor with no visible mechanism to open it','Barricades clearly built from the inside in desperation',
  'A half-eaten meal on a table, still warm','A column of floating stones rotating slowly around a void',
  'Runes that glow faintly when spoken to','The smell of rain though there are no windows',
  'A tree growing through the floor, petrified to stone','Footprints in dust that lead to — and not from — the centre',
  'A tapestry depicting the party themselves','A thousand small holes in the walls, each sealed with wax',
  'A door sized for something much larger than a human','Frost patterns on the walls despite the warmth',
  'A fountain flowing with something that is not water','Bodies in armour, seated upright at a table',
  'A child\'s toys arranged in a careful circle','An iron cage large enough for a dragon',
];

function genLoc(){
  const type = document.getElementById('loc-type-filter').value;
  const prefArr = LOC_PREFIXES[type] || LOC_PREFIXES.any;
  const nounArr = LOC_NOUNS[type] || LOC_NOUNS.any;
  const name = pick(prefArr)+' '+pick(nounArr);
  const aspects = pickN(LOC_ASPECTS, 3);
  const result = `${name}\n• ${aspects[0]}\n• ${aspects[1]}\n• ${aspects[2]}`;
  setResult('loc-result', result);
  addToHistory('loc-history', name+': '+aspects.join(' / '));
  window._lastLoc = {name, aspects};
}

function genLocSend(){
  if(!window._lastLoc) genLoc();
  const l = window._lastLoc;
  const card = mkCard('loc-list',[
    {cols:3,items:[{key:'lo-name',label:'Name',placeholder:''},{key:'lo-type',label:'Type',placeholder:''},{key:'lo-scale',label:'Scale',placeholder:''}]},
    {cols:1,items:[{key:'lo-desc',label:'Evocative Description',type:'textarea',rows:1,placeholder:'',span:true}]},
    {cols:1,items:[{key:'lo-asp',label:'Fantastic Aspects',type:'textarea',rows:1,placeholder:'',span:true}]}
  ]);
  if(card){
    const set=(k,v)=>{const el=card.querySelector(`[data-key="${k}"]`);if(el)el.value=v;};
    set('lo-name', l.name);
    set('lo-asp', l.aspects.map(a=>'• '+a).join('\n'));
  }
  const btn=document.querySelector('[data-ac="tab-s5"]');if(btn)sw('s5',btn);
}

// ── ENCOUNTER SEEDS ──
const ENC_SEEDS = {
  any: [
    'The objective is present but so is an innocent caught in the middle — saving them complicates everything.',
    'The enemy is outnumbered but holds a hostage and knows it.',
    'A third party arrives midway through with their own agenda.',
    'The environment itself is the primary danger — the combatants are secondary.',
    'The enemy doesn\'t want to fight — but has been told the party does.',
    'One side has information the other needs — violence means losing it.',
    'Something valuable will be destroyed if the fight escalates.',
    'The "enemy" is actually following orders from someone the party knows.',
    'Victory is possible but will take longer than the party has.',
    'The location gives one side a decisive advantage — unless the party changes the terrain.',
    'Help is coming — for the enemy.',
    'The party has been set up. The real threat is watching from a distance.',
    'An ally is revealed to have been compromised.',
    'The enemy knows the party\'s plan. Somehow.',
    'There are more of them. Many more.',
    'Winning this fight will make a powerful enemy elsewhere.',
  ],
  combat: [
    'The enemy uses the environment: fire, flooding, or collapse is imminent.',
    'The leader stays hidden until the party is weakened.',
    'The weakest enemy is bait — killing them triggers a trap.',
    'The enemy has reinforcements arriving in three rounds.',
    'Someone the party cares about is in the line of fire.',
    'The enemy will surrender if reduced to half — but they\'re lying.',
    'The battlefield is tilted — literally — floor sloping toward a pit.',
    'The enemy fights in darkness, has darkvision, the party doesn\'t.',
  ],
  social: [
    'The NPC knows something they haven\'t decided to share yet.',
    'The person being negotiated with wants the same thing the party wants — they just don\'t know it.',
    'A third party is listening and will use whatever is said.',
    'The NPC will help — but only if the party does something first.',
    'The NPC is testing the party. Failing the test closes a door permanently.',
    'Someone in the party has history with this NPC that changes the dynamic.',
    'A lie told earlier in the campaign comes up here.',
    'The NPC makes a reasonable offer. Refusing creates a long-term enemy.',
  ],
  exploration: [
    'The path ahead splits — one leads forward, one looks like a trap but isn\'t.',
    'Something has been disturbed recently. The party is not the first here.',
    'A resource the party needs (light, air, time) is running out.',
    'The map is wrong — deliberately.',
    'Something valuable is visible but requires significant risk to reach.',
    'A puzzle with three solutions — only two are safe.',
    'The party finds evidence of what happened to the last group that came here.',
    'A door that shouldn\'t be locked is locked. From the inside.',
  ],
  trap: [
    'A floor mosaic — beautiful, but every third tile is different stone (pressure plates).',
    'A door handle that casts shocking grasp on the first touch.',
    'A room that slowly fills with water when the door closes.',
    'A hallway of blades triggered by weight — the lightest party member must go first.',
    'A chest that casts suggestion ("leave and tell no one") when opened.',
    'Stairs that become a slide when weight exceeds a certain point.',
    'A room with air that smells of almonds. Poison gas, already filling it.',
    'A mirror that swaps the positions of whoever looks into it simultaneously.',
    'A chandelier that drops when a specific word is spoken.',
    'A false floor — a shallow layer of stone over a thirty-foot drop.',
  ],
};

function genEnc(){
  const type = document.getElementById('enc-type-filter').value;
  const arr = ENC_SEEDS[type] || ENC_SEEDS.any;
  const result = pick([...ENC_SEEDS.any, ...arr]);
  setResult('enc-result', result);
  addToHistory('enc-history', result);
  window._lastEnc = result;
}

function genEncSend(){
  if(!window._lastEnc) genEnc();
  addScene();
  const list=document.getElementById('scenes-list');
  const card=list.lastElementChild;
  if(card){const el=card.querySelector('[data-key="sc-notes"]');if(el)el.value=window._lastEnc;}
  const btn=document.querySelector('[data-ac="tab-s3"]');if(btn)sw('s3',btn);
}

// ── SECRET / CLUE GENERATOR ──
const SECRETS_GEN = {
  any: [
    'The villain is not the true power — they answer to someone the party has already met.',
    'The location was the site of a massacre. The dead were never mourned.',
    'An object the party carries is being tracked.',
    'The map everyone uses is intentionally wrong in one critical area.',
    'The organisation funding the party has a second agenda.',
    'A trusted NPC has been replaced by a simulacrum.',
    'The "ancient evil" was created by the same people who now fight against it.',
    'The town has been giving people to something in the dark. Willingly.',
    'One member of the party has a price on their head — placed by a friend.',
    'The artifact is cursed in a way that takes months to manifest.',
  ],
  villain: [
    'The villain was once a hero. The party\'s patron knows this.',
    'The villain\'s true goal is mercy — killing the one thing that would otherwise destroy everything.',
    'The villain has an heir. Stopping them doesn\'t stop the plan.',
    'The villain is dying. They\'re trying to finish their work before they go.',
    'The villain and the party share a common enemy — just different methods.',
    'The villain has leverage over a key NPC the party trusts.',
    'The villain\'s base of operations is hidden inside something the party has already visited.',
  ],
  history: [
    'The kingdom was founded on a lie that is still being maintained today.',
    'This place was holy ground before it was desecrated. What lived here is still here.',
    'The great hero of the old war was a war criminal. The records were altered.',
    'The \'ancient ruin\' was built less than fifty years ago. Someone wanted it to look old.',
    'Two factions have been at war for generations over a misunderstanding.',
    'The god this temple was built for doesn\'t exist. Something else answered the prayers.',
  ],
  npc: [
    'The innkeeper marks travellers for a thieves\' guild operating through the town.',
    'The guard captain is being blackmailed by the very criminals they\'re supposed to catch.',
    'The helpful sage is selling information about the party to a third party.',
    'The friendly merchant is the reason the town\'s last adventurers never came back.',
    'The priest genuinely believes they serve good — and is genuinely wrong.',
    'The beggar at the gate has seen everything and has been recording it all.',
  ],
  treasure: [
    'The item is cursed — but only activates under a very specific condition.',
    'The treasure was stolen. The original owner is still looking for it.',
    'The item is a fake. The real one is somewhere else entirely.',
    'Using the item leaves a magical trace visible to certain creatures.',
    'The treasure has a twin — and whoever holds the twin knows when this one is used.',
    'The item was sealed away for a reason. Breaking the seal released something.',
  ],
  location: [
    'The dungeon was not built by its current inhabitants — they moved in after the builders vanished.',
    'There is a chamber that doesn\'t appear on any map — because the original cartographer was killed before they could include it.',
    'The safe path through is only safe because something lets travellers through. It has reasons.',
    'The location is a prison. The thing inside is not the monster everyone thinks it is.',
    'Water runs uphill here. The natural laws here are wrong in ways not yet understood.',
    'The location appears abandoned but something lives in the walls.',
  ],
};

function genSec(){
  const type = document.getElementById('sec-type-filter').value;
  const arr = SECRETS_GEN[type] || SECRETS_GEN.any;
  const pool = type==='any' ? Object.values(SECRETS_GEN).flat() : [...SECRETS_GEN.any,...arr];
  const result = pick(pool);
  setResult('sec-result', result);
  addToHistory('sec-history', result);
  window._lastSec = result;
}

function genSecSend(){
  if(!window._lastSec) genSec();
  addSecret();
  const list=document.getElementById('secrets-list');
  const card=list.lastElementChild;
  if(card){const el=card.querySelector('[data-key="sec"]');if(el)el.value=window._lastSec;}
  updateSecretCounter();
  const btn=document.querySelector('[data-ac="tab-s4"]');if(btn)sw('s4',btn);
}

// ── TOWN EVENTS ──
const TOWN_EVENTS = [
  'A merchant caravan has arrived from a city known for trouble — the guards look nervous.',
  'A local festival is underway. Everyone is drunk. Crime is spiking.',
  'A fire started last night in the warehouse district. Arson is suspected.',
  'A body was found in the well. The town is panicking about the water supply.',
  'Two noble families are in a public dispute. Everyone has taken sides.',
  'A travelling circus has arrived. People keep disappearing after visiting.',
  'A child has been missing for three days. The parents are offering everything they have.',
  'The militia is mobilising. No one will say why.',
  'A preacher has arrived predicting the end of the world. They have evidence.',
  'The market prices have tripled overnight. The grain supply has been cut off.',
  'A famous criminal has been captured and is being held pending trial.',
  'Something has been stealing livestock — taken whole, not killed.',
  'A stranger is offering gold for information about ruins to the north.',
  'A ship has run aground in the harbour. The crew won\'t come ashore.',
  'An election is happening. Candidates are turning up injured.',
  'Refugees are arriving from the east. A lot of them. They won\'t say what they\'re fleeing.',
  'A cure for a local illness has appeared overnight — origin unknown.',
  'The local lord hasn\'t been seen in two weeks. Advisors are saying they\'re travelling.',
  'A duel has been called and the whole town has stopped to watch.',
  'Strange lights were seen over the forest last night. Half the town has theories.',
  'A guild is on strike. Essential services have stopped.',
  'Graffiti appeared overnight that names a prominent citizen as a murderer.',
  'A wanted poster has gone up — the face is one the party recognises.',
  'The local healer died suddenly. People who needed medicine are getting desperate.',
  'A trial is underway for a crime the whole town believes the accused didn\'t commit.',
];

function genTown(){
  const result = pick(TOWN_EVENTS);
  setResult('town-result', result);
  addToHistory('town-history', result);
  window._lastTown = result;
}

function genTownSend(){
  if(!window._lastTown) genTown();
  addScene();
  const list=document.getElementById('scenes-list');
  const card=list.lastElementChild;
  if(card){
    const nm=card.querySelector('[data-key="sc-name"]');if(nm)nm.value='Town Event';
    const nt=card.querySelector('[data-key="sc-notes"]');if(nt)nt.value=window._lastTown;
  }
  const btn=document.querySelector('[data-ac="tab-s3"]');if(btn)sw('s3',btn);
}

// ── MAGIC ITEMS ──
const MAGIC_ITEMS = {
  common: [
    'Cloak of Billowing — the cloak billows dramatically whenever you move, regardless of wind.',
    'Pot of Awakening — a clay pot. Plants grown in it become awakened after 30 days.',
    'Hat of Vermin — pull a tiny harmless creature from it (bat, frog, or rat) once per day.',
    'Instrument of Illusions — while playing it, minor illusions form around you.',
    'Rope of Mending — cut pieces reconnect if held together for 1 minute.',
    'Smoldering Armor — wisps of smoke rise from your armor, granting no other effect.',
    'Wand of Pyrotechnics — as an action, create dazzling pyrotechnics (no damage).',
    'Shield of Expression — the face on this shield changes to reflect your emotional state.',
    'Talking Doll — a stuffed doll with a phrase stored in it, speaks when squeezed.',
    'Moon-Touched Sword — sheds moonlight (as torchlight) in darkness.',
  ],
  uncommon: [
    'Bag of Tricks (Gray) — pull a random beast (up to CR 1/4) from the bag three times per day.',
    'Boots of Elvenkind — advantage on Dexterity (Stealth) checks relying on moving silently.',
    'Brooch of Shielding — resistance to force damage, immunity to Magic Missile.',
    'Cloak of Protection — +1 to AC and saving throws.',
    'Eyes of Minute Seeing — advantage on Investigation checks within 1 foot. Darkvision 30ft.',
    'Gauntlets of Ogre Power — Strength becomes 19 if lower.',
    'Headband of Intellect — Intelligence becomes 19 if lower.',
    'Lantern of Revealing — reveals invisible creatures and objects within 30ft.',
    'Periapt of Health — advantage on saves vs disease, immunity to the poisoned condition.',
    'Sending Stones (pair) — cast Sending once per day between the paired stones.',
    'Stone of Good Luck — +1 to ability checks and saving throws while carried.',
    'Wind Fan — cast Gust of Wind (save DC 13) once. 20% chance it won\'t work again.',
  ],
  rare: [
    'Amulet of the Planes — attempt to cast Plane Shift (DC 15 Int, or land somewhere random).',
    'Belt of Hill Giant Strength — Strength becomes 21.',
    'Boots of Speed — double speed; attackers have disadvantage. 10 min/day.',
    'Bracers of Defense — +2 to AC when not wearing armor or using a shield.',
    'Cloak of Displacement — attackers have disadvantage until you take damage each turn.',
    'Helm of Telepathy — detect thoughts at will; suggestion once per day.',
    'Necklace of Fireballs — 1d6+3 beads, each casts Fireball (save DC 15).',
    'Ring of Evasion — 3 charges, use a reaction to succeed on a failed Dex save.',
    'Ring of Feather Falling — fall at 60 ft/round, take no falling damage.',
    'Rope of Entanglement — command word causes it to entangle (DC 15 Str to escape).',
    'Staff of Charming — 10 charges: Charm Person, Comprehend Languages, Speak with Animals.',
    'Sword of Life Stealing — on crit vs a creature (not undead/construct), gain 10 temp HP.',
  ],
  'very rare': [
    'Amulet of the Planes — functions reliably (DC 15 Int to pick destination).',
    'Carpet of Flying — 4 sizes, moves at 80ft, carries up to 400/800lb.',
    'Cloak of Invisibility — invisible while wearing and hood up. 2 hr/day.',
    'Crystal Ball — scrying focus; see creatures or places (DC 17 Wis).',
    'Dancing Sword — bonus action to launch; flies 30ft, attacks for 4 rounds.',
    'Helm of Brilliance — 10 diamonds, 20 rubies, 30 fire opals, 40 opals. Various effects.',
    'Manual of Golems — follow instructions to create a specific golem.',
    'Ring of Regeneration — regain 1d6 HP every 10 minutes. Regrows lost limbs in 1d6+1 days.',
    'Ring of Shooting Stars — 6 charges: Faerie Fire, Ball Lightning (4d8), Shooting Stars (1d6×4).',
    'Spellguard Shield — advantage on saves vs spells; spell attack rolls against you have disadvantage.',
    'Staff of Power — 20 charges; Cone of Cold, Fireball, Globe of Invulnerability, etc.',
    'Sword of Sharpness — on a roll of 20, target loses a limb (or 6d8 extra slashing). Objects take max damage.',
  ],
  legendary: [
    'Apparatus of Kwalish — a mechanical lobster-shaped vehicle. Fully submersible.',
    'Armor of Invulnerability — resistance to non-magical damage; immune 10 min/day.',
    'Belt of Cloud Giant Strength — Strength becomes 27.',
    'Cloak of Invisibility (Legendary) — no time limit. Doesn\'t impede spellcasting.',
    'Cubic Gate — six sides, each attuned to a different plane. Three charges.',
    'Deck of Many Things — draw a card, face the consequences. Many are catastrophic.',
    'Hammer of Thunderbolts — bonus to attack/damage vs giants; stun on a 20; kills a giant on 20.',
    'Holy Avenger — +3, deals 2d10 radiant on hit; aura of protection 10ft.',
    'Iron Flask — capture extraplanar beings. Release as a controlled servant.',
    'Ring of Three Wishes — cast Wish three times. Then it becomes a mundane ring.',
    'Sphere of Annihilation — a 2-ft sphere of nothingness. Destroys everything it touches.',
    'Staff of the Magi — 50 charges; Arcane Lock, Detect Magic, Enlarge/Reduce, Fireball, Fly, etc.',
  ],
};

function genItem(){
  const rarity = document.getElementById('item-rarity').value;
  const r = rarity==='any' ? pick(['common','common','uncommon','uncommon','rare','rare','very rare','legendary']) : rarity;
  const arr = MAGIC_ITEMS[r] || MAGIC_ITEMS.uncommon;
  const result = `[${r.toUpperCase()}] ${pick(arr)}`;
  setResult('item-result', result);
  addToHistory('item-history', result);
  window._lastItem = result;
}

function genItemSend(){
  if(!window._lastItem) genItem();
  const card = mkCard('treas-list',[
    {cols:4,items:[{key:'tr-name',label:'Item / Reward',placeholder:''},{key:'tr-type',label:'Type',placeholder:'Magic'},{key:'tr-meth',label:'Method',placeholder:'Random'},{key:'tr-for',label:'Best For',placeholder:'Any'}]},
    {cols:1,items:[{key:'tr-desc',label:'Description / Lore',type:'textarea',rows:1,placeholder:'',span:true}]}
  ]);
  if(card && window._lastItem){
    const parts = window._lastItem.split('] ');
    const name = parts[1] ? parts[1].split(' —')[0] : window._lastItem;
    const desc = parts[1] || '';
    const nm=card.querySelector('[data-key="tr-name"]');if(nm)nm.value=name;
    const dc=card.querySelector('[data-key="tr-desc"]');if(dc)dc.value=desc;
    const tp=card.querySelector('[data-key="tr-type"]');if(tp)tp.value='Magic Item';
    const mt=card.querySelector('[data-key="tr-meth"]');if(mt)mt.value='Random';
  }
  const btn=document.querySelector('[data-ac="tab-s8"]');if(btn)sw('s8',btn);
}

// ── TRAPS ──
const TRAPS = [
  'Poison Dart Trap — triggered by pressure plate. Dart fires from hidden hole in wall. +8 to hit; 2d10 piercing + 2d10 poison; DC14 Con or poisoned 1 hour.',
  'Pit Trap — hinged floor panel, camouflaged. DC15 Perception (passive) to notice. 2d6 bludgeoning per 10ft fallen.',
  'Rolling Boulder — motion triggers boulder from alcove above. Dex save DC15 or 6d10 bludgeoning and knocked prone.',
  'Alarm Bell — thin wire across the path connected to a bell. DC12 Perception. Wakes and alerts all creatures within 300ft.',
  'Collapsing Ceiling — weight plate triggers ceiling drop. DC14 Dex save or 6d6 bludgeoning, restrained under rubble (DC17 Str to escape).',
  'Blade Pendulum — scything blades drop when tripwire cut. DC14 Dex save or 3d8 slashing.',
  'Locking Room — door seals once party is inside; room fills with water. 30ft × 30ft room, water rises 1ft per round. DC20 Str to force door.',
  'Magical Glyph — Glyph of Warding on a door or chest. Fireball (8d6 fire, DC15 Dex) or Blindness/Deafness (DC15 Con).',
  'False Step — certain step on a staircase depresses 1 inch and releases a jet of steam. DC12 Dex or 2d6 fire; all other creatures in 10ft aware of the trap location.',
  'Sleep Gas — breaking a clay seal releases colourless gas. DC14 Con save or fall unconscious 8 hours (1 hour on success). Dissipates in 1 minute.',
  'Mimic Door — the door is a mimic. Adhesive triggers on touch. +8 to hit; 2d8+5 bludgeoning. Will try to consume one creature before fleeing.',
  'Teleportation Circle — steps on the circle teleport the creature to a locked cell elsewhere in the dungeon.',
  'Net Launcher — hidden mechanism fires weighted net. DC13 Dex or restrained (DC17 Str or DC15 Slashing to escape).',
  'Ooze Vat — disturbing the wrong object upends a vat, releasing a grey ooze from a chute in the ceiling.',
  'Symbol of Discord — magical glyph. Creatures that read it must make DC16 Cha save or attack the nearest creature for 1 minute.',
];

function genTrap(){
  const result = pick(TRAPS);
  setResult('trap-result', result);
  addToHistory('trap-history', result);
}

// ── STRONG STARTS ──
const STRONG_STARTS = [
  'The party is ambushed mid-rest. Their camp is on fire. One of them is already missing.',
  'A dying messenger reaches them with the last words: "It\'s already too late. Don\'t go to—" and then nothing.',
  'They wake up somewhere they don\'t recognise, armed but with no memory of the last six hours.',
  'A chase is already in progress — they are either the chasers or the chased. Decide which.',
  'The person they were supposed to meet is dead when they arrive. Recently. The killer is still in the building.',
  'An explosion. Close. Buildings collapsing. In the chaos, someone presses a package into their hands and runs.',
  'They\'re mid-trial. Someone is accusing one of them of a crime. The judge is about to deliver a verdict.',
  'A voice in all their heads simultaneously: a plea for help, a location, then silence.',
  'They\'re being paid to guard something. The thing they\'re guarding is gone. They were on watch.',
  'The city gates are closing. A herald announces the name of someone the party knows as a traitor.',
  'A figure they recognise — someone they believed dead — passes them in the street without recognition.',
  'They arrive at their destination to find it already occupied by another group with the same instructions.',
  'Mid-conversation, the NPC they\'re meeting stops speaking, writes a single word, and hands it over: "RUN."',
  'A child approaches and hands them a note from a name they know. The note contains the details of their current plan. All of it.',
  'The festival in town turns violent without warning. In the chaos a specific face appears — someone who should be in prison.',
  'The ship they are on hits something. There\'s no rock on any chart at this location.',
  'They find a journal. The last entry describes this exact moment.',
  'A faction they helped last session sends word: everything they helped build has been undone overnight.',
  'A magical alarm they set has triggered. Something came for the thing they were protecting.',
  'Someone slides a key under their door. No note. The key has a crest on it they recognise — from a dream.',
];

function genStart(){
  const result = pick(STRONG_STARTS);
  setResult('start-result', result);
  addToHistory('start-history', result);
  window._lastStart = result;
}

function genStartSend(){
  if(!window._lastStart) genStart();
  const el = document.getElementById('strong-start');
  if(el){
    if(el.value.trim()) el.value += '\n\n[Generated]: '+window._lastStart;
    else el.value = window._lastStart;
  }
  const btn=document.querySelector('[data-ac="tab-s2"]');if(btn)sw('s2',btn);
}

// ── WIRE RESULT CLICKS TO COPY ──
['loc-result','enc-result','sec-result','town-result','item-result','trap-result','start-result'].forEach(id=>{
  document.addEventListener('click', e=>{
    if(e.target.id===id && e.target.textContent && e.target.textContent!=='Click to generate…'){
      copyText(e.target.textContent);
      const orig = e.target.style.background;
      e.target.style.background='rgba(184,134,11,.25)';
      setTimeout(()=>e.target.style.background=orig, 400);
    }
  });
});


// ══════════════════════════════════════════════════════
//  DIRECT SESSION LOADING
// ══════════════════════════════════════════════════════
function openSessionURLModal(){
  document.getElementById('session-url-modal').classList.add('open');
  document.getElementById('session-url-input').focus();
}
function closeSessionURLModal(){
  document.getElementById('session-url-modal').classList.remove('open');
  document.getElementById('session-url-status').textContent = '';
}

async function loadSessionFromURL(){
  const url = document.getElementById('session-url-input').value.trim();
  const status = document.getElementById('session-url-status');
  if(!url){ status.className='gh-status err'; status.textContent='Enter a URL.'; return; }
  status.className='gh-status ld'; status.textContent='⟳ Fetching…';
  try{
    const fetchUrl = url.replace('github.com','raw.githubusercontent.com').replace('/blob/','/');
    const res = await fetch(fetchUrl);
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data = await res.json();
    if(!confirm(`Load session "${data['campaign-name']||'Unknown'} · ${data['session-num']||'?'}" from ${data['session-date']||'unknown date'}? This will overwrite your current prep.`)) return;
    applyData(data);
    status.className='gh-status ok'; status.textContent='✓ Session loaded!';
    setTimeout(closeSessionURLModal, 1200);
    const s=document.getElementById('sst'); s.textContent='✓ Session loaded'; s.classList.add('vis'); setTimeout(()=>s.classList.remove('vis'),3000);
  }catch(e){
    status.className='gh-status err'; status.textContent='✗ '+e.message;
  }
}

function loadSessionFromFile(file){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try{
      const data = JSON.parse(e.target.result);
      const campaign = data['campaign-name']||'Unknown';
      const session = data['session-num']||'?';
      if(!confirm(`Load session "${campaign} · ${session}"? This will overwrite your current prep.`)) return;
      applyData(data);
      const s=document.getElementById('sst'); s.textContent='✓ Session loaded'; s.classList.add('vis'); setTimeout(()=>s.classList.remove('vis'),3000);
    }catch(e){ alert('Invalid session JSON file: '+e.message); }
  };
  reader.readAsText(file);
}

// Wire up the session file input
document.addEventListener('DOMContentLoaded', ()=>{
  const sfi = document.getElementById('session-file-input');
  if(sfi) sfi.addEventListener('change', ()=>{ loadSessionFromFile(sfi.files[0]); sfi.value=''; });
  // Close modal on background click
  const modal = document.getElementById('session-url-modal');
  if(modal) modal.addEventListener('click', e=>{ if(e.target===modal) closeSessionURLModal(); });
  const closeBtn = document.getElementById('session-url-close');
  if(closeBtn) closeBtn.addEventListener('click', closeSessionURLModal);
  // Enter key in URL input
  const urlInp = document.getElementById('session-url-input');
  if(urlInp) urlInp.addEventListener('keydown', e=>{ if(e.key==='Enter') loadSessionFromURL(); });
});


// ══════════════════════════════════════════════════════
//  EXTENDED GENERATOR TABLES
//  Merged into existing pools on load
// ══════════════════════════════════════════════════════

// ── EXTRA NPC OCCUPATIONS ──
NPC_OCCUPATIONS.push(
  'Archivist','Barber-surgeon','Beggar-king','Bone carver','Brewer',
  'Clockmaker','Debt collector','Executioner','Falconer','Fence',
  'Ferryman','Fisherwoman','Flagellant','Fletcher','Forger',
  'Ghost-layer','Gladiator','Grave robber','Guild enforcer','Herbalist',
  'Horse trader','Inquisitor','Jester','Lamplighter','Leper',
  'Lorekeeper','Mapmaker','Midwife','Mountebank','Necromancer\'s assistant',
  'Orphan runner','Peddler','Pit fighter','Plague doctor','Poisoner',
  'Porter','Rat catcher','Relic hunter','Roadwarden','Runecarver',
  'Sailor','Sellsword','Shaman','Shipwright','Siege engineer',
  'Slaver','Smelter','Smuggler','Soothsayer','Spymaster',
  'Stablehand','Street performer','Tattooist','Tax collector','Tinkerer',
  'Tomb robber','Torturer','Town crier','Weaponsmith','Witch finder'
);

// ── EXTRA NPC APPEARANCES ──
NPC_APPEARANCES.push(
  'Constantly checking over their shoulder','Wears someone else\'s signet ring',
  'Speaks very formally, as if reciting from memory','One hand is always gloved',
  'Has a clockwork eye that whirs when they focus','Smells of burnt herbs',
  'Braids a different coloured thread into their hair each day',
  'Moves without making any sound — unsettlingly quiet',
  'Has perfect posture and judges everyone who doesn\'t','Whistles while thinking',
  'A port-wine birthmark covers half their neck','Always carries a small mirror',
  'Speaks in a regional accent they\'re trying to hide','Covered in old ritual tattoos',
  'Has an unnaturally long fourth finger on their right hand',
  'Their shadow sometimes moves a moment too late','Always overdressed for the situation',
  'Has no fingernails — removed or never grew','Squints at everything as if suspicious',
  'Drinks from a silver flask constantly, offers it to no one',
  'Their teeth are filed to slight points','Refuses to sit with their back to the door',
  'Has a habit of finishing other people\'s sentences',
  'Wears a locket they touch whenever frightened'
);

// ── EXTRA NPC TRAITS ──
NPC_TRAITS.push(
  'Has memorised the layout of every building they\'ve ever been in',
  'Treats everyone as a potential customer','Will not make a decision without sleeping on it',
  'Deeply afraid of silence — fills it constantly with noise or talk',
  'Keeps a detailed journal and writes in it when stressed',
  'Speaks only through a third party when they can — they hate direct confrontation',
  'Believes they are being tested by the gods at all times',
  'Has a photographic memory and remembers every insult verbatim',
  'Extraordinarily kind to animals; considerably less so to people',
  'Has a second, very different personality when drunk',
  'Does not believe in coincidence — everything is a sign',
  'Compulsively rearranges objects in any room they stay in',
  'Never asks a question — only makes statements that invite correction',
  'Has a talent for mimicry that makes people profoundly uncomfortable',
  'Will sacrifice anything — genuinely, without hesitation — for their cause',
  'Carries an enormous and possibly unjustified grudge from years ago',
  'Makes promises easily and breaks them without remorse',
  'Acts as if they know something about you that you haven\'t told them'
);

// ── EXTRA NPC WANTS ──
NPC_WANTS.push(
  'To be the one who finally solves a problem everyone has given up on',
  'To track down a specific artefact before it falls into the wrong hands',
  'To prove that someone everyone respects is actually corrupt',
  'To find a place where no one knows who they are',
  'To understand why they survived when everyone around them didn\'t',
  'To bring down a specific institution they believe is rotten from within',
  'To outlive everyone who ever doubted them',
  'To find meaning after losing the thing that gave their life purpose',
  'To build something that will survive them',
  'To settle in one place and never move again',
  'To steal back something that was taken from their family',
  'To be believed — about something important that no one takes seriously',
  'To make enough money to free someone from a debt or contract',
  'To finish what someone they loved started before they died',
  'To get revenge, but only if they can do it without becoming the thing they hate',
  'To find out whether something they\'ve believed their whole life is actually true'
);

// ── EXTRA LOCATION ASPECTS ──
LOC_ASPECTS.push(
  'Walls that weep oil instead of water','A dial on the wall with no label and twelve positions',
  'The remains of a barricade built from the inside — something was being kept in',
  'A perfect circle of ash on the floor, 10 feet across, with no source',
  'Bookshelves where every title has been scratched out','A door that opens onto a brick wall',
  'A child\'s handprints on the ceiling','Manacles bolted to the wall with no key in sight',
  'A map of this very room, but with rooms that don\'t exist on it',
  'A pile of the same letter, written in different handwriting, never finished',
  'A long table set for a feast, everything perfectly placed but years old',
  'Claw marks that start on the floor and continue up the wall and across the ceiling',
  'A mirror that shows the room empty of people, regardless of who stands before it',
  'A well that, when spoken into, speaks back in a different voice',
  'Dozens of hourglasses, all stopped at the same time',
  'A throne facing a wall, not a room','Candles that burn black instead of white',
  'A locked box chained to the floor with no visible seam or lock',
  'Musical notation carved into the stone — following it reveals a hidden door',
  'A pool of water perfectly still despite the wind from an unknown source',
  'Weapons of every type, hung carefully on the walls, all slightly too large for humans',
  'A door that is always warm to the touch regardless of the temperature',
  'Graffiti in dozens of different languages, all saying the same thing',
  'A pendulum with no clock attached, swinging despite no mechanism',
  'Rows of empty pedestals, each with a plaque describing an item that isn\'t there'
);

// ── EXTRA ENCOUNTER SEEDS ──
ENC_SEEDS.any.push(
  'The enemy isn\'t hostile — they\'re desperate. Violence is a last resort they\'ve already decided on.',
  'The party has wandered into the middle of someone else\'s negotiation.',
  'The objective has changed while they were getting here.',
  'One of the "enemies" recognises a party member and won\'t attack them.',
  'The thing they came to fight is already dead. Something else killed it. Recently.',
  'The enemy has already won — they\'re just keeping the party occupied.',
  'A previous decision the party made has complicated this encounter.',
  'Someone on the enemy side is sending signals that they want to switch sides.',
  'The civilians in the area are making everything ten times harder.',
  'The enemy will not stop unless the party addresses the cause, not the symptom.',
  'The terrain is the real enemy — combatants on both sides know it.',
  'There are two groups who both believe they\'re fighting the party. They\'re not coordinating.',
  'The most dangerous creature here is pretending to be harmless.',
  'The party is on a clock — something else will happen if this takes too long.',
  'Someone the party cares about made a choice that caused this situation.',
  'The enemy leader is the only thing keeping the others from doing something far worse.'
);
ENC_SEEDS.combat.push(
  'The enemy has one thing that makes them immune to the party\'s best tactic.',
  'The arena shifts mid-fight — a wall collapses, water rises, fire spreads.',
  'One enemy is protecting something they\'d rather die than reveal.',
  'The most dangerous enemy isn\'t attacking — they\'re watching and learning.',
  'Someone calls for parley when the enemy is winning.',
  'A neutral third party wades in and starts attacking everyone.'
);
ENC_SEEDS.social.push(
  'Both sides think they\'re being reasonable. They\'re not even close.',
  'The NPC will say yes — but needs the party to first say something they\'ll regret.',
  'The real decision-maker isn\'t in the room.',
  'The NPC is testing the party\'s loyalty, not their competence.',
  'Whatever the party decides here gets back to someone else before tomorrow.',
  'The NPC is telling the truth. It\'s just not the whole truth.'
);

// ── EXTRA SECRETS ──
Object.values(SECRETS_GEN).forEach(arr => {
  // Shared pool extras
});
SECRETS_GEN.any.push(
  'A powerful figure everyone respects built their reputation on someone else\'s work.',
  'The war didn\'t end because of the treaty — it ended because both sides ran out of something.',
  'Something widely believed to be destroyed was actually hidden.',
  'The current crisis was manufactured to distract from a different, larger problem.',
  'An important ritual or tradition has been performed incorrectly for generations.',
  'The "monster" the town fears is responsible for why the town still exists.',
  'Two factions that appear to be enemies are controlled by the same person.',
  'A dead god\'s power is still active. Someone is using it without knowing the source.',
  'The party\'s patron knows more about their mission than they\'ve been told.',
  'Something the party did in a previous session had a consequence they haven\'t discovered yet.'
);
SECRETS_GEN.villain.push(
  'The villain\'s plan has already succeeded — what the party is fighting is a distraction.',
  'The villain knows the party is coming. They\'ve prepared something specific for each member.',
  'The villain is working against someone worse. From the villain\'s perspective, they\'re the hero.',
  'The villain has a legitimate grievance. The method is wrong; the complaint is not.'
);
SECRETS_GEN.npc.push(
  'The friendly guide knows exactly where the danger is — they\'re leading the party toward it.',
  'The person asking for help created the problem they need help solving.',
  'The NPC everyone trusts is the only person who benefits from the current crisis.',
  'A dead NPC the party knew is still alive. They chose to disappear.',
  'The NPC has been compelled — magically or otherwise — and can\'t say so directly.'
);

// ── EXTRA TOWN EVENTS ──
TOWN_EVENTS.push(
  'A travelling merchant is selling something that belongs to someone in town.',
  'The well ran dry overnight. The timing is too convenient.',
  'Three people have had the same dream on the same night. They\'ve found each other.',
  'A bounty has been posted for someone the party knows.',
  'An old law has suddenly been enforced for the first time in decades.',
  'A ship arrived with no crew and no cargo — just a single passenger who won\'t speak.',
  'Someone has confessed to a crime that everyone knows they didn\'t commit.',
  'The local constable has gone missing. Their office is undisturbed.',
  'Two merchants are claiming ownership of the same building with identical deeds.',
  'A child is selling information. The information is accurate.',
  'Something valuable was stolen from the temple — the priests aren\'t reporting it.',
  'A travelling friar is offering to absolve sins for coin. People are lining up.',
  'The annual tax came due and the collector didn\'t arrive.',
  'A new religion appeared overnight. It already has followers.',
  'Someone has been feeding the town\'s ravens. The ravens are beginning to talk.'
);

// ── EXTRA STRONG STARTS ──
STRONG_STARTS.push(
  'A bell rings — the kind only rung for specific emergencies — and the wrong number of times.',
  'They find a door marked with their names. It wasn\'t there yesterday.',
  'A stranger dies in front of them, presses something into the nearest hand, and whispers a name.',
  'The road ahead is blocked. The road behind is now gone.',
  'It starts raining, but only in one street. In that street it has never stopped raining.',
  'Every clock in the city stops at the same moment.',
  'A child approaches and hands them a document. The document is a deed — to the building they\'re standing in.',
  'They\'ve been hired to protect something. It\'s already missing.',
  'An old ally contacts them through a method that should be impossible — that ally is dead.',
  'A creature walks into town and sits down. It appears to be waiting. For them.',
  'The sky changes colour for thirty seconds. Everyone saw it. No one will talk about it.',
  'They wake up with a collective memory of a night they don\'t remember living.',
  'A wanted poster goes up with a sketch of one of them — but younger, and under a different name.',
  'The contract they signed has a clause they didn\'t notice before. It\'s now relevant.',
  'The person they were meant to meet sent a letter cancelling — the letter is in handwriting they don\'t recognise.',
  'Someone has paid off all their debts. There\'s no note. No name. No explanation.',
  'A door in a familiar building leads somewhere it shouldn\'t.',
  'The item they need is in the one place they said they\'d never go back to.',
  'A message arrives addressed to all of them. The message is a single question: "Do you remember me?"',
  'An army is camped outside the city. They flew in overnight. Nobody knows whose.'
);

// ── EXTRA TRAPS ──
TRAPS.push(
  'Ink Sprayer — stepping on a hidden pressure plate douses one creature in bright ink. They glow for 1 hour and cannot hide or benefit from invisibility. Harmless, but reveals their position perfectly.',
  'Reverse Gravity Panel — a 10×10 section of ceiling is enchanted with localised reverse gravity. Creatures crossing it must make DC14 Str or float to the ceiling (taking 1d6 bludgeoning) and be restrained until they pass a DC14 Str check as an action.',
  'Shrinking Corridor — walls slowly close. DC12 Perception to notice the grooves. Fully closed in 3 rounds. DC17 Str to stop. DC14 Dex to squeeze through before it shuts. 3d6 bludgeoning if caught.',
  'Memory Fog — a nearly invisible mist. DC15 Perception. Creatures breathing it must DC13 Int save or forget the last 10 minutes. They appear fine until someone asks them something that reveals the gap.',
  'Siren Tile — a specific tile emits a silent magical shriek audible only to undead and fiends within 1 mile, alerting them to intruders. Players have no way to know it triggered.',
  'Freezing Lock — touching the door handle triggers a frost burst. DC11 Dex save or the hand is frozen to the handle (restrained) until DC14 Str check. The door remains unlocked.',
  'Pressure-Plate Portcullis — triggers when the last party member passes the threshold, dropping a portcullis behind them and splitting the party. DC18 Str to lift. The mechanism is on the other side.',
  'False Treasure — a convincing chest. Opening triggers Symbol of Hopelessness (DC17 Wis or the creature surrenders for 1 minute). The chest is empty. The real treasure is elsewhere in the room.',
  'Echo Chamber — a room that records and replays the last thing said in it, on a 10-minute loop. Could reveal previous intruders\' final words, or betray the party\'s own plans to followers.',
  'Mud Pit — floor appears solid (DC15 Perception). First creature to cross sinks to knee-depth (speed halved). Second creature in the same turn sinks waist-deep (restrained). DC14 Str to pull free as action.'
);

// ── EXTRA MAGIC ITEMS ──
MAGIC_ITEMS.uncommon.push(
  'Cloak of the Manta Ray — while in water, you have a swim speed of 60 ft and can breathe underwater. Underwater, you\'re nearly invisible (advantage on Stealth in water).',
  'Dust of Disappearance — throw the dust (as an action) and up to 6 creatures within 10 ft turn invisible for 2d4 minutes. Even Detect Magic can\'t find them. One pouch.',
  'Goggles of Night — darkvision 60 ft. Disadvantage on attack rolls and Perception checks in bright sunlight.',
  'Immovable Rod — press the button, rod is fixed in place, immovable by up to 8,000 lbs of force. Another button press releases it. Object, not a weapon.',
  'Ring of Jumping — cast Jump on yourself at will.',
  'Slippers of Spider Climbing — climb any surface (even upside down) at full speed, hands free.',
  'Wand of Magic Detection — 3 charges, detect magic as an action. Regains 1d3 charges at dawn.'
);
MAGIC_ITEMS.rare.push(
  'Amulet of Proof Against Detection and Location — can\'t be targeted by divination magic or detected by magic.',
  'Arrow of Slaying — on hit vs target type, DC17 Con or take 6d10 extra piercing (half on success). Single use.',
  'Bag of Holding — holds 500 lb, up to 64 cubic ft. Weighs 15 lb regardless of contents. Ripping it destroys it.',
  'Cape of the Mountebank — cast Dimension Door once per day.',
  'Elven Chain — +1 AC chain shirt. Not heavy. Proficient even without armour proficiency.',
  'Flame Tongue — a sword you can ignite as a bonus action (command word). +2d6 fire on hit; sheds bright light 40ft.',
  'Handy Haversack — like bag of holding but three compartments; desired item always comes to hand first.',
  'Horn of Blasting — cone 30ft, 5d6 thunder, DC15 Con or deafened 1 min. Glass within 30ft shatters. 20% chance it explodes on use (5d6 to user).',
  'Ring of Spell Storing — stores up to 5 levels of spells; bearer can cast them.',
  'Wand of Paralysis — 7 charges, DC15 Con or paralyzed 1 minute. Regains 1d6+1 at dawn.'
);
MAGIC_ITEMS.legendary.push(
  'Apparatus of the Crab — a mechanical lobster-shaped vehicle. Pilot from inside. Fully submersible.',
  'Belt of Giant Strength (Storm) — Strength becomes 29.',
  'Cloak of Arachnida — spider climb; immunity to web; cast Web once per day; resistance to poison.',
  'Crystal Ball of True Seeing — scry + truesight through the image.',
  'Hammer of Thunderbolts — +1d6 thunder on hit; DC17 Con or stunned; kills a giant outright on a 20 (DC20 Con).',
  'Luck Blade — +1 weapon, +1 to saves; wish once (if you have the charge); reroll once per day.',
  'Robe of the Archmagi — +2 AC, +2 spell save DC, +2 spell attack; advantage on saves vs spells.',
  'Sword of Answering — one of nine blades. +3, cast counterspell as reaction once per day.',
  'Talisman of Pure Good / Ultimate Evil — holy/unholy power. Destroys certain creature types outright. 7 charges.'
);


// ══════════════════════════════════════════════════════
//  LAZY ENCOUNTER BENCHMARK CALCULATOR
//  Formula: slyflourish.com/the_lazy_encounter_benchmark.html
//  Levels 1-4:  sum ÷ 4
//  Levels 5-10: sum ÷ 2
//  Levels 11-16: sum × 3/4
//  Levels 17+:  sum × 1
// ══════════════════════════════════════════════════════
function calcBenchmark(){
  const count = parseInt(document.getElementById('bench-count').value) || 4;
  const level = parseInt(document.getElementById('bench-level').value) || 1;
  const resultEl = document.getElementById('bench-result');
  const noteEl = document.getElementById('enc-bench');

  const sumLevels = count * level;
  let divisor, tierLabel;
  if(level <= 4){
    divisor = 4; tierLabel = 'Levels 1–4: sum ÷ 4';
  } else if(level <= 10){
    divisor = 2; tierLabel = 'Levels 5–10: sum ÷ 2';
  } else if(level <= 16){
    divisor = 4/3; tierLabel = 'Levels 11–16: sum × ¾';
  } else {
    divisor = 1; tierLabel = 'Levels 17+: full sum of levels';
  }

  const benchmark = Math.round(sumLevels / divisor * 10) / 10;
  const singleMax = level <= 4 ? level : Math.round(level * 1.5 * 10) / 10;

  resultEl.innerHTML = `
    Benchmark: <span style="font-size:calc(1.1*var(--tu))">CR ${benchmark} total</span> before deadly
    · Single monster max: CR ${singleMax}
    <span class="bench-sub">${count} characters × level ${level} = sum ${sumLevels} · ${tierLabel}</span>
  `;

  // Auto-fill the notes field
  if(noteEl) noteEl.value = `${count} × Lvl ${level} party → deadly above CR ${benchmark} total · single monster max CR ${singleMax}`;
}

// Auto-calc when party level field changes
document.addEventListener('change', e => {
  if(e.target && (e.target.id==='bench-count'||e.target.id==='bench-level')){
    calcBenchmark();
  }
});
document.addEventListener('input', e => {
  if(e.target && (e.target.id==='bench-count'||e.target.id==='bench-level')){
    calcBenchmark();
  }
});

// Run on boot with defaults
window.addEventListener('DOMContentLoaded', ()=>{
  setTimeout(calcBenchmark, 300);
});


// ══════════════════════════════════════════════════════
//  FORK GENERATOR
// ══════════════════════════════════════════════════════
const FORKS = {
  travel: [
    {
      q: 'The road splits. One route is faster but passes through territory known for danger. The other is longer but supposedly safe.',
      a: 'Take the dangerous shortcut — save time, risk an encounter or toll',
      b: 'Take the long road — lose half a day, but arrive at something unexpected along the way',
      change: 'The shortcut reveals information about a current threat. The long road leads them past someone or something that opens a different thread entirely.'
    },
    {
      q: 'A local offers to guide them through the region — for a price. Or they can navigate alone with the map they have.',
      a: 'Hire the guide — they know things the map doesn\'t, but their loyalty is unknown',
      b: 'Go alone — slower and riskier, but they stay in control of who knows where they\'re going',
      change: 'The guide has their own agenda. Going alone means they stumble across something unguarded that the guide would have steered them away from.'
    },
    {
      q: 'They can cross through the forest by day and reach the destination tonight, or make camp now and cross in daylight tomorrow.',
      a: 'Push through now — arrive tonight, but the forest is dangerous after dark',
      b: 'Camp and cross at dawn — safer, but something happens at camp during the night',
      change: 'Crossing at night means an encounter but also an opportunity. Camping safely leads to a different kind of trouble — someone finds them.'
    },
    {
      q: 'A river crossing: a rickety bridge maintained by a toll collector, or a ford further upstream that\'s passable but takes them off the main road.',
      a: 'Pay the toll and cross — but the toll collector wants more than coin',
      b: 'Ford the river upstream — free, but they discover something on the far bank no one was supposed to find',
      change: 'The toll collector is a source of local information — or a spy. The ford leads them past ruins or a camp that changes their plans.'
    },
    {
      q: 'Refugees are moving in the opposite direction on the road. They can stop and ask questions, or press on and ignore them.',
      a: 'Stop and speak with the refugees — learn what they\'re fleeing',
      b: 'Press on — arrive faster, but whatever the refugees were fleeing may catch up',
      change: 'The refugees carry information that reframes the session\'s threat. Ignoring them means the party encounters the cause first-hand, unprepared.'
    },
    {
      q: 'A wanted poster on the road shows a face the party recognises. They can investigate now, or continue to their destination.',
      a: 'Investigate — find out what happened and why the person is wanted',
      b: 'Continue — reach the destination, but the wanted person is already there',
      change: 'Investigating now gives context and possibly an ally. Continuing means a confrontation without it.'
    },
  ],
  social: [
    {
      q: 'Two factions both want the party\'s help with the same problem — but from opposite sides.',
      a: 'Side openly with one faction — get their full resources, make an enemy of the other',
      b: 'Stay neutral and try to broker a solution — slower, harder, but both stay available',
      change: 'Open allegiance accelerates the conflict. Neutrality forces the party to understand both sides, which reveals something neither wanted known.'
    },
    {
      q: 'They have what someone needs. That person is offering more than it\'s worth — which means they\'re desperate, or they know something about it the party doesn\'t.',
      a: 'Take the deal and ask no questions',
      b: 'Refuse or negotiate — find out why it\'s worth that much to them',
      change: 'Taking the deal hands over something that matters later. Pushing back opens a thread about what the item actually is or does.'
    },
    {
      q: 'A public accusation has been made against someone the party knows. They can defend them publicly, stay out of it, or use it as leverage.',
      a: 'Defend the accused — spend political capital, potentially expose themselves',
      b: 'Stay out of it — the accused faces their fate, but the party stays clean',
      change: 'Defending creates a loyal ally and a powerful enemy. Staying out means the accused loses something, changes, and may no longer be who the party thought.'
    },
    {
      q: 'An NPC offers information — but only if the party does something uncomfortable first.',
      a: 'Do what\'s asked — get the information, compromise something',
      b: 'Refuse and find another way — takes longer and the other way has its own cost',
      change: 'Complying gets the info but creates obligation. Refusing means they find a partial truth from another source — enough to act on, but with a gap.'
    },
    {
      q: 'The person they need to speak with is in a private meeting. They can interrupt, wait, or find a way to listen in.',
      a: 'Interrupt — immediate access, but it creates a poor first impression',
      b: 'Listen in or wait — learn something they weren\'t meant to hear, or miss them entirely',
      change: 'Interrupting changes the dynamic of the meeting. Listening in reveals a secret — but also makes the party a witness to something dangerous.'
    },
    {
      q: 'A rumour is spreading that involves someone in the party. They can address it directly, ignore it, or use it.',
      a: 'Address it — shut it down or confirm it, but either way they\'re now the story',
      b: 'Let it spread — the rumour takes on a life of its own, useful or otherwise',
      change: 'Addressing it creates a confrontation with whoever started it. Ignoring it means it mutates — it becomes something more dangerous or more useful than the truth.'
    },
  ],
  dungeon: [
    {
      q: 'Two doors. One is locked and clearly secured. The other is open — which means something either left through it, or is waiting on the other side.',
      a: 'Force the locked door — whatever was kept in here was kept in for a reason',
      b: 'Go through the open door — follow the path of least resistance into uncertainty',
      change: 'The locked room contains something contained. The open door leads toward what contained it — which is no longer there.'
    },
    {
      q: 'The dungeon splits. One path goes deeper and darker. The other loops back toward the entrance but through unexplored territory.',
      a: 'Press deeper — face whatever is at the heart of this place',
      b: 'Take the outer ring — find something missed on the way in, or find an exit',
      change: 'Going deeper means encountering the main threat at full strength. The outer ring reveals a back way in — and something that explains what\'s really happening here.'
    },
    {
      q: 'Something is making noise ahead. They can rush toward it or approach cautiously.',
      a: 'Rush in — arrive while something is still happening, change the outcome',
      b: 'Approach slowly — arrive after it\'s over, but see the aftermath and aren\'t seen',
      change: 'Rushing in means they intervene in a situation mid-event. Approaching carefully means they observe what happened, who did it, and why — but it\'s done.'
    },
    {
      q: 'A trapped prisoner offers to guide them through the dungeon in exchange for freedom. Or the party navigates alone.',
      a: 'Free the prisoner and accept the guide — risk trusting someone with their own agenda',
      b: 'Leave them and find their own way — avoid the complication, but miss the knowledge',
      change: 'The prisoner knows the dungeon but has reasons to steer the party in a particular direction. Going alone means they stumble onto something the prisoner would have hidden.'
    },
    {
      q: 'The way forward is a long corridor clearly visible from a guard post. They can fight through, find a way around, or try to bluff.',
      a: 'Fight — fast, loud, costs resources, alerts everyone ahead',
      b: 'Find another way or bluff — slower, quieter, but requires something from the party',
      change: 'Fighting alerts the area. The quiet approach requires a sacrifice — information, an item, or a concession — that has later consequences.'
    },
    {
      q: 'A mechanism in the room has two settings. Neither is labelled. One must be activated to proceed.',
      a: 'Activate the left setting — something good or neutral happens, but something else goes wrong elsewhere',
      b: 'Activate the right setting — solves the immediate problem but opens something else',
      change: 'Each setting has a consequence in another part of the dungeon — a door opens, a passage floods, a creature is released. The party won\'t know which until they get there.'
    },
  ],
  moral: [
    {
      q: 'They can save many people by sacrificing one. The one person knows what\'s happening and has accepted it. But they don\'t have to accept it.',
      a: 'Accept the sacrifice — save the many, carry the weight',
      b: 'Refuse and find another way — harder, slower, not guaranteed to work',
      change: 'Accepting it works — but the cost follows the party. Finding another way delays and complicates, but changes what the many owe the party and each other.'
    },
    {
      q: 'They\'ve discovered that someone who does genuine good is also responsible for a genuine harm. Exposing them ends the good. Concealing it allows the harm.',
      a: 'Expose them — justice, at the cost of the good they do',
      b: 'Conceal it — protect the good, become complicit in the harm',
      change: 'Exposing them collapses something the community depended on, but creates a vacuum someone else fills. Concealing makes the party responsible for everything that follows.'
    },
    {
      q: 'They can help someone who has done terrible things — and may do so again — because that person is the only one who can help them in return.',
      a: 'Accept the help — get what they need, knowingly empower someone dangerous',
      b: 'Refuse — take the harder road without the help, keep their hands clean',
      change: 'Accepting the help creates a debt and an association. Refusing means they face the next challenge without a crucial resource — but may find an unexpected ally.'
    },
    {
      q: 'A law is unjust. Breaking it would help someone who genuinely needs it. Following it causes harm to that person.',
      a: 'Break the law — do the right thing, face the legal or social consequence',
      b: 'Follow the law — stay safe, watch the harm unfold, find another way through official channels',
      change: 'Breaking the law makes the party outlaws in this area — but earns loyalty. Following it closes one door and opens a different one via the system, slowly and imperfectly.'
    },
    {
      q: 'A dying enemy asks for mercy. Giving it may allow them to recover and cause harm again. Refusing means killing someone who is already beaten.',
      a: 'Show mercy — let them go, or treat them as a prisoner',
      b: 'Finish it — remove the threat, deal with what that means for the party',
      change: 'Mercy creates a future encounter — the enemy returns changed, or their allies seek vengeance. The alternative creates guilt, reputation, or a different kind of consequence.'
    },
    {
      q: 'Someone asks the party to lie on their behalf. The lie protects an innocent. The truth serves justice but harms that innocent.',
      a: 'Tell the lie — protect the innocent, undermine the institution',
      b: 'Tell the truth — serve justice, damage the innocent',
      change: 'The lie becomes a thread — someone knows, or the truth emerges later anyway. The truth earns respect in one place and hostility in another.'
    },
  ],
  combat: [
    {
      q: 'The enemy leader is trying to escape while their forces hold the party back. Pursue the leader or finish the fight?',
      a: 'Pursue the leader — let some enemies escape, but cut off the head',
      b: 'Finish the fight — the leader gets away, but the party is safe and fully resourced',
      change: 'Pursuing the leader is a chase — risky, but ends the threat. Finishing the fight means the leader reports back, regroups, and comes back with more information about the party.'
    },
    {
      q: 'The party can win this fight, but winning will destroy something important in the process.',
      a: 'Win the fight at the cost — accept the collateral damage',
      b: 'Fight differently — harder, riskier, but try to preserve what matters',
      change: 'Taking the easy win destroys something with later consequences. Fighting carefully costs resources and possibly a character is injured — but preserves an asset or relationship.'
    },
    {
      q: 'An enemy is offering surrender mid-combat. Accepting means prisoners and complications. Refusing means the fight continues but the moral position shifts.',
      a: 'Accept the surrender — deal with prisoners, spare lives, create obligation',
      b: 'Refuse or the offer isn\'t genuine — the fight continues to its conclusion',
      change: 'Accepting creates three new NPCs who know the party\'s capabilities. Refusing radicalises the remaining enemies — they fight harder knowing no quarter is given.'
    },
    {
      q: 'A civilian is caught in the middle. Protecting them costs tactical positioning. Letting them fend for themselves is faster.',
      a: 'Protect the civilian — tactical disadvantage, moral high ground',
      b: 'Focus on the fight — the civilian may be hurt, the party stays efficient',
      change: 'Protecting the civilian earns loyalty and information. The civilian who fends for themselves — or doesn\'t — changes the aftermath of the encounter.'
    },
    {
      q: 'The party can end this fight by destroying something the enemy values. It\'s not dangerous to them — but it may be important to others.',
      a: 'Destroy it — win efficiently, face the consequence of what was lost',
      b: 'Find another way to end it — harder, but the thing survives',
      change: 'Destroying it ends the fight cleanly but creates a debt to whoever else cared about it. Preserving it takes longer and one party member takes a hit that would have been avoided.'
    },
    {
      q: 'Reinforcements are coming — for both sides. The party can retreat and regroup, or press the attack before they arrive.',
      a: 'Press the attack — finish it before reinforcements tip the balance',
      b: 'Retreat and regroup — let the reinforcements arrive, change the battlefield',
      change: 'Pressing gives a chance at a decisive win but at full resource cost. Retreating means facing a harder fight, but the reinforcements on both sides add a new faction to the encounter.'
    },
  ],
  mystery: [
    {
      q: 'They have two leads. One points to someone powerful and dangerous. The other points to someone small and easily overlooked.',
      a: 'Follow the dangerous lead — faster answers, higher risk',
      b: 'Follow the overlooked lead — slower, but the overlooked person knows more than expected',
      change: 'The dangerous lead is a dead end designed to be found. The overlooked lead is the real thread — but following it puts a vulnerable person at risk.'
    },
    {
      q: 'They can search this location now while they have access, or come back later when it\'s less guarded.',
      a: 'Search now — risk of discovery, but the evidence is still here',
      b: 'Come back later — evidence may be moved or destroyed, but they arrive prepared',
      change: 'Searching now finds something but triggers awareness of the investigation. Waiting means the scene is altered — something is gone, something new is left behind.'
    },
    {
      q: 'A witness will talk, but only if they believe the party already knows the truth. Bluffing may unlock information. Being honest may shut them down.',
      a: 'Bluff — pretend to know more than they do, see what gets filled in',
      b: 'Be honest — risk the witness shutting down, but build real trust',
      change: 'Bluffing surfaces one piece of information — and confirms to the witness that the party knows something. Honesty closes that door but opens a different one: the witness decides to trust them with something more dangerous.'
    },
    {
      q: 'Two people are each blaming the other. One of them is lying. Both have motive. The party can push one for a confession or investigate separately.',
      a: 'Push one person hard — force a crack in the story',
      b: 'Investigate both separately — slower, but more complete',
      change: 'Pushing creates a confession — real or false — that may be used against them later. Investigating separately reveals that both are partially telling the truth, which complicates everything.'
    },
    {
      q: 'The answer is behind a door someone powerful wants kept shut. They can go through it now while no one is watching, or find a legitimate way in.',
      a: 'Go through now — find the truth, but without permission or cover',
      b: 'Find a legitimate way in — takes time, but provides cover and potentially an ally inside',
      change: 'Going now gets the information first, but they\'re exposed. The legitimate route is slower — and by the time they get there, someone knows they\'re coming.'
    },
    {
      q: 'They\'ve found evidence that implicates someone they trust. It could be a frame, or it could be true.',
      a: 'Confront the trusted person directly — risk the relationship on the truth',
      b: 'Investigate further before confronting — more time, more danger, but more certainty',
      change: 'Confronting early puts the trusted person on guard — guilty or innocent. More investigation uncovers a third party who benefits from the suspicion falling where it has.'
    },
  ],
};
// Build flat any pool
FORKS.any = Object.values(FORKS).flat();

let lastFork = null;

function genFork(){
  const type = document.getElementById('fork-type-filter').value;
  const pool = type === 'any' ? FORKS.any : (FORKS[type] || FORKS.any);
  const fork = pick(pool);
  lastFork = fork;

  const block = document.getElementById('fork-result-block');
  block.innerHTML = `
    <div style="font-family:var(--hfont);font-size:calc(max(.72,.8)*var(--tu));letter-spacing:.1em;text-transform:uppercase;color:var(--ink-light);margin-bottom:.5rem">Choice / Fork</div>
    <div style="font-family:var(--bfont);font-size:calc(1*var(--tu));color:var(--ink);line-height:1.5;margin-bottom:.75rem;font-style:italic">${fork.q}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-bottom:.7rem">
      <div style="background:rgba(139,26,26,.07);border:1px solid rgba(139,26,26,.2);border-radius:2px;padding:.55rem .7rem">
        <div style="font-family:var(--hfont);font-size:calc(max(.6,.8)*var(--tu));letter-spacing:.1em;text-transform:uppercase;color:var(--red);margin-bottom:.25rem">Path A</div>
        <div style="font-family:var(--bfont);font-size:calc(.92*var(--tu));color:var(--ink);line-height:1.45">${fork.a}</div>
      </div>
      <div style="background:rgba(26,42,74,.06);border:1px solid rgba(26,42,74,.2);border-radius:2px;padding:.55rem .7rem">
        <div style="font-family:var(--hfont);font-size:calc(max(.6,.8)*var(--tu));letter-spacing:.1em;text-transform:uppercase;color:var(--blue);margin-bottom:.25rem">Path B</div>
        <div style="font-family:var(--bfont);font-size:calc(.92*var(--tu));color:var(--ink);line-height:1.45">${fork.b}</div>
      </div>
    </div>
    <div style="background:rgba(184,134,11,.07);border:1px solid rgba(184,134,11,.25);border-radius:2px;padding:.5rem .7rem">
      <div style="font-family:var(--hfont);font-size:calc(max(.6,.8)*var(--tu));letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:.2rem">What Changes</div>
      <div style="font-family:var(--bfont);font-size:calc(.9*var(--tu));color:var(--ink);line-height:1.45">${fork.change}</div>
    </div>`;

  addToHistory('fork-history', fork.q.slice(0, 80) + '…');
  block.classList.remove('fresh'); void block.offsetWidth; block.classList.add('fresh');
}

function genForkSend(){
  if(!lastFork) genFork();
  const f = lastFork;
  addFork();
  const list = document.getElementById('forks-list');
  const card = list.lastElementChild;
  if(card){
    const set = (k,v) => { const el=card.querySelector('[data-key="'+k+'"]'); if(el) el.value=v; };
    set('fork-title', f.q);
    set('fork-a', f.a);
    set('fork-b', f.b);
    set('fork-notes', f.change);
  }
  const btn = document.querySelector('[data-ac="tab-s3"]');
  if(btn) sw('s3', btn);
}

function genForkCopy(){
  if(!lastFork) return;
  const f = lastFork;
  copyText(`FORK: ${f.q}\n\nPath A: ${f.a}\nPath B: ${f.b}\n\nWhat changes: ${f.change}`);
}


// ══════════════════════════════════════════════════════
//  GROUP MANAGEMENT FUNCTIONS
// ══════════════════════════════════════════════════════
function toggleGroup(idx){
  combatants[idx].expanded = !combatants[idx].expanded;
  renderInitList();
}

function updateMemberHP(groupIdx, memberIdx, val){
  const g = combatants[groupIdx];
  if(!g||!g.members) return;
  const hp = Math.max(0, parseInt(val)||0);
  g.members[memberIdx].hp = hp;
  g.members[memberIdx].dead = hp <= 0;
  // Update group summary HP (average of alive members)
  const alive = g.members.filter(m=>!m.dead);
  g.hp = alive.length > 0 ? Math.round(alive.reduce((s,m)=>s+m.hp,0)/alive.length) : 0;
  renderInitList();
}

function killMember(groupIdx, memberIdx){
  const g = combatants[groupIdx];
  if(!g||!g.members) return;
  g.members[memberIdx].hp = 0;
  g.members[memberIdx].dead = true;
  const alive = g.members.filter(m=>!m.dead);
  g.hp = alive.length > 0 ? Math.round(alive.reduce((s,m)=>s+m.hp,0)/alive.length) : 0;
  renderInitList();
}

function removeMember(groupIdx, memberIdx){
  const g = combatants[groupIdx];
  if(!g||!g.members) return;
  g.members.splice(memberIdx, 1);
  g.count = g.members.length;
  if(g.members.length === 0){ removeCombatant(groupIdx); return; }
  renderInitList();
}

function removeMemberCond(groupIdx, memberIdx, cond){
  const g = combatants[groupIdx];
  if(!g||!g.members) return;
  g.members[memberIdx].conditions = (g.members[memberIdx].conditions||[]).filter(c=>c!==cond);
  renderInitList();
}

// Apply damage to the member with the highest current HP (single target)
function applyGroupDamage(groupIdx, amt){
  if(!amt) return;
  const g = combatants[groupIdx];
  if(!g||!g.members) return;
  const alive = g.members.filter(m=>!m.dead);
  if(alive.length===0) return;
  // Hit the one with most HP
  const target = alive.reduce((a,b)=>a.hp>=b.hp?a:b);
  target.hp = Math.max(0, target.hp - amt);
  if(target.hp <= 0) target.dead = true;
  const stillAlive = g.members.filter(m=>!m.dead);
  g.hp = stillAlive.length > 0 ? Math.round(stillAlive.reduce((s,m)=>s+m.hp,0)/stillAlive.length) : 0;
  renderInitList();
}

// Apply damage to ALL members (AoE)
function applyGroupAoE(groupIdx, amt){
  if(!amt) return;
  const g = combatants[groupIdx];
  if(!g||!g.members) return;
  g.members.forEach(m=>{ if(!m.dead){ m.hp=Math.max(0,m.hp-amt); if(m.hp<=0)m.dead=true; }});
  const alive = g.members.filter(m=>!m.dead);
  g.hp = alive.length > 0 ? Math.round(alive.reduce((s,m)=>s+m.hp,0)/alive.length) : 0;
  renderInitList();
}

// Split group into individual combatants (shared initiative)
function splitGroup(groupIdx){
  const g = combatants[groupIdx];
  if(!g||!g.members) return;
  const newCombatants = g.members.filter(m=>!m.dead).map(m=>({
    name: m.name,
    type: 'monster',
    initiative: g.initiative,
    hp: m.hp,
    hpMax: m.hpMax,
    ac: g.ac,
    conditions: m.conditions||[],
    dex: g.dex||10,
  }));
  combatants.splice(groupIdx, 1, ...newCombatants);
  renderInitList(); updateInitSelects();
}

// Split group and roll a fresh d20 initiative for each member
function splitGroupWithInit(groupIdx){
  const g = combatants[groupIdx];
  if(!g||!g.members) return;
  const newCombatants = g.members.filter(m=>!m.dead).map(m=>({
    name: m.name,
    type: 'monster',
    initiative: Math.floor(Math.random()*20)+1,
    hp: m.hp,
    hpMax: m.hpMax,
    ac: g.ac,
    conditions: m.conditions||[],
    dex: g.dex||10,
  }));
  combatants.splice(groupIdx, 1, ...newCombatants);
  combatants.sort((a,b)=>b.initiative-a.initiative);
  renderInitList(); updateInitSelects();
}

// Update killCombatant to handle groups
const _origKillCombatant = killCombatant;
function killCombatant(idx){
  if(combatants[idx]&&combatants[idx].isGroup){
    combatants[idx].members.forEach(m=>{m.hp=0;m.dead=true;});
    combatants[idx].hp=0;
  } else {
    combatants[idx].hp=0;
  }
  renderInitList();
}

// Update updateInitSelects to list groups as single entry
const _origUpdateInitSelects = updateInitSelects;
function updateInitSelects(){
  ['dmg-target','cond-target'].forEach(id=>{
    const sel=document.getElementById(id);if(!sel)return;
    const cur=sel.value;sel.innerHTML='<option value="">— select —</option>';
    combatants.forEach((c,i)=>{
      const opt=document.createElement('option');opt.value=i;
      opt.textContent=c.isGroup?`${c.name} ×${c.members.filter(m=>!m.dead).length} (group)`:c.name;
      sel.appendChild(opt);
    });
    sel.value=cur;
  });
}

// Add condition to group applies to all alive members
const _origAddCond = addCond;
function addCond(){
  const idx=parseInt(document.getElementById('cond-target').value);
  const cond=document.getElementById('cond-pick').value;
  if(isNaN(idx)||!cond)return;
  const c=combatants[idx];
  if(c.isGroup){
    (c.members||[]).forEach(m=>{ if(!m.dead&&!(m.conditions||[]).includes(cond)){
      if(!m.conditions)m.conditions=[];m.conditions.push(cond);
    }});
  } else {
    if(!c.conditions.includes(cond))c.conditions.push(cond);
  }
  renderInitList();
}

// rollAllInit handles groups
const _origRollAllInit = rollAllInit;
function rollAllInit(){
  combatants.forEach(c=>{
    const dexMod=Math.floor(((c.dex||10)-10)/2);
    c.initiative=Math.floor(Math.random()*20)+1+dexMod;
  });
  combatants.sort((a,b)=>b.initiative-a.initiative);
  currentTurn=0;renderInitList();updateInitSelects();
}


// ══════════════════════════════════════════════════════
//  SHARED HELPERS (run mode, prep check, benchmark)
// ══════════════════════════════════════════════════════
function escH(s){ return String(s==null?'':s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function readList(lid){
  const list=document.getElementById(lid); if(!list) return [];
  return Array.from(list.querySelectorAll(':scope > .card')).map((card,idx)=>{
    const o={_card:card,_idx:idx};
    card.querySelectorAll('[data-key]').forEach(i=>{ o[i.dataset.key]=(i.value||'').trim(); });
    return o;
  });
}
function isBlankRow(o){ return Object.keys(o).filter(k=>!k.startsWith('_')).every(k=>!o[k]); }
function fieldVal(id){ const el=document.getElementById(id); return el?(el.value||'').trim():''; }
function parseCR(v){
  v=String(v||'').trim(); if(!v) return NaN;
  if(v.includes('/')){ const [a,b]=v.split('/').map(Number); return b?a/b:NaN; }
  return parseFloat(v);
}
function fmtCR(n){
  if(isNaN(n)) return '?';
  const fr={0.125:'1/8',0.25:'1/4',0.5:'1/2'}; if(fr[n]) return fr[n];
  return (Math.round(n*100)/100).toString();
}
function goTab(name){ const b=document.querySelector('[data-ac="tab-'+name+'"]'); sw(name,b); window.scrollTo({top:0,behavior:'smooth'}); }
function sheetLevels(){
  return loadedChars.map(c=>({name:pcShortName(c),level:parseInt(c.level)})).filter(x=>!isNaN(x.level));
}
function benchNumbers(levels){
  // levels: array of character levels
  const count=levels.length, sum=levels.reduce((a,b)=>a+b,0);
  const avg=count?sum/count:1, lvl=Math.round(avg);
  let divisor,tier;
  if(lvl<=4){divisor=4;tier='levels 1–4: total levels ÷ 4';}
  else if(lvl<=10){divisor=2;tier='levels 5–10: total levels ÷ 2';}
  else if(lvl<=16){divisor=4/3;tier='levels 11–16: total levels × ¾';}
  else {divisor=1;tier='level 17+: total levels';}
  const benchmark=Math.round(sum/divisor*10)/10;
  const singleMax=lvl<=4?lvl:Math.round(lvl*1.5*10)/10;
  return {count,sum,lvl,benchmark,singleMax,tier};
}
function currentBench(){
  const count=parseInt(fieldVal('bench-count'))||4;
  const level=parseInt(fieldVal('bench-level'))||1;
  return benchNumbers(Array(count).fill(level));
}

// ══════════════════════════════════════════════════════
//  SMART BENCHMARK (replaces the earlier calculator)
// ══════════════════════════════════════════════════════
let benchManual=false;
function calcBenchmark(){
  const b=currentBench();
  const resultEl=document.getElementById('bench-result');
  if(resultEl){
    resultEl.innerHTML=`Benchmark: <span style="font-size:calc(1.1*var(--tu))">CR ${b.benchmark} total</span> before an encounter may be deadly. No single monster above CR ${b.singleMax}.
      <span class="bench-sub">${b.count} characters, total level ${b.sum} (${b.tier})</span>`;
  }
  const noteEl=document.getElementById('enc-bench');
  if(noteEl) noteEl.value=`${b.count} × Lvl ${b.lvl} party → deadly above CR ${b.benchmark} total · single monster max CR ${b.singleMax}`;
  renderEncTester();
}
function benchFromSheets(){
  const lv=sheetLevels();
  const src=document.getElementById('bench-source');
  if(!lv.length){
    if(src) src.innerHTML='No character sheets are loaded yet. Load them on the Characters tab, or enter the numbers above.';
    return;
  }
  const b=benchNumbers(lv.map(x=>x.level));
  document.getElementById('bench-count').value=b.count;
  document.getElementById('bench-level').value=b.lvl;
  benchManual=false;
  const pl=parseInt(fieldVal('party-level'));
  let html=`From the character sheets: ${lv.map(x=>escH(x.name)+' '+x.level).join(', ')}.`;
  if(pl && lv.some(x=>x.level!==pl)){
    html+=` <span class="bench-warn">The Party Level box at the top says ${pl}. Update it if the sheets are right.</span>`;
  }
  if(src) src.innerHTML=html;
  calcBenchmark();
}
document.addEventListener('input',e=>{
  if(e.target && (e.target.id==='bench-count'||e.target.id==='bench-level')){
    benchManual=true;
    const src=document.getElementById('bench-source'); if(src) src.textContent='Entered by hand.';
  }
});

// Encounter tester
const encTesterCounts={};
function renderEncTester(){
  const wrap=document.getElementById('enc-tester-rows'); if(!wrap) return;
  const mons=readList('mon-list').filter(m=>m['mn-name']);
  if(!mons.length){ wrap.innerHTML='<div class="run-empty">Add monsters below to test an encounter.</div>'; document.getElementById('enc-tester-result').innerHTML=''; return; }
  const focused=document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.encName : null;
  wrap.innerHTML='';
  mons.forEach(m=>{
    const key=m['mn-name'];
    const row=document.createElement('div'); row.className='enc-tester-row';
    const cr=parseCR(m['mn-cr']);
    row.innerHTML=`<span class="etr-name">${escH(key)}</span><span class="etr-cr">CR ${escH(m['mn-cr']||'?')}</span>`;
    const inp=document.createElement('input'); inp.type='number'; inp.min=0; inp.max=30;
    inp.value=encTesterCounts[key]||0; inp.dataset.encName=key; inp.setAttribute('aria-label','How many '+key);
    inp.addEventListener('input',()=>{ encTesterCounts[key]=Math.max(0,parseInt(inp.value)||0); updateEncTesterResult(); });
    row.appendChild(inp);
    wrap.appendChild(row);
    if(focused===key) inp.focus();
  });
  updateEncTesterResult();
}
function updateEncTesterResult(){
  const out=document.getElementById('enc-tester-result'); if(!out) return;
  const b=currentBench();
  const mons=readList('mon-list').filter(m=>m['mn-name']);
  let total=0, parts=[], overSingle=[];
  mons.forEach(m=>{
    const n=encTesterCounts[m['mn-name']]||0; if(!n) return;
    const cr=parseCR(m['mn-cr']); if(isNaN(cr)) return;
    total+=cr*n; parts.push(`${n} × ${m['mn-name']}`);
    if(cr>b.singleMax) overSingle.push(m['mn-name']);
  });
  if(!parts.length){ out.innerHTML=''; return; }
  const pct=Math.min(100,Math.round(total/b.benchmark*100));
  const over=total>b.benchmark;
  out.className='enc-tester-result '+(over?'is-over':'is-under');
  out.innerHTML=`<div class="etr-bar"><span style="width:${pct}%"></span></div>
    <strong>Total CR ${fmtCR(total)} of ${b.benchmark}.</strong> ${over?'Above the benchmark, so this could be deadly.':'Within the benchmark.'}
    ${overSingle.length?`<br>${overSingle.map(escH).join(', ')} ${overSingle.length>1?'are':'is'} above the single-monster limit of CR ${b.singleMax}.`:''}`;
}
let encTesterTimer=null;
document.addEventListener('input',e=>{
  if(e.target && e.target.closest && e.target.closest('#mon-list')){
    clearTimeout(encTesterTimer); encTesterTimer=setTimeout(renderEncTester,300);
  }
});
document.addEventListener('click',e=>{
  if(e.target && e.target.closest && e.target.closest('#mon-list .rbtn')) setTimeout(renderEncTester,50);
  if(e.target && e.target.closest && e.target.closest('[data-ac="tab-s7"],[data-ac="fn-addMon"]')) setTimeout(renderEncTester,50);
});

// Use the party from sheets automatically once they load (unless numbers were typed by hand)
window.addEventListener('DOMContentLoaded',()=>{
  const cs=document.getElementById('char-sheets'); if(!cs) return;
  let t=null;
  new MutationObserver(()=>{ clearTimeout(t); t=setTimeout(()=>{ if(!benchManual) benchFromSheets(); },400); }).observe(cs,{childList:true});
});

// ══════════════════════════════════════════════════════
//  RUN SESSION
// ══════════════════════════════════════════════════════
function charHooks(){
  const hooks=[];
  const listHooks=readList('hook-list').filter(h=>h['hk-text']);
  loadedChars.forEach(c=>{
    const short=pcShortName(c);
    const inp=document.querySelector('[data-char-hook="'+CSS.escape(c.name)+'"]');
    let text=inp?inp.value.trim():'';
    if(!text){
      const lh=listHooks.find(h=>(h['hk-char']||'').toLowerCase().includes(short.toLowerCase()));
      if(lh) text=lh['hk-text'];
    }
    hooks.push({name:short,player:c.player||'',text});
  });
  // Hooks for characters that aren't loaded as sheets
  listHooks.forEach(h=>{
    if(!hooks.find(x=>(h['hk-char']||'').toLowerCase().includes(x.name.toLowerCase())))
      hooks.push({name:h['hk-char']||'Character',player:h['hk-player']||'',text:h['hk-text']});
  });
  return hooks;
}
function runEmpty(msg,tab){ return `<div class="run-empty">${msg}${tab?` <button class="run-link" data-go="${tab}">Add some</button>`:''}</div>`; }

function renderRunMode(){
  const pane=document.getElementById('tab-run'); if(!pane) return;
  const camp=fieldVal('campaign-name'), sess=fieldVal('session-num'), date=fieldVal('session-date'), pl=fieldVal('party-level');
  document.getElementById('run-title').textContent=sess||'This session';
  document.getElementById('run-sub').textContent=[camp,date,pl?('Party level '+pl):''].filter(Boolean).join(', ');

  // Strong start
  const ss=fieldVal('strong-start');
  document.getElementById('run-strong').innerHTML=ss?escH(ss).replace(/\n/g,'<br>'):runEmpty('No strong start yet.','s2');
  const ah=fieldVal('adv-hook');
  document.getElementById('run-advhook').innerHTML=ah?`<strong>Pulls them in:</strong> ${escH(ah)}`:'';

  // Secrets
  const secs=readList('secrets-list').filter(s=>s.sec);
  const secWrap=document.getElementById('run-secrets');
  revealedSecrets=revealedSecrets.filter(t=>secs.some(s=>s.sec===t));
  if(!secs.length) secWrap.innerHTML=runEmpty('No secrets written yet.','s4');
  else{
    secWrap.innerHTML='';
    secs.forEach((s,i)=>{
      const id='run-sec-'+i;
      const lab=document.createElement('label'); lab.className='run-secret'+(revealedSecrets.includes(s.sec)?' is-revealed':''); lab.htmlFor=id;
      const cb=document.createElement('input'); cb.type='checkbox'; cb.id=id; cb.checked=revealedSecrets.includes(s.sec);
      cb.addEventListener('change',()=>toggleSecret(s.sec,cb.checked,lab));
      const span=document.createElement('span'); span.textContent=s.sec;
      lab.appendChild(cb); lab.appendChild(span); secWrap.appendChild(lab);
    });
  }
  updateSecretCount(secs.length);

  // Forks
  const forks=readList('forks-list').filter(f=>f['fork-title']);
  document.getElementById('run-forks').innerHTML=forks.length?forks.map(f=>`
    <div class="run-fork">
      <div class="run-fork-q">${escH(f['fork-title'])}</div>
      <div class="run-fork-paths">
        ${f['fork-a']?`<div><span class="run-path a">A</span>${escH(f['fork-a'])}</div>`:''}
        ${f['fork-b']?`<div><span class="run-path b">B</span>${escH(f['fork-b'])}</div>`:''}
      </div>
      ${f['fork-notes']?`<div class="run-small">${escH(f['fork-notes'])}</div>`:''}
    </div>`).join(''):runEmpty('No forks yet.','s3');

  // Scenes
  const sh=fieldVal('scene-hook');
  const scenes=readList('scenes-list').filter(s=>s['sc-name']||s['sc-notes']);
  document.getElementById('run-scenes').innerHTML=(sh?`<div class="run-meta-line"><strong>Adventure hook:</strong> ${escH(sh)}</div>`:'')+
    (scenes.length?scenes.map(s=>`
    <div class="run-item">
      <div class="run-item-top"><span class="run-item-name">${escH(s['sc-name']||'Untitled scene')}</span>${s['sc-type']?`<span class="run-tag">${escH(s['sc-type'])}</span>`:''}</div>
      ${s['sc-trig']?`<div class="run-small"><em>When:</em> ${escH(s['sc-trig'])}</div>`:''}
      ${s['sc-notes']?`<div class="run-text">${escH(s['sc-notes'])}</div>`:''}
    </div>`).join(''):runEmpty('No scenes yet.','s3'));

  // Table notes <-> post-session summary
  const notes=document.getElementById('run-notes'), summary=document.getElementById('summary');
  if(notes && summary && document.activeElement!==notes) notes.value=summary.value;

  // Hooks
  const hooks=charHooks();
  document.getElementById('run-hooks').innerHTML=hooks.length?hooks.map(h=>`
    <div class="run-hook${h.text?'':' is-missing'}">
      <div class="run-item-name">${escH(h.name)}${h.player?` <span class="run-player">${escH(h.player)}</span>`:''}</div>
      <div class="run-text">${h.text?escH(h.text):'No hook yet. <button class="run-link" data-go="s1">Add one</button>'}</div>
    </div>`).join(''):runEmpty('Load character sheets to see their hooks here.','s1');

  // NPCs
  const npcs=readList('npc-list').filter(n=>n['np-name']);
  document.getElementById('run-npcs').innerHTML=npcs.length?npcs.map(n=>`
    <div class="run-item">
      <div class="run-item-top"><span class="run-item-name">${escH(n['np-name'])}</span>${n['np-role']?`<span class="run-tag">${escH(n['np-role'])}</span>`:''}</div>
      ${n['np-trait']?`<div class="run-text">${escH(n['np-trait'])}</div>`:''}
      ${n['np-want']?`<div class="run-small"><em>Wants:</em> ${escH(n['np-want'])}</div>`:''}
      ${n['np-notes']?`<div class="run-small run-secretish">${escH(n['np-notes'])}</div>`:''}
    </div>`).join(''):runEmpty('No NPCs yet.','s6');

  // Monsters
  const b=currentBench();
  document.getElementById('run-bench').innerHTML=`Benchmark CR ${b.benchmark} per fight, single monster up to CR ${b.singleMax}.`;
  const mons=readList('mon-list').filter(m=>m['mn-name']);
  const monWrap=document.getElementById('run-mons');
  if(!mons.length) monWrap.innerHTML=runEmpty('No monsters yet.','s7');
  else{
    monWrap.innerHTML='';
    mons.forEach(m=>{
      const cr=parseCR(m['mn-cr']);
      const div=document.createElement('div'); div.className='run-item';
      div.innerHTML=`<div class="run-item-top"><span class="run-item-name">${escH(m['mn-name'])}${(parseInt(m['mn-n'])||1)>1?' ×'+escH(m['mn-n']):''}</span>
        <span class="run-tag${cr>b.singleMax?' is-hot':''}">CR ${escH(m['mn-cr']||'?')}</span></div>
        <div class="run-small">HP ${escH(m['mn-hp']||'?')}, AC ${escH(m['mn-ac']||'?')}${m['mn-tac']?'. '+escH(m['mn-tac']):''}</div>
        ${m['mn-notes']?`<div class="run-small run-secretish">${escH(m['mn-notes'])}</div>`:''}`;
      const btns=document.createElement('div'); btns.className='run-mon-btns';
      [['add-init','Add to initiative'],['roll-init','Roll and add'],['roll-indiv','Roll each']].forEach(([role,label])=>{
        if(role==='roll-indiv' && (parseInt(m['mn-n'])||1)<2) return;
        const bt=document.createElement('button'); bt.className='abtn'; bt.textContent=label;
        bt.addEventListener('click',()=>{ const src=m._card.querySelector('[data-role="'+role+'"]'); if(src) src.click(); });
        btns.appendChild(bt);
      });
      div.appendChild(btns); monWrap.appendChild(div);
    });
  }

  // Locations
  const locs=readList('loc-list').filter(l=>l['lo-name']);
  document.getElementById('run-locs').innerHTML=locs.length?locs.map(l=>`
    <div class="run-item">
      <div class="run-item-top"><span class="run-item-name">${escH(l['lo-name'])}</span>${l['lo-type']?`<span class="run-tag">${escH(l['lo-type'])}</span>`:''}</div>
      ${l['lo-desc']?`<div class="run-text">${escH(l['lo-desc'])}</div>`:''}
      ${l['lo-asp']?`<div class="run-small">${escH(l['lo-asp']).replace(/\n/g,'<br>')}</div>`:''}
    </div>`).join(''):runEmpty('No locations yet.','s5');

  // Treasure
  const tr=readList('treas-list').filter(t=>t['tr-name']);
  document.getElementById('run-treas').innerHTML=tr.length?tr.map(t=>`
    <div class="run-treas-item"><span class="run-item-name">${escH(t['tr-name'])}</span>${t['tr-for']?` <span class="run-small">for ${escH(t['tr-for'])}</span>`:''}</div>`).join(''):runEmpty('No treasure yet.','s8');

  renderCheckStrip();
}

function updateSecretCount(total){
  const el=document.getElementById('run-sec-count');
  if(el) el.textContent=total?`${revealedSecrets.length} of ${total} revealed`:'';
}
function toggleSecret(text,on,lab){
  const used=document.getElementById('secrets-used');
  const line='✓ '+text;
  if(on){ if(!revealedSecrets.includes(text)) revealedSecrets.push(text); }
  else revealedSecrets=revealedSecrets.filter(t=>t!==text);
  if(used){
    let lines=used.value?used.value.split('\n'):[];
    lines=lines.filter(l=>l!==line);
    if(on) lines.push(line);
    used.value=lines.join('\n').replace(/^\n+/,'');
  }
  if(lab) lab.classList.toggle('is-revealed',on);
  updateSecretCount(readList('secrets-list').filter(s=>s.sec).length);
}

// Jump links inside run mode / prep check
document.addEventListener('click',e=>{
  const go=e.target.closest && e.target.closest('[data-go]');
  if(!go) return;
  closePrepCheck();
  goTab(go.dataset.go);
});
// Table notes write straight into the post-session summary
document.addEventListener('input',e=>{
  if(e.target && e.target.id==='run-notes'){ const s=document.getElementById('summary'); if(s) s.value=e.target.value; }
});
// Refresh run mode each time it's opened
document.addEventListener('click',e=>{
  if(e.target.closest && e.target.closest('[data-ac="tab-run"]')) renderRunMode();
});

// ══════════════════════════════════════════════════════
//  PREP CHECK
// ══════════════════════════════════════════════════════
const ROLE_WORDS=['refugee','hunter','captain','knight','innkeeper','farmer','merchant','priest','guide','prisoner','witness','blacksmith','healer','doctor','mayor','elder','messenger','sheriff','bandit'];

function runPrepCheck(){
  const out=[]; // {lvl:'fix'|'tip'|'ok', text, tab}
  const add=(lvl,text,tab)=>out.push({lvl,text,tab});

  // Characters and party level
  const lv=sheetLevels();
  const pl=parseInt(fieldVal('party-level'));
  if(!loadedChars.length) add('tip','No character sheets are loaded, so hooks and party level can\'t be checked.','s1');
  if(lv.length && pl && lv.some(x=>x.level!==pl)){
    const real=benchNumbers(lv.map(x=>x.level)), set=benchNumbers(Array(lv.length).fill(pl));
    add('fix',`Party Level says ${pl}, but the character sheets say ${lv.map(x=>escH(x.name)+' '+x.level).join(', ')}. That changes the benchmark from CR ${set.benchmark} to CR ${real.benchmark}.`,'s7');
  } else if(lv.length && pl) add('ok',`Party level matches the character sheets (${pl}).`);

  // Hooks
  const hooks=charHooks();
  const missing=hooks.filter(h=>!h.text && loadedChars.some(c=>pcShortName(c)===h.name));
  missing.forEach(h=>add('fix',`${escH(h.name)} has no session hook.`,'s1'));
  if(loadedChars.length && !missing.length) add('ok','Every character has a session hook.');

  // Strong start
  if(!fieldVal('strong-start')) add('fix','There\'s no strong start.','s2'); else add('ok','Strong start written.');

  // Scenes & forks
  const scenes=readList('scenes-list'), realScenes=scenes.filter(s=>!isBlankRow(s));
  if(!realScenes.length) add('fix','There are no scenes.','s3');
  else{
    const noTrig=realScenes.filter(s=>!s['sc-trig']);
    if(noTrig.length) add('tip',`${noTrig.length===1?'One scene has':noTrig.length+' scenes have'} no trigger: ${noTrig.map(s=>escH(s['sc-name']||'untitled')).join(', ')}.`,'s3');
    else add('ok',`${realScenes.length} scenes, each with a trigger.`);
  }
  const forks=readList('forks-list').filter(f=>!isBlankRow(f));
  if(!forks.length) add('tip','No forks yet. Even one real choice gives players direction.','s3');
  else add('ok',`${forks.length} fork${forks.length>1?'s':''} ready.`);

  // Secrets
  const secs=readList('secrets-list'), filled=secs.filter(s=>s.sec);
  if(!filled.length) add('fix','There are no secrets.','s4');
  else if(filled.length<10) add('tip',`${filled.length} of 10 secrets. Ten gives you plenty to drop in wherever the players go.`,'s4');
  else add('ok','Ten secrets ready.');
  if(secs.length>filled.length) add('tip',`${secs.length-filled.length} empty secret card${secs.length-filled.length>1?'s':''} can be removed.`,'s4');

  // Locations
  const locs=readList('loc-list').filter(l=>!isBlankRow(l));
  if(!locs.length) add('tip','No locations yet.','s5');
  locs.forEach(l=>{
    const aspects=(l['lo-asp']||'').split(/\n|•|;|\.\s/).map(x=>x.trim()).filter(x=>x.length>2);
    if(aspects.length<3) add('tip',`${escH(l['lo-name']||'A location')} has ${aspects.length||'no'} fantastic aspect${aspects.length===1?'':'s'}. Three gives players more to interact with.`,'s5');
  });

  // NPCs
  const npcs=readList('npc-list').filter(n=>!isBlankRow(n));
  if(!npcs.length) add('tip','No NPCs yet.','s6');
  npcs.filter(n=>!n['np-want']).forEach(n=>add('tip',`${escH(n['np-name']||'An NPC')} has no "wants". A want tells you how they react to the party.`,'s6'));

  // People mentioned in scenes/forks without an NPC or monster entry
  const prose=[fieldVal('strong-start'),fieldVal('adv-hook'),fieldVal('scene-hook'),
    ...realScenes.map(s=>[s['sc-name'],s['sc-trig'],s['sc-notes']].join(' ')),
    ...forks.map(f=>[f['fork-title'],f['fork-a'],f['fork-b'],f['fork-notes']].join(' '))].join(' ').toLowerCase();
  const people=(npcs.map(n=>[n['np-name'],n['np-role'],n['np-notes']].join(' '))
    .concat(readList('mon-list').map(m=>m['mn-name']||''))).join(' ').toLowerCase();
  ROLE_WORDS.forEach(w=>{
    if(new RegExp('\\b'+w+'s?\\b').test(prose) && !people.includes(w))
      add('tip',`A ${w} appears in your scenes or forks but isn't in your NPC list. A name and one trait is enough.`,'s6');
  });

  // Monsters vs benchmark
  const b=currentBench();
  const mons=readList('mon-list').filter(m=>!isBlankRow(m));
  if(!mons.length) add('tip','No monsters yet.','s7');
  mons.forEach(m=>{
    const nm=escH(m['mn-name']||'A monster');
    if(!m['mn-hp']||!m['mn-ac']) add('fix',`${nm} is missing ${!m['mn-hp']&&!m['mn-ac']?'HP and AC':!m['mn-hp']?'HP':'AC'}.`,'s7');
    const cr=parseCR(m['mn-cr']), n=parseInt(m['mn-n'])||1;
    if(isNaN(cr)) return;
    if(cr>b.singleMax) add('tip',`${nm} is CR ${fmtCR(cr)}, above the single-monster limit of CR ${b.singleMax} for this party. It could be deadly on its own.`,'s7');
    else if(cr*n>b.benchmark) add('tip',`${n} × ${nm} totals CR ${fmtCR(cr*n)}, above the benchmark of CR ${b.benchmark}.`,'s7');
  });

  // Treasure
  if(!readList('treas-list').filter(t=>t['tr-name']).length) add('tip','No treasure yet.','s8');

  return out;
}

function renderCheckStrip(){
  const el=document.getElementById('run-check-strip'); if(!el) return;
  const r=runPrepCheck(), f=r.filter(x=>x.lvl==='fix').length, t=r.filter(x=>x.lvl==='tip').length;
  el.className='run-check-strip '+(f?'has-fix':t?'has-tip':'all-ok');
  el.innerHTML=f||t
    ?`<span>Prep check: ${f?`${f} to fix`:''}${f&&t?', ':''}${t?`${t} suggestion${t>1?'s':''}`:''}.</span> <button class="run-link" data-ac="fn-openPrepCheck">See details</button>`
    :'<span>Prep check: everything looks ready.</span>';
}

function openPrepCheck(){
  const r=runPrepCheck();
  const groups=[['fix','Needs fixing'],['tip','Worth a look'],['ok','Looking good']];
  const f=r.filter(x=>x.lvl==='fix').length, t=r.filter(x=>x.lvl==='tip').length;
  document.getElementById('pc-summary').textContent=f||t
    ?`${f} to fix and ${t} suggestion${t===1?'':'s'}. Click an item to jump to it.`
    :'Everything looks ready. Have a great session.';
  document.getElementById('pc-list').innerHTML=groups.map(([lvl,label])=>{
    const items=r.filter(x=>x.lvl===lvl); if(!items.length) return '';
    return `<div class="pc-group pc-${lvl}"><h4>${label}</h4>${items.map(x=>
      x.tab?`<button class="pc-item" data-go="${x.tab}">${x.text}</button>`:`<div class="pc-item">${x.text}</div>`).join('')}</div>`;
  }).join('');
  document.getElementById('prep-check-modal').classList.add('open');
}
function closePrepCheck(){ const m=document.getElementById('prep-check-modal'); if(m) m.classList.remove('open'); }
document.addEventListener('click',e=>{ const m=document.getElementById('prep-check-modal'); if(m && e.target===m) closePrepCheck(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closePrepCheck(); });


// ══════════════════════════════════════════════════════
//  PC RESOURCES
// ══════════════════════════════════════════════════════
const FULL_SLOTS=[[],[2],[3],[4,2],[4,3],[4,3,2],[4,3,3],[4,3,3,1],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,2],[4,3,3,3,2,1],[4,3,3,3,2,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]];
const HALF_SLOTS=[[],[],[2],[3],[3],[4,2],[4,2],[4,3],[4,3],[4,3,2],[4,3,2],[4,3,3],[4,3,3],[4,3,3,1],[4,3,3,1],[4,3,3,2],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,1],[4,3,3,3,2],[4,3,3,3,2]];
function abilMod(s){ return Math.floor(((s||10)-10)/2); }
function charByShort(short){ return loadedChars.find(c=>pcShortName(c)===short); }

// Build the list of trackers for a character from their class and sheet text
function pcTrackers(ch){
  if(window.PartyBridge){ return window.PartyBridge.trackers(pcShortName(ch)); }
  const cls=(ch.class||'').toLowerCase(), sub=(ch.subclass||'').toLowerCase();
  const L=parseInt(ch.level)||1, PB=parseInt(ch.proficiency)||Math.ceil(L/4)+1;
  const st=ch.stats||[10,10,10,10,10,10];
  const t=[];
  const add=(key,label,max,reset,kind)=>{ if(max>0 && !t.find(x=>x.key===key)) t.push({key,label,max,reset,kind:kind||'pips'}); };
  // Spell slots
  let slots=[];
  if(/wizard|cleric|druid|bard|sorcerer/.test(cls)) slots=FULL_SLOTS[L]||[];
  else if(/paladin|ranger/.test(cls)) slots=HALF_SLOTS[L]||[];
  slots.forEach((n,i)=>add('slot'+(i+1),`Level ${i+1} slots`,n,'long'));
  if(/warlock/.test(cls)){
    const n=L>=17?4:L>=11?3:L>=2?2:1, lvl=Math.min(5,Math.ceil(L/2));
    add('pact',`Pact slots (level ${lvl})`,n,'short');
  }
  // Class features
  if(/barbarian/.test(cls)) add('rage','Rage',L>=17?6:L>=12?5:L>=6?4:L>=3?3:2,'long');
  if(/paladin/.test(cls)){
    add('loh','Lay on Hands pool',5*L,'long','pool');
    add('dsense','Divine Sense',Math.max(1,1+abilMod(st[5])),'long');
    if(L>=3) add('cdiv','Channel Divinity',L>=18?3:L>=6?2:1,'short');
  }
  if(/cleric/.test(cls) && L>=2) add('cdiv','Channel Divinity',L>=18?3:L>=6?2:1,'short');
  if(/druid/.test(cls)){
    if(L>=2) add('wild','Wild Shape',2,'short');
    if(L>=2 && /land/.test(sub)) add('natrec','Natural Recovery',1,'long');
  }
  if(/fighter/.test(cls)){ add('2wind','Second Wind',1,'short'); if(L>=2) add('surge','Action Surge',L>=17?2:1,'short'); }
  if(/monk/.test(cls) && L>=2) add('ki','Ki points',L,'short','pool');
  if(/sorcerer/.test(cls) && L>=2) add('sorc','Sorcery points',L,'long','pool');
  if(/bard/.test(cls)) add('binsp','Bardic Inspiration',Math.max(1,abilMod(st[5])),L>=5?'short':'long');
  if(/wizard/.test(cls)) add('arcrec','Arcane Recovery',1,'long');
  // Features written on the sheet with their own limits
  const skip=/rage|lay on hands|divine sense|wild shape|natural recovery|channel divinity|spellcasting|personality|rock gnome|background/i;
  [...(ch.class_features||[]),...(ch.traits||[]),...(ch.spellcasting||[])].forEach(f=>{
    const name=(f.name||'').trim(), desc=f.desc||'';
    if(!name || skip.test(name)) return;
    const label=name.replace(/\s*\(.*?\)\s*/g,' ').replace(/^(Combat Ability|Rune):\s*/i,'').trim();
    const key='f_'+label.toLowerCase().replace(/[^a-z0-9]+/g,'_');
    if(/once per combat/i.test(desc)) add(key,label,1,'combat');
    else if(/proficiency bonus/i.test(desc) && /(uses?|times?|number of times)/i.test(desc)) add(key,/stone throw/i.test(desc)?'Stone Throw':label,PB,'long');
    else if(/once per (a )?short or long rest|once per short\/long rest|until you finish a short or long rest/i.test(desc)) add(key,label,1,'short');
    else if(/once per (a )?long rest|once per long rest/i.test(desc)) add(key,label,1,'long');
  });
  return t;
}
function pcS(short){
  if(!pcState[short]) pcState[short]={used:{},exhaustion:0,inspiration:0};
  if(window.PartyBridge){
    const B=window.PartyBridge, st=pcState[short];
    if(!st.__proxy){
      st.__proxy=new Proxy({},{
        get(_,k){ if(typeof k!=='string') return undefined; return B.used(short,k); },
        set(_,k,v){ B.setUsed(short,k,v); return true; }
      });
    }
    return {get used(){ return st.__proxy; }, get exhaustion(){ return st.exhaustion||0; }, set exhaustion(v){ st.exhaustion=v; }, get inspiration(){ return st.inspiration||0; }, set inspiration(v){ st.inspiration=v; }};
  }
  if(!pcState[short].used) pcState[short].used={};
  return pcState[short];
}
function trackerLeft(short,tr){ const u=pcS(short).used[tr.key]||0; return Math.max(0,tr.max-u); }
function useTracker(short,key,delta,max){
  const s=pcS(short); s.used[key]=Math.max(0,Math.min(max,(s.used[key]||0)+delta));
}
function restPC(short,kind){
  const ch=charByShort(short); if(!ch) return;
  if(window.PartyBridge){
    window.PartyBridge.rest(short,kind);
    if(kind==='long'){ const s0=pcState[short]||(pcState[short]={used:{},exhaustion:0,inspiration:0}); s0.exhaustion=Math.max(0,(s0.exhaustion||0)-1); const cb0=combatants.find(x=>x.type==='pc'&&x.name===short); if(cb0){ cb0.hp=cb0.hpMax; cb0.death=null; } }
    return;
  }
  const s=pcS(short);
  pcTrackers(ch).forEach(tr=>{
    if(kind==='long' || tr.reset==='short' || tr.reset==='combat') s.used[tr.key]=0;
  });
  if(kind==='long'){
    s.exhaustion=Math.max(0,(s.exhaustion||0)-1);
    const cb=combatants.find(x=>x.type==='pc'&&x.name===short);
    if(cb){ cb.hp=cb.hpMax; cb.death=null; }
  }
}
function partyRest(kind){
  if(!loadedChars.length){ alert('Load the character sheets first.'); return; }
  if(!confirm(kind==='long'?'Long rest for the whole party? Resets all trackers, restores HP in the tracker and removes one level of exhaustion.':'Short rest for the whole party? Resets short-rest trackers such as pact slots, Channel Divinity and Wild Shape.')) return;
  loadedChars.forEach(ch=>restPC(pcShortName(ch),kind));
  renderInitList(); refreshCombatPanel();
  if(document.getElementById('tab-run').classList.contains('active')) renderRunMode();
  flashStatus(kind==='long'?'✓ Long rest taken':'✓ Short rest taken');
}
let _toastT;
function toast(msg,label,fn){
  const root=document.getElementById('tome'); if(!root) return;
  let t=document.getElementById('tome-toast');
  if(!t){ t=document.createElement('div'); t.id='tome-toast'; t.setAttribute('role','status'); root.appendChild(t); }
  t.innerHTML=''; const sp=document.createElement('span'); sp.textContent='✓ '+msg; t.appendChild(sp);
  if(label&&fn){ const b=document.createElement('button'); b.textContent=label; b.addEventListener('click',()=>{ t.classList.remove('on'); fn(); }); t.appendChild(b); }
  t.classList.add('on'); clearTimeout(_toastT); _toastT=setTimeout(()=>t.classList.remove('on'),4500);
}
function flashStatus(msg){
  const s=document.getElementById('sst'); if(!s) return;
  s.textContent=msg; s.classList.add('vis'); setTimeout(()=>{s.classList.remove('vis');s.textContent='✓ Saved';},2200);
}
// Combat-long abilities come back when a fight is reset
const _resetCombatOrig=resetCombat;
resetCombat=function(){
  const had=combatants.length;
  _resetCombatOrig();
  if(had && !combatants.length){
    loadedChars.forEach(ch=>{ const short=pcShortName(ch); pcTrackers(ch).filter(t=>t.reset==='combat').forEach(t=>{ pcS(short).used[t.key]=0; }); });
    document.getElementById('combat-alerts').innerHTML=''; closeCombatPanel();
  }
};

// ══════════════════════════════════════════════════════
//  INITIATIVE NAME CELL
// ══════════════════════════════════════════════════════
function buildInitName(c){
  const div=document.createElement('div'); div.className='init-name';
  const btn=document.createElement('button'); btn.className='init-name-btn'; btn.textContent=c.name;
  btn.title=c.type==='pc'?'Show HP, death saves and resources':'Show stat block';
  btn.addEventListener('click',e=>{ e.stopPropagation(); openCombatPanel({kind:'combatant',idx:c.origIdx}); });
  div.appendChild(btn);
  const tags=document.createElement('span'); tags.className='init-tags';
  if(c.conc) tags.innerHTML+=`<span class="init-tag conc" title="Concentrating">◎ ${escH(c.concSpell||'Concentrating')}</span>`;
  if(c.type==='pc'&&c.hp<=0&&c.death){
    const d=c.death;
    tags.innerHTML+= d.dead?'<span class="init-tag down">Dead</span>':d.stable?'<span class="init-tag stable">Stable</span>':`<span class="init-tag down">Down: ${d.s}✓ ${d.f}✗</span>`;
  }
  if(c.type==='pc'){ const ex=(pcState[c.name]||{}).exhaustion||0; if(ex) tags.innerHTML+=`<span class="init-tag">Exhaustion ${ex}</span>`; }
  if(tags.innerHTML) div.appendChild(tags);
  { const af=aliasField(c); if(af) div.appendChild(af); }
  return div;
}

// ══════════════════════════════════════════════════════
//  DAMAGE, CONCENTRATION AND DEATH SAVES
// ══════════════════════════════════════════════════════
function combatAlert(html,buttons){
  const wrap=document.getElementById('combat-alerts'); if(!wrap) return;
  const a=document.createElement('div'); a.className='combat-alert';
  a.innerHTML=`<div class="ca-text">${html}</div>`;
  const bs=document.createElement('div'); bs.className='ca-btns';
  (buttons||[{label:'OK'}]).forEach(b=>{
    const bt=document.createElement('button'); bt.className=b.primary?'btnp':'btns'; bt.textContent=b.label;
    bt.addEventListener('click',()=>{ if(b.fn) b.fn(); a.remove(); });
    bs.appendChild(bt);
  });
  a.appendChild(bs); wrap.prepend(a);
  while(wrap.children.length>4) wrap.removeChild(wrap.lastChild);
}
function onHPChange(idx,before){
  const c=combatants[idx]; if(!c) return;
  const after=c.hp, dmg=before-after;
  if(dmg>0){
    if(c.type==='pc'){
      if(before<=0){
        c.death=c.death||{s:0,f:0};
        if(!c.death.dead){ c.death.stable=false; c.death.f=Math.min(3,c.death.f+1); if(c.death.f>=3) c.death.dead=true;
          combatAlert(`<strong>${escH(c.name)}</strong> took damage while down. That counts as a failed death save (a critical hit counts as two).`); }
      } else if(after<=0){
        c.death={s:0,f:0};
        combatAlert(`<strong>${escH(c.name)}</strong> is down. They make a death save at the start of each of their turns.`);
      }
    }
    if(c.conc){
      if(after<=0){ const sp=c.concSpell; c.conc=false; c.concSpell='';
        combatAlert(`<strong>${escH(c.name)}</strong> dropped to 0 HP and lost concentration${sp?' on '+escH(sp):''}.`);
      } else {
        const dc=Math.max(10,Math.floor(dmg/2));
        combatAlert(`<strong>${escH(c.name)}</strong> is concentrating${c.concSpell?' on <em>'+escH(c.concSpell)+'</em>':''} and took ${dmg} damage. <strong>Con save DC ${dc}.</strong>`,
          [{label:'Kept it',primary:true},{label:'Lost it',fn:()=>{ c.conc=false; c.concSpell=''; renderInitList(); refreshCombatPanel(); }}]);
      }
    }
  } else if(dmg<0 && before<=0 && after>0 && c.type==='pc'){ c.death=null; }
  renderInitList(); refreshCombatPanel();
}
updateHP=function(idx,val){
  const before=combatants[idx].hp;
  combatants[idx].hp=Math.max(0,parseInt(val)||0);
  onHPChange(idx,before);
};
applyDmg=function(){
  const idx=parseInt(document.getElementById('dmg-target').value);
  const amt=parseInt(document.getElementById('dmg-amount').value)||0;
  if(isNaN(idx)||!combatants[idx]) return;
  const c=combatants[idx];
  if(c.isGroup){ applyGroupDamage(idx,amt); return; }
  const before=c.hp; c.hp=Math.max(0,c.hp-amt); onHPChange(idx,before);
};
applyHeal=function(){
  const idx=parseInt(document.getElementById('dmg-target').value);
  const amt=parseInt(document.getElementById('dmg-amount').value)||0;
  if(isNaN(idx)||!combatants[idx]) return;
  const c=combatants[idx], before=c.hp;
  c.hp=Math.min(c.hpMax||c.hp+amt,c.hp+amt); onHPChange(idx,before);
};
killCombatant=(function(orig){ return function(idx){
  const c=combatants[idx];
  if(c && !c.isGroup){ const before=c.hp; c.hp=0; onHPChange(idx,before); return; }
  orig(idx);
};})(killCombatant);

function rollDeathSave(idx){
  const c=combatants[idx]; if(!c||!c.death) return;
  const r=Math.floor(Math.random()*20)+1, d=c.death;
  let msg;
  if(r===20){ c.hp=1; c.death=null; msg=`rolled a natural 20 and is back up with 1 HP!`; }
  else if(r===1){ d.f=Math.min(3,d.f+2); msg=`rolled a natural 1. Two failures.`; }
  else if(r>=10){ d.s=Math.min(3,d.s+1); msg=`rolled ${r}. Success.`; }
  else { d.f=Math.min(3,d.f+1); msg=`rolled ${r}. Failure.`; }
  if(c.death){ if(d.s>=3){ d.stable=true; msg+=' They are stable.'; } if(d.f>=3){ d.dead=true; msg+=' They have died.'; } }
  combatAlert(`<strong>${escH(c.name)}</strong> ${msg}`);
  renderInitList(); refreshCombatPanel();
}
function setDeathMark(idx,type,n){
  const c=combatants[idx]; if(!c) return; c.death=c.death||{s:0,f:0};
  c.death[type]=c.death[type]===n?n-1:n;
  c.death.stable=c.death.s>=3; c.death.dead=c.death.f>=3;
  renderInitList(); refreshCombatPanel();
}
// Remind about death saves when a downed PC's turn comes up
nextTurn=(function(orig){ return function(){
  orig();
  const c=combatants[currentTurn];
  if(c && c.type==='pc' && c.hp<=0 && c.death && !c.death.stable && !c.death.dead){
    combatAlert(`It's <strong>${escH(c.name)}</strong>'s turn and they're down. Roll a death save.`,
      [{label:'Roll death save',primary:true,fn:()=>rollDeathSave(currentTurn)},{label:'They rolled it'}]);
  }
};})(nextTurn);

// ══════════════════════════════════════════════════════
//  COMBAT DETAIL PANEL
// ══════════════════════════════════════════════════════
let panelTarget=null;
function findMonsterData(name){
  const base=String(name||'').replace(/\s*\(\d+\)\s*$/,'').replace(/\s+\d+\s*$/,'').trim().toLowerCase();
  return MONSTERS.find(m=>m.name.toLowerCase()===base) || MONSTERS.find(m=>base.startsWith(m.name.toLowerCase())) || null;
}
function prepNotesFor(name){
  const base=String(name||'').replace(/\s*\(\d+\)\s*$/,'').replace(/\s+\d+\s*$/,'').trim().toLowerCase();
  return readList('mon-list').find(m=>(m['mn-name']||'').toLowerCase()===base);
}
function splitTop(s){
  const out=[]; let depth=0, cur='';
  for(const ch of String(s||'')){
    if(ch==='(') depth++; if(ch===')') depth=Math.max(0,depth-1);
    if(ch===',' && depth===0){ if(cur.trim()) out.push(cur.trim()); cur=''; } else cur+=ch;
  }
  if(cur.trim()) out.push(cur.trim()); return out;
}
function statLine(item){
  const m=item.match(/^([^(+]+?)(\s*[+(].*)?$/);
  return m?`<strong>${escH(m[1].trim())}</strong>${escH(m[2]||'')}`:escH(item);
}
function statBlockHTML(m){
  const ab=['str','dex','con','int','wis','cha'];
  const sign=n=>(n>=0?'+':'')+n;
  const list=(label,val)=>val?`<div class="sb-row"><span class="sb-lbl">${label}</span> ${escH(val)}</div>`:'';
  const acts=(label,val)=>val?`<div class="sb-sec">${label}</div>${splitTop(val).map(a=>`<div class="sb-act">${statLine(a)}</div>`).join('')}`:'';
  return `<div class="sb-type">${escH(m.type||'')}${m.cr?`, CR ${escH(m.cr)}`:''}</div>
    ${list('Speed',m.speed)}
    <div class="sb-abil">${ab.map(k=>`<div><span>${k.toUpperCase()}</span>${m[k]||10} (${sign(abilMod(m[k]))})</div>`).join('')}</div>
    ${list('Saves',m.saves)}${list('Skills',m.skills)}${list('Senses',m.senses)}
    ${acts('Traits',m.traits)}${acts('Actions',m.actions)}${acts('Reactions',m.reactions)}${acts('Legendary actions',m.legendary)}`;
}
function openCombatPanel(target){ panelTarget=target; refreshCombatPanel(true); }
function closeCombatPanel(){ panelTarget=null; const p=document.getElementById('combat-panel'); if(p) p.classList.remove('open'); }
function refreshCombatPanel(force){
  const panel=document.getElementById('combat-panel'), body=document.getElementById('combat-panel-body');
  if(!panel||!panelTarget) return;
  if(!force && !panel.classList.contains('open')) return;
  let c=null, short=null;
  if(panelTarget.kind==='combatant'){ c=combatants[panelTarget.idx]; if(!c){ closeCombatPanel(); return; } if(c.type==='pc') short=c.name; }
  else short=panelTarget.name;
  const ch=short?(charByShort(short)||loadedChars.find(x=>x.name===short)):null;
  let html='';
  if(ch || (c && c.type==='pc')) html=pcPanelHTML(c,ch,short||c.name);
  else html=monsterPanelHTML(c);
  body.innerHTML=html;
  wirePanel(body,c,short||(c&&c.name));
  panel.classList.add('open');
  if(typeof wrapSpellsInElement==='function') wrapSpellsInElement(body);
}
function concBlockHTML(c,spellList){
  if(!c) return '';
  return `<div class="cp-sec">Concentration</div>
    <div class="cp-conc">
      <label class="cp-check"><input type="checkbox" data-p="conc" ${c.conc?'checked':''}> Concentrating</label>
      <input type="text" data-p="concSpell" list="cp-spells" placeholder="Spell name" value="${escH(c.concSpell||'')}">
      <datalist id="cp-spells">${(spellList||[]).map(s=>`<option value="${escH(s)}">`).join('')}</datalist>
    </div>`;
}
function monsterPanelHTML(c){
  const m=findMonsterData(c.name), notes=prepNotesFor(c.name);
  const hp=c.isGroup?`${(c.members||[]).filter(x=>!x.dead).length} of ${(c.members||[]).length} standing`:`HP ${c.hp}/${c.hpMax}`;
  let html=`<h3 class="cp-name">${escH(c.name)}</h3><div class="cp-quick">AC ${escH(c.ac)}, ${hp}</div>`;
  if(notes && (notes['mn-mot']||notes['mn-tac']||notes['mn-notes'])){
    html+=`<div class="cp-notes">${notes['mn-mot']?`<div><em>Wants:</em> ${escH(notes['mn-mot'])}</div>`:''}${notes['mn-tac']?`<div><em>Tactics:</em> ${escH(notes['mn-tac'])}</div>`:''}${notes['mn-notes']?`<div>${escH(notes['mn-notes'])}</div>`:''}</div>`;
  }
  html+= m?statBlockHTML(m):c.custom?customBlockHTML(c.custom):`<p class="run-empty">No stat block found for "${escH(c.name)}". Monsters added from the Monster DB, or named exactly as they appear there, show their full stats here.</p>`;
  if(!c.isGroup) html+=concBlockHTML(c,[]);
  return html;
}
function pcPanelHTML(c,ch,short){
  const s=pcS(short);
  let html=`<h3 class="cp-name">${escH(short)}</h3>`;
  if(ch) html+=`<div class="cp-quick">${escH([ch.race,ch.class,ch.level?'level '+ch.level:''].filter(Boolean).join(' '))}${ch.player?', played by '+escH(ch.player):''}</div>`;
  if(c){
    html+=`<div class="cp-quick">AC ${escH(c.ac)}, HP ${c.hp}/${c.hpMax}</div>`;
    if(c.hp<=0){
      const d=c.death||{s:0,f:0};
      const pip=(type,n,on)=>`<button class="ds-pip ${type}${on?' on':''}" data-ds="${type}" data-n="${n}" aria-label="${type==='s'?'Success':'Failure'} ${n}"></button>`;
      html+=`<div class="cp-sec">Death saves</div>
        <div class="cp-death">
          <div><span class="ds-lbl">Successes</span>${[1,2,3].map(n=>pip('s',n,d.s>=n)).join('')}</div>
          <div><span class="ds-lbl">Failures</span>${[1,2,3].map(n=>pip('f',n,d.f>=n)).join('')}</div>
          <div class="ds-state">${d.dead?'Dead.':d.stable?'Stable. Unconscious but no longer rolling.':'Roll at the start of each of their turns. 10 or higher succeeds.'}</div>
          ${d.dead||d.stable?'':'<button class="btnp" data-p="rollds">Roll death save</button>'}
        </div>`;
    }
    html+=concBlockHTML(c,ch&&Array.isArray(ch.spells)?ch.spells.map(x=>String(x).replace(/\s*\(.*$/,'')):[]);
  } else {
    html+=`<p class="run-empty">Not in the initiative tracker. HP is tracked there during combat.</p>`;
  }
  if(ch){
    const trs=pcTrackers(ch);
    html+=`<div class="cp-sec">Resources</div>`;
    if(!trs.length) html+=`<p class="run-empty">No limited-use resources found on this sheet.</p>`;
    trs.forEach(tr=>{
      const left=trackerLeft(short,tr);
      const resetTxt=tr.reset==='combat'?'per fight':tr.reset==='short'?'short rest':'long rest';
      if(tr.kind==='pool'){
        html+=`<div class="cp-res"><div class="cp-res-top"><span>${escH(tr.label)}</span><span class="cp-reset">${resetTxt}</span></div>
          <div class="cp-pool"><strong>${left}</strong> of ${tr.max} left
            <input type="number" min="1" data-pool-amt="${tr.key}" placeholder="amt">
            <button class="abtn" data-pool-spend="${tr.key}" data-max="${tr.max}">Spend</button>
            <button class="abtn" data-pool-reset="${tr.key}">Refill</button></div></div>`;
      } else {
        html+=`<div class="cp-res"><div class="cp-res-top"><span>${escH(tr.label)}</span><span class="cp-reset">${resetTxt}</span></div>
          <div class="cp-pips">${Array.from({length:tr.max},(_,i)=>`<button class="res-pip${i<left?' on':''}" data-tr="${tr.key}" data-i="${i}" data-max="${tr.max}" aria-label="${escH(tr.label)} ${i+1}"></button>`).join('')}<span class="cp-left">${left} left</span></div></div>`;
      }
    });
    html+=`<div class="cp-res"><div class="cp-res-top"><span>Exhaustion</span></div>
      <div class="cp-pips">${[1,2,3,4,5,6].map(n=>`<button class="res-pip ex${(s.exhaustion||0)>=n?' on':''}" data-ex="${n}" aria-label="Exhaustion ${n}"></button>`).join('')}<span class="cp-left">${EXH_TEXT[s.exhaustion||0]}</span></div></div>`;
    html+=`<div class="cp-rest"><button class="abtn" data-rest="short">Short rest</button><button class="abtn" data-rest="long">Long rest</button></div>`;
  }
  return html;
}
const EXH_TEXT=['None','Disadvantage on ability checks','Speed halved','Disadvantage on attacks and saves','HP maximum halved','Speed 0','Death'];
function wirePanel(body,c,short){
  const idx=c?combatants.indexOf(c):-1;
  body.querySelectorAll('[data-p="conc"]').forEach(cb=>cb.addEventListener('change',()=>{ c.conc=cb.checked; if(!cb.checked) c.concSpell=''; renderInitList(); refreshCombatPanel(); }));
  body.querySelectorAll('[data-p="concSpell"]').forEach(inp=>inp.addEventListener('change',()=>{ c.concSpell=inp.value.trim(); if(c.concSpell) c.conc=true; renderInitList(); refreshCombatPanel(); }));
  body.querySelectorAll('[data-p="rollds"]').forEach(b=>b.addEventListener('click',()=>rollDeathSave(idx)));
  body.querySelectorAll('[data-ds]').forEach(b=>b.addEventListener('click',()=>setDeathMark(idx,b.dataset.ds,parseInt(b.dataset.n))));
  body.querySelectorAll('[data-tr]').forEach(b=>b.addEventListener('click',()=>{
    const max=parseInt(b.dataset.max), i=parseInt(b.dataset.i), s=pcS(short);
    const left=max-(s.used[b.dataset.tr]||0);
    // clicking a filled pip spends down to it; clicking an empty one restores up to it
    s.used[b.dataset.tr]= i<left ? Math.min(max,(s.used[b.dataset.tr]||0)+1) : Math.max(0,(s.used[b.dataset.tr]||0)-1);
    refreshCombatPanel(); refreshRunPartyIfOpen();
  }));
  body.querySelectorAll('[data-pool-spend]').forEach(b=>b.addEventListener('click',()=>{
    const key=b.dataset.poolSpend, amt=parseInt(body.querySelector(`[data-pool-amt="${key}"]`).value)||0;
    if(amt>0){ useTracker(short,key,amt,parseInt(b.dataset.max)); refreshCombatPanel(); refreshRunPartyIfOpen(); }
  }));
  body.querySelectorAll('[data-pool-reset]').forEach(b=>b.addEventListener('click',()=>{ pcS(short).used[b.dataset.poolReset]=0; refreshCombatPanel(); refreshRunPartyIfOpen(); }));
  body.querySelectorAll('[data-ex]').forEach(b=>b.addEventListener('click',()=>{
    const n=parseInt(b.dataset.ex), s=pcS(short); s.exhaustion=(s.exhaustion===n)?n-1:n; renderInitList(); refreshCombatPanel(); refreshRunPartyIfOpen();
  }));
  body.querySelectorAll('[data-rest]').forEach(b=>b.addEventListener('click',()=>{ restPC(short,b.dataset.rest); renderInitList(); refreshCombatPanel(); refreshRunPartyIfOpen(); flashStatus(b.dataset.rest==='long'?'✓ Long rest taken':'✓ Short rest taken'); }));
}
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeCombatPanel(); closeNextSession(); } });

// ══════════════════════════════════════════════════════
//  RUN MODE: PARTY BLOCK
// ══════════════════════════════════════════════════════
function renderRunParty(){
  const wrap=document.getElementById('run-party'); if(!wrap) return;
  if(!loadedChars.length){ wrap.innerHTML=runEmpty('Load character sheets to track HP and resources.','s1'); return; }
  wrap.innerHTML='';
  loadedChars.forEach(ch=>{
    const short=pcShortName(ch);
    const cb=combatants.find(x=>x.type==='pc'&&x.name===short);
    const hpMax=ch.hp_max||ch.hp||0, hp=cb?cb.hp:(ch.hp_current!==undefined?ch.hp_current:hpMax);
    const trs=pcTrackers(ch);
    const summary=trs.filter(t=>t.kind!=='pool'||true).slice(0,4).map(t=>`${escH(t.label.replace(/ slots$/,''))} ${trackerLeft(short,t)}/${t.max}`).join(', ');
    const row=document.createElement('button'); row.className='run-party-row';
    row.innerHTML=`<span class="run-item-name">${escH(short)}</span><span class="run-tag${hp<=0?' is-hot':''}">HP ${hp}/${hpMax}${cb&&cb.conc?' ◎':''}</span>
      <span class="run-small">${summary||'No tracked resources'}${(pcState[short]||{}).exhaustion?`, exhaustion ${pcState[short].exhaustion}`:''}</span>`;
    row.addEventListener('click',()=>openCombatPanel(cb?{kind:'combatant',idx:combatants.indexOf(cb)}:{kind:'pc',name:short}));
    wrap.appendChild(row);
  });
}
function refreshRunPartyIfOpen(){ const p=document.getElementById('tab-run'); if(p&&p.classList.contains('active')) renderRunParty(); }
renderRunMode=(function(orig){ return function(){ orig(); renderRunParty(); }; })(renderRunMode);

// ══════════════════════════════════════════════════════
//  START NEXT SESSION
// ══════════════════════════════════════════════════════
function nextSessionName(cur){
  cur=String(cur||'').trim();
  const m=cur.match(/^(.*?)(\d+)(\D*)$/);
  return m?m[1]+(parseInt(m[2])+1)+m[3]:(cur?cur+' (next)':'Session 1');
}
function undiscoveredSecrets(){
  const used=fieldVal('secrets-used').toLowerCase();
  return readList('secrets-list').map(s=>s.sec).filter(Boolean).filter(t=>!revealedSecrets.includes(t) && !used.includes(t.slice(0,25).toLowerCase()));
}
function openConsequences(){
  return readList('conseq-list').filter(q=>!isBlankRow(q)).filter(q=>!/^\s*(yes|resolved|done)/i.test(q['cq-resolved']||''));
}
function openNextSession(){
  const cur=fieldVal('session-num');
  document.getElementById('ns-num').value=nextSessionName(cur);
  document.getElementById('ns-date').value='';
  const secs=undiscoveredSecrets(), cons=openConsequences();
  const npcs=readList('npc-list').filter(n=>n['np-name']).length, locs=readList('loc-list').filter(l=>l['lo-name']).length;
  const mons=readList('mon-list').filter(m=>m['mn-name']).length, tr=readList('treas-list').filter(t=>t['tr-name']).length;
  const opt=(id,label,count,on,hint)=>`<label class="ns-opt"><input type="checkbox" id="${id}" ${on?'checked':''} ${count===0?'disabled':''}>
    <span><strong>${label}</strong>${count!==null?` <span class="ns-count">(${count})</span>`:''}${hint?`<br><span class="ns-hint">${hint}</span>`:''}</span></label>`;
  const hasNotes=!!(fieldVal('summary')||fieldVal('loose-threads')||fieldVal('next-prep'));
  document.getElementById('ns-options').innerHTML=
    opt('ns-secrets','Undiscovered secrets',secs.length,true,'Secrets the players haven\'t learned yet go into Step 4.')+
    opt('ns-notes','Session notes',hasNotes?null:0,hasNotes,'The recap goes on the Strong Start tab. Loose threads and first prep are added to Open Threads.')+
    opt('ns-cons','Unresolved consequences',cons.length,true,'')+
    opt('ns-npcs','NPCs',npcs,true,'Recurring characters the party may meet again.')+
    opt('ns-locs','Locations',locs,false,'')+
    opt('ns-mons','Monsters',mons,false,'')+
    opt('ns-treas','Treasure',tr,false,'Keep this if the party didn\'t find it yet.')+
    opt('ns-rest','Party takes a long rest',null,true,'Resets spell slots and abilities, and removes one level of exhaustion.');
  document.getElementById('next-session-modal').classList.add('open');
}
function closeNextSession(){ const m=document.getElementById('next-session-modal'); if(m) m.classList.remove('open'); }
function startNextSession(doExport){
  const on=id=>{ const el=document.getElementById(id); return el&&el.checked&&!el.disabled; };
  const old=collectData();
  const oldName=old['session-num']||'last session';
  if(doExport) exportSession();
  const strip=rows=>rows.map(r=>{ const o={}; Object.keys(r).forEach(k=>{ if(!k.startsWith('_')) o[k]=r[k]; }); return o; });
  const d={};
  ['campaign-name','party-level','world-truths','camp-notes'].forEach(k=>d[k]=old[k]||'');
  const lv=sheetLevels(); if(lv.length) d['party-level']=String(benchNumbers(lv.map(x=>x.level)).lvl);
  d['session-num']=document.getElementById('ns-num').value.trim()||nextSessionName(oldName);
  d['session-date']=document.getElementById('ns-date').value.trim();
  ['strong-start','adv-hook','scene-hook','enc-bench','summary','worked-well','improve','loose-threads','secrets-used','next-prep','prev-recap'].forEach(k=>d[k]='');
  if(on('ns-notes')){
    d['prev-recap']=old['summary']||'';
    const extra=[old['loose-threads']?`Loose threads: ${old['loose-threads']}`:'',old['next-prep']?`First prep: ${old['next-prep']}`:''].filter(Boolean).join('\n');
    if(extra) d['camp-notes']=(d['camp-notes']?d['camp-notes'].trimEnd()+'\n\n':'')+`After ${oldName}:\n`+extra;
  }
  d['hook-list']=[]; d['scenes-list']=[]; d['forks-list']=[];
  d['secrets-list']=on('ns-secrets')?undiscoveredSecrets().map(s=>({sec:s})):[];
  d['loc-list']=on('ns-locs')?old['loc-list']:[];
  d['npc-list']=on('ns-npcs')?old['npc-list']:[];
  d['mon-list']=on('ns-mons')?old['mon-list']:[];
  d['treas-list']=on('ns-treas')?old['treas-list']:[];
  d['faction-list']=old['faction-list']||[];
  d['conseq-list']=on('ns-cons')?strip(openConsequences()):[];
  d['enc-list-html']=''; d.encN=0;
  d['char-hooks']={}; d['revealed-secrets']=[];
  d['pc-state']=old['pc-state']||{};
  const encList=document.getElementById('enc-list'); if(encList) encList.innerHTML='';
  encN=0;
  applyData(d);
  if(on('ns-rest')) loadedChars.forEach(ch=>restPC(pcShortName(ch),'long'));
  saveAll();
  closeNextSession();
  goTab('s1');
  flashStatus(`✓ ${d['session-num']} started`);
}


// ══════════════════════════════════════════════════════
//  QUICK MONSTER BUILDER
//  Formulas from the Lazy GM's 5e Monster Builder Resource Document
//  by Teos Abadía, Scott Fitzgerald Gray and Michael E. Shea (CC BY 4.0)
// ══════════════════════════════════════════════════════
const QM_CRS=['0','1/8','1/4','1/2',...Array.from({length:30},(_,i)=>String(i+1))];
const QM_TRICKS={
  none:{label:'None'},
  knockdown:{label:'Knockdown',text:s=>`When it hits with a melee attack, the target makes a DC ${s.dc} Strength save or is knocked prone.`},
  grab:{label:'Restraining grab',text:s=>`When it hits with a melee attack, the target is grappled (escape DC ${s.dc}).`},
  misty:{label:'Misty step',text:()=>`As a bonus action, it teleports up to 30 feet to a space it can see.`},
  elemental:{label:'Elemental strike',text:s=>`Its attacks deal an extra ${s.cr<5?'3 (1d6)':s.cr<=10?'7 (2d6)':s.cr<=16?'14 (4d6)':'28 (8d6)'} damage of a type that fits its story.`},
  aura:{label:'Damage aura',text:s=>`Enemies that start their turn within 10 feet take ${s.cr<=4?'9 (2d8)':s.cr<=10?'13 (3d8)':s.cr<=16?'18 (4d8)':'27 (6d8)'} damage of a type that fits its story.`},
  blast:{label:'Damaging blast',text:s=>`Ranged attack, 60 ft: +${s.atk} to hit, ${s.dmgText} damage.`},
  reflect:{label:'Damage reflection',text:s=>`A creature that hits it with a melee attack takes ${Math.max(1,Math.floor(s.perAvg/2))} damage in return. (It makes one fewer attack.)`},
  fear:{label:'Frightening presence',text:s=>`Once per fight, enemies within 30 feet make a DC ${s.dc} Wisdom save or are frightened for 1 minute (save again at the end of each turn).`}
};
function lazyStats(crStr,trick){
  const cr=parseCR(crStr);
  let ac,atk,hp,dpr,attacks,mod;
  if(cr<1){
    const t={0:[10,2,3,1],0.125:[12,3,7,3],0.25:[12,3,11,4],0.5:[12,3,15,5]}[cr]||[12,3,15,5];
    [ac,atk,hp,dpr]=t; attacks=1; mod=1;
  } else {
    const half=Math.floor(cr/2);
    ac=cr<=16?12+half:20+Math.floor((cr-16)/3);
    atk=4+half; hp=15*cr+15; dpr=7*cr;
    attacks=cr<2?1:cr<10?2:cr<17?3:4; mod=Math.max(1,atk-2);
  }
  const dc=cr<1?(cr===0?10:12):12+Math.floor(cr/2);
  if(trick==='reflect') attacks=Math.max(1,attacks-1), dpr=Math.round(dpr*attacks/(attacks+1));
  const per=Math.max(1,Math.round(dpr/attacks));
  let dice;
  if(per-mod<=0){ dice=`${per}`; }
  else if(per-mod<=3){ dice=`1d4+${mod}`; }
  else if(per-mod<=4){ dice=`1d6+${mod}`; }
  else { const n=Math.max(1,Math.round((per-mod)/4.5)); dice=`${n}d8+${mod}`; }
  const perAvg=(()=>{ const m=dice.match(/(\d+)d(\d+)\+(\d+)/); if(!m) return per; return Math.floor(parseInt(m[1])*(parseInt(m[2])+1)/2)+parseInt(m[3]); })();
  const s={cr,crStr,ac,dc,atk,hp,dpr,attacks,perAvg,dmgText:`${perAvg} (${dice})`};
  s.trickText=trick&&QM_TRICKS[trick]&&QM_TRICKS[trick].text?QM_TRICKS[trick].text(s):'';
  s.trickLabel=trick&&trick!=='none'?QM_TRICKS[trick].label:'';
  return s;
}
function customBlockHTML(s){
  return `<div class="sb-type">Quick monster, CR ${escH(s.crStr)}</div>
    <div class="sb-row"><span class="sb-lbl">Armour Class</span> ${s.ac}. <span class="sb-lbl">Save DC</span> ${s.dc}.</div>
    <div class="sb-row"><span class="sb-lbl">Best save and skills</span> +${s.atk}. Make up the rest as you need them.</div>
    <div class="sb-sec">Actions</div>
    <div class="sb-act"><strong>${s.attacks>1?`Multiattack.`:'Attack.'}</strong> ${s.attacks>1?`${s.attacks} attacks, each `:''}+${s.atk} to hit, ${escH(s.dmgText)} damage.</div>
    ${s.trickText?`<div class="sb-sec">${escH(s.trickLabel)}</div><div class="sb-act">${escH(s.trickText)}</div>`:''}`;
}
function renderQuickMonster(id){
  const box=document.getElementById(id); if(!box || box.dataset.ready) return;
  box.dataset.ready='1';
  box.innerHTML=`
    <div class="qm-title">Quick monster from a CR</div>
    <div class="qm-inputs">
      <div><label for="${id}-name">Name</label><input type="text" id="${id}-name" placeholder="Knight of Alvar"></div>
      <div><label for="${id}-cr">CR</label><select id="${id}-cr">${QM_CRS.map(x=>`<option${x==='3'?' selected':''}>${x}</option>`).join('')}</select></div>
      <div><label for="${id}-n">Count</label><input type="number" id="${id}-n" value="1" min="1" max="20"></div>
      <div><label for="${id}-trick">Trick</label><select id="${id}-trick">${Object.entries(QM_TRICKS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}<option value="random">Random</option></select></div>
    </div>
    <div class="qm-out" id="${id}-out"></div>
    <div class="qm-btns">
      <button class="abtn qm-add" data-qm="init">Add to initiative</button>
      <button class="abtn" data-qm="roll">Roll and add</button>
      <button class="abtn" data-qm="s7">Add to Step 7</button>
    </div>
    <div class="qm-credit">Formulas from the Lazy GM's 5e Monster Builder Resource Document (CC BY 4.0).</div>`;
  const get=()=>{
    let trick=box.querySelector(`#${id}-trick`).value;
    if(trick==='random'){ const keys=Object.keys(QM_TRICKS).filter(k=>k!=='none'); trick=box.dataset.rt||(box.dataset.rt=pick(keys)); }
    else delete box.dataset.rt;
    return {name:box.querySelector(`#${id}-name`).value.trim()||'Quick monster',
      crStr:box.querySelector(`#${id}-cr`).value, n:Math.max(1,parseInt(box.querySelector(`#${id}-n`).value)||1), trick};
  };
  const update=()=>{
    const g=get(), s=lazyStats(g.crStr,g.trick), b=currentBench();
    const warn=s.cr>b.singleMax?` <span class="bench-warn">Above the single-monster limit of CR ${b.singleMax}.</span>`:'';
    box.querySelector(`#${id}-out`).innerHTML=`<strong>AC ${s.ac}, HP ${s.hp}</strong>, attack +${s.atk}, save DC ${s.dc}.
      ${s.attacks>1?s.attacks+' attacks':'1 attack'} of ${escH(s.dmgText)} damage.${s.trickText?`<br><em>${escH(s.trickLabel)}:</em> ${escH(s.trickText)}`:''}${warn}`;
  };
  box.addEventListener('input',e=>{ if(e.target.id===`${id}-trick`) delete box.dataset.rt; update(); });
  box.addEventListener('change',e=>{ if(e.target.id===`${id}-trick`) delete box.dataset.rt; update(); });
  box.querySelectorAll('[data-qm]').forEach(btn=>btn.addEventListener('click',()=>{
    const g=get(), s=lazyStats(g.crStr,g.trick), act=btn.dataset.qm;
    if(act==='s7'){
      addMon();
      const card=document.getElementById('mon-list').lastElementChild;
      const set=(k,v)=>{ const el=card.querySelector(`[data-key="${k}"]`); if(el) el.value=v; };
      set('mn-name',g.name); set('mn-cr',g.crStr); set('mn-hp',s.hp); set('mn-ac',s.ac); set('mn-n',g.n);
      set('mn-tac',`${s.attacks>1?s.attacks+' attacks':'1 attack'}, +${s.atk} to hit, ${s.dmgText} each. Save DC ${s.dc}.`);
      if(s.trickText) set('mn-notes',`${s.trickLabel}: ${s.trickText}`);
      renderEncTester(); flashStatus(`✓ ${g.name} added to Step 7`);
      return;
    }
    const roll=act==='roll'?Math.floor(Math.random()*20)+1:0;
    const custom={...s};
    if(g.n>1){
      let gname=g.name, k=2; while(combatants.find(x=>x.name===gname&&x.isGroup)) gname=`${g.name} (${k++})`;
      combatants.push({name:gname,type:'monster',initiative:roll,hp:s.hp,hpMax:s.hp,ac:s.ac,dex:10,conditions:[],isGroup:true,count:g.n,expanded:false,custom,
        members:Array.from({length:g.n},(_,i)=>({name:`${g.name} ${i+1}`,hp:s.hp,hpMax:s.hp,conditions:[],dead:false}))});
    } else {
      let nm=g.name, k=2; while(combatants.find(x=>x.name===nm)) nm=`${g.name} (${k++})`;
      combatants.push({name:nm,type:'monster',initiative:roll,hp:s.hp,hpMax:s.hp,ac:s.ac,dex:10,conditions:[],custom});
    }
    combatants.sort((a,b)=>b.initiative-a.initiative);
    renderInitList(); updateInitSelects();
    flashStatus(`✓ ${g.n>1?g.n+' × ':''}${g.name} added to initiative`);
  }));
  update();
}
function initQuickMonsters(){ ['qm-db','qm-s7','qm-run'].forEach(renderQuickMonster); }
window.addEventListener('DOMContentLoaded',()=>setTimeout(initQuickMonsters,100));

// ══════════════════════════════════════════════════════
//  IMPROV KIT
// ══════════════════════════════════════════════════════
const TAVERN_ADJ=['Gilded','Rusty','Drowned','Laughing','Crooked','Sleeping','Wandering','Salty','Burnt','Merry','Three-Legged','Hollow','Silver','Stubborn','Weeping','Lucky','One-Eyed','Copper','Howling','Muddy','Prancing','Broken','Golden','Tipsy'];
const TAVERN_NOUN=['Goose','Anchor','Dragon','Barrel','Stag','Lantern','Mule','Kettle','Crow','Boar','Hound','Candle','Wyvern','Tankard','Fox','Pike','Gnome','Oak','Badger','Pony','Toad','Owl','Cauldron','Wheel'];
const SHOP_TYPES=['apothecary','smithy','general store','bookbinder','fletcher','tailor','curio shop','herbalist','chandler','tinker','cartographer','stables','jeweller','pawnshop'];
const WEATHER=['Clear and cold, breath fogging in the air','Warm and still, insects everywhere','Light drizzle that soaks through everything by midday','A heavy thunderstorm rolling in by evening','Thick morning fog that burns off by noon','Blustering wind that snatches at cloaks and maps','Grey overcast skies with a threat of rain that never comes','Hot, bright sun with no shade on the road','Sleet turning the roads to mud','A strange green tint to the sky at sunset','First snow, light and wet','Humid and heavy, a storm building all day','Crisp autumn air and falling leaves','A red dawn. Old folk say it means blood','Hail for ten minutes, then sudden sunshine','Dead calm. Not a bird is singing'];
const TRAVEL_EVENTS=['A broken-down cart blocks the road. Its driver is nowhere to be seen.','A travelling merchant offers "rare goods" that are obviously stolen.','Fresh tracks cross the road: heavy, clawed and heading the same way as the party.','A shrine by the road has a fresh offering on it. Someone passed by within the hour.','A lost child asks the way to a village that burned down last month.','Crows circle something in a field off the road.','A patrol stops the party and asks for their names and business.','The bridge ahead is out. The ford is swollen but crossable.','A hermit offers shelter for the night in exchange for news.','A body in the ditch, robbed, but still wearing a signet ring.','Two farmers argue over a boundary stone and ask the party to judge.','A pedlar sells a map. Parts of it are wrong, one part is very right.','A wounded animal limps out of the trees, an arrow in its side with unfamiliar fletching.','A signpost has been turned to point the wrong way.','Distant smoke rises from the direction the party is heading.','A pilgrim group travels the same road and invites the party to join them.','A merchant caravan pays well for guards for the next day of travel.','The road passes an old battlefield. Rusted weapons poke out of the grass.','Someone has been following the party for an hour, keeping their distance.','A ruined tower stands on a hill nearby, with a light in its top window.'];
const RUMOURS=['Someone at {place} has been buying up all the silver in the area.','{npc} was seen talking to strangers after dark.','Travellers who take the old road at night don\'t always arrive.','A reward is being quietly offered for a missing ledger.','The well water tastes of iron lately, and the animals won\'t drink it.','There\'s a hidden cellar beneath {place} that nobody admits to.','A knight in black armour has been asking about the party by name.','The price of healing potions has doubled. Someone is buying them all.','A hunter swears he saw the trees move in the forest last week.','Goblins have been seen trading peacefully at the edge of town.','{npc} owes a great deal of money to the wrong people.','A letter arrived for someone who died three years ago.','The old temple bell rang last night. The temple has no bell.','Someone is paying children to watch the roads and count travellers.'];
function newImprovKit(){
  const names=[]; const seen=new Set();
  while(names.length<10){ const g=genName('any','any'); if(seen.has(g.name)) continue; seen.add(g.name); names.push({t:g.name,d:g.race,used:false}); }
  const places=[];
  for(let i=0;i<2;i++) places.push({t:`The ${pick(TAVERN_ADJ)} ${pick(TAVERN_NOUN)}`,d:'tavern'});
  const owner=genName('any','any').name.split(' ');
  places.push({t:`${owner[owner.length-1]}'s ${pick(SHOP_TYPES)}`,d:'shop'});
  return {names,places,weather:pick(WEATHER),travel:pick(TRAVEL_EVENTS),rumours:makeRumours()};
}
function makeRumours(){
  const npcs=readList('npc-list').map(n=>n['np-name']).filter(Boolean);
  const locs=readList('loc-list').map(l=>l['lo-name']).filter(Boolean);
  const fill=t=>t.replace('{npc}',npcs.length?pick(npcs):'the innkeeper').replace('{place}',locs.length?pick(locs):'the old mill');
  const out=pickN(RUMOURS,2).map(t=>({t:fill(t),src:'rumour'}));
  const secret=(typeof undiscoveredSecrets==='function')?undiscoveredSecrets():[];
  if(secret.length) out.unshift({t:pick(secret),src:'secret'});
  else out.push({t:fill(pick(RUMOURS)),src:'rumour'});
  return out;
}
function renderKit(){
  const wrap=document.getElementById('run-kit'); if(!wrap) return;
  if(!improvKit) improvKit=newImprovKit();
  const k=improvKit;
  const reroll=part=>`<button class="kit-reroll" data-kit-reroll="${part}" title="Roll again" aria-label="Roll ${part} again">↻</button>`;
  wrap.innerHTML=`
    <div class="kit-sec"><span class="kit-lbl">Names</span>${reroll('names')}</div>
    <div class="kit-names">${k.names.map((n,i)=>`<button class="kit-name${n.used?' used':''}" data-kit-name="${i}" title="${escH(n.d)}">${escH(n.t)}</button>`).join('')}</div>
    <div class="kit-sec"><span class="kit-lbl">Places</span>${reroll('places')}</div>
    ${k.places.map(p=>`<div class="kit-line">${escH(p.t)} <span class="run-small">${escH(p.d)}</span></div>`).join('')}
    <div class="kit-sec"><span class="kit-lbl">Weather</span>${reroll('weather')}</div>
    <div class="kit-line">${escH(k.weather)}</div>
    <div class="kit-sec"><span class="kit-lbl">On the road</span>${reroll('travel')}</div>
    <div class="kit-line">${escH(k.travel)}</div>
    <div class="kit-sec"><span class="kit-lbl">Rumours</span>${reroll('rumours')}</div>
    ${k.rumours.map(r=>`<div class="kit-line">${escH(r.t)}${r.src==='secret'?' <span class="kit-true">true, from your secrets</span>':''}</div>`).join('')}`;
  wrap.querySelectorAll('[data-kit-name]').forEach(b=>b.addEventListener('click',()=>{ const n=k.names[b.dataset.kitName]; n.used=!n.used; b.classList.toggle('used',n.used); }));
  wrap.querySelectorAll('[data-kit-reroll]').forEach(b=>b.addEventListener('click',()=>{
    const part=b.dataset.kitReroll, fresh=newImprovKit();
    if(part==='rumours') k.rumours=makeRumours(); else k[part]=fresh[part];
    renderKit();
  }));
}
renderRunMode=(function(orig){ return function(){ orig(); renderKit(); }; })(renderRunMode);

// ══════════════════════════════════════════════════════
//  ONE-PAGE PREP SHEET
// ══════════════════════════════════════════════════════
function buildPrintSheet(){
  const camp=fieldVal('campaign-name'), sess=fieldVal('session-num'), date=fieldVal('session-date');
  const b=currentBench();
  const sec=(title,body)=>body?`<section class="ps-sec"><h2>${title}</h2>${body}</section>`:'';
  const li=items=>items.length?`<ul>${items.join('')}</ul>`:'';
  const hooks=charHooks().map(h=>`<li><b>${escH(h.name)}</b>${h.text?': '+escH(h.text):': <i>no hook</i>'}</li>`);
  const secrets=readList('secrets-list').filter(s=>s.sec).map(s=>`<li class="ps-box">${escH(s.sec)}</li>`);
  const scenes=readList('scenes-list').filter(s=>s['sc-name']||s['sc-notes']).map(s=>`<li><b>${escH(s['sc-name']||'Scene')}</b>${s['sc-trig']?` <i>(${escH(s['sc-trig'])})</i>`:''}${s['sc-notes']?'. '+escH(s['sc-notes']):''}</li>`);
  const forks=readList('forks-list').filter(f=>f['fork-title']).map(f=>`<li>${escH(f['fork-title'])}${f['fork-a']?`<br><b>A:</b> ${escH(f['fork-a'])}`:''}${f['fork-b']?` <b>B:</b> ${escH(f['fork-b'])}`:''}</li>`);
  const npcs=readList('npc-list').filter(n=>n['np-name']).map(n=>`<li><b>${escH(n['np-name'])}</b>${n['np-role']?`, ${escH(n['np-role'])}`:''}${n['np-trait']?`. ${escH(n['np-trait'])}`:''}${n['np-want']?` <i>Wants:</i> ${escH(n['np-want'])}`:''}</li>`);
  const mons=readList('mon-list').filter(m=>m['mn-name']).map(m=>`<li><b>${escH(m['mn-name'])}${(parseInt(m['mn-n'])||1)>1?' ×'+escH(m['mn-n']):''}</b> CR ${escH(m['mn-cr']||'?')}, AC ${escH(m['mn-ac']||'?')}, HP ${escH(m['mn-hp']||'?')}${m['mn-tac']?'. '+escH(m['mn-tac']):''}</li>`);
  const locs=readList('loc-list').filter(l=>l['lo-name']).map(l=>`<li><b>${escH(l['lo-name'])}</b>${l['lo-desc']?'. '+escH(l['lo-desc']):''}${l['lo-asp']?` <i>${escH(l['lo-asp']).replace(/\n/g,'; ')}</i>`:''}</li>`);
  const treas=readList('treas-list').filter(t=>t['tr-name']).map(t=>`<li class="ps-box">${escH(t['tr-name'])}</li>`);
  if(!improvKit) improvKit=newImprovKit();
  const kitNames=improvKit.names.filter(n=>!n.used).slice(0,8).map(n=>escH(n.t)).join(', ');
  return `
    <header class="ps-head">
      <div><h1>${escH(sess||'Session')}</h1><div>${escH([camp,date].filter(Boolean).join(', '))}</div></div>
      <div class="ps-bench">Benchmark CR ${b.benchmark} per fight<br>Single monster up to CR ${b.singleMax}</div>
    </header>
    ${sec('Strong start',fieldVal('strong-start')?`<p>${escH(fieldVal('strong-start'))}</p>${fieldVal('adv-hook')?`<p><i>${escH(fieldVal('adv-hook'))}</i></p>`:''}`:'')}
    <div class="ps-cols">
      ${sec('Character hooks',li(hooks))}
      ${sec('Secrets and clues',li(secrets))}
      ${sec('Scenes',li(scenes))}
      ${sec('Forks',li(forks))}
      ${sec('NPCs',li(npcs))}
      ${sec('Locations',li(locs))}
      ${sec('Monsters',li(mons))}
      ${sec('Treasure',li(treas))}
      ${sec('Improv',`<p><b>Names:</b> ${kitNames}</p><p><b>Places:</b> ${improvKit.places.map(p=>escH(p.t)).join(', ')}</p><p><b>Weather:</b> ${escH(improvKit.weather)}</p>`)}
    </div>
    <footer class="ps-notes">Notes</footer>`;
}
function printPrepSheet(){
  const ps=document.getElementById('print-sheet');
  ps.innerHTML=buildPrintSheet();
  document.body.classList.add('printing-sheet');
  const done=()=>{ document.body.classList.remove('printing-sheet'); window.removeEventListener('afterprint',done); };
  window.addEventListener('afterprint',done);
  setTimeout(()=>window.print(),50);
}

// ══════════════════════════════════════════════════════
//  EMBEDDED IN THE PARTY APP
// ══════════════════════════════════════════════════════
(function(){
  const syncHP={}, syncDeath={}, syncCond={};
  function pcSync(){
    const B=window.PartyBridge; if(!B) return false;
    let changed=false, resort=false;
    combatants.forEach(c=>{
      if(c.type!=='pc'||c.isGroup) return;
      const s=B.pc(c.name); if(!s) return;
      // initiative typed by the player on their phone
      const ir=s.initRoll, seen=(window.__tomeInitSeen=window.__tomeInitSeen||{});
      if(ir&&ir.fid&&ir.fid===fightId&&ir.t>(seen[c.name]||0)){
        seen[c.name]=ir.t;
        if(c.initiative!==ir.v){ c.initiative=ir.v; resort=true; changed=true; toast(c.name+' rolled '+ir.v+' for initiative'); }
      }
      const last=syncHP[c.name];
      if(last===undefined){ c.hp=s.hp; c.hpMax=s.hpMax; c.ac=s.ac; syncHP[c.name]=s.hp; changed=true; }
      else if(c.hp!==last){ B.setHP(c.name,c.hp); syncHP[c.name]=c.hp; }
      else if(s.hp!==last){ c.hp=s.hp; syncHP[c.name]=s.hp; changed=true; }
      if(c.hpMax!==s.hpMax){ c.hpMax=s.hpMax; changed=true; }
      if(c.ac!==s.ac){ c.ac=s.ac; changed=true; }
      // conditions (both ways) and exhaustion (tracker -> sheet level)
      if((c.conditions||[]).includes('Exhaustion')){ c.conditions=c.conditions.filter(x=>x!=='Exhaustion'); B.addExh(c.name); changed=true; }
      const sc=(s.conds||[]).slice().sort().join('|'), tc=(c.conditions||[]).slice().sort().join('|'), lastC=syncCond[c.name];
      if(lastC===undefined){ c.conditions=(s.conds||[]).slice(); syncCond[c.name]=sc; changed=true; }
      else if(tc!==lastC){ B.setConds(c.name,(c.conditions||[]).slice()); syncCond[c.name]=tc; }
      else if(sc!==lastC){ c.conditions=(s.conds||[]).slice(); syncCond[c.name]=sc; changed=true; }
      // death saves
      const dkey=(c.death?c.death.s+'/'+c.death.f:'-')+'|'+s.deathS+'/'+s.deathF;
      if(c.hp<=0){
        const lastD=syncDeath[c.name];
        const cur=c.death?(c.death.s+'/'+c.death.f):null;
        if(lastD===undefined){ if(s.deathS||s.deathF){ c.death=c.death||{s:0,f:0}; c.death.s=s.deathS; c.death.f=s.deathF; changed=true; } syncDeath[c.name]=s.deathS+'/'+s.deathF; }
        else if(cur && cur!==lastD){ B.setDeath(c.name,c.death.s,c.death.f); syncDeath[c.name]=cur; }
        else if((s.deathS+'/'+s.deathF)!==lastD){ c.death=c.death||{s:0,f:0}; c.death.s=s.deathS; c.death.f=s.deathF; c.death.stable=c.death.s>=3; c.death.dead=c.death.f>=3; syncDeath[c.name]=s.deathS+'/'+s.deathF; changed=true; }
      } else { delete syncDeath[c.name]; }
    });
    if(resort){ const cur0=currentTurn>=0?combatants[currentTurn]:null; combatants.sort((x,y)=>(y.initiative||0)-(x.initiative||0)); if(cur0) currentTurn=combatants.indexOf(cur0); }
    return changed;
  }
  const _ril=renderInitList;
  let busy=false;
  renderInitList=function(){
    _ril();
    if(busy) return; busy=true;
    try{ if(pcSync()){ _ril(); if(typeof refreshCombatPanel==='function') refreshCombatPanel(); } }finally{ busy=false; }
    if(!combatants.length){ fightId=null; anonCount=0; }
    if(typeof window.__tomeShareTick==='function') window.__tomeShareTick();
    if(typeof window.__tomeFightChanged==='function') window.__tomeFightChanged();
  };
  window.__tomeSheetsChanged=function(){
    if(!document.getElementById('init-list')) return;
    renderInitList();
    if(typeof refreshCombatPanel==='function') refreshCombatPanel();
    if(typeof refreshRunPartyIfOpen==='function') refreshRunPartyIfOpen();
  };

  // 2024 data from the shared files
  const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  window.__tomeSetData=function(spells,monsters){
    SPELLS=(spells||[]).map(s=>({name:s.n,level:s.l,school:s.s||'',castTime:s.t||'',range:s.r||'',components:s.c||'',duration:s.d||'',classes:s.cl||[],desc:esc(s.x||'')+(s.h?'\n'+esc(s.h):'')}));
    Object.keys(SPELL_MAP).forEach(k=>delete SPELL_MAP[k]);
    SPELLS.forEach(s=>{ SPELL_MAP[s.name.toLowerCase()]=s; });
    const names=Object.values(SPELL_MAP).sort((a,b)=>b.name.length-a.name.length).map(s=>s.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
    SPELL_RE=names.length?new RegExp('\\b('+names.join('|')+')\\b','gi'):null;
    const ent=(arr)=>(arr||[]).map(a=>'<b>'+esc(a[0])+'.</b> '+esc(a[1])).join('<br>');
    const flat=(arr)=>(arr||[]).map(a=>a[1]?a[0]+' ('+a[1]+')':a[0]).join(', ');
    MONSTERS=(monsters||[]).map(m=>({
      name:m.n,cr:m.cr,type:/^Swarm/i.test(m.t)?(/Undead/i.test(m.t)?'Undead':'Beast'):m.t,size:m.sz,ac:m.ac,hp:m.hp,hd:m.hd,speed:m.sp,
      str:m.str,dex:m.dex,con:m.con,int:m.int,wis:m.wis,cha:m.cha,saves:m.sv||'',skills:m.sk||'',senses:m.se||'',languages:m.ln||'',immunities:m.im||'',
      traits:ent(m.tr),actions:ent((m.act||[]).concat((m.bon||[]).map(a=>['Bonus Action: '+a[0],a[1]]))),reactions:ent(m.rea),legendary:ent(m.leg),
      _tr:m.tr||[],_act:(m.act||[]).concat((m.bon||[]).map(a=>['Bonus Action: '+a[0],a[1]])),_rea:m.rea||[],_leg:m.leg||[]
    }));
    if(typeof filterMonsters==='function' && document.getElementById('mdb-list')) filterMonsters();
  };
  // stat-block panel in combat: show full entries without comma-splitting
  const _sbh=statBlockHTML;
  statBlockHTML=function(m){
    if(!m||!m._act) return _sbh(m);
    const ab=['str','dex','con','int','wis','cha'], sign=n=>(n>=0?'+':'')+n;
    const row=(label,val)=>val?`<div class="sb-row"><span class="sb-lbl">${label}</span> ${escH(val)}</div>`:'';
    const sec=(label,arr)=>arr&&arr.length?`<div class="sb-sec">${label}</div>`+arr.map(a=>`<div class="sb-act"><strong>${escH(a[0])}.</strong> ${escH(a[1])}</div>`).join(''):'';
    return `<div class="sb-type">${escH(m.size||'')} ${escH(m.type||'')}${m.cr?`, CR ${escH(m.cr)}`:''}</div>
      ${row('AC',m.ac)}${row('HP',m.hp+(m.hd?' ('+m.hd+')':''))}${row('Speed',m.speed)}
      <div class="sb-abil">${ab.map(k=>`<div><span>${k.toUpperCase()}</span>${m[k]||10} (${sign(abilMod(m[k]))})</div>`).join('')}</div>
      ${row('Saves',m.saves)}${row('Skills',m.skills)}${row('Senses',m.senses)}${row('Immunities',m.immunities)}${row('Languages',m.languages)}
      ${sec('Traits',m._tr)}${sec('Actions',m._act)}${sec('Reactions',m._rea)}${sec('Legendary actions',m._leg)}`;
  };

  // party cards from the live sheets
  window.__tomeParty=function(sheets){
    if(!Array.isArray(sheets)) return;
    sheets.forEach(s=>{
      try{
        if(!s||!s.name) return;
        const sid='cs-'+s.name.replace(/[^a-z0-9]/gi,'-').toLowerCase();
        const old=document.getElementById(sid);
        let wasOpen=false, tab=null;
        if(old){
          const b=old.querySelector('.cs-body'); wasOpen=!!(b&&b.classList.contains('open'));
          const t=old.querySelector('.cs-tab.on'); tab=t&&t.dataset.csTab;
          const h=old.querySelector('[data-char-hook]'); if(h&&h.value) pendingCharHooks[s.name]=h.value;
          const i=loadedChars.findIndex(c=>c.name===s.name); if(i>=0) loadedChars.splice(i,1);
          old.remove();
        }
        renderChar(s);
        if(wasOpen) toggleCS(sid);
        if(tab){ const nt=document.querySelector('#'+CSS.escape(sid)+' [data-cs-tab="'+tab+'"]'); if(nt) nt.click(); }
      }catch(err){ console.warn('Party sheet failed',err); }
    });
    // drop cards for sheets that no longer exist
    const keep=new Set(sheets.map(s=>'cs-'+String(s.name).replace(/[^a-z0-9]/gi,'-').toLowerCase()));
    document.querySelectorAll('#char-sheets .cs-card').forEach(el=>{ if(!keep.has(el.id)) el.remove(); });
    for(let i=loadedChars.length-1;i>=0;i--){ if(!sheets.some(s=>s.name===loadedChars[i].name)) loadedChars.splice(i,1); }
    if(typeof updateInitSelects==='function') updateInitSelects();
    const pl=document.getElementById('party-level');
    if(pl&&!pl.value&&sheets.length){ pl.value=String(Math.round(sheets.reduce((a,s)=>a+(parseInt(s.level)||1),0)/sheets.length)); if(window.__tomeMetaSum) window.__tomeMetaSum(); }
    window.__tomeSheetsChanged();
  };
  // autosave a few seconds after any edit inside the tome (the app copies it to the cloud)
  let _asT;
  const _kick=()=>{ clearTimeout(_asT); _asT=setTimeout(()=>{ if(window.__tomeReady){ try{ saveAll(); }catch(e){} } },3500); };
  ['input','change','click'].forEach(ev=>{
    const root=document.getElementById('tome');
    if(root) root.addEventListener(ev,_kick,true);
  });
})();

// ---- tidy-up behaviour ----
(function(){
  const val=id=>{const e=document.getElementById(id);return e?String(e.value||'').trim():''};
  function metaSum(){
    const s=document.getElementById('tome-meta-sum'); if(!s) return;
    const parts=[val('campaign-name')||'Name your campaign',val('session-num'),val('session-date'),val('party-level')?'Party level '+val('party-level'):''].filter(Boolean);
    s.textContent=parts.join(' · ');
  }
  window.__tomeMetaSum=metaSum;
  const _ad=applyData; applyData=function(d){ _ad(d); metaSum(); };
  const root=document.getElementById('tome');
  if(root) root.addEventListener('input',e=>{ if(e.target&&/^(campaign-name|session-num|session-date|party-level)$/.test(e.target.id)) metaSum(); });
  setTimeout(metaSum,300); setTimeout(metaSum,1500);

  const RUNIDS={secrets:'run-secrets',forks:'run-forks',scenes:'run-scenes',party:'run-party',hooks:'run-hooks',kit:'run-kit',npcs:'run-npcs',mons:'run-mons',locs:'run-locs',treas:'run-treas'};
  function runTidy(){
    Object.keys(RUNIDS).forEach(k=>{
      const d=document.querySelector('#tome details[data-run="'+k+'"]'), box=document.getElementById(RUNIDS[k]);
      if(!d||!box) return;
      const n=[...box.children].filter(c=>!c.classList.contains('run-empty')).length;
      let b=d.querySelector('summary .run-n');
      if(k==='secrets'&&d.querySelector('summary .run-count')){ if(b) b.remove(); }
      else{
        if(!b){ b=document.createElement('span'); b.className='run-n'; d.querySelector('summary').appendChild(b); }
        b.textContent=n?String(n):'none';
      }
      d.classList.toggle('is-empty',!n);
    });
  }
  const _rrm=renderRunMode; renderRunMode=function(){ _rrm.apply(this,arguments); runTidy(); };

  const ORDER=['s1','s2','s3','s4','s5','s6','s7','s8'], NAMES=['Party','Strong start','Scenes','Secrets','Places','NPCs','Monsters','Treasure'];
  ORDER.forEach((id,i)=>{
    const p=document.getElementById('tab-'+id); if(!p||p.querySelector('.step-nav')) return;
    const nav=document.createElement('div'); nav.className='step-nav';
    nav.innerHTML=(i?'<button class="btns" data-go="'+ORDER[i-1]+'">‹ '+NAMES[i-1]+'</button>':'')+
      (i<ORDER.length-1?'<button class="btnp" data-go="'+ORDER[i+1]+'">'+NAMES[i+1]+' ›</button>':'<button class="btnp" data-go="run">▶ Run the session</button>');
    p.appendChild(nav);
  });
  if(root) root.addEventListener('click',e=>{
    const b=e.target.closest&&e.target.closest('[data-go]'); if(!b) return;
    sw(b.getAttribute('data-go')); window.scrollTo({top:0,behavior:'smooth'});
  });
})();


// ---- Combat: add prepared monsters or library monsters with one tap ----
(function(){
  const root=document.getElementById('tome'); if(!root) return;
  const esc=escH;
  const prepared=()=>readList('mon-list').filter(m=>m['mn-name']).map(m=>({
    name:m['mn-name'],cr:m['mn-cr'],hp:parseInt(m['mn-hp'])||0,ac:parseInt(m['mn-ac'])||0,n:Math.max(1,parseInt(m['mn-n'])||1),card:m._card}));
  function renderPrepared(){
    const box=document.getElementById('fa-prepared'); if(!box) return;
    const list=prepared();
    if(!list.length){
      box.innerHTML='<p class="fa-empty">Nothing prepared yet. Open <b>Monsters</b> from the menu to line some up, or search below.</p>';
      return;
    }
    box.innerHTML=list.map((m,i)=>'<div class="fa-row"><div class="fa-main"><b>'+esc(m.name)+'</b>'+(m.n>1?' <span class="fa-n">× '+m.n+'</span>':'')+
      '<div class="fa-meta">'+(m.cr?'CR '+esc(m.cr)+' · ':'')+'HP '+(m.hp||'?')+' · AC '+(m.ac||'?')+'</div></div>'+
      '<button class="btnp" data-fa-prep="'+i+'">Add</button><button class="btns" data-fa-prep-roll="'+i+'" title="Add and roll initiative" aria-label="Add '+esc(m.name)+' and roll initiative">🎲</button></div>').join('')+
      (list.length>1?'<button class="btns fa-all" data-fa-all>Add all prepared</button>':'');
  }
  function renderResults(){
    const qEl=document.getElementById('fa-q'), box=document.getElementById('fa-results'); if(!qEl||!box) return;
    const q=(qEl.value||'').trim().toLowerCase();
    if(q.length<2){ box.innerHTML=''; return; }
    const rank=m=>{const n=m.name.toLowerCase(); return n===q?0:n.startsWith(q)?1:n.includes(' '+q)?2:n.includes(q)?3:4};
    const hits=MONSTERS.map((m,i)=>[m,i]).filter(([m])=>m.name.toLowerCase().includes(q)||('cr '+m.cr)===q||String(m.type).toLowerCase().includes(q)).sort((a,b)=>rank(a[0])-rank(b[0])).slice(0,8);
    box.innerHTML=hits.length?hits.map(([m,i])=>'<div class="fa-row lib"><div class="fa-main"><b>'+esc(m.name)+'</b><div class="fa-meta">'+esc(m.type)+' · CR '+esc(m.cr)+' · HP '+m.hp+' · AC '+m.ac+'</div></div>'+
      '<label class="fa-cl">How many<input type="number" class="fa-count" min="1" max="30" value="1" inputmode="numeric"></label>'+
      '<button class="btnp" data-fa-lib="'+i+'">Add</button><button class="btns" data-fa-lib-roll="'+i+'" title="Add and roll initiative" aria-label="Add '+esc(m.name)+' and roll initiative">🎲</button></div>').join(''):
      '<p class="fa-empty">Not in the library. Add it by hand below, or prepare it as a custom monster.</p>';
  }
  window.__tomeFightRefresh=function(){ renderPrepared(); renderResults(); };
  const clickCard=(i,role)=>{ const p=prepared()[i]; if(!p) return; const b=p.card.querySelector('[data-role="'+role+'"]'); if(b) b.click(); };
  root.addEventListener('click',e=>{
    const t=e.target.closest&&e.target.closest('[data-fa-prep],[data-fa-prep-roll],[data-fa-all],[data-fa-lib],[data-fa-lib-roll],[data-go-lib]'); if(!t) return;
    if(t.hasAttribute('data-fa-prep')) clickCard(+t.getAttribute('data-fa-prep'),'add-init');
    else if(t.hasAttribute('data-fa-prep-roll')) clickCard(+t.getAttribute('data-fa-prep-roll'),'roll-init');
    else if(t.hasAttribute('data-fa-all')) prepared().forEach((p,i)=>clickCard(i,'add-init'));
    else if(t.hasAttribute('data-go-lib')){ if(window.__tomeGoLibrary) window.__tomeGoLibrary(); else sw('mdb'); }
    else{
      const attr=t.hasAttribute('data-fa-lib')?'data-fa-lib':'data-fa-lib-roll', roll=attr==='data-fa-lib-roll';
      const m=MONSTERS[+t.getAttribute(attr)], row=t.closest('.fa-row'), n=row?row.querySelector('.fa-count').value:1;
      if(m) addMonsterToInit(m,n,roll);
    }
  });
  root.addEventListener('input',e=>{
    if(e.target&&e.target.id==='fa-q') renderResults();
    else if(e.target&&e.target.closest&&e.target.closest('#mon-list')){ clearTimeout(renderPrepared._t); renderPrepared._t=setTimeout(renderPrepared,250); }
  });
  const _ad2=applyData; applyData=function(d){ _ad2(d); setTimeout(renderPrepared,100); };
  new MutationObserver(()=>{ clearTimeout(renderPrepared._m); renderPrepared._m=setTimeout(renderPrepared,150); }).observe(document.getElementById('mon-list')||root,{childList:true});
  setTimeout(renderPrepared,400);
})();

// expose what the host page needs
window.__tome={sw:sw,saveAll:saveAll,boot:null};
if(typeof handleFileUpload==='function') window.handleFileUpload=handleFileUpload;
})();

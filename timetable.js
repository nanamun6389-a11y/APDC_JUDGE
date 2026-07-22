
const gate=document.getElementById('ttPasswordGate');
const protectedBox=document.getElementById('ttProtected');
const input=document.getElementById('ttPasswordInput');
const btn=document.getElementById('ttPasswordBtn');
const msg=document.getElementById('ttPasswordMessage');
const ACCESS_KEY='apdc_judge_access_ok';
const LOCAL_KEY='apdc_timetable_manager_backup_v4';

let TT=[];
let firebaseReady=false;
let ttDb=null;
let ttRef=null;
let ttOnValue=null;

function normalizeRows(value){
  if(Array.isArray(value)) return value.filter(Boolean);
  if(value && typeof value==='object'){
    return Object.keys(value).sort((a,b)=>Number(a)-Number(b)).map(k=>value[k]).filter(Boolean);
  }
  return [];
}

function unlock(){
  sessionStorage.setItem(ACCESS_KEY,'1');
  gate.style.display='none';
  protectedBox.hidden=false;
  protectedBox.style.display='block';
  protectedBox.classList.remove('hidden');
  loadTimetable();
}
function check(){
  if(input.value.trim()==='0070'){unlock()}
  else{msg.textContent='Incorrect password';input.value='';input.focus();}
}
btn.addEventListener('click',check);
input.addEventListener('keydown',e=>{if(e.key==='Enter')check()});
if(sessionStorage.getItem(ACCESS_KEY)==='1') unlock();

function esc(s){
  return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function render(){
  const q=(document.getElementById('ttSearch').value||'').trim().toLowerCase();
  const rows=TT.filter(x=>!q||[
    x.start,x.no,x.round,x.style,x.section,x.division,x.event,
    x.entries,x.danceOrder,x.note
  ].join(' ').toLowerCase().includes(q));

  const host=document.getElementById('ttCards');
  host.innerHTML=rows.map(x=>`
    <article class="tt-card" data-start="${esc(x.start)}">
      <div class="tt-time">${esc(x.start)}</div>
      <div class="tt-main">
        <div class="tt-topline">
          <span class="tt-run">${x.no ? `EVENT ${esc(x.no)}` : ''}</span>
          <span class="tt-round">${esc(x.round)}</span>
        </div>
        <h2>${esc(x.event).replace(/\n/g,'<br>')}</h2>
        <div class="tt-meta">${[x.section,x.division,x.style].filter(Boolean).map(esc).join(' · ')}</div>
        ${x.entries?`<div class="tt-info"><b>ENTRIES</b> ${esc(x.entries)}</div>`:''}
        ${x.danceOrder?`<div class="tt-info"><b>DANCE</b> ${esc(x.danceOrder)}</div>`:''}
        ${Array.isArray(x.backNumbers)&&x.backNumbers.length?`<div class="tt-info"><b>BACK NO.</b> ${x.backNumbers.map(esc).join(' · ')}</div>`:''}
        ${x.note?`<div class="tt-note">${esc(x.note)}</div>`:''}
      </div>
      <div class="tt-duration">${esc(x.durationText||x.duration)}${x.durationText?'':(x.duration?' min':'')}</div>
    </article>
  `).join('') || '<div class="message">No timetable results.</div>';
}

function loadLocal(){
  try{
    const saved=JSON.parse(localStorage.getItem(LOCAL_KEY)||'null');
    const rows=normalizeRows(saved?.rows);
    return rows.length ? rows : null;
  }catch(e){ return null; }
}

async function loadDefault(){
  const urls=[
    'timetable-data.json?v=20260722-unified-v2',
    './timetable-data.json?v=20260722-unified-v2'
  ];
  for(const url of urls){
    try{
      const r=await fetch(url,{cache:'no-store'});
      if(!r.ok) throw new Error('HTTP '+r.status);
      const d=await r.json();
      const rows=normalizeRows(d.rows);
      if(rows.length){
        document.getElementById('ttSummary').textContent=d.summary||'';
        return rows;
      }
    }catch(e){
      console.warn('Default timetable load failed',url,e);
    }
  }
  return null;
}

async function connectFirebase(){
  try{
    const [{initializeApp,getApps},{getDatabase,ref,get,onValue},{firebaseConfig}] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js"),
      import("./firebase-config.js?v=20260722-unified-v2")
    ]);
    const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
    ttDb=getDatabase(app);
    ttRef=ref;
    ttOnValue=onValue;
    firebaseReady=true;

    try{
      const s=await get(ref(ttDb,'timetableOverride'));
      const v=s.val();
      const rows=normalizeRows(v?.rows);
      if(rows.length){
        TT=rows;
        render();
      }
    }catch(e){
      console.warn('Firebase timetable initial read failed',e);
    }

    onValue(ref(ttDb,'timetableOverride'),snap=>{
      const v=snap.val();
      const rows=normalizeRows(v?.rows);
      if(rows.length){
        TT=rows;
        render();
      }
    });
  }catch(e){
    console.warn('Firebase unavailable; showing local/default timetable',e);
  }
}

async function loadTimetable(){
  if(TT.length){render();return;}

  // 1) Always show something first: local backup if present.
  const localRows=loadLocal();
  if(localRows?.length){
    TT=localRows;
    render();
  }

  // 2) Load the packaged APDC timetable regardless of Firebase status.
  const defaultRows=await loadDefault();
  if(defaultRows?.length && !TT.length){
    TT=defaultRows;
    render();
  }

  // Extra safety: if local data was malformed/empty, packaged timetable wins.
  if(!TT.length && defaultRows?.length){
    TT=defaultRows;
    render();
  }

  // 3) Only after the page is visible, connect Firebase and overlay saved edits.
  connectFirebase();

  if(!TT.length){
    document.getElementById('ttCards').innerHTML=
      '<div class="message">TIMETABLE LOAD ERROR · Please refresh once.</div>';
  }
}

document.getElementById('ttSearch').addEventListener('input',render);

document.getElementById('ttNowBtn').addEventListener('click',()=>{
  const cards=[...document.querySelectorAll('.tt-card')];
  if(!cards.length)return;
  const now=new Date();
  const cur=now.getHours()*60+now.getMinutes();
  let best=cards[0],bestDiff=1e9;
  for(const c of cards){
    const m=/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(c.dataset.start||'');
    if(!m)continue;
    const v=+m[1]*60 + +m[2] + (+(m[3]||0))/60;
    const diff=Math.abs(v-cur);
    if(diff<bestDiff){bestDiff=diff;best=c;}
  }
  best.scrollIntoView({behavior:'smooth',block:'center'});
  best.classList.add('tt-highlight');
  setTimeout(()=>best.classList.remove('tt-highlight'),1800);
});

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";
const ttApp=getApps().length?getApps()[0]:initializeApp(firebaseConfig),ttDb=getDatabase(ttApp);
const gate=document.getElementById('ttPasswordGate');
const protectedBox=document.getElementById('ttProtected');
const input=document.getElementById('ttPasswordInput');
const btn=document.getElementById('ttPasswordBtn');
const msg=document.getElementById('ttPasswordMessage');
const ACCESS_KEY='apdc_judge_access_ok';
function unlock(){sessionStorage.setItem(ACCESS_KEY,'1');gate.style.display='none';protectedBox.hidden=false;protectedBox.style.display='block';protectedBox.classList.remove('hidden');loadTimetable();}
function check(){if(input.value.trim()==='0070'){unlock()}else{msg.textContent='Incorrect password';input.value='';input.focus();}}
btn.addEventListener('click',check);input.addEventListener('keydown',e=>{if(e.key==='Enter')check()});
if(sessionStorage.getItem(ACCESS_KEY)==='1')unlock();
let TT=[];
async function loadTimetable(){if(TT.length){render();return;}const [r,snap]=await Promise.all([fetch('timetable-data.json?v=20260722-reordered-1130-v2',{cache:'no-store'}),get(ref(ttDb,'timetable/current'))]);const d=await r.json();const online=snap.val();TT=(online&&Array.isArray(online.rows)&&online.rows.length)?online.rows:(d.rows||[]);document.getElementById('ttSummary').textContent=(online?.meta?.summary)||d.summary||'';render();onValue(ref(ttDb,'timetable/current'),s=>{const v=s.val();if(v&&Array.isArray(v.rows)&&v.rows.length){TT=v.rows;document.getElementById('ttSummary').textContent=v.meta?.summary||d.summary||'';render();}});}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function render(){const q=(document.getElementById('ttSearch').value||'').trim().toLowerCase();const rows=TT.filter(x=>!q||[x.start,x.no,x.round,x.style,x.section,x.division,x.event,x.entries,x.danceOrder,x.note].join(' ').toLowerCase().includes(q));
const host=document.getElementById('ttCards');host.innerHTML=rows.map(x=>`<article class="tt-card" data-start="${esc(x.start)}"><div class="tt-time">${esc(x.start)}</div><div class="tt-main"><div class="tt-topline"><span class="tt-run">EVENT ${esc(x.no)}</span><span class="tt-round">${esc(x.round)}</span></div><h2>${esc(x.event).replace(/\n/g,'<br>')}</h2><div class="tt-meta">${[x.section,x.division,x.style].filter(Boolean).map(esc).join(' · ')}</div>${x.entries?`<div class="tt-info"><b>ENTRIES</b> ${esc(x.entries)}</div>`:''}${x.danceOrder?`<div class="tt-info"><b>DANCE</b> ${esc(x.danceOrder)}</div>`:''}${Array.isArray(x.backNumbers)&&x.backNumbers.length?`<div class="tt-info"><b>BACK NO.</b> ${x.backNumbers.map(esc).join(' · ')}</div>`:''}${x.note?`<div class="tt-note">${esc(x.note)}</div>`:''}</div><div class="tt-duration">${esc(x.durationText||x.duration)}${x.durationText?'':(x.duration?' min':'')}</div></article>`).join('')||'<div class="message">No timetable results.</div>';}
document.getElementById('ttSearch').addEventListener('input',render);
document.getElementById('ttNowBtn').addEventListener('click',()=>{const cards=[...document.querySelectorAll('.tt-card')];if(!cards.length)return;const now=new Date();const cur=now.getHours()*60+now.getMinutes();let best=cards[0],bestDiff=1e9;for(const c of cards){const m=/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(c.dataset.start||'');if(!m)continue;const v=+m[1]*60 + +m[2] + (+(m[3]||0))/60;const diff=Math.abs(v-cur);if(diff<bestDiff){bestDiff=diff;best=c;}}best.scrollIntoView({behavior:'smooth',block:'center'});best.classList.add('tt-highlight');setTimeout(()=>best.classList.remove('tt-highlight'),1800);});
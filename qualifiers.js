import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, get, onValue, set } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
const db=getDatabase(app);
const APDC_FIREBASE_PLAYERS_URL='https://apdc-judge-default-rtdb.asia-southeast1.firebasedatabase.app/apdcPublic/players.json';
const APDC_SEARCH_PLAYERS_URL='https://nanamun6389-a11y.github.io/APDC-SEARCH/players.json';
const eventSel=document.getElementById('qualEvent');
const targetEl=document.getElementById('qualTarget');
const grid=document.getElementById('qualPlayers');
const countEl=document.getElementById('qualCount');
const msg=document.getElementById('qualMessage');
let TT=[],players=[],saved={},selected=new Set();

function norm(v){return String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function roundKind(v){const x=String(v||'').toLowerCase();if(x.includes('quarter'))return'quarter';if(x.includes('semi'))return'semi';return''}
function targetRound(row){return roundKind(row?.round)==='quarter'?'semi':'final'}
function keyFor(row){return String(row?.sourceEventNo||row?.event||'').trim()}
function playerName(p){return String(p?.player||p?.competitor||'').trim()}
function candidates(row){
  const source=String(row?.sourceEventNo||'').trim();
  const e=norm(row?.event);
  let arr=players.filter(p=>source && String(p?.eventNo||'').trim()===source);
  if(!arr.length)arr=players.filter(p=>norm(p?.event)===e);
  const map=new Map();
  for(const p of arr){const no=String(p?.backNo||'').trim();if(no&&!map.has(no))map.set(no,{backNo:no,name:playerName(p)});}
  return [...map.values()].sort((a,b)=>Number(a.backNo)-Number(b.backNo));
}
async function fetchPlayers(){
  for(const url of [APDC_FIREBASE_PLAYERS_URL,APDC_SEARCH_PLAYERS_URL,'players.json']){
    try{const r=await fetch(`${url}?v=${Date.now()}`,{cache:'no-store'});if(r.ok){const d=await r.json();if(Array.isArray(d)&&d.length)return d;}}catch(_){ }
  }
  return [];
}
function eligibleRows(){return TT.map((row,index)=>({row,index})).filter(({row})=>['quarter','semi'].includes(roundKind(row.round)));}
function renderEventOptions(){
  eventSel.innerHTML=eligibleRows().map(({row,index})=>`<option value="${index}">EVENT ${row.no||''} · ${row.round||''} · ${row.event||''}</option>`).join('');
}
function loadSelection(){
  const row=TT[Number(eventSel.value)]||{};
  const target=targetRound(row),key=keyFor(row);
  const list=Array.isArray(saved?.[key]?.[target])?saved[key][target]:[];
  selected=new Set(list.map(String));
  renderPlayers();
}
function renderPlayers(){
  const row=TT[Number(eventSel.value)]||{};
  const target=targetRound(row);
  const list=candidates(row);
  targetEl.textContent=target==='semi'?'SAVE TO SEMI FINAL':'SAVE TO FINAL';
  countEl.textContent=`SELECTED ${selected.size} / ${list.length}`;
  grid.innerHTML=list.map(p=>`<button type="button" class="qual-player ${selected.has(p.backNo)?'selected':''}" data-no="${p.backNo}"><strong>${p.backNo}</strong><span>${p.name||'—'}</span></button>`).join('')||'<div class="message">No players found for this event.</div>';
}
grid.addEventListener('click',e=>{const b=e.target.closest('.qual-player[data-no]');if(!b)return;const no=b.dataset.no;selected.has(no)?selected.delete(no):selected.add(no);renderPlayers();});
eventSel.addEventListener('change',loadSelection);
document.getElementById('qualClear').onclick=()=>{selected.clear();renderPlayers();};
document.getElementById('qualSave').onclick=async()=>{
  const row=TT[Number(eventSel.value)]||{};const target=targetRound(row),key=keyFor(row);
  const values=[...selected].sort((a,b)=>Number(a)-Number(b));
  try{await set(ref(db,`qualifiers/${encodeURIComponent(key)}/${target}`),values);msg.textContent=`Saved ${values.length} ${target==='semi'?'Semi-Final qualifiers':'Finalists'}.`;}
  catch(e){console.error(e);msg.textContent='Save failed. Please try again.';}
};

async function init(){
  const [tr,ps,qs]=await Promise.all([fetch(`timetable-data.json?v=${Date.now()}`,{cache:'no-store'}),fetchPlayers(),get(ref(db,'qualifiers'))]);
  const td=await tr.json();TT=Array.isArray(td?.rows)?td.rows:[];players=ps;saved=qs.val()||{};
  renderEventOptions();loadSelection();
  onValue(ref(db,'qualifiers'),snap=>{saved=snap.val()||{};loadSelection();});
}
init().catch(e=>{console.error(e);msg.textContent='QUALIFIERS could not be loaded.';});

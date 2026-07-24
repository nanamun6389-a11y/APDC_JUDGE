apdcBuildLanguageUI();
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const APDC_FIREBASE_PLAYERS_URL='https://apdc-judge-default-rtdb.asia-southeast1.firebasedatabase.app/apdcPublic/players.json';
const APDC_SEARCH_PLAYERS_URL='https://nanamun6389-a11y.github.io/APDC-SEARCH/players.json';
async function fetchLatestPlayers(){
  const urls=[APDC_FIREBASE_PLAYERS_URL,APDC_SEARCH_PLAYERS_URL];
  let lastError=null;
  for(const url of urls){
    try{
      const r=await fetch(`${url}?v=${Date.now()}`,{cache:'no-store'});
      if(!r.ok) throw new Error(`${url} HTTP ${r.status}`);
      const data=await r.json();
      if(Array.isArray(data)&&data.length)return data;
      throw new Error(`${url} returned empty/non-array data`);
    }catch(e){lastError=e;}
  }
  throw lastError||new Error('No player source available');
}
async function loadSearchEntryCounts(){
  try{
    const data=await fetchLatestPlayers();
    const counts=new Map();
    for(const p of data){
      const no=String(p?.eventNo??'').trim();
      const ev=String(p?.event??'').trim();
      if(no) counts.set(no,(counts.get(no)||0)+1);
      if(ev){const k=`event:${ev.toLowerCase()}`;counts.set(k,(counts.get(k)||0)+1);}
    }
    return counts;
  }catch(e){
    console.warn('Entry auto-sync unavailable; keeping timetable values',e);
    return null;
  }
}
function applySearchEntryCounts(rows,counts){
  if(!Array.isArray(rows)||!counts) return rows;
  const seen=new Set();
  return rows.map(row=>{
    const eventName=String(row?.event??'').trim();
    if(eventName.includes('+')){
      const parts=eventName.split('+').map(x=>x.trim().toLowerCase()).filter(Boolean);
      const vals=parts.map(x=>counts.get(`event:${x}`));
      if(parts.length&&vals.every(v=>Number.isFinite(v))) return {...row,entries:String(vals.reduce((a,b)=>a+b,0))};
      return row;
    }
    const sourceNo=String(row?.sourceEventNo??'').trim();
    if(!sourceNo||seen.has(sourceNo)||!counts.has(sourceNo)) return row;
    seen.add(sourceNo);
    return {...row,entries:String(counts.get(sourceNo))};
  });
}


const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
const db=getDatabase(app);
const APDC_LIVE_STATE_KEY="apdcFloorStatusV2";
const apdcLiveChannel=("BroadcastChannel" in window)?new BroadcastChannel("apdc-mc-live-v2"):null;

const nowEl=document.getElementById("liveNow");
const deckEl=document.getElementById("liveOnDeck");
const nextEl=document.getElementById("liveNext");
const updatedEl=document.getElementById("liveUpdated");
const nowBackEl=document.getElementById("liveNowBackNos");
const deckBackEl=document.getElementById("liveOnDeckBackNos");
const nextBackEl=document.getElementById("liveNextBackNos");
const eventNoEl=document.getElementById("liveEventNo");
const liveRoundEl=document.getElementById("liveRound");

let players=[];
let TT=[];
let currentIndex=0;
let updatedAt=0;
let hasFloorIndex=false;
let sharedState=null;
let QUALIFIERS={};

function norm(v){return String(v||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}
function eventParts(label){return String(label||"").split(/\n|\s*\+\s*|\s*\/\s*/).map(x=>x.trim()).filter(Boolean)}
function qualifierNumbersForRow(row){
  const source=String(row?.sourceEventNo||row?.event||'').trim();
  const bucket=QUALIFIERS?.[encodeURIComponent(source)]||QUALIFIERS?.[source]||{};
  const round=String(row?.round||'').toLowerCase();
  const key=round.includes('semi')?'semi':(round.includes('final')?'final':'');
  const vals=key&&Array.isArray(bucket?.[key])?bucket[key].map(String).filter(Boolean):[];
  return vals.sort((a,b)=>Number(a)-Number(b));
}
function backNumbersFor(label,row){
  const chosen=qualifierNumbersForRow(row);
  if(chosen.length)return chosen;
  const raw=String(label||"").trim();
  if(!raw||raw==="—"||raw.toUpperCase()==="WAITING")return[];
  const exact=new Set(eventParts(raw).map(norm));
  const nums=players.filter(p=>exact.has(norm(p.event))).map(p=>String(p.backNo||"").trim()).filter(Boolean);
  return [...new Set(nums)].sort((a,b)=>Number(a)-Number(b));
}
function renderBack(el,label,row){
  const nums=backNumbersFor(label,row);
  el.textContent=nums.length?`BACK NO. ${nums.join(" · ")}`:"BACK NO. —";
}
function hasEvent(v){
  const s=String(v||"").trim();
  return !!s&&s!=="—"&&s.toUpperCase()!=="WAITING";
}
function displayRound(v){
  const x=String(v||"").toLowerCase();
  if(x.includes("quarter"))return"QUARTER FINAL";
  if(x.includes("semi"))return"SEMI FINAL";
  if(x.includes("grand"))return"GRAND FINAL";
  if(x.includes("final"))return"FINAL";
  return String(v||"—").toUpperCase();
}
function render(){
  if(!TT.length)return;
  const i=Math.max(0,Math.min(Number.isInteger(currentIndex)?currentIndex:0,TT.length-1));
  const cur=TT[i]||{},deck=TT[i+1]||{},next=TT[i+2]||{};

  const state=sharedState||{};
  const nowLabel=String(state.now||cur.event||"WAITING");
  const deckLabel=String(state.onDeck||deck.event||"—");
  const nextLabel=String(state.next||next.event||"—");
  const eventNo=String(state.eventNo??cur.no??"").trim();
  const round=String(state.round??cur.round??"");
  eventNoEl.textContent=eventNo?`EVENT ${eventNo}`:"EVENT —";
  liveRoundEl.textContent=displayRound(round);
  nowEl.textContent=nowLabel;
  deckEl.textContent=deckLabel;
  nextEl.textContent=nextLabel;

  renderBack(nowBackEl,nowLabel,cur);
  renderBack(deckBackEl,deckLabel,deck);
  renderBack(nextBackEl,nextLabel,next);

  document.querySelector(".floor-board")?.classList.toggle(
    "final-only",
    hasEvent(nowLabel)&&!hasEvent(deckLabel)&&!hasEvent(nextLabel)
  );

  updatedEl.textContent=updatedAt
    ? `UPDATED ${new Date(updatedAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}`
    : "";
}

async function loadSharedPlayers(){
  try{
    const sr=await fetch(`${APDC_SEARCH_PLAYERS_URL}?v=${Date.now()}`,{cache:"no-store"});
    if(sr.ok){const sd=await sr.json();if(Array.isArray(sd)&&sd.length)return sd.map(x=>({...x,player:x.player||x.competitor||''}));}
  }catch(e){console.warn("APDC-SEARCH player data unavailable",e)}
  const remote=`https://apdc-judge-default-rtdb.asia-southeast1.firebasedatabase.app/apdcPublic/players.json?v=${Date.now()}`;
  try{
    const r=await fetch(remote,{cache:"no-store"});
    if(r.ok){const d=await r.json();if(Array.isArray(d)&&d.length)return d.map(x=>({...x,player:x.player||x.competitor||''}));}
  }catch(e){console.warn("Shared player data unavailable",e)}
  const r=await fetch(`players.json?v=${Date.now()}`,{cache:"no-store"});
  if(!r.ok)throw new Error(`players.json HTTP ${r.status}`);
  const d=await r.json();
  if(!Array.isArray(d))throw new Error("players.json must contain an array");
  return d.map(x=>({...x,player:x.player||x.competitor||''}));
}

async function load(){
  try{
    const [tr,sharedPlayers]=await Promise.all([
      fetch("timetable-data.json?v=20260722-unified-v1",{cache:"no-store"}),
      loadSharedPlayers()
    ]);
    const td=await tr.json();
    TT=td.rows||[];
    players=sharedPlayers;
    const counts=new Map();
    for(const p of players){const no=String(p?.eventNo??'').trim(),ev=String(p?.event??'').trim();if(no)counts.set(no,(counts.get(no)||0)+1);if(ev){const k=`event:${ev.toLowerCase()}`;counts.set(k,(counts.get(k)||0)+1);}}
    TT=applySearchEntryCounts(TT,counts);
  }catch(e){console.error(e)}

  try{
    const ov=await get(ref(db,"timetableOverride"));
    const v=ov.val();
    if(v&&Array.isArray(v.rows)&&v.rows.length){const counts=new Map();for(const p of players){const no=String(p?.eventNo??'').trim(),ev=String(p?.event??'').trim();if(no)counts.set(no,(counts.get(no)||0)+1);if(ev){const k=`event:${ev.toLowerCase()}`;counts.set(k,(counts.get(k)||0)+1);}}TT=applySearchEntryCounts(v.rows,counts);}
  }catch(_){}

  try{
    const local=JSON.parse(localStorage.getItem(APDC_LIVE_STATE_KEY)||"null");
    if(local&&Number.isInteger(Number(local.timetableIndex))){
      sharedState=local;
      currentIndex=Number(local.timetableIndex);
      updatedAt=Number(local.updatedAt)||0;
      hasFloorIndex=true;
    }
  }catch(_){ }

  try{
    const fs=await get(ref(db,"floorStatus"));
    const v=fs.val()||{};
    const idx=Number(v.timetableIndex);
    const ts=Number(v.updatedAt)||0;
    if(Number.isInteger(idx) && (!updatedAt || !ts || ts>=updatedAt)){currentIndex=idx;hasFloorIndex=true;sharedState=v;updatedAt=ts||updatedAt;}
  }catch(_){}

  try{const qs=await get(ref(db,'qualifiers'));QUALIFIERS=qs.val()||{};}catch(_){QUALIFIERS={};}
  render();

  onValue(ref(db,'qualifiers'),snap=>{QUALIFIERS=snap.val()||{};render();});

  onValue(ref(db,"timetableOverride"),snap=>{
    const v=snap.val();
    if(v&&Array.isArray(v.rows)&&v.rows.length){
      const counts=new Map();for(const p of players){const no=String(p?.eventNo??'').trim(),ev=String(p?.event??'').trim();if(no)counts.set(no,(counts.get(no)||0)+1);if(ev){const k=`event:${ev.toLowerCase()}`;counts.set(k,(counts.get(k)||0)+1);}}
      TT=applySearchEntryCounts(v.rows,counts);
      render();
    }
  });

  function applySharedState(v){
    v=v||{};
    const ts=Number(v.updatedAt)||0;
    // Ignore older echoes when both Firebase paths fire.
    if(ts && updatedAt && ts < updatedAt) return;
    const idx=Number(v.timetableIndex);
    if(Number.isInteger(idx) && idx>=0 && idx<TT.length){
      hasFloorIndex=true;
      currentIndex=idx;
    }
    sharedState=v;
    updatedAt=ts||updatedAt;
    render();
  }
  // Instant same-browser sync from MC, plus Firebase for other devices.
  window.addEventListener("storage",e=>{
    if(e.key!==APDC_LIVE_STATE_KEY||!e.newValue)return;
    try{applySharedState(JSON.parse(e.newValue));}catch(_){ }
  });
  if(apdcLiveChannel)apdcLiveChannel.onmessage=e=>applySharedState(e.data);

  // LIVE follows both MC Firebase paths. updatedAt prevents an older echo
  // from moving the screen backwards, while the second path provides automatic failover.
  onValue(ref(db,"floorStatus"),snap=>applySharedState(snap.val()));
  onValue(ref(db,"apdcPublic/liveState"),snap=>applySharedState(snap.val()));

}
load();

document.addEventListener("DOMContentLoaded",()=>{
  const labels=document.querySelectorAll(".floor-label");
  if(labels[0])labels[0].textContent=apdcT("now");
  if(labels[1])labels[1].textContent=apdcT("onDeck");
  if(labels[2])labels[2].textContent=apdcT("next");
});

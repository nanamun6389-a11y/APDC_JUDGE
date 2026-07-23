apdcBuildLanguageUI();
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
const db=getDatabase(app);

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

function norm(v){return String(v||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}
function eventParts(label){return String(label||"").split(/\n|\s*\+\s*|\s*\/\s*/).map(x=>x.trim()).filter(Boolean)}
function backNumbersFor(label){
  const raw=String(label||"").trim();
  if(!raw||raw==="—"||raw.toUpperCase()==="WAITING")return[];
  const exact=new Set(eventParts(raw).map(norm));
  const nums=players.filter(p=>exact.has(norm(p.event))).map(p=>String(p.backNo||"").trim()).filter(Boolean);
  return [...new Set(nums)].sort((a,b)=>Number(a)-Number(b));
}
function renderBack(el,label){
  const nums=backNumbersFor(label);
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

  eventNoEl.textContent=cur.no?`EVENT ${cur.no}`:"EVENT —";
  liveRoundEl.textContent=displayRound(cur.round);
  nowEl.textContent=cur.event||"WAITING";
  deckEl.textContent=deck.event||"—";
  nextEl.textContent=next.event||"—";

  renderBack(nowBackEl,cur.event);
  renderBack(deckBackEl,deck.event);
  renderBack(nextBackEl,next.event);

  document.querySelector(".floor-board")?.classList.toggle(
    "final-only",
    hasEvent(cur.event)&&!hasEvent(deck.event)&&!hasEvent(next.event)
  );

  updatedEl.textContent=updatedAt
    ? `UPDATED ${new Date(updatedAt).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}`
    : "";
}

async function loadSharedPlayers(){
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
  }catch(e){console.error(e)}

  try{
    const ov=await get(ref(db,"timetableOverride"));
    const v=ov.val();
    if(v&&Array.isArray(v.rows)&&v.rows.length)TT=v.rows;
  }catch(_){}

  try{
    const fs=await get(ref(db,"floorStatus"));
    const v=fs.val()||{};
    const idx=Number(v.timetableIndex);
    if(Number.isInteger(idx)){currentIndex=idx;hasFloorIndex=true;}
    updatedAt=Number(v.updatedAt)||0;
  }catch(_){}

  render();

  onValue(ref(db,"timetableOverride"),snap=>{
    const v=snap.val();
    if(v&&Array.isArray(v.rows)&&v.rows.length){
      TT=v.rows;
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
    updatedAt=ts||updatedAt;
    render();
  }
  // LIVE follows floorStatus only. Public mirror is intentionally not used as a competing source.
  onValue(ref(db,"floorStatus"),snap=>applySharedState(snap.val()));

}
load();

document.addEventListener("DOMContentLoaded",()=>{
  const labels=document.querySelectorAll(".floor-label");
  if(labels[0])labels[0].textContent=apdcT("now");
  if(labels[1])labels[1].textContent=apdcT("onDeck");
  if(labels[2])labels[2].textContent=apdcT("next");
});

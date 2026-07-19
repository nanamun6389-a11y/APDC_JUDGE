apdcBuildLanguageUI();
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const app=initializeApp(firebaseConfig);
const db=getDatabase(app);
const nowEl=document.getElementById("liveNow");
const deckEl=document.getElementById("liveOnDeck");
const nextEl=document.getElementById("liveNext");
const updatedEl=document.getElementById("liveUpdated");
const nowBackEl=document.getElementById("liveNowBackNos");
const deckBackEl=document.getElementById("liveOnDeckBackNos");
const nextBackEl=document.getElementById("liveNextBackNos");

let players=[];
let latestStatus={};

function norm(v){return String(v||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}
function eventParts(label){
  return String(label||"")
    .split(/\n|\s*\+\s*|\s*\/\s*/)
    .map(x=>x.trim())
    .filter(Boolean);
}
function backNumbersFor(label){
  const raw=String(label||"").trim();
  if(!raw || raw==="—" || raw.toUpperCase()==="WAITING")return [];
  const parts=eventParts(raw);
  const exact=new Set(parts.map(norm));
  const nums=players
    .filter(p=>exact.has(norm(p.event)))
    .map(p=>String(p.backNo||"").trim())
    .filter(Boolean);
  return [...new Set(nums)].sort((a,b)=>{
    const na=Number(a),nb=Number(b);
    return Number.isFinite(na)&&Number.isFinite(nb)?na-nb:a.localeCompare(b);
  });
}
function renderBack(el,label){
  const nums=backNumbersFor(label);
  el.textContent=nums.length?`BACK NO. ${nums.join(" · ")}`:"BACK NO. —";
}
function renderStatus(){
  const v=latestStatus||{};
  nowEl.textContent=v.now||"WAITING";
  deckEl.textContent=v.onDeck||"—";
  nextEl.textContent=v.next||"—";
  renderBack(nowBackEl,v.now);
  renderBack(deckBackEl,v.onDeck);
  renderBack(nextBackEl,v.next);
  if(v.updatedAt){
    const d=new Date(v.updatedAt);
    updatedEl.textContent=`UPDATED ${d.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}`;
  }else updatedEl.textContent="";
}

fetch("players.json?v=20260719-live-backno",{cache:"no-store"})
  .then(r=>r.json())
  .then(x=>{players=Array.isArray(x)?x:[];renderStatus()})
  .catch(e=>console.error("players.json load failed",e));

onValue(ref(db,"floorStatus"),snap=>{
  latestStatus=snap.val()||{};
  renderStatus();
});

document.addEventListener("DOMContentLoaded",()=>{
  const labels=document.querySelectorAll(".floor-label");
  if(labels[0])labels[0].textContent=apdcT("now");
  if(labels[1])labels[1].textContent=apdcT("onDeck");
  if(labels[2])labels[2].textContent=apdcT("next");
});

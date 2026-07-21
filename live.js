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
let players=[];let TT=[];let state={index:0};
function norm(v){return String(v||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}
function eventParts(label){return String(label||"").split(/\n|\s*\+\s*|\s*\/\s*/).map(x=>x.trim()).filter(Boolean)}
function backNumbersFor(label){const raw=String(label||"").trim();if(!raw||raw==="—"||raw.toUpperCase()==="WAITING")return[];const exact=new Set(eventParts(raw).map(norm));const nums=players.filter(p=>exact.has(norm(p.event))).map(p=>String(p.backNo||"").trim()).filter(Boolean);return [...new Set(nums)].sort((a,b)=>Number(a)-Number(b))}
function renderBack(el,label){const nums=backNumbersFor(label);el.textContent=nums.length?`BACK NO. ${nums.join(" · ")}`:"BACK NO. —"}
function hasEvent(v){const s=String(v||"").trim();return !!s&&s!=="—"&&s.toUpperCase()!=="WAITING"}
function displayRound(v){const x=String(v||"").toLowerCase();if(x.includes("quarter"))return"QUARTER FINAL";if(x.includes("semi"))return"SEMI FINAL";if(x.includes("grand"))return"GRAND FINAL";if(x.includes("final"))return"FINAL";return String(v||"—").toUpperCase()}
function render(){
  if(!TT.length)return;
  let i=Number(state.index);
  if(!Number.isInteger(i)&&state.eventNo)i=TT.findIndex(r=>String(r.no||"")===String(state.eventNo));
  i=Math.max(0,Math.min(Number.isInteger(i)?i:0,TT.length-1));
  const cur=TT[i]||{},deck=TT[i+1]||{},next=TT[i+2]||{};
  eventNoEl.textContent=cur.no?`EVENT ${cur.no}`:"EVENT —";
  liveRoundEl.textContent=displayRound(cur.round);
  nowEl.textContent=cur.event||"WAITING";deckEl.textContent=deck.event||"—";nextEl.textContent=next.event||"—";
  renderBack(nowBackEl,cur.event);renderBack(deckBackEl,deck.event);renderBack(nextBackEl,next.event);
  document.querySelector(".floor-board")?.classList.toggle("final-only",hasEvent(cur.event)&&!hasEvent(deck.event)&&!hasEvent(next.event));
  if(state.updatedAt){const d=new Date(state.updatedAt);updatedEl.textContent=`UPDATED ${d.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}`}else updatedEl.textContent="";
}
async function load(){
  try{const [tr,pr]=await Promise.all([fetch("timetable-data.json?v=20260722-single-state-v6",{cache:"no-store"}),fetch("players.json?v=20260720-consolidated-final",{cache:"no-store"})]);const td=await tr.json();TT=td.rows||[];players=await pr.json();}catch(e){console.error(e)}
  try{const ov=await get(ref(db,"timetableOverride"));const v=ov.val();if(v&&Array.isArray(v.rows)&&v.rows.length)TT=v.rows}catch(_){}
  try{const st=await get(ref(db,"runningOrderState"));state=st.val()||state}catch(_){}
  render();
  onValue(ref(db,"timetableOverride"),snap=>{const v=snap.val();if(v&&Array.isArray(v.rows)&&v.rows.length){TT=v.rows;render()}});
  onValue(ref(db,"runningOrderState"),snap=>{state=snap.val()||{index:0};render()});
}
load();
document.addEventListener("DOMContentLoaded",()=>{const labels=document.querySelectorAll(".floor-label");if(labels[0])labels[0].textContent=apdcT("now");if(labels[1])labels[1].textContent=apdcT("onDeck");if(labels[2])labels[2].textContent=apdcT("next")});

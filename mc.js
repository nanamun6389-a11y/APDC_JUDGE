import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, get, onValue, set } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";
apdcBuildLanguageUI();

const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
const db=getDatabase(app);
const PASSWORD="0808";

const gate=document.getElementById("mcPasswordGate");
const box=document.getElementById("mcProtected");
const pass=document.getElementById("mcPasswordInput");
const btn=document.getElementById("mcPasswordBtn");
const msg=document.getElementById("mcPasswordMessage");
function unlock(){sessionStorage.setItem("apdcMcUnlocked","yes");gate.classList.add("hidden");box.classList.remove("hidden")}
btn.onclick=()=>pass.value===PASSWORD?unlock():msg.textContent="WRONG PASSWORD";
pass.onkeydown=e=>{if(e.key==="Enter")btn.click()};
if(sessionStorage.getItem("apdcMcUnlocked")==="yes")unlock();

const enc=k=>btoa(unescape(encodeURIComponent(k))).replaceAll("=","");
let active=null;
let order=[];
let judgeWatchUnsub=null;
let switching=false;
let floorValue={};

const nowEl=document.getElementById("mcNow");
const roundEl=document.getElementById("mcRound");
const koEl=document.getElementById("mcKorean");
const enEl=document.getElementById("mcEnglish");
const eventSelect=document.getElementById("mcEventSelect");
const currentNoEl=document.getElementById("mcCurrentEventNo");
const navMessage=document.getElementById("mcNavMessage");

function roundCode(v){
 const x=String(v||"").toLowerCase();
 if(x.includes("quarter"))return "quarter";
 if(x.includes("semi"))return "semi";
 if(x.includes("final"))return "final";
 if(x.includes("formation"))return "final";
 return "special";
}
function rtext(r){
 const x=roundCode(r);
 if(x==="quarter")return "Quarter Final";
 if(x==="semi")return "Semi Final";
 if(x==="final")return "Final";
 return String(r||"");
}
function eventKeyFor(s){return `${s.event||""}||${s.section||""}||${s.style||""}`}
function eventLabel(s){return `${s.eventNumber?`EVENT ${s.eventNumber} · `:""}${s.event||s.label||""}`.trim()}
function normalize(s){return String(s||"").toLowerCase().replace(/event\s*\d+/g,"").replace(/quarter\s*final|semi\s*final|final/g,"").replace(/[^a-z0-9가-힣]/g,"")}
function toOrderRow(r){
 return {
   eventNumber:String(r.no||r.eventNumber||""),
   event:r.event||r.label||"",
   section:r.section||"",
   style:r.style||"",
   division:r.division||"",
   round:roundCode(r.round),
   roundLabel:r.round||rtext(r.round),
   start:r.start||"",
   entries:r.entries||"",
   danceOrder:r.danceOrder||"",
   eventKey:eventKeyFor(r)
 };
}

function activeIndex(){
 if(!active||!order.length)return -1;
 let i=order.findIndex(x=>String(x.eventNumber)===String(active.eventNumber||""));
 if(i<0 && active.eventKey)i=order.findIndex(x=>x.eventKey===active.eventKey && x.round===roundCode(active.round));
 if(i<0)i=order.findIndex(x=>normalize(x.event)===normalize(active.label||active.event));
 return i;
}
function setScripts(){
 if(!active){koEl.textContent="다음 경기 준비.";enEl.textContent="Please get ready for the next event.";return}
 const no=active.eventNumber||"";
 const kr=roundCode(active.round)==="quarter"?"쿼터 파이널":roundCode(active.round)==="semi"?"세미 파이널":roundCode(active.round)==="final"?"파이널":"";
 koEl.textContent=`다음 경기는 EVENT ${no}${kr?` ${kr}`:""}입니다. 선수 입장. 심사위원 여러분, 준비 부탁드립니다.`.replace(/\s+/g," ").trim();
 enEl.textContent=`Next is EVENT ${no}. ${rtext(active.round)}. Players, please come to the floor. Judges, please get ready.`.replace(/\s+/g," ").trim();
}
function renderActive(){
 if(!active){nowEl.textContent="WAITING";roundEl.textContent="";setScripts();progress();return}
 nowEl.textContent=active.event?`${active.section?`${active.section} · `:""}${active.event}`:(active.label||"");
 roundEl.textContent=rtext(active.round);
 setScripts();progress();watchJudges(active);
}
function progress(){
 const i=activeIndex(),t=order.length,shown=i>=0?i+1:0;
 document.getElementById("mcProgressText").textContent=`${shown} / ${t} EVENTS`;
 document.getElementById("mcProgressBar").style.width=t&&shown?`${shown/t*100}%`:"0%";
 currentNoEl.textContent=active?.eventNumber?`EVENT ${active.eventNumber}`:"—";
 if(eventSelect&&i>=0)eventSelect.value=String(i);
 updateNavButtons();
}
function updateNavButtons(){
 const i=activeIndex(),has=order.length>0;
 document.getElementById("mcFirstBtn").disabled=!has||i===0||switching;
 document.getElementById("mcPrevBtn").disabled=!has||i<=0||switching;
 document.getElementById("mcNextBtn").disabled=!has||i<0||i>=order.length-1||switching;
 document.getElementById("mcLastBtn").disabled=!has||i===order.length-1||switching;
 if(eventSelect)eventSelect.disabled=!has||switching;
}
async function watchJudges(a){
 if(judgeWatchUnsub){judgeWatchUnsub();judgeWatchUnsub=null}
 if(!a?.eventKey)return;
 const e=enc(a.eventKey);
 const s=await get(ref(db,`eventSettings/${e}`));
 const assigned=s.val()?.assignedJudges||[];
 judgeWatchUnsub=onValue(ref(db,`submissions/${e}_${roundCode(a.round)||"final"}`),snap=>{
  const v=snap.val()||{},done=assigned.filter(c=>v[c]),wait=assigned.filter(c=>!v[c]);
  document.getElementById("mcJudgeCount").textContent=`${done.length} / ${assigned.length} DONE`;
  document.getElementById("mcWaitingJudges").textContent=assigned.length?(wait.length?`Waiting for Judges: ${wait.join(", ")}`:"JUDGES ARE DONE."):"NO JUDGES ASSIGNED";
 });
}
function makeFloorItem(s){
 if(!s)return {label:"",eventNumber:"",eventKey:"",round:"",event:"",section:"",start:""};
 return {label:eventLabel(s),eventNumber:String(s.eventNumber||""),eventKey:s.eventKey||"",round:roundCode(s.round),event:s.event||"",section:s.section||"",start:s.start||""};
}
async function publishEventAt(index){
 if(switching||index<0||index>=order.length)return;
 switching=true;updateNavButtons();navMessage.textContent="UPDATING LIVE…";
 try{
  const current=order[index],deck=order[index+1],next=order[index+2];
  const nowItem=makeFloorItem(current),deckItem=makeFloorItem(deck),nextItem=makeFloorItem(next),updatedAt=Date.now();
  await Promise.all([
   set(ref(db,"activeEvent"),{eventKey:current.eventKey,label:nowItem.label,round:current.round,eventNumber:current.eventNumber,section:current.section,event:current.event,start:current.start,updatedAt,source:"mc"}),
   set(ref(db,"floorStatus"),{now:nowItem.label,onDeck:deckItem.label,next:nextItem.label,nowEventNumber:nowItem.eventNumber,onDeckEventNumber:deckItem.eventNumber,nextEventNumber:nextItem.eventNumber,nowEventKey:nowItem.eventKey,onDeckEventKey:deckItem.eventKey,nextEventKey:nextItem.eventKey,nowRound:nowItem.round,onDeckRound:deckItem.round,nextRound:nextItem.round,updatedAt,source:"mc"}),
   set(ref(db,"publicLiveState"),{current:nowItem,onDeck:deckItem,next:nextItem,currentIndex:index,totalEvents:order.length,updatedAt,source:"mc"})
  ]);
  active={...current,label:nowItem.label};renderActive();navMessage.textContent=`LIVE · EVENT ${current.eventNumber}`;
 }catch(err){console.error(err);navMessage.textContent="LIVE UPDATE FAILED"}
 finally{switching=false;updateNavButtons()}
}
function buildEventSelector(){
 if(!eventSelect)return;
 eventSelect.innerHTML=order.map((s,i)=>`<option value="${i}">EVENT ${s.eventNumber} · ${s.event} · ${rtext(s.round)}</option>`).join("");
 const i=activeIndex();if(i>=0)eventSelect.value=String(i);
}
function matchFloorToOrder(v){
 if(!order.length)return null;
 const no=String(v?.nowEventNumber||"").trim();
 if(no){const x=order.find(s=>s.eventNumber===no);if(x)return x}
 const n=normalize(v?.now||"");
 if(!n)return null;
 return order.find(s=>normalize(s.event)===n || n.includes(normalize(s.event)) || normalize(s.event).includes(n))||null;
}
async function loadRunningOrder(){
 try{
  const response=await fetch(`timetable-data.json?v=${Date.now()}`,{cache:"no-store"});
  if(!response.ok)throw new Error(`TIMETABLE HTTP ${response.status}`);
  const data=await response.json();
  order=(Array.isArray(data)?data:(data.rows||[])).filter(r=>String(r.no||r.eventNumber||"").trim()!=="").map(toOrderRow).sort((a,b)=>Number(a.eventNumber)-Number(b.eventNumber));
  buildEventSelector();
  const [floorSnap,publicSnap,activeSnap]=await Promise.all([get(ref(db,"floorStatus")),get(ref(db,"publicLiveState")),get(ref(db,"activeEvent"))]);
  floorValue=floorSnap.val()||{};
  const publicCurrent=publicSnap.val()?.current||null;
  const floorMatch=matchFloorToOrder(floorValue);
  let chosen=floorMatch;
  if(!chosen && publicCurrent?.eventNumber)chosen=order.find(s=>s.eventNumber===String(publicCurrent.eventNumber));
  if(!chosen){const av=activeSnap.val(); if(av?.eventNumber)chosen=order.find(s=>s.eventNumber===String(av.eventNumber));}
  active=chosen?{...chosen,label:eventLabel(chosen)}:null;
  renderActive();
  navMessage.textContent=order.length?`TIMETABLE READY · ${order.length} EVENTS`:"NO TIMETABLE EVENTS";
 }catch(err){console.error(err);order=[];buildEventSelector();progress();navMessage.textContent="TIMETABLE LOAD FAILED"}
}

onValue(ref(db,"activeEvent"),snap=>{
 const v=snap.val();
 if(!v||!order.length)return;
 const matched=(v.eventNumber?order.find(s=>s.eventNumber===String(v.eventNumber)):null)||order.find(s=>s.eventKey===v.eventKey&&s.round===roundCode(v.round));
 active=matched?{...matched,label:v.label||eventLabel(matched)}:v;
 renderActive();
});
onValue(ref(db,"floorStatus"),snap=>{
 floorValue=snap.val()||{};
 document.getElementById("mcOnDeck").textContent=floorValue.onDeck||"—";
 document.getElementById("mcNext").textContent=floorValue.next||"—";
 // The public LIVE state wins over an old/stale activeEvent when the MC page first opens.
 const match=matchFloorToOrder(floorValue);
 if(match && activeIndex()<0){active={...match,label:eventLabel(match)};renderActive()}
});

document.getElementById("mcFirstBtn").onclick=()=>publishEventAt(0);
document.getElementById("mcPrevBtn").onclick=()=>{const i=activeIndex();publishEventAt(i>0?i-1:0)};
document.getElementById("mcNextBtn").onclick=()=>{const i=activeIndex();publishEventAt(i>=0?i+1:0)};
document.getElementById("mcLastBtn").onclick=()=>publishEventAt(order.length-1);
eventSelect.onchange=()=>publishEventAt(Number(eventSelect.value));
document.querySelectorAll("[data-copy]").forEach(b=>b.onclick=async()=>{await navigator.clipboard.writeText(document.getElementById(b.dataset.copy).textContent);b.textContent="COPIED";setTimeout(()=>b.textContent="COPY",800)});
document.querySelectorAll(".quick-line-grid button").forEach(b=>b.onclick=()=>{koEl.textContent=b.dataset.ko;enEl.textContent=b.dataset.en});

loadRunningOrder();

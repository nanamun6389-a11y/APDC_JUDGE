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
let eventSettingsReady=false;
let judgeWatchUnsub=null;
let switching=false;

const nowEl=document.getElementById("mcNow");
const roundEl=document.getElementById("mcRound");
const koEl=document.getElementById("mcKorean");
const enEl=document.getElementById("mcEnglish");
const eventSelect=document.getElementById("mcEventSelect");
const currentNoEl=document.getElementById("mcCurrentEventNo");
const navMessage=document.getElementById("mcNavMessage");

function rtext(r){return r==="quarter"?"Quarter Final":r==="semi"?"Semi Final":r==="final"?"Final":r||""}
function eventLabel(s){return `${s.eventNumber?`EVENT ${s.eventNumber} · `:""}${s.section||""}${s.section&&s.event?" · ":""}${s.event||s.label||""}`.trim()}
function numericEventNo(s){const n=Number(s?.eventNumber);return Number.isFinite(n)?n:Number.MAX_SAFE_INTEGER}

function setScripts(){
  if(!active){koEl.textContent="다음 경기 준비.";enEl.textContent="Please get ready for the next event.";return}
  const kr=active.round==="quarter"?"쿼터 파이널":active.round==="semi"?"세미 파이널":"파이널";
  koEl.textContent=`다음 경기는 EVENT ${active.eventNumber||""} ${kr}입니다. 선수 입장. 심사위원 여러분, 준비 부탁드립니다.`.replace(/\s+/g," ").trim();
  enEl.textContent=`Next is EVENT ${active.eventNumber||""}. ${rtext(active.round)}. Players, please come to the floor. Judges, please get ready.`.replace(/\s+/g," ").trim();
}

function activeIndex(){
  if(!active||!order.length)return -1;
  let i=order.findIndex(x=>x.eventKey===active.eventKey && String(x.eventNumber||"")===String(active.eventNumber||""));
  if(i<0)i=order.findIndex(x=>x.eventKey===active.eventKey);
  return i;
}

function progress(){
  const i=activeIndex();
  const t=order.length;
  const shown=i>=0?i+1:0;
  document.getElementById("mcProgressText").textContent=`${shown} / ${t} EVENTS`;
  document.getElementById("mcProgressBar").style.width=t&&shown?`${shown/t*100}%`:"0%";
  currentNoEl.textContent=active?.eventNumber?`EVENT ${active.eventNumber}`:"—";
  if(eventSelect&&i>=0)eventSelect.value=String(i);
  updateNavButtons();
}

function updateNavButtons(){
  const i=activeIndex();
  const has=order.length>0;
  document.getElementById("mcFirstBtn").disabled=!has||i===0||switching;
  document.getElementById("mcPrevBtn").disabled=!has||i<=0||switching;
  document.getElementById("mcNextBtn").disabled=!has||i<0||i>=order.length-1||switching;
  document.getElementById("mcLastBtn").disabled=!has||i===order.length-1||switching;
  if(eventSelect)eventSelect.disabled=!has||switching;
}

async function watchJudges(a){
  if(judgeWatchUnsub){judgeWatchUnsub();judgeWatchUnsub=null;}
  if(!a?.eventKey)return;
  const e=enc(a.eventKey);
  const s=await get(ref(db,`eventSettings/${e}`));
  const assigned=s.val()?.assignedJudges||[];
  judgeWatchUnsub=onValue(ref(db,`submissions/${e}_${a.round||"final"}`),snap=>{
    const v=snap.val()||{};
    const done=assigned.filter(c=>v[c]);
    const wait=assigned.filter(c=>!v[c]);
    document.getElementById("mcJudgeCount").textContent=`${done.length} / ${assigned.length} DONE`;
    document.getElementById("mcWaitingJudges").textContent=assigned.length?(wait.length?`Waiting for Judges: ${wait.join(", ")}`:"JUDGES ARE DONE."):"NO JUDGES ASSIGNED";
  });
}

function makeFloorItem(s){
  if(!s)return {label:"",eventNumber:"",eventKey:"",round:""};
  return {label:eventLabel(s),eventNumber:String(s.eventNumber||""),eventKey:s.eventKey||"",round:s.round||"final"};
}

async function publishEventAt(index){
  if(switching||index<0||index>=order.length)return;
  switching=true;
  updateNavButtons();
  navMessage.textContent="UPDATING LIVE…";
  try{
    const current=order[index];
    const deck=order[index+1];
    const next=order[index+2];
    const nowItem=makeFloorItem(current);
    const deckItem=makeFloorItem(deck);
    const nextItem=makeFloorItem(next);
    const updatedAt=Date.now();

    // One MC action updates both the operating state and the public live state.
    await Promise.all([
      set(ref(db,"activeEvent"),{
        eventKey:current.eventKey,
        label:nowItem.label,
        round:current.round||"final",
        eventNumber:String(current.eventNumber||""),
        section:current.section||"",
        event:current.event||"",
        updatedAt,
        source:"mc"
      }),
      set(ref(db,"floorStatus"),{
        now:nowItem.label,
        onDeck:deckItem.label,
        next:nextItem.label,
        nowEventNumber:nowItem.eventNumber,
        onDeckEventNumber:deckItem.eventNumber,
        nextEventNumber:nextItem.eventNumber,
        nowEventKey:nowItem.eventKey,
        onDeckEventKey:deckItem.eventKey,
        nextEventKey:nextItem.eventKey,
        nowRound:nowItem.round,
        onDeckRound:deckItem.round,
        nextRound:nextItem.round,
        updatedAt,
        source:"mc"
      }),
      // Future public timetable in the APDC GitHub repo can listen to this path directly.
      set(ref(db,"publicLiveState"),{
        current:nowItem,
        onDeck:deckItem,
        next:nextItem,
        currentIndex:index,
        totalEvents:order.length,
        updatedAt,
        source:"mc"
      })
    ]);
    navMessage.textContent=`LIVE · EVENT ${current.eventNumber||""}`;
  }catch(err){
    console.error(err);
    navMessage.textContent="LIVE UPDATE FAILED";
  }finally{
    switching=false;
    updateNavButtons();
  }
}

function buildEventSelector(){
  if(!eventSelect)return;
  eventSelect.innerHTML=order.map((s,i)=>`<option value="${i}">EVENT ${s.eventNumber} · ${s.event}</option>`).join("");
  const i=activeIndex();
  if(i>=0)eventSelect.value=String(i);
}

async function loadRunningOrder(){
  const snap=await get(ref(db,"eventSettings"));
  order=Object.values(snap.val()||{})
    .filter(x=>String(x.eventNumber||"").trim()!=="")
    .sort((a,b)=>numericEventNo(a)-numericEventNo(b));
  eventSettingsReady=true;
  buildEventSelector();
  progress();
  if(!order.length)navMessage.textContent="NO EVENT NUMBERS SET";
}

onValue(ref(db,"activeEvent"),snap=>{
  active=snap.val();
  if(!active){
    nowEl.textContent="WAITING";
    roundEl.textContent="";
    setScripts();
    progress();
    return;
  }
  nowEl.textContent=active.label||"";
  roundEl.textContent=rtext(active.round);
  setScripts();
  progress();
  watchJudges(active);
});

onValue(ref(db,"floorStatus"),snap=>{
  const v=snap.val()||{};
  document.getElementById("mcOnDeck").textContent=v.onDeck||"—";
  document.getElementById("mcNext").textContent=v.next||"—";
});

document.getElementById("mcFirstBtn").onclick=()=>publishEventAt(0);
document.getElementById("mcPrevBtn").onclick=()=>{const i=activeIndex();publishEventAt(i>0?i-1:0)};
document.getElementById("mcNextBtn").onclick=()=>{const i=activeIndex();publishEventAt(i>=0?i+1:0)};
document.getElementById("mcLastBtn").onclick=()=>publishEventAt(order.length-1);
eventSelect.onchange=()=>publishEventAt(Number(eventSelect.value));

document.querySelectorAll("[data-copy]").forEach(b=>b.onclick=async()=>{await navigator.clipboard.writeText(document.getElementById(b.dataset.copy).textContent);b.textContent="COPIED";setTimeout(()=>b.textContent="COPY",800)});
document.querySelectorAll(".quick-line-grid button").forEach(b=>b.onclick=()=>{koEl.textContent=b.dataset.ko;enEl.textContent=b.dataset.en});

loadRunningOrder();

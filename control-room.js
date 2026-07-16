import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

apdcBuildLanguageUI();

const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);
const db=getDatabase(app);
const PASSWORD="0808";
const encodeKey=k=>btoa(unescape(encodeURIComponent(k))).replaceAll("=","");

const gate=document.getElementById("controlPasswordGate");
const protectedBox=document.getElementById("controlProtected");
const pass=document.getElementById("controlPasswordInput");
const passBtn=document.getElementById("controlPasswordBtn");
const passMsg=document.getElementById("controlPasswordMessage");

function unlock(){
  sessionStorage.setItem("apdcControlUnlocked","yes");
  gate.classList.add("hidden");
  protectedBox.classList.remove("hidden");
}
passBtn.onclick=()=>{
  if(pass.value===PASSWORD)unlock();
  else passMsg.textContent="WRONG PASSWORD";
};
pass.onkeydown=e=>{if(e.key==="Enter")passBtn.click()};
if(sessionStorage.getItem("apdcControlUnlocked")==="yes")unlock();

const nowEl=document.getElementById("controlNow");
const roundEl=document.getElementById("controlRound");
const completeEl=document.getElementById("controlComplete");
const countEl=document.getElementById("controlCount");
const judgesEl=document.getElementById("controlJudgeStatus");
const deckEl=document.getElementById("controlOnDeck");
const nextEl=document.getElementById("controlNext");
const autoEl=document.getElementById("controlAutoStatus");
const updatedEl=document.getElementById("controlUpdated");

let activeEvent=null;
let submissionUnsub=null;

function roundLabel(round){
  if(round==="quarter")return"QUARTER FINAL";
  if(round==="semi")return"SEMI FINAL";
  if(round==="final")return"FINAL";
  return String(round||"").toUpperCase();
}
function timeLabel(ts){
  if(!ts)return"—";
  const d=new Date(ts);
  return d.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"});
}

async function watchSubmissions(active){
  if(submissionUnsub){submissionUnsub();submissionUnsub=null;}
  if(!active||!active.eventKey)return;

  const encoded=encodeKey(active.eventKey);
  const settingsSnap=await get(ref(db,`eventSettings/${encoded}`));
  const setting=settingsSnap.val()||{};
  const assigned=setting.assignedJudges||[];

  const path=`submissions/${encoded}_${active.round||"final"}`;
  submissionUnsub=onValue(ref(db,path),snap=>{
    const submitted=snap.val()||{};
    const done=assigned.filter(code=>submitted[code]);
    countEl.textContent=`${done.length} / ${assigned.length} SUBMITTED`;
    completeEl.textContent=assigned.length>0&&done.length===assigned.length?"COMPLETE ✓":"IN PROGRESS";
    completeEl.classList.toggle("complete",assigned.length>0&&done.length===assigned.length);

    judgesEl.innerHTML=assigned.length?assigned.map(code=>{
      const ok=Boolean(submitted[code]);
      return `<div class="control-judge ${ok?"submitted":"waiting"}">
        <span>${ok?"✓":"!"}</span>
        <strong>${code}</strong>
        <small>${ok?"SUBMITTED":"WAITING"}</small>
      </div>`;
    }).join(""):'<div class="control-empty">NO JUDGES ASSIGNED</div>';

    const waiting=assigned.filter(code=>!submitted[code]);
    autoEl.textContent=waiting.length?`WAITING FOR ${waiting.join(", ")}`:"READY TO ADVANCE";
    autoEl.classList.toggle("warning",waiting.length>0);
  });
}

onValue(ref(db,"activeEvent"),snap=>{
  activeEvent=snap.val();
  if(!activeEvent){
    nowEl.textContent="WAITING";
    roundEl.textContent="";
    completeEl.textContent="IN PROGRESS";
    judgesEl.innerHTML='<div class="control-empty">NO ACTIVE EVENT</div>';
    return;
  }
  nowEl.textContent=activeEvent.label||"";
  roundEl.textContent=roundLabel(activeEvent.round);
  updatedEl.textContent=timeLabel(activeEvent.updatedAt);
  watchSubmissions(activeEvent);
});

onValue(ref(db,"floorStatus"),snap=>{
  const v=snap.val()||{};
  deckEl.textContent=v.onDeck||"—";
  nextEl.textContent=v.next||"—";
  if(v.updatedAt)updatedEl.textContent=timeLabel(v.updatedAt);
});

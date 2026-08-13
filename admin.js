apdcBuildLanguageUI();
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref as firebaseRef, set, get, onValue, remove } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";
import { competitionPath, competitionId, isLegacyCompetition } from "./competition-context.js";
const ref=(db,path)=>firebaseRef(db, path===".info/connected"?path:competitionPath(path));

const BASE_EVENTS=[{"eventKey": "Ama Rising Star Latin||Amateur||Latin", "eventNumber": "", "event": "Ama Rising Star Latin", "section": "Amateur", "style": "Latin", "assignedJudges": []}, {"eventKey": "Amateur Latin||Amateur||Latin", "eventNumber": "", "event": "Amateur Latin", "section": "Amateur", "style": "Latin", "assignedJudges": []}, {"eventKey": "Amateur Solo Latin||Amateur||Latin", "eventNumber": "", "event": "Amateur Solo Latin", "section": "Amateur", "style": "Latin", "assignedJudges": []}, {"eventKey": "Asia Pacific Amateur Solo Latin 5 Dance||Amateur||Latin", "eventNumber": "", "event": "Asia Pacific Amateur Solo Latin 5 Dance", "section": "Amateur", "style": "Latin", "assignedJudges": []}, {"eventKey": "Formation||Formation||Other", "eventNumber": "", "event": "Formation", "section": "Formation", "style": "Other", "assignedJudges": []}, {"eventKey": "Mania Latin CR||Mania||Latin", "eventNumber": "", "event": "Mania Latin CR", "section": "Mania", "style": "Latin", "assignedJudges": []}, {"eventKey": "Mania Latin CRS||Mania||Latin", "eventNumber": "", "event": "Mania Latin CRS", "section": "Mania", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo 5 Dance||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo 5 Dance", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo C||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo C", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo CR||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo CR", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo CRS||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo CRS", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo Latin 5 Dance||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo Latin 5 Dance", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo Latin CRS||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo Latin CRS", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo P||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo P", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo R||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo R", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo RJ||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo RJ", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo S||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo S", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo T||Over 19||Modern", "eventNumber": "", "event": "Over 19 Solo T", "section": "Over 19", "style": "Modern", "assignedJudges": []}, {"eventKey": "Over 19 Solo W||Over 19||Modern", "eventNumber": "", "event": "Over 19 Solo W", "section": "Over 19", "style": "Modern", "assignedJudges": []}, {"eventKey": "Over 19 Solo WTF||Over 19||Modern", "eventNumber": "", "event": "Over 19 Solo WTF", "section": "Over 19", "style": "Modern", "assignedJudges": []}, {"eventKey": "Over 19 Solo WTFQ||Over 19||Modern", "eventNumber": "", "event": "Over 19 Solo WTFQ", "section": "Over 19", "style": "Modern", "assignedJudges": []}, {"eventKey": "Over 19 Solo WTQ||Over 19||Modern", "eventNumber": "", "event": "Over 19 Solo WTQ", "section": "Over 19", "style": "Modern", "assignedJudges": []}, {"eventKey": "Over 35 Solo C||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo C", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo CR||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo CR", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo CRJ||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo CRJ", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo CRS||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo CRS", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo CSR||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo CSR", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo R||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo R", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo S||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo S", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Pro-Am Standard 3 Dance||Pro-Am||Modern", "eventNumber": "", "event": "Pro-Am Standard 3 Dance", "section": "Pro-Am", "style": "Modern", "assignedJudges": []}, {"eventKey": "Senior 50 CR||Senior||Other", "eventNumber": "", "event": "Senior 50 CR", "section": "Senior", "style": "Other", "assignedJudges": []}, {"eventKey": "Under 10 Solo C||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo C", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo CR||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo CR", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo CRJ||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo CRJ", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo CRS||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo CRS", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo J||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo J", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo P||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo P", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo R||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo R", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo RJ||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo RJ", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo S||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo S", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo F||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo F", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo Q||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo Q", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo T||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo T", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo W||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo W", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo WQ||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo WQ", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo WT||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo WT", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo WTF||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo WTF", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo WTQ||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo WTQ", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 CRS||Under 12||Latin", "eventNumber": "", "event": "Under 12 CRS", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo C||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo C", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo CJ||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo CJ", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo CR||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo CR", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo CRJ||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo CRJ", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo CRS||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo CRS", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo J||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo J", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo P||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo P", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo R||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo R", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo RJ||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo RJ", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo S||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo S", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo F||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo F", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo Q||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo Q", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo T||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo T", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo W||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo W", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo WQ||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo WQ", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo WT||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo WT", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo WTF||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo WTF", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo WTFQ||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo WTFQ", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo WTQ||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo WTQ", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 WTF||Under 12||Modern", "eventNumber": "", "event": "Under 12 WTF", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 CRS||Under 15||Latin", "eventNumber": "", "event": "Under 15 CRS", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CSRJ||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CSRJ", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo C||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo C", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CJ||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CJ", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CR||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CR", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CRJ||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CRJ", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CRS||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CRS", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CSR||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CSR", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo J||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo J", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo P||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo P", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo R||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo R", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo RJ||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo RJ", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo S||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo S", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo F||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo F", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo Q||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo Q", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo T||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo T", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo W||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo W", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo WQ||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo WQ", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo WT||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo WT", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo WTF||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo WTF", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo WTFQ||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo WTFQ", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo WTQ||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo WTQ", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 WTF||Under 15||Modern", "eventNumber": "", "event": "Under 15 WTF", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo 5 Dance||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo 5 Dance", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo C||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo C", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo CJ||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo CJ", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo CR||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo CR", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo CRJ||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo CRJ", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo CRS||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo CRS", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo CSR||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo CSR", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo Elite A Latin||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo Elite A Latin", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo J||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo J", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo P||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo P", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo R||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo R", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo RJ||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo RJ", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo S||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo S", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo F||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo F", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo Q||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo Q", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo T||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo T", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo W||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo W", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo WQ||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo WQ", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo WT||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo WT", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo WTF||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo WTF", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo WTFQ||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo WTFQ", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo WTQ||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo WTQ", "section": "Under 18", "style": "Modern", "assignedJudges": []}];
let customEvents={};
let EVENTS=[...BASE_EVENTS];

const JUDGES=[
{code:"T1",name:"Raymond KIM"},{code:"T2",name:"Lorencia"},{code:"T3",name:"Marcus"},{code:"T4",name:"Crystal"},
{code:"T5",name:"Tomohiro"},{code:"T6",name:"Annie Oo"},{code:"T7",name:"Nancy Chang"},{code:"T8",name:"Max Yim"},
{code:"W1",name:"이종률"},{code:"W2",name:"김도영"},{code:"W3",name:"엄혜리"},{code:"W4",name:"구채림"},
{code:"W5",name:"고재호"},{code:"W6",name:"임채성"},{code:"W7",name:"은일"},{code:"W8",name:"블라디"},{code:"W9",name:"이세영"}];

const app=initializeApp(firebaseConfig);
const db=getDatabase(app);
const encodeKey=k=>btoa(unescape(encodeURIComponent(k))).replaceAll("=","");

const gate=document.getElementById("adminPasswordGate");
const protectedBox=document.getElementById("adminProtected");
const passInput=document.getElementById("adminPasswordInput");
const passBtn=document.getElementById("adminPasswordBtn");
const passMsg=document.getElementById("adminPasswordMessage");
function unlock(){sessionStorage.setItem("apdcAdminUnlocked","yes");gate.classList.add("hidden");protectedBox.classList.remove("hidden");}
passBtn.onclick=()=>{if(passInput.value==="0808")unlock();else passMsg.textContent="WRONG PASSWORD";};
passInput.onkeydown=e=>{if(e.key==="Enter")passBtn.click();};
if(sessionStorage.getItem("apdcAdminUnlocked")==="yes")unlock();

const setupEvent=document.getElementById("setupEvent");
const setupEventNumber=document.getElementById("setupEventNumber");
const setupRound=document.getElementById("setupRound");
const judgeChecks=document.getElementById("judgeChecks");
const setupMessage=document.getElementById("setupMessage");
const adminEvent=document.getElementById("adminEvent");
const adminRound=document.getElementById("adminRound");
const judgeGroup=document.getElementById("judgeGroup");

const plainLabel=e=>`${e.section} · ${e.event}`;
function refreshEventSources(){
  EVENTS=[...BASE_EVENTS,...Object.values(customEvents||{}).filter(Boolean)].filter((e,i,a)=>a.findIndex(x=>eventId(x)===eventId(e))===i);
  if(setupEvent) setupEvent.innerHTML=EVENTS.map(e=>`<option value="${e.eventKey}">${plainLabel(e)}</option>`).join("");
  if(adminEvent) adminEvent.innerHTML=EVENTS.map(e=>`<option value="${e.eventKey}">${plainLabel(e)}</option>`).join("");
  renderEventChecks(); renderCustomEventList();
}
judgeChecks.innerHTML=JUDGES.map(j=>`<label class="judge-check"><input type="checkbox" value="${j.code}"><span>${j.code} · ${j.name}</span></label>`).join("");


// ===== ENTRY MANAGEMENT (V5 · PLAYER MULTI-EVENT) =====
const entryBackNo=document.getElementById("entryBackNo");
const entryName=document.getElementById("entryName");
const entryList=document.getElementById("entryList");
const entryCount=document.getElementById("entryCount");
const entryMessage=document.getElementById("entryMessage");
const saveEntryBtn=document.getElementById("saveEntryBtn");
const cancelEntryEditBtn=document.getElementById("cancelEntryEditBtn");
const entryEventChecks=document.getElementById("entryEventChecks");
const entryEventSearch=document.getElementById("entryEventSearch");
const entrySelectedCount=document.getElementById("entrySelectedCount");
const entrySelectAllBtn=document.getElementById("entrySelectAllBtn");
const entryClearAllBtn=document.getElementById("entryClearAllBtn");
let competitionEntries={};
let editingPlayerKeys=[];
let editingOriginalBackNo="";

function firebaseSafeKey(){ return `entry_${Date.now()}_${Math.random().toString(36).slice(2,9)}`; }
function entryTypeFor(event){
  if(!event) return "Solo";
  if(/formation/i.test(event.event)) return "Formation";
  if(/amateur latin|rising star|couple|pro-am/i.test(event.event) && !/solo/i.test(event.event)) return "Couple";
  return "Solo";
}
function eventId(e){ return `${e.event}||${e.section}||${e.style}`; }
function selectedEventIds(){
  return [...entryEventChecks.querySelectorAll('input[type="checkbox"]:checked')].map(x=>x.value);
}
function updateSelectedCount(){
  const n=selectedEventIds().length;
  if(entrySelectedCount) entrySelectedCount.textContent=`${n} SELECTED`;
}
function renderEventChecks(){
  if(!entryEventChecks) return;
  const q=(entryEventSearch?.value||"").trim().toLowerCase();
  const selected=new Set(selectedEventIds());
  entryEventChecks.innerHTML=EVENTS.map((e,i)=>{
    const label=`${e.section} · ${e.event}`;
    const show=!q || label.toLowerCase().includes(q);
    const id=`entryEventCheck_${i}`;
    return `<label class="entry-event-check ${show?'':'hidden-by-search'}" data-event-label="${label.toLowerCase()}">
      <input id="${id}" type="checkbox" value="${eventId(e)}" ${selected.has(eventId(e))?'checked':''}>
      <span><b>${e.event}</b><small>${e.section} · ${e.style}</small></span>
    </label>`;
  }).join("");
  updateSelectedCount();
}
entryEventChecks?.addEventListener("change",updateSelectedCount);
entryEventSearch?.addEventListener("input",()=>{
  const q=(entryEventSearch.value||"").trim().toLowerCase();
  entryEventChecks.querySelectorAll('.entry-event-check').forEach(el=>{
    el.classList.toggle('hidden-by-search', q && !String(el.dataset.eventLabel||'').includes(q));
  });
});
entrySelectAllBtn?.addEventListener("click",()=>{
  entryEventChecks.querySelectorAll('.entry-event-check:not(.hidden-by-search) input[type="checkbox"]').forEach(x=>x.checked=true);
  updateSelectedCount();
});
entryClearAllBtn?.addEventListener("click",()=>{
  entryEventChecks.querySelectorAll('input[type="checkbox"]').forEach(x=>x.checked=false);
  updateSelectedCount();
});


// ===== EVENT CATALOG MANAGEMENT (V10) =====
const customEventName=document.getElementById("customEventName");
const customEventSection=document.getElementById("customEventSection");
const customEventStyle=document.getElementById("customEventStyle");
const customEventSaveBtn=document.getElementById("customEventSaveBtn");
const customEventCancelBtn=document.getElementById("customEventCancelBtn");
const customEventList=document.getElementById("customEventList");
const customEventMessage=document.getElementById("customEventMessage");
let editingCustomEventId="";
function customId(){return `event_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;}
function renderCustomEventList(){
  if(!customEventList)return;
  const rows=Object.entries(customEvents||{}).filter(([,x])=>x);
  customEventList.innerHTML=rows.length?rows.map(([id,x])=>`<div class="custom-event-row"><div><b>${x.event}</b><small>${x.section} · ${x.style}</small></div><div><button type="button" class="light" data-event-edit="${id}">EDIT</button><button type="button" class="light delete" data-event-delete="${id}">DELETE</button></div></div>`).join(""):'<div class="entry-empty">추가한 새 이벤트가 없습니다.</div>';
}
function resetCustomEventForm(){editingCustomEventId=""; if(customEventName)customEventName.value="";if(customEventSection)customEventSection.value="";if(customEventStyle)customEventStyle.value="Latin";customEventSaveBtn.textContent="+ NEW EVENT 저장";customEventCancelBtn?.classList.add("hidden");}
customEventCancelBtn?.addEventListener("click",resetCustomEventForm);
customEventSaveBtn?.addEventListener("click",async()=>{
  const event=customEventName.value.trim(),section=customEventSection.value.trim(),style=customEventStyle.value;
  if(!event||!section){customEventMessage.textContent="EVENT NAME과 SECTION을 입력하세요.";return;}
  const id=editingCustomEventId||customId(); const old=editingCustomEventId?customEvents[id]:null;
  const item={id,event,section,style,eventKey:`custom:${id}`,eventNumber:old?.eventNumber||"",assignedJudges:old?.assignedJudges||[],custom:true,updatedAt:Date.now()};
  if(EVENTS.some(e=>eventId(e)===eventId(item) && (!old||eventId(e)!==eventId(old)))){customEventMessage.textContent="같은 이벤트가 이미 있습니다.";return;}
  if(old && eventId(old)!==eventId(item)){
    // Rename/move: migrate every existing entry so players never lose their event.
    for(const [key,x] of Object.entries(competitionEntries||{})) if(x&&eventId(x)===eventId(old)) await set(ref(db,`entries/${key}`),{...x,event:item.event,section:item.section,style:item.style,division:item.event,updatedAt:Date.now()});
  }
  await set(ref(db,`customEvents/${id}`),item); customEventMessage.textContent=old?"이벤트 수정 완료":"새 이벤트 추가 완료"; resetCustomEventForm();
});
customEventList?.addEventListener("click",async e=>{
  const eb=e.target.closest("[data-event-edit]"), dbtn=e.target.closest("[data-event-delete]");
  if(eb){const id=eb.dataset.eventEdit,x=customEvents[id];if(!x)return;editingCustomEventId=id;customEventName.value=x.event;customEventSection.value=x.section;customEventStyle.value=x.style||"Latin";customEventSaveBtn.textContent="SAVE EVENT CHANGES";customEventCancelBtn.classList.remove("hidden");customEventName.scrollIntoView({behavior:"smooth",block:"center"});}
  if(dbtn){const id=dbtn.dataset.eventDelete,x=customEvents[id];if(!x)return;const affected=Object.entries(competitionEntries||{}).filter(([,r])=>r&&eventId(r)===eventId(x));if(!confirm(`${x.event} 이벤트를 삭제할까요?\n등록된 엔트리 ${affected.length}개도 함께 삭제됩니다.`))return;for(const [key] of affected)await remove(ref(db,`entries/${key}`));await remove(ref(db,`customEvents/${id}`));customEventMessage.textContent="이벤트 삭제 완료";}
});
onValue(ref(db,"customEvents"),snap=>{customEvents=snap.val()||{};refreshEventSources();});

function groupedPlayers(){
  const groups=new Map();
  Object.entries(competitionEntries||{}).forEach(([key,x])=>{
    if(!x||!x.backNo||!x.competitor) return;
    const groupKey=String(x.backNo).trim();
    if(!groups.has(groupKey)) groups.set(groupKey,{backNo:String(x.backNo),competitor:x.competitor,rows:[]});
    const g=groups.get(groupKey);
    if(!g.competitor && x.competitor) g.competitor=x.competitor;
    g.rows.push({key,...x});
  });
  return [...groups.values()].sort((a,b)=>String(a.backNo).localeCompare(String(b.backNo),undefined,{numeric:true}));
}
function renderEntries(){
  if(!entryList) return;
  const players=groupedPlayers();
  const totalEntries=Object.values(competitionEntries||{}).filter(Boolean).length;
  entryCount.textContent=`${players.length} PLAYER${players.length===1?'':'S'} · ${totalEntries} ENTRIES`;
  entryList.innerHTML=players.length?players.map(g=>{
    const names=[...new Set(g.rows.map(r=>r.event).filter(Boolean))];
    return `<div class="entry-player-row">
      <div class="entry-player-main"><span class="backno">#${g.backNo}</span><span class="name">${g.competitor||''}</span><span class="event-total">${names.length} EVENTS</span></div>
      <div class="entry-player-events">${names.map(n=>`<span>${n}</span>`).join('')}</div>
      <div class="entry-row-actions"><button type="button" data-player-edit="${g.backNo}">ADD / EDIT EVENTS</button><button type="button" class="delete" data-player-delete="${g.backNo}">DELETE PLAYER</button></div>
    </div>`;
  }).join(""):'<div class="entry-empty">NO ENTRIES YET</div>';
}
function resetEntryForm(){
  editingPlayerKeys=[]; editingOriginalBackNo="";
  if(entryBackNo)entryBackNo.value="";
  if(entryName)entryName.value="";
  if(entryEventSearch)entryEventSearch.value="";
  entryEventChecks?.querySelectorAll('input[type="checkbox"]').forEach(x=>x.checked=false);
  entryEventChecks?.querySelectorAll('.entry-event-check').forEach(x=>x.classList.remove('hidden-by-search'));
  updateSelectedCount();
  if(saveEntryBtn)saveEntryBtn.textContent="SAVE PLAYER ENTRIES";
  cancelEntryEditBtn?.classList.add("hidden");
}
cancelEntryEditBtn?.addEventListener("click",resetEntryForm);

saveEntryBtn?.addEventListener("click",async()=>{
  const backNo=entryBackNo.value.trim();
  const competitor=entryName.value.trim();
  const chosen=new Set(selectedEventIds());
  if(!backNo||!competitor){entryMessage.textContent="BACK NO. / NAME을 입력하세요.";return;}
  if(!chosen.size){entryMessage.textContent="출전할 EVENT를 하나 이상 선택하세요.";return;}
  saveEntryBtn.disabled=true;
  entryMessage.textContent="SAVING...";
  try{
    // Editing a player synchronizes the entire selected event set. This makes later additions easy
    // while also allowing an accidentally selected event to be unchecked and removed.
    const existingForPlayer=Object.entries(competitionEntries||{}).filter(([,x])=>x && String(x.backNo).trim()===String(editingOriginalBackNo||backNo).trim());
    const existingByEvent=new Map(existingForPlayer.map(([key,x])=>[eventId(x),{key,x}]));

    // Remove events that were unchecked while editing, or remove old-back-number copies after changing a back number.
    for(const [id,{key}] of existingByEvent){
      if(!chosen.has(id) || (editingOriginalBackNo && editingOriginalBackNo!==backNo)) await remove(ref(db,`entries/${key}`));
    }

    for(const id of chosen){
      const event=EVENTS.find(e=>eventId(e)===id);
      if(!event) continue;
      let key=null;
      if(!editingOriginalBackNo || editingOriginalBackNo===backNo) key=existingByEvent.get(id)?.key||null;
      if(!key){
        const same=Object.entries(competitionEntries||{}).find(([,x])=>x&&String(x.backNo).trim()===backNo&&eventId(x)===id);
        key=same?.[0]||firebaseSafeKey();
      }
      const settingSnap=await get(ref(db,`eventSettings/${encodeKey(event.eventKey)}`));
      const setting=settingSnap.val()||event;
      await set(ref(db,`entries/${key}`),{
        eventNo:String(setting.eventNumber||event.eventNumber||""),section:event.section,style:event.style,
        division:event.event.replace(/\s+(C|S|R|J|CR|CJ|RJ|CS|CRS|CRJ|CSRJ|5 Dance|W|T|F|Q|WTFQ)$/i,""),
        event:event.event,backNo,competitor,entryType:entryTypeFor(event),updatedAt:Date.now()
      });
    }
    entryMessage.textContent=`SAVED · #${backNo} ${competitor} · ${chosen.size} EVENTS`;
    resetEntryForm();
    setTimeout(()=>entryMessage.textContent="",1800);
  }catch(err){
    console.error(err);
    entryMessage.textContent="SAVE FAILED · Firebase 권한/연결을 확인하세요.";
  }finally{ saveEntryBtn.disabled=false; }
});

entryList?.addEventListener("click",async e=>{
  const edit=e.target.closest('[data-player-edit]');
  const del=e.target.closest('[data-player-delete]');
  if(edit){
    const backNo=edit.dataset.playerEdit;
    const rows=Object.entries(competitionEntries||{}).filter(([,x])=>x&&String(x.backNo).trim()===String(backNo).trim());
    if(!rows.length)return;
    editingPlayerKeys=rows.map(([k])=>k); editingOriginalBackNo=String(backNo);
    entryBackNo.value=backNo;
    entryName.value=rows[0][1].competitor||"";
    const ids=new Set(rows.map(([,x])=>eventId(x)));
    entryEventChecks.querySelectorAll('input[type="checkbox"]').forEach(x=>x.checked=ids.has(x.value));
    if(entryEventSearch)entryEventSearch.value="";
    entryEventChecks.querySelectorAll('.entry-event-check').forEach(x=>x.classList.remove('hidden-by-search'));
    updateSelectedCount();
    saveEntryBtn.textContent="SAVE CHANGES / ADD EVENTS";
    cancelEntryEditBtn.classList.remove("hidden");
    window.scrollTo({top:entryBackNo.getBoundingClientRect().top+scrollY-130,behavior:"smooth"});
  }
  if(del){
    const backNo=del.dataset.playerDelete;
    const rows=Object.entries(competitionEntries||{}).filter(([,x])=>x&&String(x.backNo).trim()===String(backNo).trim());
    const name=rows[0]?.[1]?.competitor||"";
    if(rows.length && confirm(`Delete #${backNo} ${name} and all ${rows.length} entries?`)){
      for(const [key] of rows) await remove(ref(db,`entries/${key}`));
      if(editingOriginalBackNo===backNo) resetEntryForm();
    }
  }
});
let entriesLoadedOnce=false,entrySyncTimer=null;
onValue(ref(db,"entries"),snap=>{competitionEntries=snap.val()||{};renderEntries(); if(entriesLoadedOnce){clearTimeout(entrySyncTimer);entrySyncTimer=setTimeout(()=>syncTimetableWithEntries().catch(console.error),250);} entriesLoadedOnce=true;});

// ===== TIMETABLE BUILDER + FINAL SEARCH PUBLISH =====
const publishSearchBtn=document.getElementById("publishSearchBtn");
const publishSearchMessage=document.getElementById("publishSearchMessage");
const ttBuilderStart=document.getElementById("ttBuilderStart");
const buildTimetableBtn=document.getElementById("buildTimetableBtn");
const combineTimetableBtn=document.getElementById("combineTimetableBtn");
const uncombineTimetableBtn=document.getElementById("uncombineTimetableBtn");
const ttBuilderList=document.getElementById("ttBuilderList");
const ttBuilderMessage=document.getElementById("ttBuilderMessage");
let timetableRows=[];

function currentCompetitionMeta(){
  let list=[]; try{list=JSON.parse(localStorage.getItem("apdc-competitions-v2")||"[]");if(!Array.isArray(list))list=[]}catch(e){}
  const found=list.find(x=>x&&x.id===competitionId)||{};
  return {id:competitionId,name:found.name||competitionId,date:found.date||"",venue:found.venue||""};
}
function danceCodes(eventName){
  const n=String(eventName||"").toUpperCase();
  if(/FORMATION/.test(n)) return ["Formation"];
  if(/5\s*DANCE/.test(n)) return ["C","S","R","P","J"];
  const m=n.match(/(?:SOLO\s+|LATIN\s+|STANDARD\s+)(WTFQ|WTF|WTQ|CRSJ|CSRJ|CRJ|CRS|CSR|CR|RJ|CJ|CS|WQ|WT|[CSRPJWTQF])\b/);
  if(m){
    const code=m[1];
    if(/^[WTFQ]+$/.test(code)) return [...code];
    return [...code];
  }
  if(/STANDARD\s*3\s*DANCE/.test(n)) return ["W","T","F"];
  if(/SENIOR\s*50\s*CR/.test(n)) return ["C","R"];
  return ["R"];
}
function roundPlan(count){
  if(count>=14) return ["Quarter Final","Semi Final","Final"];
  if(count>=8) return ["Semi Final","Final"];
  return ["Final"];
}
function secToClock(sec){
  sec=Math.max(0,Math.round(sec)); const h=Math.floor(sec/3600)%24,m=Math.floor(sec%3600/60),ss=sec%60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}${ss?`:${String(ss).padStart(2,"0")}`:""}`;
}
function startSeconds(){ const [h,m]=(ttBuilderStart?.value||"11:30").split(":").map(Number); return (h||0)*3600+(m||0)*60; }
function renumberAndRetimestamp(rows){
  let cursor=startSeconds();
  return rows.map((r,i)=>{const durationSeconds=Number(r.durationSeconds)||80;const x={...r,no:String(i+1),start:secToClock(cursor),durationSeconds,duration:Math.round(durationSeconds/60*1000)/1000,durationText:durationSeconds%60?`${Math.floor(durationSeconds/60)}:${String(durationSeconds%60).padStart(2,"0")}`:`${Math.floor(durationSeconds/60)}:00`};cursor+=durationSeconds;return x;});
}
function eventIdentity(x){return `${x.event||""}||${x.section||""}||${x.style||""}`;}

async function syncTimetableWithEntries(){
  if(!timetableRows.length)return;
  const entries=Object.values(competitionEntries||{}).filter(x=>x&&x.backNo&&x.competitor&&x.event);
  const byEvent=new Map(); entries.forEach(x=>{const k=eventIdentity(x);if(!byEvent.has(k))byEvent.set(k,[]);byEvent.get(k).push(x)});
  const covered=new Set(); const next=[];
  for(const row of timetableRows){
    if(row.combined&&row.sourceEvents?.length){
      const sourceEntries=entries.filter(x=>row.sourceEvents.includes(x.event));
      if(!sourceEntries.length)continue;
      const backs=[...new Set(sourceEntries.map(x=>String(x.backNo)).filter(Boolean))].sort((a,b)=>Number(a)-Number(b));
      sourceEntries.forEach(x=>covered.add(eventIdentity(x)));
      next.push({...row,entries:String(sourceEntries.length),backNumbers:backs}); continue;
    }
    const key=eventIdentity(row), ents=byEvent.get(key)||[]; if(!ents.length)continue; covered.add(key);
    const backs=[...new Set(ents.map(x=>String(x.backNo)).filter(Boolean))].sort((a,b)=>Number(a)-Number(b));
    next.push({...row,entries:String(ents.length),backNumbers:backs});
  }
  // Any event newly used in ENTRIES appears automatically in the timetable.
  for(const [key,ents] of byEvent){
    if(covered.has(key))continue; const sample=ents[0], backs=[...new Set(ents.map(x=>String(x.backNo)).filter(Boolean))].sort((a,b)=>Number(a)-Number(b));
    const dances=danceCodes(sample.event), rounds=roundPlan(ents.length);
    for(const round of rounds)next.push({no:"",start:"",round,style:sample.style||"",section:sample.section||"",division:sample.division||"",event:sample.event||"",entries:String(ents.length),danceOrder:dances.join(" → "),durationSeconds:/formation/i.test(sample.event)?600:Math.max(80,dances.length*80),durationText:"",sourceEventNo:"",sourceEventNos:[],sourceEvents:[sample.event],backNumbers:backs,note:"AUTO FROM ENTRIES",combined:false});
  }
  timetableRows=renumberAndRetimestamp(next); await saveTimetableRows(); renderTimetableBuilder();
  if(ttBuilderMessage)ttBuilderMessage.textContent="엔트리 변경사항이 타임테이블에 자동 반영되었습니다.";
}
async function buildTimetableFromEntries(){
  const rows=Object.values(competitionEntries||{}).filter(x=>x&&x.backNo&&x.competitor&&x.event);
  if(!rows.length){ttBuilderMessage.textContent="먼저 엔트리를 등록하세요.";return;}
  const settingsSnap=await get(ref(db,"eventSettings")); const settings=Object.values(settingsSnap.val()||{});
  const byEvent=new Map();
  rows.forEach(x=>{const k=eventIdentity(x);if(!byEvent.has(k))byEvent.set(k,[]);byEvent.get(k).push(x)});
  const built=[];
  for(const [key,ents] of byEvent){
    const sample=ents[0];
    const setting=settings.find(z=>eventIdentity(z)===key)||{};
    const evDef=EVENTS.find(z=>eventIdentity(z)===key)||{};
    const sourceNo=String(setting.eventNumber||sample.eventNo||evDef.eventNumber||EVENTS.findIndex(z=>eventIdentity(z)===key)+1);
    const backs=[...new Set(ents.map(x=>String(x.backNo).trim()).filter(Boolean))].sort((a,b)=>Number(a)-Number(b));
    const dances=danceCodes(sample.event); const rounds=roundPlan(ents.length);
    for(const round of rounds){
      const durationSeconds=/formation/i.test(sample.event)?600:Math.max(80,dances.length*80);
      built.push({no:"",start:"",round,style:sample.style||"",section:sample.section||"",division:sample.division||"",event:sample.event||"",entries:String(ents.length),danceOrder:dances.join(" → "),durationSeconds,durationText:"",sourceEventNo:sourceNo,sourceEventNos:[sourceNo],sourceEvents:[sample.event],backNumbers:backs,note:"",combined:false});
    }
  }
  built.sort((a,b)=>Number(a.sourceEventNo)-Number(b.sourceEventNo)||({"Quarter Final":0,"Semi Final":1,"Final":2}[a.round]??9)-({"Quarter Final":0,"Semi Final":1,"Final":2}[b.round]??9));
  timetableRows=renumberAndRetimestamp(built);
  await saveTimetableRows();
  ttBuilderMessage.textContent=`타임테이블 생성 완료 · ${timetableRows.length} 경기`;
  renderTimetableBuilder();
}
async function saveTimetableRows(){
  timetableRows=renumberAndRetimestamp(timetableRows);
  await set(ref(db,"timetableOverride"),{summary:`${currentCompetitionMeta().name} · generated from entries`,rows:timetableRows,updatedAt:Date.now()});
}
function renderTimetableBuilder(){
  if(!ttBuilderList)return;
  ttBuilderList.innerHTML=timetableRows.length?timetableRows.map((r,i)=>`<div class="tt-builder-row ${r.combined?'combined':''}">
    <input type="checkbox" data-tt-select="${i}" aria-label="select event ${r.no}">
    <div class="tt-builder-no">${r.start}<br>EVENT ${r.no}</div>
    <div class="tt-builder-main"><strong>${r.combined?'[합동] ':''}${r.event}</strong><div class="tt-builder-meta">${r.round} · ${r.entries||0} ENTRIES · ${r.danceOrder||''}</div><div class="tt-builder-backs"><b>BACK NO.</b> ${(r.backNumbers||[]).join(' · ')||'—'}</div>${r.combined&&r.sourceEvents?.length?`<div class="tt-builder-meta">SOURCE: ${r.sourceEvents.join(' + ')}</div>`:''}</div>
    <div class="tt-builder-duration">${r.durationText||''}</div>
    <div class="tt-row-actions"><button type="button" class="light tt-setting-btn" data-tt-setting="${i}">경기 설정</button></div>
  </div>`).join(""):'<div class="entry-empty">타임테이블이 없습니다. 엔트리 완성 후 위 버튼을 눌러주세요.</div>';
  ttBuilderList.querySelectorAll('[data-tt-setting]').forEach(btn=>btn.addEventListener('click',()=>openTimetableJudgeEditor(Number(btn.dataset.ttSetting))));
}
const ttJudgeEditor=document.getElementById("ttJudgeEditor");
const ttJudgeEditorTitle=document.getElementById("ttJudgeEditorTitle");
const ttJudgeRound=document.getElementById("ttJudgeRound");
const ttJudgeChecks=document.getElementById("ttJudgeChecks");
const ttJudgeSaveBtn=document.getElementById("ttJudgeSaveBtn");
const ttJudgeClearBtn=document.getElementById("ttJudgeClearBtn");
const ttJudgeMessage=document.getElementById("ttJudgeMessage");
let editingTimetableIndex=-1;
if(ttJudgeChecks) ttJudgeChecks.innerHTML=JUDGES.map(j=>`<label class="judge-check"><input type="checkbox" value="${j.code}"><span><b>${j.code}</b><small>${j.name}</small></span></label>`).join("");
function timetableEventKey(row){
  const exact=EVENTS.find(e=>e.event===row.event && (!row.section||e.section===row.section));
  return exact?.eventKey || `${row.event||""}||${row.section||""}||${row.style||""}`;
}
async function openTimetableJudgeEditor(index){
  const row=timetableRows[index]; if(!row)return; editingTimetableIndex=index;
  ttJudgeEditor.classList.remove("hidden");
  ttJudgeEditorTitle.textContent=`EVENT ${row.no} · ${row.event}`;
  ttJudgeRound.value=String(row.round||"Final").toLowerCase().startsWith("quarter")?"quarter":String(row.round||"Final").toLowerCase().startsWith("semi")?"semi":"final";
  const key=timetableEventKey(row); const snap=await get(ref(db,`eventSettings/${encodeKey(key)}`)); const saved=snap.val()||{};
  const assigned=saved.assignedJudges||row.assignedJudges||[];
  ttJudgeChecks.querySelectorAll("input").forEach(c=>c.checked=assigned.includes(c.value));
  ttJudgeMessage.textContent=""; ttJudgeEditor.scrollIntoView({behavior:"smooth",block:"nearest"});
}
ttJudgeClearBtn?.addEventListener("click",()=>ttJudgeChecks.querySelectorAll("input").forEach(c=>c.checked=false));
ttJudgeSaveBtn?.addEventListener("click",async()=>{
  const row=timetableRows[editingTimetableIndex]; if(!row)return;
  const assigned=[...ttJudgeChecks.querySelectorAll("input:checked")].map(c=>c.value);
  const roundValue=ttJudgeRound.value; const roundLabel=roundValue==="quarter"?"Quarter Final":roundValue==="semi"?"Semi Final":"Final";
  const key=timetableEventKey(row);
  await set(ref(db,`eventSettings/${encodeKey(key)}`),{eventKey:key,eventNumber:String(row.no||""),event:row.event||"",section:row.section||"",style:row.style||"",round:roundValue,assignedJudges:assigned,updatedAt:Date.now()});
  timetableRows[editingTimetableIndex]={...row,round:roundLabel,assignedJudges:assigned};
  await saveTimetableRows(); renderTimetableBuilder();
  ttJudgeMessage.textContent=`자동저장 완료 · ${assigned.length} JUDGES`;
});

function selectedTimetableIndexes(){return [...ttBuilderList.querySelectorAll('[data-tt-select]:checked')].map(x=>Number(x.dataset.ttSelect)).filter(Number.isInteger).sort((a,b)=>a-b);}
combineTimetableBtn?.addEventListener("click",async()=>{
  const idx=selectedTimetableIndexes(); if(idx.length<2){ttBuilderMessage.textContent="합동할 경기를 2개 이상 선택하세요.";return;}
  const rows=idx.map(i=>timetableRows[i]); const rounds=[...new Set(rows.map(r=>r.round))];
  if(rounds.length>1&&!confirm("서로 다른 라운드가 선택되었습니다. 그래도 합동할까요?"))return;
  const allBacks=[...new Set(rows.flatMap(r=>r.backNumbers||[]).map(String).filter(Boolean))].sort((a,b)=>Number(a)-Number(b));
  const sourceEventNos=[...new Set(rows.flatMap(r=>r.sourceEventNos||[r.sourceEventNo]).map(String).filter(Boolean))];
  const sourceEvents=[...new Set(rows.flatMap(r=>r.sourceEvents||[r.event]).filter(Boolean))];
  const danceList=[...new Set(rows.flatMap(r=>String(r.danceOrder||'').split('→').map(x=>x.trim()).filter(Boolean)))];
  const combined={...rows[0],event:sourceEvents.join(" + "),entries:String(rows.reduce((n,r)=>n+Number(r.entries||0),0)),backNumbers:allBacks,sourceEventNos,sourceEventNo:sourceEventNos[0]||"",sourceEvents,danceOrder:danceList.join(" → "),durationSeconds:Math.max(...rows.map(r=>Number(r.durationSeconds)||80)),combined:true,note:"COMBINED · all source back numbers retained"};
  const first=idx[0], selectedSet=new Set(idx); timetableRows=timetableRows.filter((_,i)=>!selectedSet.has(i)); timetableRows.splice(first,0,combined);
  await saveTimetableRows();renderTimetableBuilder();ttBuilderMessage.textContent=`합동 완료 · BACK NO. ${allBacks.join(' · ')}`;
});
uncombineTimetableBtn?.addEventListener("click",async()=>{
  const idx=selectedTimetableIndexes(); if(idx.length!==1){ttBuilderMessage.textContent="합동 취소할 경기 1개를 선택하세요.";return;}
  const row=timetableRows[idx[0]]; if(!row?.combined||!(row.sourceEvents?.length>1)){ttBuilderMessage.textContent="선택한 경기는 합동경기가 아닙니다.";return;}
  const sourceSet=new Set(row.sourceEvents); const entryGroups=new Map();
  Object.values(competitionEntries||{}).filter(x=>x&&sourceSet.has(x.event)).forEach(x=>{const k=eventIdentity(x);if(!entryGroups.has(k))entryGroups.set(k,[]);entryGroups.get(k).push(x)});
  const restored=[];
  for(const ents of entryGroups.values()){
    const sample=ents[0], backs=[...new Set(ents.map(x=>String(x.backNo)).filter(Boolean))].sort((a,b)=>Number(a)-Number(b));
    const sourceIndex=row.sourceEvents.indexOf(sample.event), sourceNo=String(row.sourceEventNos?.[sourceIndex]||""); const dances=danceCodes(sample.event);
    restored.push({...row,event:sample.event,section:sample.section,style:sample.style,division:sample.division,entries:String(ents.length),backNumbers:backs,sourceEventNo:sourceNo,sourceEventNos:[sourceNo],sourceEvents:[sample.event],danceOrder:dances.join(" → "),durationSeconds:/formation/i.test(sample.event)?600:Math.max(80,dances.length*80),combined:false,note:""});
  }
  if(!restored.length){ttBuilderMessage.textContent="원래 경기 엔트리를 찾지 못했습니다.";return;}
  timetableRows.splice(idx[0],1,...restored);await saveTimetableRows();renderTimetableBuilder();ttBuilderMessage.textContent="합동 취소 완료";
});
buildTimetableBtn?.addEventListener("click",()=>{if(timetableRows.length&&!confirm("현재 타임테이블을 엔트리 기준으로 다시 만들까요? 기존 합동 설정은 초기화됩니다."))return;buildTimetableFromEntries();});
ttBuilderStart?.addEventListener("change",async()=>{if(!timetableRows.length)return;await saveTimetableRows();renderTimetableBuilder();});
onValue(ref(db,"timetableOverride"),snap=>{const v=snap.val();const rows=Array.isArray(v?.rows)?v.rows:(Array.isArray(v)?v:[]);if(rows.length){timetableRows=rows;renderTimetableBuilder();}else{timetableRows=[];renderTimetableBuilder();}});

publishSearchBtn?.addEventListener("click",async()=>{
  if(isLegacyCompetition){publishSearchMessage.textContent="2026 APDC는 기존 SEARCH 데이터로 이미 공개되어 있습니다.";return;}
  const rows=Object.values(competitionEntries||{}).filter(x=>x&&x.backNo&&x.competitor&&x.event);
  if(!rows.length){publishSearchMessage.textContent="먼저 엔트리를 등록하세요.";return;}
  if(!timetableRows.length){publishSearchMessage.textContent="엔트리 완성 후 타임테이블을 먼저 만드세요.";return;}
  if(!confirm(`엔트리 ${rows.length}개와 타임테이블 ${timetableRows.length}경기를 APDC SEARCH에 송출할까요?`))return;
  publishSearchBtn.disabled=true; publishSearchMessage.textContent="송출 중…";
  try{
    const meta=currentCompetitionMeta();
    const publicRows=rows.map(x=>({eventNo:String(x.eventNo||""),section:x.section||"",style:x.style||"",division:x.division||"",event:x.event||"",backNo:String(x.backNo||""),competitor:x.competitor||"",entryType:x.entryType||""}));
    const publicTT=timetableRows.map(r=>({...r,backNumbers:Array.isArray(r.backNumbers)?r.backNumbers.map(String):[]}));
    await set(firebaseRef(db,`competitions/${competitionId}/publicEntries`),publicRows);
    await set(firebaseRef(db,`competitions/${competitionId}/publicTimetable`),{rows:publicTT,updatedAt:Date.now()});
    await set(firebaseRef(db,`publishedCompetitions/${competitionId}`),{...meta,entryCount:publicRows.length,timetableCount:publicTT.length,published:true,publishedAt:Date.now()});
    publishSearchMessage.textContent=`SEARCH 송출 완료 · ${publicRows.length} ENTRIES · ${publicTT.length} EVENTS`;
  }catch(err){console.error(err);publishSearchMessage.textContent="송출 실패. Firebase 연결을 확인하세요."}
  finally{publishSearchBtn.disabled=false;}
});


async function loadSetup(){
 const event=EVENTS.find(e=>e.eventKey===setupEvent.value);
 const snap=await get(ref(db,`eventSettings/${encodeKey(event.eventKey)}`));
 const value=snap.val()||event;
 setupEventNumber.value=value.eventNumber||"";
 setupRound.value=value.round||"final";
 const assigned=value.assignedJudges||[];
 judgeChecks.querySelectorAll("input").forEach(c=>c.checked=assigned.includes(c.value));
}
setupEvent.onchange=loadSetup;

document.getElementById("saveSetupBtn").onclick=async()=>{
 const event=EVENTS.find(e=>e.eventKey===setupEvent.value);
 const assigned=[...judgeChecks.querySelectorAll("input:checked")].map(c=>c.value);
 await set(ref(db,`eventSettings/${encodeKey(event.eventKey)}`),{
  ...event,
  eventNumber:setupEventNumber.value.trim(),
  round:setupRound.value,
  assignedJudges:assigned,
  updatedAt:Date.now()
});
 setupMessage.textContent="SAVED";setTimeout(()=>setupMessage.textContent="",1200);
};


document.getElementById("clearJudgesBtn").onclick=()=>{
  judgeChecks.querySelectorAll("input").forEach(c=>c.checked=false);
  setupMessage.textContent="CLEARED";
};

document.getElementById("copyPreviousBtn").onclick=async()=>{
  const currentNo=Number(setupEventNumber.value);
  if(!Number.isFinite(currentNo)){
    setupMessage.textContent="ENTER EVENT NO. FIRST";
    return;
  }

  const snap=await get(ref(db,"eventSettings"));
  const settings=Object.values(snap.val()||{});
  const previous=settings
    .filter(s=>Number.isFinite(Number(s.eventNumber)) && Number(s.eventNumber)<currentNo)
    .sort((a,b)=>Number(b.eventNumber)-Number(a.eventNumber))[0];

  if(!previous){
    setupMessage.textContent="NO PREVIOUS ASSIGNMENT";
    return;
  }

  const assigned=previous.assignedJudges||[];
  judgeChecks.querySelectorAll("input").forEach(c=>c.checked=assigned.includes(c.value));
  setupMessage.textContent=`COPIED EVENT ${previous.eventNumber}`;
};

const nowInput=document.getElementById("nowEventInput");
const deckInput=document.getElementById("onDeckEventInput");
const nextInput=document.getElementById("nextEventInput");
const floorMessage=document.getElementById("floorMessage");
async function publishFloor(){
 await set(ref(db,"floorStatus"),{now:nowInput.value.trim(),onDeck:deckInput.value.trim(),next:nextInput.value.trim(),updatedAt:Date.now()});
 floorMessage.textContent="PUBLISH";setTimeout(()=>floorMessage.textContent="",1200);
}
document.getElementById("publishFloorBtn").onclick=publishFloor;
document.getElementById("advanceFloorBtn").onclick=async()=>{nowInput.value=deckInput.value;deckInput.value=nextInput.value;nextInput.value="";await publishFloor();};
onValue(ref(db,"floorStatus"),s=>{const v=s.val()||{};nowInput.value=v.now||"";deckInput.value=v.onDeck||"";nextInput.value=v.next||"";});

document.getElementById("startEventBtn").onclick=async()=>{
 const event=EVENTS.find(e=>e.eventKey===setupEvent.value);
 const label=`${setupEventNumber.value?`EVENT ${setupEventNumber.value} · `:""}${event.section} · ${event.event}`;
 await set(ref(db,"activeEvent"),{
  eventKey:event.eventKey,
  label,
  round:setupRound.value,
  eventNumber:setupEventNumber.value.trim(),
  updatedAt:Date.now()
});
 nowInput.value=label;await publishFloor();setupMessage.textContent="START EVENT";
};

const roundKey=()=>encodeKey(adminEvent.value)+"_"+adminRound.value;
const activeJudges=()=>judgeGroup.value==="ALL"?JUDGES:JUDGES.filter(j=>j.code.startsWith(judgeGroup.value));
let unsub=null,currentData={};
function listen(){
 if(unsub)unsub();
 document.getElementById("adminTitle").textContent=adminEvent.selectedOptions[0]?.textContent||"";
 unsub=onValue(ref(db,`submissions/${roundKey()}`),s=>{currentData=s.val()||{};renderStatus();});
}
function renderStatus(){
 const judges=activeJudges();
 const submitted=judges.filter(j=>currentData[j.code]);
 document.getElementById("submissionCount").textContent=`${submitted.length} / ${judges.length} SUBMITTED`;
 document.getElementById("completeBadge").textContent=submitted.length===judges.length&&judges.length?"COMPLETE":"IN PROGRESS";
 document.getElementById("judgeStatus").innerHTML=judges.map(j=>`<div class="status-row"><strong>${j.code}</strong><span>${j.name}</span><span>${currentData[j.code]?"SUBMITTED ✓":"WAITING"}</span></div>`).join("");
 document.getElementById("aggregateResults").innerHTML=submitted.length?`<div class="message">${submitted.length} ballots received.</div>`:'<div class="message">NO RESULTS YET</div>';
}
adminEvent.onchange=listen;adminRound.onchange=listen;judgeGroup.onchange=renderStatus;
document.getElementById("clearBtn").onclick=async()=>{if(confirm("Reset selected round?"))await remove(ref(db,`submissions/${roundKey()}`));};
document.getElementById("resetAllBtn").onclick=async()=>{if(confirm("Reset ALL submissions?")&&confirm("This cannot be undone. Continue?"))await remove(ref(db,"submissions"));};
document.getElementById("exportBtn").onclick=()=>alert("CSV export will be enabled after final Event No. confirmation.");
document.getElementById("printBtn").onclick=()=>window.print();


// ===== AUTOMATIC EVENT ADVANCE =====
const autoAdvanceToggle=document.getElementById("autoAdvanceToggle");
const autoAdvanceStatus=document.getElementById("autoAdvanceStatus");
let activeEventValue=null;
let activeSubmissionUnsub=null;
let advancing=false;

function eventLabelFromSetting(s){
  return `${s.eventNumber?`EVENT ${s.eventNumber} · `:""}${s.section} · ${s.event}`;
}

async function getConfiguredRunningOrder(){
  const snap=await get(ref(db,"eventSettings"));
  return Object.values(snap.val()||{})
    .filter(s=>String(s.eventNumber||"").trim()!=="" && (s.assignedJudges||[]).length>0)
    .sort((a,b)=>Number(a.eventNumber)-Number(b.eventNumber));
}

async function updateAutomaticFloor(order,currentIndex){
  const now=order[currentIndex] ? eventLabelFromSetting(order[currentIndex]) : "";
  const onDeck=order[currentIndex+1] ? eventLabelFromSetting(order[currentIndex+1]) : "";
  const next=order[currentIndex+2] ? eventLabelFromSetting(order[currentIndex+2]) : "";

  await set(ref(db,"floorStatus"),{
    now,onDeck,next,updatedAt:Date.now()
  });
}

async function advanceToNextEvent(){
  if(advancing || !activeEventValue) return;
  advancing=true;
  autoAdvanceStatus.textContent="ADVANCING IN 3 SECONDS…";

  await new Promise(resolve=>setTimeout(resolve,3000));

  const order=await getConfiguredRunningOrder();
  const currentIndex=order.findIndex(s=>s.eventKey===activeEventValue.eventKey);
  const nextSetting=order[currentIndex+1];

  if(!nextSetting){
    autoAdvanceStatus.textContent="RUNNING ORDER COMPLETE";
    advancing=false;
    return;
  }

  const label=eventLabelFromSetting(nextSetting);
  await set(ref(db,"activeEvent"),{
    eventKey:nextSetting.eventKey,
    label,
    round:nextSetting.round||"final",
    eventNumber:nextSetting.eventNumber||"",
    updatedAt:Date.now(),
    autoStarted:true
  });

  await updateAutomaticFloor(order,currentIndex+1);
  autoAdvanceStatus.textContent=`ACTIVE: EVENT ${nextSetting.eventNumber}`;
  advancing=false;
}

function watchActiveSubmissions(active){
  if(activeSubmissionUnsub){
    activeSubmissionUnsub();
    activeSubmissionUnsub=null;
  }
  if(!active) return;

  const encoded=encodeKey(active.eventKey);
  const submissionPath=`submissions/${encoded}_${active.round||"final"}`;

  activeSubmissionUnsub=onValue(ref(db,submissionPath),async snap=>{
    if(!autoAdvanceToggle.checked || advancing) return;

    const settingsSnap=await get(ref(db,`eventSettings/${encoded}`));
    const setting=settingsSnap.val();
    if(!setting) return;

    const assigned=setting.assignedJudges||[];
    if(!assigned.length){
      autoAdvanceStatus.textContent="NO JUDGES ASSIGNED";
      return;
    }

    const submitted=snap.val()||{};
    const completed=assigned.filter(code=>submitted[code]).length;
    autoAdvanceStatus.textContent=`${completed} / ${assigned.length} SUBMITTED`;

    if(completed===assigned.length){
      await advanceToNextEvent();
    }
  });
}

onValue(ref(db,"activeEvent"),snap=>{
  activeEventValue=snap.val();
  if(activeEventValue){
    autoAdvanceStatus.textContent=`ACTIVE: ${activeEventValue.label||""}`;
    watchActiveSubmissions(activeEventValue);
  }else{
    autoAdvanceStatus.textContent="READY — START FIRST EVENT";
  }
});

autoAdvanceToggle.onchange=()=>{
  localStorage.setItem("apdcAutoAdvance",autoAdvanceToggle.checked?"on":"off");
  autoAdvanceStatus.textContent=autoAdvanceToggle.checked?"AUTO ADVANCE ON":"AUTO ADVANCE OFF";
};
autoAdvanceToggle.checked=localStorage.getItem("apdcAutoAdvance")!=="off";

loadSetup();listen();

const sponsorNameInput=document.getElementById("sponsorNameInput"),sponsorUrlInput=document.getElementById("sponsorUrlInput"),sponsorMessage=document.getElementById("sponsorMessage"),sponsorList=document.getElementById("sponsorList");
document.getElementById("addSponsorBtn")?.addEventListener("click",async()=>{const name=sponsorNameInput.value.trim(),url=sponsorUrlInput.value.trim();if(!url){sponsorMessage.textContent="ENTER LOGO URL";return}const key=`sponsor_${Date.now()}`;await set(ref(db,`sponsors/${key}`),{name:name||"Sponsor",url,active:true,createdAt:Date.now()});sponsorNameInput.value="";sponsorUrlInput.value="";sponsorMessage.textContent="LOGO ADDED"});
onValue(ref(db,"sponsors"),s=>{const rows=Object.entries(s.val()||{});sponsorList.innerHTML=rows.length?rows.map(([key,x])=>`<div class="sponsor-admin-row"><img src="${x.url}" alt=""><span>${x.name||"Sponsor"}</span><button data-remove-sponsor="${key}">REMOVE</button></div>`).join(""):'<div class="message">NO SPONSOR LOGOS</div>';sponsorList.querySelectorAll("[data-remove-sponsor]").forEach(b=>b.onclick=async()=>{if(confirm("Remove this sponsor logo?"))await remove(ref(db,`sponsors/${b.dataset.removeSponsor}`))})});

document.querySelectorAll("[data-admin-tab]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const tab=btn.dataset.adminTab;
    document.querySelectorAll("[data-admin-tab]").forEach(b=>b.classList.toggle("active",b===btn));
    document.querySelectorAll("[data-admin-panel]").forEach(panel=>{
      panel.classList.toggle("hidden",panel.dataset.adminPanel!==tab);
    });
  });
});
const initialTab=new URL(location.href).searchParams.get("tab");
if(initialTab && document.querySelector(`[data-admin-tab="${initialTab}"]`)){document.querySelector(`[data-admin-tab="${initialTab}"]`)?.click();}
else{document.querySelector('[data-admin-tab="entries"]')?.click();}


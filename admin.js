apdcBuildLanguageUI();
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue, remove } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const EVENTS=[{"eventKey": "Ama Rising Star Latin||Amateur||Latin", "eventNumber": "", "event": "Ama Rising Star Latin", "section": "Amateur", "style": "Latin", "assignedJudges": []}, {"eventKey": "Amateur Latin||Amateur||Latin", "eventNumber": "", "event": "Amateur Latin", "section": "Amateur", "style": "Latin", "assignedJudges": []}, {"eventKey": "Amateur Solo Latin||Amateur||Latin", "eventNumber": "", "event": "Amateur Solo Latin", "section": "Amateur", "style": "Latin", "assignedJudges": []}, {"eventKey": "Asia Pacific Amateur Solo Latin 5 Dance||Amateur||Latin", "eventNumber": "", "event": "Asia Pacific Amateur Solo Latin 5 Dance", "section": "Amateur", "style": "Latin", "assignedJudges": []}, {"eventKey": "Formation||Formation||Other", "eventNumber": "", "event": "Formation", "section": "Formation", "style": "Other", "assignedJudges": []}, {"eventKey": "Mania Latin CR||Mania||Latin", "eventNumber": "", "event": "Mania Latin CR", "section": "Mania", "style": "Latin", "assignedJudges": []}, {"eventKey": "Mania Latin CRS||Mania||Latin", "eventNumber": "", "event": "Mania Latin CRS", "section": "Mania", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo 5 Dance||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo 5 Dance", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo C||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo C", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo CR||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo CR", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo CRS||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo CRS", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo Latin 5 Dance||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo Latin 5 Dance", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo Latin CRS||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo Latin CRS", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo P||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo P", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo R||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo R", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo RJ||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo RJ", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo S||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo S", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo T||Over 19||Modern", "eventNumber": "", "event": "Over 19 Solo T", "section": "Over 19", "style": "Modern", "assignedJudges": []}, {"eventKey": "Over 19 Solo W||Over 19||Modern", "eventNumber": "", "event": "Over 19 Solo W", "section": "Over 19", "style": "Modern", "assignedJudges": []}, {"eventKey": "Over 19 Solo WTF||Over 19||Modern", "eventNumber": "", "event": "Over 19 Solo WTF", "section": "Over 19", "style": "Modern", "assignedJudges": []}, {"eventKey": "Over 19 Solo WTFQ||Over 19||Modern", "eventNumber": "", "event": "Over 19 Solo WTFQ", "section": "Over 19", "style": "Modern", "assignedJudges": []}, {"eventKey": "Over 19 Solo WTQ||Over 19||Modern", "eventNumber": "", "event": "Over 19 Solo WTQ", "section": "Over 19", "style": "Modern", "assignedJudges": []}, {"eventKey": "Over 35 Solo C||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo C", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo CR||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo CR", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo CRJ||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo CRJ", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo CRS||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo CRS", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo CSR||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo CSR", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo R||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo R", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo S||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo S", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Pro-Am Standard 3 Dance||Pro-Am||Modern", "eventNumber": "", "event": "Pro-Am Standard 3 Dance", "section": "Pro-Am", "style": "Modern", "assignedJudges": []}, {"eventKey": "Senior 50 CR||Senior||Other", "eventNumber": "", "event": "Senior 50 CR", "section": "Senior", "style": "Other", "assignedJudges": []}, {"eventKey": "Under 10 Solo C||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo C", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo CR||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo CR", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo CRJ||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo CRJ", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo CRS||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo CRS", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo J||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo J", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo P||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo P", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo R||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo R", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo RJ||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo RJ", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo S||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo S", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo F||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo F", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo Q||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo Q", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo T||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo T", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo W||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo W", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo WQ||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo WQ", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo WT||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo WT", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo WTF||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo WTF", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo WTQ||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo WTQ", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 CRS||Under 12||Latin", "eventNumber": "", "event": "Under 12 CRS", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo C||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo C", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo CJ||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo CJ", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo CR||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo CR", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo CRJ||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo CRJ", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo CRS||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo CRS", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo J||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo J", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo P||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo P", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo R||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo R", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo RJ||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo RJ", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo S||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo S", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo F||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo F", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo Q||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo Q", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo T||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo T", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo W||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo W", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo WQ||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo WQ", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo WT||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo WT", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo WTF||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo WTF", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo WTFQ||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo WTFQ", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo WTQ||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo WTQ", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 WTF||Under 12||Modern", "eventNumber": "", "event": "Under 12 WTF", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 CRS||Under 15||Latin", "eventNumber": "", "event": "Under 15 CRS", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CSRJ||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CSRJ", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo C||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo C", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CJ||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CJ", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CR||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CR", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CRJ||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CRJ", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CRS||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CRS", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CSR||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CSR", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo J||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo J", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo P||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo P", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo R||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo R", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo RJ||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo RJ", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo S||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo S", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo F||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo F", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo Q||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo Q", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo T||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo T", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo W||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo W", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo WQ||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo WQ", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo WT||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo WT", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo WTF||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo WTF", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo WTFQ||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo WTFQ", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo WTQ||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo WTQ", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 WTF||Under 15||Modern", "eventNumber": "", "event": "Under 15 WTF", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo 5 Dance||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo 5 Dance", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo C||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo C", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo CJ||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo CJ", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo CR||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo CR", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo CRJ||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo CRJ", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo CRS||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo CRS", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo Elite A Latin||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo Elite A Latin", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo J||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo J", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo P||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo P", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo R||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo R", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo RJ||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo RJ", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo S||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo S", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo F||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo F", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo Q||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo Q", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo T||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo T", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo W||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo W", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo WQ||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo WQ", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo WT||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo WT", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo WTF||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo WTF", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo WTFQ||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo WTFQ", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo WTQ||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo WTQ", "section": "Under 18", "style": "Modern", "assignedJudges": []}];
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
setupEvent.innerHTML=EVENTS.map(e=>`<option value="${e.eventKey}">${plainLabel(e)}</option>`).join("");
adminEvent.innerHTML=EVENTS.map(e=>`<option value="${e.eventKey}">${plainLabel(e)}</option>`).join("");
judgeChecks.innerHTML=JUDGES.map(j=>`<label class="judge-check"><input type="checkbox" value="${j.code}"><span>${j.code} · ${j.name}</span></label>`).join("");

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


// ===== TIMETABLE MANAGER =====
const ttmRowsHost=document.getElementById("ttmRows");
const ttmStartTime=document.getElementById("ttmStartTime");
const ttmMessage=document.getElementById("ttmMessage");
let ttmRows=[];
let ttmMeta={};

function ttmEsc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function ttmIsCompetitionRow(row){return String(row.no||"").trim()!=="";}
function ttmSecondsText(sec){sec=Math.max(0,Math.round(Number(sec)||0));const m=Math.floor(sec/60),s=sec%60;return `${m}:${String(s).padStart(2,"0")}`;}
function ttmStartToSeconds(v){const m=/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(String(v||""));return m?(+m[1]*3600)+(+m[2]*60)+(+m[3]||0):0;}
function ttmSecondsToClock(sec){sec=((sec%86400)+86400)%86400;const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;return s?`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`:`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;}
function ttmNormalize(row={}){
  const seconds=Math.max(0,Math.round(Number(row.durationSeconds ?? (Number(row.duration)||0)*60)||0));
  return {
    start:String(row.start||""), no:String(row.no??""), round:String(row.round||"Final"), style:String(row.style||""),
    section:String(row.section||""), division:String(row.division||""), event:String(row.event||""), entries:String(row.entries??""),
    danceOrder:String(row.danceOrder||""), duration:seconds/60, note:String(row.note||""), durationSeconds:seconds,
    durationText:String(row.durationText||ttmSecondsText(seconds)), sourceEventNo:String(row.sourceEventNo??""),
    ...(Array.isArray(row.backNumbers)?{backNumbers:row.backNumbers}:{}), ...(Array.isArray(row.sourceEvents)?{sourceEvents:row.sourceEvents}:{})
  };
}
function ttmReadCard(card){
  const i=Number(card.dataset.index), old=ttmRows[i]||{};
  const seconds=Math.max(0,Math.round(Number(card.querySelector('[data-f="durationSeconds"]').value)||0));
  ttmRows[i]={...old,
    start:card.querySelector('[data-f="start"]').value.trim(), no:card.querySelector('[data-f="no"]').value.trim(),
    round:card.querySelector('[data-f="round"]').value, style:card.querySelector('[data-f="style"]').value.trim(),
    section:card.querySelector('[data-f="section"]').value.trim(), division:card.querySelector('[data-f="division"]').value.trim(),
    event:card.querySelector('[data-f="event"]').value.trim(), entries:card.querySelector('[data-f="entries"]').value.trim(),
    danceOrder:card.querySelector('[data-f="danceOrder"]').value.trim(), note:card.querySelector('[data-f="note"]').value.trim(),
    durationSeconds:seconds,duration:seconds/60,durationText:ttmSecondsText(seconds)
  };
}
function ttmSyncAllCards(){ttmRowsHost?.querySelectorAll('.ttm-card').forEach(ttmReadCard);}
function ttmRender(){
  if(!ttmRowsHost)return;
  ttmRowsHost.innerHTML=ttmRows.map((r,i)=>`<article class="ttm-card" data-index="${i}">
    <div class="ttm-head"><strong>${r.no?`EVENT ${ttmEsc(r.no)}`:"NON-EVENT"}</strong><span>${ttmEsc(r.start||"—")}</span><div class="ttm-move"><button type="button" data-move="-1">↑</button><button type="button" data-move="1">↓</button><button type="button" data-delete="1" class="danger">DELETE</button></div></div>
    <div class="ttm-grid">
      <label>START<input data-f="start" value="${ttmEsc(r.start)}" placeholder="11:30"></label>
      <label>EVENT NO.<input data-f="no" inputmode="numeric" value="${ttmEsc(r.no)}" placeholder="blank = non-event"></label>
      <label>ROUND<select data-f="round">${["Quarter Final","Semi Final","Final","Grand Final","Opening","Break","Awards","Other"].map(x=>`<option ${String(r.round)===x?"selected":""}>${x}</option>`).join("")}</select></label>
      <label>DURATION (SEC)<input data-f="durationSeconds" type="number" min="0" value="${Number(r.durationSeconds)||0}"></label>
      <label>SECTION<input data-f="section" value="${ttmEsc(r.section)}"></label>
      <label>DIVISION<input data-f="division" value="${ttmEsc(r.division)}"></label>
      <label>STYLE<input data-f="style" value="${ttmEsc(r.style)}"></label>
      <label>ENTRIES<input data-f="entries" inputmode="numeric" value="${ttmEsc(r.entries)}"></label>
      <label class="ttm-wide">EVENT NAME<input data-f="event" value="${ttmEsc(r.event)}"></label>
      <label>DANCE<input data-f="danceOrder" value="${ttmEsc(r.danceOrder)}"></label>
      <label class="ttm-wide">NOTE<input data-f="note" value="${ttmEsc(r.note)}"></label>
    </div>
  </article>`).join("");
  ttmRowsHost.querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>{ttmSyncAllCards();const i=Number(b.closest('.ttm-card').dataset.index),j=i+Number(b.dataset.move);if(j<0||j>=ttmRows.length)return;[ttmRows[i],ttmRows[j]]=[ttmRows[j],ttmRows[i]];ttmRender();});
  ttmRowsHost.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{ttmSyncAllCards();const i=Number(b.closest('.ttm-card').dataset.index);if(confirm(`Delete ${ttmRows[i]?.event||"this row"}?`)){ttmRows.splice(i,1);ttmRender();}});
}
async function ttmLoadOriginal(){const r=await fetch(`timetable-data.json?v=${Date.now()}`,{cache:"no-store"});const d=await r.json();ttmMeta={...d};ttmRows=(d.rows||[]).map(ttmNormalize);ttmStartTime.value=(d.projectedStart||ttmRows[0]?.start||"11:30").slice(0,5);ttmRender();}
async function ttmLoad(){
  if(!ttmRowsHost)return;
  try{
    const snap=await get(ref(db,"timetable/current"));
    const saved=snap.val();
    if(saved&&Array.isArray(saved.rows)&&saved.rows.length){ttmMeta=saved.meta||{};ttmRows=saved.rows.map(ttmNormalize);ttmStartTime.value=(saved.startTime||ttmRows[0]?.start||"11:30").slice(0,5);ttmMessage.textContent="ONLINE TIMETABLE LOADED";ttmRender();}
    else{await ttmLoadOriginal();ttmMessage.textContent="ORIGINAL TIMETABLE LOADED";}
  }catch(e){console.error(e);ttmMessage.textContent="TIMETABLE LOAD ERROR";}
}
function ttmRecalculate(){
  ttmSyncAllCards();let cur=ttmStartToSeconds(ttmStartTime.value||ttmRows[0]?.start||"11:30");
  ttmRows.forEach(r=>{r.start=ttmSecondsToClock(cur);cur+=Math.max(0,Number(r.durationSeconds)||0);});ttmRender();ttmMessage.textContent="TIMES RECALCULATED — SAVE TO PUBLISH";
}
function ttmRenumber(){ttmSyncAllCards();let n=1;ttmRows.forEach(r=>{if(ttmIsCompetitionRow(r))r.no=String(n++);});ttmRender();ttmMessage.textContent="EVENT NUMBERS RENUMBERED — SAVE TO PUBLISH";}
document.getElementById("ttmRecalculateBtn")?.addEventListener("click",ttmRecalculate);
document.getElementById("ttmRenumberBtn")?.addEventListener("click",ttmRenumber);
document.getElementById("ttmAddBtn")?.addEventListener("click",()=>{ttmSyncAllCards();ttmRows.push(ttmNormalize({start:"",no:"",round:"Final",style:"",section:"",division:"",event:"New Event",entries:"",danceOrder:"",durationSeconds:75,note:""}));ttmRender();ttmRowsHost.lastElementChild?.scrollIntoView({behavior:"smooth",block:"center"});});
document.getElementById("ttmSaveBtn")?.addEventListener("click",async()=>{
  try{ttmSyncAllCards();const payload={version:1,updatedAt:Date.now(),startTime:ttmStartTime.value||ttmRows[0]?.start||"11:30",meta:{title:ttmMeta.title||"APDC 2026 TIMETABLE · JUDGE PROGRAM",summary:ttmMeta.summary||"",rules:ttmMeta.rules||{}},rows:ttmRows.map(ttmNormalize)};await set(ref(db,"timetable/current"),payload);ttmMessage.textContent="SAVED — MC / TIMETABLE UPDATED";}catch(e){console.error(e);ttmMessage.textContent="SAVE ERROR";}
});
document.getElementById("ttmRestoreBtn")?.addEventListener("click",async()=>{if(!confirm("Restore the original timetable file and publish it?"))return;await ttmLoadOriginal();await set(ref(db,"timetable/current"),{version:1,updatedAt:Date.now(),startTime:ttmStartTime.value,meta:{title:ttmMeta.title||"",summary:ttmMeta.summary||"",rules:ttmMeta.rules||{}},rows:ttmRows});ttmMessage.textContent="ORIGINAL TIMETABLE RESTORED";});
ttmLoad();

document.querySelectorAll("[data-admin-tab]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const tab=btn.dataset.adminTab;
    document.querySelectorAll("[data-admin-tab]").forEach(b=>b.classList.toggle("active",b===btn));
    document.querySelectorAll("[data-admin-panel]").forEach(panel=>{
      panel.classList.toggle("hidden",panel.dataset.adminPanel!==tab);
    });
  });
});

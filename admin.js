apdcBuildLanguageUI();
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref as firebaseRef, set, get, onValue, remove } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";
import { competitionPath, competitionId, isLegacyCompetition } from "./competition-context.js";
const ref=(db,path)=>firebaseRef(db, path===".info/connected"?path:competitionPath(path));

const EVENTS=[{"eventKey": "Ama Rising Star Latin||Amateur||Latin", "eventNumber": "", "event": "Ama Rising Star Latin", "section": "Amateur", "style": "Latin", "assignedJudges": []}, {"eventKey": "Amateur Latin||Amateur||Latin", "eventNumber": "", "event": "Amateur Latin", "section": "Amateur", "style": "Latin", "assignedJudges": []}, {"eventKey": "Amateur Solo Latin||Amateur||Latin", "eventNumber": "", "event": "Amateur Solo Latin", "section": "Amateur", "style": "Latin", "assignedJudges": []}, {"eventKey": "Asia Pacific Amateur Solo Latin 5 Dance||Amateur||Latin", "eventNumber": "", "event": "Asia Pacific Amateur Solo Latin 5 Dance", "section": "Amateur", "style": "Latin", "assignedJudges": []}, {"eventKey": "Formation||Formation||Other", "eventNumber": "", "event": "Formation", "section": "Formation", "style": "Other", "assignedJudges": []}, {"eventKey": "Mania Latin CR||Mania||Latin", "eventNumber": "", "event": "Mania Latin CR", "section": "Mania", "style": "Latin", "assignedJudges": []}, {"eventKey": "Mania Latin CRS||Mania||Latin", "eventNumber": "", "event": "Mania Latin CRS", "section": "Mania", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo 5 Dance||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo 5 Dance", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo C||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo C", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo CR||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo CR", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo CRS||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo CRS", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo Latin 5 Dance||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo Latin 5 Dance", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo Latin CRS||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo Latin CRS", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo P||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo P", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo R||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo R", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo RJ||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo RJ", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo S||Over 19||Latin", "eventNumber": "", "event": "Over 19 Solo S", "section": "Over 19", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 19 Solo T||Over 19||Modern", "eventNumber": "", "event": "Over 19 Solo T", "section": "Over 19", "style": "Modern", "assignedJudges": []}, {"eventKey": "Over 19 Solo W||Over 19||Modern", "eventNumber": "", "event": "Over 19 Solo W", "section": "Over 19", "style": "Modern", "assignedJudges": []}, {"eventKey": "Over 19 Solo WTF||Over 19||Modern", "eventNumber": "", "event": "Over 19 Solo WTF", "section": "Over 19", "style": "Modern", "assignedJudges": []}, {"eventKey": "Over 19 Solo WTFQ||Over 19||Modern", "eventNumber": "", "event": "Over 19 Solo WTFQ", "section": "Over 19", "style": "Modern", "assignedJudges": []}, {"eventKey": "Over 19 Solo WTQ||Over 19||Modern", "eventNumber": "", "event": "Over 19 Solo WTQ", "section": "Over 19", "style": "Modern", "assignedJudges": []}, {"eventKey": "Over 35 Solo C||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo C", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo CR||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo CR", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo CRJ||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo CRJ", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo CRS||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo CRS", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo CSR||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo CSR", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo R||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo R", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Over 35 Solo S||Over 35||Latin", "eventNumber": "", "event": "Over 35 Solo S", "section": "Over 35", "style": "Latin", "assignedJudges": []}, {"eventKey": "Pro-Am Standard 3 Dance||Pro-Am||Modern", "eventNumber": "", "event": "Pro-Am Standard 3 Dance", "section": "Pro-Am", "style": "Modern", "assignedJudges": []}, {"eventKey": "Senior 50 CR||Senior||Other", "eventNumber": "", "event": "Senior 50 CR", "section": "Senior", "style": "Other", "assignedJudges": []}, {"eventKey": "Under 10 Solo C||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo C", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo CR||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo CR", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo CRJ||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo CRJ", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo CRS||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo CRS", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo J||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo J", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo P||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo P", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo R||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo R", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo RJ||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo RJ", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo S||Under 10||Latin", "eventNumber": "", "event": "Under 10 Solo S", "section": "Under 10", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 10 Solo F||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo F", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo Q||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo Q", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo T||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo T", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo W||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo W", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo WQ||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo WQ", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo WT||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo WT", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo WTF||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo WTF", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 10 Solo WTQ||Under 10||Modern", "eventNumber": "", "event": "Under 10 Solo WTQ", "section": "Under 10", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 CRS||Under 12||Latin", "eventNumber": "", "event": "Under 12 CRS", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo C||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo C", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo CJ||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo CJ", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo CR||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo CR", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo CRJ||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo CRJ", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo CRS||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo CRS", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo J||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo J", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo P||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo P", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo R||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo R", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo RJ||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo RJ", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo S||Under 12||Latin", "eventNumber": "", "event": "Under 12 Solo S", "section": "Under 12", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 12 Solo F||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo F", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo Q||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo Q", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo T||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo T", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo W||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo W", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo WQ||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo WQ", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo WT||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo WT", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo WTF||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo WTF", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo WTFQ||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo WTFQ", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 Solo WTQ||Under 12||Modern", "eventNumber": "", "event": "Under 12 Solo WTQ", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 12 WTF||Under 12||Modern", "eventNumber": "", "event": "Under 12 WTF", "section": "Under 12", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 CRS||Under 15||Latin", "eventNumber": "", "event": "Under 15 CRS", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CSRJ||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CSRJ", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo C||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo C", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CJ||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CJ", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CR||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CR", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CRJ||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CRJ", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CRS||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CRS", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo CSR||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo CSR", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo J||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo J", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo P||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo P", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo R||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo R", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo RJ||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo RJ", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo S||Under 15||Latin", "eventNumber": "", "event": "Under 15 Solo S", "section": "Under 15", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 15 Solo F||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo F", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo Q||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo Q", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo T||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo T", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo W||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo W", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo WQ||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo WQ", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo WT||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo WT", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo WTF||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo WTF", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo WTFQ||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo WTFQ", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 Solo WTQ||Under 15||Modern", "eventNumber": "", "event": "Under 15 Solo WTQ", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 15 WTF||Under 15||Modern", "eventNumber": "", "event": "Under 15 WTF", "section": "Under 15", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo 5 Dance||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo 5 Dance", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo C||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo C", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo CJ||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo CJ", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo CR||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo CR", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo CRJ||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo CRJ", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo CRS||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo CRS", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo CSR||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo CSR", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo Elite A Latin||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo Elite A Latin", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo J||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo J", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo P||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo P", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo R||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo R", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo RJ||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo RJ", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo S||Under 18||Latin", "eventNumber": "", "event": "Under 18 Solo S", "section": "Under 18", "style": "Latin", "assignedJudges": []}, {"eventKey": "Under 18 Solo F||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo F", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo Q||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo Q", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo T||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo T", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo W||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo W", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo WQ||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo WQ", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo WT||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo WT", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo WTF||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo WTF", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo WTFQ||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo WTFQ", "section": "Under 18", "style": "Modern", "assignedJudges": []}, {"eventKey": "Under 18 Solo WTQ||Under 18||Modern", "eventNumber": "", "event": "Under 18 Solo WTQ", "section": "Under 18", "style": "Modern", "assignedJudges": []}];
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


// ===== ENTRY MANAGEMENT (V4) =====
const entryEvent=document.getElementById("entryEvent");
const entryBackNo=document.getElementById("entryBackNo");
const entryName=document.getElementById("entryName");
const entryList=document.getElementById("entryList");
const entryCount=document.getElementById("entryCount");
const entryMessage=document.getElementById("entryMessage");
const saveEntryBtn=document.getElementById("saveEntryBtn");
const cancelEntryEditBtn=document.getElementById("cancelEntryEditBtn");
let competitionEntries={};
let editingEntryKey=null;

if(entryEvent){
  entryEvent.innerHTML=EVENTS.map(e=>`<option value="${e.eventKey}">${plainLabel(e)}</option>`).join("");
}
function firebaseSafeKey(){ return `entry_${Date.now()}_${Math.random().toString(36).slice(2,9)}`; }
function selectedEntryEvent(){ return EVENTS.find(e=>e.eventKey===entryEvent?.value); }
function entryTypeFor(event){
  if(!event) return "Solo";
  if(/formation/i.test(event.event)) return "Formation";
  if(/amateur latin|rising star|couple|pro-am/i.test(event.event) && !/solo/i.test(event.event)) return "Couple";
  return "Solo";
}
function renderEntries(){
  if(!entryList||!entryEvent) return;
  const event=selectedEntryEvent();
  const rows=Object.entries(competitionEntries||{})
    .filter(([,x])=>x && event && x.event===event.event && x.section===event.section && x.style===event.style)
    .sort((a,b)=>String(a[1].backNo||"").localeCompare(String(b[1].backNo||""),undefined,{numeric:true}));
  entryCount.textContent=`${rows.length} ENTR${rows.length===1?'Y':'IES'}`;
  entryList.innerHTML=rows.length?rows.map(([key,x])=>`<div class="entry-row">
    <div class="backno">#${x.backNo||''}</div><div class="name">${x.competitor||''}</div>
    <div class="entry-row-actions"><button type="button" data-entry-edit="${key}">EDIT</button><button type="button" class="delete" data-entry-delete="${key}">DELETE</button></div>
  </div>`).join(""):'<div class="entry-empty">NO ENTRIES YET</div>';
}
function resetEntryForm(){
  editingEntryKey=null; if(entryBackNo)entryBackNo.value=""; if(entryName)entryName.value="";
  if(saveEntryBtn)saveEntryBtn.textContent="ADD ENTRY"; cancelEntryEditBtn?.classList.add("hidden");
}
entryEvent?.addEventListener("change",()=>{resetEntryForm();renderEntries();});
cancelEntryEditBtn?.addEventListener("click",resetEntryForm);
saveEntryBtn?.addEventListener("click",async()=>{
  const event=selectedEntryEvent(); const backNo=entryBackNo.value.trim(); const competitor=entryName.value.trim();
  if(!event||!backNo||!competitor){entryMessage.textContent="EVENT / BACK NO. / NAME을 모두 입력하세요.";return;}
  // Same event + back number updates instead of making a duplicate.
  let key=editingEntryKey;
  if(!key){
    const found=Object.entries(competitionEntries||{}).find(([,x])=>x&&x.event===event.event&&x.section===event.section&&x.style===event.style&&String(x.backNo)===backNo);
    key=found?.[0]||firebaseSafeKey();
  }
  const settingSnap=await get(ref(db,`eventSettings/${encodeKey(event.eventKey)}`));
  const setting=settingSnap.val()||event;
  await set(ref(db,`entries/${key}`),{
    eventNo:String(setting.eventNumber||event.eventNumber||""),section:event.section,style:event.style,
    division:event.event.replace(/\s+(C|S|R|J|CR|CJ|RJ|CS|CRS|CRJ|CSRJ|5 Dance|W|T|F|Q|WTFQ)$/i,""),
    event:event.event,backNo,competitor,entryType:entryTypeFor(event),updatedAt:Date.now()
  });
  entryMessage.textContent=editingEntryKey?"ENTRY UPDATED":"ENTRY ADDED"; resetEntryForm(); setTimeout(()=>entryMessage.textContent="",1200);
});
entryList?.addEventListener("click",async e=>{
  const edit=e.target.closest('[data-entry-edit]'); const del=e.target.closest('[data-entry-delete]');
  if(edit){ const key=edit.dataset.entryEdit,x=competitionEntries[key]; if(!x)return; editingEntryKey=key; entryBackNo.value=x.backNo||"";entryName.value=x.competitor||"";saveEntryBtn.textContent="SAVE CHANGES";cancelEntryEditBtn.classList.remove("hidden");window.scrollTo({top:entryEvent.getBoundingClientRect().top+scrollY-120,behavior:"smooth"}); }
  if(del){ const key=del.dataset.entryDelete,x=competitionEntries[key]; if(x&&confirm(`Delete #${x.backNo} ${x.competitor}?`)) await remove(ref(db,`entries/${key}`)); }
});
onValue(ref(db,"entries"),snap=>{competitionEntries=snap.val()||{};renderEntries();});

const publishSearchBtn=document.getElementById("publishSearchBtn");
const publishSearchMessage=document.getElementById("publishSearchMessage");
function currentCompetitionMeta(){
  let list=[]; try{list=JSON.parse(localStorage.getItem("apdc-competitions-v2")||"[]");if(!Array.isArray(list))list=[]}catch(e){}
  const found=list.find(x=>x&&x.id===competitionId)||{};
  return {id:competitionId,name:found.name||competitionId,date:found.date||"",venue:found.venue||""};
}
publishSearchBtn?.addEventListener("click",async()=>{
  if(isLegacyCompetition){
    publishSearchMessage.textContent="2026 APDC는 기존 SEARCH 데이터로 이미 공개되어 있습니다.";return;
  }
  const rows=Object.values(competitionEntries||{}).filter(x=>x&&x.backNo&&x.competitor&&x.event);
  if(!rows.length){publishSearchMessage.textContent="먼저 엔트리를 등록하세요.";return;}
  if(!confirm(`${rows.length}개 엔트리를 APDC SEARCH에 공개할까요?`))return;
  publishSearchBtn.disabled=true; publishSearchMessage.textContent="송출 중…";
  try{
    const meta=currentCompetitionMeta();
    const publicRows=rows.map(x=>({eventNo:String(x.eventNo||""),section:x.section||"",style:x.style||"",division:x.division||"",event:x.event||"",backNo:String(x.backNo||""),competitor:x.competitor||"",entryType:x.entryType||""}));
    await set(firebaseRef(db,`competitions/${competitionId}/publicEntries`),publicRows);
    await set(firebaseRef(db,`publishedCompetitions/${competitionId}`),{...meta,entryCount:publicRows.length,published:true,publishedAt:Date.now()});
    publishSearchMessage.textContent=`SEARCH 송출 완료 · ${publicRows.length} ENTRIES`;
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

function activateAdminTab(tab){
  const target=document.querySelector(`[data-admin-tab="${tab}"]`);
  if(!target)return;
  document.querySelectorAll("[data-admin-tab]").forEach(b=>b.classList.toggle("active",b===target));
  document.querySelectorAll("[data-admin-panel]").forEach(panel=>panel.classList.toggle("hidden",panel.dataset.adminPanel!==tab));
}
document.querySelectorAll("[data-admin-tab]").forEach(btn=>{
  btn.addEventListener("click",()=>activateAdminTab(btn.dataset.adminTab));
});
const requestedAdminTab=new URL(location.href).searchParams.get("tab");
if(requestedAdminTab)activateAdminTab(requestedAdminTab);

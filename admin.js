apdcBuildLanguageUI();
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref as firebaseRef, set, get, onValue, remove } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";
import { competitionPath, competitionId, isLegacyCompetition } from "./competition-context.js";
const ref=(db,path)=>firebaseRef(db, path===".info/connected"?path:competitionPath(path));

const BASE_EVENTS=[{"eventKey":"Ama Rising Star Latin||Amateur||Latin","eventNumber":"","event":"Ama Rising Star Latin","section":"Amateur","style":"Latin","assignedJudges":[]},{"eventKey":"Amateur Latin||Amateur||Latin","eventNumber":"","event":"Amateur Latin","section":"Amateur","style":"Latin","assignedJudges":[]},{"eventKey":"Amateur Solo Latin||Amateur||Latin","eventNumber":"","event":"Amateur Solo Latin","section":"Amateur","style":"Latin","assignedJudges":[]},{"eventKey":"Asia Pacific Amateur Solo Latin 5 Dance||Amateur||Latin","eventNumber":"","event":"Asia Pacific Amateur Solo Latin 5 Dance","section":"Amateur","style":"Latin","assignedJudges":[]},{"eventKey":"Formation||Formation||Other","eventNumber":"","event":"Formation","section":"Formation","style":"Other","assignedJudges":[]},{"eventKey":"Mania Latin CR||Mania||Latin","eventNumber":"","event":"Mania Latin CR","section":"Mania","style":"Latin","assignedJudges":[]},{"eventKey":"Mania Latin CRS||Mania||Latin","eventNumber":"","event":"Mania Latin CRS","section":"Mania","style":"Latin","assignedJudges":[]},{"eventKey":"Over 19 Solo 5 Dance||Over 19||Latin","eventNumber":"","event":"Over 19 Solo 5 Dance","section":"Over 19","style":"Latin","assignedJudges":[]},{"eventKey":"Over 19 Solo C||Over 19||Latin","eventNumber":"","event":"Over 19 Solo C","section":"Over 19","style":"Latin","assignedJudges":[]},{"eventKey":"Over 19 Solo CR||Over 19||Latin","eventNumber":"","event":"Over 19 Solo CR","section":"Over 19","style":"Latin","assignedJudges":[]},{"eventKey":"Over 19 Solo CRS||Over 19||Latin","eventNumber":"","event":"Over 19 Solo CRS","section":"Over 19","style":"Latin","assignedJudges":[]},{"eventKey":"Over 19 Solo Latin 5 Dance||Over 19||Latin","eventNumber":"","event":"Over 19 Solo Latin 5 Dance","section":"Over 19","style":"Latin","assignedJudges":[]},{"eventKey":"Over 19 Solo Latin CRS||Over 19||Latin","eventNumber":"","event":"Over 19 Solo Latin CRS","section":"Over 19","style":"Latin","assignedJudges":[]},{"eventKey":"Over 19 Solo P||Over 19||Latin","eventNumber":"","event":"Over 19 Solo P","section":"Over 19","style":"Latin","assignedJudges":[]},{"eventKey":"Over 19 Solo R||Over 19||Latin","eventNumber":"","event":"Over 19 Solo R","section":"Over 19","style":"Latin","assignedJudges":[]},{"eventKey":"Over 19 Solo RJ||Over 19||Latin","eventNumber":"","event":"Over 19 Solo RJ","section":"Over 19","style":"Latin","assignedJudges":[]},{"eventKey":"Over 19 Solo S||Over 19||Latin","eventNumber":"","event":"Over 19 Solo S","section":"Over 19","style":"Latin","assignedJudges":[]},{"eventKey":"Over 19 Solo T||Over 19||Modern","eventNumber":"","event":"Over 19 Solo T","section":"Over 19","style":"Modern","assignedJudges":[]},{"eventKey":"Over 19 Solo W||Over 19||Modern","eventNumber":"","event":"Over 19 Solo W","section":"Over 19","style":"Modern","assignedJudges":[]},{"eventKey":"Over 19 Solo WTF||Over 19||Modern","eventNumber":"","event":"Over 19 Solo WTF","section":"Over 19","style":"Modern","assignedJudges":[]},{"eventKey":"Over 19 Solo WTFQ||Over 19||Modern","eventNumber":"","event":"Over 19 Solo WTFQ","section":"Over 19","style":"Modern","assignedJudges":[]},{"eventKey":"Over 19 Solo WTQ||Over 19||Modern","eventNumber":"","event":"Over 19 Solo WTQ","section":"Over 19","style":"Modern","assignedJudges":[]},{"eventKey":"Over 35 Solo C||Over 35||Latin","eventNumber":"","event":"Over 35 Solo C","section":"Over 35","style":"Latin","assignedJudges":[]},{"eventKey":"Over 35 Solo CR||Over 35||Latin","eventNumber":"","event":"Over 35 Solo CR","section":"Over 35","style":"Latin","assignedJudges":[]},{"eventKey":"Over 35 Solo CRJ||Over 35||Latin","eventNumber":"","event":"Over 35 Solo CRJ","section":"Over 35","style":"Latin","assignedJudges":[]},{"eventKey":"Over 35 Solo CRS||Over 35||Latin","eventNumber":"","event":"Over 35 Solo CRS","section":"Over 35","style":"Latin","assignedJudges":[]},{"eventKey":"Over 35 Solo R||Over 35||Latin","eventNumber":"","event":"Over 35 Solo R","section":"Over 35","style":"Latin","assignedJudges":[]},{"eventKey":"Over 35 Solo S||Over 35||Latin","eventNumber":"","event":"Over 35 Solo S","section":"Over 35","style":"Latin","assignedJudges":[]},{"eventKey":"Pro-Am Standard 3 Dance||Pro-Am||Modern","eventNumber":"","event":"Pro-Am Standard 3 Dance","section":"Pro-Am","style":"Modern","assignedJudges":[]},{"eventKey":"Senior 50 CR||Senior||Other","eventNumber":"","event":"Senior 50 CR","section":"Senior","style":"Other","assignedJudges":[]},{"eventKey":"Under 10 Solo C||Under 10||Latin","eventNumber":"","event":"Under 10 Solo C","section":"Under 10","style":"Latin","assignedJudges":[]},{"eventKey":"Under 10 Solo CR||Under 10||Latin","eventNumber":"","event":"Under 10 Solo CR","section":"Under 10","style":"Latin","assignedJudges":[]},{"eventKey":"Under 10 Solo CRJ||Under 10||Latin","eventNumber":"","event":"Under 10 Solo CRJ","section":"Under 10","style":"Latin","assignedJudges":[]},{"eventKey":"Under 10 Solo CRS||Under 10||Latin","eventNumber":"","event":"Under 10 Solo CRS","section":"Under 10","style":"Latin","assignedJudges":[]},{"eventKey":"Under 10 Solo J||Under 10||Latin","eventNumber":"","event":"Under 10 Solo J","section":"Under 10","style":"Latin","assignedJudges":[]},{"eventKey":"Under 10 Solo P||Under 10||Latin","eventNumber":"","event":"Under 10 Solo P","section":"Under 10","style":"Latin","assignedJudges":[]},{"eventKey":"Under 10 Solo R||Under 10||Latin","eventNumber":"","event":"Under 10 Solo R","section":"Under 10","style":"Latin","assignedJudges":[]},{"eventKey":"Under 10 Solo RJ||Under 10||Latin","eventNumber":"","event":"Under 10 Solo RJ","section":"Under 10","style":"Latin","assignedJudges":[]},{"eventKey":"Under 10 Solo S||Under 10||Latin","eventNumber":"","event":"Under 10 Solo S","section":"Under 10","style":"Latin","assignedJudges":[]},{"eventKey":"Under 10 Solo F||Under 10||Modern","eventNumber":"","event":"Under 10 Solo F","section":"Under 10","style":"Modern","assignedJudges":[]},{"eventKey":"Under 10 Solo Q||Under 10||Modern","eventNumber":"","event":"Under 10 Solo Q","section":"Under 10","style":"Modern","assignedJudges":[]},{"eventKey":"Under 10 Solo T||Under 10||Modern","eventNumber":"","event":"Under 10 Solo T","section":"Under 10","style":"Modern","assignedJudges":[]},{"eventKey":"Under 10 Solo W||Under 10||Modern","eventNumber":"","event":"Under 10 Solo W","section":"Under 10","style":"Modern","assignedJudges":[]},{"eventKey":"Under 10 Solo WQ||Under 10||Modern","eventNumber":"","event":"Under 10 Solo WQ","section":"Under 10","style":"Modern","assignedJudges":[]},{"eventKey":"Under 10 Solo WT||Under 10||Modern","eventNumber":"","event":"Under 10 Solo WT","section":"Under 10","style":"Modern","assignedJudges":[]},{"eventKey":"Under 10 Solo WTF||Under 10||Modern","eventNumber":"","event":"Under 10 Solo WTF","section":"Under 10","style":"Modern","assignedJudges":[]},{"eventKey":"Under 10 Solo WTQ||Under 10||Modern","eventNumber":"","event":"Under 10 Solo WTQ","section":"Under 10","style":"Modern","assignedJudges":[]},{"eventKey":"Under 12 CRS||Under 12||Latin","eventNumber":"","event":"Under 12 CRS","section":"Under 12","style":"Latin","assignedJudges":[]},{"eventKey":"Under 12 Solo C||Under 12||Latin","eventNumber":"","event":"Under 12 Solo C","section":"Under 12","style":"Latin","assignedJudges":[]},{"eventKey":"Under 12 Solo CJ||Under 12||Latin","eventNumber":"","event":"Under 12 Solo CJ","section":"Under 12","style":"Latin","assignedJudges":[]},{"eventKey":"Under 12 Solo CR||Under 12||Latin","eventNumber":"","event":"Under 12 Solo CR","section":"Under 12","style":"Latin","assignedJudges":[]},{"eventKey":"Under 12 Solo CRJ||Under 12||Latin","eventNumber":"","event":"Under 12 Solo CRJ","section":"Under 12","style":"Latin","assignedJudges":[]},{"eventKey":"Under 12 Solo CRS||Under 12||Latin","eventNumber":"","event":"Under 12 Solo CRS","section":"Under 12","style":"Latin","assignedJudges":[]},{"eventKey":"Under 12 Solo J||Under 12||Latin","eventNumber":"","event":"Under 12 Solo J","section":"Under 12","style":"Latin","assignedJudges":[]},{"eventKey":"Under 12 Solo P||Under 12||Latin","eventNumber":"","event":"Under 12 Solo P","section":"Under 12","style":"Latin","assignedJudges":[]},{"eventKey":"Under 12 Solo R||Under 12||Latin","eventNumber":"","event":"Under 12 Solo R","section":"Under 12","style":"Latin","assignedJudges":[]},{"eventKey":"Under 12 Solo RJ||Under 12||Latin","eventNumber":"","event":"Under 12 Solo RJ","section":"Under 12","style":"Latin","assignedJudges":[]},{"eventKey":"Under 12 Solo S||Under 12||Latin","eventNumber":"","event":"Under 12 Solo S","section":"Under 12","style":"Latin","assignedJudges":[]},{"eventKey":"Under 12 Solo F||Under 12||Modern","eventNumber":"","event":"Under 12 Solo F","section":"Under 12","style":"Modern","assignedJudges":[]},{"eventKey":"Under 12 Solo Q||Under 12||Modern","eventNumber":"","event":"Under 12 Solo Q","section":"Under 12","style":"Modern","assignedJudges":[]},{"eventKey":"Under 12 Solo T||Under 12||Modern","eventNumber":"","event":"Under 12 Solo T","section":"Under 12","style":"Modern","assignedJudges":[]},{"eventKey":"Under 12 Solo W||Under 12||Modern","eventNumber":"","event":"Under 12 Solo W","section":"Under 12","style":"Modern","assignedJudges":[]},{"eventKey":"Under 12 Solo WQ||Under 12||Modern","eventNumber":"","event":"Under 12 Solo WQ","section":"Under 12","style":"Modern","assignedJudges":[]},{"eventKey":"Under 12 Solo WT||Under 12||Modern","eventNumber":"","event":"Under 12 Solo WT","section":"Under 12","style":"Modern","assignedJudges":[]},{"eventKey":"Under 12 Solo WTF||Under 12||Modern","eventNumber":"","event":"Under 12 Solo WTF","section":"Under 12","style":"Modern","assignedJudges":[]},{"eventKey":"Under 12 Solo WTFQ||Under 12||Modern","eventNumber":"","event":"Under 12 Solo WTFQ","section":"Under 12","style":"Modern","assignedJudges":[]},{"eventKey":"Under 12 Solo WTQ||Under 12||Modern","eventNumber":"","event":"Under 12 Solo WTQ","section":"Under 12","style":"Modern","assignedJudges":[]},{"eventKey":"Under 12 WTF||Under 12||Modern","eventNumber":"","event":"Under 12 WTF","section":"Under 12","style":"Modern","assignedJudges":[]},{"eventKey":"Under 15 CRS||Under 15||Latin","eventNumber":"","event":"Under 15 CRS","section":"Under 15","style":"Latin","assignedJudges":[]},{"eventKey":"Under 15 Solo CSRJ||Under 15||Latin","eventNumber":"","event":"Under 15 Solo CSRJ","section":"Under 15","style":"Latin","assignedJudges":[]},{"eventKey":"Under 15 Solo C||Under 15||Latin","eventNumber":"","event":"Under 15 Solo C","section":"Under 15","style":"Latin","assignedJudges":[]},{"eventKey":"Under 15 Solo CJ||Under 15||Latin","eventNumber":"","event":"Under 15 Solo CJ","section":"Under 15","style":"Latin","assignedJudges":[]},{"eventKey":"Under 15 Solo CR||Under 15||Latin","eventNumber":"","event":"Under 15 Solo CR","section":"Under 15","style":"Latin","assignedJudges":[]},{"eventKey":"Under 15 Solo CRJ||Under 15||Latin","eventNumber":"","event":"Under 15 Solo CRJ","section":"Under 15","style":"Latin","assignedJudges":[]},{"eventKey":"Under 15 Solo CRS||Under 15||Latin","eventNumber":"","event":"Under 15 Solo CRS","section":"Under 15","style":"Latin","assignedJudges":[]},{"eventKey":"Under 15 Solo J||Under 15||Latin","eventNumber":"","event":"Under 15 Solo J","section":"Under 15","style":"Latin","assignedJudges":[]},{"eventKey":"Under 15 Solo P||Under 15||Latin","eventNumber":"","event":"Under 15 Solo P","section":"Under 15","style":"Latin","assignedJudges":[]},{"eventKey":"Under 15 Solo R||Under 15||Latin","eventNumber":"","event":"Under 15 Solo R","section":"Under 15","style":"Latin","assignedJudges":[]},{"eventKey":"Under 15 Solo RJ||Under 15||Latin","eventNumber":"","event":"Under 15 Solo RJ","section":"Under 15","style":"Latin","assignedJudges":[]},{"eventKey":"Under 15 Solo S||Under 15||Latin","eventNumber":"","event":"Under 15 Solo S","section":"Under 15","style":"Latin","assignedJudges":[]},{"eventKey":"Under 15 Solo F||Under 15||Modern","eventNumber":"","event":"Under 15 Solo F","section":"Under 15","style":"Modern","assignedJudges":[]},{"eventKey":"Under 15 Solo Q||Under 15||Modern","eventNumber":"","event":"Under 15 Solo Q","section":"Under 15","style":"Modern","assignedJudges":[]},{"eventKey":"Under 15 Solo T||Under 15||Modern","eventNumber":"","event":"Under 15 Solo T","section":"Under 15","style":"Modern","assignedJudges":[]},{"eventKey":"Under 15 Solo W||Under 15||Modern","eventNumber":"","event":"Under 15 Solo W","section":"Under 15","style":"Modern","assignedJudges":[]},{"eventKey":"Under 15 Solo WQ||Under 15||Modern","eventNumber":"","event":"Under 15 Solo WQ","section":"Under 15","style":"Modern","assignedJudges":[]},{"eventKey":"Under 15 Solo WT||Under 15||Modern","eventNumber":"","event":"Under 15 Solo WT","section":"Under 15","style":"Modern","assignedJudges":[]},{"eventKey":"Under 15 Solo WTF||Under 15||Modern","eventNumber":"","event":"Under 15 Solo WTF","section":"Under 15","style":"Modern","assignedJudges":[]},{"eventKey":"Under 15 Solo WTFQ||Under 15||Modern","eventNumber":"","event":"Under 15 Solo WTFQ","section":"Under 15","style":"Modern","assignedJudges":[]},{"eventKey":"Under 15 Solo WTQ||Under 15||Modern","eventNumber":"","event":"Under 15 Solo WTQ","section":"Under 15","style":"Modern","assignedJudges":[]},{"eventKey":"Under 15 WTF||Under 15||Modern","eventNumber":"","event":"Under 15 WTF","section":"Under 15","style":"Modern","assignedJudges":[]},{"eventKey":"Under 18 Solo 5 Dance||Under 18||Latin","eventNumber":"","event":"Under 18 Solo 5 Dance","section":"Under 18","style":"Latin","assignedJudges":[]},{"eventKey":"Under 18 Solo C||Under 18||Latin","eventNumber":"","event":"Under 18 Solo C","section":"Under 18","style":"Latin","assignedJudges":[]},{"eventKey":"Under 18 Solo CJ||Under 18||Latin","eventNumber":"","event":"Under 18 Solo CJ","section":"Under 18","style":"Latin","assignedJudges":[]},{"eventKey":"Under 18 Solo CR||Under 18||Latin","eventNumber":"","event":"Under 18 Solo CR","section":"Under 18","style":"Latin","assignedJudges":[]},{"eventKey":"Under 18 Solo CRJ||Under 18||Latin","eventNumber":"","event":"Under 18 Solo CRJ","section":"Under 18","style":"Latin","assignedJudges":[]},{"eventKey":"Under 18 Solo CRS||Under 18||Latin","eventNumber":"","event":"Under 18 Solo CRS","section":"Under 18","style":"Latin","assignedJudges":[]},{"eventKey":"Under 18 Solo Elite A Latin||Under 18||Latin","eventNumber":"","event":"Under 18 Solo Elite A Latin","section":"Under 18","style":"Latin","assignedJudges":[]},{"eventKey":"Under 18 Solo J||Under 18||Latin","eventNumber":"","event":"Under 18 Solo J","section":"Under 18","style":"Latin","assignedJudges":[]},{"eventKey":"Under 18 Solo P||Under 18||Latin","eventNumber":"","event":"Under 18 Solo P","section":"Under 18","style":"Latin","assignedJudges":[]},{"eventKey":"Under 18 Solo R||Under 18||Latin","eventNumber":"","event":"Under 18 Solo R","section":"Under 18","style":"Latin","assignedJudges":[]},{"eventKey":"Under 18 Solo RJ||Under 18||Latin","eventNumber":"","event":"Under 18 Solo RJ","section":"Under 18","style":"Latin","assignedJudges":[]},{"eventKey":"Under 18 Solo S||Under 18||Latin","eventNumber":"","event":"Under 18 Solo S","section":"Under 18","style":"Latin","assignedJudges":[]},{"eventKey":"Under 18 Solo F||Under 18||Modern","eventNumber":"","event":"Under 18 Solo F","section":"Under 18","style":"Modern","assignedJudges":[]},{"eventKey":"Under 18 Solo Q||Under 18||Modern","eventNumber":"","event":"Under 18 Solo Q","section":"Under 18","style":"Modern","assignedJudges":[]},{"eventKey":"Under 18 Solo T||Under 18||Modern","eventNumber":"","event":"Under 18 Solo T","section":"Under 18","style":"Modern","assignedJudges":[]},{"eventKey":"Under 18 Solo W||Under 18||Modern","eventNumber":"","event":"Under 18 Solo W","section":"Under 18","style":"Modern","assignedJudges":[]},{"eventKey":"Under 18 Solo WQ||Under 18||Modern","eventNumber":"","event":"Under 18 Solo WQ","section":"Under 18","style":"Modern","assignedJudges":[]},{"eventKey":"Under 18 Solo WT||Under 18||Modern","eventNumber":"","event":"Under 18 Solo WT","section":"Under 18","style":"Modern","assignedJudges":[]},{"eventKey":"Under 18 Solo WTF||Under 18||Modern","eventNumber":"","event":"Under 18 Solo WTF","section":"Under 18","style":"Modern","assignedJudges":[]},{"eventKey":"Under 18 Solo WTFQ||Under 18||Modern","eventNumber":"","event":"Under 18 Solo WTFQ","section":"Under 18","style":"Modern","assignedJudges":[]},{"eventKey":"Under 18 Solo WTQ||Under 18||Modern","eventNumber":"","event":"Under 18 Solo WTQ","section":"Under 18","style":"Modern","assignedJudges":[]}];
let customEvents={};
// V12: 새 대회에서는 2026 전체 종목을 자동으로 깔지 않습니다.
// EVENTS는 이 대회에서 실제로 선택/생성한 이벤트 + 이미 저장된 엔트리에서 복구한 이벤트만 사용합니다.
let EVENTS=[];

const DEFAULT_JUDGE_CODES=["T1","T2","T3","T4","T5","T6","T7","T8","W1","W2","W3","W4","W5","W6","W7","W8","W9"];
let JUDGES=DEFAULT_JUDGE_CODES.map(code=>({code}));

const app=initializeApp(firebaseConfig);
const db=getDatabase(app);
const encodeKey=k=>btoa(unescape(encodeURIComponent(k))).replaceAll("=","");

const gate=document.getElementById("adminPasswordGate");
const protectedBox=document.getElementById("adminProtected");
const passInput=document.getElementById("adminPasswordInput");
const passBtn=document.getElementById("adminPasswordBtn");
const passMsg=document.getElementById("adminPasswordMessage");
async function sha256(v){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
const unlockKey=`apdcAdminUnlocked:${competitionId}`;
function unlock(){sessionStorage.setItem(unlockKey,"yes");gate.classList.add("hidden");protectedBox.classList.remove("hidden");}
passBtn.onclick=async()=>{const meta=(await get(ref(db,"meta"))).val()||{};const ok=meta.adminPasswordHash?(await sha256(passInput.value))===meta.adminPasswordHash:(isLegacyCompetition&&passInput.value==="0808");if(ok)unlock();else passMsg.textContent="WRONG PASSWORD";};
passInput.onkeydown=e=>{if(e.key==="Enter")passBtn.click();};
if(sessionStorage.getItem(unlockKey)==="yes")unlock();

const setupEvent=document.getElementById("setupEvent");
const setupEventNumber=document.getElementById("setupEventNumber");
const setupRound=document.getElementById("setupRound");
const judgeChecks=document.getElementById("judgeChecks");
const setupMessage=document.getElementById("setupMessage");
const adminEvent=document.getElementById("adminEvent");
const adminRound=document.getElementById("adminRound");
const judgeGroup=document.getElementById("judgeGroup");

const DEFAULT_SOLO_SECTIONS=["Under 10","Under 12","Under 15","Under 18"];
const DEFAULT_LATIN_DANCES=["C","S","R","J","CR","RJ","CRS","CRJ","5 Dance"];
const DEFAULT_STANDARD_DANCES=["W","T","F","Q","WTF","WTFQ","5 Dance"];
function makeDefaultEvent(event,section,style){
  const id=`default_${String(event).toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"")}`;
  return {id,event,section,style,eventKey:`custom:${id}`,eventNumber:"",assignedJudges:[],custom:true,defaultPreset:true,updatedAt:Date.now()};
}
function buildDefaultEventSet(){
  const rows=[];
  for(const section of DEFAULT_SOLO_SECTIONS){
    for(const dance of DEFAULT_LATIN_DANCES){
      const suffix=dance==="5 Dance"?"Latin 5 Dance":dance;
      rows.push(makeDefaultEvent(`${section} Solo ${suffix}`,section,"Latin"));
    }
    for(const dance of DEFAULT_STANDARD_DANCES){
      const suffix=dance==="5 Dance"?"Standard 5 Dance":dance;
      rows.push(makeDefaultEvent(`${section} Solo ${suffix}`,section,"Modern"));
    }
  }
  [
    ["Asia Pacific Amateur Latin","Amateur","Latin"],
    ["Amateur Rising Star Latin","Amateur","Latin"],
    ["Amateur Solo Latin 5 Dance","Amateur","Latin"],
    ["Over 19 Solo Latin 5 Dance","Over 19","Latin"],
    ["Over 35 Solo CRS","Over 35","Latin"],
    ["Senior 50 CR","Senior 50","Latin"],
    ["Pro-Am Standard 3 Dance","Pro-Am","Modern"],
    ["Formation","Formation","Other"]
  ].forEach(x=>rows.push(makeDefaultEvent(...x)));
  // Safety: collapse logical duplicates such as CRS/CSR before saving.
  return rows.filter((e,i,a)=>a.findIndex(x=>danceSignatureForSeed(x)===danceSignatureForSeed(e))===i);
}
function danceSignatureForSeed(e){
  const name=String(e?.event||"").trim();
  const m=name.match(/\b([CSRPJWTVFQ]{2,5})$/i);
  if(!m) return `${name.toLowerCase().replace(/\s+/g," ")}||${String(e.section||"").toLowerCase()}||${String(e.style||"").toLowerCase()}`;
  const chars=[...m[1].toUpperCase()].sort().join("");
  return `${name.slice(0,m.index).trim().toLowerCase().replace(/\s+/g," ")}||${chars}||${String(e.section||"").toLowerCase()}||${String(e.style||"").toLowerCase()}`;
}
let defaultSeedInProgress=false;
async function ensureDefaultEvents(){
  if(isLegacyCompetition || defaultSeedInProgress) return;
  const seeded=await get(ref(db,"meta/defaultEventsSeededV14"));
  if(seeded.val()) return;
  defaultSeedInProgress=true;
  try{
    const existing=Object.values(customEvents||{}).filter(Boolean);
    const signatures=new Set(existing.map(danceSignatureForSeed));
    for(const item of buildDefaultEventSet()){
      if(signatures.has(danceSignatureForSeed(item))) continue;
      await set(ref(db,`customEvents/${item.id}`),item);
      signatures.add(danceSignatureForSeed(item));
    }
    await set(ref(db,"meta/defaultEventsSeededV14"),true);
  } finally { defaultSeedInProgress=false; }
}
const plainLabel=e=>`${e.section} · ${e.event}`;
function eventFromEntry(x){return {eventKey:x.eventKey||`entry:${encodeKey(eventId(x))}`,eventNumber:x.eventNo||"",event:x.event||"",section:x.section||"",style:x.style||"Other",assignedJudges:[],recovered:true};}
function refreshEventSources(){
  const saved=Object.values(customEvents||{}).filter(x=>x && !x.importedFrom2026);
  EVENTS=saved.filter((e,i,a)=>e.event&&a.findIndex(x=>eventId(x)===eventId(e))===i);
  if(setupEvent) setupEvent.innerHTML=EVENTS.map(e=>`<option value="${e.eventKey}">${plainLabel(e)}</option>`).join("");
  if(adminEvent) adminEvent.innerHTML=EVENTS.map(e=>`<option value="${e.eventKey}">${plainLabel(e)}</option>`).join("");
  renderEventChecks(); renderCustomEventList();
}
judgeChecks.innerHTML=JUDGES.map(j=>`<label class="judge-check"><input type="checkbox" value="${j.code}"><span>${j.code}</span></label>`).join("");


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
async function cleanupCompletedDataForEmptyEvents(affectedEventIds){
  const ids=[...new Set((affectedEventIds||[]).filter(Boolean))];
  if(!ids.length)return;
  const entriesSnap=await get(ref(db,"entries"));
  const liveEntries=Object.values(entriesSnap.val()||{}).filter(Boolean);
  const emptyIds=ids.filter(id=>!liveEntries.some(x=>eventId(x)===id));
  if(!emptyIds.length)return;

  const settingsSnap=await get(ref(db,"eventSettings"));
  const settings=settingsSnap.val()||{};
  const pairs=Array.isArray(settings?.events)
    ? settings.events.map(x=>[btoa(unescape(encodeURIComponent(x.eventKey||''))).replaceAll('=',''),x])
    : Object.entries(settings).filter(([k])=>k!=="events");

  for(const id of emptyIds){
    for(const [encoded,setting] of pairs){
      const sid=setting?.eventKey||eventId(setting||{});
      if(sid!==id && eventId(setting||{})!==id)continue;
      await remove(ref(db,`results/${encoded}`));
      await remove(ref(db,`submissions/${encoded}_quarter`));
      await remove(ref(db,`submissions/${encoded}_semi`));
      await remove(ref(db,`submissions/${encoded}_final`));
    }
  }
}
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


// ===== EVENT CATALOG MANAGEMENT (V12) =====
function danceSignature(e){
  const name=String(e?.event||"").trim();
  const m=name.match(/\b([CSRPJWT FQ]{2,5})$/i);
  if(!m) return name.toLowerCase().replace(/\s+/g," ");
  const chars=[...m[1].replace(/\s/g,"").toUpperCase()].sort().join("");
  return (name.slice(0,m.index).trim().toLowerCase().replace(/\s+/g," ")+"||"+chars+"||"+String(e.section||"").toLowerCase()+"||"+String(e.style||"").toLowerCase());
}
function sameLogicalEvent(a,b){return danceSignature(a)===danceSignature(b);}
const customEventName=document.getElementById("customEventName");
const customEventSection=document.getElementById("customEventSection");
const customEventStyle=document.getElementById("customEventStyle");
const customEventSaveBtn=document.getElementById("customEventSaveBtn");
const customEventCancelBtn=document.getElementById("customEventCancelBtn");
const customEventList=document.getElementById("customEventList");
const customEventMessage=document.getElementById("customEventMessage");
let editingCustomEventId="";
const eventBuilderType=document.getElementById("eventBuilderType");
const eventBuilderStyle=document.getElementById("eventBuilderStyle");
const eventBuilderSection=document.getElementById("eventBuilderSection");
const eventBuilderDance=document.getElementById("eventBuilderDance");
const eventBuilderAddBtn=document.getElementById("eventBuilderAddBtn");
const LATIN_DANCES=["C","S","R","P","J","CR","RJ","CS","SR","CRJ","CRS","CSRJ","5 Dance"];
const STANDARD_DANCES=["W","T","V","F","Q","WT","WQ","TQ","WTF","WTQ","WTFQ","5 Dance"];
function refreshBuilderDances(){
  const arr=eventBuilderStyle?.value==="Modern"?STANDARD_DANCES:LATIN_DANCES;
  if(eventBuilderDance) eventBuilderDance.innerHTML=arr.map(x=>`<option value="${x}">${x}</option>`).join("");
}
eventBuilderStyle?.addEventListener("change",refreshBuilderDances); refreshBuilderDances();
eventBuilderAddBtn?.addEventListener("click",async()=>{
  const type=eventBuilderType.value, style=eventBuilderStyle.value, section=eventBuilderSection.value, dance=eventBuilderDance.value;
  const styleWord=style==="Modern"?"Standard":"";
  const danceWord=dance==="5 Dance"?(style==="Modern"?"Standard 5 Dance":"Latin 5 Dance"):dance;
  const event=[section,type,styleWord,danceWord].filter(Boolean).join(" ").replace(/\s+/g," ").trim();
  const id=customId(); const item={id,event,section,style,eventKey:`custom:${id}`,eventNumber:"",assignedJudges:[],custom:true,updatedAt:Date.now()};
  if(EVENTS.some(e=>sameLogicalEvent(e,item))){customEventMessage.textContent="이미 같은 이벤트가 추가되어 있습니다. CRS/CSR처럼 순서만 다른 조합도 중복으로 추가되지 않습니다.";return;}
  await set(ref(db,`customEvents/${id}`),item); customEventMessage.textContent=`${event} 추가 완료`;
});
function customId(){return `event_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;}
function renderCustomEventList(){
  if(!customEventList)return;
  const rows=EVENTS;
  customEventList.innerHTML=rows.length?rows.map(x=>{const stored=Object.entries(customEvents||{}).find(([,v])=>v&&eventId(v)===eventId(x));const id=stored?.[0]||"";return `<div class="custom-event-row"><div><b>${x.event}</b><small>${x.section} · ${x.style}${x.importedFrom2026?'':''}</small></div><div>${id?`<button type="button" class="light" data-event-edit="${id}">EDIT</button><button type="button" class="light delete" data-event-delete="${id}">DELETE</button>`:`<button type="button" class="light" data-recovered-edit="${encodeURIComponent(eventId(x))}">EDIT</button><button type="button" class="light delete" data-recovered-delete="${encodeURIComponent(eventId(x))}">DELETE</button>`}</div></div>`}).join(""):'<div class="entry-empty">추가된 이벤트가 없습니다. 위에서 종류를 선택해 + EVENT ADD를 누르세요.</div>';
}
function resetCustomEventForm(){editingCustomEventId=""; if(customEventName)customEventName.value="";if(customEventSection)customEventSection.value="";if(customEventStyle)customEventStyle.value="Latin";customEventSaveBtn.textContent="+ NEW EVENT 저장";customEventCancelBtn?.classList.add("hidden");}
customEventCancelBtn?.addEventListener("click",resetCustomEventForm);
customEventSaveBtn?.addEventListener("click",async()=>{
  const event=customEventName.value.trim(),section=customEventSection.value.trim(),style=customEventStyle.value;
  if(!event||!section){customEventMessage.textContent="EVENT NAME과 SECTION을 입력하세요.";return;}
  const id=editingCustomEventId||customId(); const old=editingCustomEventId?customEvents[id]:null;
  const item={id,event,section,style,eventKey:`custom:${id}`,eventNumber:old?.eventNumber||"",assignedJudges:old?.assignedJudges||[],custom:true,updatedAt:Date.now()};
  if(EVENTS.some(e=>sameLogicalEvent(e,item) && (!old||eventId(e)!==eventId(old)))){customEventMessage.textContent="같은 댄스 조합의 이벤트가 이미 있습니다. (예: CRS와 CSR은 중복으로 처리됩니다.)";return;}
  if(old && eventId(old)!==eventId(item)){
    // Rename/move: migrate every existing entry so players never lose their event.
    for(const [key,x] of Object.entries(competitionEntries||{})) if(x&&eventId(x)===eventId(old)) await set(ref(db,`entries/${key}`),{...x,event:item.event,section:item.section,style:item.style,division:item.event,updatedAt:Date.now()});
  }
  await set(ref(db,`customEvents/${id}`),item); customEventMessage.textContent=old?"이벤트 수정 완료":"새 이벤트 추가 완료"; resetCustomEventForm();
});
customEventList?.addEventListener("click",async e=>{
  const reb=e.target.closest("[data-recovered-edit]"), rdb=e.target.closest("[data-recovered-delete]");
  if(reb){const eid=decodeURIComponent(reb.dataset.recoveredEdit),x=EVENTS.find(v=>eventId(v)===eid);if(x){const id=customId();await set(ref(db,`customEvents/${id}`),{...x,id,eventKey:`custom:${id}`,custom:true,updatedAt:Date.now()});setTimeout(()=>{const b=customEventList.querySelector(`[data-event-edit="${id}"]`);b?.click();},100);}return;}
  if(rdb){const eid=decodeURIComponent(rdb.dataset.recoveredDelete),x=EVENTS.find(v=>eventId(v)===eid);const affected=Object.entries(competitionEntries||{}).filter(([,r])=>r&&eventId(r)===eid);if(x&&confirm(`${x.event} 이벤트를 삭제할까요?\n등록된 엔트리 ${affected.length}개도 함께 삭제됩니다.`)){for(const [key] of affected)await remove(ref(db,`entries/${key}`));await cleanupCompletedDataForEmptyEvents([eid]);}return;}
  const eb=e.target.closest("[data-event-edit]"), dbtn=e.target.closest("[data-event-delete]");
  if(eb){const id=eb.dataset.eventEdit,x=customEvents[id];if(!x)return;editingCustomEventId=id;customEventName.value=x.event;customEventSection.value=x.section;customEventStyle.value=x.style||"Latin";customEventSaveBtn.textContent="SAVE EVENT CHANGES";customEventCancelBtn.classList.remove("hidden");customEventName.scrollIntoView({behavior:"smooth",block:"center"});}
  if(dbtn){const id=dbtn.dataset.eventDelete,x=customEvents[id];if(!x)return;const affected=Object.entries(competitionEntries||{}).filter(([,r])=>r&&eventId(r)===eventId(x));if(!confirm(`${x.event} 이벤트를 삭제할까요?\n등록된 엔트리 ${affected.length}개도 함께 삭제됩니다.`))return;for(const [key] of affected)await remove(ref(db,`entries/${key}`));await cleanupCompletedDataForEmptyEvents([eventId(x)]);await remove(ref(db,`customEvents/${id}`));customEventMessage.textContent="이벤트 삭제 완료";}
});
onValue(ref(db,"customEvents"),async snap=>{customEvents=snap.val()||{};refreshEventSources();await ensureDefaultEvents();});

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

const reorganizeBackNoBtn=document.getElementById("reorganizeBackNoBtn");
reorganizeBackNoBtn?.addEventListener("click",async()=>{
  const sections=[...new Set(Object.values(competitionEntries||{}).map(x=>x?.section).filter(Boolean))].sort();
  if(!sections.length){entryMessage.textContent="재정리할 엔트리가 없습니다.";return;}
  const section=prompt(`재정리할 SECTION을 정확히 입력하세요.\n\n${sections.join(" / ")}`,sections[0]); if(!section)return;
  if(!sections.includes(section)){entryMessage.textContent="존재하지 않는 SECTION입니다.";return;}
  const startRaw=prompt("시작 백넘버를 입력하세요.","1"); if(startRaw===null)return; let next=Number(startRaw); if(!Number.isInteger(next)||next<1){entryMessage.textContent="시작 번호는 1 이상의 숫자여야 합니다.";return;}
  const targetNames=[...new Set(Object.values(competitionEntries||{}).filter(x=>x&&x.section===section).map(x=>String(x.competitor||"").trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  const targetSet=new Set(targetNames.map(x=>x.toLowerCase()));
  const reserved=new Set(Object.values(competitionEntries||{}).filter(x=>x&&!targetSet.has(String(x.competitor||"").trim().toLowerCase())).map(x=>String(x.backNo||"").trim()).filter(Boolean));
  const mapping=new Map(); for(const name of targetNames){while(reserved.has(String(next)))next++;mapping.set(name.toLowerCase(),String(next++));}
  if(!confirm(`${section} 선수 ${targetNames.length}명의 백넘버를 ${startRaw}부터 중복 없이 재정리할까요?\n선수가 다른 섹션에도 출전하면 그 선수의 모든 엔트리 백넘버가 함께 변경됩니다.`))return;
  reorganizeBackNoBtn.disabled=true; try{for(const [key,row] of Object.entries(competitionEntries||{})){const n=mapping.get(String(row?.competitor||"").trim().toLowerCase());if(n&&String(row.backNo)!==n)await set(ref(db,`entries/${key}/backNo`),n);}entryMessage.textContent=`${section} 백넘버 재정리 완료 · ${targetNames.length} PLAYERS`;}finally{reorganizeBackNoBtn.disabled=false;}
});

saveEntryBtn?.addEventListener("click",async()=>{
  const backNo=entryBackNo.value.trim();
  const competitor=entryName.value.trim();
  const chosen=new Set(selectedEventIds());
  if(!backNo||!competitor){entryMessage.textContent="BACK NO. / NAME을 입력하세요.";return;}
  const duplicateOwner=Object.values(competitionEntries||{}).find(x=>x&&String(x.backNo).trim()===backNo&&String(x.competitor||"").trim().toLowerCase()!==competitor.toLowerCase()&&String(x.backNo).trim()!==String(editingOriginalBackNo||"").trim());
  if(duplicateOwner){entryMessage.textContent=`BACK NO. ${backNo}는 이미 ${duplicateOwner.competitor} 선수가 사용 중입니다.`;entryBackNo.focus();return;}
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
      const affectedEventIds=rows.map(([,x])=>eventId(x));
      for(const [key] of rows) await remove(ref(db,`entries/${key}`));
      await cleanupCompletedDataForEmptyEvents(affectedEventIds);
      if(editingOriginalBackNo===backNo) resetEntryForm();
    }
  }
});
let entriesLoadedOnce=false,entrySyncTimer=null;
onValue(ref(db,"entries"),snap=>{competitionEntries=snap.val()||{};refreshEventSources();renderEntries(); if(entriesLoadedOnce){clearTimeout(entrySyncTimer);entrySyncTimer=setTimeout(()=>syncTimetableWithEntries().catch(console.error),250);} entriesLoadedOnce=true;});

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
  // APDC round rule: 15+ start at Quarter Final, 7-14 start at Semi Final, 1-6 go straight to Final.
  if(count>=15) return ["Quarter Final","Semi Final","Final"];
  if(count>=7) return ["Semi Final","Final"];
  return ["Final"];
}
function roundOrder(round){return ({"Quarter Final":0,"Semi Final":1,"Final":2})[round]??9;}
function autoTimetableRow(sample,ents,round,template={}){
  const backs=[...new Set(ents.map(x=>String(x.backNo).trim()).filter(Boolean))].sort((a,b)=>Number(a)-Number(b));
  const dances=danceCodes(sample.event);
  return {...template,no:"",start:"",round,style:sample.style||"",section:sample.section||"",division:sample.division||"",event:sample.event||"",entries:String(backs.length),danceOrder:dances.join(" → "),durationSeconds:/formation/i.test(sample.event)?600:Math.max(80,dances.length*80),durationText:"",sourceEvents:[sample.event],backNumbers:backs,note:template.note||"AUTO FROM ENTRIES",combined:false};
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
  const original=timetableRows.slice();
  const handled=new Set();
  const next=[];

  // Keep the existing event order, but rebuild each normal event's rounds from the CURRENT entry count.
  // This means crossing 6/7 or 14/15 entries automatically creates/removes the required rounds.
  for(let i=0;i<original.length;i++){
    const row=original[i];
    if(row.combined&&row.sourceEvents?.length){
      const rowRound=String(row.round||"Final");
      const eligibleNames=[];
      for(const name of row.sourceEvents){
        const groups=[...byEvent.entries()].filter(([,es])=>es[0]?.event===name);
        if(groups.some(([,es])=>roundPlan(new Set(es.map(x=>String(x.backNo))).size).includes(rowRound))) eligibleNames.push(name);
      }
      if(!eligibleNames.length)continue;
      const sourceEntries=entries.filter(x=>eligibleNames.includes(x.event));
      const backs=[...new Set(sourceEntries.map(x=>String(x.backNo)).filter(Boolean))].sort((a,b)=>Number(a)-Number(b));
      sourceEntries.forEach(x=>handled.add(`${eventIdentity(x)}@@${rowRound}`));
      const stillCombined=eligibleNames.length>1;
      next.push({...row,event:eligibleNames.join(" + "),sourceEvents:eligibleNames,combined:stillCombined,entries:String(backs.length),backNumbers:backs});
      continue;
    }
    const key=eventIdentity(row);
    if(handled.has(`${key}@@GROUP`))continue;
    const ents=byEvent.get(key)||[];
    if(!ents.length){handled.add(`${key}@@GROUP`);continue;}
    const plan=roundPlan(new Set(ents.map(x=>String(x.backNo))).size);
    const templates=original.filter(r=>!r.combined&&eventIdentity(r)===key);
    for(const round of plan){
      const template=templates.find(r=>String(r.round)===round)||templates[0]||row;
      next.push(autoTimetableRow(ents[0],ents,round,{...template,sourceEventNo:template.sourceEventNo||row.sourceEventNo||"",sourceEventNos:template.sourceEventNos||row.sourceEventNos||[]}));
      handled.add(`${key}@@${round}`);
    }
    handled.add(`${key}@@GROUP`);
  }

  // Newly added events, or rounds not represented because their only prior row was part of a combined floor.
  for(const [key,ents] of byEvent){
    const sample=ents[0], plan=roundPlan(new Set(ents.map(x=>String(x.backNo))).size);
    for(const round of plan){
      if(handled.has(`${key}@@${round}`))continue;
      const sourceNo=String(sample.eventNo||EVENTS.find(z=>eventIdentity(z)===key)?.eventNumber||"");
      next.push(autoTimetableRow(sample,ents,round,{sourceEventNo:sourceNo,sourceEventNos:sourceNo?[sourceNo]:[]}));
      handled.add(`${key}@@${round}`);
    }
  }
  timetableRows=renumberAndRetimestamp(next); await saveTimetableRows(); renderTimetableBuilder();
  if(ttBuilderMessage)ttBuilderMessage.textContent="엔트리 수에 맞춰 Quarter / Semi / Final이 자동 반영되었습니다.";
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
    const dances=danceCodes(sample.event); const rounds=roundPlan(backs.length);
    for(const round of rounds){
      const durationSeconds=/formation/i.test(sample.event)?600:Math.max(80,dances.length*80);
      built.push({no:"",start:"",round,style:sample.style||"",section:sample.section||"",division:sample.division||"",event:sample.event||"",entries:String(ents.length),danceOrder:dances.join(" → "),durationSeconds,durationText:"",sourceEventNo:sourceNo,sourceEventNos:[sourceNo],sourceEvents:[sample.event],backNumbers:backs,note:"",combined:false});
    }
  }
  built.sort((a,b)=>Number(a.sourceEventNo)-Number(b.sourceEventNo)||roundOrder(a.round)-roundOrder(b.round));
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
    <div class="tt-row-actions"><button type="button" class="light tt-setting-btn" data-tt-setting="${i}">라운드 설정</button></div>
  </div>`).join(""):'<div class="entry-empty">타임테이블이 없습니다. 엔트리 완성 후 위 버튼을 눌러주세요.</div>';
  ttBuilderList.querySelectorAll('[data-tt-setting]').forEach(btn=>btn.addEventListener('click',()=>openTimetableJudgeEditor(Number(btn.dataset.ttSetting))));
}
const ttJudgeEditor=document.getElementById("ttJudgeEditor");
const ttJudgeEditorTitle=document.getElementById("ttJudgeEditorTitle");
const ttJudgeRound=document.getElementById("ttJudgeRound");
const ttJudgeSaveBtn=document.getElementById("ttJudgeSaveBtn");
const ttJudgeMessage=document.getElementById("ttJudgeMessage");
let editingTimetableIndex=-1;
function timetableEventKey(row){
  const exact=EVENTS.find(e=>e.event===row.event && (!row.section||e.section===row.section));
  return exact?.eventKey || `${row.event||""}||${row.section||""}||${row.style||""}`;
}
async function openTimetableJudgeEditor(index){
  const row=timetableRows[index]; if(!row)return; editingTimetableIndex=index;
  ttJudgeEditor.classList.remove("hidden");
  ttJudgeEditorTitle.textContent=`EVENT ${row.no} · ${row.event}`;
  ttJudgeRound.value=String(row.round||"Final").toLowerCase().startsWith("quarter")?"quarter":String(row.round||"Final").toLowerCase().startsWith("semi")?"semi":"final";
  ttJudgeMessage.textContent=""; ttJudgeEditor.scrollIntoView({behavior:"smooth",block:"nearest"});
}
ttJudgeSaveBtn?.addEventListener("click",async()=>{
  const row=timetableRows[editingTimetableIndex]; if(!row)return;
  const roundValue=ttJudgeRound.value; const roundLabel=roundValue==="quarter"?"Quarter Final":roundValue==="semi"?"Semi Final":"Final";
  const key=timetableEventKey(row);
  const snap=await get(ref(db,`eventSettings/${encodeKey(key)}`));
  const old=snap.val()||{};
  // Timetable edits only the round. Judge assignment is owned exclusively by the JUDGING tab.
  await set(ref(db,`eventSettings/${encodeKey(key)}`),{...old,eventKey:key,eventNumber:String(row.no||""),event:row.event||"",section:row.section||"",style:row.style||"",round:roundValue,updatedAt:Date.now()});
  timetableRows[editingTimetableIndex]={...row,round:roundLabel};
  await saveTimetableRows(); renderTimetableBuilder();
  ttJudgeMessage.textContent=`라운드 저장 완료 · ${roundLabel}`;
});

function selectedTimetableIndexes(){return [...ttBuilderList.querySelectorAll('[data-tt-select]:checked')].map(x=>Number(x.dataset.ttSelect)).filter(Number.isInteger).sort((a,b)=>a-b);}
combineTimetableBtn?.addEventListener("click",async()=>{
  const idx=selectedTimetableIndexes(); if(idx.length<2){ttBuilderMessage.textContent="합동할 경기를 2개 이상 선택하세요.";return;}
  const rows=idx.map(i=>timetableRows[i]); const rounds=[...new Set(rows.map(r=>r.round))];
  if(rounds.length>1&&!confirm("서로 다른 라운드가 선택되었습니다. 그래도 합동할까요?"))return;

  // A competitor cannot dance two source events at the same time.
  // Block the combine before anything is written when a BACK NO. appears in 2+ selected events.
  const backOwners=new Map();
  rows.forEach((r,rowIndex)=>{
    const rowBacks=[...new Set((r.backNumbers||[]).map(x=>String(x).trim()).filter(Boolean))];
    rowBacks.forEach(back=>{
      if(!backOwners.has(back))backOwners.set(back,new Set());
      backOwners.get(back).add(rowIndex);
    });
  });
  const duplicateBacks=[...backOwners.entries()]
    .filter(([,owners])=>owners.size>1)
    .map(([back])=>back)
    .sort((a,b)=>Number(a)-Number(b)||String(a).localeCompare(String(b)));
  if(duplicateBacks.length){
    const msg=`합동할 수 없습니다.\n선택한 이벤트에 같은 백넘버가 있습니다.\n\n중복 BACK NO.: ${duplicateBacks.join(' · ')}\n\n해당 선수가 동시에 두 경기에 포함되므로 다른 이벤트를 선택해 주세요.`;
    alert(msg);
    if(ttBuilderMessage)ttBuilderMessage.textContent=`합동 불가 · 중복 BACK NO. ${duplicateBacks.join(' · ')}`;
    return;
  }

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
 document.getElementById("judgeStatus").innerHTML=judges.map(j=>`<div class="status-row"><strong>${j.code}</strong><span>${currentData[j.code]?"SUBMITTED ✓":"WAITING"}</span></div>`).join("");
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
autoAdvanceToggle.checked=false; autoAdvanceToggle.disabled=true; autoAdvanceStatus.textContent="AUTO FLOW IS CONTROLLED BY DASHBOARD";

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



// ===== V16 JUDGE CODE MANAGEMENT =====
const judgeCodeInput=document.getElementById('judgeCodeInput');
const judgeCodeSaveBtn=document.getElementById('judgeCodeSaveBtn');
const judgeCodeCancelBtn=document.getElementById('judgeCodeCancelBtn');
const judgeCodeMessage=document.getElementById('judgeCodeMessage');
const judgeCodeList=document.getElementById('judgeCodeList');
let editingJudgeCode='';
const judgeSort=(a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true,sensitivity:'base'});
function normalizeJudgeCode(v){return String(v||'').trim().toUpperCase().replace(/\s+/g,'');}
function validJudgeCode(v){return /^[TW][A-Z0-9_-]{0,10}$/.test(v);}
function renderJudgeCodeList(){
  if(!judgeCodeList)return;
  const codes=JUDGES.map(j=>j.code).sort(judgeSort);
  judgeCodeList.innerHTML=codes.length?codes.map(code=>`<div class="custom-event-row"><div><strong>${code}</strong><div class="muted">JUDGE CODE</div></div><div class="tt-row-actions"><button type="button" class="light" data-judge-edit="${code}">EDIT</button><button type="button" class="danger" data-judge-delete="${code}">DELETE</button></div></div>`).join(''):'<div class="entry-empty">NO JUDGES</div>';
  judgeCodeList.querySelectorAll('[data-judge-edit]').forEach(b=>b.onclick=()=>{editingJudgeCode=b.dataset.judgeEdit;judgeCodeInput.value=editingJudgeCode;judgeCodeSaveBtn.textContent='SAVE CHANGE';judgeCodeCancelBtn.classList.remove('hidden');judgeCodeInput.focus();});
  judgeCodeList.querySelectorAll('[data-judge-delete]').forEach(b=>b.onclick=()=>deleteJudgeCode(b.dataset.judgeDelete));
}
function refreshJudgeDependentUI(){
  if(judgeChecks) judgeChecks.innerHTML=JUDGES.map(j=>`<label class="judge-check"><input type="checkbox" value="${j.code}"><span>${j.code}</span></label>`).join('');
  if(judgeAllocationChecks) judgeAllocationChecks.innerHTML=JUDGES.map(j=>`<label class="judge-check"><input type="checkbox" value="${j.code}"><span><b>${j.code}</b></span></label>`).join('');
  if(typeof renderJudgeAllocation==='function') renderJudgeAllocation().catch(console.error);
  renderJudgeCodeList();
}
async function saveJudgeCodes(codes){
  const clean=[...new Set(codes.map(normalizeJudgeCode).filter(validJudgeCode))].sort(judgeSort);
  await set(ref(db,'judgeCodes'),Object.fromEntries(clean.map(c=>[c,true])));
}
async function replaceJudgeInAssignments(oldCode,newCode){
  const snap=await get(ref(db,'eventSettings')); const all=snap.val()||{};
  await Promise.all(Object.entries(all).map(async([k,st])=>{
    const assigned=Array.isArray(st?.assignedJudges)?st.assignedJudges:[];
    if(!assigned.includes(oldCode))return;
    const next=[...new Set(assigned.map(c=>c===oldCode?newCode:c).filter(Boolean))];
    await set(ref(db,`eventSettings/${k}`),{...st,assignedJudges:next,updatedAt:Date.now()});
  }));
}
async function removeJudgeFromAssignments(code){
  const snap=await get(ref(db,'eventSettings')); const all=snap.val()||{};
  await Promise.all(Object.entries(all).map(async([k,st])=>{
    const assigned=Array.isArray(st?.assignedJudges)?st.assignedJudges:[];
    if(!assigned.includes(code))return;
    await set(ref(db,`eventSettings/${k}`),{...st,assignedJudges:assigned.filter(c=>c!==code),updatedAt:Date.now()});
  }));
}
async function deleteJudgeCode(code){
  if(!confirm(`${code} 심사위원 코드를 삭제할까요?\n배정된 이벤트에서도 자동으로 제거됩니다.`))return;
  await removeJudgeFromAssignments(code);
  await saveJudgeCodes(JUDGES.map(j=>j.code).filter(c=>c!==code));
  judgeCodeMessage.textContent=`${code} 삭제 완료`;
  if(editingJudgeCode===code){editingJudgeCode='';judgeCodeInput.value='';judgeCodeSaveBtn.textContent='+ ADD JUDGE';judgeCodeCancelBtn.classList.add('hidden');}
}
judgeCodeSaveBtn?.addEventListener('click',async()=>{
  const code=normalizeJudgeCode(judgeCodeInput.value);
  if(!validJudgeCode(code)){judgeCodeMessage.textContent='T 또는 W로 시작하는 코드만 입력하세요. 예: T1, W3';return;}
  const current=JUDGES.map(j=>j.code);
  if(editingJudgeCode){
    if(code!==editingJudgeCode && current.includes(code)){judgeCodeMessage.textContent='이미 사용 중인 코드입니다.';return;}
    if(code!==editingJudgeCode) await replaceJudgeInAssignments(editingJudgeCode,code);
    await saveJudgeCodes(current.map(c=>c===editingJudgeCode?code:c));
    judgeCodeMessage.textContent=`${editingJudgeCode} → ${code} 수정 완료`;
  }else{
    if(current.includes(code)){judgeCodeMessage.textContent='이미 사용 중인 코드입니다.';return;}
    await saveJudgeCodes([...current,code]);
    judgeCodeMessage.textContent=`${code} 추가 완료`;
  }
  editingJudgeCode='';judgeCodeInput.value='';judgeCodeSaveBtn.textContent='+ ADD JUDGE';judgeCodeCancelBtn.classList.add('hidden');
});
judgeCodeCancelBtn?.addEventListener('click',()=>{editingJudgeCode='';judgeCodeInput.value='';judgeCodeSaveBtn.textContent='+ ADD JUDGE';judgeCodeCancelBtn.classList.add('hidden');judgeCodeMessage.textContent='';});
onValue(ref(db,'judgeCodes'),snap=>{
  const value=snap.val();
  let codes=value&&typeof value==='object'?Object.entries(value).filter(([,v])=>v!==false&&v!=null).map(([k])=>normalizeJudgeCode(k)).filter(validJudgeCode):[];
  if(!codes.length) codes=DEFAULT_JUDGE_CODES.slice();
  JUDGES=[...new Set(codes)].sort(judgeSort).map(code=>({code}));
  refreshJudgeDependentUI();
});

// ===== V11 SIMPLE JUDGING -> RESULTS -> CERTIFICATES =====
import { aggregateRecall, aggregateFinalSkating } from './results-engine.js';

function actualEventKeyByName(name){
  const row=Object.values(competitionEntries||{}).find(x=>x&&x.event===name);
  if(row) return [row.event,row.section||'',row.style||''].join('||');
  const e=EVENTS.find(x=>x.event===name); return e?.eventKey || `${name}||||`;
}
function judgableEventsFromTimetable(){
  const out=[];
  timetableRows.forEach(row=>{
    const names=row.combined&&Array.isArray(row.sourceEvents)&&row.sourceEvents.length?row.sourceEvents:[row.event];
    names.forEach(name=>{
      const key=actualEventKeyByName(name); if(out.some(x=>x.eventKey===key))return;
      const entry=Object.values(competitionEntries||{}).find(x=>x&&x.event===name)||{};
      out.push({eventKey:key,event:name,section:entry.section||row.section||'',style:entry.style||row.style||'',eventNumber:String(row.no||''),combined:!!row.combined});
    });
  });
  return out;
}
function eventCompetitors(key){
  const [event,section,style]=String(key).split('||'); const m=new Map();
  Object.values(competitionEntries||{}).filter(x=>x&&x.event===event&&(!section||x.section===section)&&(!style||x.style===style)).forEach(x=>m.set(String(x.backNo),{backNo:String(x.backNo),name:x.competitor||''}));
  return [...m.values()].sort((a,b)=>String(a.backNo).localeCompare(String(b.backNo),undefined,{numeric:true}));
}
async function getEventSetting(key){const s=await get(ref(db,`eventSettings/${encodeKey(key)}`));return s.val()||{};}

const judgeAllocationList=document.getElementById('judgeAllocationList');
const judgeAllocationEditor=document.getElementById('judgeAllocationEditor');
const judgeAllocationTitle=document.getElementById('judgeAllocationTitle');
const judgeAllocationChecks=document.getElementById('judgeAllocationChecks');
const judgeAllocationMessage=document.getElementById('judgeAllocationMessage');
let allocationKey='';
if(judgeAllocationChecks) judgeAllocationChecks.innerHTML=JUDGES.map(j=>`<label class="judge-check"><input type="checkbox" value="${j.code}"><span><b>${j.code}</b></span></label>`).join('');
async function renderJudgeAllocation(){
  if(!judgeAllocationList)return; const list=judgableEventsFromTimetable();
  if(!list.length){judgeAllocationList.innerHTML='<div class="entry-empty">먼저 타임테이블을 만들어 주세요.</div>';return;}
  const rows=[]; for(const e of list){const st=await getEventSetting(e.eventKey);const assigned=st.assignedJudges||[];const count=eventCompetitors(e.eventKey).length;const plan=roundPlan(count).map(x=>x==='Quarter Final'?'QF':x==='Semi Final'?'SF':'F').join(' → ');const rule=count>=15?'QF PICK 12 · SF PICK 6 · FINAL 6':count>=7?'SF PICK 6 · FINAL 6':'FINAL ONLY';rows.push(`<div class="tt-builder-row"><div class="tt-builder-no">EVENT ${e.eventNumber||'—'}</div><div class="tt-builder-main"><strong>${e.event}</strong><div class="judge-allocation-summary">${assigned.length?assigned.join(' · '):'NO JUDGES ASSIGNED'}${e.combined?' · COMBINED FLOOR':''}</div><div class="round-rule-mini">${count} ENTRIES · ${plan} · ${rule}</div></div><div class="tt-row-actions"><button type="button" class="light" data-alloc="${encodeURIComponent(e.eventKey)}">SET JUDGES</button></div></div>`)}
  judgeAllocationList.innerHTML=rows.join('');
  judgeAllocationList.querySelectorAll('[data-alloc]').forEach(b=>b.onclick=async()=>{allocationKey=decodeURIComponent(b.dataset.alloc);const e=list.find(x=>x.eventKey===allocationKey);const st=await getEventSetting(allocationKey);judgeAllocationTitle.textContent=`EVENT ${e?.eventNumber||'—'} · ${e?.event||''}`;judgeAllocationChecks.querySelectorAll('input').forEach(c=>c.checked=(st.assignedJudges||[]).includes(c.value));judgeAllocationEditor.classList.remove('hidden');judgeAllocationMessage.textContent='';judgeAllocationEditor.scrollIntoView({behavior:'smooth',block:'nearest'});});
}
document.getElementById('judgeAllocationClear')?.addEventListener('click',()=>judgeAllocationChecks.querySelectorAll('input').forEach(c=>c.checked=false));
document.getElementById('judgeAllocationSave')?.addEventListener('click',async()=>{if(!allocationKey)return;const assigned=[...judgeAllocationChecks.querySelectorAll('input:checked')].map(x=>x.value);const e=judgableEventsFromTimetable().find(x=>x.eventKey===allocationKey)||{};const old=await getEventSetting(allocationKey);await set(ref(db,`eventSettings/${encodeKey(allocationKey)}`),{...old,eventKey:allocationKey,event:e.event||'',section:e.section||'',style:e.style||'',eventNumber:e.eventNumber||'',assignedJudges:assigned,updatedAt:Date.now()});judgeAllocationMessage.textContent=`자동저장 완료 · ${assigned.length} JUDGES`;await renderJudgeAllocation();});

const resultEvent=document.getElementById('resultEvent'),resultRound=document.getElementById('resultRound'),resultSubmissionStatus=document.getElementById('resultSubmissionStatus'),resultOutput=document.getElementById('resultOutput');
function refreshResultEvents(){if(!resultEvent)return;const current=resultEvent.value;const list=judgableEventsFromTimetable();resultEvent.innerHTML=list.map(e=>`<option value="${e.eventKey.replaceAll('"','&quot;')}">EVENT ${e.eventNumber||'—'} · ${e.event}</option>`).join('');if([...resultEvent.options].some(o=>o.value===current))resultEvent.value=current;refreshResultPanel();}
async function roundCompetitors(key,round){
  const all=eventCompetitors(key);const encoded=encodeKey(key),count=all.length;
  if(round==='semi'){
    const s=await get(ref(db,`results/${encoded}/quarter`));const q=s.val()?.qualifiedBackNos;
    if(count>=15 && !(Array.isArray(q)&&q.length))return [];
    if(Array.isArray(q)&&q.length)return all.filter(x=>q.map(String).includes(x.backNo));
  }
  if(round==='final'){
    const s=await get(ref(db,`results/${encoded}/semi`));const q=s.val()?.qualifiedBackNos;
    if(count>=7 && !(Array.isArray(q)&&q.length))return [];
    if(Array.isArray(q)&&q.length)return all.filter(x=>q.map(String).includes(x.backNo));
  }
  return all;
}
async function priorRoundReady(key,round){
  const count=eventCompetitors(key).length,encoded=encodeKey(key);
  if(round==='semi'&&count>=15){const s=await get(ref(db,`results/${encoded}/quarter`));const q=s.val()?.qualifiedBackNos;return Array.isArray(q)&&q.length>0;}
  if(round==='final'&&count>=7){const s=await get(ref(db,`results/${encoded}/semi`));const q=s.val()?.qualifiedBackNos;return Array.isArray(q)&&q.length>0;}
  return true;
}
async function refreshResultPanel(){
  if(!resultEvent?.value)return;const key=resultEvent.value,round=resultRound.value,encoded=encodeKey(key),setting=await getEventSetting(key),assigned=setting.assignedJudges||[];
  if(!(await priorRoundReady(key,round))){
    const wait=round==='semi'?'QUARTER FINAL':'SEMI FINAL';
    resultSubmissionStatus.textContent=`WAITING FOR ${wait} RESULT`;
    resultOutput.innerHTML=`<div style="padding:18px">${wait} 결과 완료 후 진행할 수 있습니다.</div>`;
    return;
  }
  const s=await get(ref(db,`submissions/${encoded}_${round}`)),subs=s.val()||{};const done=assigned.filter(x=>subs[x]).length;resultSubmissionStatus.textContent=`${done} / ${assigned.length} ASSIGNED JUDGES SUBMITTED${assigned.length&&done===assigned.length?' · COMPLETE':' · WAITING'}`;
  const saved=await get(ref(db,`results/${encoded}/${round}`));let data=saved.val();
  // When every assigned judge has submitted, finalize automatically. This makes the event immediately available to Certificate Print.
  if(!data && assigned.length && done===assigned.length){
    const filtered=Object.fromEntries(assigned.filter(j=>subs[j]).map(j=>[j,subs[j]]));
    const comps=await roundCompetitors(key,round);
    const calc=round==='final'?aggregateFinalSkating(filtered,comps.map(x=>x.backNo)):aggregateRecall(filtered,comps.map(x=>x.backNo),round==='quarter'?12:6);
    const label=judgableEventsFromTimetable().find(x=>x.eventKey===key)?.event||key;
    data={...calc,eventKey:key,eventLabel:label,round,assignedJudges:assigned,submittedJudges:Object.keys(filtered),calculatedAt:Date.now(),autoFinalized:true};
    await set(ref(db,`results/${encoded}/${round}`),data);
  }
  if(!data){resultOutput.innerHTML='<div style="padding:18px">아직 저장된 결과가 없습니다.</div>';return;}renderStoredResult(data);
}
function renderStoredResult(data){const rows=data.ranking||[];if(data.round==='final'){resultOutput.innerHTML=`<div class="res-row res-head"><span>PLACE</span><span>BACK</span><span>NAME</span><span>JUDGE MARKS</span></div>`+rows.map(r=>{const c=eventCompetitors(data.eventKey).find(x=>x.backNo===String(r.backNo))||{};return `<div class="res-row"><b>${r.place}</b><b>${r.backNo}</b><span>${c.name||''}</span><span>${(r.marks||[]).join(' · ')}</span></div>`}).join('');}else{resultOutput.innerHTML=`<div class="res-row res-head"><span>ORDER</span><span>BACK</span><span>NAME</span><span>RECALLS</span></div>`+rows.map((r,i)=>{const c=eventCompetitors(data.eventKey).find(x=>x.backNo===String(r.backNo))||{};const q=(data.qualifiedBackNos||[]).map(String).includes(String(r.backNo));return `<div class="res-row"><b>${i+1}${q?' ✓':''}</b><b>${r.backNo}</b><span>${c.name||''}</span><span>${r.recalls} RECALLS</span></div>`}).join('')+(data.tieAtCutoff?'<div class="message">동점 커트라인은 같은 recall 수의 선수까지 모두 다음 라운드로 올렸습니다.</div>':'');}}

document.getElementById('calculateResultBtn')?.addEventListener('click',async()=>{if(!resultEvent.value)return;const key=resultEvent.value,round=resultRound.value,encoded=encodeKey(key),setting=await getEventSetting(key),assigned=setting.assignedJudges||[];if(!(await priorRoundReady(key,round)))return alert(round==='semi'?'Quarter Final 결과를 먼저 완료하세요.':'Semi Final 결과를 먼저 완료하세요.');if(!assigned.length)return alert('먼저 JUDGING에서 심사위원을 배정하세요.');const snap=await get(ref(db,`submissions/${encoded}_${round}`)),allSubs=snap.val()||{},subs=Object.fromEntries(assigned.filter(j=>allSubs[j]).map(j=>[j,allSubs[j]]));if(Object.keys(subs).length!==assigned.length){if(!confirm(`${Object.keys(subs).length}/${assigned.length}명만 제출했습니다. 그래도 현재 제출분으로 계산할까요?`))return;}const comps=await roundCompetitors(key,round);let calc;if(round==='final')calc=aggregateFinalSkating(subs,comps.map(x=>x.backNo));else calc=aggregateRecall(subs,comps.map(x=>x.backNo),round==='quarter'?12:6);const label=judgableEventsFromTimetable().find(x=>x.eventKey===key)?.event||key;const payload={...calc,eventKey:key,eventLabel:label,round,assignedJudges:assigned,submittedJudges:Object.keys(subs),calculatedAt:Date.now()};await set(ref(db,`results/${encoded}/${round}`),payload);resultSubmissionStatus.textContent='RESULT SAVED ✓';renderStoredResult(payload);});
resultEvent?.addEventListener('change',refreshResultPanel);resultRound?.addEventListener('change',refreshResultPanel);

// Refresh workflow views when timetable/entries change.
const originalRenderTimetableBuilderV11=renderTimetableBuilder;
renderTimetableBuilder=function(){originalRenderTimetableBuilderV11();setTimeout(()=>{renderJudgeAllocation().catch(console.error);refreshResultEvents();},0)};
setTimeout(()=>{renderJudgeAllocation().catch(console.error);refreshResultEvents();const a=document.getElementById('certificateLiveLink');if(a)a.href=`certificate-live.html?competition=${encodeURIComponent(competitionId)}`;document.querySelectorAll('a[href="certificate-live.html"]').forEach(x=>x.href=`certificate-live.html?competition=${encodeURIComponent(competitionId)}`);},500);

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";
apdcBuildLanguageUI();
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig),db=getDatabase(app),PASSWORD="0808";
const gate=document.getElementById("mcPasswordGate"),box=document.getElementById("mcProtected"),pass=document.getElementById("mcPasswordInput"),btn=document.getElementById("mcPasswordBtn"),msg=document.getElementById("mcPasswordMessage");
function unlock(){sessionStorage.setItem("apdcMcUnlocked","yes");gate.classList.add("hidden");box.classList.remove("hidden")}
btn.onclick=()=>pass.value===PASSWORD?unlock():msg.textContent="WRONG PASSWORD";pass.onkeydown=e=>{if(e.key==="Enter")btn.click()};if(sessionStorage.getItem("apdcMcUnlocked")==="yes")unlock();
const enc=k=>btoa(unescape(encodeURIComponent(k))).replaceAll("=","");
let active=null,order=[],TT=[],ttIndex=Number(localStorage.getItem("apdcMcTimetableIndex")||0);
const nowEl=document.getElementById("mcNow"),roundEl=document.getElementById("mcRound"),koEl=document.getElementById("mcKorean"),enEl=document.getElementById("mcEnglish");
const ttPos=document.getElementById("mcTtPosition"),ttMeta=document.getElementById("mcTtMeta"),ttComment=document.getElementById("mcTimetableComment"),ttNote=document.getElementById("mcTimetableNote"),prevBtn=document.getElementById("mcPrevBtn"),nextBtn=document.getElementById("mcNextBtn");
function rtext(r){return r==="quarter"?"Quarter Final":r==="semi"?"Semi Final":r==="final"?"Final":r||""}
function roundKo(r){const x=String(r||"").toLowerCase();if(x.includes("quarter"))return"쿼터 파이널";if(x.includes("semi"))return"세미 파이널";if(x.includes("final"))return"파이널";if(x.includes("formation"))return"포메이션";if(x.includes("special"))return"특별 프로그램";return r||""}
function ttRow(){return TT[ttIndex]||null}
function buildComment(row){
  if(!row)return"다음 경기를 준비하겠습니다.";
  const ev=String(row.event||"").trim();
  const upper=ev.toUpperCase();
  if(upper.includes("OPENING"))return"지금부터 2026 아시아 퍼시픽 댄스스포츠 챔피언십을 시작하겠습니다. 이어서 심사위원 여러분을 소개하겠습니다.";
  if(upper.includes("COUNTRY TEAM MATCH"))return"다음은 Country Team Match입니다. 참가 선수 여러분은 플로어로 입장해 주세요.";
  if(upper.includes("BREAK"))return"잠시 휴식 시간을 갖겠습니다. 다음 경기 시간에 맞춰 준비해 주세요.";
  if(String(row.round||"").toLowerCase().includes("formation"))return"다음은 포메이션 경기입니다. 참가 팀은 플로어로 입장해 주세요. 심사위원 여러분, 준비 부탁드립니다.";
  const rk=roundKo(row.round);
  const dance=row.danceOrder?` 댄스 순서는 ${row.danceOrder}입니다.`:"";
  return `다음 경기는 ${ev}${rk?` ${rk}`:""}입니다.${dance} 선수 여러분, 플로어로 입장해 주세요. 심사위원 여러분, 준비 부탁드립니다.`;
}
function buildEnglish(row){
  if(!row)return"Please get ready for the next event.";
  const ev=String(row.event||"").trim();
  const upper=ev.toUpperCase();
  if(upper.includes("OPENING"))return"Welcome to the 2026 Asia Pacific Dancesport Championship. We will now introduce our judges.";
  if(upper.includes("COUNTRY TEAM MATCH"))return"Next is the Country Team Match. Players, please come to the floor.";
  if(upper.includes("BREAK"))return"We will now take a short break. Please be ready for the next event.";
  const dance=row.danceOrder?` Dance order: ${row.danceOrder}.`:"";
  return `Next event: ${ev}. ${row.round||""}.${dance} Players, please come to the floor. Judges, please get ready.`.replace(/\s+/g," ").trim();
}
function buildNote(row){
  if(!row)return"—";
  const parts=[];
  if(row.entries)parts.push(`엔트리 ${row.entries}`);
  if(row.danceOrder)parts.push(`댄스 ${row.danceOrder}`);
  if(row.note)parts.push(row.note);
  if(String(row.note||"").toLowerCase().includes("together")||String(row.note||"").toLowerCase().includes("multiple"))parts.push("여러 EVENT 동시 진행 · 각 EVENT 개별 심사");
  return parts.length?parts.join("\n"):"별도 참고사항 없음";
}
function renderTimetableRow(){
  if(!TT.length){ttPos.textContent="0 / 0";return}
  ttIndex=Math.max(0,Math.min(ttIndex,TT.length-1));localStorage.setItem("apdcMcTimetableIndex",String(ttIndex));
  const row=ttRow();
  ttPos.textContent=`${ttIndex+1} / ${TT.length}`;
  ttMeta.textContent=[row.start?`START ${row.start}`:"",row.no?`RUN ${row.no}`:"",row.section,row.division].filter(Boolean).join(" · ");
  nowEl.textContent=row.event||"WAITING";roundEl.textContent=[row.round,row.danceOrder].filter(Boolean).join(" · ");
  ttComment.textContent=buildComment(row);ttNote.textContent=buildNote(row);
  koEl.textContent=buildComment(row);enEl.textContent=buildEnglish(row);
  prevBtn.disabled=ttIndex===0;nextBtn.disabled=ttIndex===TT.length-1;
  progress();
}
async function loadTimetable(){try{const r=await fetch("timetable-data.json?v=20260719-mc-next",{cache:"no-store"});const d=await r.json();TT=d.rows||[];renderTimetableRow()}catch(e){console.error(e);ttMeta.textContent="Timetable could not be loaded."}}
prevBtn.onclick=()=>{if(ttIndex>0){ttIndex--;renderTimetableRow()}};
nextBtn.onclick=()=>{if(ttIndex<TT.length-1){ttIndex++;renderTimetableRow()}};
function setScripts(){if(TT.length){renderTimetableRow();return}if(!active){koEl.textContent="다음 경기 준비.";enEl.textContent="Please get ready for the next event.";return}const kr=active.round==="quarter"?"쿼터 파이널":active.round==="semi"?"세미 파이널":"파이널";koEl.textContent=`다음 경기는 ${active.label} ${kr}입니다. 선수 입장. 심사위원 여러분, 준비 부탁드립니다.`;enEl.textContent=`Next event: ${active.label}. ${rtext(active.round)}. Players, please come to the floor. Judges, please get ready.`}
function progress(){const t=TT.length||order.length;const d=TT.length?ttIndex:(active?Math.max(0,order.findIndex(x=>x.eventKey===active.eventKey)):0);document.getElementById("mcProgressText").textContent=`${t?d+1:0} / ${t} EVENTS`;document.getElementById("mcProgressBar").style.width=t?`${(d+1)/t*100}%`:"0%"}
let submissionUnsub=null;
async function watch(active){if(submissionUnsub){submissionUnsub();submissionUnsub=null}if(!active||!active.eventKey)return;const e=enc(active.eventKey),s=await get(ref(db,`eventSettings/${e}`)),assigned=s.val()?.assignedJudges||[];submissionUnsub=onValue(ref(db,`submissions/${e}_${active.round||"final"}`),snap=>{const v=snap.val()||{},done=assigned.filter(c=>v[c]),wait=assigned.filter(c=>!v[c]);document.getElementById("mcJudgeCount").textContent=`${done.length} / ${assigned.length} DONE`;document.getElementById("mcWaitingJudges").textContent=wait.length?`Waiting for Judges: ${wait.join(", ")}`:"JUDGES ARE DONE."})}
onValue(ref(db,"activeEvent"),snap=>{active=snap.val();if(!active){if(!TT.length){nowEl.textContent="WAITING";roundEl.textContent="";setScripts()}return}if(!TT.length){nowEl.textContent=active.label||"";roundEl.textContent=rtext(active.round);setScripts();progress()}watch(active)});
onValue(ref(db,"floorStatus"),snap=>{const v=snap.val()||{};document.getElementById("mcOnDeck").textContent=v.onDeck||"—";document.getElementById("mcNext").textContent=v.next||"—"});
document.querySelectorAll("[data-copy]").forEach(b=>b.onclick=async()=>{await navigator.clipboard.writeText(document.getElementById(b.dataset.copy).textContent);b.textContent="COPIED";setTimeout(()=>b.textContent="COPY",800)});
document.querySelectorAll(".quick-line-grid button").forEach(b=>b.onclick=()=>{koEl.textContent=b.dataset.ko;enEl.textContent=b.dataset.en});
get(ref(db,"eventSettings")).then(s=>{order=Object.values(s.val()||{}).filter(x=>String(x.eventNumber||"").trim()!=="").sort((a,b)=>Number(a.eventNumber)-Number(b.eventNumber));progress()});
loadTimetable();

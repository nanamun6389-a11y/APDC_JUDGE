import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, get, onValue, set } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";
apdcBuildLanguageUI();
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig),db=getDatabase(app),PASSWORD="0808";
const gate=document.getElementById("mcPasswordGate"),box=document.getElementById("mcProtected"),pass=document.getElementById("mcPasswordInput"),btn=document.getElementById("mcPasswordBtn"),msg=document.getElementById("mcPasswordMessage");
function unlock(){sessionStorage.setItem("apdcMcUnlocked","yes");gate.classList.add("hidden");box.classList.remove("hidden")}
btn.onclick=()=>pass.value===PASSWORD?unlock():msg.textContent="WRONG PASSWORD";pass.onkeydown=e=>{if(e.key==="Enter")btn.click()};if(sessionStorage.getItem("apdcMcUnlocked")==="yes")unlock();
const enc=k=>btoa(unescape(encodeURIComponent(k))).replaceAll("=","");
let active=null,order=[],TT=[],ttIndex=Number(localStorage.getItem("apdcMcTimetableIndex")||0);
const nowEl=document.getElementById("mcNow"),roundEl=document.getElementById("mcRound"),koEl=document.getElementById("mcKorean"),enEl=document.getElementById("mcEnglish"),eventNameEl=document.getElementById("mcEventName");
const ttPos=document.getElementById("mcTtPosition"),ttMeta=document.getElementById("mcTtMeta"),ttComment=document.getElementById("mcTimetableComment"),ttNote=document.getElementById("mcTimetableNote"),prevBtn=document.getElementById("mcPrevBtn"),nextBtn=document.getElementById("mcNextBtn"),firstBtn=document.getElementById("mcFirstBtn"),lastBtn=document.getElementById("mcLastBtn"),rangeButtons=document.getElementById("mcRangeButtons");
function rtext(r){return r==="quarter"?"Quarter Final":r==="semi"?"Semi Final":r==="final"?"Final":r||""}
function roundKo(r){const x=String(r||"").toLowerCase();if(x.includes("quarter"))return"쿼터 파이널";if(x.includes("semi"))return"세미 파이널";if(x.includes("final"))return"파이널";if(x.includes("formation"))return"포메이션";if(x.includes("special"))return"특별 프로그램";return r||""}
function ttRow(){return TT[ttIndex]||null}
function eventRoundLabel(row){
  const no=String(row?.no||"").trim();
  const round=rtext(String(row?.round||"").toLowerCase());
  return [no?`EVENT ${no}`:"EVENT —",round].filter(Boolean).join(" · ");
}
function eventCue(row){
  const no=String(row?.no||"").trim();
  if(!no)return"";
  const round=rtext(String(row?.round||"").toLowerCase());
  return [`EVENT ${no}`,round].filter(Boolean).join(" ");
}
function buildComment(row){
  if(!row)return "—";
  return String(row.event||"—").trim()||"—";
}
const DANCE_NAMES={C:"Cha Cha",S:"Samba",R:"Rumba",J:"Jive",W:"Waltz",T:"Tango",F:"Foxtrot",Q:"Quickstep",V:"Viennese Waltz"};
const ORDINAL_EN=["First","Second","Third","Fourth","Fifth"];
const ORDINAL_KO=["첫 번째","두 번째","세 번째","네 번째","다섯 번째"];
function danceList(row){
  const raw=String(row?.danceOrder||"").trim();
  if(!raw||raw.toLowerCase()==="formation")return[];
  return raw.split(/\s*(?:→|>|,|\/)\s*/).map(x=>x.trim()).filter(Boolean).map(x=>DANCE_NAMES[x.toUpperCase()]||x);
}
function danceSequenceEnglish(row){
  const dances=danceList(row);
  if(dances.length<=1)return"";
  return dances.map((d,i)=>`${ORDINAL_EN[i]||`${i+1}th`} dance, ${d}.`).join("\n");
}
function danceSequenceKorean(row){
  const dances=danceList(row);
  if(dances.length<=1)return"";
  return dances.map((d,i)=>`${ORDINAL_KO[i]||`${i+1}번째`} 댄스, ${d}.`).join("\n");
}
function buildEnglish(row){
  if(!row)return "Please get ready for the next EVENT.";
  const ev=String(row.event||"").trim().toUpperCase();
  const no=String(row.no||"").trim();
  if(ev.includes("OPENING"))return "Welcome to the 2026 Asia Pacific Dancesport Championship.";
  if(ev.includes("COUNTRY TEAM MATCH"))return "Next is the Country Team Match. Players, please come to the floor. Judges, please get ready.";
  if(ev.includes("BREAK"))return "We will now take a short break.";
  if(no){
    const dances=danceList(row);
    const lines=[`Players for EVENT ${no}, please come to the floor.`,`Judges, please check EVENT ${no}.`];
    const seq=danceSequenceEnglish(row);
    if(seq)lines.push(seq);
    if(dances.length===1)lines.push(`The dance is ${dances[0]}.`);
    lines.push("Judges, are you ready? Players, are you ready? Music, please.");
    return lines.join("\n");
  }
  return "Please get ready for the next EVENT.";
}
function buildKorean(row){
  if(!row)return "다음 EVENT를 준비하겠습니다.";
  const ev=String(row.event||"").trim().toUpperCase();
  const no=String(row.no||"").trim();
  if(ev.includes("OPENING"))return "지금부터 2026 아시아 퍼시픽 댄스스포츠 챔피언십을 시작하겠습니다.";
  if(ev.includes("COUNTRY TEAM MATCH"))return "다음은 Country Team Match입니다. 선수 여러분, 플로어로 입장해 주세요. 심사위원 여러분, 준비해 주세요.";
  if(ev.includes("BREAK"))return "잠시 휴식 시간을 갖겠습니다.";
  if(no){
    const dances=danceList(row);
    const lines=[`EVENT ${no} 선수 여러분, 플로어로 입장해 주세요.`,`심사위원 여러분, EVENT ${no}를 확인해 주세요.`];
    const seq=danceSequenceKorean(row);
    if(seq)lines.push(seq);
    if(dances.length===1)lines.push(`댄스는 ${dances[0]}입니다.`);
    lines.push("심사위원 여러분, 준비되셨습니까? 선수 여러분, 준비되셨습니까? 음악 주세요.");
    return lines.join("\n");
  }
  return "다음 EVENT를 준비하겠습니다.";
}
function buildNote(row){
  if(!row)return"—";
  const parts=[];
  if(row.entries)parts.push(`엔트리 ${row.entries}`);
  if(row.danceOrder)parts.push(`댄스 ${row.danceOrder}`);
  if(row.note)parts.push(row.note);
  if(String(row.section||"").toLowerCase()==="mania")parts.push("MANIA 진행: R 후 R-only 퇴장 → C 후 CR 퇴장 → S까지 CRS 잔류 · 각 원래 섹션 결과는 별도 유지");
  return parts.length?parts.join("\n"):"별도 참고사항 없음";
}
function renderRangeButtons(){
  if(!rangeButtons)return;
  rangeButtons.innerHTML="";
  for(let start=0;start<TT.length;start+=10){
    const end=Math.min(start+10,TT.length);
    const b=document.createElement("button");
    b.type="button";
    b.textContent=`${start+1}–${end}`;
    b.classList.toggle("active",ttIndex>=start&&ttIndex<end);
    b.onclick=async()=>{ttIndex=start;renderTimetableRow();await publishLiveStatus()};
    rangeButtons.appendChild(b);
  }
}
function renderTimetableRow(){
  if(!TT.length){ttPos.textContent="0 / 0";return}
  ttIndex=Math.max(0,Math.min(ttIndex,TT.length-1));localStorage.setItem("apdcMcTimetableIndex",String(ttIndex));
  const row=ttRow();
  ttPos.textContent=`${ttIndex+1} / ${TT.length}`;
  ttMeta.textContent=[row.start?`START ${row.start}`:"",eventRoundLabel(row)].filter(Boolean).join(" · ");
  nowEl.textContent=row.no?`EVENT ${row.no}`:"WAITING";roundEl.textContent=rtext(String(row.round||"").toLowerCase());
  ttComment.textContent=buildComment(row);ttNote.textContent=buildNote(row);
  if(eventNameEl)eventNameEl.textContent=String(row.event||"—").trim()||"—";
  koEl.textContent=buildKorean(row);enEl.textContent=buildEnglish(row);
  prevBtn.disabled=ttIndex===0;nextBtn.disabled=ttIndex===TT.length-1;firstBtn.disabled=ttIndex===0;lastBtn.disabled=ttIndex===TT.length-1;
  renderRangeButtons();
  progress();
}
async function loadTimetable(){try{const r=await fetch("timetable-data.json?v=20260720-realistic-times",{cache:"no-store"});const d=await r.json();TT=d.rows||[];renderTimetableRow()}catch(e){console.error(e);ttMeta.textContent="Timetable could not be loaded."}}
async function publishLiveStatus(){
  if(!TT.length)return;
  const current=TT[ttIndex]||{};
  const onDeck=TT[ttIndex+1]||{};
  const next=TT[ttIndex+2]||{};
  await set(ref(db,"floorStatus"),{
    now:current.event|| (current.no?`EVENT ${current.no}`:"WAITING"),
    eventNo:current.no||"",
    onDeck:onDeck.event|| (onDeck.no?`EVENT ${onDeck.no}`:"—"),
    next:next.event|| (next.no?`EVENT ${next.no}`:"—"),
    round:current.round||"",
    danceOrder:current.danceOrder||"",
    updatedAt:Date.now()
  });
}
firstBtn.onclick=async()=>{if(TT.length&&ttIndex!==0){ttIndex=0;renderTimetableRow();await publishLiveStatus()}};
prevBtn.onclick=async()=>{if(ttIndex>0){ttIndex--;renderTimetableRow();await publishLiveStatus()}};
nextBtn.onclick=async()=>{if(ttIndex<TT.length-1){ttIndex++;renderTimetableRow();await publishLiveStatus()}};
lastBtn.onclick=async()=>{if(TT.length&&ttIndex!==TT.length-1){ttIndex=TT.length-1;renderTimetableRow();await publishLiveStatus()}};
function setScripts(){if(TT.length){renderTimetableRow();return}if(!active){koEl.textContent="다음 EVENT를 준비하겠습니다.";enEl.textContent="Please get ready for the next EVENT.";return}const round=rtext(active.round);const cue=[`EVENT ${active.eventNumber||"—"}`,round].filter(Boolean).join(" ");koEl.textContent=`다음은 EVENT ${active.eventNumber||"—"}입니다.`;enEl.textContent=`Next is EVENT ${active.eventNumber||"—"}.`}
function progress(){const t=TT.length||order.length;const d=TT.length?ttIndex:(active?Math.max(0,order.findIndex(x=>x.eventKey===active.eventKey)):0);document.getElementById("mcProgressText").textContent=`${t?d+1:0} / ${t} EVENTS`;document.getElementById("mcProgressBar").style.width=t?`${(d+1)/t*100}%`:"0%"}
let submissionUnsub=null;
async function watch(active){if(submissionUnsub){submissionUnsub();submissionUnsub=null}if(!active||!active.eventKey)return;const e=enc(active.eventKey),s=await get(ref(db,`eventSettings/${e}`)),assigned=s.val()?.assignedJudges||[];submissionUnsub=onValue(ref(db,`submissions/${e}_${active.round||"final"}`),snap=>{const v=snap.val()||{},done=assigned.filter(c=>v[c]),wait=assigned.filter(c=>!v[c]);document.getElementById("mcJudgeCount").textContent=`${done.length} / ${assigned.length} DONE`;document.getElementById("mcWaitingJudges").textContent=wait.length?`Waiting for Judges: ${wait.join(", ")}`:"JUDGES ARE DONE."})}
onValue(ref(db,"activeEvent"),snap=>{active=snap.val();if(!active){if(!TT.length){nowEl.textContent="WAITING";roundEl.textContent="";setScripts()}return}if(!TT.length){nowEl.textContent=active.label||"";roundEl.textContent=rtext(active.round);setScripts();progress()}watch(active)});
onValue(ref(db,"floorStatus"),snap=>{const v=snap.val()||{};document.getElementById("mcOnDeck").textContent=v.onDeck||"—";document.getElementById("mcNext").textContent=v.next||"—"});
document.querySelectorAll("[data-copy]").forEach(b=>b.onclick=async()=>{await navigator.clipboard.writeText(document.getElementById(b.dataset.copy).textContent);b.textContent="COPIED";setTimeout(()=>b.textContent="COPY",800)});
document.querySelectorAll(".quick-line-grid button").forEach(b=>b.onclick=()=>{
  if(b.dataset.backNumber){
    const no=prompt("Back Number");
    if(!no)return;
    koEl.textContent=`백넘버 ${no}번 선수, 플로어로 와 주세요.`;
    enEl.textContent=`Back Number ${no}, please come to the floor.`;
    return;
  }
  koEl.textContent=b.dataset.ko;
  enEl.textContent=b.dataset.en;
});
get(ref(db,"eventSettings")).then(s=>{order=Object.values(s.val()||{}).filter(x=>String(x.eventNumber||"").trim()!=="").sort((a,b)=>Number(a.eventNumber)-Number(b.eventNumber));progress()});
loadTimetable();

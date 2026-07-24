import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, get, onValue, set, update } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const APDC_FIREBASE_PLAYERS_URL='https://apdc-judge-default-rtdb.asia-southeast1.firebasedatabase.app/apdcPublic/players.json';
const APDC_SEARCH_PLAYERS_URL='https://nanamun6389-a11y.github.io/APDC-SEARCH/players.json';
async function fetchLatestPlayers(){
  const urls=[APDC_FIREBASE_PLAYERS_URL,APDC_SEARCH_PLAYERS_URL];
  let lastError=null;
  for(const url of urls){
    try{
      const r=await fetch(`${url}?v=${Date.now()}`,{cache:'no-store'});
      if(!r.ok) throw new Error(`${url} HTTP ${r.status}`);
      const data=await r.json();
      if(Array.isArray(data)&&data.length)return data;
      throw new Error(`${url} returned empty/non-array data`);
    }catch(e){lastError=e;}
  }
  throw lastError||new Error('No player source available');
}
async function loadSearchEntryCounts(){
  try{
    const data=await fetchLatestPlayers();
    const counts=new Map();
    for(const p of data){
      const no=String(p?.eventNo??'').trim();
      const ev=String(p?.event??'').trim();
      if(no) counts.set(no,(counts.get(no)||0)+1);
      if(ev){const k=`event:${ev.toLowerCase()}`;counts.set(k,(counts.get(k)||0)+1);}
    }
    return counts;
  }catch(e){
    console.warn('Entry auto-sync unavailable; keeping timetable values',e);
    return null;
  }
}
function applySearchEntryCounts(rows,counts){
  if(!Array.isArray(rows)||!counts) return rows;
  const seen=new Set();
  return rows.map(row=>{
    const eventName=String(row?.event??'').trim();
    if(eventName.includes('+')){
      const parts=eventName.split('+').map(x=>x.trim().toLowerCase()).filter(Boolean);
      const vals=parts.map(x=>counts.get(`event:${x}`));
      if(parts.length&&vals.every(v=>Number.isFinite(v))) return {...row,entries:String(vals.reduce((a,b)=>a+b,0))};
      return row;
    }
    const sourceNo=String(row?.sourceEventNo??'').trim();
    if(!sourceNo||seen.has(sourceNo)||!counts.has(sourceNo)) return row;
    seen.add(sourceNo);
    return {...row,entries:String(counts.get(sourceNo))};
  });
}

apdcBuildLanguageUI();
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig),db=getDatabase(app),PASSWORD="0808";
const APDC_LIVE_STATE_KEY="apdcFloorStatusV2";
const apdcLiveChannel=("BroadcastChannel" in window)?new BroadcastChannel("apdc-mc-live-v2"):null;
const gate=document.getElementById("mcPasswordGate"),box=document.getElementById("mcProtected"),pass=document.getElementById("mcPasswordInput"),btn=document.getElementById("mcPasswordBtn"),msg=document.getElementById("mcPasswordMessage");
function unlock(){sessionStorage.setItem("apdcMcUnlocked","yes");gate.classList.add("hidden");box.classList.remove("hidden")}
btn.onclick=()=>pass.value===PASSWORD?unlock():msg.textContent="WRONG PASSWORD";pass.onkeydown=e=>{if(e.key==="Enter")btn.click()};if(sessionStorage.getItem("apdcMcUnlocked")==="yes")unlock();
const enc=k=>btoa(unescape(encodeURIComponent(k))).replaceAll("=","");
let active=null,order=[],TT=[],PLAYERS=[],ttIndex=Number(localStorage.getItem("apdcMcTimetableIndex")||0);
const nowEl=document.getElementById("mcNow"),roundEl=document.getElementById("mcRound"),koEl=document.getElementById("mcKorean"),enEl=document.getElementById("mcEnglish"),eventNameEl=document.getElementById("mcEventName"),danceOrderEl=document.getElementById("mcDanceOrder");
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
function danceSequenceEnglish(row){
  const dances=danceList(row);
  if(dances.length<=1)return"";
  return `The dance order is ${dances.join(", ")}.`;
}
function danceSequenceKorean(row){
  const dances=danceList(row);
  if(dances.length<=1)return"";
  return `${dances.join(", ")} 순서입니다.`;
}

function hasEarlierQuarter(row){
  if(!row)return false;
  const no=String(row.no||"").trim();
  if(!no)return false;
  return TT.slice(0,ttIndex).some(r=>String(r.no||"").trim()===no&&String(r.round||"").toLowerCase().includes("quarter"));
}
function isAmateur(row){
  const t=`${row?.section||""} ${row?.event||""}`.toUpperCase();
  return t.includes("AMATEUR");
}
function isAmateurCoupleFinal(row){
  const t=`${row?.section||""} ${row?.event||""}`.toUpperCase();
  return String(row?.round||"").toLowerCase().includes("final")&&t.includes("ASIA PACIFIC AMATEUR LATIN")&&!t.includes("SOLO");
}
function amateurCoupleCallout(row,lang){
  if(!isAmateurCoupleFinal(row))return "";
  const no=String(row?.no||"").trim();
  const eventName=String(row?.event||"").trim().toUpperCase();
  const couples=PLAYERS.filter(p=>{
    const pev=String(p.event||"").trim().toUpperCase();
    const pno=String(p.eventNo||"").trim();
    return String(p.entryType||"").toLowerCase()==="couple" && (pno===no || pev===eventName) && pev.includes("ASIA PACIFIC AMATEUR LATIN") && !pev.includes("SOLO");
  }).sort((a,b)=>Number(a.backNo||999)-Number(b.backNo||999));
  if(!couples.length)return "";
  if(lang==="ko")return ["파이널에 진출한 커플을 소개하겠습니다.",...couples.map(c=>`Back Number ${c.backNo}, ${c.player}.`),"모든 파이널리스트에게 큰 박수 부탁드립니다."].join("\n");
  return ["Let us introduce our finalists.",...couples.map(c=>`Back Number ${c.backNo}, ${c.player}.`),"Please give all our finalists a big round of applause."].join("\n");
}

function isRapidContinuation(row){
  const prev=TT[ttIndex-1];
  if(!prev||!row)return false;
  const prevNo=String(prev.no||"").trim(),no=String(row.no||"").trim();
  if(!prevNo||!no)return false;
  const prevEvent=String(prev.event||"").trim().toUpperCase();
  const event=String(row.event||"").trim().toUpperCase();
  if(prevEvent.includes("BREAK")||prevEvent.includes("OPENING")||event.includes("BREAK")||event.includes("OPENING"))return false;
  return true;
}
function buildEnglish(row){
  if(!row)return "Please get ready for the next EVENT.";
  const ev=String(row.event||"").trim().toUpperCase();
  const no=String(row.no||"").trim();
  const round=String(row.round||"").toLowerCase();
  if(ev.includes("OPENING"))return "Welcome to the 2026 Asia Pacific Dancesport Championship.";
  if(ev.includes("COUNTRY TEAM MATCH"))return "Next is the Country Team Match. Players, please come to the floor. Judges, please get ready.";
  if(ev.includes("BREAK"))return "We will now take a short break.";
  if(!no)return "Please get ready for the next EVENT.";
  if(isAmateurCoupleFinal(row)){
    const calls=amateurCoupleCallout(row,"en");
    return [`We now have EVENT ${no}, the Asia Pacific Amateur Latin Final.`,`This is one of the highlights of today’s championship.`,calls,`Judges, please check EVENT ${no}.`,`Finalists, take your positions. When ready, music please.`].filter(Boolean).join("\n");
  }
  if(round.includes("final")){
    const lines=[`We now have EVENT ${no}, the Final.`];
    if(hasEarlierQuarter(row))lines.push("These finalists have advanced through the earlier rounds. Please give them a warm round of applause.");
    else if(isAmateur(row))lines.push("Please give our finalists a warm round of applause.");
    lines.push("Finalists, please come to the floor.",`Judges, please check EVENT ${no}.`,`When ready, music please.`);
    return lines.join("\n");
  }
  if(round.includes("semi")){
    const lines=[`Next is EVENT ${no}, Semi-Final.`];
    if(hasEarlierQuarter(row))lines.push("Congratulations to the players who have advanced from the Quarter-Final. Please give them a big hand.");
    lines.push("Players, please come to the floor.",`Judges, please check EVENT ${no}.`,`Music, please.`);
    return lines.join("\n");
  }
  if(round.includes("quarter")){
    return [`Next is EVENT ${no}, Quarter-Final.`,`Best of luck to all players competing for a place in the next round.`,`Players, please come to the floor.`,`Judges, please check EVENT ${no}.`,`Music, please.`].join("\n");
  }
  if(isRapidContinuation(row)){
    return [`We now move on to EVENT ${no}.`,`Players, please get ready.`,`Music, please.`].join("\n");
  }
  return [`Next is EVENT ${no}.`,`Players, please take your positions on the floor.`,`Judges, please check EVENT ${no}.`,`We are ready to begin. Music, please.`].join("\n");
}
function buildKorean(row){
  if(!row)return "다음 EVENT를 준비하겠습니다.";
  const ev=String(row.event||"").trim().toUpperCase();
  const no=String(row.no||"").trim();
  const round=String(row.round||"").toLowerCase();
  if(ev.includes("OPENING"))return "지금부터 2026 아시아 퍼시픽 댄스스포츠 챔피언십을 시작하겠습니다.";
  if(ev.includes("COUNTRY TEAM MATCH"))return "다음은 Country Team Match입니다. 선수 여러분, 플로어로 입장해 주세요. 심사위원 여러분, 준비해 주세요.";
  if(ev.includes("BREAK"))return "잠시 휴식 시간을 갖겠습니다.";
  if(!no)return "다음 EVENT를 준비하겠습니다.";
  if(isAmateurCoupleFinal(row)){
    const calls=amateurCoupleCallout(row,"ko");
    return [`이제 EVENT ${no}, Asia Pacific Amateur Latin Final을 진행하겠습니다.`,`오늘 대회의 하이라이트 무대 중 하나입니다.`,calls,`심사위원 여러분, EVENT ${no}를 확인해 주세요.`,`파이널리스트 여러분, 자리를 잡아 주세요. 준비되셨으면 음악 주세요.`].filter(Boolean).join("\n");
  }
  if(round.includes("final")){
    const lines=[`이제 EVENT ${no}, Final을 진행하겠습니다.`];
    if(hasEarlierQuarter(row))lines.push("앞선 라운드를 거쳐 파이널에 오른 선수들입니다. 큰 박수로 응원해 주세요.");
    else if(isAmateur(row))lines.push("파이널 무대에 오른 선수들에게 큰 박수 부탁드립니다.");
    lines.push("파이널리스트 여러분, 플로어로 입장해 주세요.",`심사위원 여러분, EVENT ${no}를 확인해 주세요.`,`준비되셨으면 음악 주세요.`);
    return lines.join("\n");
  }
  if(round.includes("semi")){
    const lines=[`다음은 EVENT ${no}, Semi-Final입니다.`];
    if(hasEarlierQuarter(row))lines.push("Quarter-Final을 통과한 선수들입니다. 큰 박수로 응원해 주세요.");
    lines.push("선수 여러분, 플로어로 입장해 주세요.",`심사위원 여러분, EVENT ${no}를 확인해 주세요.`,`음악 주세요.`);
    return lines.join("\n");
  }
  if(round.includes("quarter")){
    return [`다음은 EVENT ${no}, Quarter-Final입니다.`,`다음 라운드 진출을 위해 함께하는 모든 선수들에게 응원의 박수 부탁드립니다.`,`선수 여러분, 플로어로 입장해 주세요.`,`심사위원 여러분, EVENT ${no}를 확인해 주세요.`,`음악 주세요.`].join("\n");
  }
  if(isRapidContinuation(row)){
    return [`이어서 EVENT ${no} 진행하겠습니다.`,`선수 여러분, 준비해 주세요.`,`음악 주세요.`].join("\n");
  }
  return [`다음은 EVENT ${no}입니다.`,`선수 여러분, 플로어로 입장해 주세요.`,`심사위원 여러분, EVENT ${no}를 확인해 주세요.`,`준비되셨으면 시작하겠습니다. 음악 주세요.`].join("\n");
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
    b.onclick=()=>moveToTimetableIndex(start);
    rangeButtons.appendChild(b);
  }
}
function syncRunningOrderUI(){
  const total=TT.length;
  const pos=total?Math.max(0,Math.min(ttIndex,total-1))+1:0;
  const text=document.getElementById("mcProgressText");
  const bar=document.getElementById("mcProgressBar");
  if(text)text.textContent=`${pos} / ${total} EVENTS`;
  if(bar)bar.style.width=total?`${pos/total*100}%`:"0%";
}
function renderTimetableRow(){
  if(!TT.length){ttPos.textContent="0 / 0";syncRunningOrderUI();return}
  ttIndex=Math.max(0,Math.min(ttIndex,TT.length-1));localStorage.setItem("apdcMcTimetableIndex",String(ttIndex));
  syncRunningOrderUI();
  const row=ttRow();
  ttPos.textContent=`${ttIndex+1} / ${TT.length}`;
  ttMeta.textContent=[row.start?`START ${row.start}`:"",eventRoundLabel(row)].filter(Boolean).join(" · ");
  nowEl.textContent=String(row.event||"").trim() || (row.no?`EVENT ${row.no}`:"WAITING");roundEl.textContent=rtext(String(row.round||"").toLowerCase());
  ttComment.textContent=buildComment(row);ttNote.textContent=buildNote(row);
  if(eventNameEl)eventNameEl.textContent=String(row.event||"—").trim()||"—";
  if(danceOrderEl){const dances=danceList(row);danceOrderEl.textContent=dances.length?dances.join(" → "):"—";}
  koEl.textContent=buildKorean(row);enEl.textContent=buildEnglish(row);
  prevBtn.disabled=ttIndex===0;nextBtn.disabled=ttIndex===TT.length-1;firstBtn.disabled=ttIndex===0;lastBtn.disabled=ttIndex===TT.length-1;
  renderRangeButtons();
  progress();
  if(typeof renderMcUpcoming==="function")renderMcUpcoming();
}
async function loadSharedPlayers(){
  try{
    const sr=await fetch(`${APDC_SEARCH_PLAYERS_URL}?v=${Date.now()}`,{cache:"no-store"});
    if(sr.ok){const sd=await sr.json();if(Array.isArray(sd)&&sd.length)return sd.map(x=>({...x,player:x.player||x.competitor||''}));}
  }catch(e){console.warn("APDC-SEARCH player data unavailable",e)}
  const remote=`https://apdc-judge-default-rtdb.asia-southeast1.firebasedatabase.app/apdcPublic/players.json?v=${Date.now()}`;
  try{
    const r=await fetch(remote,{cache:"no-store"});
    if(r.ok){const d=await r.json();if(Array.isArray(d)&&d.length)return d.map(x=>({...x,player:x.player||x.competitor||''}));}
  }catch(e){console.warn("Shared player data unavailable",e)}
  const r=await fetch(`players.json?v=${Date.now()}`,{cache:"no-store"});
  if(!r.ok)throw new Error(`players.json HTTP ${r.status}`);
  const d=await r.json();
  if(!Array.isArray(d))throw new Error("players.json must contain an array");
  return d.map(x=>({...x,player:x.player||x.competitor||''}));
}

async function readSharedIndex(){
  // ONE SOURCE OF TRUTH: floorStatus/timetableIndex only.
  try{
    const fs=await get(ref(db,"floorStatus"));
    const v=fs.val()||{};
    const idx=Number(v.timetableIndex);
    if(Number.isInteger(idx)) return idx;
  }catch(e){console.warn("floorStatus index read failed",e)}
  return null;
}

async function loadTimetable(){
  // Loading the local timetable and syncing Firebase are deliberately separated.
  // A Firebase write/read error must never be shown as "Timetable could not be loaded".
  try{
    const [tr,sharedPlayers]=await Promise.all([
      fetch(`timetable-data.json?v=20260723-syncfix1-${Date.now()}`,{cache:"no-store"}),
      loadSharedPlayers()
    ]);
    if(!tr.ok) throw new Error(`timetable-data.json HTTP ${tr.status}`);
    const d=await tr.json();
    TT=Array.isArray(d?.rows)?d.rows:[];
    if(!TT.length) throw new Error("timetable-data.json has no rows");
    PLAYERS=sharedPlayers;
    const counts=new Map();
    for(const p of PLAYERS){const no=String(p?.eventNo??'').trim(),ev=String(p?.event??'').trim();if(no)counts.set(no,(counts.get(no)||0)+1);if(ev){const k=`event:${ev.toLowerCase()}`;counts.set(k,(counts.get(k)||0)+1);}}
    TT=applySearchEntryCounts(TT,counts);
  }catch(e){
    console.error("Timetable load failed",e);
    TT=[];
    ttMeta.textContent="Timetable could not be loaded.";
    ttPos.textContent="0 / 0";
    progress();
    return;
  }

  // Optional saved timetable override. Failure here does not invalidate the packaged timetable.
  try{
    const ov=await get(ref(db,"timetableOverride"));
    const v=ov.val();
    if(v&&Array.isArray(v.rows)&&v.rows.length){
      const counts=new Map();for(const p of PLAYERS){const no=String(p?.eventNo??'').trim(),ev=String(p?.event??'').trim();if(no)counts.set(no,(counts.get(no)||0)+1);if(ev){const k=`event:${ev.toLowerCase()}`;counts.set(k,(counts.get(k)||0)+1);}}
      TT=applySearchEntryCounts(v.rows,counts);
    }
  }catch(e){console.warn("Timetable override unavailable",e)}

  const sharedIndex=await readSharedIndex();
  if(Number.isInteger(sharedIndex)) ttIndex=Math.max(0,Math.min(sharedIndex,TT.length-1));
  else ttIndex=Math.max(0,Math.min(ttIndex,TT.length-1));
  renderTimetableRow();

  // Only initialize Firebase when no shared position exists. Never let this affect timetable rendering.
  if(!Number.isInteger(sharedIndex)) publishLiveStatus().catch(e=>console.warn("Initial live sync failed",e));

  onValue(ref(db,"timetableOverride"),snap=>{
    const v=snap.val();
    if(v&&Array.isArray(v.rows)&&v.rows.length){
      const counts=new Map();for(const p of PLAYERS){const no=String(p?.eventNo??'').trim(),ev=String(p?.event??'').trim();if(no)counts.set(no,(counts.get(no)||0)+1);if(ev){const k=`event:${ev.toLowerCase()}`;counts.set(k,(counts.get(k)||0)+1);}}
      TT=applySearchEntryCounts(v.rows,counts);
      ttIndex=Math.max(0,Math.min(ttIndex,TT.length-1));
      renderTimetableRow();
    }
  });

  // Primary shared state: floorStatus. This path already worked on the deployed site.
  onValue(ref(db,"floorStatus"),snap=>{
    const v=snap.val()||{};
    const idx=Number(v.timetableIndex);
    if(Number.isInteger(idx)&&idx>=0&&idx<TT.length){
      if(idx!==ttIndex) ttIndex=idx;
      renderTimetableRow();
    }
  });

}

async function publishLiveStatus(){
  if(!TT.length)return;
  const current=TT[ttIndex]||{};
  const onDeck=TT[ttIndex+1]||{};
  const next=TT[ttIndex+2]||{};
  const updatedAt=Date.now();
  const payload={
    timetableIndex:ttIndex,
    now:current.event|| (current.no?`EVENT ${current.no}`:"WAITING"),
    eventNo:current.no||"",
    onDeck:onDeck.event|| (onDeck.no?`EVENT ${onDeck.no}`:"—"),
    next:next.event|| (next.no?`EVENT ${next.no}`:"—"),
    round:current.round||"",
    danceOrder:current.danceOrder||"",
    updatedAt
  };

  // Instant same-browser relay. This happens before any network request.
  try{localStorage.setItem(APDC_LIVE_STATE_KEY,JSON.stringify(payload));}catch(e){console.warn("Local live sync failed",e)}
  try{apdcLiveChannel?.postMessage(payload);}catch(e){console.warn("BroadcastChannel live sync failed",e)}

  // Cross-device relay through Firebase. Either path is enough.
  const writes=await Promise.allSettled([
    set(ref(db,"floorStatus"),payload),
    set(ref(db,"apdcPublic/liveState"),payload)
  ]);
  if(writes[0].status==="rejected")console.warn("floorStatus write failed",writes[0].reason);
  if(writes[1].status==="rejected")console.warn("Public live mirror write failed",writes[1].reason);
  if(writes.every(x=>x.status==="rejected"))console.warn("Firebase live sync unavailable; local browser sync remains active");
}
async function moveToTimetableIndex(index){
  if(!TT.length)return;
  const nextIndex=Math.max(0,Math.min(Number(index)||0,TT.length-1));
  ttIndex=nextIndex;
  renderTimetableRow();
  await publishLiveStatus();
}
firstBtn.onclick=()=>moveToTimetableIndex(0);
prevBtn.onclick=()=>moveToTimetableIndex(ttIndex-1);
nextBtn.onclick=()=>moveToTimetableIndex(ttIndex+1);
lastBtn.onclick=()=>moveToTimetableIndex(TT.length-1);
function setScripts(){if(TT.length){renderTimetableRow();return}if(!active){koEl.textContent="다음 EVENT를 준비하겠습니다.";enEl.textContent="Please get ready for the next EVENT.";return}const round=rtext(active.round);const cue=[`EVENT ${active.eventNumber||"—"}`,round].filter(Boolean).join(" ");koEl.textContent=`다음은 EVENT ${active.eventNumber||"—"}입니다.`;enEl.textContent=`Next is EVENT ${active.eventNumber||"—"}.`}
function progress(){if(TT.length){syncRunningOrderUI();return}const t=order.length;const d=active?Math.max(0,order.findIndex(x=>x.eventKey===active.eventKey)):0;document.getElementById("mcProgressText").textContent=`${t?d+1:0} / ${t} EVENTS`;document.getElementById("mcProgressBar").style.width=t?`${(d+1)/t*100}%`:"0%"}
let submissionUnsub=null;
async function watch(active){if(submissionUnsub){submissionUnsub();submissionUnsub=null}if(!active||!active.eventKey)return;const e=enc(active.eventKey),s=await get(ref(db,`eventSettings/${e}`)),assigned=s.val()?.assignedJudges||[];submissionUnsub=onValue(ref(db,`submissions/${e}_${active.round||"final"}`),snap=>{const v=snap.val()||{},done=assigned.filter(c=>v[c]),wait=assigned.filter(c=>!v[c]);document.getElementById("mcJudgeCount").textContent=`${done.length} / ${assigned.length} DONE`;document.getElementById("mcWaitingJudges").textContent=wait.length?`Waiting for Judges: ${wait.join(", ")}`:"JUDGES ARE DONE."})}
onValue(ref(db,"activeEvent"),snap=>{active=snap.val();if(!active){if(!TT.length){nowEl.textContent="WAITING";roundEl.textContent="";setScripts()}return}if(!TT.length){nowEl.textContent=active.label||"";roundEl.textContent=rtext(active.round);setScripts();progress()}watch(active)});
function renderMcUpcoming(){
  const d=TT[ttIndex+1]||{},n=TT[ttIndex+2]||{};
  const dEl=document.getElementById("mcOnDeck"),nEl=document.getElementById("mcNext");
  if(dEl)dEl.textContent=d.event||"—";
  if(nEl)nEl.textContent=n.event||"—";
}

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


/* APDC_MC_COMBINED_EXIT_GUIDE */
function apdcCombinedExitGuide(row) {
  if (!row || String(row.note || '').trim() !== 'COMB.') return '';
  const plan = String(row.danceOrder || '').split(/[→>,/]+/).map(s => s.trim()).filter(Boolean);
  if (!plan.length) return 'COMB. 진행';
  // Public timetable stays clean. MC receives a compact operational cue.
  // Player/back-number-specific exit names are shown when exitGuide is present in row metadata.
  if (row.exitGuide) return row.exitGuide;
  return 'COMB. 진행 | ' + plan.map((d, i) =>
    `${d} 종료${i === plan.length - 1 ? ' → 남은 선수 전원 퇴장' : ' → 해당 종목 종료 선수 퇴장'}`
  ).join(' | ');
}

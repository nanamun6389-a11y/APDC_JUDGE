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

function normalizeTimetableRow(row){
  const r=row&&typeof row==="object"?row:{};
  const pick=(...vals)=>{for(const v of vals){if(v!==undefined&&v!==null&&String(v).trim()!=="")return v;}return "";};
  return {
    ...r,
    no:String(pick(r.no,r.eventNo,r.eventNumber,r.sourceEventNo,r.EVENT,r.event_no)).trim(),
    event:String(pick(r.event,r.Event,r.eventName,r.name,r.EVENT_NAME)).trim(),
    round:String(pick(r.round,r.Round,r.stage,r.ROUND)).trim(),
    section:String(pick(r.section,r.Section,r.category,r.SECTION)).trim(),
    entries:String(pick(r.entries,r.Entries,r.entryCount,r.ENTRIES)).trim(),
    danceOrder:String(pick(r.danceOrder,r.dance,r.Dance,r.DANCE,r.dances)).trim(),
    note:String(pick(r.note,r.Note,r.memo,r.MEMO)).trim(),
    sourceEventNo:String(pick(r.sourceEventNo,r.eventNo,r.eventNumber,r.no,r.EVENT)).trim()
  };
}
function normalizeTimetableRows(rows){return Array.isArray(rows)?rows.map(normalizeTimetableRow):[];}

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
const DANCE_NAMES={C:"Cha Cha",S:"Samba",R:"Rumba",P:"Paso Doble",J:"Jive",W:"Waltz",T:"Tango",F:"Foxtrot",Q:"Quickstep",V:"Viennese Waltz"};
function danceList(row){return String(row?.danceOrder||"").split(/[→>,/]+/).map(x=>String(x||"").trim()).filter(Boolean).map(x=>DANCE_NAMES[x]||x);}
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
function formationTeams(){
  return PLAYERS.filter(p=>String(p.entryType||"").toLowerCase()==="formation" || String(p.event||"").toLowerCase()==="formation")
    .sort((a,b)=>Number(a.backNo||999)-Number(b.backNo||999))
    .map(p=>String(p.player||p.competitor||"").trim()).filter(Boolean);
}
function formationEnglish(){
  const teams=formationTeams();
  if(!teams.length)return ["Next is our Formation event.","Judges, please be ready.","Music, please."].join("\n");
  const out=["Next is our Formation event."];
  teams.forEach((team,i)=>{
    out.push(i===0?`First, please welcome ${team} to the floor.`:`Next, please welcome ${team} to the floor.`);
    out.push("Judges, please be ready.","Music, please.",`Thank you, ${team}. Please give them a big hand.`);
  });
  out.push("Thank you to all our Formation teams. Please give them one more big hand.");
  return out.join("\n");
}
function formationKorean(){
  const teams=formationTeams();
  if(!teams.length)return ["다음은 Formation 경기입니다.","심사위원 여러분, 준비해 주시기 바랍니다.","음악 부탁드립니다."].join("\n");
  const out=["다음은 Formation 경기입니다."];
  teams.forEach((team,i)=>{
    out.push(i===0?`먼저 ${team} 팀을 큰 박수로 맞아주시기 바랍니다.`:`이어서 ${team} 팀을 플로어로 모시겠습니다.`);
    out.push("심사위원 여러분, 준비해 주시기 바랍니다.","음악 부탁드립니다.",`${team} 팀의 멋진 무대였습니다. 큰 박수 부탁드립니다.`);
  });
  out.push("함께해 주신 모든 Formation 팀에게 다시 한 번 큰 박수 부탁드립니다.");
  return out.join("\n");
}
function openingEnglish(){return [
  "Ladies and gentlemen, the Opening Ceremony of APDC 2026 will now begin.",
  "First, please welcome the organizer of APDC, Tei Kim.",
  "He has worked hard to make this event possible. Please give him a big hand.",
  "Next, we would like to thank a very special guest who gave great support to APDC.",
  "Please welcome Jay Park, President of the Korea Professional Dance Council and Organizing Chairman of the Korea Open.",
  "Thank you for your support for APDC. Please give him a warm welcome.",
  "Now, we would like to introduce our Judges.",
  "International Judges: Raymond Kim from Korea. Lorencia from Singapore. Marcus from Taiwan. Crystal from Macao. Tomohiro from Japan. Annie Oo from Malaysia. Nancy Chang. Max Yim from Hong Kong.",
  "National Judges: JongRyul Lee. DoYeong Kim. HyeRi Eom. ChaeLim Ku. JaeHo Ko. ChaeSung Lim. Eun Il. Vladi. SeYoung Lee.",
  "Judges, thank you for being with us today. Please give all our Judges a big hand.",
  "And now, we are ready for the Country Team Match.",
  "The Team Match will be danced in this order: Cha Cha, Samba, and Rumba.",
  "Please welcome the teams from Korea, Japan, Taiwan, Hong Kong, Macao, Singapore, and Malaysia."
].join("\n");}
function openingKorean(){return [
  "신사 숙녀 여러분, 지금부터 APDC 2026 개회식을 시작하겠습니다.",
  "먼저 APDC의 대회장이자 오거나이저인 김태원, Tei Kim을 소개합니다.",
  "이번 대회를 위해 많은 시간과 열정을 다해 준비해 주셨습니다. 큰 박수로 맞아주시기 바랍니다.",
  "이어서 APDC의 첫걸음에 큰 힘과 응원을 보내주신 특별한 분을 소개하겠습니다.",
  "한국프로댄스협회 회장이자 코리아오픈 조직위원장이신 박지우 선생님입니다.",
  "APDC를 위해 보내주신 소중한 도움과 응원에 깊이 감사드립니다. 큰 박수로 맞아주시기 바랍니다.",
  "이제 오늘 대회의 심사위원 여러분을 소개하겠습니다.",
  "International Judges: 한국 Raymond Kim. 싱가포르 Lorencia. 대만 Marcus. 마카오 Crystal. 일본 Tomohiro. 말레이시아 Annie Oo. Nancy Chang. 홍콩 Max Yim.",
  "National Judges: 이종률. 김도영. 엄혜리. 구채림. 고재호. 임채성. 은일. 블라디. 이세영.",
  "오늘 함께해 주신 심사위원 여러분께 감사드립니다. 큰 박수 부탁드립니다.",
  "이제 Country Team Match를 시작할 준비가 되었습니다.",
  "Team Match는 Cha Cha, Samba, Rumba 순으로 진행됩니다.",
  "한국, 일본, 대만, 홍콩, 마카오, 싱가포르, 말레이시아 팀을 큰 박수로 맞아주시기 바랍니다."
].join("\n");}
function teamMatchEnglish(){return [
  "It is time for the Country Team Match.",
  "The dance order is Cha Cha, Samba, and Rumba.",
  "All team dancers, please be ready. Judges, please be ready.",
  "First dance, Cha Cha. Music, please.",
  "Thank you. Dancers, please stay on the floor.",
  "Next dance, Samba. Music, please.",
  "Thank you. Dancers, please stay on the floor.",
  "Last dance, Rumba. Music, please.",
  "Thank you to all our teams. Please give all the dancers a big hand."
].join("\n");}
function teamMatchKorean(){return [
  "이제 Country Team Match를 시작하겠습니다.",
  "경기 순서는 Cha Cha, Samba, Rumba입니다.",
  "모든 팀 선수 여러분, 준비해 주시기 바랍니다. 심사위원 여러분, 준비해 주시기 바랍니다.",
  "첫 종목은 Cha Cha입니다. 음악 부탁드립니다.",
  "감사합니다. 선수 여러분은 플로어에 그대로 남아주시기 바랍니다.",
  "다음 종목은 Samba입니다. 음악 부탁드립니다.",
  "감사합니다. 선수 여러분은 플로어에 그대로 남아주시기 바랍니다.",
  "마지막 종목은 Rumba입니다. 음악 부탁드립니다.",
  "함께해 주신 모든 팀 선수 여러분께 감사드립니다. 큰 박수 부탁드립니다."
].join("\n");}
function combinedScripts(row,lang){
  const ev=String(row?.event||"").trim();
  const u=ev.toUpperCase();
  const en=lang==="en";
  const both=(a,b)=>en?a:b;
  if(u.includes("MANIA LATIN R + KOREA CLOSED AMATEUR LATIN"))return both([
    "This is a combined event: Mania Latin R and Korea Closed Amateur Latin.","All dancers, please come to the floor. Judges, please be ready.","First dance, Rumba. Music, please.","Thank you. Mania Latin R dancers, please leave the floor. Korea Closed Amateur Latin dancers, please stay on the floor.","Next, Cha Cha. Music, please.","Please stay on the floor. Next, Samba. Music, please.","Please stay on the floor. Next, Paso Doble. Music, please.","Please stay on the floor. Last dance, Jive. Music, please."
  ],[
    "이번 경기는 Mania Latin R과 Korea Closed Amateur Latin의 합동 경기입니다.","선수 여러분, 플로어로 입장해 주시기 바랍니다. 심사위원 여러분, 준비해 주시기 바랍니다.","첫 종목은 Rumba입니다. 음악 부탁드립니다.","감사합니다. Mania Latin R 선수 여러분은 퇴장해 주시고, Korea Closed Amateur Latin 선수 여러분은 플로어에 그대로 남아주시기 바랍니다.","다음은 Cha Cha입니다. 음악 부탁드립니다.","그대로 남아주시기 바랍니다. 다음은 Samba입니다. 음악 부탁드립니다.","그대로 남아주시기 바랍니다. 다음은 Paso Doble입니다. 음악 부탁드립니다.","그대로 남아주시기 바랍니다. 마지막 종목은 Jive입니다. 음악 부탁드립니다."
  ]).join("\n");
  if(u.includes("UNDER 12 SOLO CJ + UNDER 15 SOLO CJ + UNDER 18 SOLO CJ"))return both([
    "This is a combined event for Under 12 Solo CJ, Under 15 Solo CJ, and Under 18 Solo CJ.","All dancers, please come to the floor. Judges, please be ready.","First, Cha Cha. Music, please.","Dancers, please stay on the floor.","Next, Jive. Music, please."
  ],[
    "이번 경기는 Under 12 Solo CJ, Under 15 Solo CJ, Under 18 Solo CJ의 합동 경기입니다.","선수 여러분, 플로어로 입장해 주시기 바랍니다. 심사위원 여러분, 준비해 주시기 바랍니다.","먼저 Cha Cha입니다. 음악 부탁드립니다.","선수 여러분, 플로어에 그대로 남아주시기 바랍니다.","다음은 Jive입니다. 음악 부탁드립니다."
  ]).join("\n");
  if(u.includes("UNDER 15 CRS + UNDER 18 SOLO S"))return both([
    "This is a combined event: Under 15 CRS and Under 18 Solo S.","All dancers, please come to the floor. Judges, please be ready.","First, Samba. Music, please.","Thank you. Under 18 Solo S dancers, please leave the floor. Under 15 CRS dancers, please stay on the floor.","Next, Cha Cha. Music, please.","Dancers, please stay on the floor. Last dance, Rumba. Music, please."
  ],[
    "이번 경기는 Under 15 CRS와 Under 18 Solo S의 합동 경기입니다.","선수 여러분, 플로어로 입장해 주시기 바랍니다. 심사위원 여러분, 준비해 주시기 바랍니다.","먼저 Samba입니다. 음악 부탁드립니다.","감사합니다. Under 18 Solo S 선수 여러분은 퇴장해 주시고, Under 15 CRS 선수 여러분은 플로어에 그대로 남아주시기 바랍니다.","다음은 Cha Cha입니다. 음악 부탁드립니다.","선수 여러분, 그대로 남아주시기 바랍니다. 마지막 종목은 Rumba입니다. 음악 부탁드립니다."
  ]).join("\n");
  if(u.includes("UNDER 18 SOLO RJ + OVER 35 SOLO CRJ"))return both([
    "This is a combined event: Under 18 Solo RJ and Over 35 Solo CRJ.","All dancers, please come to the floor. Judges, please be ready.","First, Rumba. Music, please.","Dancers, please stay on the floor. Next, Jive. Music, please.","Thank you. Under 18 Solo RJ dancers, please leave the floor. Over 35 Solo CRJ dancers, please stay on the floor.","Last dance, Cha Cha. Music, please."
  ],[
    "이번 경기는 Under 18 Solo RJ와 Over 35 Solo CRJ의 합동 경기입니다.","선수 여러분, 플로어로 입장해 주시기 바랍니다. 심사위원 여러분, 준비해 주시기 바랍니다.","먼저 Rumba입니다. 음악 부탁드립니다.","선수 여러분, 그대로 남아주시기 바랍니다. 다음은 Jive입니다. 음악 부탁드립니다.","감사합니다. Under 18 Solo RJ 선수 여러분은 퇴장해 주시고, Over 35 Solo CRJ 선수 여러분은 플로어에 그대로 남아주시기 바랍니다.","마지막 종목은 Cha Cha입니다. 음악 부탁드립니다."
  ]).join("\n");
  if(u.includes("OVER 19 SOLO RJ + UNDER 18 SOLO CRJ + OVER 19 SOLO LATIN CSRJ"))return both([
    "This is a combined event for Over 19 Solo RJ, Under 18 Solo CRJ, and Over 19 Solo Latin CSRJ.","All dancers, please come to the floor. Judges, please be ready.","First, Rumba. Music, please.","All dancers, please stay on the floor. Next, Jive. Music, please.","Thank you. Over 19 Solo RJ dancers, please leave the floor. Under 18 Solo CRJ and Over 19 Solo Latin CSRJ dancers, please stay.","Next, Cha Cha. Music, please.","Thank you. Under 18 Solo CRJ dancers, please leave the floor. Over 19 Solo Latin CSRJ dancers, please stay.","Last dance, Samba. Music, please."
  ],[
    "이번 경기는 Over 19 Solo RJ, Under 18 Solo CRJ, Over 19 Solo Latin CSRJ의 합동 경기입니다.","선수 여러분, 플로어로 입장해 주시기 바랍니다. 심사위원 여러분, 준비해 주시기 바랍니다.","먼저 Rumba입니다. 음악 부탁드립니다.","모든 선수는 그대로 남아주시기 바랍니다. 다음은 Jive입니다. 음악 부탁드립니다.","감사합니다. Over 19 Solo RJ 선수 여러분은 퇴장해 주시고, Under 18 Solo CRJ와 Over 19 Solo Latin CSRJ 선수 여러분은 그대로 남아주시기 바랍니다.","다음은 Cha Cha입니다. 음악 부탁드립니다.","감사합니다. Under 18 Solo CRJ 선수 여러분은 퇴장해 주시고, Over 19 Solo Latin CSRJ 선수 여러분은 그대로 남아주시기 바랍니다.","마지막 종목은 Samba입니다. 음악 부탁드립니다."
  ]).join("\n");
  const simple=[
    ["OVER 19 SOLO P + UNDER 18 SOLO P","Paso Doble"],["OVER 19 SOLO C + OVER 35 SOLO C","Cha Cha"],["OVER 35 SOLO R + PRO-AM LATIN R","Rumba"],["OVER 19 SOLO S + OVER 35 SOLO S","Samba"],["UNDER 18 SOLO Q + UNDER 10 SOLO Q","Quickstep"],["OVER 19 SOLO T + UNDER 18 SOLO T","Tango"],["OVER 19 SOLO W + UNDER 18 SOLO W","Waltz"]
  ];
  for(const [key,d] of simple)if(u.includes(key))return both([
    `This is a combined event: ${ev}.`,`All dancers, please come to the floor. Judges, please be ready.`,`All dancers will dance ${d} together. Music, please.`
  ],[
    `이번 경기는 ${ev}의 합동 경기입니다.`,`선수 여러분, 플로어로 입장해 주시기 바랍니다. 심사위원 여러분, 준비해 주시기 바랍니다.`,`모든 선수가 함께 ${d}을 진행합니다. 음악 부탁드립니다.`
  ]).join("\n");
  if(u.includes("SENIOR 50 CR + OVER 35 SOLO CR")||u.includes("PRO-AM LATIN CR + MANIA LATIN CR"))return both([
    `This is a combined event: ${ev}.`,`All dancers, please come to the floor. Judges, please be ready.`,`First, Cha Cha. Music, please.`,`Dancers, please stay on the floor.`,`Next, Rumba. Music, please.`
  ],[
    `이번 경기는 ${ev}의 합동 경기입니다.`,`선수 여러분, 플로어로 입장해 주시기 바랍니다. 심사위원 여러분, 준비해 주시기 바랍니다.`,`먼저 Cha Cha입니다. 음악 부탁드립니다.`,`선수 여러분, 플로어에 그대로 남아주시기 바랍니다.`,`다음은 Rumba입니다. 음악 부탁드립니다.`
  ]).join("\n");
  if(u.includes("OVER 19 SOLO R + OVER 19 SOLO CR"))return both([
    "This is a combined event: Over 19 Solo R and Over 19 Solo CR.","All dancers, please come to the floor. Judges, please be ready.","First, Rumba. Music, please.","Thank you. Over 19 Solo R dancers, please leave the floor. Over 19 Solo CR dancers, please stay on the floor.","Last dance, Cha Cha. Music, please."
  ],[
    "이번 경기는 Over 19 Solo R과 Over 19 Solo CR의 합동 경기입니다.","선수 여러분, 플로어로 입장해 주시기 바랍니다. 심사위원 여러분, 준비해 주시기 바랍니다.","먼저 Rumba입니다. 음악 부탁드립니다.","감사합니다. Over 19 Solo R 선수 여러분은 퇴장해 주시고, Over 19 Solo CR 선수 여러분은 그대로 남아주시기 바랍니다.","마지막 종목은 Cha Cha입니다. 음악 부탁드립니다."
  ]).join("\n");
  if(u.includes("UNDER 12 SOLO WTFQ + UNDER 10 SOLO WTQ"))return both([
    `This is a combined event: ${ev}.`,`All dancers, please come to the floor. Judges, please be ready.`,`First, Waltz. Music, please.`,`Dancers, please stay on the floor. Next, Tango. Music, please.`,`Dancers, please stay on the floor. Next, Quickstep. Music, please.`,`Thank you. Under 10 Solo WTQ dancers, please leave the floor. Under 12 Solo WTFQ dancers, please stay on the floor.`,`Last dance, Foxtrot. Music, please.`
  ],[
    `이번 경기는 ${ev}의 합동 경기입니다.`,`선수 여러분, 플로어로 입장해 주시기 바랍니다. 심사위원 여러분, 준비해 주시기 바랍니다.`,`먼저 Waltz입니다. 음악 부탁드립니다.`,`선수 여러분, 그대로 남아주시기 바랍니다. 다음은 Tango입니다. 음악 부탁드립니다.`,`선수 여러분, 그대로 남아주시기 바랍니다. 다음은 Quickstep입니다. 음악 부탁드립니다.`,`감사합니다. Under 10 Solo WTQ 선수 여러분은 퇴장해 주시고, Under 12 Solo WTFQ 선수 여러분은 그대로 남아주시기 바랍니다.`,`마지막 종목은 Foxtrot입니다. 음악 부탁드립니다.`
  ]).join("\n");
  const allStay=[
    ["UNDER 12 WTF + UNDER 18 SOLO WTF + OVER 19 SOLO WTF",["Waltz","Tango","Foxtrot"]],
    ["UNDER 18 SOLO WQ + UNDER 12 SOLO WQ",["Waltz","Quickstep"]],
    ["OVER 19 SOLO WTFQ + UNDER 18 SOLO WTFQ",["Waltz","Tango","Foxtrot","Quickstep"]],
    ["OVER 19 SOLO WTQ + UNDER 18 SOLO WTQ",["Waltz","Tango","Quickstep"]],
    ["UNDER 15 WTF + UNDER 10 SOLO WTF",["Waltz","Tango","Foxtrot"]]
  ];
  for(const [key,ds] of allStay)if(u.includes(key)){
    const out=both([`This is a combined event: ${ev}.`,`All dancers, please come to the floor. Judges, please be ready.`],[`이번 경기는 ${ev}의 합동 경기입니다.`,`선수 여러분, 플로어로 입장해 주시기 바랍니다. 심사위원 여러분, 준비해 주시기 바랍니다.`]);
    ds.forEach((d,i)=>{out.push(en?(i===0?`First dance, ${d}. Music, please.`:i===ds.length-1?`Last dance, ${d}. Music, please.`:`Next dance, ${d}. Music, please.`):(i===0?`첫 종목은 ${d}입니다. 음악 부탁드립니다.`:i===ds.length-1?`마지막 종목은 ${d}입니다. 음악 부탁드립니다.`:`다음 종목은 ${d}입니다. 음악 부탁드립니다.`));if(i<ds.length-1)out.push(en?"Dancers, please stay on the floor.":"선수 여러분, 플로어에 그대로 남아주시기 바랍니다.");});
    return out.join("\n");
  }
  return "";
}
function closingEnglish(){return [
  "All of today’s events are now complete.",
  "We will now begin the Awards Ceremony.",
  "Award winners, please come to the podium when your event is called.",
  "Please give a big hand to all our award winners.",
  "Thank you to all our dancers, families, guests, and staff for being with us until the end.",
  "We hope to see you again at APDC 2027. Thank you."
].join("\n");}
function closingKorean(){return [
  "이것으로 오늘 예정된 모든 경기가 끝났습니다.",
  "이제 시상식을 진행하겠습니다.",
  "수상하시는 선수 여러분은 해당 경기가 호명되면 시상대 앞으로 이동해 주시기 바랍니다.",
  "수상하신 모든 선수 여러분께 큰 박수 부탁드립니다.",
  "끝까지 함께해 주신 선수 여러분, 가족 여러분, 관계자 여러분, 그리고 모든 스태프 여러분께 진심으로 감사드립니다.",
  "2027년 APDC에서 다시 뵙겠습니다. 감사합니다."
].join("\n");}
function scriptStyle(){return TT.length?(ttIndex%5):0;}
function buildEnglish(row){
  if(!row)return "Please get ready for the next EVENT.";
  const ev=String(row.event||"").trim().toUpperCase();
  const no=String(row.no||"").trim();
  const round=String(row.round||"").toLowerCase();
  if(ev.includes("FORMATION"))return formationEnglish();
  if(ev.includes("OPENING CEREMONY"))return openingEnglish();
  if(ev.includes("COUNTRY TEAM MATCH"))return teamMatchEnglish();
  if(ev.includes("BREAK"))return "We will now take a short break. Please enjoy your break. We will be back soon.";
  const combined=combinedScripts(row,"en");
  if(combined)return combined;
  if(!no)return "Please get ready for the next EVENT.";
  const style=scriptStyle();
  let lines=[];
  if(round.includes("grand final"))lines.push(`Now, EVENT ${no}, the Grand Final.`);
  else if(round.includes("final"))lines.push([`Now, EVENT ${no}, the Final.`,`Next is EVENT ${no}, the Final.`,`We are ready for EVENT ${no}, the Final.`,`It is time for EVENT ${no}, the Final.`,`Here is EVENT ${no}, the Final.`][style]);
  else if(round.includes("semi"))lines.push([`Next is EVENT ${no}, Semi-Final.`,`Now, EVENT ${no}, Semi-Final.`,`We are ready for EVENT ${no}, Semi-Final.`,`It is time for EVENT ${no}, Semi-Final.`,`Here is EVENT ${no}, Semi-Final.`][style]);
  else if(round.includes("quarter"))lines.push([`Next is EVENT ${no}, Quarter-Final.`,`Now, EVENT ${no}, Quarter-Final.`,`We are ready for EVENT ${no}, Quarter-Final.`,`It is time for EVENT ${no}, Quarter-Final.`,`Here is EVENT ${no}, Quarter-Final.`][style]);
  else lines.push(`Next is EVENT ${no}.`);
  const calls=["Dancers, please come to the floor.","Dancers, please take your places.","Please welcome the dancers to the floor.","Dancers, the floor is ready.","Dancers, please get ready on the floor."];
  lines.push(calls[style],`Judges, please check EVENT ${no}.`);
  const dances=danceList(row);if(dances.length)lines.push(`First dance, ${dances[0]}. Music, please.`);else lines.push("Music, please.");
  if(ttIndex===TT.length-1)lines.push("","AFTER THE LAST DANCE",closingEnglish());
  return lines.join("\n");
}
function buildKorean(row){
  if(!row)return "다음 EVENT를 준비하겠습니다.";
  const ev=String(row.event||"").trim().toUpperCase();
  const no=String(row.no||"").trim();
  const round=String(row.round||"").toLowerCase();
  if(ev.includes("FORMATION"))return formationKorean();
  if(ev.includes("OPENING CEREMONY"))return openingKorean();
  if(ev.includes("COUNTRY TEAM MATCH"))return teamMatchKorean();
  if(ev.includes("BREAK"))return "지금부터 잠시 휴식 시간을 갖겠습니다. 편안한 휴식 시간 보내시기 바랍니다. 잠시 후 다시 진행하겠습니다.";
  const combined=combinedScripts(row,"ko");
  if(combined)return combined;
  if(!no)return "다음 EVENT를 준비하겠습니다.";
  const style=scriptStyle();
  let lines=[];
  if(round.includes("grand final"))lines.push(`이제 EVENT ${no}, Grand Final입니다.`);
  else if(round.includes("final"))lines.push([`이제 EVENT ${no}, Final입니다.`,`다음은 EVENT ${no}, Final입니다.`,`EVENT ${no}, Final을 진행하겠습니다.`,`이제 EVENT ${no}, Final을 시작하겠습니다.`,`EVENT ${no}, Final 무대입니다.`][style]);
  else if(round.includes("semi"))lines.push([`다음은 EVENT ${no}, Semi-Final입니다.`,`이제 EVENT ${no}, Semi-Final입니다.`,`EVENT ${no}, Semi-Final을 진행하겠습니다.`,`이제 EVENT ${no}, Semi-Final을 시작하겠습니다.`,`EVENT ${no}, Semi-Final 무대입니다.`][style]);
  else if(round.includes("quarter"))lines.push([`다음은 EVENT ${no}, Quarter-Final입니다.`,`이제 EVENT ${no}, Quarter-Final입니다.`,`EVENT ${no}, Quarter-Final을 진행하겠습니다.`,`이제 EVENT ${no}, Quarter-Final을 시작하겠습니다.`,`EVENT ${no}, Quarter-Final 무대입니다.`][style]);
  else lines.push(`다음은 EVENT ${no}입니다.`);
  const calls=["선수 여러분, 플로어로 입장해 주시기 바랍니다.","선수 여러분, 자리를 잡아주시기 바랍니다.","출전 선수들을 플로어로 맞아주시기 바랍니다.","선수 여러분, 플로어가 준비되었습니다.","선수 여러분, 플로어에서 준비해 주시기 바랍니다."];
  lines.push(calls[style],`심사위원 여러분, EVENT ${no}를 확인해 주시기 바랍니다.`);
  const dances=danceList(row);if(dances.length)lines.push(`첫 종목은 ${dances[0]}입니다. 음악 부탁드립니다.`);else lines.push("음악 부탁드립니다.");
  if(ttIndex===TT.length-1)lines.push("","마지막 경기 종료 후",closingKorean());
  return lines.join("\n");
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
    TT=normalizeTimetableRows(Array.isArray(d?.rows)?d.rows:[]);
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
      TT=applySearchEntryCounts(normalizeTimetableRows(v.rows),counts);
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
      TT=applySearchEntryCounts(normalizeTimetableRows(v.rows),counts);
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

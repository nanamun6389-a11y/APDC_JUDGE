import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";
apdcBuildLanguageUI();
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig),db=getDatabase(app),PASSWORD="0808";
const gate=document.getElementById("mcPasswordGate"),box=document.getElementById("mcProtected"),pass=document.getElementById("mcPasswordInput"),btn=document.getElementById("mcPasswordBtn"),msg=document.getElementById("mcPasswordMessage");
function unlock(){sessionStorage.setItem("apdcMcUnlocked","yes");gate.classList.add("hidden");box.classList.remove("hidden")}
btn.onclick=()=>pass.value===PASSWORD?unlock():msg.textContent="WRONG PASSWORD";pass.onkeydown=e=>{if(e.key==="Enter")btn.click()};if(sessionStorage.getItem("apdcMcUnlocked")==="yes")unlock();
const enc=k=>btoa(unescape(encodeURIComponent(k))).replaceAll("=","");
let active=null,order=[];
const nowEl=document.getElementById("mcNow"),roundEl=document.getElementById("mcRound"),koEl=document.getElementById("mcKorean"),enEl=document.getElementById("mcEnglish");
function rtext(r){return r==="quarter"?"Quarter Final":r==="semi"?"Semi Final":r==="final"?"Final":r||""}
function setScripts(){if(!active){koEl.textContent="다음 경기를 준비하겠습니다.";enEl.textContent="Please get ready for the next event.";return}const kr=active.round==="quarter"?"쿼터 파이널":active.round==="semi"?"세미 파이널":"파이널";koEl.textContent=`다음 경기는 ${active.label} ${kr}입니다. 선수들은 경기장으로 나와주세요. 심판 선생님 준비 부탁드립니다.`;enEl.textContent=`Next event: ${active.label}. ${rtext(active.round)}. Players, please come to the floor. Judges, please get ready.`}
function progress(){const i=active?order.findIndex(x=>x.eventKey===active.eventKey):-1,t=order.length,d=Math.max(0,i);document.getElementById("mcProgressText").textContent=`${d} / ${t} EVENTS`;document.getElementById("mcProgressBar").style.width=t?`${d/t*100}%`:"0%"}
async function watch(active){const e=enc(active.eventKey),s=await get(ref(db,`eventSettings/${e}`)),assigned=s.val()?.assignedJudges||[];onValue(ref(db,`submissions/${e}_${active.round||"final"}`),snap=>{const v=snap.val()||{},done=assigned.filter(c=>v[c]),wait=assigned.filter(c=>!v[c]);document.getElementById("mcJudgeCount").textContent=`${done.length} / ${assigned.length} DONE`;document.getElementById("mcWaitingJudges").textContent=wait.length?`Waiting for Judges: ${wait.join(", ")}`:"JUDGES ARE DONE."})}
onValue(ref(db,"activeEvent"),snap=>{active=snap.val();if(!active){nowEl.textContent="WAITING";roundEl.textContent="";setScripts();return}nowEl.textContent=active.label||"";roundEl.textContent=rtext(active.round);setScripts();progress();watch(active)});
onValue(ref(db,"floorStatus"),snap=>{const v=snap.val()||{};document.getElementById("mcOnDeck").textContent=v.onDeck||"—";document.getElementById("mcNext").textContent=v.next||"—"});
document.querySelectorAll("[data-copy]").forEach(b=>b.onclick=async()=>{await navigator.clipboard.writeText(document.getElementById(b.dataset.copy).textContent);b.textContent="COPIED";setTimeout(()=>b.textContent="COPY",800)});
document.querySelectorAll(".quick-line-grid button").forEach(b=>b.onclick=()=>{koEl.textContent=b.dataset.ko;enEl.textContent=b.dataset.en});
get(ref(db,"eventSettings")).then(s=>{order=Object.values(s.val()||{}).filter(x=>String(x.eventNumber||"").trim()!=="").sort((a,b)=>Number(a.eventNumber)-Number(b.eventNumber));progress()});

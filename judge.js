import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, set, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const JUDGES = {
"T1":"Raymond KIM","T2":"Lorencia","T3":"Marcus","T4":"Crystal","T5":"Tomohiro","T6":"Annie Oo","T7":"Nancy Chang","T8":"Max Yim",
"W1":"이종률","W2":"김도영","W3":"엄혜리","W4":"구채림","W5":"고재호","W6":"임채성","W7":"은일","W8":"블라디","W9":"이세영"
};

const app=initializeApp(firebaseConfig),db=getDatabase(app);
let entries=[],selected=new Set();
const eventSelect=document.getElementById("eventSelect"),roundSelect=document.getElementById("roundSelect"),judgeSelect=document.getElementById("judgeSelect"),ballot=document.getElementById("ballot"),eventTitle=document.getElementById("eventTitle"),roundTitle=document.getElementById("roundTitle"),counter=document.getElementById("counter"),message=document.getElementById("message");

const params=new URLSearchParams(location.search);
const judgeParam=params.get("judge");
if(judgeParam && JUDGES[judgeParam]){
  judgeSelect.value=judgeParam;
  judgeSelect.disabled=true;
  document.getElementById("judgeIdentity").textContent=`${judgeParam} · ${JUDGES[judgeParam]}`;
  document.getElementById("judgeLockText").textContent="Personal ballot";
}else{
  document.getElementById("judgeIdentity").textContent="Judge selection";
}

onValue(ref(db,".info/connected"),snap=>{
  const online=snap.val()===true;
  document.getElementById("connectionDot").classList.toggle("online",online);
  document.getElementById("connectionText").textContent=online?"ONLINE":"OFFLINE";
});

const natural=(a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true,sensitivity:"base"});
function uniqueEvents(data){const m=new Map();data.forEach(x=>{const key=[x.event,x.section,x.style].join("||");if(!m.has(key))m.set(key,{key,event:x.event,section:x.section,style:x.style})});return[...m.values()].sort((a,b)=>natural(a.section,b.section)||natural(a.event,b.event))}
function currentCompetitors(){const [event,section,style]=eventSelect.value.split("||"),m=new Map();entries.filter(x=>x.event===event&&x.section===section&&x.style===style).forEach(x=>m.set(x.backNo,{backNo:x.backNo,name:x.competitor}));return[...m.values()].sort((a,b)=>natural(a.backNo,b.backNo))}
function roundKey(){return btoa(unescape(encodeURIComponent(eventSelect.value))).replaceAll("=","")+"_"+roundSelect.value}
function render(){
  selected.clear();message.textContent="";
  const comps=currentCompetitors(),round=roundSelect.value;
  eventTitle.textContent=eventSelect.selectedOptions[0]?.textContent||"";
  roundTitle.textContent=round==="quarter"?"QUARTER FINAL":round==="semi"?"SEMI FINAL":"FINAL";
  if(round==="final"){
    ballot.innerHTML=comps.map(c=>`<div class="final-row"><div><div class="final-number">${c.backNo}</div><div>${c.name}</div></div><select class="rank-select" data-back="${c.backNo}"><option value="">Rank</option>${comps.map((_,i)=>`<option value="${i+1}">${i+1}</option>`).join("")}</select></div>`).join("");
    counter.textContent=`${comps.length} FINALISTS`;
  }else{
    const needed=round==="quarter"?12:6;
    ballot.innerHTML=comps.map(c=>`<button class="number-btn" data-back="${c.backNo}">${c.backNo}</button>`).join("");
    counter.textContent=`0 / ${needed}`;
    ballot.querySelectorAll(".number-btn").forEach(b=>b.onclick=()=>{
      const n=b.dataset.back;
      if(selected.has(n)){selected.delete(n);b.classList.remove("selected")}
      else if(selected.size<needed){selected.add(n);b.classList.add("selected")}
      counter.textContent=`${selected.size} / ${needed}`;
    });
  }
}
async function submit(){
  const round=roundSelect.value;let result;
  if(round==="final"){
    const rows=[...ballot.querySelectorAll(".rank-select")],vals=rows.map(r=>r.value);
    if(vals.some(v=>!v)||new Set(vals).size!==vals.length){message.textContent="Complete all ranks without duplicates.";message.className="message error";return}
    result=rows.map(r=>({backNo:r.dataset.back,rank:Number(r.value)}));
  }else{
    const needed=round==="quarter"?12:6;
    if(selected.size!==needed){message.textContent=`Select exactly ${needed}.`;message.className="message error";return}
    result=[...selected].sort(natural);
  }
  const payload={judge:judgeSelect.value,judgeName:JUDGES[judgeSelect.value]||judgeSelect.value,eventKey:eventSelect.value,eventLabel:eventSelect.selectedOptions[0].textContent,round,result,submittedAt:serverTimestamp()};
  await set(ref(db,`submissions/${roundKey()}/${judgeSelect.value}`),payload);
  message.textContent="SUBMITTED TO ADMIN";
  message.className="message";
}
document.getElementById("submitBtn").onclick=submit;
document.getElementById("resetBtn").onclick=render;
eventSelect.onchange=render;roundSelect.onchange=render;
judgeSelect.onchange=()=>{document.getElementById("judgeIdentity").textContent=`${judgeSelect.value} · ${JUDGES[judgeSelect.value]||""}`};
fetch("players.json").then(r=>r.json()).then(d=>{entries=d;eventSelect.innerHTML=uniqueEvents(d).map(e=>`<option value="${e.key}">${e.section} · ${e.event}</option>`).join("");render()});

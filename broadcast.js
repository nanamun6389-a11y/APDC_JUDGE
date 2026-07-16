import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig),db=getDatabase(app);
const rt=r=>r==="quarter"?"QUARTER FINAL":r==="semi"?"SEMI FINAL":r==="final"?"FINAL":String(r||"").toUpperCase();
onValue(ref(db,"activeEvent"),s=>{const a=s.val();if(!a)return;document.getElementById("broadcastNow").textContent=a.label||"";document.getElementById("broadcastRound").textContent=rt(a.round);const kr=a.round==="quarter"?"쿼터 파이널":a.round==="semi"?"세미 파이널":"파이널";document.getElementById("broadcastKo").textContent=`${a.label||""} ${kr}`;document.getElementById("broadcastEn").textContent=`${a.label||""} · ${rt(a.round)}`});
onValue(ref(db,"floorStatus"),s=>{const v=s.val()||{};document.getElementById("broadcastDeck").textContent=v.onDeck||"—";document.getElementById("broadcastNext").textContent=v.next||"—"});
onValue(ref(db,"sponsors"),s=>{const rows=Object.values(s.val()||{}).filter(x=>x.active!==false&&x.url),el=document.getElementById("sponsorCarousel");el.innerHTML=rows.length?rows.map(x=>`<div class="sponsor-item"><img src="${x.url}" alt="${x.name||"Sponsor"}"></div>`).join(""):'<div class="sponsor-placeholder">APDC</div>'});
function tick(){document.getElementById("broadcastClock").textContent=new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}tick();setInterval(tick,1000);

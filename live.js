import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const app=initializeApp(firebaseConfig);
const db=getDatabase(app);
const nowEl=document.getElementById("liveNow");
const deckEl=document.getElementById("liveOnDeck");
const nextEl=document.getElementById("liveNext");
const updatedEl=document.getElementById("liveUpdated");

onValue(ref(db,"floorStatus"),snap=>{
 const v=snap.val()||{};
 nowEl.textContent=v.now||"WAITING";
 deckEl.textContent=v.onDeck||"—";
 nextEl.textContent=v.next||"—";
 if(v.updatedAt){
  const d=new Date(v.updatedAt);
  updatedEl.textContent=`UPDATED ${d.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}`;
 }else updatedEl.textContent="";
});

export const encodeEventKey = key => btoa(unescape(encodeURIComponent(String(key||'')))).replaceAll('=','');

export function aggregateRecall(submissions, competitorBackNos, target){
  const rows=(competitorBackNos||[]).map(String).map(backNo=>({backNo,recalls:0}));
  const map=new Map(rows.map(r=>[r.backNo,r]));
  Object.values(submissions||{}).forEach(ballot=>{
    const picked=Array.isArray(ballot?.result)?ballot.result.map(String):[];
    new Set(picked).forEach(no=>{ if(map.has(no)) map.get(no).recalls += 1; });
  });
  rows.sort((a,b)=>b.recalls-a.recalls || a.backNo.localeCompare(b.backNo,undefined,{numeric:true}));
  const wanted=Math.min(Number(target)||rows.length,rows.length);
  if(!wanted) return {ranking:[],qualifiedBackNos:[],cutoffRecalls:0,tieAtCutoff:false};
  const cutoff=rows[Math.max(0,wanted-1)]?.recalls ?? 0;
  const qualified=rows.filter(r=>r.recalls>=cutoff).map(r=>r.backNo);
  return {ranking:rows,qualifiedBackNos:qualified,cutoffRecalls:cutoff,tieAtCutoff:qualified.length>wanted,target:wanted};
}

function markListFor(submissions, backNo){
  return Object.values(submissions||{}).map(ballot=>{
    const row=(Array.isArray(ballot?.result)?ballot.result:[]).find(x=>String(x?.backNo)===String(backNo));
    return Number(row?.rank)||999;
  }).filter(Number.isFinite);
}

function compareAtCutoff(a,b,cutoff){
  const am=a.marks.filter(x=>x<=cutoff), bm=b.marks.filter(x=>x<=cutoff);
  if(am.length!==bm.length) return bm.length-am.length;
  const as=am.reduce((s,x)=>s+x,0), bs=bm.reduce((s,x)=>s+x,0);
  if(as!==bs) return as-bs;
  return 0;
}

export function aggregateFinalSkating(submissions, competitorBackNos){
  const judges=Object.keys(submissions||{}).length;
  const majority=Math.floor(judges/2)+1;
  const pool=(competitorBackNos||[]).map(String).map(backNo=>({backNo,marks:markListFor(submissions,backNo)}));
  const placed=[]; const remaining=pool.slice();
  let place=1;
  while(remaining.length){
    let winner=null; let winnerCutoff=null;
    for(let cutoff=place;cutoff<=pool.length;cutoff++){
      const eligible=remaining.filter(c=>c.marks.filter(x=>x<=cutoff).length>=majority);
      if(!eligible.length) continue;
      eligible.sort((a,b)=>{
        let cmp=compareAtCutoff(a,b,cutoff);
        if(cmp) return cmp;
        for(let c=cutoff+1;c<=pool.length;c++){cmp=compareAtCutoff(a,b,c); if(cmp) return cmp;}
        const at=a.marks.reduce((s,x)=>s+x,0), bt=b.marks.reduce((s,x)=>s+x,0);
        return at-bt || a.backNo.localeCompare(b.backNo,undefined,{numeric:true});
      });
      winner=eligible[0]; winnerCutoff=cutoff; break;
    }
    if(!winner){
      remaining.sort((a,b)=>a.marks.reduce((s,x)=>s+x,0)-b.marks.reduce((s,x)=>s+x,0) || a.backNo.localeCompare(b.backNo,undefined,{numeric:true}));
      winner=remaining[0]; winnerCutoff=pool.length;
    }
    const qualifying=winner.marks.filter(x=>x<=winnerCutoff);
    placed.push({place,backNo:winner.backNo,marks:winner.marks,majorityCount:qualifying.length,majoritySum:qualifying.reduce((s,x)=>s+x,0),total:winner.marks.reduce((s,x)=>s+x,0)});
    remaining.splice(remaining.indexOf(winner),1); place++;
  }
  return {ranking:placed,majority,judgeCount:judges};
}

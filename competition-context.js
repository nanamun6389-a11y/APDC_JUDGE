const LEGACY_ID = '2026-apdc';
const KEY = 'apdc-active-competition-v2';

function safeId(value){
  return String(value||'').trim().toLowerCase()
    .replace(/[^a-z0-9가-힣_-]+/g,'-')
    .replace(/^-+|-+$/g,'') || LEGACY_ID;
}

const qs = new URL(location.href).searchParams;
const queryId = qs.get('competition');
if(queryId){ localStorage.setItem(KEY, safeId(queryId)); }

export const competitionId = safeId(queryId || localStorage.getItem(KEY) || LEGACY_ID);
export const isLegacyCompetition = competitionId === LEGACY_ID;
export const competitionPath = (path='') => {
  const clean=String(path).replace(/^\/+/, '');
  return isLegacyCompetition ? clean : `competitions/${competitionId}/${clean}`;
};
export const competitionUrl = (page, extra={}) => {
  const u=new URL(page, location.href);
  if(!isLegacyCompetition)u.searchParams.set('competition', competitionId);
  Object.entries(extra).forEach(([k,v])=>v!==undefined&&v!==null&&u.searchParams.set(k,v));
  return u.href;
};
export function setActiveCompetition(id){
  const clean=safeId(id); localStorage.setItem(KEY,clean); return clean;
}
export function activeCompetitionLabel(){ return isLegacyCompetition ? '2026 APDC · LEGACY' : competitionId; }

export function getActiveCompetition(){ return competitionId; }

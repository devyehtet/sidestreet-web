export const AD_CONSENT_VERSION='reach-audience-2026-11-v1';
export const GENDER_OPTIONS=[['all','Prefer not to say'],['male','Male'],['female','Female']];
export const AGE_OPTIONS=[['all','Prefer not to say'],['18-25','18–25'],['26-35','26–35'],['36-50','36–50']];
export const emptyAdPreference={choice:'unset',gender:'all',ageGroup:'all',expiresAt:null};
export function cohortDescription(p){const gender=GENDER_OPTIONS.find(([v])=>v===p.gender)?.[1],age=AGE_OPTIONS.find(([v])=>v===p.ageGroup)?.[1];return [p.gender!=='all'?gender:null,p.ageGroup!=='all'?'Age '+age:null].filter(Boolean).join(' · ');}

export const AD_LEARNING_NOTICE='reach-model-2026-11-v1';
export const LEARNING_CATEGORIES=['food','travel','hotels','music','things'];
export function pageLearningCategory(pathname,pages={}){const category=pages[pathname];return LEARNING_CATEGORIES.includes(category)?category:null;}

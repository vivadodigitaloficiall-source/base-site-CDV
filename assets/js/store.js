// store.js - cache local (localStorage) e estado em memória leve

const LS_KEYS = {
	THEME: 'theme',
	PROFILE: 'profile',
	PROGRESS: 'progress',
};

const memory = {
	profile: null,
	progress: null,
};

export function getTheme(){
	return localStorage.getItem(LS_KEYS.THEME) || '';
}
export function setTheme(val){
	localStorage.setItem(LS_KEYS.THEME, val || '');
	document.documentElement.dataset.theme = val || '';
}

export function getProfile(){
	if(memory.profile) return memory.profile;
	const raw = localStorage.getItem(LS_KEYS.PROFILE);
	if(!raw) return null;
	try { memory.profile = JSON.parse(raw); return memory.profile; } catch { return null; }
}
export function setProfile(p){
	memory.profile = p; localStorage.setItem(LS_KEYS.PROFILE, JSON.stringify(p));
}

export function getProgress(){
	if(memory.progress) return memory.progress;
	const raw = localStorage.getItem(LS_KEYS.PROGRESS);
	if(!raw) return { courses: {}, streak: 0, xp: 0 };
	try { memory.progress = JSON.parse(raw); return memory.progress; } catch { return { courses: {}, streak:0, xp:0 }; }
}
export function setProgress(p){
	memory.progress = p; localStorage.setItem(LS_KEYS.PROGRESS, JSON.stringify(p));
}

export function updateProgress(partial){
	const current = getProgress();
	const next = { ...current, ...partial };
	setProgress(next); return next;
}

export function clearAll(){
	Object.values(LS_KEYS).forEach(k=>localStorage.removeItem(k));
	memory.profile = null; memory.progress = null;
}
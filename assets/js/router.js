// router.js - hash router simples com eventos
import { track } from './analytics.js';

const listeners = [];
export function onRouteChange(fn){listeners.push(fn);} 

export function getCurrentRoute(){
	const hash = location.hash || '#/dashboard';
	const path = hash.slice(1); // /dashboard
	const [full, queryStr] = path.split('?');
	const segments = full.split('/').filter(Boolean);
	const query = Object.fromEntries(new URLSearchParams(queryStr||''));
	return { path: '/'+(segments[0]||'dashboard'), segments, query, full: '/'+segments.join('/') };
}

function emit(){
	const route=getCurrentRoute();
	listeners.forEach(fn=>fn(route));
	track('route_change',{path:route.full});
}

window.addEventListener('hashchange', emit);
if(document.readyState!=='loading') emit(); else document.addEventListener('DOMContentLoaded', emit);

// Navegação programática
export function go(path){
	if(!path.startsWith('#')) path='#'+path;
	location.hash=path;
}
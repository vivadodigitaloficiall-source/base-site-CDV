// analytics.js - camada de eventos simplificada
window.dataLayer = window.dataLayer || [];

export function track(event, data={}){
	window.dataLayer.push({ event, ts: Date.now(), ...data });
	if(import.meta.env?.DEV) console.log('[track]', event, data);
}

// Pageview inicial
track('page_view',{ path: location.pathname+location.hash });
window.addEventListener('hashchange',()=>track('page_view',{ path: location.pathname+location.hash }));
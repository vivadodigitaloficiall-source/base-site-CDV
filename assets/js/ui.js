// ui.js - utilidades de interface
import { getTheme, setTheme } from './store.js';

const toastRoot = () => document.getElementById('toast-root') || createToastRoot();
function createToastRoot(){
	const div=document.createElement('div');div.id='toast-root';div.setAttribute('aria-live','polite');div.setAttribute('aria-atomic','true');document.body.appendChild(div);return div;
}

export function toast(message, type='info', opts={}){
	const root=toastRoot();
	const el=document.createElement('div');
	el.className='toast '+type; el.role='status';
	el.innerHTML=`<div class='msg'>${message}</div>`;
	root.appendChild(el);
	setTimeout(()=>{el.classList.add('fade-out');el.addEventListener('animationend',()=>el.remove(),{once:true});}, opts.duration || 4200);
	return el;
}

// Modal
let activeModal=null;let lastFocus=null;
export function openModal({title='',content='',actions=[],description=''}){
	closeModal();
	lastFocus = document.activeElement;
	const backdrop=document.createElement('div');backdrop.className='modal-backdrop';
	backdrop.innerHTML=`<div class='modal' role='dialog' aria-modal='true' aria-labelledby='modalTitle' ${description?'aria-describedby="modalDesc"':''}>
		<div tabindex="0" aria-hidden="true" class="focus-sentinel"></div>
		<header><h3 id='modalTitle'>${title}</h3><button class='close-btn' aria-label='Fechar modal' data-close>&times;</button></header>
		${description?`<p id='modalDesc' class='text-muted' style='margin-top:-.25rem;font-size:var(--font-size-xs);'>${description}</p>`:''}
		<div class='modal-content'>${typeof content==='string'?content:''}</div>
		<div class='modal-actions cluster' style='justify-content:flex-end;'>${actions.map(a=>`<button class='btn ${a.variant||'btn-ghost'}' data-action='${a.id}'>${a.label}</button>`).join('')}</div>
		<div tabindex="0" aria-hidden="true" class="focus-sentinel"></div>
	</div>`;
	document.body.appendChild(backdrop); activeModal=backdrop;
	backdrop.addEventListener('click',e=>{if(e.target===backdrop) closeModal();});
	backdrop.querySelector('[data-close]')?.addEventListener('click',()=>closeModal());
	actions.forEach(a=>{backdrop.querySelector(`[data-action='${a.id}']`)?.addEventListener('click',()=>{a.onClick?.({close:closeModal});});});
	trapFocus(backdrop.querySelector('.modal'));
	backdrop.addEventListener('keydown',e=>{if(e.key==='Escape') {e.stopPropagation();closeModal();}});
	return backdrop;
}
export function closeModal(){ if(activeModal){activeModal.remove();activeModal=null; if(lastFocus) lastFocus.focus();}}

function trapFocus(root){
	const focusable=[...root.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled && el.offsetParent!==null);
	if(focusable.length) focusable[0].focus();
	function handler(e){ if(e.key==='Tab'){ const idx=focusable.indexOf(document.activeElement); if(e.shiftKey){ if(idx===0){focusable[focusable.length-1].focus(); e.preventDefault();}} else { if(idx===focusable.length-1){focusable[0].focus(); e.preventDefault();}}}}
	root.addEventListener('keydown',handler);
}

// Theme toggle util
export function toggleTheme(){
	const current=getTheme();
	const next=current==='light'?'':'light';
	setTheme(next);
	document.documentElement.classList.add('theme-transition');
	setTimeout(()=>document.documentElement.classList.remove('theme-transition'),400);
}

// Loading skeleton util
export function skeleton(height=120){
	const div=document.createElement('div');div.className='skeleton';div.style.height=height+'px';div.style.borderRadius='var(--radius-lg)';return div;
}

// Accessible update region
export function liveAnnounce(msg){
	let region=document.getElementById('live-region');
	if(!region){region=document.createElement('div');region.id='live-region';region.className='sr-only';region.setAttribute('aria-live','polite');region.setAttribute('aria-atomic','true');document.body.appendChild(region);} 
	region.textContent=''; setTimeout(()=>region.textContent=msg,50);
}

// Init theme on import (idempotent)
if(!document.documentElement.dataset.theme){
	document.documentElement.dataset.theme=getTheme();
}
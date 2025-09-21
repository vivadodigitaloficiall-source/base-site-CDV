import { requireAuth } from '../auth.js';
import { track } from '../analytics.js';
import { updateProgress, getProgress } from '../store.js';

async function loadDesafios(){return fetch('assets/data/desafios.json').then(r=>r.json());}

export async function render(root){
	const user=requireAuth();
	track('page_view',{page:'desafios'});
	const desafios=await loadDesafios();
	const order=['bronze','prata','ouro','diamante'];
	const userLevel=user.claims.level;
	const prog=getProgress();
	prog.challenges = prog.challenges || [];
	root.innerHTML=`<h1>Desafios</h1><p class='text-muted'>Atividades de foco para reforçar consistência e gerar XP adicional.</p><div class='grid grid-auto-fit' style='margin-top:1.25rem;' id='desafiosGrid'></div>`;
	const grid=root.querySelector('#desafiosGrid');
	desafios.forEach(d=>{
		const locked=order.indexOf(userLevel)<order.indexOf(d.nivelMinimo);
		const joined=prog.challenges.includes(d.id);
		const prazo=new Date(d.prazo).toLocaleDateString('pt-BR');
		const card=document.createElement('article');card.className='card';
		card.innerHTML=`<div class='card-header'><h3 class='card-title' style='font-size:var(--font-size-sm);'>${d.titulo}</h3><span style='font-size:var(--font-size-xs);color:var(--muted);'>Prazo ${prazo}</span></div><div class='cluster' style='justify-content:space-between;font-size:var(--font-size-xs);'><span>${d.xp} XP</span><span class='badge level-${d.nivelMinimo}'>${d.nivelMinimo}</span></div><button class='btn-ghost' data-id='${d.id}' ${locked?'data-locked=1':''}>${locked?'Upgrade':(joined?'Participando':'Participar')}</button>`;
		if(locked) card.innerHTML+="<div class='locked-overlay'>Nível "+d.nivelMinimo+"</div>";
		grid.appendChild(card);
	});
	grid.addEventListener('click',e=>{
		const btn=e.target.closest('button[data-id]');if(!btn) return;const id=btn.getAttribute('data-id');const locked=btn.hasAttribute('data-locked');
		if(locked){track('upgrade_intent',{context:'desafio'});location.hash='#/configuracoes';return;}
		const prog2=getProgress();prog2.challenges = prog2.challenges || [];
		if(!prog2.challenges.includes(id)){prog2.challenges.push(id);updateProgress(prog2);track('challenge_join',{id});btn.textContent='Participando';}
	});
}
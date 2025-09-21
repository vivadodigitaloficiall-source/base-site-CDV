import { requireAuth } from '../auth.js';
import { track } from '../analytics.js';

async function loadMateriais(){return fetch('assets/data/materiais.json').then(r=>r.json());}

export async function render(root){
	const user = requireAuth();
	track('page_view',{page:'materiais'});
	const mats = await loadMateriais();
	const order=['bronze','prata','ouro','diamante'];
	const userLevel=user.claims.level;
	root.innerHTML=`<h1>Materiais</h1><div class='chips' id='filtros'><div class='chip active' data-tipo='all'>Todos</div><div class='chip' data-tipo='pdf'>PDF</div><div class='chip' data-tipo='planilha'>Planilhas</div></div><div class='grid grid-auto-fit' style='margin-top:1.25rem;' id='matGrid'></div>`;
	const grid=root.querySelector('#matGrid');
	function draw(tipo='all'){
		grid.innerHTML='';
		mats.filter(m=>tipo==='all'||m.tipo===tipo).forEach(m=>{
			const locked=order.indexOf(userLevel)<order.indexOf(m.nivelMinimo);
			const card=document.createElement('article');card.className='card';
			card.innerHTML=`<h3 style='font-size:var(--font-size-sm);'>${m.titulo}</h3><p class='text-muted' style='font-size:var(--font-size-xs);'>${m.descricao}</p><div class='cluster' style='justify-content:space-between;font-size:var(--font-size-xs);'><span class='badge level-${m.nivelMinimo}'>${m.nivelMinimo}</span><span>${m.tipo}</span></div><button class='btn-ghost' data-id='${m.id}' ${locked?'data-locked=1':''}>${locked?'Upgrade':'Baixar'}</button>`;
			if(locked) card.innerHTML += `<div class='locked-overlay'>Nível ${m.nivelMinimo}</div>`;
			grid.appendChild(card);
		});
	}
	draw();
	root.querySelector('#filtros').addEventListener('click',e=>{const c=e.target.closest('.chip');if(!c) return;[...root.querySelectorAll('.chip')].forEach(x=>x.classList.toggle('active',x===c));draw(c.dataset.tipo);});
	grid.addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(!b) return;const locked=b.hasAttribute('data-locked');if(locked){track('upgrade_intent',{context:'material'});location.hash='#/configuracoes';return;} track('material_download',{id:b.getAttribute('data-id')});b.textContent='Baixado';});
}
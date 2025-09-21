import { requireAuth } from '../auth.js';
import { track } from '../analytics.js';

async function loadCursos(){
	const res = await fetch('docs/assets/data/cursos.json');
	return res.json();
}

export async function render(root){
	const user = requireAuth();
	track('page_view',{page:'cursos'});
	const cursos = await loadCursos();
	const order=['bronze','prata','ouro','diamante'];
	const userLevel = user.claims.level;
	root.innerHTML = `<h1>Cursos</h1><p class='text-muted'>Catálogo filtrado pelo seu nível (<strong>${userLevel}</strong>).</p><div class='grid grid-auto-fit' id='cursosGrid' style='margin-top:1.25rem;'></div>`;
	const grid = root.querySelector('#cursosGrid');
	cursos.forEach(c=>{
		const locked = order.indexOf(userLevel) < order.indexOf(c.nivelMinimo);
		const div=document.createElement('article');
		div.className='card hover-raise';
		div.innerHTML=`<div style='display:flex;flex-direction:column;gap:.6rem;'>
			<div style='aspect-ratio:16/9;background:var(--surface-alt);border:1px solid var(--border);border-radius:var(--radius-md);position:relative;overflow:hidden;'>
				<img src='${c.capa||''}' alt='Capa ${c.titulo}' loading='lazy' style='width:100%;height:100%;object-fit:cover;'>
				${locked?`<div class='locked-overlay'>Nível ${c.nivelMinimo}</div>`:''}
			</div>
			<h3 style='font-size:var(--font-size-md);'>${c.titulo}</h3>
			<p class='text-muted' style='font-size:var(--font-size-xs);'>${c.descricao}</p>
			<div class='cluster' style='justify-content:space-between;font-size:var(--font-size-xs);'><span class='badge level-${c.nivelMinimo}'>${c.nivelMinimo}</span><span>${c.xp} XP</span></div>
			<button class='btn ${locked?'btn-ghost':'btn'}' data-id='${c.id}' ${locked?'data-locked=1':''}>${locked?'Upgrade':'Acessar'}</button>
		</div>`;
		grid.appendChild(div);
	});
	grid.addEventListener('click',e=>{
		const btn=e.target.closest('button[data-id]');
		if(!btn) return;
		const id=btn.getAttribute('data-id');
		const locked=btn.hasAttribute('data-locked');
		if(locked){track('upgrade_intent',{context:'curso_card'});location.hash='#/configuracoes';return;}
		track('course_start',{id});
		location.hash='#/curso?c='+id;
	});
}
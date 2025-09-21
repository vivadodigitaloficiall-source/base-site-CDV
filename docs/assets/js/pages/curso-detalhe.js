import { requireAuth, requireLevel } from '../auth.js';
import { track } from '../analytics.js';
import { updateProgress, getProgress } from '../store.js';

async function loadCursos(){return fetch('docs/assets/data/cursos.json').then(r=>r.json());}
async function loadModulos(){return fetch('docs/assets/data/modulos-exemplo.json').then(r=>r.json());}

export async function render(root){
	const user=requireAuth();
	const params=new URLSearchParams(location.hash.split('?')[1]);
	const cursoId=params.get('c');
	if(!cursoId){root.innerHTML='<p>Curso não especificado.</p>';return;}
	const [cursos,modolos] = await Promise.all([loadCursos(),loadModulos()]);
	const curso=cursos.find(c=>c.id===cursoId);
	if(!curso){root.innerHTML='<p>Curso não encontrado.</p>';return;}
	// Guard de nível
	try { requireLevel(curso.nivelMinimo); } catch { root.innerHTML='<p>Conteúdo bloqueado.</p>'; return; }
	track('page_view',{page:'curso_detalhe',id:cursoId});
	const mods=modolos.find(m=>m.cursoId===cursoId)?.modulos||[];
	const progress=getProgress();
	const courseProg=progress.courses?.[cursoId]||{ completed:[] };
	const pct = (courseProg.completed.length / Math.max(mods.length,1))*100;
	root.innerHTML=`<div class='breadcrumbs'><a href='#/cursos'>Cursos</a> / <span>${curso.titulo}</span></div>
		<h1>${curso.titulo}</h1>
		<p class='text-muted' style='max-width:70ch;'>${curso.descricao}</p>
		<div class='progress' style='margin:1rem 0;' aria-label='Progresso do curso'><span style='width:${pct}%'></span></div>
		<div class='grid' style='gap:1rem;margin-top:1.25rem;'>
			${mods.map(m=>`<div class='card' data-mod='${m.id}'>
				<div class='card-header'><h3 class='card-title' style='font-size:var(--font-size-sm);'>${m.titulo}</h3><span style='font-size:var(--font-size-xs);color:var(--muted);'>${m.duracao}</span></div>
				<p class='text-muted' style='font-size:var(--font-size-xs);'>XP ${m.xp}</p>
				<button class='btn-ghost' data-play='${m.id}' ${courseProg.completed.includes(m.id)?'disabled':''}>${courseProg.completed.includes(m.id)?'Concluído':'Assistir'}</button>
			</div>`).join('')}
		</div>`;
	root.addEventListener('click',e=>{
		const btn=e.target.closest('button[data-play]');
		if(!btn) return; const mid=btn.getAttribute('data-play');
		const prog = getProgress();
		prog.courses = prog.courses || {}; prog.courses[cursoId]=prog.courses[cursoId]||{completed:[]};
		if(!prog.courses[cursoId].completed.includes(mid)) prog.courses[cursoId].completed.push(mid);
		prog.xp = (prog.xp||0) + (mods.find(m=>m.id===mid)?.xp||0);
		updateProgress(prog);
		track('course_module_complete',{curso:cursoId,modulo:mid});
		render(root); // re-render
	});
}
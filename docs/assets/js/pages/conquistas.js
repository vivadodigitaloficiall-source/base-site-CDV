// conquistas page stub
import { requireAuth } from '../auth.js';
import { track } from '../analytics.js';
import { getProgress } from '../store.js';

async function loadConquistas(){return fetch('assets/data/conquistas.json').then(r=>r.json());}
async function loadModulos(){return fetch('assets/data/modulos-exemplo.json').then(r=>r.json());}

function compute(progress, conquistas, modData){
	const completedCourses = Object.entries(progress.courses || {}).filter(([cid, cdata])=>{
		const mods = modData.find(m=>m.cursoId===cid)?.modulos||[];
		return cdata.completed?.length === mods.length && mods.length>0;
	}).length;
	return conquistas.map(c=>{
		let unlocked=false;
		if(c.id==='a1') unlocked = completedCourses>=1;
		else if(c.id==='a2') unlocked = (progress.streak||0)>=7;
		else if(c.id==='a3') unlocked = (progress.xp||0)>=1000;
		else if(c.id==='a4') unlocked = completedCourses>=3;
		return {...c, unlocked};
	});
}

export async function render(root){
	requireAuth();
	track('page_view',{page:'conquistas'});
	const [conqs,mods] = await Promise.all([loadConquistas(),loadModulos()]);
	const progress=getProgress();
	const lista=compute(progress,conqs,mods);
	root.innerHTML=`<h1>Conquistas</h1><p class='text-muted'>Badges que refletem milestones reais da sua evolução.</p><div class='badges-grid' style='margin-top:1.25rem;'>${lista.map(a=>`<div class='achievement ${a.unlocked?'':'locked'}' title='${a.criterio}'><div class='icon'>${a.icone}</div><strong style='font-size:var(--font-size-xs);'>${a.nome}</strong><small class='text-muted' style='font-size:var(--font-size-xxs);'>${a.unlocked?'Desbloqueada':'Bloqueada'}</small></div>`).join('')}</div>`;
}
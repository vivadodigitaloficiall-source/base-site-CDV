// perfil page
import { requireAuth } from '../auth.js';
import { track } from '../analytics.js';
import { getProgress } from '../store.js';
import { recomendarCursos } from '../ai.js';

async function loadConquistas(){return fetch('assets/data/conquistas.json').then(r=>r.json());}
async function loadModulos(){return fetch('assets/data/modulos-exemplo.json').then(r=>r.json());}
async function loadCursos(){return fetch('assets/data/cursos.json').then(r=>r.json());}

export async function render(root){
	const user=requireAuth();
	track('page_view',{page:'perfil'});
	const progress=getProgress();
	const [mods,cursos,conqs] = await Promise.all([loadModulos(),loadCursos(),loadConquistas()]);
	const ai = await recomendarCursos(user);
	const completedCourses = Object.entries(progress.courses||{}).filter(([cid,cdata])=>{
		const m = mods.find(mm=>mm.cursoId===cid)?.modulos||[];return m.length>0 && cdata.completed?.length===m.length;}).map(([cid])=>cid);
	const achievementsUnlocked = conqs.filter(c=>{
		if(c.id==='a1') return completedCourses.length>=1;
		if(c.id==='a2') return (progress.streak||0)>=7;
		if(c.id==='a3') return (progress.xp||0)>=1000;
		if(c.id==='a4') return completedCourses.length>=3; return false; });
	root.innerHTML=`<h1>Perfil</h1><section class='card'><div class='cluster' style='justify-content:space-between;align-items:center;'><div class='cluster' style='gap:.85rem;'><div class='avatar lg'>${(user.displayName||user.email)[0]||'U'}</div><div><strong>${user.displayName||user.email}</strong><br><span class='badge level-${user.claims.level}'>${user.claims.level}</span></div></div><div style='text-align:right;font-size:var(--font-size-xs);'>XP: ${(progress.xp||0)}<br>Streak: ${(progress.streak||0)} dias</div></div></section>
		<div class='tabs' style='margin-top:1.25rem;'>
			<div class='tab-list'>
				<button id='tab-trilhas' aria-selected='true'>Minhas Trilhas</button>
				<button id='tab-conquistas' aria-selected='false'>Conquistas</button>
				<button id='tab-certificados' aria-selected='false'>Certificados</button>
				<button id='tab-preferencias' aria-selected='false'>Preferências</button>
			</div>
			<div class='tab-panels'>
				<div class='tab-panel active' aria-labelledby='tab-trilhas'>${cursos.slice(0,6).map(c=>`<div class='card' style='margin-bottom:.75rem;'><strong style='font-size:var(--font-size-sm);'>${c.titulo}</strong><div class='progress' style='margin-top:.5rem;'> <span style='width:${(()=>{const pr=progress.courses?.[c.id];const modsCount=mods.find(m=>m.cursoId===c.id)?.modulos.length||1;return pr? (pr.completed.length/modsCount)*100:0;})()}%'></span></div></div>`).join('')}</div>
				<div class='tab-panel' aria-labelledby='tab-conquistas'><div class='badges-grid'>${achievementsUnlocked.length?achievementsUnlocked.map(a=>`<div class='achievement'><div class='icon'>${a.icone}</div><strong style='font-size:var(--font-size-xs);'>${a.nome}</strong></div>`).join(''):'<p class="text-muted" style="font-size:var(--font-size-xs);">Nenhuma conquista ainda.</p>'}</div></div>
				<div class='tab-panel' aria-labelledby='tab-certificados'>${completedCourses.length?completedCourses.map(cid=>`<div class='certificate-card'><header><strong style='font-size:var(--font-size-sm);'>Curso ${cid}</strong></header><button class='btn-ghost' onclick="location.hash='#/certificados'">Gerar</button></div>`).join(''):'<p class="text-muted" style="font-size:var(--font-size-xs);">Conclua cursos para liberar certificados.</p>'}</div>
				<div class='tab-panel' aria-labelledby='tab-preferencias'><p class='text-muted' style='font-size:var(--font-size-xs);'>Configure tema e notificações em <a href='#/configuracoes'>Configurações</a>.</p><h3 style='font-size:var(--font-size-sm);margin-top:1rem;'>Sugestões AI</h3>${ai.data.map(s=>`<div class='card' style='margin-top:.5rem;'><strong style='font-size:var(--font-size-xs);'>${s.titulo}</strong><p class='text-muted' style='font-size:var(--font-size-xxs);'>${s.motivo}</p></div>`).join('')}</div>
			</div>
		</div>`;
}
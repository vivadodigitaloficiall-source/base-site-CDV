import { requireAuth } from '../auth.js';
import { recomendarCursos } from '../ai.js';
import { getProgress } from '../store.js';
import { track } from '../analytics.js';

export async function render(root){
	const user = requireAuth();
	track('page_view',{page:'dashboard'});
	const progress = getProgress();
	const ai = await recomendarCursos(user);
	root.innerHTML = `
		<h1 style="display:flex;align-items:center;gap:.6rem;">Olá, <span>${user.displayName||user.email}</span> <span class="badge level-${user.claims.level}">${user.claims.level}</span></h1>
		<p class="text-muted" style="margin-top:.35rem;max-width:60ch;">Aqui está um panorama rápido da sua evolução e sugestões focadas no seu nível.</p>
		<div class="widget-grid">
			<div class="card hover-raise"><div class="card-header"><h3 class="card-title">Progresso</h3></div><div class="progress" aria-label="XP ${(progress.xp||0)}"><span style="width:${Math.min(100,(progress.xp||0)/35)}%"></span></div><small class="text-muted">XP total: ${(progress.xp||0)} — Streak: ${(progress.streak||0)} dias</small></div>
			<div class="card"><div class="card-header"><h3 class="card-title">Sugestões</h3></div>${ai.data.map(c=>`<div style='display:flex;flex-direction:column;gap:.25rem;font-size:var(--font-size-xs);margin-bottom:.5rem;'><strong>${c.titulo}</strong><span class='text-muted'>${c.motivo}</span></div>`).join('')}<button class="btn-ghost" onclick="location.hash='#/cursos'">Ver cursos</button></div>
			<div class="card"><div class="card-header"><h3 class="card-title">Desafios</h3></div><p class="text-muted" style="font-size:var(--font-size-xs);">Participe de um desafio esta semana para garantir streak.</p><button class="btn-ghost" onclick="location.hash='#/desafios'">Ver desafios</button></div>
			<div class="card"><div class="card-header"><h3 class="card-title">Materiais Recentes</h3></div><p class="text-muted" style="font-size:var(--font-size-xs);">Acesse templates de alto impacto.</p><button class="btn-ghost" onclick="location.hash='#/materiais'">Explorar materiais</button></div>
		</div>
	`;
}
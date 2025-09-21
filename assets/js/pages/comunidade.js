// comunidade page
import { requireAuth } from '../auth.js';
import { track } from '../analytics.js';

export async function render(root){
	requireAuth();
	track('page_view',{page:'comunidade'});
	const links=[
		{nome:'WhatsApp', url:'https://chat.whatsapp.com/exemplo', desc:'Canal rápido de avisos',icon:'💬'},
		{nome:'Telegram', url:'https://t.me/exemplo', desc:'Discussões estruturadas',icon:'📣'},
		{nome:'Discord', url:'https://discord.gg/exemplo', desc:'Salas temáticas e voz',icon:'🧩'}
	];
	root.innerHTML=`<h1>Comunidade</h1><p class='text-muted'>Espaços moderados para networking e troca de conhecimento.</p><div class='grid grid-auto-fit' style='margin-top:1.25rem;'>${links.map(l=>`<div class='card'><h3 style='font-size:var(--font-size-sm);'>${l.icon} ${l.nome}</h3><p class='text-muted' style='font-size:var(--font-size-xs);'>${l.desc}</p><a class='btn-ghost' href='${l.url}' target='_blank' rel='noopener' data-ext='${l.nome}'>Entrar</a></div>`).join('')}</div><div class='card' style='margin-top:1.25rem;'><h3 style='font-size:var(--font-size-sm);'>Boas Práticas</h3><ul style='font-size:var(--font-size-xs);margin-left:1rem;list-style:disc;'><li>Respeito e objetividade.</li><li>Sem divulgação não solicitada.</li><li>Compartilhe resultados com contexto.</li></ul></div>`;
	root.addEventListener('click',e=>{const a=e.target.closest('a[data-ext]');if(a) track('cta_click',{id:'comunidade_'+a.dataset.ext});});
}
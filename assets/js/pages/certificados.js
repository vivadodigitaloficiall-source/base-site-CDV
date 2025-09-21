// certificados page stub
import { requireAuth, requireLevel } from '../auth.js';
import { track } from '../analytics.js';
import { getProgress } from '../store.js';

async function loadCursos(){return fetch('assets/data/cursos.json').then(r=>r.json());}
async function loadModulos(){return fetch('assets/data/modulos-exemplo.json').then(r=>r.json());}

export async function render(root){
	const user= requireAuth();
	// Gating: geração de certificados apenas para nível Ouro+
	let gated=false;
	try { requireLevel('ouro'); } catch(e){ gated=true; }
	track('page_view',{page:'certificados',gated});
	const [cursos,mods] = await Promise.all([loadCursos(),loadModulos()]);
	const progress=getProgress();
	progress.courses=progress.courses||{};
	const elegiveis=cursos.filter(c=>{
		const m=mods.find(m=>m.cursoId===c.id)?.modulos||[];
		const done=progress.courses[c.id]?.completed||[];
		return m.length>0 && done.length===m.length; // concluído 100%
	});
	root.innerHTML=`<h1>Certificados</h1><p class='text-muted'>Gere certificados verificáveis para cursos concluídos.${gated?" <strong>(Requer nível Ouro+)</strong>":''}</p><div class='grid grid-auto-fit' style='margin-top:1.25rem;' id='certGrid'>${elegiveis.length?elegiveis.map(c=>`<div class='certificate-card'><header><strong style='font-size:var(--font-size-sm);'>${c.titulo}</strong><span>${c.xp} XP</span></header><small class='text-muted' style='font-size:var(--font-size-xxs);'>Conclusão verificada</small><button class='btn-ghost' data-cert='${c.id}' ${gated?'disabled':''}>Gerar PDF</button></div>`).join(''):`<p>Nenhum curso concluído 100% ainda.</p>`}</div>${gated?"<div class='card' style='margin-top:1.25rem;'><h3 class='card-title' style='font-size:var(--font-size-sm);'>Liberar Certificados</h3><p class='text-muted' style='font-size:var(--font-size-xs);'>Faça upgrade para Ouro para gerar certificados oficiais.</p><button class='btn' id='ctaUpgradeCert'>Fazer Upgrade</button></div>":''}`;
	if(gated){ root.querySelector('#ctaUpgradeCert')?.addEventListener('click',()=>track('upgrade_intent',{feature:'certificados'})); }
	root.addEventListener('click',e=>{
		const btn=e.target.closest('button[data-cert]');if(!btn) return;const id=btn.getAttribute('data-cert');
		generateCertificate(id).catch(()=>{});
	});
}

async function generateCertificate(cursoId){
	track('certificate_generate',{curso:cursoId});
	// Attempt jsPDF dynamic load
	let jsPDF=null;
	try {
		if(!window.jspdf){await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');}
		jsPDF=window.jspdf?.jsPDF;
	} catch { /* fallback */ }
	const hash = crypto.randomUUID?.().replace(/-/g,'').slice(0,16) || (Date.now().toString(16));
	const user = requireAuth();
	const date = new Date().toLocaleDateString('pt-BR');
	const title = 'Certificado de Conclusão';
	if(jsPDF){
		const doc = new jsPDF({orientation:'landscape'});
		doc.setFontSize(24); doc.text(title, 20, 30);
		doc.setFontSize(14); doc.text(`Conferido a: ${user.displayName||user.email}`,20,50);
		doc.text(`Curso: ${cursoId}`,20,62);
		doc.text(`Data: ${date}`,20,74);
		doc.setFontSize(10); doc.text(`Código verificação: ${hash}`,20,86);
		doc.setDrawColor(91,140,255); doc.setLineWidth(1.5); doc.line(20,90,270,90);
		doc.save(`certificado-${cursoId}.pdf`);
	} else {
		const w=window.open('about:blank','_blank');
		w.document.write(`<h1>${title}</h1><p>Conferido a: ${user.displayName||user.email}</p><p>Curso: ${cursoId}</p><p>Data: ${date}</p><p>Código: ${hash}</p><p>(Versão simplificada; jsPDF indisponível)</p>`);
		w.document.close();
	}
}
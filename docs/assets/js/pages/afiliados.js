// afiliados page stub
import { requireAuth, requireLevel } from '../auth.js';
import { track } from '../analytics.js';

function affiliateCode(uid){
	return btoa(uid).replace(/[^a-zA-Z0-9]/g,'').slice(0,10);
}

export async function render(root){
	const user=requireAuth();
	let locked=false;try{requireLevel('prata');}catch(e){locked=true;}
	track('page_view',{page:'afiliados',locked});
	const base=location.origin || 'https://codigodevendasvip.com.br';
	let linkUI='';
	if(!locked){
		const code=affiliateCode(user.uid);
		const link=`${base}/?ref=${code}`;
		linkUI=`<div class='card' style='margin-top:1rem;'><h3 class='card-title' style='font-size:var(--font-size-sm);'>Seu Link</h3><code style='user-select:all;'>${link}</code><button class='btn-ghost' id='copyLink'>Copiar</button></div>`;
		root.addEventListener('click',e=>{if(e.target.id==='copyLink'){navigator.clipboard.writeText(link);e.target.textContent='Copiado';track('cta_click',{id:'copy_affiliate'});}});
	} else {
		linkUI=`<div class='card' style='margin-top:1rem;'><h3 class='card-title' style='font-size:var(--font-size-sm);'>Programa de Afiliados</h3><p class='text-muted' style='font-size:var(--font-size-xs);'>Requer nível Prata+. Faça upgrade para gerar seu link exclusivo.</p><button class='btn' id='ctaUpgradeAfiliados'>Fazer Upgrade</button></div>`;
	}
	root.innerHTML=`<h1>Afiliados</h1><p class='text-muted'>Divulgue e receba comissão por novos membros qualificados.${locked?" <strong>(Prata+)</strong>":''}</p>${linkUI}<div class='card'><h3 class='card-title' style='font-size:var(--font-size-sm);'>Diretrizes</h3><ul style='font-size:var(--font-size-xs);line-height:1.5;margin-left:1rem;list-style:disc;'><li>Sem spam ou promessas enganosas.</li><li>Use materiais oficiais.</li><li>Transparência sobre sua relação de afiliado.</li></ul></div>`;
	if(locked){root.querySelector('#ctaUpgradeAfiliados')?.addEventListener('click',()=>track('upgrade_intent',{feature:'afiliados'}));}
}
import { requireAuth, requireLevel } from '../auth.js';
import { track } from '../analytics.js';

export async function render(root){
	const user=requireAuth();
	let utmLocked=false;try{requireLevel('prata');}catch(e){utmLocked=true;}
	track('page_view',{page:'ferramentas',utmLocked});
	root.innerHTML=`<h1>Ferramentas</h1><p class='text-muted'>Utilitários rápidos para acelerar decisões.</p><div class='grid grid-auto-fit' style='margin-top:1.25rem;'>
		<div class='card'><h3 class='card-title' style='font-size:var(--font-size-sm);'>Calculadora Comissão</h3><div class='field'><label for='valorVenda'>Valor</label><input id='valorVenda' type='number' min='0' value='1000'></div><div class='field'><label for='taxa'>Taxa %</label><input id='taxa' type='number' min='0' value='10'></div><button class='btn-ghost' id='calcBtn'>Calcular</button><div id='calcRes' class='text-muted' style='font-size:var(--font-size-xs);margin-top:.5rem;'>—</div></div>
		<div class='card'><h3 class='card-title' style='font-size:var(--font-size-sm);'>Gerador UTM ${utmLocked?'<span class="badge level-prata">Prata+</span>':''}</h3>${utmLocked?`<p class='text-muted' style='font-size:var(--font-size-xxs);'>Requer nível Prata para usar.</p>`:''}<div class='field'><label for='utmBase'>URL base</label><input id='utmBase' placeholder='https://exemplo.com' ${utmLocked?'disabled':''}></div><div class='field'><label for='utmCamp'>Campanha</label><input id='utmCamp' placeholder='campanha' ${utmLocked?'disabled':''}></div><button class='btn-ghost' id='utmBtn' ${utmLocked?'disabled':''}>${utmLocked?'Upgrade':'Gerar'}</button><div id='utmRes' class='text-muted' style='font-size:var(--font-size-xs);margin-top:.5rem;'>—</div>${utmLocked?`<div style='margin-top:.75rem;'><button class='btn' id='ctaUpgradeUtm'>Fazer Upgrade</button></div>`:''}</div>
	</div>`;
	if(utmLocked){root.querySelector('#ctaUpgradeUtm')?.addEventListener('click',()=>track('upgrade_intent',{feature:'utm_tool'}));}
	root.addEventListener('click',e=>{
		if(e.target.id==='calcBtn'){const v=Number(root.querySelector('#valorVenda').value||0);const t=Number(root.querySelector('#taxa').value||0);const res=(v*t/100).toFixed(2);root.querySelector('#calcRes').textContent='Comissão: R$ '+res;track('tool_use',{tool:'calc_comissao'});} 
		if(e.target.id==='utmBtn'){const base=root.querySelector('#utmBase').value.trim();const camp=root.querySelector('#utmCamp').value.trim();if(!base){root.querySelector('#utmRes').textContent='Informe URL base';return;}const url=new URL(base);url.searchParams.set('utm_source','afiliado');url.searchParams.set('utm_medium','referral');if(camp) url.searchParams.set('utm_campaign',camp);root.querySelector('#utmRes').textContent=url.toString();track('tool_use',{tool:'gerador_utm'});} 
	});
}
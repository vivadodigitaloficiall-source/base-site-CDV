// suporte page
import { requireAuth } from '../auth.js';
import { track } from '../analytics.js';

export async function render(root){
	requireAuth();
	track('page_view',{page:'suporte'});
	root.innerHTML=`<h1>Suporte</h1><p class='text-muted'>Encontre respostas ou abra um chamado.</p><div class='grid' style='margin-top:1.25rem;gap:1rem;'>
		<div>
			<details class='accordion' open><summary>Como redefino minha senha?</summary><div class='text-muted' style='margin-top:.5rem;font-size:var(--font-size-xs);'>Use a opção reset na tela de login. Receberá email em instantes.</div></details>
			<details class='accordion'><summary>Não vejo um curso.</summary><div class='text-muted' style='margin-top:.5rem;font-size:var(--font-size-xs);'>Verifique seu nível e progresso. Conteúdos avançados exigem upgrade.</div></details>
			<details class='accordion'><summary>Como gerar certificado?</summary><div class='text-muted' style='margin-top:.5rem;font-size:var(--font-size-xs);'>Complete 100% dos módulos e acesse a aba Certificados.</div></details>
		</div>
		<div class='card'>
			<h3 class='card-title' style='font-size:var(--font-size-sm);'>Contato</h3>
			<form id='supportForm' class='stack' style='gap:.75rem;'>
				<div class='field'><label for='sEmail'>Email</label><input id='sEmail' type='email' required></div>
				<div class='field'><label for='sAssunto'>Assunto</label><input id='sAssunto' required></div>
				<div class='field'><label for='sMsg'>Mensagem</label><textarea id='sMsg' rows='4' required></textarea></div>
				<button class='btn'>Enviar</button>
			</form>
			<small class='text-muted' style='font-size:var(--font-size-xxs);'>Tempo médio de resposta: 24h úteis.</small>
		</div>
	</div>`;
	root.querySelector('#supportForm')?.addEventListener('submit',e=>{e.preventDefault();track('cta_click',{id:'suporte_form'});alert('Chamado enviado (stub)');e.target.reset();});
}
// configuracoes page
import { requireAuth } from '../auth.js';
import { track } from '../analytics.js';
import { getTheme, setTheme } from '../store.js';

export async function render(root){
  requireAuth();
  track('page_view',{page:'configuracoes'});
  const currentTheme=getTheme();
  root.innerHTML=`<h1>Configurações</h1><form id='prefs' class='stack' style='gap:1.25rem;margin-top:1rem;max-width:640px;'>
    <fieldset class='card' style='display:flex;flex-direction:column;gap:.75rem;'><legend style='font-weight:600;'>Tema</legend>
      <label style='display:flex;align-items:center;gap:.5rem;font-size:var(--font-size-sm);'><input type='radio' name='theme' value='' ${currentTheme===''?'checked':''}> Escuro (default)</label>
      <label style='display:flex;align-items:center;gap:.5rem;font-size:var(--font-size-sm);'><input type='radio' name='theme' value='light' ${currentTheme==='light'?'checked':''}> Claro</label>
      <label style='display:flex;align-items:center;gap:.5rem;font-size:var(--font-size-sm);'><input type='radio' name='theme' value='system' ${(currentTheme!=='light'&&currentTheme!=='')?'checked':''}> Sistema</label>
    </fieldset>
    <fieldset class='card' style='display:flex;flex-direction:column;gap:.75rem;'><legend style='font-weight:600;'>Idioma (stub)</legend>
      <select id='langSel'><option value='pt-BR'>Português (BR)</option><option value='en-US'>English</option></select>
      <small class='text-muted' style='font-size:var(--font-size-xxs);'>Traduções dinâmicas serão carregadas via serverless futuramente.</small>
    </fieldset>
    <fieldset class='card' style='display:flex;flex-direction:column;gap:.75rem;'><legend style='font-weight:600;'>Notificações (stub)</legend>
      <label style='display:flex;align-items:center;gap:.5rem;font-size:var(--font-size-sm);'><input type='checkbox' id='notifEmail' checked> Email semanal</label>
      <label style='display:flex;align-items:center;gap:.5rem;font-size:var(--font-size-sm);'><input type='checkbox' id='notifDesafios'> Lembrete de desafios</label>
    </fieldset>
    <fieldset class='card' style='display:flex;flex-direction:column;gap:.75rem;'><legend style='font-weight:600;'>Segurança</legend>
      <div class='field'><label for='newPass'>Nova senha</label><input id='newPass' type='password' minlength='6'></div>
      <button class='btn-ghost' id='btnChangePass' type='button'>Atualizar senha (stub)</button>
    </fieldset>
    <button class='btn' type='submit'>Salvar Preferências</button>
  </form>`;
  const form=root.querySelector('#prefs');
  form.addEventListener('change',e=>{
    if(e.target.name==='theme'){
      const val=e.target.value; if(val==='system'){ localStorage.removeItem('theme'); const sys=matchMedia('(prefers-color-scheme: light)').matches?'light':''; setTheme(sys);} else { setTheme(val); }
      track('theme_change',{value:val});
    }
  });
  form.addEventListener('submit',e=>{e.preventDefault();track('preferences_save');alert('Preferências salvas (stub)');});
  form.querySelector('#btnChangePass')?.addEventListener('click',()=>{track('password_change_attempt');alert('Senha atualizada (stub)');});
}
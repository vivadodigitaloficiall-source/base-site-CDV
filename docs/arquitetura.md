# Arquitetura

## Visão Geral

SPA estática baseada em hash routing + módulos ES, servida via hosting estático.

## Módulos Principais

- firebase.js (Firebase modular email/senha + upgrade stub)
- auth.js (sessão, claims, guards)
- store.js (persistência local: profile, progress, theme)
- router.js (hash navigation + dynamic import)
- ui.js (toasts, modal, tema)
- components.js (tabs, accordion simplificado, skeleton)
- analytics.js (dataLayer + track)
- ai.js (stubs recomendações)
- pages/*.js (render isolado)
- assets/data/*.json (conteúdo e metadados)

## Fluxo de Autenticação (Produção Simplificada)

1. Acesso é provisionado após compra (backoffice dispara criação de usuário Firebase com claim inicial `level` via Cloud Function / painel).
2. Usuário recebe email com instruções e senha temporária / link de definição.
3. Login em `login.html` usa Firebase Auth (email/senha) importado dinamicamente.
4. Após login: `getIdTokenResult` lê custom claims (`level` fallback bronze se ausente).
5. Perfil persistido via `setProfile` (localStorage) para sessão estática.
6. Guards `requireAuth` e `requireLevel` controlam acesso a páginas/recursos.
7. Gating adicional: `index.html` e `app.html` possuem script inicial que redireciona para `login.html` caso não exista `profile` no `localStorage` (impede visualização não autenticada de qualquer conteúdo interno).

## Claims de Nível

- Ordem: bronze < prata < ouro < diamante
- Atualização: `upgradeLevel(user,target,track)` simula processamento e altera `user.claims.level`
- Gating: chamadas a `requireLevel('prata'|...)` em páginas/recursos

## Estrutura de Rotas (Hash)

```text
#/dashboard
#/cursos
#/curso?id=CURSO_ID
#/materiais
#/ferramentas
#/desafios
#/conquistas
#/certificados
#/afiliados
#/comunidade
#/suporte
#/perfil
#/configuracoes
```

`router.js` extrai hash, normaliza base (`/curso` para detalhe) e carrega módulo.

## Ciclo de Renderização de Página

1. Mudança de hash dispara `navigate()`
2. Shell limpa view e mostra skeleton
3. Import dinâmico executa `render(root)` da página
4. Página carrega dados JSON (se necessário)
5. Tracking `page_view`

## Persistência de Progresso

`store.js` controla objeto em localStorage:

```js
progress: {
  courses: { [cursoId]: { completed: [moduloIds] }},
  challenges: [desafioIds]
}
```

Atualizações via `updateProgress()` mantêm consistência.

## Certificados

- Página calcula elegibilidade (todos módulos concluídos)
- Geração PDF: dynamic import jsPDF ou fallback window
- Hash verificação: uuid parcial ou timestamp

## Temas

- Inline script define `data-theme` antes do first paint
- Classe `no-transition` remove flicker
- Toggle salva `theme` ('' dark default / 'light')

## Analytics

- `track(event, params)` push em `window.dataLayer`
- Eventos documentados em `eventos-analytics.md`

## Upgrade Flow Stub

1. Usuário clica CTA upgrade (gated feature)
2. `requireLevel` abre modal (ou CTA interno) e dispara `upgrade_intent`
3. `upgradeLevel` simula delay e sucesso -> `upgrade_success`
4. Perfil persistido novamente

## Serverless Hooks Futuro (Sugestão)

- `/api/upgrade` valida pagamento e retorna novo claim
- `/api/certificate/verify?code=HASH`
- `/api/ai/recommendations?uid=...` (stream JSON)

## Segurança & Limitações

- Google OAuth removido: somente email/senha (reduz superfície inicial).
- Claims de nível dependem de Cloud Function pós-compra (não implementada aqui).
- Upgrade local permanece stub até endpoint seguro ser adicionado.
- Regras Firestore/Storage (se usados futuramente) devem validar claims.
- Landing privada: decisão de negócio — remover meta `noindex` caso página pública volte a ser necessária para SEO.

## Performance

- Import on demand das páginas
- Inline critical script tema
- Skeleton para percepção de velocidade

## Acessibilidade

- Landmarks: header, main, footer
- Foco visível, skip link
- Uso de elementos nativos (details/summary, button, nav)

## Possíveis Extensões

- Cache de dados (stale-while-revalidate)
- Service Worker para offline básico
- Segmentação de idioma

## Exemplo Cloud Function (Provisionamento / Claims)

```js
// functions/index.js (Node 18)
import { onCall } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp } from 'firebase-admin/app';
initializeApp();

// Chamado pelo backend de checkout após confirmação do pagamento
export const setLevelClaim = onCall(async (req) => {
  const { uid, level } = req.data || {};
  const allowed = ['bronze','prata','ouro','diamante'];
  if(!uid || !allowed.includes(level)) throw new Error('Dados inválidos');
  await getAuth().setCustomUserClaims(uid, { level });
  return { ok:true };
});
```

Chamado no front (após confirmação externa) via callable:

```js
import { getFunctions, httpsCallable } from 'firebase/functions';
const fn = httpsCallable(getFunctions(), 'setLevelClaim');
await fn({ uid: user.uid, level: 'prata' });
// Depois: force refresh token -> getIdTokenResult(user, true)
```

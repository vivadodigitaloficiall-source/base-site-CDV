# Eventos de Analytics

## Visão Geral

Eventos enviados via `track(event, params)` para `window.dataLayer`.

## Convenções

- Nome em snake_case
- Parâmetros chave específicos por tipo
- `page_view` sempre no carregamento de página lógica

## Tabela de Eventos

| Evento | Descrição | Parâmetros |
|--------|-----------|------------|
| page_view | Exibição de página SPA | page, gated? |
| login_success | Login concluído | method |
| signup_success | Registro concluído | method |
| password_reset_request | Solicitação de reset | - |
| logout | Logout usuário | - |
| cta_click | Clique em CTA marketing | id, page |
| challenge_join | Usuário entrou em desafio | id |
| material_download | Download de material | id |
| tool_use | Uso de ferramenta | tool |
| upgrade_intent | Intenção de upgrade | target / feature / context |
| upgrade_initiated | Início fluxo upgrade | target |
| upgrade_success | Upgrade concluído | target |
| upgrade_failed | Upgrade falhou | target, error |
| certificate_generate | Geração de certificado | curso |
| theme_change | Alteração de tema | theme |
| preferences_save | Salvou preferências | section? |
| password_change_attempt | Tentativa troca senha | - |

## Exemplo de Implementação

```js
import { track } from './analytics.js';
track('tool_use',{ tool:'calc_comissao' });
```

## Extensões Futuras

- Atribuição de origem (utm/ref) persistida
- Eventos de abandono de curso
- Tempo de engajamento por página (heartbeat)

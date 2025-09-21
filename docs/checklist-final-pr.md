# Checklist Final & Guia de PR

## Pré-Review

- [ ] Todas páginas carregam sem erros console
- [ ] Navegação hash funciona para todas rotas
- [ ] Gating de nível: ferramentas (UTM), afiliados (Prata+), certificados (Ouro+)
- [ ] Upgrade stub executa e atualiza claim local
- [ ] Tema persiste e sem FOUC

## Acessibilidade

- [ ] Foco visível em links e botões
- [ ] Skip link funcional
- [ ] Modal fecha com ESC e clique backdrop
- [ ] Navegável apenas via teclado (tab order lógico)
- [ ] Textos sem depender apenas de cor

## Performance (Manual)

- [x] Lighthouse Performance ≥ 90 (desktop) *(estimado: assets leves, import dinâmico, prefetch idle)*
- [x] TTI aceitável (scripts leves / import dinâmico ok)
- [x] Imagens possuem dimensões e não quebram layout (sem `<img>` diretas atualmente)
- [x] CSS crítico inline mínimo (hero) ok

## SEO

- [ ] index.html com meta description + OG/Twitter
- [ ] login.html com OG/Twitter
- [ ] sitemap.xml contém rotas chave
- [ ] robots.txt referencia sitemap

## Analytics

- [ ] `page_view` dispara em cada página
- [ ] Eventos principais (upgrade_intent, challenge_join, material_download, certificate_generate)
- [ ] Sem erros ao chamar track()

## Documentação

- [ ] ui-styleguide.md
- [ ] arquitetura.md
- [ ] eventos-analytics.md
- [ ] checklist-final-pr.md

## Itens Futuro (Opcional Produção)

- Integrar Firebase Auth real
- Função serverless para upgrade + verificação certificado
- Worker de verificação de hash
- Service Worker para offline básico

## Template Pull Request

```markdown
## Objetivo
Resumo breve do que esta PR entrega.

## Escopo
- [ ] UI
- [ ] Auth / Claims
- [ ] Dados
- [ ] SEO
- [ ] Acessibilidade
- [ ] Performance
- [ ] Docs

## Testes Manuais
Passos executados, incluindo rotas acessadas e resultados.

## Evidências
- Capturas de tela (desktop/mobile)
- Lighthouse report

## Riscos / Follow-ups
Pontos a endereçar em próximas iterações.
```

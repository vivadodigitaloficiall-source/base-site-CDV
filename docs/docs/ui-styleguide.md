# UI Styleguide

## Visão Geral

Fundamentos de design system para a área de membros Código de Vendas VIP.

## Tokens

### Cores (Dark Default)

- bg, surface, surface-alt, surface-elev
- text, text-inverse, muted
- primary (#5B8CFF), secondary (#00C2A8)
- border, success, warn, danger, focus

### Cores (Light Override via `[data-theme="light"]`)

Principais diferenças: fundos claros, texto escuro, sombras ajustadas.

### Tipografia

- Fonte base: Inter / Sora fallback system-ui
- Escala fluida: --font-size-xs .. --font-size-2xl
- Line-heights: tight, snug, base, relaxed

### Espaçamento

- Escala: 2,3,4,6,8,12,16,24,32,48 (utilizada via variáveis)

### Raios / Sombra / Motion

- Radius: sm..2xl
- Shadow: sm, md, lg, xl (elevações)
- Motion: --dur, --dur-quick, --ease

## Princípios de Layout

- Container central responsivo `--container-max`
- Grid utilitário: `.grid`, `.grid-auto-fit` + breakpoints responsivos
- Stack & Cluster: composição rápida vertical / agrupamento

## Componentes Base

### Botões

Classes: `.btn`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`
Estados: hover, active (translateY), focus-visible (outline)

### Badges

Classes de nível: `.badge.level-bronze|prata|ouro|diamante`
Uso para indicar requisito ou nível do usuário.

### Cards

Estrutura: `.card` com `.card-header` opcional
Interações: leve mudança de borda no hover

### Progress Bars

Markup: `<div class="progress"><span style="width:45%"></span></div>`
Transição animada em largura.

### Skeleton

Classe `.skeleton` com animação keyframe `skeleton` para placeholders.

### Accordion

Sem JS dedicado: `<details class="accordion"><summary>...</summary><div>conteúdo</div></details>`
Acessível nativo.

### Modal

Gerado via `openModal({ title, content, actions })` (ver `ui.js`).
Foco deve ser aprisionado (stub simplificado).

### Tabs

Exemplo de autenticação (login): atributos `role=tablist/tab/tabpanel` + `aria-selected` + `hidden`.

### Toasts

Container `#toast-root`; cada toast `.toast` + variantes `.success|warn|danger`.

## Temas / Modo Claro-Escuro

- Aplicação imediata via inline script antes do paint
- Classe `html.no-transition` remove transições no carregamento (previne FOUC)
- Toggle salva em localStorage `theme` valor `''` (dark default) ou `light`
- Fallback: `prefers-color-scheme: light`

## Acessibilidade de Componentes

- Focus ring consistente via `outline` + tokens
- Skip link presente em `index.html`
- ARIA labels em navegação, breadcrumbs, modais, tabs

## Marcação de Exemplo (Botão + Card)

```html
<button class="btn">Ação Primária</button>
<article class="card">
  <header class="card-header">
    <h3 class="card-title">Título</h3>
    <span class="badge level-prata">Prata</span>
  </header>
  <p class="text-muted">Descrição do recurso.</p>
</article>
```

## Diretrizes de Escrita

- Textos curtos, métricas claras, reforço de valor
- Evitar jargão excessivo; foco em benefício prático

## Tokens Futuramente Expandíveis

- Espaço responsivo (fluid spacing)
- Escala de opacidade
- Paleta semântica ampliada (info, neutral)

## Checklist UI

- [ ] Contraste AA mínimo
- [ ] Foco visível em todos interativos
- [ ] Sem dependência exclusiva de cor
- [ ] Layout colapsa bem <320px


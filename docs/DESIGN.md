# Design system — SHAHU RAUTIHU KENEYA

A identidade nasce da logo: um emblema sépia com o perfil de uma mulher indígena de cocar
sobre um fundo bege com padrão geométrico de triângulos. O tom é **ancestral, quente e
acolhedor**. A base é terrosa (bege/terracota/marrom) e os **pastéis** (azul, amarelo,
rosa) entram como acentos suaves.

## Paleta

Implementada como variáveis CSS em [`static/css/theme.css`](../static/css/theme.css).

| Token | Hex | Uso |
|---|---|---|
| `--cor-bege` | `#E8D8C3` | Fundo base / seções claras |
| `--cor-bege-claro` | `#F4EBDD` | Fundo de páginas, cards |
| `--cor-terracota` | `#C17A54` | Cor de marca, botões primários, destaques |
| `--cor-terracota-escuro` | `#A5613E` | Hover de botões, detalhes |
| `--cor-marrom` | `#3B2419` | Texto principal, logo, títulos |
| `--cor-azul` | `#A8C7D9` | Acento pastel (tags, categoria) |
| `--cor-amarelo` | `#F0D98C` | Acento pastel (badges, destaques) |
| `--cor-rosa` | `#E8B5B0` | Acento pastel (badges, promoções) |

**Contraste:** texto sempre em `--cor-marrom` sobre fundos claros (bege/bege-claro). Os
pastéis são decorativos — não usar texto pastel sobre bege (contraste insuficiente).

## Tipografia

- **Títulos:** serifada elegante — `"Cormorant Garamond", "Georgia", serif`.
- **Corpo:** sans limpa — `"Inter", "Segoe UI", system-ui, sans-serif`.
- Fontes carregadas via Google Fonts no `<head>` (ver `templates/base.html`). Alternativa
  offline: colocar os arquivos em `static/fonts/`.

## Componentes

- **Sidebar** — menu lateral com categorias colapsáveis (Joias / Vestuário / Arte). Vira
  gaveta (drawer) no mobile, acionada por um botão "menu" no header.
- **Card de produto** — imagem (proporção 4:5), nome, preço e botão "Adicionar".
- **Badge** — "Indisponível", "Destaque" etc., usando os pastéis.
- **Botões** — primário (terracota, texto claro), secundário (contorno marrom).
- **Botão WhatsApp** — verde padrão do WhatsApp para reconhecimento imediato.

## Imagens

- Peças: proporção recomendada **4:5** (retrato), fundo neutro/claro. Largura ideal
  ~1000px, otimizadas (JPEG/WebP < 300 KB).
- Marca/autora: livres, mas otimizadas. Guardar em `assets/images/brand/`.
- Sempre preencher o texto alternativo (`alt`) — acessibilidade e SEO.

## Acessibilidade

- Contraste mínimo AA para texto (marrom sobre claro cumpre).
- Foco visível em links/botões (`:focus-visible`).
- Navegação por teclado na sidebar e no carrinho.
- `alt` obrigatório em todas as imagens de conteúdo.

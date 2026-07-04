# Arquitetura técnica

## Visão geral

O site é **estático**: um gerador em Python lê o conteúdo (arquivos versionados),
renderiza templates Jinja2 e escreve HTML puro em `public/`. Esse HTML é publicado em
hospedagem estática gratuita. Não há servidor de aplicação, banco de dados nem
processamento em tempo de execução — o que torna o site rápido, seguro e barato
(gratuito) de operar.

```
content/  (fonte da verdade)          src/shahu/  (gerador)            public/ (saída)
  site.yaml ............................ config ....................
  categories.yaml ...................... domain  <- catalog  ------>  index.html
  products/*.md ........................ content_pages ------------>  colecao/.../
assets/, static/, admin/ ............... rendering (Jinja2) ------->  produto/.../
                                         builder (orquestra) ------>  assets/ static/ admin/
```

## Por que estático (e não microservices)?

O projeto é voluntário e precisa de **custo zero** e **manutenção mínima**. Microservices
exigem múltiplos serviços sempre ligados, orquestração e, na prática, custo — inviável
em *free tier*. Adotamos **arquitetura modular limpa**: o código é separado por domínios
com dependências em uma única direção, mas é implantado como uma unidade. Isso entrega o
objetivo real ("fácil de manter e evoluir") sem o custo operacional de microservices.

## Camadas e dependências

A regra de dependência aponta sempre para dentro (Clean Architecture, versão enxuta):

```
builder  ->  catalog / content_pages  ->  domain
   |                                         ^
   +--------->  rendering (Jinja2)  ---------+
   +--------->  config
```

| Módulo | Responsabilidade | Depende de |
|---|---|---|
| `domain/` | Modelos e regras puras (`Product`, `Category`, `SiteContent`). **Sem I/O.** | — |
| `catalog/` | Ler peças do disco (`repository`) e agrupar/filtrar por categoria (`service`). | `domain` |
| `content_pages/` | Montar dados das páginas de conteúdo (home/história). | `domain`, `config` |
| `rendering/` | Carregar e renderizar templates Jinja2; filtros (moeda, WhatsApp). | `domain` |
| `config.py` | Localizar diretórios e carregar `site.yaml`. | — |
| `builder.py` | Orquestrar o build: carregar dados, renderizar páginas, copiar estáticos. | todos acima |

Cada módulo é testável isoladamente: `domain` sem tocar disco, `catalog` com um diretório
de fixtures, `rendering` com um template mínimo.

## Fluxo do build (`scripts/build.py` -> `shahu.builder`)

1. Carrega configuração (`config`) e conteúdo do site (`site.yaml`).
2. Carrega categorias (`categories.yaml`) e peças (`content/products/*.md`).
3. Renderiza:
   - **Home** — história da marca, destaques e contato.
   - **Coleção** — uma página por categoria e por subcategoria (grade de peças).
   - **Produto** — uma página por peça.
4. Copia `static/`, `assets/` e `admin/` para `public/`.

## Carrinho e checkout (client-side)

O carrinho é 100% no navegador (`static/js/cart.js`, `localStorage`). Não há backend:
ao finalizar, o JavaScript monta uma mensagem itemizada e abre um link
`https://wa.me/<numero>?text=...`. O número e o `@` do Instagram vêm de `site.yaml` e são
expostos ao front via um pequeno JSON/atributos no HTML gerado.

## Gestão de conteúdo (CMS)

[Sveltia CMS](https://github.com/sveltia/sveltia-cms) (fork moderno do Decap CMS) roda em
`/admin`, autentica via GitHub OAuth e faz *commit* direto no repositório. Um commit
dispara o GitHub Actions, que reexecuta o build e publica. Assim a autora gerencia peças
sem tocar em código e sem nenhum servidor dedicado.

## Deploy (CI/CD)

`.github/workflows/deploy.yml`: em cada push na `main`, instala dependências, roda
`pytest`, executa `python scripts/build.py` e publica `public/`. O destino padrão
documentado é **Cloudflare Pages** (raiz do domínio, domínio custom grátis); GitHub Pages
é alternativa. Ver comentários no próprio workflow.

## Decisões e trade-offs

- **URLs root-relative** (`/colecao/...`): funcionam na raiz de um domínio (Cloudflare
  Pages). Para GitHub Pages em subcaminho, definir `base_url` em `site.yaml`.
- **Sem thumbnails automáticos** na v0.1 (Pillow é opcional/futuro). Recomenda-se subir
  imagens já otimizadas (ver [DESIGN.md](DESIGN.md)).
- **Preço como texto formatado** em BRL no build (filtro Jinja `moeda`).

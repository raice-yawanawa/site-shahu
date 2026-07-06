# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- Opção **"Sob encomenda"** nas peças: adiciona automaticamente o aviso na descrição do
  produto, exibe badge no card, e destaca o item no carrinho e na mensagem do WhatsApp.
- Itens do carrinho agora são **links** para a página da peça (drawer e mensagem do WhatsApp).
- Botão **"Perguntar sobre esta peça"** (peças indisponíveis) envia mensagem automática de
  interesse com o link da peça.
- Subcategoria **"Fotografias"** em Arte.
- Ícones oficiais de **WhatsApp** e **Instagram** nos botões.

### Alterado
- Frase do rodapé passa a citar a cultura **Yawanawá**; ocorrências de "Yawanawa" corrigidas.

### Removido
- Botões de WhatsApp e Instagram do rodapé (contato permanece na home).
- Guia de publicação passo a passo (`docs/DEPLOY.md`): Cloudflare Pages, GitHub Pages e
  configuração do login do CMS.
- Versionamento Git inicializado (`.gitattributes` normalizando quebras de linha).

## [0.1.0] - 2026-07-03

### Adicionado
- Estrutura inicial do projeto (arquitetura modular limpa).
- Gerador de site estático em Python (Jinja2) com módulos por domínio:
  `domain`, `catalog`, `content_pages`, `rendering` e `builder`.
- Modelo de conteúdo versionado em `content/` (site.yaml, categories.yaml, peças).
- Navegação em sidebar: Joias, Vestuário e Arte com subcategorias.
- Páginas: home (história da marca + contato), coleção (grade) e produto.
- Design system com paleta pastel/terracota derivada da logo (`static/css/theme.css`).
- Carrinho client-side com finalização de pedido via WhatsApp (`static/js/cart.js`).
- CMS gratuito (Sveltia CMS) em `/admin` para gestão das peças.
- Workflow de CI/CD (GitHub Actions) para build e deploy automáticos.
- Documentação técnica, design system e guia de conteúdo em `docs/`.

[Não lançado]: https://github.com/raice-yawanawa/site-shahu/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/raice-yawanawa/site-shahu/releases/tag/v0.1.0

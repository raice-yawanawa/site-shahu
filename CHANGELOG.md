# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

## [1.1.0] - 2026-07-06

### Adicionado
- **Registro de autoria** do desenvolvimento (Camila Cerreti): linha discreta no rodapé
  com link para o LinkedIn, `<meta name="author">` no `<head>` e arquivo `/humans.txt`.
- Suporte a arquivos avulsos na raiz do site no build (ex.: `humans.txt`).

## [1.0.0] - 2026-07-06

🎉 **Lançamento público do site** em https://raice-yawanawa.github.io/site-shahu/

### Adicionado
- Opção **"Sob encomenda"** nas peças: adiciona automaticamente o aviso na descrição do
  produto, exibe badge no card, e destaca o item no carrinho e na mensagem do WhatsApp.
- Destaque **"Sob consulta"** para itens sem preço no carrinho e nota na mensagem do WhatsApp.
- Itens do carrinho agora são **links** para a página da peça (drawer e mensagem do WhatsApp).
- Botão **"Perguntar sobre esta peça"** (peças indisponíveis) envia mensagem automática de
  interesse com o link da peça.
- Botão discreto **"Limpar carrinho"** (ícone de lixeira), com confirmação.
- Subcategoria **"Fotografias"** em Arte.
- Ícones oficiais de **WhatsApp** e **Instagram** nos botões.
- **Versionamento de assets** (`?v=<build>`) em CSS/JS para evitar cache desatualizado após deploys.
- Guia de publicação passo a passo (`docs/DEPLOY.md`): Cloudflare Pages, GitHub Pages e
  configuração do login do CMS.
- Versionamento Git inicializado (`.gitattributes` normalizando quebras de linha).
- **Publicação em produção** (GitHub Pages) e **login do CMS** via GitHub OAuth (Cloudflare Worker).
- Links oficiais do site e do painel admin em destaque no `README.md`.
- Conteúdo de contato e da história configurados via painel (WhatsApp, Instagram e textos da home).

### Alterado
- Contatos (WhatsApp/Instagram) movidos para o **cabeçalho**, como ícones discretos ao lado
  do carrinho, nas cores oficiais em tom pastel (verde do WhatsApp e degradê do Instagram);
  removidos do topo da home.
- Botões da seção "Fale comigo" adotam as mesmas cores pastel do cabeçalho, sem contorno.
- Logo do hero ampliada para o dobro do tamanho.
- Frase do rodapé passa a citar a cultura **Yawanawá**; ocorrências de "Yawanawa" corrigidas.

### Removido
- Botões de WhatsApp e Instagram do rodapé (contato permanece na home e no cabeçalho).

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

[Não lançado]: https://github.com/raice-yawanawa/site-shahu/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/raice-yawanawa/site-shahu/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/raice-yawanawa/site-shahu/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/raice-yawanawa/site-shahu/releases/tag/v0.1.0

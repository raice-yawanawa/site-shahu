# Changelog

Todas as mudanças relevantes deste projeto serão documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
projeto adota [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

## [1.3.0] - 2026-07-10

### Adicionado
- **Calculadora de frete** no drawer do carrinho: campo de CEP com máscara automática
  (XXXXX-XXX), botão "Estimar" que consulta a API pública ViaCEP para identificar o
  estado de destino, e exibe três opções selecionáveis:
  - **Retirar comigo (a combinar)** — grátis;
  - **PAC** — valor estimado para ~300 g, origem Rio Branco/AC;
  - **SEDEX** — valor estimado para ~300 g, origem Rio Branco/AC.
- Tabela estática de preços Correios 2024/2025 embutida no JS para os 27 estados.
- O frete selecionado é somado ao total do carrinho e exibido em linha separada no
  rodapé da gaveta.
- A mensagem enviada pelo WhatsApp inclui bloco de frete:
  `🚚 Previsão de frete: PAC — R$ 36,50 (CEP 01310-100/SP)` ou
  `🚚 Entrega: Retirada com a artesã (a combinar)`.
- Seção de frete se oculta automaticamente quando o carrinho está vazio.

## [1.2.0] - 2026-07-07

### Adicionado
- **Imagem de textura** de miçangas como fundo do hero com degradê horizontal em marca
  d'água — véu suave no centro destaca título e subtítulo sem esconder a trama.
- **Carrossel de imagens** na página de produto: foto em destaque + faixa de miniaturas
  clicáveis abaixo; botões ← → sobrepostos e navegação por teclado (← →).
- **Seção de histórias múltiplas** na home: cada história tem título, parágrafos e fotos
  próprios, empilhados em ordem — permite criar tantos blocos quanto necessário pelo CMS.
- **Fotos por história**: campo de fotos opcional em cada bloco de história; as imagens
  aparecem logo abaixo do texto, permitindo intercalar fotos entre histórias.
- **Legenda opcional** por foto nas histórias: texto discreto (itálico, alinhado à
  esquerda) exibido abaixo de cada imagem; configurável pelo CMS.
- **Carrossel horizontal** nas "Peças em destaque" da home: linha única com scroll lateral,
  snap suave e scrollbar terracota.
- **Campo "Posição no destaque"** (`featured_order`) nas peças: número inteiro que define
  a ordem dos cards no carrossel (1 = primeiro); sem número → vai ao final em ordem
  alfabética. Configurável pelo CMS.

### Alterado

- Logo do hero ampliada de 220 px para 260 px para melhor legibilidade da marca.
- Fotos das histórias centralizadas verticalmente entre si (`align-items: center`),
  eliminando o efeito escada entre imagens de alturas diferentes.
- Fotos das histórias exibidas na proporção original, sem corte.
- Cards de produto nas coleções mantêm proporção 4:5 fixo (reversão intencional).

### Corrigido

- Espaço vazio abaixo de fotos menores no grid de histórias (células não mais se esticam
  para igualar a altura da maior).
- `overflow: hidden` movido para wrapper interno da imagem, liberando `<figcaption>` de
  legenda de ser cortado pelo container.
- Linha longa em `repository.py` corrigida para passar no linter `ruff` (E501).

### Conteúdo (via CMS)

- Peças cadastradas: colares, brincos e pulseiras adicionados ao catálogo.
- Textos da história da marca e das artesãs atualizados.
- Segunda história ("Sobre as artesãs") criada com fotos das fundadoras.

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

[Não lançado]: https://github.com/raice-yawanawa/site-shahu/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/raice-yawanawa/site-shahu/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/raice-yawanawa/site-shahu/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/raice-yawanawa/site-shahu/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/raice-yawanawa/site-shahu/releases/tag/v0.1.0

# Guia de conteúdo — como cadastrar e editar peças

Este guia é para quem cuida do conteúdo do site (não precisa saber programar). Há duas
formas de gerenciar as peças: pelo **painel (CMS)** — recomendada — ou editando os
**arquivos** diretamente.

## Opção A — Painel (CMS), recomendada

1. Acesse `https://SEU-SITE/admin/` (ex.: `https://shahu.pages.dev/admin/`).
2. Entre com a conta do **GitHub** autorizada.
3. Você verá as coleções: **Peças** e **Configurações do site** (contato, textos da home).
4. Para uma nova peça, clique em **Peças → Novo**, preencha os campos e salve/publique.
5. Ao publicar, o site é **reconstruído automaticamente** em alguns minutos.

> As **categorias/subcategorias** mudam raramente e não ficam no painel — são editadas
> no arquivo `content/categories.yaml` (ver seção mais abaixo).

> A configuração do painel está em [`admin/config.yml`](../admin/config.yml).

## Opção B — Editando arquivos

Cada peça é um arquivo em [`content/products/`](../content/products/) com um cabeçalho de
dados e uma descrição. Exemplo — `content/products/colar-tucum-ancestral.md`:

```markdown
---
name: "Colar Tucum Ancestral"
price: 189.90
category: "joias"          # slug da categoria (ver categories.yaml)
subcategory: "colares"     # slug da subcategoria
images:
  - "/assets/images/products/colar-tucum-ancestral-1.jpg"
  - "/assets/images/products/colar-tucum-ancestral-2.jpg"
available: true            # false marca como "Indisponível"
featured: true             # true destaca na home
---

Colar feito à mão com sementes de tucum e miçangas, seguindo grafismos ancestrais.
Cada peça é única. Descrição livre em **Markdown**.
```

Regras importantes:

- **`category` e `subcategory`** devem usar os *slugs* definidos em
  [`content/categories.yaml`](../content/categories.yaml). Slugs válidos:
  - **joias** → `colares`, `brincos`, `pulseiras`, `aneis`, `amarradores`
  - **vestuario** → `vestidos`, `cintos`
  - **arte** → `gravuras`, `fotografias`
- **Imagens:** suba os arquivos em `assets/images/products/` e referencie o caminho
  começando com `/assets/...`. A primeira imagem é a capa.
- **`price`** é um número (use ponto decimal, ex.: `189.90`). Deixe em branco para
  "sob consulta".
- O **nome do arquivo** (`colar-tucum-ancestral.md`) vira o endereço da peça
  (`/produto/colar-tucum-ancestral/`). Use letras minúsculas e hífens.

## Editar textos da home e o contato

O arquivo [`content/site.yaml`](../content/site.yaml) contém o número de **WhatsApp**, o
**@ do Instagram** e os **textos da história da marca**. Edite com cuidado, mantendo a
indentação.

## Adicionar uma nova categoria/subcategoria

Edite [`content/categories.yaml`](../content/categories.yaml) seguindo o padrão existente
(defina um `slug` sem acentos/espaços e um `name` de exibição).

## Publicando as mudanças

- **Pelo CMS:** publicar já dispara tudo.
- **Editando arquivos:** salve e faça *commit*/push na branch `main`. O site é
  reconstruído e publicado automaticamente pelo GitHub Actions.

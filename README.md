<p align="center">
  <img src="assets/images/logo/logo-shahu.jpeg" alt="SHAHU RAUTIHU KENEYA" width="220">
</p>

<h1 align="center">SHAHU RAUTIHU KENEYA</h1>
<p align="center"><em>Ancestralidade em cada detalhe</em></p>

Site de vendas de **artesanato indígena** da marca SHAHU RAUTIHU KENEYA. Projeto
**voluntário de apoio à arte indígena** — construído inteiramente sobre serviços
**gratuitos** e fácil de manter.

- **Catálogo** de peças (joias, vestuário, arte) com navegação por categorias.
- **Carrinho** no próprio site; a compra é **finalizada pelo WhatsApp** com o pedido
  já montado (sem pagamento online, sem banco de dados).
- **Site estático gerado em Python** (Jinja2) — rápido, seguro e sem servidor.
- **CMS gratuito** ([Sveltia CMS](https://github.com/sveltia/sveltia-cms)) para a autora
  cadastrar peças pelo navegador.

## Como funciona (visão geral)

```
Autora edita no CMS (/admin)  ->  commit no GitHub  ->  GitHub Actions roda o build
Python  ->  site estático publicado (Cloudflare Pages / GitHub Pages)
```

O conteúdo (peças, categorias, textos) vive em [content/](content/) como arquivos
versionados — essa é a **fonte da verdade**. O código do gerador vive em
[src/shahu/](src/shahu/), organizado em módulos por domínio (ver
[docs/ARQUITETURA.md](docs/ARQUITETURA.md)).

## Rodando localmente

Pré-requisitos: **Python 3.10+**.

```bash
# 1. Instalar dependências (idealmente em um ambiente virtual)
python -m pip install -e ".[dev]"

# 2. Gerar o site em ./public
python scripts/build.py

# 3. Servir localmente e abrir no navegador
python -m http.server --directory public 8000
# -> http://localhost:8000
```

Para checar tudo:

```bash
pytest          # testes
ruff check .    # lint
```

## Estrutura do repositório

| Caminho | Conteúdo |
|---|---|
| [content/](content/) | Fonte da verdade: `site.yaml`, `categories.yaml`, `products/` |
| [assets/images/](assets/images/) | Imagens (peças, marca, logo) |
| [src/shahu/](src/shahu/) | Gerador Python modular (domain / catalog / rendering / builder) |
| [templates/](templates/) | Templates Jinja2 |
| [static/](static/) | CSS e JavaScript do site (tema + carrinho) |
| [admin/](admin/) | CMS (painel da autora) |
| [scripts/build.py](scripts/build.py) | Ponto de entrada do build |
| [docs/](docs/) | Documentação técnica, design system e guia de conteúdo |
| `public/` | Saída do build (gerada; não versionada) |

## Documentação

- [docs/ARQUITETURA.md](docs/ARQUITETURA.md) — decisões técnicas e módulos.
- [docs/DESIGN.md](docs/DESIGN.md) — design system (paleta, tipografia, componentes).
- [docs/CONTEUDO.md](docs/CONTEUDO.md) — **guia da autora**: como cadastrar/editar peças.
- [CHANGELOG.md](CHANGELOG.md) — histórico de versões.

## Licença

Código sob licença MIT. As imagens e a identidade visual pertencem à marca
SHAHU RAUTIHU KENEYA.

"""Orquestra o build: carrega dados, renderiza páginas e copia estáticos para ``public``.

Ponto de entrada de alto nível. Uso:

    from shahu.builder import build
    build()                       # usa os caminhos padrão do projeto
    build(paths=Paths(root=...))  # útil em testes
"""

from __future__ import annotations

import shutil
from pathlib import Path

from shahu.catalog import Catalog, load_categories, load_products, load_site_content
from shahu.config import PATHS, Paths
from shahu.content_pages import home_context
from shahu.domain import SiteContent
from shahu.rendering import Renderer


def _write_page(output_root: Path, url_path: str, html: str) -> Path:
    """Escreve uma página em uma URL "bonita" (``/colecao/joias/`` -> ``.../index.html``)."""
    relative = url_path.strip("/")
    target_dir = output_root if not relative else output_root / relative
    target_dir.mkdir(parents=True, exist_ok=True)
    out_file = target_dir / "index.html"
    out_file.write_text(html, encoding="utf-8")
    return out_file


def _copy_tree(src: Path, dst: Path) -> None:
    if src.exists():
        shutil.copytree(src, dst, dirs_exist_ok=True)


def build(paths: Paths = PATHS) -> Path:
    """Executa o build completo e retorna o diretório de saída (``public``)."""
    site: SiteContent = load_site_content(paths.site_file)
    categories = load_categories(paths.categories_file)
    products = load_products(paths.products)
    catalog = Catalog.create(categories, products)

    renderer = Renderer(paths.templates, site=site, categories=categories)

    output = paths.output
    if output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True, exist_ok=True)

    # --- Home ---
    _write_page(output, "/", renderer.render("home.html", **home_context(site, catalog)))

    # --- Coleções: uma página por categoria e por subcategoria ---
    for category in categories:
        _write_page(
            output,
            category.url,
            renderer.render(
                "collection.html",
                category=category,
                subcategory=None,
                products=catalog.in_category(category.slug),
            ),
        )
        for sub in category.subcategories:
            _write_page(
                output,
                sub.url,
                renderer.render(
                    "collection.html",
                    category=category,
                    subcategory=sub,
                    products=catalog.in_subcategory(category.slug, sub.slug),
                ),
            )

    # --- Peças: uma página por produto ---
    for product in products:
        category = catalog.category(product.category)
        _write_page(
            output,
            product.url,
            renderer.render("product.html", product=product, category=category),
        )

    # --- Estáticos, imagens e painel do CMS ---
    _copy_tree(paths.static, output / "static")
    _copy_tree(paths.assets, output / "assets")
    _copy_tree(paths.admin, output / "admin")

    return output


def main() -> None:
    """Entrada de linha de comando (``python scripts/build.py`` / ``shahu-build``)."""
    output = build()
    print(f"Site gerado em: {output}")


if __name__ == "__main__":
    main()

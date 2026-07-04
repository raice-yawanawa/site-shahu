"""Leitura do conteúdo do disco (arquivos versionados) para modelos de domínio.

Esta é a única camada que conhece o formato dos arquivos (`YAML`, Markdown com
frontmatter). O resto do sistema trabalha apenas com os modelos de ``shahu.domain``.
"""

from __future__ import annotations

from pathlib import Path

import frontmatter
import markdown as md
import yaml

from shahu.domain import Category, Contact, Product, SiteContent, Subcategory


def load_site_content(path: Path) -> SiteContent:
    """Carrega ``site.yaml`` em um :class:`SiteContent`."""
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    brand = data.get("brand", {})
    contact = data.get("contact", {})
    return SiteContent(
        brand_name=brand.get("name", "SHAHU RAUTIHU KENEYA"),
        tagline=brand.get("tagline", ""),
        logo=brand.get("logo", "/assets/images/logo/logo-shahu.jpeg"),
        contact=Contact(
            whatsapp=str(contact.get("whatsapp", "")),
            instagram=str(contact.get("instagram", "")),
        ),
        home=data.get("home", {}) or {},
        base_url=str(data.get("base_url", "")).rstrip("/"),
    )


def load_categories(path: Path) -> list[Category]:
    """Carrega ``categories.yaml`` em uma lista de :class:`Category`."""
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or []
    categories: list[Category] = []
    for item in data:
        cat_slug = item["slug"]
        subs = tuple(
            Subcategory(slug=s["slug"], name=s["name"], category_slug=cat_slug)
            for s in item.get("subcategories", []) or []
        )
        categories.append(Category(slug=cat_slug, name=item["name"], subcategories=subs))
    return categories


def _parse_price(raw: object) -> float | None:
    if raw is None or raw == "":
        return None
    return float(raw)


def load_products(products_dir: Path) -> list[Product]:
    """Carrega todas as peças de ``content/products/*.md``.

    O nome do arquivo (sem extensão) vira o *slug* da peça. Peças são ordenadas por nome
    para tornar o build determinístico.
    """
    products: list[Product] = []
    if not products_dir.exists():
        return products

    for file in sorted(products_dir.glob("*.md")):
        post = frontmatter.load(file)
        meta = post.metadata
        images = tuple(str(i) for i in (meta.get("images") or []))
        description_html = md.markdown(post.content or "", extensions=["extra"])
        products.append(
            Product(
                slug=file.stem,
                name=str(meta.get("name", file.stem)),
                category=str(meta.get("category", "")),
                subcategory=str(meta.get("subcategory", "")),
                images=images,
                description_html=description_html,
                price=_parse_price(meta.get("price")),
                available=bool(meta.get("available", True)),
                featured=bool(meta.get("featured", False)),
            )
        )
    return sorted(products, key=lambda p: p.name.casefold())

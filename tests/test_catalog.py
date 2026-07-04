"""Testes de leitura e organização do catálogo (repository + service)."""

import textwrap

import pytest

from shahu.catalog import Catalog, load_categories, load_products, load_site_content


@pytest.fixture
def content_dir(tmp_path):
    """Cria um diretório de conteúdo mínimo para os testes."""
    (tmp_path / "categories.yaml").write_text(
        textwrap.dedent(
            """
            - slug: joias
              name: Joias
              subcategories:
                - { slug: colares, name: Colares }
                - { slug: brincos, name: Brincos }
            - slug: arte
              name: Arte
              subcategories:
                - { slug: gravuras, name: Gravuras }
            """
        ),
        encoding="utf-8",
    )

    products = tmp_path / "products"
    products.mkdir()

    def _write(slug, meta, body="Descrição."):
        linhas = "\n".join(f"{k}: {v}" for k, v in meta.items())
        (products / f"{slug}.md").write_text(f"---\n{linhas}\n---\n{body}\n", encoding="utf-8")

    _write("colar-a", {"name": "Colar A", "price": 100.0, "category": "joias",
                        "subcategory": "colares", "featured": True, "available": True})
    _write("colar-b", {"name": "Colar B", "price": 50.0, "category": "joias",
                        "subcategory": "colares", "featured": False, "available": False})
    _write("brinco-c", {"name": "Brinco C", "price": 30.0, "category": "joias",
                        "subcategory": "brincos", "featured": True, "available": True})
    _write("gravura-d", {"name": "Gravura D", "category": "arte",
                         "subcategory": "gravuras"})  # sem preço
    return tmp_path


def test_load_categories(content_dir):
    cats = load_categories(content_dir / "categories.yaml")
    assert [c.slug for c in cats] == ["joias", "arte"]
    joias = cats[0]
    assert [s.slug for s in joias.subcategories] == ["colares", "brincos"]
    assert joias.subcategories[0].category_slug == "joias"


def test_load_products_sorted_and_parsed(content_dir):
    products = load_products(content_dir / "products")
    # ordenado por nome (casefold)
    assert [p.name for p in products] == ["Brinco C", "Colar A", "Colar B", "Gravura D"]
    gravura = next(p for p in products if p.slug == "gravura-d")
    assert gravura.price is None
    assert gravura.has_price is False
    colar_b = next(p for p in products if p.slug == "colar-b")
    assert colar_b.available is False
    assert "<p>" in next(p for p in products if p.slug == "colar-a").description_html


def test_catalog_queries(content_dir):
    catalog = Catalog.create(
        load_categories(content_dir / "categories.yaml"),
        load_products(content_dir / "products"),
    )
    assert catalog.count_in_category("joias") == 3
    assert {p.slug for p in catalog.in_subcategory("joias", "colares")} == {"colar-a", "colar-b"}
    # destaques: apenas featured E disponíveis
    assert {p.slug for p in catalog.featured()} == {"colar-a", "brinco-c"}
    assert catalog.category("arte").name == "Arte"
    assert catalog.category("inexistente") is None


def test_load_site_content(tmp_path):
    (tmp_path / "site.yaml").write_text(
        textwrap.dedent(
            """
            base_url: "/sub"
            brand: { name: "SHAHU", tagline: "Ancestral", logo: "/l.png" }
            contact: { whatsapp: "5511999999999", instagram: "shahu" }
            home: { hero_title: "Oi" }
            """
        ),
        encoding="utf-8",
    )
    site = load_site_content(tmp_path / "site.yaml")
    assert site.brand_name == "SHAHU"
    assert site.base_url == "/sub"
    assert site.contact.whatsapp_url == "https://wa.me/5511999999999"
    assert site.home["hero_title"] == "Oi"

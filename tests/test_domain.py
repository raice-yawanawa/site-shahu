"""Testes das regras puras de domínio e do filtro de moeda."""

from shahu.domain import PLACEHOLDER_IMAGE, Category, Contact, Product, Subcategory
from shahu.rendering.renderer import format_brl


def test_product_url_and_cover():
    sem_foto = Product(slug="colar-x", name="Colar X", category="joias", subcategory="colares")
    assert sem_foto.url == "/produto/colar-x/"
    assert sem_foto.cover == PLACEHOLDER_IMAGE
    assert sem_foto.has_price is False

    com_foto = Product(
        slug="c",
        name="C",
        category="joias",
        subcategory="colares",
        images=("/a.jpg", "/b.jpg"),
        price=10.0,
    )
    assert com_foto.cover == "/a.jpg"
    assert com_foto.has_price is True


def test_category_urls_and_lookup():
    sub = Subcategory(slug="colares", name="Colares", category_slug="joias")
    cat = Category(slug="joias", name="Joias", subcategories=(sub,))
    assert cat.url == "/colecao/joias/"
    assert sub.url == "/colecao/joias/colares/"
    assert cat.subcategory("colares") is sub
    assert cat.subcategory("inexistente") is None


def test_contact_normalizacao():
    c = Contact(whatsapp="+55 (11) 99999-9999", instagram="@shahu")
    assert c.whatsapp_digits == "5511999999999"
    assert c.whatsapp_url == "https://wa.me/5511999999999"
    assert c.instagram_handle == "shahu"
    assert c.instagram_url == "https://instagram.com/shahu"


def test_format_brl():
    assert format_brl(189.9) == "R$ 189,90"
    assert format_brl(1234.5) == "R$ 1.234,50"
    assert format_brl(None) == "Sob consulta"

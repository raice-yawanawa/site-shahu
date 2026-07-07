"""Teste de fumaça (smoke) do build completo em um projeto temporário isolado."""

import shutil
import textwrap

from shahu.builder import build
from shahu.config import PROJECT_ROOT, Paths


def _make_project(tmp_path):
    """Monta um projeto mínimo reutilizando os templates e estáticos reais."""
    root = tmp_path / "proj"
    (root / "content" / "products").mkdir(parents=True)
    (root / "assets").mkdir()
    (root / "admin").mkdir()

    (root / "content" / "categories.yaml").write_text(
        textwrap.dedent(
            """
            - slug: joias
              name: Joias
              subcategories:
                - { slug: colares, name: Colares }
            """
        ),
        encoding="utf-8",
    )
    (root / "content" / "site.yaml").write_text(
        textwrap.dedent(
            """
            base_url: ""
            brand: { name: "SHAHU RAUTIHU KENEYA", tagline: "Ancestralidade", logo: "/l.png" }
            contact: { whatsapp: "5511999999999", instagram: "shahu" }
            credits: { developer: "Dev Teste", developer_url: "https://exemplo.com/dev" }
            home:
              hero_title: "Arte à mão"
              hero_subtitle: "Sub"
              hero_image: "/h.jpg"
              stories:
                - title: "História"
                  paragraphs: ["Um parágrafo."]
                  photos: []
              featured_title: "Destaques"
              cta_title: "Contato"
              cta_text: "Fale comigo."
            """
        ),
        encoding="utf-8",
    )
    (root / "content" / "products" / "colar-a.md").write_text(
        "---\nname: \"Colar A\"\nprice: 100.0\ncategory: joias\nsubcategory: colares\n"
        "images: []\navailable: true\nfeatured: true\nmade_to_order: true\n---\nUm belo colar.\n",
        encoding="utf-8",
    )

    (root / "humans.txt").write_text("Desenvolvedora: Dev Teste\n", encoding="utf-8")

    shutil.copytree(PROJECT_ROOT / "templates", root / "templates")
    shutil.copytree(PROJECT_ROOT / "static", root / "static")
    return Paths(root=root)


def test_build_gera_paginas(tmp_path):
    out = build(_make_project(tmp_path))

    assert (out / "index.html").exists()
    assert (out / "colecao" / "joias" / "index.html").exists()
    assert (out / "colecao" / "joias" / "colares" / "index.html").exists()
    assert (out / "produto" / "colar-a" / "index.html").exists()

    produto = (out / "produto" / "colar-a" / "index.html").read_text(encoding="utf-8")
    assert "Colar A" in produto
    assert "R$ 100,00" in produto
    assert "data-add-to-cart" in produto
    # peça sob encomenda: atributo no botão e aviso automático na descrição
    assert 'data-made-to-order="true"' in produto
    assert "apenas sob encomenda" in produto

    home = (out / "index.html").read_text(encoding="utf-8")
    assert "SHAHU RAUTIHU KENEYA" in home
    assert "wa.me/5511999999999" in home

    # crédito de autoria: rodapé + meta author
    assert "Dev Teste" in home
    assert 'name="author"' in home

    # estáticos copiados
    assert (out / "static" / "css" / "theme.css").exists()
    assert (out / "static" / "js" / "cart.js").exists()
    # arquivo humans.txt copiado para a raiz
    assert (out / "humans.txt").exists()

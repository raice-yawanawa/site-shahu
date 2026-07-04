"""Modelo de uma peça (produto) do catálogo."""

from __future__ import annotations

from dataclasses import dataclass, field

# Imagem exibida quando a peça não tem fotos cadastradas.
PLACEHOLDER_IMAGE = "/static/img/placeholder.svg"


@dataclass(frozen=True)
class Product:
    """Uma peça de artesanato.

    Regras puras de apresentação (capa, disponibilidade) vivem aqui; leitura de disco
    fica no módulo ``catalog.repository``.
    """

    slug: str
    name: str
    category: str  # slug da categoria
    subcategory: str  # slug da subcategoria
    images: tuple[str, ...] = field(default_factory=tuple)
    description_html: str = ""
    price: float | None = None
    available: bool = True
    featured: bool = False

    @property
    def url(self) -> str:
        return f"/produto/{self.slug}/"

    @property
    def cover(self) -> str:
        """Imagem de capa (primeira foto) ou o placeholder."""
        return self.images[0] if self.images else PLACEHOLDER_IMAGE

    @property
    def has_price(self) -> bool:
        return self.price is not None

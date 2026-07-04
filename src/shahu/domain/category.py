"""Categorias e subcategorias da navegação (sidebar)."""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Subcategory:
    """Uma subcategoria dentro de uma categoria (ex.: 'colares' em 'joias')."""

    slug: str
    name: str
    category_slug: str

    @property
    def url(self) -> str:
        return f"/colecao/{self.category_slug}/{self.slug}/"


@dataclass(frozen=True)
class Category:
    """Uma categoria de topo da sidebar (Joias, Vestuário, Arte)."""

    slug: str
    name: str
    subcategories: tuple[Subcategory, ...] = field(default_factory=tuple)

    @property
    def url(self) -> str:
        return f"/colecao/{self.slug}/"

    def subcategory(self, slug: str) -> Subcategory | None:
        """Retorna a subcategoria pelo slug, ou None se não existir."""
        return next((s for s in self.subcategories if s.slug == slug), None)

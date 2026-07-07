"""Casos de uso do catálogo: agrupar e filtrar peças por categoria/subcategoria."""

from __future__ import annotations

from dataclasses import dataclass

from shahu.domain import Category, Product


@dataclass(frozen=True)
class Catalog:
    """Agregado que reúne categorias e peças e oferece consultas de leitura."""

    categories: tuple[Category, ...]
    products: tuple[Product, ...]

    @classmethod
    def create(cls, categories: list[Category], products: list[Product]) -> Catalog:
        return cls(categories=tuple(categories), products=tuple(products))

    def category(self, slug: str) -> Category | None:
        return next((c for c in self.categories if c.slug == slug), None)

    def in_category(self, category_slug: str) -> list[Product]:
        """Peças de uma categoria (todas as subcategorias)."""
        return [p for p in self.products if p.category == category_slug]

    def in_subcategory(self, category_slug: str, subcategory_slug: str) -> list[Product]:
        return [
            p
            for p in self.products
            if p.category == category_slug and p.subcategory == subcategory_slug
        ]

    def featured(self) -> list[Product]:
        """Peças marcadas como destaque, ordenadas por featured_order (None = fim)."""
        return sorted(
            [p for p in self.products if p.featured and p.available],
            key=lambda p: (p.featured_order is None, p.featured_order or 0, p.name.casefold()),
        )

    def count_in_category(self, category_slug: str) -> int:
        return sum(1 for p in self.products if p.category == category_slug)

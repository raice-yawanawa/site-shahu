"""Prepara os dados da página inicial (história da marca + destaques)."""

from __future__ import annotations

from typing import Any

from shahu.catalog import Catalog
from shahu.domain import SiteContent


def home_context(site: SiteContent, catalog: Catalog, max_featured: int = 8) -> dict[str, Any]:
    """Contexto da home: textos institucionais (de ``site.home``) + peças em destaque."""
    order: list[str] = site.home.get("featured_order") or []
    featured = catalog.featured(order=order)[:max_featured]
    return {
        "home": site.home,
        "featured_products": featured,
    }

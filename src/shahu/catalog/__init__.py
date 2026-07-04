"""Módulo de catálogo: leitura (repository) e organização (service) das peças."""

from shahu.catalog.repository import load_categories, load_products, load_site_content
from shahu.catalog.service import Catalog

__all__ = ["load_categories", "load_products", "load_site_content", "Catalog"]

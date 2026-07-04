"""Configuração de caminhos do projeto.

Centraliza a localização dos diretórios de entrada (conteúdo, templates, estáticos) e de
saída (``public``). Não contém regras de negócio — apenas resolução de caminhos.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

# Raiz do projeto: .../site-shahu-py (config.py -> shahu -> src -> raiz)
PROJECT_ROOT = Path(__file__).resolve().parents[2]


@dataclass(frozen=True)
class Paths:
    """Caminhos usados pelo build. Todos derivados de uma raiz configurável."""

    root: Path = PROJECT_ROOT

    @property
    def content(self) -> Path:
        return self.root / "content"

    @property
    def products(self) -> Path:
        return self.content / "products"

    @property
    def site_file(self) -> Path:
        return self.content / "site.yaml"

    @property
    def categories_file(self) -> Path:
        return self.content / "categories.yaml"

    @property
    def templates(self) -> Path:
        return self.root / "templates"

    @property
    def static(self) -> Path:
        return self.root / "static"

    @property
    def assets(self) -> Path:
        return self.root / "assets"

    @property
    def admin(self) -> Path:
        return self.root / "admin"

    @property
    def output(self) -> Path:
        return self.root / "public"


# Instância padrão para uso comum; testes podem construir uma Paths com outra raiz.
PATHS = Paths()

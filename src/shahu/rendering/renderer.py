"""Wrapper fino sobre o Jinja2: configura ambiente, filtros e contexto global.

Mantém a apresentação isolada do resto do sistema: o ``builder`` só chama ``render``.
"""

from __future__ import annotations

import datetime as _dt
from pathlib import Path
from typing import Any

from jinja2 import Environment, FileSystemLoader, StrictUndefined, select_autoescape

from shahu import __version__
from shahu.domain import SiteContent


def format_brl(value: float | None) -> str:
    """Formata um número como moeda brasileira; None vira 'Sob consulta'."""
    if value is None:
        return "Sob consulta"
    inteiro = f"{value:,.2f}"  # ex.: '1,234.56'
    inteiro = inteiro.replace(",", "_").replace(".", ",").replace("_", ".")
    return f"R$ {inteiro}"


class Renderer:
    """Renderiza templates injetando contexto comum (site, categorias, versão)."""

    def __init__(
        self,
        templates_dir: Path,
        site: SiteContent,
        categories: list[Any],
    ) -> None:
        self._env = Environment(
            loader=FileSystemLoader(str(templates_dir)),
            autoescape=select_autoescape(["html", "xml"]),
            undefined=StrictUndefined,
            trim_blocks=True,
            lstrip_blocks=True,
        )
        self._env.filters["moeda"] = format_brl

        def url(path: str) -> str:
            """Prefixa links/asset paths internos com base_url (para deploy em subcaminho)."""
            if not path or path.startswith(("http://", "https://", "mailto:", "tel:")):
                return path
            return f"{site.base_url}{path}"

        self._globals = {
            "site": site,
            "categories": categories,
            "version": __version__,
            "current_year": _dt.date.today().year,
            "base_url": site.base_url,
            "url": url,
            # Token de cache: muda a cada build, forçando o navegador a baixar
            # os CSS/JS novos após cada publicação (evita conteúdo em cache).
            "asset_version": _dt.datetime.now().strftime("%Y%m%d%H%M%S"),
        }

    def render(self, template_name: str, **context: Any) -> str:
        template = self._env.get_template(template_name)
        return template.render(**self._globals, **context)

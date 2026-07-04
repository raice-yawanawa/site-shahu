"""Gerador de site estático da marca SHAHU RAUTIHU KENEYA.

Pacote organizado em módulos por domínio (ver docs/ARQUITETURA.md):

- ``domain``        modelos e regras puras (sem I/O)
- ``catalog``       leitura e organização das peças/categorias
- ``content_pages`` montagem das páginas de conteúdo (home)
- ``rendering``     renderização de templates Jinja2
- ``builder``       orquestração do build
"""

from pathlib import Path

_version_file = Path(__file__).resolve().parents[2] / "VERSION"
__version__ = (
    _version_file.read_text(encoding="utf-8").strip() if _version_file.exists() else "0.0.0"
)

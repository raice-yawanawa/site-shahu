"""Conteúdo institucional do site (marca, contato, textos da home)."""

from __future__ import annotations

import re
from dataclasses import dataclass, field


@dataclass(frozen=True)
class Contact:
    """Canais de contato da autora."""

    whatsapp: str  # número em formato internacional só com dígitos, ex.: 5511999999999
    instagram: str  # handle sem @, ex.: shahu.rautihu

    @property
    def whatsapp_digits(self) -> str:
        """Número do WhatsApp somente com dígitos (formato exigido pelo wa.me)."""
        return re.sub(r"\D", "", self.whatsapp)

    @property
    def whatsapp_url(self) -> str:
        return f"https://wa.me/{self.whatsapp_digits}"

    @property
    def instagram_handle(self) -> str:
        return self.instagram.lstrip("@")

    @property
    def instagram_url(self) -> str:
        return f"https://instagram.com/{self.instagram_handle}"


@dataclass(frozen=True)
class SiteContent:
    """Configuração e conteúdo geral do site, carregados de ``site.yaml``."""

    brand_name: str
    tagline: str
    logo: str
    contact: Contact
    home: dict = field(default_factory=dict)
    base_url: str = ""

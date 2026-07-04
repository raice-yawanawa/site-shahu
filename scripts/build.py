#!/usr/bin/env python3
"""Ponto de entrada do build do site.

Uso:
    python scripts/build.py

Permite rodar sem instalar o pacote, adicionando ``src`` ao path.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from shahu.builder import main  # noqa: E402

if __name__ == "__main__":
    main()

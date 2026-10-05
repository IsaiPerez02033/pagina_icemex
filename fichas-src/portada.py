"""
Fondo de portada: degradado rojo/negro (assets/portada-fondo.png) + foto de
carretera iluminada en blanco y negro, casi transparente.

    python3 fichas-src/portada.py

Entrada: assets/carretera-noche.png (foto de la ficha original IS-AO1028,
ampliada con IA). Salida: assets/portada.jpg, que usa ficha.html.j2.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageOps

SRC = Path(__file__).resolve().parent
ASSETS = SRC / "assets"

W, H = 1654, 2339   # A4 a 200 ppp: de sobra para un fondo tenue
STRENGTH = 0.26     # opacidad de la foto sobre el fondo
FOCUS_Y = 0.52      # qué altura de la foto (0–1) queda a media página


def smooth(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def build(strength: float = STRENGTH) -> Image.Image:
    base = np.asarray(Image.open(ASSETS / "portada-fondo.png").convert("RGB").resize((W, H), Image.LANCZOS), np.float32) / 255

    road = ImageOps.grayscale(Image.open(ASSETS / "carretera-noche.png"))
    scale = max(W / road.width, H / road.height)
    road = road.resize((round(road.width * scale), round(road.height * scale)), Image.LANCZOS)
    x0 = (road.width - W) // 2
    y0 = min(max(0, round(FOCUS_Y * road.height - H / 2)), road.height - H)
    road = np.asarray(road.crop((x0, y0, x0 + W, y0 + H)), np.float32)[..., None] / 255

    # Arriba (logo y producto) casi sin foto; aparece hacia la mitad de la
    # página y se mantiene bajo el nombre y los datos.
    y = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
    mask = 0.25 + 0.75 * smooth(y, 0.18, 0.55)

    # "Pantalla": las luces aclaran el fondo sin apagar el rojo.
    out = 1 - (1 - base) * (1 - strength * mask * road)
    return Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))


if __name__ == "__main__":
    s = float(sys.argv[1]) if len(sys.argv) > 1 else STRENGTH
    build(s).save(ASSETS / "portada.jpg", "JPEG", quality=90, optimize=True)

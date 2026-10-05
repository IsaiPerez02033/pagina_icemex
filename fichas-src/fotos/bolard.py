"""
Foto de producto del BOLARD F4 A1 dibujada en vector (la del PDF original es
ilegible): silueta y colores de la foto de catálogo del bolardo (difusor
blanco, tubo y remate gris obscuro, placa base) con la guarda de aluminio de
las piezas reales: anillos a lo largo del difusor unidos por barras
verticales.

    python3 fichas-src/fotos/bolard.py

Salida (fondo transparente, la usa data/BOLARD-F4A1.json como "foto:…"):
  fichas-src/fotos/bolard-f4a1.png          bolardo completo
  fichas-src/fotos/bolard-f4a1-cabeza.png   acercamiento al difusor y la guarda
  fichas-src/fotos/bolard-f4a1-vistas.png   los dos juntos (foto principal)
"""

import subprocess
import tempfile
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

S = 10  # px por unidad (la foto de referencia: tubo de 30 u de ancho)
CX = 60  # centro horizontal (u)
R = 15  # radio del difusor y del tubo
TOP, CAP, DIFF_END, POLE_END = 6, 46, 330, 900  # alturas (u)
RINGS = 9  # anillos de la guarda
RING_R, RING_T = 19.5, 2.2  # radio y grosor de cada anillo
TILT = 0.2  # elipses: vista ligeramente desde arriba
W, H = 120, 940


def metal(id_, dark="#2c3238", mid="#56616a", light="#9aa7b0"):
    return f"""<linearGradient id="{id_}" x1="0" x2="1">
      <stop offset="0" stop-color="{dark}"/><stop offset=".22" stop-color="{mid}"/>
      <stop offset=".36" stop-color="{light}"/><stop offset=".55" stop-color="{mid}"/>
      <stop offset=".9" stop-color="{dark}"/><stop offset="1" stop-color="#1d2226"/></linearGradient>"""


def svg() -> str:
    x0, x1 = CX - R, CX + R
    ry = R * TILT
    parts = [f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W * S}" height="{H * S}" viewBox="0 0 {W} {H}">
    <defs>
    {metal("pole")}
    {metal("ring", "#1f2428", "#4a545c", "#a3b0b9")}
    <linearGradient id="diff" x1="0" x2="1">
      <stop offset="0" stop-color="#aab9c4"/><stop offset=".18" stop-color="#dbe8f1"/>
      <stop offset=".4" stop-color="#fbfdff"/><stop offset=".62" stop-color="#e9f2f8"/>
      <stop offset="1" stop-color="#a9b8c3"/></linearGradient>
    <linearGradient id="plate" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#7d8992"/><stop offset="1" stop-color="#4b555d"/></linearGradient>
    <radialGradient id="glow" cx=".42" cy=".5" r=".6">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".55"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
    </defs>"""]

    # Placa base (cuadrada, en perspectiva) con su grosor y 4 tornillos.
    pb, pw, pd, pt = POLE_END + 14, 40, 12, 3
    parts.append(f'<path d="M{CX - pw} {pb} L{CX + pw} {pb} L{CX + pw} {pb + pt} L{CX - pw} {pb + pt} Z" fill="#3a4248"/>')
    parts.append(f'<path d="M{CX - pw} {pb} L{CX + pw} {pb} L{CX + pw - 9} {pb - pd} L{CX - pw + 9} {pb - pd} Z" fill="url(#plate)"/>')
    for bx, by in ((-pw + 8, -2.5), (pw - 8, -2.5), (-pw + 14, -pd + 2.5), (pw - 14, -pd + 2.5)):
        parts.append(f'<ellipse cx="{CX + bx}" cy="{pb + by}" rx="2" ry="1" fill="#2a3035"/>')
    # Tubo del poste, con su base en elipse sobre la placa.
    parts.append(f'<rect x="{x0}" y="{DIFF_END}" width="{2 * R}" height="{POLE_END - DIFF_END + 8}" fill="url(#pole)"/>')
    parts.append(f'<ellipse cx="{CX}" cy="{POLE_END + 8}" rx="{R}" ry="{ry}" fill="url(#pole)"/>')

    # Difusor: de abajo hacia arriba, cada anillo y luego el tramo de difusor
    # que queda arriba de él (su borde frontal tapa la parte de atrás del anillo).
    step = (DIFF_END - CAP) / (RINGS - 1)
    ys = [CAP + i * step for i in range(RINGS)]
    for i in reversed(range(RINGS)):
        y = ys[i]
        parts.append(f'<ellipse cx="{CX}" cy="{y + RING_T}" rx="{RING_R}" ry="{RING_R * TILT}" fill="#1c2125"/>')
        parts.append(f'<rect x="{CX - RING_R}" y="{y}" width="{2 * RING_R}" height="{RING_T}" fill="url(#ring)"/>')
        parts.append(f'<ellipse cx="{CX}" cy="{y}" rx="{RING_R}" ry="{RING_R * TILT}" fill="#6b7780"/>')
        if i == 0:
            break
        top = ys[i - 1]
        parts.append(
            f'<path d="M{x0} {top} L{x0} {y} A{R} {ry} 0 0 0 {x1} {y} L{x1} {top} Z" fill="url(#diff)"/>')
        parts.append(f'<rect x="{x0 + 6}" y="{top + 2}" width="{R}" height="{y - top - 2}" fill="url(#glow)"/>')
    # Barras verticales de la guarda, por delante del difusor.
    for bx in (-0.62 * R, 0.5 * R):
        dy = ry * (1 - (bx / R) ** 2) ** 0.5
        parts.append(f'<rect x="{CX + bx - 0.9}" y="{ys[0] + dy}" width="1.8" height="{ys[-1] - ys[0]}" fill="#2f363c"/>')
        parts.append(f'<rect x="{CX + bx - 0.9}" y="{ys[0] + dy}" width="0.6" height="{ys[-1] - ys[0]}" fill="#6f7b84"/>')
    # Remate superior (tapa del bolardo), con su borde frontal sobre el primer anillo.
    parts.append(f'<path d="M{x0} {TOP} L{x0} {CAP} A{R} {ry} 0 0 0 {x1} {CAP} L{x1} {TOP} Z" fill="url(#pole)"/>')
    parts.append(f'<ellipse cx="{CX}" cy="{TOP}" rx="{R}" ry="{ry}" fill="#7f8c95"/>')
    parts.append(f'<ellipse cx="{CX}" cy="{TOP}" rx="{R * .8}" ry="{ry * .8}" fill="#69757e"/>')
    parts.append("</svg>")
    return "\n".join(parts)


def render(out: Path):
    with tempfile.TemporaryDirectory() as tmp:
        html = Path(tmp) / "b.html"
        html.write_text(f'<!doctype html><style>html,body{{margin:0;background:transparent}}svg{{display:block}}</style>{svg()}')
        png = Path(tmp) / "b.png"
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                        "--default-background-color=00000000", f"--window-size={W * S},{H * S}",
                        f"--screenshot={png}", html.as_uri()], check=True, capture_output=True, timeout=120)
        img = Image.open(png).convert("RGBA")
    img = img.crop(img.getchannel("A").getbbox())
    img.save(out)
    return img


if __name__ == "__main__":
    full = render(HERE / "bolard-f4a1.png")
    # Cabeza: remate, difusor con la guarda y el arranque del tubo.
    head = full.crop((0, 0, full.width, round(full.height * (DIFF_END + 40 - TOP) / (H - TOP - 10))))
    # El tubo cortado se desvanece hacia abajo en vez de terminar en recto.
    a = head.getchannel("A")
    n = round(head.height * 0.08)
    fade = Image.linear_gradient("L").resize((head.width, n)).transpose(Image.FLIP_TOP_BOTTOM)
    a.paste(Image.composite(a.crop((0, head.height - n, head.width, head.height)), fade, fade), (0, head.height - n))
    head.putalpha(a)
    head.save(HERE / "bolard-f4a1-cabeza.png")
    # Portada: bolardo completo y, a su lado, la cabeza ampliada.
    big = head.resize((round(head.width * 1.9), round(head.height * 1.9)), Image.LANCZOS)
    gap = round(full.width * 0.55)
    views = Image.new("RGBA", (full.width + gap + big.width, full.height), (0, 0, 0, 0))
    views.alpha_composite(full, (0, 0))
    views.alpha_composite(big, (full.width + gap, round(full.height * 0.04)))
    views.save(HERE / "bolard-f4a1-vistas.png")
    print(full.size, head.size, views.size)

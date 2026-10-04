"""
Genera lib/fichas-data.json y las imágenes public/fichas/img/*.webp a partir
de las fichas técnicas en public/fichas/*.pdf y su índice index.json.

Uso (requiere pymupdf, pillow y pdftoppm de poppler):
    python3 scripts/build-fichas.py

Volver a correrlo cada vez que se agreguen o cambien fichas PDF.
"""

import io
import json
import re
import subprocess
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FICHAS = ROOT / "public" / "fichas"
IMG = FICHAS / "img"
OUT = ROOT / "lib" / "fichas-data.json"

# Línea del sitio según el prefijo del código del catálogo.
LINE_BY_PREFIX = {
    "AL": "AL", "IS": "IS", "LU": "LU", "PP": "LU", "ICELUM": "LU",
    "BOLARD": "LU", "RF": "RF", "FL": "LC", "LC": "LC", "POSTES": "PT",
}

# Nombres del índice sin acentos → nombre correcto para mostrar.
NAME_FIXES = {
    "Lampara Solar con Sensor PIR": "Lámpara Solar con Sensor PIR",
    "Lampara Solar con Sensor PIR II": "Lámpara Solar con Sensor PIR II",
    "Contemporanea": "Contemporánea",
    "Postes Recto y Conico Circular": "Postes Recto y Cónico Circular",
    "Postes Especiales (Cisne, Gaviota, Queretaro, London, Cordova, Puebla, Alameda)":
        "Postes Especiales (Cisne, Gaviota, Querétaro, London, Córdova, Puebla, Alameda)",
    "Brazos (Aleron, Percha, Canada, Cordova, Centro Historico, Vigilancia, Escuadra, Z, Matias Romero)":
        "Brazos (Alerón, Percha, Canadá, Córdova, Centro Histórico, Vigilancia, Escuadra, Z, Matías Romero)",
    "Rizos, Mensulas y Bancas (Espanola, Italiana, Francesa, Alemana)":
        "Rizos, Ménsulas y Bancas (Española, Italiana, Francesa, Alemana)",
    "Accesorios (Portalampara, Adaptadores, Fotocelda, Malla)":
        "Accesorios (Portalámpara, Adaptadores, Fotocelda, Malla)",
    "Esferas, Acrilicos y Cristales": "Esferas, Acrílicos y Cristales",
    "Senaliticas Industriales": "Señaléticas Industriales",
    "Luminario Vial ICEMEX 02V-100": "Luminario Vial ICEMEX 02V-100",
}

# Etiquetas de aplicación inferidas del texto (mismas claves que tagNames).
TAG_RULES = {
    "vialidad": r"\b(vialidad(es)?|vial(es)?|calles?|avenidas?|carreteras?|autopistas?|perif[eé]ricos?)\b",
    "parques": r"\b(parques?|jard[ií]n(es)?|plazas?|andador(es)?|pasillos?)\b",
    "tuneles": r"\bt[uú]nel(es)?\b",
    "industrial": r"\b(industrial(es)?|naves?|bodegas?|f[aá]bricas|almac[eé]n(es)?|high bay)\b",
    "comercial": r"\b(comercial(es)?|oficinas?|tiendas?|locales|escuelas?|universidad(es)?)\b",
    "solar": r"\b(solar(es)?|fotovoltaic[oa]s?)\b",
    "decorativo": r"\b(decorativ[oa]s?|colonial|ornamental(es)?|punta de poste)\b",
    "residencial": r"\b(residencial(es)?|fraccionamientos?|cotos?|condominios?)\b",
}

# Bloques que se repiten en todas las fichas y no aportan.
NOISE = re.compile(
    r"^(fabricamos perfecci[oó]n.*|nunca imitaciones|certificaciones: iso.*|"
    r"oficina \(593\).*|icemexjorobas@gmail\.com|www\..*)$",
    re.I,
)


def clean(text: str) -> str:
    text = text.replace("﻿", "").replace("­", "")
    text = re.sub(r"\s*\n\s*", " ", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip(" -•·")


def is_heading(t: str) -> bool:
    letters = re.sub(r"[^A-Za-zÁÉÍÓÚÑáéíóúñ]", "", t)
    return 2 < len(t) <= 40 and letters.isupper() and len(t.split()) <= 5


# "TECNOLOGÍA Tecnología Led Philips…" → encabezado + párrafo.
LEADING_HEADING = re.compile(r"^([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ ]{3,30})\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ].*)$")


def is_table_noise(t: str) -> bool:
    """Fragmentos de tablas de medidas: muchos números, comillas o unidades."""
    digits = sum(c.isdigit() for c in t)
    marks = t.count('"') + t.count("°") + t.count("*")
    return digits / max(len(t), 1) > 0.3 or marks >= 4


def extract_blocks(doc, code: str, name: str):
    seen, blocks = set(), []
    for page in doc:
        for b in page.get_text("blocks", sort=True):
            t = clean(b[4])
            key = t.lower()
            if (
                len(t) < 3
                or key in seen
                or key == code.lower()
                or key == name.lower()
                or NOISE.match(t)
                or is_table_noise(t)
            ):
                continue
            seen.add(key)
            m = LEADING_HEADING.match(t)
            if m and not is_heading(t):
                blocks.append({"h": m.group(1).strip().capitalize()})
                t = m.group(2)
            if is_heading(t):
                blocks.append({"h": t.capitalize()})
            elif len(t) >= 25 or ":" in t:
                # Lo corto sin ":" suele ser un pedazo de tabla o etiqueta suelta.
                blocks.append({"t": t})
    # Encabezados seguidos (sin texto debajo) se descartan.
    out = []
    for i, b in enumerate(blocks):
        if "h" in b and (i + 1 == len(blocks) or "h" in blocks[i + 1]):
            continue
        out.append(b)
    # Fichas largas (5 páginas): se limita a ~2,400 caracteres.
    total, trimmed = 0, []
    for b in out:
        total += len(b.get("t", b.get("h", "")))
        if total > 2400:
            break
        trimmed.append(b)
    return trimmed


def render_page(pdf: Path, width: int) -> Image.Image:
    png = subprocess.run(
        ["pdftoppm", "-f", "1", "-l", "1", "-scale-to-x", str(width),
         "-scale-to-y", "-1", "-png", str(pdf)],
        capture_output=True, check=True,
    ).stdout
    return Image.open(io.BytesIO(png)).convert("RGB")


def main():
    IMG.mkdir(exist_ok=True)
    index = json.loads((FICHAS / "index.json").read_text())
    data = []
    for entry in index:
        code = entry["codigo"]
        pdf = FICHAS / entry["archivo"]
        name = NAME_FIXES.get(entry["nombre"], entry["nombre"])
        line = LINE_BY_PREFIX.get(code.split("-")[0], "AC")
        doc = pymupdf.open(pdf)
        blocks = extract_blocks(doc, code, name)
        haystack = f"{name} {entry['texto']}".lower()
        tags = [tag for tag, rx in TAG_RULES.items() if re.search(rx, haystack)]
        if line == "IS" and "solar" not in tags:
            tags.append("solar")

        big = render_page(pdf, 1000)
        big.save(IMG / f"{code}.webp", "WEBP", quality=72, method=6)
        thumb = big.copy()
        thumb.thumbnail((360, 10_000))
        thumb.save(IMG / f"{code}-thumb.webp", "WEBP", quality=68, method=6)

        summary = next((b["t"] for b in blocks if "t" in b and len(b["t"]) > 40), "")
        data.append({
            "code": code,
            "name": name,
            "line": line,
            "tags": tags,
            "pages": entry["paginas"],
            "pdf": f"/fichas/{entry['archivo']}",
            "image": {"src": f"/fichas/img/{code}.webp", "width": big.width, "height": big.height},
            "thumb": {"src": f"/fichas/img/{code}-thumb.webp", "width": thumb.width, "height": thumb.height},
            "summary": summary[:180],
            "blocks": blocks,
        })
        print(f"{code:18} {line}  {len(blocks):2} bloques  {','.join(tags)}")

    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    print(f"\n{len(data)} fichas → {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

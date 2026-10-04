"""
Genera lib/fichas-data.json (datos de las 127 fichas para el sitio) y las
portadas public/fichas/img/*.webp a partir de:

  - fichas-src/data/<CODIGO>.json  → contenido de cada ficha (el mismo que
    usa fichas-src/build.py para generar el PDF con la plantilla ICEMEX).
  - public/fichas/index.json       → nombre, archivo y páginas del catálogo.
  - public/productos/<CODIGO>.webp → foto del producto (la genera build.py).

Uso (requiere pillow y pdftoppm de poppler):
    python3 fichas-src/build.py      # 1) PDFs + fotos
    python3 scripts/build-fichas.py  # 2) datos para la web

Volver a correrlo cada vez que se agreguen o cambien fichas.
"""

import io
import json
import re
import subprocess
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FICHAS = ROOT / "public" / "fichas"
PHOTOS = ROOT / "public" / "productos"
DATA = ROOT / "fichas-src" / "data"
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


def img_info(path: Path, url: str) -> dict:
    with Image.open(path) as im:
        return {"src": url, "width": im.width, "height": im.height}


def render_cover(pdf: Path, code: str) -> tuple[dict, dict]:
    """Portada de la ficha PDF (vista previa y imagen para redes)."""
    png = subprocess.run(
        ["pdftoppm", "-f", "1", "-l", "1", "-scale-to-x", "1000",
         "-scale-to-y", "-1", "-png", str(pdf)],
        capture_output=True, check=True,
    ).stdout
    big = Image.open(io.BytesIO(png)).convert("RGB")
    big.save(IMG / f"{code}.webp", "WEBP", quality=74, method=6)
    thumb = big.copy()
    thumb.thumbnail((360, 10_000))
    thumb.save(IMG / f"{code}-thumb.webp", "WEBP", quality=70, method=6)
    return (
        {"src": f"/fichas/img/{code}.webp", "width": big.width, "height": big.height},
        {"src": f"/fichas/img/{code}-thumb.webp", "width": thumb.width, "height": thumb.height},
    )


def summary_of(paragraph: str, limit: int = 200) -> str:
    """Primera(s) oración(es) del primer párrafo, sin cortar palabras."""
    if len(paragraph) <= limit:
        return paragraph
    cut = paragraph[:limit]
    end = cut.rfind(". ")
    if end > 80:
        return cut[: end + 1]
    return cut[: cut.rfind(" ")].rstrip(",;:") + "…"


def warranty_text(w: dict) -> str:
    unit = w.get("unit") or ("año" if w["y"] == 1 else "años")
    return f"{w['y']} {unit} {w['on']}".strip()


def main():
    IMG.mkdir(exist_ok=True)
    for old in IMG.glob("*.webp"):
        old.unlink()
    index = json.loads((FICHAS / "index.json").read_text())
    data = []
    for entry in index:
        code = entry["codigo"]
        src = json.loads((DATA / f"{code}.json").read_text())
        name = NAME_FIXES.get(entry["nombre"], entry["nombre"])
        line = LINE_BY_PREFIX.get(code.split("-")[0], "AC")
        pdf = FICHAS / entry["archivo"]

        description = src.get("description", [])
        applications = src.get("applications", [])
        haystack = " ".join([name, src.get("kind", ""), *description, *applications]).lower()
        tags = [tag for tag, rx in TAG_RULES.items() if re.search(rx, haystack)]
        if line == "IS" and "solar" not in tags:
            tags.append("solar")

        cover, cover_thumb = render_cover(pdf, code)
        kpis = (src.get("kpis2") or src.get("kpis", []) + src.get("kpis_extra", []))[:6]
        dims = (src.get("dims") or {}).get("rows", [])

        data.append({
            "code": code,
            "name": name,
            "line": line,
            "tags": tags,
            "pages": entry["paginas"],
            "pdf": f"/fichas/{entry['archivo']}",
            "image": img_info(PHOTOS / f"{code}.webp", f"/productos/{code}.webp"),
            "thumb": img_info(PHOTOS / f"{code}-thumb.webp", f"/productos/{code}-thumb.webp"),
            "cover": cover,
            "coverThumb": cover_thumb,
            "model": src["model"],
            "kind": src.get("kind", ""),
            "power": src.get("power", ""),
            "variant": src.get("variant", ""),
            "summary": summary_of(description[0]) if description else "",
            "description": description,
            "kpis": [{"v": k["v"], "u": k.get("u", ""), "l": k["l"]} for k in kpis],
            "features": [{"t": f["t"], "d": f["d"]} for f in src.get("features", [])],
            "advantages": src.get("advantages", []),
            "specs": src.get("specs", []),
            "applications": applications,
            "warranty": [warranty_text(w) for w in src.get("warranty", [])],
            "certs": src.get("certs", []),
            "dims": dims,
            "mount": src.get("mount", ""),
            "isLuminaire": src.get("is_lum", True),
        })
        print(f"{code:18} {line}  {','.join(tags)}")

    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    print(f"\n{len(data)} fichas → {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

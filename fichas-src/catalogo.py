"""
Catálogo completo: portada, contenido, separador por línea de producto, las
127 fichas (public/fichas) y contraportada, en un solo PDF. También deja las
fichas sueltas ordenadas en carpetas por sección.

    python3 fichas-src/catalogo.py [CARPETA]   # default: fichas-src/build/catalogo

Salida en CARPETA:
  Catalogo_ICEMEX_2026.pdf          calidad completa (impresión)
  Catalogo_ICEMEX_2026_ligero.pdf   fotos a ~130 ppp (para enviar)
  Fichas técnicas/NN Sección/CÓDIGO MODELO.pdf

y para el sitio: public/Catalogo_ICEMEX2026.pdf (la versión ligera, que se
descarga en /catalogo), public/catalogo-portada.webp y
lib/catalogo-paginas.json (páginas de cada ficha en el catálogo).

Correr después de build.py y scripts/build-fichas.py (lee lib/fichas-data.json
para la línea de cada ficha y su orden en el catálogo).
"""

import hashlib
import io
import json
import math
import re
import shutil
import sys
from pathlib import Path

import pymupdf
from jinja2 import Environment, FileSystemLoader
from PIL import Image

from build import render_pdf

SRC = Path(__file__).resolve().parent
ROOT = SRC.parent
FICHAS = ROOT / "public" / "fichas"
PHOTOS = ROOT / "public" / "productos"
YEAR = 2026
NAME = f"Catalogo_ICEMEX_{YEAR}"
WEB_PDF = ROOT / "public" / f"Catalogo_ICEMEX{YEAR}.pdf"
WEB_COVER = ROOT / "public" / "catalogo-portada.webp"
WEB_PAGES = ROOT / "lib" / "catalogo-paginas.json"
LINK = "https://catalogo.icemex.invalid/p/"  # se convierte en salto a página

# Mismas líneas que el sitio (lib/products.ts), con texto para el separador.
SECTIONS = [
    ("AL", "Alumbrado público", "Alumbrado<br>público",
     "Luminarias LED para vialidades, avenidas, autopistas y alumbrado municipal.",
     ["AL-LT1002", "AL-UL1005", "AL-LVI006"]),
    ("IS", "Iluminación solar", "Iluminación<br>solar",
     "Luminarias autónomas con panel fotovoltaico y batería: sin cableado ni consumo de la red eléctrica.",
     ["IS-AO1027", "IS-AO1030", "IS-LS1004"]),
    ("LU", "Luminarios urbanos", "Luminarios<br>urbanos",
     "Faroles de punta de poste, bolardos y columnas luminosas para parques, plazas y jardines.",
     ["PP-LC1016", "LU-LP1013", "PP-UL1003"]),
    ("RF", "Reflectores", "Reflectores",
     "Reflectores, campanas industriales y luminarios de muro para estadios, naves y fachadas.",
     ["RF-RE1003", "RF-UFO1007", "RF-RE1005"]),
    ("LC", "Luminarios comerciales", "Luminarios<br>comerciales",
     "Gabinetes, paneles, downlights y lámparas LED para oficinas, comercios e industria.",
     ["LC-GEM1009", "LC-ES1016", "LC-LRD1015"]),
    ("PT", "Postes y postería", "Postes y<br>postería",
     "Postes metálicos rectos, cónicos y ornamentales de uno y dos brazos.",
     ["lineas/postes", "POSTES-RC-CC"]),
    ("AC", "Brazos y herrajes", "Brazos y<br>herrajes",
     "Brazos, anclas, bases de concreto, mobiliario urbano, refacciones y señalización.",
     ["BRAZOS", "BAS-0010", "ESFERAS-CRISTALES"]),
]

# Portada: (código, izquierda, ancho, alto, abajo) en mm dentro del collage.
COLLAGE = [
    ("IS-AO1027", 30, 62, 66, 44),
    ("LU-LP1013", 118, 34, 62, 40),
    ("PP-LC1016", 4, 42, 90, 8),
    ("RF-RE1003", 144, 46, 50, 12),
    ("AL-LT1002", 48, 96, 56, 2),
]

ROW_MM = 5.2      # fila del contenido
SEC_MM = 13.5     # encabezado de sección en el contenido
TOC_BUDGET = 232  # alto útil de una página de contenido


def photo(code):
    if "/" in code:  # foto del sitio, p. ej. lineas/postes (solo 3 postes)
        return f"../public/{code}.webp"
    return "../" + (PHOTOS / f"{code}.webp").relative_to(ROOT).as_posix()


def paginate_toc(sections):
    """Reparte las fichas en páginas de contenido, a dos columnas; una sección
    puede continuar en la página siguiente."""
    pages, cur, left = [], [], TOC_BUDGET
    for s in sections:
        items, cont = list(s["items"]), False
        while items:
            rows = int((left - SEC_MM) // ROW_MM)
            if rows < 2:
                pages.append(cur)
                cur, left = [], TOC_BUDGET
                continue
            take = items[:rows * 2]
            items = items[len(take):]
            half = math.ceil(len(take) / 2)
            cur.append({"s": s, "cont": cont, "cols": [take[:half], take[half:]]})
            left -= SEC_MM + half * ROW_MM
            cont = True
    pages.append(cur)
    return pages


def safe(name):
    return re.sub(r'[/\\:*?"<>|«»]', "", name).strip()


def number_overlay(n_pages, skip, tmp):
    """PDF con solo el número de página (misma fuente que las fichas)."""
    body = "".join(
        f'<div class="pg">{"" if i in skip else i + 1}</div>' for i in range(n_pages))
    html = SRC / "_numeros.html"
    html.write_text(
        '<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="fonts/fonts.css"><style>'
        "@page{size:A4;margin:0}*{margin:0;padding:0;box-sizing:border-box}html,body{background:transparent}"
        ".pg{width:210mm;height:297mm;position:relative;page-break-after:always;"
        "font:600 6.8pt Inter,sans-serif;color:#8a8d95;text-align:center}"
        ".pg:last-child{page-break-after:auto}"
        ".pg{line-height:1;padding-top:291.5mm}</style>" + body)
    out = tmp / "numeros.pdf"
    render_pdf(html, out)
    html.unlink()
    return out


def lighten(src: Path, dst: Path, max_px=1100, quality=68):
    """Versión ligera: imágenes a ≤ max_px (≈130 ppp a página completa) y
    re-comprimidas más fuerte."""
    d = pymupdf.open(src)
    smasks = set()
    for x in range(1, d.xref_length()):
        t, v = d.xref_get_key(x, "SMask")
        if t == "xref":
            smasks.add(int(v.split()[0]))
    for x in range(1, d.xref_length()):
        if d.xref_get_key(x, "Subtype")[1] != "/Image":
            continue
        try:
            pix = pymupdf.Pixmap(d, x)
        except Exception:
            continue
        if max(pix.width, pix.height) < 300:
            continue
        gray = x in smasks
        if gray:
            if pix.n != 1:
                continue
            im = Image.frombytes("L", (pix.width, pix.height), pix.samples)
        else:
            if pix.alpha:
                pix = pymupdf.Pixmap(pix, 0)
            if pix.colorspace is None or pix.colorspace.n != 3:
                pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
            im = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        im.thumbnail((max_px, max_px), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=quality + (10 if gray else 0), optimize=True)
        if len(buf.getvalue()) >= len(d.xref_stream_raw(x)):
            continue
        d.update_stream(x, buf.getvalue(), compress=False)
        d.xref_set_key(x, "Filter", "/DCTDecode")
        d.xref_set_key(x, "DecodeParms", "null")
        d.xref_set_key(x, "Width", str(im.width))
        d.xref_set_key(x, "Height", str(im.height))
        d.xref_set_key(x, "BitsPerComponent", "8")
        if not gray:
            d.xref_set_key(x, "ColorSpace", "/DeviceRGB")
    d.save(dst, garbage=4, deflate=True, use_objstms=1)


def main(out: Path):
    fichas = json.loads((ROOT / "lib" / "fichas-data.json").read_text())
    sections = []
    for i, (line, name, title, desc, pics) in enumerate(SECTIONS):
        items = sorted(
            (f for f in fichas if f["line"] == line),
            key=lambda f: (min(f["pages"] or [999]), f["code"]))
        items = [{"code": f["code"], "model": f["model"],
                  "n": pymupdf.open(FICHAS / f"{f['code']}.pdf").page_count} for f in items]
        sections.append({"line": line, "num": f"{i + 1:02d}", "name": name, "title": title,
                         "desc": desc, "photos": [photo(c) for c in pics], "items": items})
    total = sum(len(s["items"]) for s in sections)
    assert total == len(fichas), "hay fichas sin sección"

    # Números de página: portada, contenido, y por sección separador + fichas.
    toc = paginate_toc(sections)
    page = 1 + len(toc) + 1
    for s in sections:
        s["page"] = page
        page += 1
        for f in s["items"]:
            f["page"] = page
            page += f["n"]
        s["last"] = page - 1
    n_pages = page  # + contraportada

    collage = [{"src": photo(c), "style": f"left:{x}mm;width:{w}mm;height:{h}mm;bottom:{b}mm"}
               for c, x, w, h, b in COLLAGE]
    env = Environment(loader=FileSystemLoader(SRC), autoescape=True)
    html = SRC / "_catalogo.html"
    html.write_text(env.get_template("catalogo.html.j2").render(
        year=YEAR, sections=sections, toc_pages=toc, total=total, collage=collage,
        link=LINK, row_mm=ROW_MM))
    tmp = SRC / "build"
    tmp.mkdir(exist_ok=True)
    extra = tmp / "catalogo-extra.pdf"
    render_pdf(html, extra)
    html.unlink()

    # Ensamblado.
    if PREVIEW:
        return print(extra)
    ex = pymupdf.open(extra)
    assert ex.page_count == 1 + len(toc) + len(sections) + 1, ex.page_count
    doc = pymupdf.open()
    outline = [[1, "Portada", 1], [1, "Contenido", 2]]
    doc.insert_pdf(ex, from_page=0, to_page=len(toc))
    for i, s in enumerate(sections):
        k = 1 + len(toc) + i
        doc.insert_pdf(ex, from_page=k, to_page=k)
        outline.append([1, f"{s['num']} {s['name']}", s["page"]])
        for f in s["items"]:
            doc.insert_pdf(pymupdf.open(FICHAS / f"{f['code']}.pdf"))
            outline.append([2, f"{f['code']} · {f['model']}", f["page"]])
    doc.insert_pdf(ex, from_page=ex.page_count - 1)
    assert doc.page_count == n_pages, (doc.page_count, n_pages)

    # Número de página en todas menos portada y contraportada.
    nums = pymupdf.open(number_overlay(n_pages, {0, n_pages - 1}, tmp))
    assert nums.page_count == n_pages, nums.page_count
    for i, pg in enumerate(doc):
        if 0 < i < n_pages - 1:
            pg.show_pdf_page(pg.rect, nums, i, overlay=True)

    # Enlaces del contenido → salto a la página.
    for i in range(1, 1 + len(toc)):
        pg = doc[i]
        for ln in pg.get_links():
            if ln.get("uri", "").startswith(LINK):
                target = int(ln["uri"][len(LINK):]) - 1
                pg.delete_link(ln)
                pg.insert_link({"kind": pymupdf.LINK_GOTO, "from": ln["from"], "page": target,
                                "to": pymupdf.Point(0, 0)})
    doc.set_toc(outline)
    doc.set_metadata({"title": f"Catálogo ICEMEX {YEAR}", "author": "ICEMEX",
                      "subject": "Catálogo de productos y fichas técnicas"})

    out.mkdir(parents=True, exist_ok=True)
    full = out / f"{NAME}.pdf"
    doc.save(full, garbage=4, deflate=True, use_objstms=1)
    doc.close()
    light = out / f"{NAME}_ligero.pdf"
    lighten(full, light)

    # Sitio: descarga, portada y páginas de cada ficha.
    shutil.copy2(light, WEB_PDF)
    pix = pymupdf.open(full)[0].get_pixmap(dpi=110)
    cover = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    cover.thumbnail((720, 1020), Image.LANCZOS)
    cover.save(WEB_COVER, "WEBP", quality=86, method=6)
    pages = {f["code"]: [f["page"], f["page"] + f["n"] - 1] for s in sections for f in s["items"]}
    v = lambda p: hashlib.md5(p.read_bytes()).hexdigest()[:8]
    WEB_PAGES.write_text(json.dumps({
        "pdf": f"/{WEB_PDF.name}?v={v(WEB_PDF)}", "pages": n_pages,
        "mb": round(light.stat().st_size / 1e6),
        "cover": {"src": f"/{WEB_COVER.name}?v={v(WEB_COVER)}", "width": cover.width, "height": cover.height},
        "fichas": pages}, indent=1) + "\n")

    # Fichas sueltas por sección.
    folder = out / "Fichas técnicas"
    shutil.rmtree(folder, ignore_errors=True)
    for s in sections:
        d = folder / f"{s['num']} {s['name']}"
        d.mkdir(parents=True)
        for f in s["items"]:
            model = safe(f["model"])
            same = re.sub(r"\W", "", model).upper() == re.sub(r"\W", "", f["code"]).upper()
            shutil.copy2(FICHAS / f"{f['code']}.pdf", d / (f"{f['code']}.pdf" if same else f"{f['code']} {model}.pdf"))

    for p in (full, light):
        print(f"{p.name:34} {p.stat().st_size / 1e6:6.1f} MB  {n_pages} págs")
    print(f"Fichas técnicas/: {total} PDF en {len(sections)} carpetas")


PREVIEW = "--preview" in sys.argv  # solo las páginas propias del catálogo

if __name__ == "__main__":
    if PREVIEW:
        sys.argv.remove("--preview")
    main(Path(sys.argv[1]) if len(sys.argv) > 1 else SRC / "build" / "catalogo")

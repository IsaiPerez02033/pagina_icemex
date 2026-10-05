"""
Catálogo completo: portada, contenido, separador por sección, las fichas
(public/fichas) y contraportada, en un solo PDF. También deja las fichas
sueltas ordenadas en carpetas por sección. Hay dos catálogos: el general de
iluminación (secciones = líneas del sitio) y el de videovigilancia (línea CV,
secciones = "group" de cada ficha de cámara).

    python3 fichas-src/catalogo.py [camaras] [CARPETA]   # default: fichas-src/build/catalogo[-camaras]

Salida en CARPETA (NOMBRE = Catalogo_ICEMEX_2026 o Catalogo_Videovigilancia_ICEMEX_2026):
  NOMBRE.pdf          calidad completa (impresión)
  NOMBRE_ligero.pdf   fotos a ~130 ppp (para enviar)
  Fichas técnicas/NN Sección/CÓDIGO MODELO.pdf

y para el sitio: la versión ligera en public/ (se descarga en /catalogo), su
portada en webp y lib/catalogo-*.json (páginas de cada ficha en el catálogo).

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
LINK = "https://catalogo.icemex.invalid/p/"  # se convierte en salto a página

# Mismas líneas que el sitio (lib/products.ts), con texto para el separador.
# Las cámaras (CV) van en su propio catálogo.
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

# Catálogo de videovigilancia: secciones por "group" de la ficha (camaras.py).
CAMERA_SECTIONS = [
    ("Cámaras duales", "Cámaras duales", "Cámaras<br>duales",
     "Dos puntos de vigilancia en un solo equipo: doble lente, doble visión.",
     ["CV-Q24", "CV-Q29"]),
    ("Cámaras para exterior", "Cámaras para exterior", "Cámaras para<br>exterior",
     "Domos PTZ y cámaras tipo bala con protección IP66 para vigilar 24/7 en zonas abiertas.",
     ["CV-C05P", "CV-Q35", "CV-Q32"]),
    ("Cámaras para interior", "Cámaras para interior", "Cámaras para<br>interior",
     "Monitoreo discreto en tiempo real para el interior de tu hogar o negocio.",
     ["CV-TV629", "CV-TV628", "CV-Q26"]),
    ("Focos cámara", "Focos cámara", "Focos<br>cámara",
     "Seguridad disimulada: cámara PTZ integrada en un foco de instalación sencilla.",
     ["CV-Q17", "CV-Q19", "CV-Q05"]),
    ("Cámaras solares", "Cámaras solares", "Cámaras<br>solares",
     "Vigilancia autónoma 24/7 con energía solar, sin depender del cableado eléctrico.",
     ["CV-Q25", "CV-D21S"]),
]

CAMERA_COLLAGE = [
    ("CV-Q35", 0, 58, 54, 50),
    ("CV-Q24", 136, 46, 56, 52),
    ("CV-Q19", 12, 36, 70, 0),
    ("CV-D21S", 132, 56, 58, 0),
    ("CV-C07", 54, 80, 98, 0),
]


def group_of(f):
    return json.loads((SRC / "data" / f"{f['code']}.json").read_text()).get("group")


CATALOGS = {
    "icemex": {
        "name": f"Catalogo_ICEMEX_{YEAR}",
        "web_pdf": ROOT / "public" / f"Catalogo_ICEMEX{YEAR}.pdf",
        "web_cover": ROOT / "public" / "catalogo-portada.webp",
        "web_pages": ROOT / "lib" / "catalogo-paginas.json",
        "out": SRC / "build" / "catalogo",
        "sections": SECTIONS, "collage": COLLAGE,
        "member": lambda f: f["line"], "include": lambda f: f["line"] != "CV",
        "label": "model",
        "doc_title": f"Catálogo ICEMEX {YEAR}", "tag": "Catálogo de productos",
        "kind": "Iluminación LED, solar y urbana", "headline": "Catálogo", "unit": "líneas de producto",
        "subject": "Catálogo de productos y fichas técnicas",
    },
    "camaras": {
        "name": f"Catalogo_Videovigilancia_ICEMEX_{YEAR}",
        "web_pdf": ROOT / "public" / f"Catalogo_Videovigilancia_ICEMEX{YEAR}.pdf",
        "web_cover": ROOT / "public" / "catalogo-camaras-portada.webp",
        "web_pages": ROOT / "lib" / "catalogo-camaras.json",
        "out": SRC / "build" / "catalogo-camaras",
        "sections": CAMERA_SECTIONS, "collage": CAMERA_COLLAGE,
        "member": group_of, "include": lambda f: f["line"] == "CV",
        "label": "name",  # el modelo (Q24) ya va en el código (CV-Q24)
        "doc_title": f"Catálogo de Videovigilancia ICEMEX {YEAR}", "tag": "Catálogo de videovigilancia",
        "kind": "Cámaras de seguridad y videovigilancia", "headline": "Cámaras", "unit": "categorías",
        "subject": "Catálogo de cámaras de seguridad y fichas técnicas",
    },
}

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


def main(cat: dict, out: Path):
    fichas = [f for f in json.loads((ROOT / "lib" / "fichas-data.json").read_text()) if cat["include"](f)]
    sections = []
    for i, (line, name, title, desc, pics) in enumerate(cat["sections"]):
        items = sorted(
            (f for f in fichas if cat["member"](f) == line),
            key=lambda f: (min(f["pages"] or [999]), f["code"]))
        items = [{"code": f["code"], "model": f[cat["label"]],
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
               for c, x, w, h, b in cat["collage"]]
    env = Environment(loader=FileSystemLoader(SRC), autoescape=True)
    html = SRC / "_catalogo.html"
    html.write_text(env.get_template("catalogo.html.j2").render(
        year=YEAR, sections=sections, toc_pages=toc, total=total, collage=collage,
        link=LINK, row_mm=ROW_MM, **{k: cat[k] for k in ("doc_title", "tag", "kind", "headline", "unit")}))
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
    doc.set_metadata({"title": cat["doc_title"], "author": "ICEMEX", "subject": cat["subject"]})

    out.mkdir(parents=True, exist_ok=True)
    full = out / f"{cat['name']}.pdf"
    doc.save(full, garbage=4, deflate=True, use_objstms=1)
    doc.close()
    light = out / f"{cat['name']}_ligero.pdf"
    lighten(full, light)

    # Sitio: descarga, portada y páginas de cada ficha.
    WEB_PDF, WEB_COVER = cat["web_pdf"], cat["web_cover"]
    shutil.copy2(light, WEB_PDF)
    pix = pymupdf.open(full)[0].get_pixmap(dpi=110)
    cover = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    cover.thumbnail((720, 1020), Image.LANCZOS)
    cover.save(WEB_COVER, "WEBP", quality=86, method=6)
    pages = {f["code"]: [f["page"], f["page"] + f["n"] - 1] for s in sections for f in s["items"]}
    v = lambda p: hashlib.md5(p.read_bytes()).hexdigest()[:8]
    cat["web_pages"].write_text(json.dumps({
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
    args = [a for a in sys.argv[1:] if a != "--preview"]
    cat = CATALOGS["icemex"]
    if args and args[0] in CATALOGS:
        cat = CATALOGS[args.pop(0)]
    main(cat, Path(args[0]) if args else cat["out"])

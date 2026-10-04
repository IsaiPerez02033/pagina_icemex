"""
Genera las fichas técnicas ICEMEX con la plantilla oficial (4 páginas).

    python3 fichas-src/build.py                 # todas
    python3 fichas-src/build.py AL-LT1002 ...   # solo algunas

Entrada:  fichas-src/data/<CODIGO>.json   (contenido de cada ficha)
          fichas-src/originales/<CODIGO>.pdf (fichas anteriores: fuente de fotos)
Salida:   public/fichas/<CODIGO>.pdf
          public/productos/<CODIGO>.webp y <CODIGO>-thumb.webp (foto para la web)

Requiere: pymupdf, pillow, jinja2 y Google Chrome instalado.
Las imágenes se referencian como "p<página>_x<xref>" del PDF original
(o "<OTRO-CODIGO>:p<página>_x<xref>" para tomarlas de otra ficha).
"""

import copy
import io
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import pymupdf
from jinja2 import Environment, FileSystemLoader
from PIL import Image, ImageFilter, ImageOps

SRC = Path(__file__).resolve().parent
ROOT = SRC.parent
BUILD = SRC / "build"
OUT_PDF = ROOT / "public" / "fichas"
OUT_WEB = ROOT / "public" / "productos"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

TEMP_COLORS = {  # tono aproximado para la muestra de temperatura de color
    2700: "#ffb46b", 3000: "#ffc58a", 3500: "#ffd6a8", 4000: "#ffe4c4",
    4500: "#fff0de", 5000: "#fff6ec", 5700: "#f4f5ff", 6000: "#eef1ff",
    6500: "#e3e9ff",
}


def temp_label(k: int) -> str:
    if k <= 3300:
        return "Blanco cálido"
    if k <= 4600:
        return "Blanco neutro"
    return "Blanco frío"


def extract(ref: str, code: str) -> Image.Image:
    """Imagen embebida del PDF original, con su transparencia (SMask).

    "<ref>@x0,y0,x1,y1" recorta la imagen extraída (fracciones de su tamaño)."""
    if "@" in ref:
        ref, box = ref.split("@")
        img = extract(ref, code)
        x0, y0, x1, y1 = (float(v) for v in box.split(","))
        w, h = img.size
        return img.crop((round(x0 * w), round(y0 * h), round(x1 * w), round(y1 * h)))
    if ref.startswith("r") or ":" in ref and ref.split(":", 1)[1].startswith("r"):
        # Recorte de página: "r<pág>:x0,y0,x1,y1" en fracciones de la página.
        if not ref.startswith("r"):
            code, ref = ref.split(":", 1)
        pg, box = ref[1:].split(":")
        x0, y0, x1, y1 = (float(v) for v in box.split(","))
        doc = pymupdf.open(SRC / "originales" / f"{code}.pdf")
        page = doc[int(pg) - 1]
        r = page.rect
        clip = pymupdf.Rect(r.x0 + x0 * r.width, r.y0 + y0 * r.height, r.x0 + x1 * r.width, r.y0 + y1 * r.height)
        pix = page.get_pixmap(matrix=pymupdf.Matrix(4, 4), clip=clip, alpha=False)
        return Image.frombytes("RGB", (pix.width, pix.height), pix.samples).convert("RGBA")
    if ":" in ref:
        code, ref = ref.split(":", 1)
    m = re.fullmatch(r"p(\d+)_x(\d+)", ref)
    if not m:
        raise ValueError(f"referencia de imagen inválida: {ref}")
    xref = int(m.group(2))
    doc = pymupdf.open(SRC / "originales" / f"{code}.pdf")
    pix = pymupdf.Pixmap(doc, xref)
    if pix.alpha:
        pix = pymupdf.Pixmap(pix, 0)
    if pix.colorspace is None or pix.colorspace.n != 3:
        pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
    img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples).convert("RGBA")
    t, v = doc.xref_get_key(xref, "SMask")
    if t == "xref":
        mask = pymupdf.Pixmap(doc, int(v.split()[0]))
        if mask.n != 1:
            mask = pymupdf.Pixmap(pymupdf.csGRAY, mask)
        m_img = Image.frombytes("L", (mask.width, mask.height), mask.samples)
        img.putalpha(m_img.resize(img.size, Image.LANCZOS))
    return img


def enhance(img: Image.Image, target: int, mode: str = "photo") -> Image.Image:
    """Recorta márgenes vacíos, amplía (Lanczos) y da nitidez."""
    alpha = img.getchannel("A")
    bbox = alpha.point(lambda a: 255 if a > 12 else 0).getbbox()
    if mode == "photo" and bbox:
        img = img.crop(bbox)
    if mode == "drawing":
        # Dibujos con líneas claras sobre fondo oscuro/transparente → líneas
        # gris oscuro sobre transparente para las páginas blancas.
        rgb = img.convert("RGB")
        lum = ImageOps.grayscale(rgb)
        line_alpha = Image.eval(lum, lambda v: max(0, min(255, (v - 60) * 2)))
        if alpha.getextrema()[1] > 0:
            line_alpha = Image.composite(line_alpha, Image.new("L", lum.size, 0), alpha)
        img = Image.new("RGBA", rgb.size, (40, 42, 48, 0))
        img.putalpha(line_alpha)
        bbox = line_alpha.point(lambda a: 255 if a > 20 else 0).getbbox()
        if bbox:
            img = img.crop(bbox)
    w, h = img.size
    scale = target / max(w, h)
    if scale > 1:
        img = img.resize((round(w * min(scale, 3)), round(h * min(scale, 3))), Image.LANCZOS)
        if mode == "photo":
            rgb = img.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2, percent=70, threshold=2))
            rgb.putalpha(img.getchannel("A"))
            img = rgb
    return img


def save_png(img: Image.Image, name: str) -> str:
    path = BUILD / "img" / f"{name}.png"
    img.save(path, optimize=True)
    return f"build/img/{name}.png"


def prepare(code: str, data: dict) -> dict:
    data = copy.deepcopy(data)
    f = dict(data)
    f["code"] = code
    imgs = {}

    def img(ref, target=1600, mode="photo", key=None):
        if not ref:
            return None
        k = key or f"{code}__{ref.replace(':', '_')}__{mode}"
        if k not in imgs:
            imgs[k] = save_png(enhance(extract(ref, code), target, mode), k)
        return imgs[k]

    hero_img = enhance(extract(data["hero"], code), 1800)
    f["hero"] = save_png(hero_img, f"{code}__hero")
    f["photo2"] = img(data.get("photo2"), 1400)
    feats = f.get("features", [])
    if not all(x.get("img") for x in feats):
        feats = [{k: v for k, v in x.items() if k != "img"} for x in feats]  # todas o ninguna
    f["features"] = feats
    for x in feats:
        if x.get("mode") == "drawing":
            x["light"] = True  # líneas oscuras → fondo claro
        x["img"] = img(x.get("img"), 700, x.get("mode", "photo"))
    if f.get("dims"):
        f["dims"]["img"] = img(f["dims"].get("img"), 1400, "drawing")
    f["photometry"] = img(data.get("photometry"), 1200, "raw")

    f["is_lum"] = data.get("is_lum", True)
    f["kpis"] = data.get("kpis", [])
    f["kpis2"] = data.get("kpis2") or (f["kpis"] + data.get("kpis_extra", []))
    f["certs"] = data.get("certs", [])
    f["warranty"] = data.get("warranty", [])
    f["applications"] = data.get("applications", [])
    f["advantages"] = data.get("advantages", [])
    f["temps"] = [
        {"k": f"{k:,} K", "l": temp_label(k), "color": TEMP_COLORS.get(k, "#fff3e0")}
        for k in data.get("temps", [])
    ]
    desc = data.get("description", [])
    f["description"] = [desc] if isinstance(desc, str) else desc

    # Columnas de especificaciones balanceadas por número de filas.
    groups = [g for g in data.get("specs", []) if g.get("rows")]
    f["spec_groups"] = groups
    cols, size = [[], []], [0, 0]
    for g in groups:
        i = 0 if size[0] <= size[1] else 1
        cols[i].append(g)
        size[i] += len(g["rows"]) + 2
    f["spec_columns"] = cols

    # Tamaño del nombre del modelo según su largo.
    n = len(f["model"])
    # Archivo Black expandida itálica ≈ 0.98 em por carácter (mayúsculas).
    f["cover_size"] = round(min(62, 505 / (n * 0.98)), 1)
    f["inner_size"] = round(min(29, 236 / (n * 0.98)), 1)
    # Pocas especificaciones y sin temperatura/fotometría → ficha de 3 páginas
    # (las especificaciones van en la última página en vez de una casi vacía).
    # Se intenta primero en 3 páginas; main() vuelve a 4 si no cabe.
    f["compact"] = bool(groups) and not f["photometry"] and not data.get("code_parts") and len(f["temps"]) <= 1 and not data.get("_full")
    f["total_pages"] = 4 if groups and not f["compact"] else 3
    if f["compact"] and any(r[0] == "Montaje" for g in groups for r in g["rows"]):
        f["mount"] = None  # ya aparece en la tabla de especificaciones

    # Foto para la web (fondo transparente → webp con alfa).
    OUT_WEB.mkdir(parents=True, exist_ok=True)
    web = hero_img.copy()
    web.thumbnail((1000, 1000), Image.LANCZOS)
    web.save(OUT_WEB / f"{code}.webp", "WEBP", quality=84, method=6)
    th = hero_img.copy()
    th.thumbnail((420, 420), Image.LANCZOS)
    th.save(OUT_WEB / f"{code}-thumb.webp", "WEBP", quality=80, method=6)
    return f


def render_pdf(html: Path, pdf: Path):
    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
         "--run-all-compositor-stages-before-draw", "--virtual-time-budget=4000",
         f"--print-to-pdf={pdf}", html.as_uri()],
        check=True, capture_output=True, timeout=120,
    )


MAX_PX = 1700  # ~290 ppp para la foto más grande (portada de 150 mm)


def fit(im: Image.Image) -> Image.Image:
    """Reduce imágenes más grandes de lo que la ficha necesita."""
    if max(im.size) <= MAX_PX:
        return im
    scale = MAX_PX / max(im.size)
    return im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)


def compress_pdf(pdf: Path):
    """Re-codifica imágenes grandes como JPEG (las de Chrome van en Flate).

    Las máscaras de transparencia (SMask) también: un JPEG en escala de grises
    a calidad alta pesa ~4 veces menos y no deja halos visibles."""
    d = pymupdf.open(pdf)
    smasks = set()
    for x in range(1, d.xref_length()):
        t, v = d.xref_get_key(x, "SMask")
        if t == "xref":
            smasks.add(int(v.split()[0]))
    changed = False
    for x in range(1, d.xref_length()):
        if d.xref_get_key(x, "Subtype")[1] != "/Image":
            continue
        try:
            raw = d.xref_stream_raw(x)
            pix = pymupdf.Pixmap(d, x)
        except Exception:
            continue
        if pix.width * pix.height < 20000:
            continue
        if x in smasks:
            if pix.n != 1 or d.xref_get_key(x, "Filter")[1] == "/DCTDecode":
                continue
            im = fit(Image.frombytes("L", (pix.width, pix.height), pix.samples))
            buf = io.BytesIO()
            im.save(buf, "JPEG", quality=90, optimize=True)
            if len(buf.getvalue()) < 0.8 * len(raw):
                d.update_stream(x, buf.getvalue(), compress=False)
                d.xref_set_key(x, "Filter", "/DCTDecode")
                d.xref_set_key(x, "DecodeParms", "null")
                d.xref_set_key(x, "Width", str(im.width))
                d.xref_set_key(x, "Height", str(im.height))
                changed = True
            continue
        if pix.alpha:
            pix = pymupdf.Pixmap(pix, 0)
        if pix.colorspace is None or pix.colorspace.n != 3:
            pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
        im = fit(Image.frombytes("RGB", (pix.width, pix.height), pix.samples))
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=86, optimize=True)
        if len(buf.getvalue()) < 0.8 * len(raw):
            d.update_stream(x, buf.getvalue(), compress=False)
            d.xref_set_key(x, "Filter", "/DCTDecode")
            d.xref_set_key(x, "ColorSpace", "/DeviceRGB")
            d.xref_set_key(x, "BitsPerComponent", "8")
            d.xref_set_key(x, "DecodeParms", "null")
            d.xref_set_key(x, "Width", str(im.width))
            d.xref_set_key(x, "Height", str(im.height))
            changed = True
    # Los glifos de las fuentes variables van como cientos de objetos chicos
    # (Type3): agruparlos en object streams ahorra ~15%.
    tmp = pdf.with_suffix(".tmp.pdf")
    d.save(tmp, garbage=3, deflate=True, use_objstms=1)
    d.close()
    tmp.replace(pdf)


def main(codes):
    (BUILD / "img").mkdir(parents=True, exist_ok=True)
    env = Environment(loader=FileSystemLoader(SRC), autoescape=True)
    tpl = env.get_template("ficha.html.j2")
    files = sorted((SRC / "data").glob("*.json"))
    if codes:
        files = [p for p in files if p.stem in codes]
    for p in files:
        code = p.stem
        data = json.loads(p.read_text())
        pdf = OUT_PDF / f"{code}.pdf"
        for attempt in (0, 1):
            f = prepare(code, data)
            html = SRC / f"_{code}.html"
            html.write_text(tpl.render(f=f, total_pages=f["total_pages"]))
            render_pdf(html, pdf)
            html.unlink()
            doc = pymupdf.open(pdf)
            flags = [i + 1 for i, pg in enumerate(doc) if "__OVERFLOW__" in pg.get_text()]
            doc.close()
            if flags and f["compact"] and attempt == 0:
                data = {**data, "_full": True}  # no cupo en 3 páginas → 4
                continue
            break
        compress_pdf(pdf)
        if flags:
            print(f"  ⚠ {code}: contenido no cabe en página(s) {flags}")
        print(f"{code:18} {pdf.stat().st_size / 1e6:.2f} MB  {f['total_pages']} págs")


if __name__ == "__main__":
    main(sys.argv[1:])

"""
Genera las fichas técnicas ICEMEX con la plantilla oficial (4 páginas).

    python3 fichas-src/build.py                 # todas
    python3 fichas-src/build.py AL-LT1002 ...   # solo algunas

Entrada:  fichas-src/data/<CODIGO>.json   (contenido de cada ficha)
          fichas-src/originales/<CODIGO>.pdf (fichas anteriores: fuente de fotos)
Salida:   public/fichas/<CODIGO>.pdf
          public/productos/<CODIGO>.webp, -md.webp y -thumb.webp (foto para la web)

Requiere: pymupdf, pillow, numpy, jinja2 y Google Chrome instalado.
Las imágenes de baja resolución se amplían antes con IA:
`python3 fichas-src/upscale.py` (ver ese archivo).
Las imágenes se referencian como "p<página>_x<xref>" del PDF original
(o "<OTRO-CODIGO>:p<página>_x<xref>" para tomarlas de otra ficha).
Fotos propias (no salen del PDF): "foto:<archivo>" lee fichas-src/fotos/<archivo>.
Retoques a mano (p. ej. quitar un logo ajeno): fichas-src/retouch/<clave>.png
reemplaza a la imagen extraída (clave = image_key(código, ref)).
Sufijos de una referencia: "@x0,y0,x1,y1" recorta (fracciones del tamaño) y
"#0" o "#1,2" deja solo esas vistas (piezas separadas por transparencia,
de la más grande a la más chica) cuando la foto trae varias encimadas.
"""

import copy
import hashlib
import io
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import pymupdf
from jinja2 import Environment, FileSystemLoader
from PIL import Image, ImageFilter, ImageOps

SRC = Path(__file__).resolve().parent
ROOT = SRC.parent
BUILD = SRC / "build"
OUT_PDF = ROOT / "public" / "fichas"
OUT_WEB = ROOT / "public" / "productos"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
HIRES = SRC / "hires"
RETOUCH = SRC / "retouch"

# Lado mayor (px) de cada tipo de imagen: ≥300 ppp en el tamaño impreso.
TARGET = {"hero": 2400, "photo2": 1600, "feature": 900, "dims": 1200, "photometry": 900}

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
    touched = RETOUCH / f"{image_key(code, ref)}.png"
    if touched.exists():
        return Image.open(touched).convert("RGBA")
    if ref.startswith("foto:"):
        return Image.open(SRC / "fotos" / ref[5:]).convert("RGBA")
    if "#" in ref:
        ref, keep = ref.split("#")
        return keep_views(extract(ref, code), [int(i) for i in keep.split(",")])
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


def enhance(img: Image.Image, target: int, mode: str = "photo", sharpen: bool = True) -> Image.Image:
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
        if mode == "photo" and sharpen:
            rgb = img.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2, percent=70, threshold=2))
            rgb.putalpha(img.getchannel("A"))
            img = rgb
    return img


def image_key(code: str, ref: str) -> str:
    return re.sub(r"[^A-Za-z0-9_-]", "_", f"{code}__{ref}")


def fingerprint(img: Image.Image) -> str:
    return hashlib.md5(img.tobytes()).hexdigest()[:12]


def views(img: Image.Image) -> tuple[np.ndarray, list[tuple[int, int]]]:
    """Piezas de una foto separadas por transparencia: mapa de etiquetas (a
    escala reducida) y [(área, etiqueta)] de la más grande a la más chica."""
    scale = min(1, 320 / max(img.size))
    small = img.getchannel("A").resize((max(1, round(img.width * scale)), max(1, round(img.height * scale))), Image.BILINEAR)
    solid = np.asarray(small) > 40
    labels = np.zeros(solid.shape, np.int32)
    h, w = solid.shape
    areas = []
    for y0, x0 in zip(*np.nonzero(solid)):
        if labels[y0, x0]:
            continue
        n = len(areas) + 1
        labels[y0, x0] = n
        stack, area = [(y0, x0)], 0
        while stack:
            y, x = stack.pop()
            area += 1
            for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= ny < h and 0 <= nx < w and solid[ny, nx] and not labels[ny, nx]:
                    labels[ny, nx] = n
                    stack.append((ny, nx))
        areas.append((area, n))
    return labels, sorted(areas, reverse=True)


def keep_views(img: Image.Image, keep: list[int]) -> Image.Image:
    """Deja solo las piezas indicadas (0 = la más grande) y recorta a ellas."""
    labels, areas = views(img)
    chosen = np.isin(labels, [areas[i][1] for i in keep])
    # Engrosa la selección para no perder el borde suavizado de cada pieza.
    mask = Image.fromarray((chosen * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))
    mask = mask.resize(img.size, Image.BILINEAR)
    out = img.copy()
    alpha = np.asarray(img.getchannel("A"), np.float32) * (np.asarray(mask, np.float32) / 255)
    out.putalpha(Image.fromarray(alpha.astype(np.uint8)))
    box = out.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    return out.crop(box) if box else out


def image_refs(code: str, data: dict):
    """(ref, tipo) de todas las imágenes de una ficha."""
    yield data["hero"], "hero"
    for ref, kind in ((data.get("photo2"), "photo2"), (data.get("photometry"), "photometry"),
                      ((data.get("dims") or {}).get("img"), "dims")):
        if ref:
            yield ref, kind
    for x in data.get("features", []):
        if x.get("img"):
            yield x["img"], "feature"


_hires_index = None
_looks = None

DUP_BITS = 16  # de 256: diferencia máxima para considerar dos fotos la misma


def base_ref(ref: str) -> str:
    """Imagen de origen de una referencia (sin recorte ni selección de vistas)."""
    return re.split(r"[@#]", ref)[0]


def look(img: Image.Image) -> tuple[np.ndarray, float]:
    """Huella visual (dHash 16×16 sobre fondo blanco) y proporción."""
    bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
    bg.alpha_composite(img.convert("RGBA"))
    g = np.asarray(bg.convert("L").resize((17, 16), Image.LANCZOS), np.int16)
    return (g[:, 1:] > g[:, :-1]).flatten(), img.width / img.height


def same_image(a, b) -> bool:
    return int((a[0] != b[0]).sum()) <= DUP_BITS and abs(a[1] / b[1] - 1) < 0.12


def all_looks() -> dict:
    """{código: [huella de cada imagen de la ficha]} de todo el catálogo."""
    global _looks
    if _looks is None:
        _looks = {}
        for p in sorted((SRC / "data").glob("*.json")):
            refs = {ref for ref, _ in image_refs(p.stem, json.loads(p.read_text()))}
            _looks[p.stem] = [look(extract(r, p.stem)) for r in refs]
    return _looks


def repeated_features(code: str, data: dict, photo2) -> list[str]:
    """Imágenes de "Tecnología" que repiten otra foto: la de portada, la
    segunda foto, otra característica o una imagen de otra ficha."""
    seen_refs = {base_ref(data["hero"])} | ({base_ref(photo2)} if photo2 else set())
    seen = [look(extract(data["hero"], code))] + ([look(extract(photo2, code))] if photo2 else [])
    others = [lk for c, lks in all_looks().items() if c != code for lk in lks]
    out = []
    for x in data.get("features", []):
        ref = x.get("img")
        if not ref:
            continue
        lk = look(extract(ref, code))
        if (base_ref(ref) in seen_refs or ":" in ref
                or any(same_image(lk, o) for o in seen) or any(same_image(lk, o) for o in others)):
            out.append(ref)
        seen_refs.add(base_ref(ref))
        seen.append(lk)
    return out


def source(ref: str, code: str) -> tuple[Image.Image, bool]:
    """La imagen ampliada con IA (upscale.py) si existe para esta misma imagen
    de origen; si no, la del PDF original. Devuelve (imagen, es_ia)."""
    global _hires_index
    if _hires_index is None:
        index = HIRES / "index.json"
        _hires_index = json.loads(index.read_text()) if index.exists() else {}
    img = extract(ref, code)
    key = image_key(code, ref)
    hi = HIRES / f"{key}.webp"
    if hi.exists() and _hires_index.get(key) == fingerprint(img):
        return Image.open(hi).convert("RGBA"), True
    return img, False


def smooth_hidden(img: Image.Image) -> Image.Image:
    """Color liso bajo las zonas transparentes. No se ve, pero la ampliación
    con IA deja ahí texturas que triplican el peso de la imagen en el PDF."""
    alpha = img.getchannel("A")
    if alpha.getextrema()[0] == 255:
        return img
    small = (max(1, img.width // 8), max(1, img.height // 8))
    a = np.asarray(alpha.resize(small, Image.BOX).filter(ImageFilter.GaussianBlur(3)), np.float32)[..., None] / 255
    pre = Image.composite(img.convert("RGB"), Image.new("RGB", img.size), alpha)
    pm = np.asarray(pre.resize(small, Image.BOX).filter(ImageFilter.GaussianBlur(3)), np.float32)
    mean = np.asarray(pre, np.float32).reshape(-1, 3).sum(0) / max(1, np.asarray(alpha, np.float32).sum() / 255)
    fill = np.where(a > 0.02, pm / np.maximum(a, 0.02), mean)
    fill = Image.fromarray(np.clip(fill, 0, 255).astype(np.uint8)).resize(img.size, Image.BILINEAR)
    hidden = alpha.point(lambda v: 255 if v < 4 else 0)
    out = Image.composite(fill, img.convert("RGB"), hidden)
    out.putalpha(alpha)
    return out


def save_png(img: Image.Image, name: str) -> str:
    path = BUILD / "img" / f"{name}.png"
    smooth_hidden(img).save(path, optimize=True)
    return f"build/img/{name}.png"


def prepare(code: str, data: dict) -> dict:
    data = copy.deepcopy(data)
    f = dict(data)
    f["code"] = code
    imgs = {}

    def img(ref, target, mode="photo"):
        if not ref:
            return None
        k = f"{image_key(code, ref)}__{mode}"
        if k not in imgs:
            im, ai = source(ref, code)
            im = enhance(im, target, mode, sharpen=not ai)
            im.thumbnail((target, target), Image.LANCZOS)  # la versión IA puede venir más grande
            imgs[k] = save_png(im, k)
        return imgs[k]

    im, ai = source(data["hero"], code)
    hero_img = enhance(im, TARGET["hero"], sharpen=not ai)
    hero_img.thumbnail((TARGET["hero"], TARGET["hero"]), Image.LANCZOS)
    f["hero"] = save_png(hero_img, f"{code}__hero")
    photo2 = data.get("photo2")
    # Misma foto que la portada (o un recorte suyo); otra vista "#" sí cuenta.
    same_src = base_ref(photo2 or "") == base_ref(data["hero"]) and "#" not in (photo2 or "")
    if photo2 and (photo2 == data["hero"] or same_src
                   or same_image(look(extract(photo2, code)), look(extract(data["hero"], code)))):
        photo2 = None
    f["photo2"] = img(photo2, TARGET["photo2"])
    # Sin fotos repetidas en "Tecnología"; si alguna lo es, van todas sin foto.
    repeated = repeated_features(code, data, photo2)
    feats = f.get("features", [])
    if repeated or not all(x.get("img") for x in feats):
        feats = [{k: v for k, v in x.items() if k != "img"} for x in feats]  # todas o ninguna
    f["features"] = feats
    for x in feats:
        if x.get("mode") == "drawing":
            x["light"] = True  # líneas oscuras → fondo claro
        x["img"] = img(x.get("img"), TARGET["feature"], x.get("mode", "photo"))
    if f.get("dims"):
        f["dims"]["img"] = img(f["dims"].get("img"), TARGET["dims"], "drawing")
    f["photometry"] = img(data.get("photometry"), TARGET["photometry"], "raw")

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

    # Foto para la web (fondo transparente → webp con alfa) en tres tamaños:
    # escritorio/retina, celular y miniatura (las páginas usan srcset).
    OUT_WEB.mkdir(parents=True, exist_ok=True)
    for suffix, side, quality in (("", 1400, 80), ("-md", 800, 80), ("-thumb", 420, 80)):
        web = hero_img.copy()
        web.thumbnail((side, side), Image.LANCZOS)
        web.save(OUT_WEB / f"{code}{suffix}.webp", "WEBP", quality=quality, method=4)
    return f


def render_pdf(html: Path, pdf: Path):
    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
         "--run-all-compositor-stages-before-draw", "--virtual-time-budget=4000",
         f"--print-to-pdf={pdf}", html.as_uri()],
        check=True, capture_output=True, timeout=120,
    )


MAX_PX = 2400  # ~360 ppp para la foto más grande (portada de 168 mm)


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
            im.save(buf, "JPEG", quality=92, optimize=True)
            if len(buf.getvalue()) < len(raw):
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
        im.save(buf, "JPEG", quality=90, optimize=True)
        if len(buf.getvalue()) < len(raw):
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

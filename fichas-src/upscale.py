"""
Amplía con IA (Real-ESRGAN x4) las imágenes de las fichas que en los PDF
originales vienen en baja resolución: foto principal, foto secundaria,
características, dibujo de dimensiones y fotometría.

    python3 fichas-src/upscale.py                # las que falten o cambiaron
    python3 fichas-src/upscale.py AL-LC1001 ...  # forzar las de algunas fichas

Salida: fichas-src/hires/<clave>.webp (con transparencia) + index.json con la
huella de la imagen de origen. build.py usa la versión ampliada cuando su
huella coincide con la imagen que extrae (si cambia la ref en data/ o el
retoque en retouch/, hay que volver a correr esto).

Requiere (además de lo de build.py): torch y spandrel, y los pesos del modelo
general de Real-ESRGAN en fichas-src/models/ (no se versionan):
  https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/realesr-general-x4v3.pth
  https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/realesr-general-wdn-x4v3.pth
"""

import json
import sys
from pathlib import Path

import numpy as np
import torch
from PIL import Image, ImageFilter
from spandrel import ModelLoader

import build

SRC = Path(__file__).resolve().parent
HIRES = build.HIRES
MODELS = SRC / "models"
INDEX = HIRES / "index.json"

ENOUGH = 0.8   # si el original ya mide ≥80% del tamaño final, no hace falta IA
DENOISE = 0.4  # 0 = conserva todo el grano, 1 = lo suaviza por completo
TILE, PAD = 192, 16

DEV = torch.device("mps" if torch.backends.mps.is_available() else "cpu")


def load_model():
    def weights(name):
        d = torch.load(MODELS / name, map_location="cpu", weights_only=True)
        return d.get("params", d.get("params_ema", d))

    # Igual que la opción --denoise_strength de Real-ESRGAN: interpola el
    # modelo general con su variante sin reducción de ruido.
    a = weights("realesr-general-x4v3.pth")
    b = weights("realesr-general-wdn-x4v3.pth")
    mix = {k: DENOISE * a[k] + (1 - DENOISE) * b[k] for k in a}
    return ModelLoader().load_from_state_dict(mix).model.eval().to(DEV)


@torch.no_grad()
def sr(model, rgb: np.ndarray) -> np.ndarray:
    """rgb float32 HxWx3 en [0,1] → 4x, por mosaicos para no agotar memoria."""
    h, w, _ = rgb.shape
    x = torch.from_numpy(rgb).permute(2, 0, 1)[None].to(DEV)
    out = torch.zeros(1, 3, h * 4, w * 4, device=DEV)
    for y0 in range(0, h, TILE):
        for x0 in range(0, w, TILE):
            y1, x1 = min(y0 + TILE, h), min(x0 + TILE, w)
            py0, px0 = max(y0 - PAD, 0), max(x0 - PAD, 0)
            py1, px1 = min(y1 + PAD, h), min(x1 + PAD, w)
            t = model(x[:, :, py0:py1, px0:px1])
            oy, ox = (y0 - py0) * 4, (x0 - px0) * 4
            out[:, :, y0 * 4:y1 * 4, x0 * 4:x1 * 4] = t[:, :, oy:oy + (y1 - y0) * 4, ox:ox + (x1 - x0) * 4]
    return out[0].clamp(0, 1).permute(1, 2, 0).cpu().numpy()


def fill_transparent(img: Image.Image) -> np.ndarray:
    """Color bajo las zonas transparentes = color de los bordes cercanos, para
    que el modelo no dibuje halos oscuros alrededor del producto."""
    rgb = np.asarray(img.convert("RGB"), np.float32) / 255
    a = np.asarray(img.getchannel("A"), np.float32)[..., None] / 255
    known_rgb, known_a = rgb * a, a.copy()
    filled = rgb * a
    for radius in (2, 6, 16, 40):
        pm = Image.fromarray((known_rgb * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius))
        pa = Image.fromarray((a[..., 0] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius))
        pm = np.asarray(pm, np.float32) / 255
        pa = np.asarray(pa, np.float32)[..., None] / 255
        est = np.where(pa > 1e-3, pm / np.maximum(pa, 1e-3), 0)
        need = known_a < 0.999
        filled = np.where(need, filled + est * (1 - known_a) * (pa > 1e-3), filled)
        known_a = np.where(need, np.minimum(1, known_a + (1 - known_a) * (pa > 1e-3)), known_a)
    return np.clip(filled, 0, 1)


def upscale(model, img: Image.Image, side: int) -> Image.Image:
    """x4 con IA; si no alcanza el tamaño final, una segunda pasada partiendo
    del resultado reducido a ¼ de ese tamaño (más nítido que estirarlo)."""
    out = upscale_once(model, img)
    if max(out.size) < 0.9 * side:
        out.thumbnail((side // 4, side // 4), Image.LANCZOS)
        out = upscale_once(model, out)
    out.thumbnail((side, side), Image.LANCZOS)
    return out


def upscale_once(model, img: Image.Image) -> Image.Image:
    alpha = img.getchannel("A")
    if alpha.getextrema()[0] == 255:  # sin transparencia
        rgb = sr(model, np.asarray(img.convert("RGB"), np.float32) / 255)
        a4 = np.ones(rgb.shape[:2], np.float32)
    else:
        rgb = sr(model, fill_transparent(img))
        a = np.asarray(alpha, np.float32) / 255
        a4 = sr(model, np.repeat(a[..., None], 3, axis=2)).mean(axis=2)
    return Image.fromarray((np.dstack([rgb, a4]) * 255 + 0.5).astype(np.uint8), "RGBA")


def jobs() -> dict:
    """{clave: (código, ref, lado final)} de todas las imágenes de las fichas."""
    out = {}
    for p in sorted((SRC / "data").glob("*.json")):
        code = p.stem
        for ref, kind in build.image_refs(code, json.loads(p.read_text())):
            key = build.image_key(code, ref)
            side = max(out[key][2] if key in out else 0, build.TARGET[kind])
            out[key] = (code, ref, side)
    return out


def main(force):
    HIRES.mkdir(exist_ok=True)
    index = json.loads(INDEX.read_text()) if INDEX.exists() else {}
    todo = jobs()
    model = None
    for key, (code, ref, side) in todo.items():
        img = build.extract(ref, code)
        fp = build.fingerprint(img)
        if code not in force and index.get(key) == fp and (HIRES / f"{key}.webp").exists():
            continue
        if max(img.size) >= ENOUGH * side:
            index.pop(key, None)
            (HIRES / f"{key}.webp").unlink(missing_ok=True)
            continue
        model = model or load_model()
        up = upscale(model, img, side)
        up.save(HIRES / f"{key}.webp", "WEBP", quality=92, method=4)
        index[key] = fp
        INDEX.write_text(json.dumps(index, indent=1, sort_keys=True) + "\n")
        print(f"{key:40} {img.size} → {up.size}", flush=True)
    # Limpia las de imágenes que ya no se usan.
    for p in HIRES.glob("*.webp"):
        if p.stem not in todo:
            p.unlink()
            index.pop(p.stem, None)
    INDEX.write_text(json.dumps({k: v for k, v in index.items() if k in todo}, indent=1, sort_keys=True) + "\n")


if __name__ == "__main__":
    main(set(sys.argv[1:]))

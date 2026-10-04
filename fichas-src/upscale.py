"""
Amplía con IA (Real-ESRGAN x4) las fotos principales que en los PDF
originales vienen en baja resolución.

    python3 fichas-src/upscale.py                # las que falten o cambiaron
    python3 fichas-src/upscale.py AL-LC1001 ...  # forzar algunas

Salida: fichas-src/hires/<CODIGO>.webp (con transparencia) + index.json con la
referencia de origen de cada una. build.py usa la versión ampliada en lugar de
la foto del PDF cuando existe y su referencia coincide con la de data/.

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
HIRES = SRC / "hires"
MODELS = SRC / "models"
INDEX = HIRES / "index.json"

MIN_SIDE = 1400  # fotos con lado mayor a esto ya se ven bien
MAX_SIDE = 1800  # tope del resultado (el que usa la ficha)
DENOISE = 0.4    # 0 = conserva todo el grano, 1 = lo suaviza por completo
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


def upscale(model, img: Image.Image) -> Image.Image:
    rgb = sr(model, fill_transparent(img))
    a = np.asarray(img.getchannel("A"), np.float32) / 255
    a4 = sr(model, np.repeat(a[..., None], 3, axis=2)).mean(axis=2)
    out = Image.fromarray((np.dstack([rgb, a4]) * 255 + 0.5).astype(np.uint8), "RGBA")
    out.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    return out


def source(code: str, ref: str) -> Image.Image:
    img = build.extract(ref, code).convert("RGBA")
    bbox = img.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox()
    return img.crop(bbox) if bbox else img


def main(force):
    HIRES.mkdir(exist_ok=True)
    index = json.loads(INDEX.read_text()) if INDEX.exists() else {}
    model = None
    for p in sorted((SRC / "data").glob("*.json")):
        code = p.stem
        ref = json.loads(p.read_text())["hero"]
        if code not in force and index.get(code) == ref and (HIRES / f"{code}.webp").exists():
            continue
        img = source(code, ref)
        if max(img.size) >= MIN_SIDE and code not in force:
            continue
        model = model or load_model()
        up = upscale(model, img)
        up.save(HIRES / f"{code}.webp", "WEBP", quality=88, method=6)
        index[code] = ref
        INDEX.write_text(json.dumps(index, indent=1, sort_keys=True) + "\n")
        print(f"{code:22} {img.size} → {up.size}", flush=True)


if __name__ == "__main__":
    main(set(sys.argv[1:]))

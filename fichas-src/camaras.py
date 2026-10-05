"""
Genera las fichas de cámaras de seguridad (línea CV) a partir del catálogo
XOLSEC 2026 (fichas-src/originales/XOLSEC.pdf): fichas-src/data/CV-*.json,
sus entradas en public/fichas/index.json y los retoques de foto
(fichas-src/retouch/) que difuminan los bordes donde el catálogo original
dejó la foto recortada.

    python3 fichas-src/camaras.py

Después, igual que el resto de las fichas: upscale.py → build.py →
scripts/build-fichas.py → catalogo.py camaras.

Solo se usan los datos del catálogo XOLSEC (tabla de cada ficha, subtítulo y
texto de su sección); no se inventan especificaciones.
"""

import json
from pathlib import Path

import numpy as np
from PIL import Image

from build import RETOUCH, extract, image_key

SRC = Path(__file__).resolve().parent
ROOT = SRC.parent
INDEX = ROOT / "public" / "fichas" / "index.json"

DUAL, EXT, INT, FOCO, SOLAR = (
    "Cámaras duales", "Cámaras para exterior", "Cámaras para interior", "Focos cámara", "Cámaras solares")

S, N = True, False
# código, modelo, nombre en el sitio, sección, página y xref de la foto en el
# PDF XOLSEC, tipo, resolución, RJ45, IP66, Wi-Fi, seguimiento inteligente,
# visión nocturna a color, alcance Wi-Fi (m), PTZ, extra
CAMS = [
    ("CV-Q24", "Q24", "Cámara Dual Q24", DUAL, 6, 1487, "domo", "2+2", N, N, "2.4", S, S, 15, S, "dual"),
    ("CV-Q29", "Q29", "Cámara Dual Q29", DUAL, 7, 1502, "bala + domo", "3+3", S, S, "2.4", S, S, 15, S, "dual"),
    ("CV-C05", "C05", "Cámara PTZ C05", EXT, 9, 1532, "domo", "2", N, S, "2.4", S, S, 15, S, None),
    ("CV-C05P", "C05-P", "Cámara PTZ C05-P con luces de alerta", EXT, 10, 1553, "domo", "2", N, S, "2.4", S, S, 15, S, "alerta"),
    ("CV-C07", "C07", "Cámara PTZ C07 de doble lente", EXT, 11, 1574, "domo", "4+4", N, S, "2.4", S, S, 15, S, "dual"),
    ("CV-C19", "C19", "Cámara PTZ C19 de doble lente", EXT, 12, 1595, "domo", "2+2", N, S, "2.4", S, S, 15, S, "dual"),
    ("CV-C22", "C22", "Cámara PTZ C22", EXT, 13, 1616, "domo", "4", N, S, "2.4", S, S, 15, S, None),
    ("CV-Q35", "Q35", "Cámara PTZ Q35 con reflectores LED", EXT, 14, 1637, "domo", "3", N, S, "2.4", S, S, 15, S, "reflectores"),
    ("CV-Q32", "Q32", "Cámara Bala Q32", EXT, 15, 1658, "bala", "4", S, S, "2.4", N, S, 15, N, None),
    ("CV-D21", "D21", "Cámara Bala D21 de batería", EXT, 16, 1679, "bala", "5", N, S, "2.4 / 5", N, S, 15, N, "bateria"),
    ("CV-TV629", "TV-629", "Cámara TV-629 para interior", INT, 18, 1709, "domo", "3", N, N, "2.4", S, N, 15, N, None),
    ("CV-TV628", "TV-628", "Cámara TV-628 para interior", INT, 19, 1730, "domo", "3", N, N, "2.4 / 5", S, N, 15, N, None),
    ("CV-Q26", "Q26", "Minicámara Q26", INT, 20, 1751, "mini", "2", N, N, "2.4", N, S, 15, N, None),
    ("CV-Q17", "Q17", "Foco Cámara Q17", FOCO, 22, 1781, "foco", "2", N, N, "2.4", S, S, 15, S, "foco"),
    ("CV-Q19", "Q19", "Foco Cámara Q19 de doble lente", FOCO, 23, 1802, "foco", "2+2", N, N, "2.4", S, S, 15, S, "foco dual"),
    # La tabla del catálogo XOLSEC marca IP66 para el Q05 (aunque lo
    # recomienda para interiores); se respeta la tabla.
    ("CV-Q05", "Q05", "Foco Cámara Q05", FOCO, 24, 1823, "foco", "2", N, S, "2.4", S, S, 15, S, "foco"),
    ("CV-Q25", "Q25", "Cámara Solar Q25", SOLAR, 26, 1853, "domo", "4", N, S, "2.4", S, S, 30, N, "solar"),
    ("CV-D21S", "D21 SOLAR", "Cámara Solar D21", SOLAR, 27, 1874, "bala", "5", N, S, "2.4 / 5", N, S, 30, N, "solar"),
]

KIND = {
    "CV-Q24": "Cámara de seguridad Wi-Fi de doble lente para interior",
    "CV-Q29": "Cámara de seguridad Wi-Fi de doble lente, bala y domo",
    "CV-C05": "Cámara de seguridad PTZ Wi-Fi para exterior",
    "CV-C05P": "Cámara de seguridad PTZ Wi-Fi con luces de alerta",
    "CV-C07": "Cámara de seguridad PTZ Wi-Fi de doble lente",
    "CV-C19": "Cámara de seguridad PTZ Wi-Fi de doble lente",
    "CV-C22": "Cámara de seguridad PTZ Wi-Fi para exterior",
    "CV-Q35": "Cámara de seguridad PTZ con 3 reflectores LED",
    "CV-Q32": "Cámara de seguridad tipo bala Wi-Fi para exterior",
    "CV-D21": "Cámara de seguridad tipo bala con batería",
    "CV-TV629": "Cámara de seguridad domo Wi-Fi para interior",
    "CV-TV628": "Cámara de seguridad domo Wi-Fi para interior",
    "CV-Q26": "Minicámara de seguridad Wi-Fi para interior",
    "CV-Q17": "Foco con cámara de seguridad PTZ Wi-Fi",
    "CV-Q19": "Foco con cámara de seguridad PTZ de doble lente",
    "CV-Q05": "Foco con cámara de seguridad PTZ Wi-Fi",
    "CV-Q25": "Cámara de seguridad solar Wi-Fi con panel",
    "CV-D21S": "Cámara de seguridad solar tipo bala con panel",
}

BADGE = {"dual": "Doble lente", "foco dual": "Doble lente", "solar": "Energía solar",
         "bateria": "Con batería", "reflectores": "3 reflectores LED", "alerta": "Luces de alerta"}

APPS = {
    "interior": ["Hogar", "Oficinas", "Comercios", "Consultorios", "Recepciones"],
    "exterior": ["Fachadas y accesos", "Patios y cocheras", "Comercios", "Bodegas", "Estacionamientos"],
    "solar": ["Terrenos y ranchos", "Obras en construcción", "Estacionamientos", "Lugares sin conexión eléctrica"],
    "foco": ["Hogar", "Pasillos y cocheras", "Comercios", "Bodegas"],
}


def yn(v):
    return "Sí" if v else "No"


def ficha(c):
    code, model, name, group, page, xref, form, res, rj45, ip66, wifi, track, color, reach, ptz, extra = c
    extra = extra or ""
    dual = "dual" in extra
    mp = f"{res} MP"
    res_txt = " + ".join(f"{r} MP" for r in res.split("+"))
    two_band = "5" in wifi
    wifi_txt = "2.4 GHz y 5 GHz" if two_band else "2.4 GHz"
    night = "Color / blanco y negro" if color else "Blanco y negro"
    use = "solar" if "solar" in extra else "foco" if "foco" in extra else "exterior" if ip66 else "interior"
    place = "exterior" if ip66 else "interior"

    # Descripción con los datos de la tabla.
    kind = KIND[code]
    first = {
        "dual": "Sus dos lentes vigilan dos puntos a la vez con un solo equipo.",
        "foco dual": "Se instala en un portalámparas, como un foco, y sus dos lentes vigilan dos puntos a la vez.",
        "foco": "Se instala en un portalámparas, como un foco: seguridad disimulada y de instalación sencilla.",
        "solar": "Se alimenta con su panel solar y vigila 24/7 sin depender del cableado eléctrico.",
        "bateria": "Funciona con batería, sin cables de corriente, para colocarla donde se necesite.",
        "reflectores": "Integra 3 reflectores LED que iluminan el área que vigila.",
        "alerta": "Integra luces de alerta roja y azul para disuadir a intrusos.",
    }.get(extra, "")
    article = "un" if kind.startswith("Foco") else "una"
    p1 = (f"{model} es {article} {kind[0].lower() + kind[1:]}. Tiene resolución de {res_txt}"
          f"{' y movimiento de giro e inclinación (PTZ)' if ptz else ''}. {first} "
          f"Se conecta por Wi-Fi {wifi_txt}{' o por cable de red RJ45' if rj45 else ''} y se "
          "monitorea en tiempo real desde el celular, con audio bidireccional para escuchar y hablar a través de la cámara.").replace("  ", " ")
    p2 = (f"Detecta movimiento{' y sigue automáticamente al objetivo' if track else ''}; su visión nocturna "
          f"{'a color o en blanco y negro' if color else 'en blanco y negro'} alcanza 10 m y graba en tarjeta MicroSD. "
          f"Es compatible con Alexa{' y su protección IP66 contra polvo y agua la hace apta para exterior' if ip66 else ''}.")

    features = []
    special = {
        "dual": ("Doble lente", "Dos puntos de vigilancia en un solo equipo."),
        "foco dual": ("Doble lente", "Dos puntos de vigilancia desde un portalámparas."),
        "foco": ("Se instala como foco", "En un portalámparas, sin montaje adicional."),
        "solar": ("Energía solar", "Vigilancia 24/7 sin depender del cableado."),
        "bateria": ("Con batería", "Sin cables de corriente."),
        "reflectores": ("3 reflectores LED", "Iluminan el área vigilada."),
        "alerta": ("Luces de alerta", "Luz roja y azul para disuadir."),
    }.get(extra)
    if special:
        features.append({"t": special[0], "d": special[1]})
    features += [
        {"t": "Vista remota", "d": "Monitoreo en tiempo real desde el celular."},
        {"t": "Audio bidireccional", "d": "Escucha y habla a través de la cámara."},
        {"t": "Visión nocturna", "d": f"{'A color o en blanco y negro' if color else 'En blanco y negro'}, hasta 10 m."},
        {"t": "Seguimiento inteligente", "d": "Detecta el movimiento y sigue al objetivo."} if track
        else {"t": "Detección de movimiento", "d": "Detecta el movimiento en su campo de visión."},
    ]

    advantages = [
        {"t": "Desde tu celular", "d": "Supervisión en tiempo real y control remoto desde la app."},
        {"t": "Compatible con Alexa", "d": "Se integra con dispositivos Alexa."},
        {"t": "Grabación local", "d": "Almacenamiento en tarjeta MicroSD."},
    ]
    if ip66:
        advantages.append({"t": "Lista para exterior", "d": "Protección IP66 contra polvo y chorros de agua."})
    if two_band:
        advantages.append({"t": "Wi-Fi de doble banda", "d": "Se conecta a redes de 2.4 GHz y 5 GHz."})
    if rj45:
        advantages.append({"t": "Conexión por cable", "d": "Puerto de red RJ45 además de Wi-Fi."})
    advantages.append({"t": "Instalación disponible", "d": "Instalación y configuración profesional, con acceso remoto listo desde el día uno."})
    advantages = advantages[:6]

    video = [["Resolución", res_txt]]
    if dual:
        video.append(["Lentes", "2 (doble lente)"])
    if ptz:
        video.append(["Movimiento", "PTZ (giro e inclinación)"])
    video += [["Visión nocturna", night], ["Distancia de visión", "10 m"],
              ["Detección de movimiento", "Sí"], ["Seguimiento inteligente", yn(track)]]
    connect = [["Conexión Wi-Fi", wifi_txt], ["Alcance de conexión", f"{reach} m"],
               ["Red cableada RJ45", yn(rj45)], ["Vista remota", "Desde el celular"],
               ["Compatible con Alexa", "Sí"]]
    other = [["Audio bidireccional", "Sí"], ["Almacenamiento", "Tarjeta MicroSD"],
             ["Uso", "Exterior" if ip66 else "Interior"], ["Protección IP66", yn(ip66)]]
    if "solar" in extra:
        other.append(["Alimentación", "Panel solar"])
    elif extra == "bateria":
        other.append(["Alimentación", "Batería"])
    elif "foco" in extra:
        other.append(["Instalación", "En portalámparas (como foco)"])

    kpis = [{"v": res, "u": "MP", "l": "Resolución"},
            {"v": "10", "u": "m", "l": "Visión nocturna"},
            {"v": wifi.replace(" ", ""), "u": "GHz", "l": "Conexión Wi-Fi"},
            {"v": "IP66", "u": "", "l": "Uso exterior"} if ip66 else {"v": "MicroSD", "u": "", "l": "Almacenamiento"}]
    kpis_extra = [{"v": str(reach), "u": "m", "l": "Alcance Wi-Fi"},
                  {"v": "Sí" if track else "Detección", "u": "", "l": "Seguimiento inteligente" if track else "De movimiento"}]

    data = {
        "model": model,
        "kind": kind,
        "power": "",
        "variant": " · ".join(x for x in [
            mp.replace("+", " + "), "PTZ" if ptz else "", f"Wi-Fi {wifi_txt}", place.capitalize()] if x),
        "badge": BADGE.get(extra, "Compatible con Alexa"),
        "hero": f"XOLSEC:p{page}_x{xref}",
        "kpis": kpis,
        "kpis_extra": kpis_extra,
        "description": [p1, p2],
        "features": features[:4],
        "warranty": [],
        "certs": [{"c": "IP66", "l": "Polvo y agua"}] if ip66 else [],
        "specs": [{"name": "Video", "rows": video}, {"name": "Conectividad", "rows": connect},
                  {"name": "Audio, grabación e instalación", "rows": other}],
        "temps": [],
        "advantages": advantages,
        "applications": APPS[use],
        "is_lum": False,
        "group": group,
    }
    entry = {
        "codigo": code, "nombre": name, "archivo": f"{code}.pdf", "paginas": [page],
        "texto": " ".join([name, kind, data["variant"], p1, p2]).lower(),
    }
    return data, entry


def fade_cut_edges(code, ref, band=0.07):
    """Si la foto quedó cortada en un borde (piezas opacas pegadas al borde),
    la desvanece hacia ese lado para que no se vea el corte recto."""
    img = extract(ref, code)
    a = np.asarray(img.getchannel("A"), np.float32)
    h, w = a.shape
    ramp_v, ramp_h = max(8, round(h * band)), max(8, round(w * band))
    fade = np.ones_like(a)
    cut = []
    for side, edge in (("bottom", a[-1]), ("top", a[0]), ("left", a[:, 0]), ("right", a[:, -1])):
        if (edge > 200).mean() < 0.04:
            continue
        cut.append(side)
        n = ramp_v if side in ("top", "bottom") else ramp_h
        r = np.linspace(0, 1, n, dtype=np.float32) ** 1.3
        if side == "bottom":
            fade[-n:] *= r[::-1, None]
        elif side == "top":
            fade[:n] *= r[:, None]
        elif side == "left":
            fade[:, :n] *= r[None, :]
        else:
            fade[:, -n:] *= r[None, ::-1]
    key = image_key(code, ref)
    out = RETOUCH / f"{key}.png"
    if not cut:
        out.unlink(missing_ok=True)
        return []
    img.putalpha(Image.fromarray((a * fade).astype(np.uint8)))
    img.save(out)
    return cut


def main():
    index = [e for e in json.loads(INDEX.read_text()) if not e["codigo"].startswith("CV-")]
    for c in CAMS:
        data, entry = ficha(c)
        code = c[0]
        (SRC / "data" / f"{code}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
        index.append(entry)
        out = RETOUCH / f"{image_key(code, data['hero'])}.png"
        out.unlink(missing_ok=True)  # el retoque se calcula sobre la foto original
        cut = fade_cut_edges(code, data["hero"])
        print(f"{code:10} {entry['nombre']:40} {'bordes: ' + ','.join(cut) if cut else ''}")
    INDEX.write_text(json.dumps(index, ensure_ascii=False, indent=1) + "\n")


if __name__ == "__main__":
    main()

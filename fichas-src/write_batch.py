"""Escribe fichas-src/data/<CODIGO>.json a partir de un módulo Python con un dict D."""
import json, runpy, sys
from pathlib import Path
for mod in sys.argv[1:]:
    D = runpy.run_path(mod)["D"]
    for code, data in D.items():
        Path(__file__).parent.joinpath("data", f"{code}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
        print("ok", code)

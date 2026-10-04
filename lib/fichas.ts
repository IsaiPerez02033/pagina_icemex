// Fichas técnicas del Catálogo ICEMEX 2026 (127 PDFs en public/fichas).
// Los datos se generan con `python3 scripts/build-fichas.py`.

import raw from "./fichas-data.json";
import legacyCodes from "./legacy-codes.json";
import { products, type ProductLine, type ProductTag } from "./products";

export interface FichaImage {
  src: string;
  width: number;
  height: number;
}

export interface Ficha {
  code: string;
  name: string;
  line: ProductLine;
  tags: ProductTag[];
  pages: number[];
  pdf: string;
  image: FichaImage;
  thumb: FichaImage;
  summary: string;
  blocks: { h?: string; t?: string }[];
}

export const fichas = raw as Ficha[];

const byCode = new Map(fichas.map((f) => [f.code.toLowerCase(), f]));

export function getFicha(code: string): Ficha | undefined {
  return byCode.get(code.toLowerCase());
}

// Productos del sitio cuyo código de familia no es el nombre del PDF.
const FICHA_FOR_PRODUCT: Record<string, string> = {
  "PT-RC": "POSTES-RC-CC",
  "PT-CC": "POSTES-RC-CC",
  "PT-ESP-CISNE": "POSTES-ESPECIALES",
  "PT-ESP-GAVIOTA": "POSTES-ESPECIALES",
  "PT-ESP-QUERETARO": "POSTES-ESPECIALES",
  "PT-ESP-LONDON": "POSTES-ESPECIALES",
  "PT-ESP-CORDOVA": "POSTES-ESPECIALES",
  "AC-BAS-0010": "BASE-PIRAMIDAL",
  "AC-BRAZO": "BRAZOS",
  "AC-PICOBA-P01": "PICOBA-P01",
  "AC-PICOBA-P02": "PICOBA-P02",
};

/** Ficha PDF de un producto del sitio (si existe). */
export function fichaForProduct(code: string): Ficha | undefined {
  return getFicha(FICHA_FOR_PRODUCT[code] ?? code);
}

const covered = new Set(
  products
    .map((p) => fichaForProduct(p.code)?.code)
    .filter((c): c is string => !!c)
);

/** Fichas que no tienen un producto del sitio: cada una lleva página propia. */
export const standaloneFichas = fichas.filter((f) => !covered.has(f.code));

/**
 * Códigos viejos del sitio que no correspondían al catálogo oficial → código
 * correcto. Se usan para redirecciones 308 (next.config.js) y en /api/productos.
 */
export const LEGACY_CODES: Record<string, string> = legacyCodes;

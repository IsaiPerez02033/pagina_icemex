// Fichas técnicas del Catálogo ICEMEX 2026 (127 PDFs en public/fichas).
// Los PDF y las fotos se generan con `fichas-src/build.py` y los datos para
// la web con `python3 scripts/build-fichas.py` (ambos leen fichas-src/data).

import raw from "./fichas-data.json";
import legacyCodes from "./legacy-codes.json";
import { products, type Product, type ProductLine, type ProductTag } from "./products";

export interface FichaImage {
  src: string;
  width: number;
  height: number;
}

export interface FichaKpi {
  v: string;
  u: string;
  l: string;
}

export interface Ficha {
  code: string;
  name: string;
  line: ProductLine;
  tags: ProductTag[];
  /** Páginas del Catálogo ICEMEX 2026 donde aparece. */
  pages: number[];
  pdf: string;
  /** Foto del producto (fondo transparente): 1400, 800 y 420 px. */
  image: FichaImage;
  mid: FichaImage;
  thumb: FichaImage;
  /** Portada de la ficha PDF (vista previa y redes sociales). */
  cover: FichaImage;
  coverThumb: FichaImage;
  model: string;
  kind: string;
  power: string;
  variant: string;
  summary: string;
  description: string[];
  kpis: FichaKpi[];
  features: { t: string; d: string }[];
  advantages: { t: string; d: string }[];
  specs: { name: string; rows: [string, string][] }[];
  applications: string[];
  warranty: string[];
  certs: { c: string; l: string }[];
  dims: [string, string][];
  mount: string;
  isLuminaire: boolean;
}

/** Valor de un KPI con su unidad: "150 W", "IP65", "4 in". */
export const kpiValue = (k: FichaKpi) => (k.u ? `${k.v} ${k.u}` : k.v);

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

const productsPerFicha = new Map<string, number>();
for (const p of products) {
  const c = fichaForProduct(p.code)?.code;
  if (c) productsPerFicha.set(c, (productsPerFicha.get(c) ?? 0) + 1);
}
const covered = new Set(productsPerFicha.keys());

/**
 * Ficha que describe exactamente a este producto. Los postes que comparten
 * una ficha de familia (p. ej. los 5 postes especiales) no la usan como
 * contenido propio, solo como PDF descargable.
 */
export function ownFicha(code: string): Ficha | undefined {
  const f = fichaForProduct(code);
  return f && productsPerFicha.get(f.code) === 1 ? f : undefined;
}

const pageForFicha = new Map<string, string>();
for (const p of products) {
  const c = fichaForProduct(p.code)?.code;
  if (c && !pageForFicha.has(c)) pageForFicha.set(c, p.code);
}

/** URL de la página de una ficha (la del producto del sitio si la cubre). */
export const fichaHref = (f: Ficha) => `/producto/${pageForFicha.get(f.code) ?? f.code}`;

/** Datos clave de una ficha como lista plana (indicadores + tablas). */
export function fichaSpecs(f: Ficha): Product["specs"] {
  const seen = new Set<string>();
  const out: Product["specs"] = [];
  const add = (label: string, value: string) => {
    const key = label.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ label, value });
  };
  f.kpis.forEach((k) => add(k.l, kpiValue(k)));
  f.specs.forEach((g) => g.rows.forEach(([l, v]) => add(l, v)));
  return out;
}

/**
 * Producto del sitio con el contenido de su ficha técnica (descripción,
 * especificaciones, aplicaciones…). El nombre, la línea y las etiquetas
 * curadas se conservan.
 */
export function withFicha(p: Product): Product {
  const f = ownFicha(p.code);
  if (!f) return p;
  return {
    ...p,
    tagline: f.kind,
    description: f.description.join("\n\n"),
    applications: f.applications.length ? f.applications : p.applications,
    specs: fichaSpecs(f),
    features: [...f.features, ...f.advantages].map((x) => `${x.t}: ${x.d}`),
    certifications: f.certs.map((c) => c.c),
    warranty: f.warranty.join(" · ") || undefined,
  };
}

/** Todos los productos del sitio, enriquecidos con su ficha. */
export const catalogProducts = products.map(withFicha);

/** Fichas que no tienen un producto del sitio: cada una lleva página propia. */
export const standaloneFichas = fichas.filter((f) => !covered.has(f.code));

/**
 * Códigos viejos del sitio que no correspondían al catálogo oficial → código
 * correcto. Se usan para redirecciones 308 (next.config.js) y en /api/productos.
 */
export const LEGACY_CODES: Record<string, string> = legacyCodes;

// Producto que representa cada línea en la portada (foto de su ficha).
const LINE_PHOTO: Record<ProductLine, string> = {
  AL: "AL-LC1001",
  IS: "IS-LS1003",
  LU: "PP-LC1019",
  RF: "RF-RE1003",
  LC: "LC-GEM1009",
  PT: "POSTES-ESPECIALES",
  AC: "BASE-PIRAMIDAL",
};

// La foto de la ficha de postes especiales trae 5 postes en cuadrícula; en la
// tarjeta se usa solo la fila de arriba (Cisne, Cisne doble y Gaviota).
const POSTES_PHOTO: FichaImage = {
  src: "/lineas/postes.webp?v=95c92abc",
  width: 854,
  height: 455,
};

export interface LineShowcase {
  line: ProductLine;
  count: number;
  photo: FichaImage;
  thumb: FichaImage;
}

/** Foto y número de productos de cada línea (mismo conteo que /productos). */
export function lineShowcase(): LineShowcase[] {
  const counts = new Map<ProductLine, number>();
  for (const x of [...catalogProducts, ...standaloneFichas]) {
    counts.set(x.line, (counts.get(x.line) ?? 0) + 1);
  }
  return (Object.keys(LINE_PHOTO) as ProductLine[]).map((line) => {
    const f = getFicha(LINE_PHOTO[line])!;
    return {
      line,
      count: counts.get(line) ?? 0,
      photo: line === "PT" ? POSTES_PHOTO : f.mid,
      thumb: line === "PT" ? POSTES_PHOTO : f.thumb,
    };
  });
}

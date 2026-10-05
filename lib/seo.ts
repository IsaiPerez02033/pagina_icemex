// Textos para buscadores de cada página de producto con ficha técnica:
// título, descripción, palabras clave y preguntas frecuentes, a partir de los
// datos de la ficha (lib/fichas-data.json). Así cada página responde a como
// la gente busca: por nombre ("bolardo triangular"), por modelo ("titan"),
// por potencia ("luminaria 100 watts") o por marca del LED ("led philips").

import { kpiValue, type Ficha } from "./fichas";
import { lineNames, type ProductLine } from "./products";

// Cómo se buscan los productos de cada línea en México.
const LINE_TERMS: Record<ProductLine, string[]> = {
  AL: ["luminaria LED para alumbrado público", "lámpara LED para calle", "luminaria vial LED", "lámpara para poste de luz", "alumbrado público LED"],
  IS: ["lámpara solar", "luminaria solar LED", "lámpara solar para calle", "lámpara solar con panel", "alumbrado público solar"],
  LU: ["luminario urbano", "farol LED", "bolardo LED", "luminaria para parque", "luminaria para jardín"],
  RF: ["reflector LED", "reflector de alta potencia", "reflector para cancha", "iluminación industrial LED"],
  LC: ["luminario LED comercial", "panel LED", "gabinete LED", "lámpara LED para oficina"],
  PT: ["poste metálico", "poste para alumbrado público", "poste ornamental", "postes de luz"],
  AC: ["accesorios para alumbrado público", "herrajes para poste", "brazo para luminaria"],
};

// Marcas de componentes que la gente busca junto con el producto.
const BRANDS = ["Philips", "CREE", "Osram", "Epistar", "Mean Well", "Bridgelux"];

/** Marca del producto cuando no es ICEMEX: "Panel LED … marca CREE" → "CREE". */
export const productBrand = (f: Ficha) => /\bmarca\s+(\S+)/i.exec(f.kind)?.[1] ?? "ICEMEX";

const WATTS_RX = /\bW\b/;

/** Potencias en watts de la ficha: "60 – 150 W" → [60, 150]. */
export function watts(f: Ficha): number[] {
  const sources = [f.power];
  for (const g of f.specs) {
    for (const [label, value] of g.rows) {
      // "Potencias disponibles", "Potencia nominal"… (no "Factor de potencia").
      if (/^potencias?(\s+(disponibles|nominal(es)?|led))?$/i.test(label.trim())) sources.push(value);
    }
  }
  const out = new Set<number>();
  for (const s of sources) {
    // "2 – 4 × 18 W" son tubos: no es una potencia que se busque así.
    if (!WATTS_RX.test(s) || s.includes("×")) continue;
    const clean = s.replace(/(\d),(\d{3})/g, "$1$2").replace(/[±]?\d+(?:\.\d+)?\s*%/g, "");
    for (const m of clean.matchAll(/\d+(?:\.\d+)?/g)) {
      const n = Number(m[0]);
      if (n >= 3 && n <= 2000) out.add(n);
    }
  }
  return [...out].sort((a, b) => a - b).slice(0, 12);
}

/** Marcas de componentes mencionadas en la ficha (LED, driver…). */
export function brands(f: Ficha): string[] {
  const text = JSON.stringify([f.description, f.features, f.specs, f.kind]);
  return BRANDS.filter((b) => new RegExp(`\\b${b}\\b`, "i").test(text));
}

const hasWatts = (s: string) => /\d\s*W\b/i.test(s);

/** "Bolardo Triangular — Bolardo LED de sección triangular, 30 W". */
export function seoTitle(f: Ficha, name: string): string {
  const power = WATTS_RX.test(f.power) && !hasWatts(name) ? `, ${f.power.replace(/\s+/g, " ")}` : "";
  return `${name} — ${f.kind}${power}`;
}

/** Descripción para el resultado de búsqueda (≈160 caracteres útiles). */
export function seoDescription(f: Ficha, name: string, code: string): string {
  const lead = (f.summary || f.kind).replace(/[.…]?$/, ".");
  const kpis = f.kpis.slice(0, 4).map(kpiValue).join(" · ");
  return `${name} (${code}). ${lead}${kpis ? ` ${kpis}.` : ""} Ficha técnica en PDF y cotización por WhatsApp con ICEMEX.`;
}

/** Palabras clave: nombre, modelo, código, tipo, potencias, marcas y sinónimos. */
export function seoKeywords(f: Ficha, name: string, code: string, line: ProductLine, tags: string[]): string[] {
  const kind = f.kind.toLowerCase();
  // "Bolardo LED de sección triangular" → "bolardo LED"
  const head = f.kind.split(/\s+(?:de|para|con|tipo|marca)\s+/i)[0];
  const list = [
    name,
    f.model,
    code,
    code.replace(/-/g, ""),
    `${name} ICEMEX`,
    `${f.model} ${head}`,
    kind,
    `ficha técnica ${name}`,
    `${name} precio`,
    ...watts(f).flatMap((w) => [`${head} ${w} W`, `${head} ${w} watts`, `${w}W`]),
    ...brands(f).flatMap((b) => [`${head} ${b}`, `LED ${b}`]),
    ...LINE_TERMS[line],
    lineNames[line],
    ...tags,
    ...f.applications.slice(0, 4).map((a) => `${head} para ${a.toLowerCase()}`),
    "ICEMEX",
  ];
  const seen = new Set<string>();
  return list.filter((k) => {
    const key = k.toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export interface Faq {
  q: string;
  a: string;
}

const findKpi = (f: Ficha, rx: RegExp) => f.kpis.find((k) => rx.test(k.l) || rx.test(k.v));

/** Preguntas frecuentes con los datos de la ficha (visibles y en JSON-LD). */
export function seoFaqs(f: Ficha, name: string, code: string): Faq[] {
  const faqs: Faq[] = [];
  const w = watts(f);
  if (w.length) {
    const list = `${w.slice(0, -1).join(", ")} y ${w.at(-1)} watts`;
    const volts = f.variant.split(" · ").find((v) => /\d\s*V\b|V~|V c\.a/.test(v));
    faqs.push({
      q: `¿De cuántos watts es ${name}?`,
      a: `${name} (${code}) ${w.length === 1 ? `es de ${w[0]} watts` : `está disponible en ${list} (${f.power})`}.${
        volts ? ` Voltaje de operación: ${volts.replace(/\.$/, "")}.` : ""
      }`,
    });
  }
  if (f.applications.length) {
    faqs.push({
      q: `¿Para qué se usa ${name}?`,
      a: `${f.kind}. Se recomienda para ${f.applications
        .slice(0, 6)
        .map((a) => a.toLowerCase())
        .join(", ")}.`,
    });
  }
  const ip = findKpi(f, /^IP\d/);
  const life = findKpi(f, /vida/i);
  const flux = findKpi(f, /flujo|lúmenes/i);
  const facts = [
    flux && `flujo luminoso de ${kpiValue(flux)}`,
    ip && `grado de protección ${kpiValue(ip)}`,
    life && `vida útil de ${kpiValue(life)}`,
  ].filter(Boolean);
  if (facts.length) {
    faqs.push({
      q: `¿Qué características técnicas tiene ${name}?`,
      a: `${name} tiene ${facts.join(", ")}.${f.warranty.length ? ` Garantía: ${f.warranty.join("; ")}.` : ""}${
        f.certs.length ? ` Certificaciones: ${f.certs.map((c) => c.c).join(", ")}.` : ""
      }`,
    });
  }
  const brand = productBrand(f);
  const parts = brands(f).filter((b) => b !== brand);
  if (brand !== "ICEMEX" || parts.length) {
    faqs.push({
      q: `¿De qué marca es ${name}?`,
      a: `${name} es marca ${brand}${
        parts.length ? ` y, según su ficha técnica, integra componentes ${parts.join(" y ")}` : ""
      }. Puedes cotizarla con ICEMEX.`,
    });
  }
  faqs.push({
    q: `¿Dónde comprar ${name} y cuál es su precio?`,
    a: `Cotiza ${name} (${code}) directamente con ICEMEX por WhatsApp: te damos precio, disponibilidad y asesoría técnica sin costo. También puedes descargar su ficha técnica en PDF desde esta página.`,
  });
  return faqs;
}

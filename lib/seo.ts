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
  CV: ["cámara de seguridad", "cámara de vigilancia", "cámara Wi-Fi", "cámara IP", "CCTV", "videovigilancia", "venta e instalación de cámaras"],
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

/** Valor de una fila de especificaciones: spec(f, "Resolución") → "2 MP + 2 MP". */
const spec = (f: Ficha, label: string) =>
  f.specs.flatMap((g) => g.rows).find(([l]) => l.toLowerCase() === label.toLowerCase())?.[1];

/** Búsquedas típicas de cámaras: "cámara wifi 4MP", "foco cámara", "cámara solar"… */
function cameraKeywords(f: Ficha): string[] {
  const mp = [...new Set((spec(f, "Resolución") ?? "").match(/\d+(?=\s*MP)/g) ?? [])];
  const kind = f.kind.toLowerCase();
  const out = [
    `cámara de seguridad ${f.model}`,
    `cámara ${f.model}`,
    ...mp.flatMap((n) => [`cámara ${n}MP`, `cámara wifi ${n}MP`, `cámara de seguridad ${n} megapixeles`]),
  ];
  if (spec(f, "Lentes")) out.push("cámara doble lente", "cámara dual", "cámara con dos lentes");
  if (spec(f, "Movimiento")) out.push("cámara PTZ", "cámara PTZ wifi", "cámara que gira");
  if (kind.startsWith("foco")) out.push("foco cámara", "foco con cámara", "cámara foco wifi", "cámara para socket");
  if (kind.includes("solar")) out.push("cámara solar", "cámara solar wifi", "cámara con panel solar", "cámara sin cables");
  if (kind.includes("batería")) out.push("cámara con batería", "cámara inalámbrica");
  if (kind.includes("bala")) out.push("cámara tipo bala", "cámara bullet wifi");
  if (kind.includes("mini")) out.push("mini cámara wifi", "cámara espía");
  if (kind.includes("reflector")) out.push("cámara con reflector", "cámara con luz LED");
  out.push(spec(f, "Uso") === "Exterior" ? "cámara para exterior" : "cámara para interior");
  if (spec(f, "Compatible con Alexa") === "Sí") out.push("cámara compatible con Alexa");
  if (/color/i.test(spec(f, "Visión nocturna") ?? "")) out.push("cámara visión nocturna a color");
  out.push("cámara con audio", "cámara para ver desde el celular", "cámara con memoria microSD");
  return out;
}

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
    ...(line === "CV" ? cameraKeywords(f) : []),
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
  if (f.line === "CV") faqs.push(...cameraFaqs(f, name, code));
  const ip = f.line === "CV" ? undefined : findKpi(f, /^IP\d/);
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

/** Preguntas de cámaras: resolución, uso desde el celular, exterior e instalación. */
function cameraFaqs(f: Ficha, name: string, code: string): Faq[] {
  const res = spec(f, "Resolución");
  const night = spec(f, "Visión nocturna");
  const rj45 = spec(f, "Red cableada RJ45") === "Sí";
  const outdoor = spec(f, "Uso") === "Exterior";
  const faqs: Faq[] = [];
  if (res) {
    faqs.push({
      q: `¿Qué resolución tiene ${name}?`,
      a: `${name} (${code}) graba en ${res}${spec(f, "Lentes") ? " con doble lente: vigila dos puntos a la vez" : ""}.${
        night
          ? ` Visión nocturna ${/color/i.test(night) ? "a color o en blanco y negro" : "en blanco y negro"} con alcance de ${spec(f, "Distancia de visión") ?? "10 m"}.`
          : ""
      }`,
    });
  }
  faqs.push({
    q: `¿Se puede ver ${name} desde el celular?`,
    a: `Sí. Se conecta por Wi-Fi ${spec(f, "Conexión Wi-Fi") ?? ""}${rj45 ? " o por cable de red RJ45" : ""} y permite ver la cámara en tiempo real desde el celular, con audio bidireccional. ${
      spec(f, "Compatible con Alexa") === "Sí" ? "Es compatible con Alexa y graba" : "Graba"
    } en tarjeta MicroSD.`.replace(/\s+/g, " "),
  });
  faqs.push({
    q: `¿${name} sirve para exterior?`,
    a: outdoor
      ? `Sí. ${name} tiene protección IP66 contra polvo y chorros de agua, para fachadas, patios, cocheras y otras zonas abiertas.`
      : `${name} está pensada para interior (no tiene protección IP66). Para exterior te recomendamos un modelo IP66; pregúntanos por WhatsApp.`,
  });
  faqs.push({
    q: `¿ICEMEX instala ${name}?`,
    a: `Sí. Vendemos e instalamos cámaras de seguridad: montaje, conexión y configuración del acceso remoto desde tu celular. Cotiza ${name} con instalación por WhatsApp.`,
  });
  return faqs;
}

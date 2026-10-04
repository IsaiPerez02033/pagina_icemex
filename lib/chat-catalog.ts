// Contexto del catálogo para ICEMEXbot.
//
// Las 127 fichas completas pesan ~85k tokens y la cuenta de Groq permite 8k
// tokens por minuto, así que el bot no puede recibirlas todas en cada mensaje.
// En su lugar recibe:
//   - un índice corto con código y nombre de los 132 productos;
//   - la ficha COMPLETA de los productos que el cliente nombra (por código o
//     por nombre, también los que el bot acaba de recomendar);
//   - un resumen de los productos que mejor coinciden con lo que pide.

import { lineNames, tagNames, type Product, type ProductLine } from "./products";
import {
  catalogProducts,
  fichaForProduct,
  fichaHref,
  kpiValue,
  ownFicha,
  standaloneFichas,
  type Ficha,
} from "./fichas";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Entry {
  code: string;
  name: string;
  line: ProductLine;
  /** Una línea con los datos clave (para recomendaciones). */
  summary: string;
  /** Ficha completa en texto plano. */
  detail: string;
  /** Palabras del código, nombre y tipo (coincidencia fuerte). */
  strong: Set<string>;
  /** Aplicaciones, etiquetas, línea y potencias. */
  medium: Set<string>;
  /** Descripción y características. */
  weak: Set<string>;
}

const SITE = "https://icemex.mx";

const STOPWORDS = new Set(
  (
    "que con para por una uno unos unas los las del como cual cuales cuanto cuanta cuantos " +
    "tiene tienen tienes tengo hay ser son esta este estos estas ese esa eso mas muy sus " +
    "quiero necesito busco buscando ocupo me gustaria podria pueden puedes dame dime info " +
    "informacion favor hola gracias buenas buenos dias tardes noches ficha tecnica datos precio " +
    "cotizar cotizacion producto productos modelo modelos algo alguna alguno otro otra sobre " +
    "tambien pero sin entre cada todo toda todos todas mismo cuando donde desde hasta ademas"
  ).split(" ")
);

/** Minúsculas, sin acentos ni signos. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ");
}

/** Plural → singular aproximado para que "postes" encuentre "poste". */
function stem(word: string): string {
  if (/^\d/.test(word)) return word;
  if (word.length > 5 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 4 && word.endsWith("s")) return word.slice(0, -1);
  return word;
}

function words(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((w) => (w.length >= 3 || /^\d{2,}$/.test(w)) && !STOPWORDS.has(w))
    .map(stem);
}

const wordSet = (...texts: string[]) => new Set(texts.flatMap(words));

const pageUrl = (f: Ficha) => `${SITE}${fichaHref(f)}`;
const pdfUrl = (f: Ficha) => `${SITE}${f.pdf.split("?")[0]}`;

function fichaDetail(f: Ficha, code: string, name: string): string {
  const out = [`[${code}] ${name} — ${lineNames[f.line]}`];
  out.push(`Tipo: ${[f.kind, f.power, f.variant].filter(Boolean).join(" · ")}`);
  if (f.description.length) out.push(`Descripción: ${f.description.join(" ")}`);
  if (f.kpis.length) out.push(`Datos clave: ${f.kpis.map((k) => `${k.l} ${kpiValue(k)}`).join("; ")}`);
  for (const g of f.specs) {
    out.push(`${g.name}: ${g.rows.map(([l, v]) => `${l} ${v}`).join("; ")}`);
  }
  if (f.features.length) {
    out.push(`Características: ${f.features.map((x) => `${x.t} (${x.d})`).join("; ")}`);
  }
  if (f.advantages.length) {
    out.push(`Ventajas: ${f.advantages.map((x) => `${x.t} (${x.d})`).join("; ")}`);
  }
  if (f.dims.length) out.push(`Dimensiones: ${f.dims.map(([l, v]) => `${l} ${v}`).join("; ")}`);
  if (f.mount) out.push(`Instalación: ${f.mount}`);
  if (f.applications.length) out.push(`Aplicaciones: ${f.applications.join(", ")}`);
  out.push(`Garantía: ${f.warranty.join(" · ") || "no indicada en la ficha"}`);
  if (f.certs.length) out.push(`Certificaciones: ${f.certs.map((c) => c.c).join(", ")}`);
  out.push(`Página: ${pageUrl(f)} | PDF: ${pdfUrl(f)}`);
  return out.join("\n");
}

function productDetail(p: Product, family?: Ficha): string {
  const out = [`[${p.code}] ${p.name} — ${lineNames[p.line]}`, `Tipo: ${p.tagline}`];
  if (p.description) out.push(`Descripción: ${p.description}`);
  if (p.specs.length) out.push(`Datos: ${p.specs.map((s) => `${s.label} ${s.value}`).join("; ")}`);
  if (p.features.length) out.push(`Características: ${p.features.join("; ")}`);
  if (p.applications.length) out.push(`Aplicaciones: ${p.applications.join(", ")}`);
  out.push(`Garantía: ${p.warranty ?? "no indicada"}`);
  if (p.certifications?.length) out.push(`Certificaciones: ${p.certifications.join(", ")}`);
  out.push(`Página: ${SITE}/producto/${p.code}`);
  // Postes y accesorios que comparten ficha de familia: sus medidas y
  // variantes están en esa ficha.
  if (family) {
    out.push(`Ficha de la familia (aplica a este producto):\n${fichaDetail(family, family.code, family.name)}`);
  }
  return out.join("\n");
}

function fichaSummary(f: Ficha, code: string, name: string): string {
  const parts = [code, name, f.kind];
  if (f.power) parts.push(f.power);
  if (f.kpis.length) parts.push(f.kpis.slice(0, 4).map((k) => `${k.l} ${kpiValue(k)}`).join(", "));
  if (f.applications.length) parts.push(`Para: ${f.applications.slice(0, 3).join(", ")}`);
  if (f.warranty.length) parts.push(`Garantía ${f.warranty[0]}`);
  return parts.join(" | ");
}

function productSummary(p: Product): string {
  const parts = [p.code, p.name, p.tagline];
  if (p.specs.length) parts.push(p.specs.slice(0, 4).map((s) => `${s.label} ${s.value}`).join(", "));
  if (p.applications.length) parts.push(`Para: ${p.applications.slice(0, 3).join(", ")}`);
  if (p.warranty) parts.push(`Garantía ${p.warranty}`);
  return parts.join(" | ");
}

function fromFicha(f: Ficha, code = f.code, name = f.name, tags = f.tags): Entry {
  return {
    code,
    name,
    line: f.line,
    summary: fichaSummary(f, code, name),
    detail: fichaDetail(f, code, name),
    strong: wordSet(code, code.replace(/-/g, ""), name, f.kind, f.model),
    medium: wordSet(
      f.applications.join(" "),
      tags.map((t) => tagNames[t]).join(" "),
      lineNames[f.line],
      f.power,
      f.variant,
      f.kpis.map(kpiValue).join(" ")
    ),
    weak: wordSet(
      f.description.join(" "),
      f.features.map((x) => x.t).join(" "),
      f.specs.flatMap((g) => g.rows.map(([, v]) => v)).join(" ")
    ),
  };
}

function fromProduct(p: Product): Entry {
  const own = ownFicha(p.code);
  if (own) return fromFicha(own, p.code, p.name, p.tags);
  return {
    code: p.code,
    name: p.name,
    line: p.line,
    summary: productSummary(p),
    detail: productDetail(p, fichaForProduct(p.code)),
    strong: wordSet(p.code, p.code.replace(/-/g, ""), p.name, p.tagline),
    medium: wordSet(
      p.applications.join(" "),
      p.tags.map((t) => tagNames[t]).join(" "),
      lineNames[p.line],
      p.specs.map((s) => s.value).join(" ")
    ),
    weak: wordSet(p.description, p.features.join(" ")),
  };
}

const ENTRIES: Entry[] = [
  ...catalogProducts.map(fromProduct),
  ...standaloneFichas.map((f) => fromFicha(f)),
];

const BY_CODE = new Map(ENTRIES.map((e) => [e.code.toUpperCase(), e]));

/** Índice de los 132 productos por línea: solo código y nombre. */
export const CATALOG_INDEX = (Object.keys(lineNames) as ProductLine[])
  .map((line) => {
    const items = ENTRIES.filter((e) => e.line === line).map((e) => `${e.code} ${e.name}`);
    return `${lineNames[line]} (${items.length}): ${items.join("; ")}`;
  })
  .join("\n");

export const CATALOG_SIZE = ENTRIES.length;

const CODE_RX = /\b[A-Z]{2,}(?:-[A-Z0-9]+)+\b/gi;

/** Códigos del catálogo mencionados en un texto, en orden de aparición. */
function codesIn(text: string): Entry[] {
  const found: Entry[] = [];
  for (const m of text.match(CODE_RX) ?? []) {
    const e = BY_CODE.get(m.toUpperCase());
    if (e && !found.includes(e)) found.push(e);
  }
  return found;
}

function score(e: Entry, query: string[]): number {
  let s = 0;
  for (const w of query) {
    if (e.strong.has(w)) s += 4;
    else if (e.medium.has(w)) s += 2;
    else if (e.weak.has(w)) s += 1;
  }
  return s;
}

const MAX_FULL = 3;
const MAX_CANDIDATES = 6;

/**
 * Bloque de contexto para la conversación: fichas completas de los productos
 * mencionados y resúmenes de los que mejor coinciden con lo que se pide.
 */
export function catalogContext(messages: ChatMessage[]): string {
  const users = messages.filter((m) => m.role === "user");
  const last = users[users.length - 1]?.content ?? "";
  const lastBot = [...messages].reverse().find((m) => m.role === "assistant")?.content ?? "";

  // 1) Fichas completas: códigos del último mensaje, luego los que el bot
  //    acaba de mencionar (para "¿y qué garantía tiene?"), luego anteriores.
  const full: Entry[] = [];
  const addFull = (list: Entry[]) => {
    for (const e of list) if (full.length < MAX_FULL && !full.includes(e)) full.push(e);
  };
  addFull(codesIn(last));
  // 2) Nombre del producto sin código ("la cobra", "reflector estadio").
  const lastWords = words(last);
  if (full.length === 0 && lastWords.length) {
    const byName = ENTRIES.map((e) => ({ e, s: lastWords.filter((w) => e.strong.has(w)).length }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);
    const best = byName[0]?.s ?? 0;
    // Solo si el nombre es distintivo (no "luminaria", que coincide con todo).
    if (best > 0 && byName.filter((x) => x.s === best).length <= 2) {
      addFull(byName.filter((x) => x.s === best).map((x) => x.e));
    }
  }
  addFull(codesIn(lastBot).slice(0, 2));
  for (const m of [...users].reverse().slice(1, 3)) addFull(codesIn(m.content));

  // 3) Candidatos por relevancia: último mensaje pesa doble.
  const query = [...lastWords, ...lastWords, ...users.slice(-3, -1).flatMap((m) => words(m.content))];
  const ranked = ENTRIES.filter((e) => !full.includes(e))
    .map((e) => ({ e, s: score(e, query) }))
    .sort((a, b) => b.s - a.s);
  // Fuera los que apenas coinciden en una palabra suelta ("medidas", "70").
  const cutoff = Math.max(2, (ranked[0]?.s ?? 0) * 0.4);
  const candidates = ranked
    .filter((x) => x.s >= cutoff)
    .slice(0, MAX_CANDIDATES)
    .map((x) => x.e);

  const out: string[] = [];
  if (full.length) {
    out.push(`FICHAS COMPLETAS (datos oficiales; úsalos tal cual):\n${full.map((e) => e.detail).join("\n\n")}`);
  }
  if (candidates.length) {
    out.push(
      `PRODUCTOS RELACIONADOS CON LA PREGUNTA (código | nombre | tipo | datos | aplicaciones | garantía):\n` +
        candidates.map((e) => `- ${e.summary}`).join("\n")
    );
  }
  return out.join("\n\n");
}

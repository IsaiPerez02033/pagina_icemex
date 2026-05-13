import { z } from "zod";
import { products, lineNames, tagNames, type ProductLine, type ProductTag } from "@/lib/products";
import { projects } from "@/lib/projects";

// ============================================================
// Funciones de búsqueda y consulta del catálogo
// ============================================================

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function searchProducts(query: string, tag?: ProductTag, limit = 5) {
  const q = normalize(query);
  const words = q.split(/\s+/).filter(Boolean);

  const scored = products
    .filter((p) => {
      if (tag && !p.tags.includes(tag)) return false;
      return true;
    })
    .map((p) => {
      let score = 0;
      const nameN = normalize(p.name);
      const descN = normalize(p.description);
      const taglineN = normalize(p.tagline);
      const appsN = p.applications.map(normalize).join(" ");

      for (const w of words) {
        if (nameN.includes(w)) score += 10;
        if (taglineN.includes(w)) score += 7;
        if (descN.includes(w)) score += 4;
        if (appsN.includes(w)) score += 3;
        // Match parcial si la palabra es más larga
        for (const field of [nameN, taglineN, descN, appsN]) {
          if (field.includes(w)) {
            score += 1;
            break;
          }
        }
      }

      if (!tag) {
        for (const w of words) {
          if (normalize(tagNames.vialidad).includes(w)) score += p.tags.includes("vialidad") ? 6 : 0;
          if (normalize(tagNames.parques).includes(w)) score += p.tags.includes("parques") ? 6 : 0;
          if (normalize(tagNames.solar).includes(w)) score += p.tags.includes("solar") ? 6 : 0;
          if (normalize(tagNames.industrial).includes(w)) score += p.tags.includes("industrial") ? 6 : 0;
          if (normalize(tagNames.comercial).includes(w)) score += p.tags.includes("comercial") ? 6 : 0;
          if (normalize(tagNames.decorativo).includes(w)) score += p.tags.includes("decorativo") ? 6 : 0;
          if (normalize(tagNames.residencial).includes(w)) score += p.tags.includes("residencial") ? 6 : 0;
          if (normalize(tagNames.tuneles).includes(w)) score += p.tags.includes("tuneles") ? 6 : 0;
        }
      }

      return { product: p, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((s) => s.product);
}

function formatProductSummary(p: typeof products[number]) {
  return {
    code: p.code,
    name: p.name,
    line: `${p.line} — ${lineNames[p.line]}`,
    tags: p.tags.map((t) => tagNames[t]),
    tagline: p.tagline,
    description: p.description,
    applications: p.applications,
  };
}

function formatProductDetail(p: typeof products[number]) {
  return {
    code: p.code,
    name: p.name,
    line: `${p.line} — ${lineNames[p.line]}`,
    tags: p.tags.map((t) => tagNames[t]),
    tagline: p.tagline,
    description: p.description,
    applications: p.applications,
    specs: p.specs,
    features: p.features,
    certifications: p.certifications ?? [],
    warranty: p.warranty ?? "Consultar con ventas",
  };
}

// ============================================================
// Info general de ICEMEX
// ============================================================

const companyInfo = {
  historia: `ICEMEX S.A. de C.V. es una empresa mexicana fundada en 2004, especializada en fabricación, distribución y comercialización de material eléctrico, herrajes y luminarias LED. Hitos clave:
• 2004: Fundación
• 2008: Expansión nacional
• 2014: Migración a LED con tecnología Philips FastFlex y drivers Xitanium
• 2018: Lanzamiento de línea solar All in One con baterías de litio y MPPT patentado
• 2022: Certificaciones ISO 9001, 14001 y 45001
• 2024: AD-50W primera luminaria solar certificada NOM-013-ENER-2013
• 2026: Catálogo expandido a 176 páginas y 7 líneas de producto.

Misión: Innovar con tecnología eléctrica de punta, aportando soluciones integrales.
Visión: Ser referente nacional en iluminación pública, exterior e interior.
Valores: Confiabilidad, precio justo, ética y compromiso, innovación.`,

  servicios: `ICEMEX ofrece 5 frentes de servicio como proveedor integral:
1. Asesoría técnica: Dimensionamiento luminotécnico, cálculo de lux, selección de luminaria según NOM-013-ENER. Incluye estudio DIALux y recomendación de SKUs.
2. Levantamiento de obra: Visita en sitio, medición de distancias, evaluación de postes y alimentación eléctrica. Documentación fotográfica y plano de ubicación.
3. Suministro: Distribución directa de fábrica de Philips, Schneider, IUSA, Tecnolite. +50 SKUs en stock. Tiempos de entrega comprometidos.
4. Instalación con HIAB: Equipo propio con grúa hidráulica, cuadrillas certificadas. Izaje de postes hasta 12m, montaje de brazos, cableado y puesta en servicio.
5. Mantenimiento: Programa preventivo o correctivo. Inspección periódica, reemplazo de componentes, reportes de estado del parque luminoso. Atención correctiva en 48h hábiles.

Proceso: Contacto inicial → Diagnóstico técnico → Propuesta → Suministro e instalación → Mantenimiento.`,

  certificaciones: `ICEMEX cumple con las normas más exigentes:
• ISO 9001 — Gestión de calidad en todos los procesos
• ISO 14001 — Gestión ambiental responsable
• ISO 45001 — Salud y seguridad en el trabajo
• NOM-013-ENER-2013 — Eficiencia energética para alumbrado público
• IP65 / IP66 — Hermeticidad total contra polvo y agua
• IK10 — Resistencia antivandálica contra impactos

Garantías por línea:
• Luminarias LED: 3 años
• Solar All in One: 10 años luminaria · 5 años batería · 20 años panel
• Reflectores BetaLED: 10 años
• AD-50W Solar: 10 años luminaria · 6 años batería
• LR Troffers USA: 10 años`,

  contacto: `Contacta a ICEMEX por cualquiera de estos canales:
• WhatsApp: +52 55 6544 8428
• Email: icemexjorobas@gmail.com
• Teléfono: 593 916 3264
• Oficina: Jorobas, Local 23D, Huehuetoca, Estado de México`,

  proyectos: `ICEMEX ha participado en proyectos como:
• Vialidad Nocturna Urbana (2024) — 240 luminarias LED en vialidad residencial, Edomex
• Corredor FONATUR (2023) — 180 luminarias con tira LED y branding institucional
• Andador GAM (2025) — 96 postes circulares con tira LED 360° en CDMX
• Caminemos Seguras - Acolman (2025) — Señalética metálica corte láser
• Corredor Solar Carretero (2024) — 86 luminarias solares AD-50W en Hidalgo
• Concesionario KIA (2020) — Cubrebrida con logo grabado en relieve
Y más casos en vialidades, parques, estacionamientos y proyectos solares autónomos en toda la República.`,

  productos: `ICEMEX maneja 7 líneas de producto con 38 referencias:
• AL — Alumbrado público: 6 productos para vialidades, avenidas y caminos
• IS — Iluminación solar: 6 productos autónomos con MPPT patentado
• LU — Luminarios urbanos: 4 productos (bolardos, postes decorativos)
• RF — Reflectores: 3 productos de alta potencia, BetaLED y NanoOptic
• LC — Luminarios comerciales: 8 productos para naves, oficinas y comercios
• PT — Postes y postería: 7 productos (rectos, cónicos, decorativos)
• AC — Brazos y herrajes: 4 productos (bases, brazos, picobas)

Tecnologías integradas: Philips FastFlex, Cosmos White, Xitanium Drivers, BetaLED, NanoOptic, MPPT patentado, MultiLED.`,
};

// ============================================================
// Parámetros Zod para las tools
// ============================================================

export const toolSchemas = {
  searchProducts: z.object({
    query: z.string().describe("Texto de búsqueda: palabras clave de lo que el usuario necesita iluminar o el tipo de producto"),
    useCase: z.enum(["vialidad", "parques", "tuneles", "industrial", "comercial", "solar", "decorativo", "residencial"]).optional().describe("Filtrar por tipo de aplicación. Si el usuario menciona una palabra clave como 'parque', 'calle', 'industria', 'sol' usa el tag correspondiente."),
  }),

  getProductDetail: z.object({
    code: z.string().describe("Código exacto del producto (ej. AL-LT1002, IS-LA1005). El usuario te dirá el nombre y tú debes buscar el código."),
  }),

  getProductsByLine: z.object({
    line: z.enum(["AL", "IS", "LU", "RF", "LC", "PT", "AC"]).describe("Código de la línea de producto"),
  }),

  getCompanyInfo: z.object({
    topic: z.enum(["historia", "servicios", "certificaciones", "contacto", "proyectos", "productos"]).describe("Tema sobre el que el usuario quiere información"),
  }),
};

// ============================================================
// Implementaciones de las tools (se ejecutan localmente)
// ============================================================

export function executeSearchProducts(args: z.infer<typeof toolSchemas.searchProducts>) {
  const tag = args.useCase as ProductTag | undefined;
  const results = searchProducts(args.query, tag, 5);

  if (results.length === 0) {
    return "No encontré productos que coincidan exactamente con tu búsqueda. ¿Puedes darme más detalles sobre qué tipo de espacio quieres iluminar y si necesitas corriente eléctrica o solar?";
  }

  return results.map((p) => ({
    type: "product_summary" as const,
    ...formatProductSummary(p),
  }));
}

export function executeGetProductDetail(args: z.infer<typeof toolSchemas.getProductDetail>) {
  const p = products.find((x) => x.code === args.code);
  if (!p) {
    const codes = products.map((x) => `• ${x.code} — ${x.name}`).join("\n");
    return `No encontré el producto con código "${args.code}". Estos son los códigos disponibles:\n${codes}`;
  }
  return {
    type: "product_detail" as const,
    ...formatProductDetail(p),
  };
}

export function executeGetProductsByLine(args: z.infer<typeof toolSchemas.getProductsByLine>) {
  const list = products.filter((p) => p.line === args.line);
  if (list.length === 0) return `No hay productos en la línea ${args.line}.`;
  return {
    type: "line_overview" as const,
    line: args.line as ProductLine,
    lineName: lineNames[args.line as ProductLine],
    count: list.length,
    products: list.map(formatProductSummary),
  };
}

export function executeGetCompanyInfo(args: z.infer<typeof toolSchemas.getCompanyInfo>) {
  return companyInfo[args.topic];
}

// Export para que la UI sepa qué tipo de respuesta es
export type ToolResult =
  | string
  | { type: "product_summary"; code: string; name: string; line: string; tags: string[]; tagline: string; description: string; applications: string[] }
  | { type: "product_detail"; code: string; name: string; line: string; tags: string[]; tagline: string; description: string; applications: string[]; specs: { label: string; value: string }[]; features: string[]; certifications: string[]; warranty: string }
  | { type: "line_overview"; line: string; lineName: string; count: number; products: ReturnType<typeof formatProductSummary>[] }
  | { type: "product_summary"; code: string; name: string; line: string; tags: string[]; tagline: string; description: string; applications: string[] }[];

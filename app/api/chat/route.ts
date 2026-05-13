import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText } from "ai";
import { products, lineNames, tagNames } from "@/lib/products";
import { projects } from "@/lib/projects";

export const runtime = "nodejs";
export const maxDuration = 30;

const groq = createOpenAICompatible({
  name: "groq",
  baseURL: "https://api.groq.com/openai/v1",
  headers: {
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
  },
});

function compactCatalog() {
  return products
    .map((p) => {
      const power = p.specs.find((s) =>
        s.label.toLowerCase().includes("potencia")
      );
      const lumens = p.specs.find(
        (s) =>
          s.label.toLowerCase().includes("flujo") ||
          s.label.toLowerCase().includes("lúmenes")
      );
      const protection = p.specs.find(
        (s) =>
          s.label.toLowerCase().includes("protección") ||
          s.label.toLowerCase().includes("ip")
      );
      const parts = [p.code, p.name, `[${p.line}]`, p.tagline];
      if (power) parts.push(power.value);
      if (lumens) parts.push(lumens.value);
      if (protection) parts.push(protection.value);
      parts.push(`Apps: ${p.applications.slice(0, 3).join(", ")}`);
      if (p.warranty) parts.push(`Garantía: ${p.warranty}`);
      return parts.join(" | ");
    })
    .join("\n");
}

function compactProjects() {
  return projects
    .map((p) => `- ${p.title} (${p.year}): ${p.location}. ${p.description}`)
    .join("\n");
}

const SYSTEM_PROMPT = `Eres ICEMEXbot, asistente virtual de ICEMEX (Importaciones y Comercializaciones Electricas de Mexico). +20 anos. Oficina: Jorobas, Huehuetoca, EdoMex.

CONTACTO: WA Proyectos +52 55 7514 9833 | WA Ventas +52 55 6544 8428 | icemexjorobas@gmail.com | 593 916 3264

SERVICIOS: Asesoria tecnica (DIALux, NOM-013) | Levantamiento en sitio | Suministro directo (Philips, Schneider, IUSA) | Instalacion con grua HIAB propia | Mantenimiento preventivo/correctivo (48h)

CERTIFICACIONES: ISO 9001, 14001, 45001 | NOM-013-ENER | IP65/IP66 | IK10

LINEAS: ${Object.entries(lineNames).map(([k, v]) => `${k}=${v}`).join(", ")}

TAGS: ${Object.entries(tagNames).map(([k, v]) => `${k}=${v}`).join(", ")}

PROYECTOS: ${compactProjects()}

CATALOGO (codigo | nombre | linea | tagline | specs clave | aplicaciones):
${compactCatalog()}

---

TU TRABAJO:
1. Pregunta QUE quiere iluminar (parque, calle, nave, estacionamiento, etc.)
2. Pregunta si necesita ELECTRICO o SOLAR, y altura de instalacion.
3. Busca en el catalogo de arriba y recomienda 2-3 opciones con codigo, nombre, potencia y por que sirve.
4. Si pide ficha completa, entrega todos los datos que veas en el catalogo.
5. Si pregunta de la empresa, responde con la info de arriba.
6. Ofrece contacto por WhatsApp (Proyectos: +52 55 7514 9833, Ventas: +52 55 6544 8428).

REGLAS: Solo espanol. No inventes productos. Se conversacional. No listas enormes.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error interno";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

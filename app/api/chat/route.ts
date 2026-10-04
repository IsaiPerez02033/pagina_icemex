import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText } from "ai";
import { lineNames, tagNames } from "@/lib/products";
import { projects } from "@/lib/projects";
import { catalogProducts, standaloneFichas } from "@/lib/fichas";
import { getClientIp, hashIp, isSameOrigin, rateLimit } from "@/lib/security";

export const runtime = "nodejs";
export const maxDuration = 30;

// Groq retira modelos sin aviso (llama-3.3-70b-versatile dejó de existir y el
// chat respondía vacío). GROQ_MODEL permite cambiarlo desde Vercel sin deploy.
const CHAT_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const groq = createOpenAICompatible({
  name: "groq",
  baseURL: "https://api.groq.com/openai/v1",
  headers: {
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
  },
});

function compactCatalog() {
  return catalogProducts
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

SERVICIOS: Asesoria tecnica (DIALux, NOM-013) | Levantamiento en sitio | Suministro directo (Philips, Schneider, IUSA) | Instalacion con grua HIAB propia | Mantenimiento preventivo/correctivo (48h) | Camaras de seguridad: venta e instalacion de videovigilancia CCTV/IP, cableado y acceso remoto desde celular (obras, naves, comercios, residencias)

CERTIFICACIONES: ISO 9001, 14001, 45001 | NOM-013-ENER | IP65/IP66 | IK10

LINEAS: ${Object.entries(lineNames).map(([k, v]) => `${k}=${v}`).join(", ")}

TAGS: ${Object.entries(tagNames).map(([k, v]) => `${k}=${v}`).join(", ")}

PROYECTOS: ${compactProjects()}

CATALOGO (codigo | nombre | linea | tagline | specs clave | aplicaciones):
${compactCatalog()}

OTRAS FICHAS DEL CATALOGO 2026 (codigo nombre [linea]); cada una tiene pagina en https://icemex.mx/producto/CODIGO con su ficha PDF descargable. Para specs detalladas de estas, manda al cliente a esa pagina o a WhatsApp:
${standaloneFichas.map((f) => `${f.code} ${f.name} [${f.line}]`).join("; ")}

Cada producto tiene un CODIGO UNICO (ej. AL-LT1002, IS-LA1014, PT-RC). Si el usuario menciona un codigo especifico, busca ese producto en el catalogo de arriba y entrega TODOS sus datos: nombre, linea, tagline, descripcion, specs, aplicaciones, caracteristicas, certificaciones y garantia.

Si el usuario vio un codigo en el PDF del catalogo (Catalogo_ICEMEX2026.pdf) y te pregunta por el, dile que lo busque en la lista de arriba o en el PDF, pagina por pagina.

---

TU TRABAJO:
1. Pregunta QUE quiere iluminar (parque, calle, nave, estacionamiento, etc.)
2. Pregunta si necesita ELECTRICO o SOLAR, y altura de instalacion.
3. Busca en el catalogo de arriba y recomienda 2-3 opciones con codigo, nombre, potencia y por que sirve.
4. Si pide ficha completa, entrega todos los datos que veas en el catalogo.
5. Si pregunta de la empresa, responde con la info de arriba.
6. Ofrece contacto por WhatsApp (Proyectos: +52 55 7514 9833, Ventas: +52 55 6544 8428).

REGLAS: Solo espanol. No inventes productos. Se conversacional. No listas enormes.
FORMATO: Es un chat pequeno en celular. Respuestas cortas (maximo ~120 palabras). Texto plano con **negritas** y vinetas "- " si hace falta. NUNCA uses tablas, encabezados con # ni separadores ---.`;

// Límites para que nadie agote la cuota de Groq: historial corto, mensajes
// acotados y solo roles user/assistant (el rol system lo pone el servidor).
const MAX_HISTORY = 12;
const MAX_CHARS = 1200;

type ChatMessage = { role: "user" | "assistant"; content: string };

function sanitize(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const msgs = raw
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  if (msgs.length === 0 || msgs[msgs.length - 1].role !== "user") return null;
  return msgs;
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request) {
  if (!isSameOrigin(req.headers)) return jsonError("Origen no permitido", 403);

  const visitor = hashIp(getClientIp(req.headers));
  // 20 mensajes por 10 minutos por visitante.
  if (!(await rateLimit(`chat:${visitor}`, 20, 600))) {
    return jsonError(
      "Has enviado muchos mensajes seguidos. Espera unos minutos o escríbenos por WhatsApp.",
      429
    );
  }

  try {
    const body = await req.json().catch(() => null);
    const messages = sanitize(body?.messages);
    if (!messages) return jsonError("Mensajes inválidos", 400);

    const result = streamText({
      model: groq(CHAT_MODEL),
      system: SYSTEM_PROMPT,
      messages,
      maxOutputTokens: 1200,
      // gpt-oss razona antes de contestar; "low" basta para recomendar
      // productos y responde más rápido.
      providerOptions: { groq: { reasoning_effort: "low" } },
      onError: ({ error }) => console.error("[chat] stream", error),
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    console.error("[chat]", error);
    return jsonError("Error interno", 500);
  }
}

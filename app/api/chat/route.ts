import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText } from "ai";
import { lineNames, tagNames } from "@/lib/products";
import { projects } from "@/lib/projects";
import { CATALOG_INDEX, CATALOG_SIZE, catalogContext } from "@/lib/chat-catalog";
import { getClientIp, hashIp, isSameOrigin, rateLimit } from "@/lib/security";

export const runtime = "nodejs";
export const maxDuration = 30;

// Groq retira modelos sin aviso (llama-3.3-70b-versatile dejó de existir y el
// chat respondía vacío). GROQ_MODEL permite cambiarlo desde Vercel sin deploy.
// Cada modelo tiene su propio límite (8k tokens/min en el plan gratuito): si
// el primero está saturado o deja de existir, se usa el siguiente.
const CHAT_MODELS = [
  ...new Set([
    process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.8-27b",
  ]),
];

const groq = createOpenAICompatible({
  name: "groq",
  baseURL: "https://api.groq.com/openai/v1",
  headers: {
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
  },
});

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

CATALOGO: ${CATALOG_SIZE} productos, cada uno con CODIGO UNICO, pagina https://icemex.mx/producto/CODIGO y ficha tecnica PDF. Indice (codigo nombre):
${CATALOG_INDEX}

Con cada mensaje recibes ademas, al final, las FICHAS COMPLETAS de los productos que el cliente menciona y un resumen de los PRODUCTOS RELACIONADOS con su pregunta. Esos son los unicos datos tecnicos que conoces.

---

TU TRABAJO:
1. Pregunta QUE quiere iluminar (parque, calle, nave, estacionamiento, etc.)
2. Pregunta si necesita ELECTRICO o SOLAR, y altura de instalacion.
3. Recomienda 2-3 opciones de PRODUCTOS RELACIONADOS con codigo, nombre, potencia y por que sirve.
4. Si pregunta por un producto, responde con los datos de su FICHA COMPLETA (potencias, flujo, IP, medidas, garantia...). Contesta lo que pregunto; no agregues productos relacionados salvo que pida opciones.
5. Si pregunta de la empresa, responde con la info de arriba.
6. Ofrece contacto por WhatsApp (Proyectos: +52 55 7514 9833, Ventas: +52 55 6544 8428).

REGLAS: Solo espanol. Se conversacional. No listas enormes.
NUNCA inventes productos ni datos tecnicos: potencia, lumenes, garantia, materiales o medidas solo si aparecen en las fichas o resumenes que recibes. Si un dato no aparece, dilo y manda al cliente a la pagina del producto o a WhatsApp. Si el cliente menciona un producto del indice sin que tengas su ficha, pidele el codigo o nombre exacto. Si nada del catalogo es lo que pide, dilo claro y ofrece asesoria por WhatsApp; no presentes un producto como si fuera de otro tipo (una luminaria solar no es un panel suelto).
ENLACES: Escribe SIEMPRE el CODIGO exacto de cada producto que menciones (p. ej. IS-AO1026). El chat convierte cada codigo en un enlace y muestra debajo una tarjeta con foto, pagina y ficha tecnica PDF, asi que NO escribas URLs ni "https://icemex.mx/producto/CODIGO"; si el cliente pide la ficha o el link, dile que la tiene en la tarjeta de abajo.
Las FICHAS COMPLETAS y PRODUCTOS RELACIONADOS son notas internas para ti: NUNCA copies esos bloques ni sus titulos en tu respuesta; redacta tu propia recomendacion.
FORMATO: Es un chat pequeno en celular. Respuestas cortas (maximo ~120 palabras). Texto plano con **negritas** y vinetas "- " si hace falta. NUNCA uses tablas, encabezados con # ni separadores ---.`;

// Límites para que nadie agote la cuota de Groq: historial corto, mensajes
// acotados y solo roles user/assistant (el rol system lo pone el servidor).
const MAX_HISTORY = 10;
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

/**
 * Prueba los modelos en orden hasta que uno empiece a responder. Un 429 (cuota
 * por minuto agotada) o un modelo retirado no llega al cliente: pasa al
 * siguiente. Devuelve el texto como stream, o null si ninguno respondió.
 */
async function firstAvailableModel(
  system: string,
  messages: ChatMessage[]
): Promise<ReadableStream<Uint8Array> | null> {
  for (const id of CHAT_MODELS) {
    const result = streamText({
      model: groq(id),
      system,
      messages,
      maxOutputTokens: 1000,
      maxRetries: 0,
      // gpt-oss razona antes de contestar; "low" basta para recomendar
      // productos y responde más rápido.
      providerOptions: id.startsWith("openai/gpt-oss")
        ? { groq: { reasoning_effort: "low" } }
        : undefined,
      onFinish: ({ usage }) =>
        console.info(`[chat] ${id} tokens in=${usage.inputTokens} out=${usage.outputTokens}`),
    });
    const parts = result.fullStream[Symbol.asyncIterator]();
    let first: string | null = null;
    let failed = false;
    try {
      while (first === null) {
        const { done, value } = await parts.next();
        if (done) break;
        if (value.type === "text-delta" && value.text) first = value.text;
        else if (value.type === "error") {
          console.warn(`[chat] ${id} falló, probando el siguiente modelo`, value.error);
          failed = true;
          break;
        }
      }
    } catch (error) {
      console.warn(`[chat] ${id} falló, probando el siguiente modelo`, error);
      failed = true;
    }
    if (failed || first === null) continue;

    const encoder = new TextEncoder();
    const head = first;
    return new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(encoder.encode(head));
        try {
          for (;;) {
            const { done, value } = await parts.next();
            if (done) break;
            if (value.type === "text-delta") controller.enqueue(encoder.encode(value.text));
            else if (value.type === "error") console.error("[chat] stream", value.error);
          }
        } catch (error) {
          console.error("[chat] stream", error);
        }
        controller.close();
      },
    });
  }
  return null;
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

    const context = catalogContext(messages);
    const system = context ? `${SYSTEM_PROMPT}\n\n${context}` : SYSTEM_PROMPT;
    const stream = await firstAvailableModel(system, messages);
    if (!stream) {
      return jsonError(
        "El asistente está saturado en este momento. Intenta en un minuto o escríbenos por WhatsApp.",
        429
      );
    }
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: unknown) {
    console.error("[chat]", error);
    return jsonError("Error interno", 500);
  }
}

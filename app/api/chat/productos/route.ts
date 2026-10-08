import { CHAT_LINKS } from "@/lib/chat-catalog";

// Índice ligero (código → nombre, foto, página y PDF) que el chat descarga una
// vez al abrirse para enlazar los productos que recomienda el bot.
export const dynamic = "force-static";

export function GET() {
  return Response.json(CHAT_LINKS, {
    headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { kv } from "@vercel/kv";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const status = {
    hasUrl: !!process.env.KV_URL,
    hasRestUrl: !!process.env.KV_REST_API_URL,
    hasToken: !!process.env.KV_REST_API_TOKEN,
    hasReadOnlyToken: !!process.env.KV_REST_API_READ_ONLY_TOKEN,
  };

  try {
    const testKey = "icemex:diagnostic:test";
    await kv.set(testKey, Date.now().toString(), { ex: 60 });
    const value = await kv.get(testKey);
    await kv.del(testKey);

    if (value) {
      return NextResponse.json({
        ...status,
        connected: true,
        message: "KV conectado y funcionando correctamente",
      });
    }
    return NextResponse.json({
      ...status,
      connected: false,
      message: "KV escribio pero no leyo",
    });
  } catch (e) {
    return NextResponse.json({
      ...status,
      connected: false,
      message: "Error al conectar con KV",
      error: String(e),
    });
  }
}

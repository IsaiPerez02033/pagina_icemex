import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@vercel/kv";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const status = {
    hasRedisUrl: !!process.env.REDIS_URL,
    hasUrl: !!process.env.KV_URL,
    hasRestUrl: !!process.env.KV_REST_API_URL,
    hasToken: !!process.env.KV_REST_API_TOKEN,
    hasReadOnlyToken: !!process.env.KV_REST_API_READ_ONLY_TOKEN,
  };

  try {
    const client = createClient({
      url: process.env.KV_REST_API_URL || process.env.KV_URL || process.env.REDIS_URL || "",
      token: process.env.KV_REST_API_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN || "",
    });

    const testKey = "icemex:diagnostic:test";
    await client.set(testKey, Date.now().toString(), { ex: 60 });
    const value = await client.get(testKey);
    await client.del(testKey);

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
  } catch (e: any) {
    return NextResponse.json({
      ...status,
      connected: false,
      message: "Error al conectar con KV",
      error: String(e?.message || e),
    });
  }
}

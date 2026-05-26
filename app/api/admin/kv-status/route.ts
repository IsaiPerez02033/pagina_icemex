import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Redis } from "@upstash/redis";

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
  };

  try {
    const client = new Redis({ url: process.env.REDIS_URL || process.env.KV_URL || "" });

    const testKey = "icemex:diagnostic:test";
    await client.set(testKey, Date.now().toString(), { ex: 60 });
    const value = await client.get(testKey);
    await client.del(testKey);

    if (value) {
      return NextResponse.json({ ...status, connected: true, message: "KV conectado correctamente" });
    }
    return NextResponse.json({ ...status, connected: false, message: "KV escribio pero no leyo" });
  } catch (e: any) {
    return NextResponse.json({ ...status, connected: false, message: "Error conexion KV", error: String(e?.message || e) });
  }
}

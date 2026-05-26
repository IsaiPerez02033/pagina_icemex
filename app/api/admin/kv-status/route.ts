import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Redis } from "@upstash/redis";

function parseRedisUrl(raw: string) {
  try {
    const u = new URL(raw);
    const token = u.password || "";
    const host = u.hostname.replace(".db.redis.io", ".upstash.io");
    return { url: `https://${host}`, token };
  } catch {
    return { url: raw, token: "" };
  }
}

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const status = {
    hasRedisUrl: !!process.env.REDIS_URL,
    hasUrl: !!process.env.KV_URL,
    hasRestUrl: !!process.env.KV_REST_API_URL,
  };

  try {
    const parsed = parseRedisUrl(process.env.REDIS_URL || process.env.KV_URL || "");
    const client = new Redis(parsed as any);

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

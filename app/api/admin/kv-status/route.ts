import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@vercel/kv";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const envVars = {
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? "presente ✅" : "FALTA ❌",
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? "presente ✅" : "FALTA ❌",
    KV_REST_API_URL: process.env.KV_REST_API_URL ? "presente" : "FALTA",
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? "presente" : "FALTA",
    REDIS_URL: process.env.REDIS_URL ? "presente" : "ausente",
  };

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return NextResponse.json({
      connected: false,
      message: "UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN no configuradas en Vercel",
      envVars,
    });
  }

  try {
    const client = createClient({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const testKey = "icemex:diagnostic:test";
    await client.set(testKey, Date.now().toString(), { ex: 60 });
    const value = await client.get(testKey);
    await client.del(testKey);

    if (value) {
      return NextResponse.json({
        connected: true,
        message: "KV conectado y funcionando correctamente",
        envVars,
      });
    }
    return NextResponse.json({
      connected: false,
      message: "KV escribió pero no leyó el valor de vuelta",
      envVars,
    });
  } catch (e: any) {
    return NextResponse.json({
      connected: false,
      message: "Error de conexión con KV",
      error: String(e?.message || e),
      envVars,
    });
  }
}

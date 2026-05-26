import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@vercel/kv";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const envVars = {
    KV_REST_API_URL: process.env.KV_REST_API_URL ? "presente ✅" : "FALTA ❌",
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? "presente ✅" : "FALTA ❌",
    KV_URL: process.env.KV_URL ? "presente" : "ausente",
    REDIS_URL: process.env.REDIS_URL ? "presente" : "ausente",
  };

  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json({
      connected: false,
      message: "Variables de entorno KV no configuradas en Vercel. Agrégalas en Settings → Environment Variables.",
      envVars,
    });
  }

  try {
    const client = createClient({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
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

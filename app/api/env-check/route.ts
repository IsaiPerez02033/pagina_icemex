import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    KV_REST_API_URL: process.env.KV_REST_API_URL
      ? process.env.KV_REST_API_URL.substring(0, 30) + "..."
      : "FALTA",
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? "presente" : "FALTA",
    KV_URL: process.env.KV_URL ? "presente" : "FALTA",
    REDIS_URL: process.env.REDIS_URL ? "presente" : "FALTA",
    GROQ_API_KEY: process.env.GROQ_API_KEY ? "presente" : "FALTA",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "presente" : "FALTA",
    totalEnvKeys: Object.keys(process.env).length,
    kvKeys: Object.keys(process.env)
      .filter((k) => k.toLowerCase().includes("kv") || k.toLowerCase().includes("redis") || k.toLowerCase().includes("upstash"))
      .sort(),
  });
}

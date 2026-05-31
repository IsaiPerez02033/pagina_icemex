import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL
      ? process.env.UPSTASH_REDIS_REST_URL.substring(0, 30) + "..."
      : "FALTA",
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? "presente" : "FALTA",
    KV_REST_API_URL: process.env.KV_REST_API_URL ? "presente" : "FALTA",
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? "presente" : "FALTA",
    KV_URL: process.env.KV_URL ? "presente" : "FALTA",
    REDIS_URL: process.env.REDIS_URL ? "presente" : "FALTA",
    VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN ? "presente" : "FALTA",
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID || "FALTA",
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID || "FALTA",
    GROQ_API_KEY: process.env.GROQ_API_KEY ? "presente" : "FALTA",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "presente" : "FALTA",
    totalEnvKeys: Object.keys(process.env).length,
    allKeys: Object.keys(process.env)
      .filter((k) =>
        k.toLowerCase().includes("kv") ||
        k.toLowerCase().includes("redis") ||
        k.toLowerCase().includes("upstash") ||
        k.toLowerCase().includes("vercel") ||
        k.toLowerCase().includes("admin") ||
        k.toLowerCase().includes("next")
      )
      .sort(),
  });
}

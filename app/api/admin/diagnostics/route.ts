import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const envVars = {
    VERCEL_API_TOKEN: mask(process.env.VERCEL_API_TOKEN),
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID || "FALTA",
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID || "FALTA",
    KV_REST_API_URL: process.env.KV_REST_API_URL
      ? process.env.KV_REST_API_URL.substring(0, 35) + "..."
      : "FALTA",
    KV_REST_API_TOKEN: mask(process.env.KV_REST_API_TOKEN),
    REDIS_URL: process.env.REDIS_URL ? "presente ✅" : "ausente",
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "FALTA",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "FALTA",
    GROQ_API_KEY: mask(process.env.GROQ_API_KEY),
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "FALTA",
  };

  const results: Record<string, { status: "ok" | "error" | "skipped"; message: string }> = {};

  // Test 1: Vercel Analytics API
  if (process.env.VERCEL_API_TOKEN && process.env.VERCEL_PROJECT_ID && process.env.VERCEL_TEAM_ID) {
    try {
      const res = await fetch(
        `https://api.vercel.com/v2/web/insights/${process.env.VERCEL_TEAM_ID}/${process.env.VERCEL_PROJECT_ID}/audience?from=${daysAgo(30)}&to=${today()}`,
        { headers: { Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}` } }
      );
      if (res.ok) {
        const data = await res.json();
        results.vercelAnalytics = { status: "ok", message: `Conectado. Datos: ${JSON.stringify(data).substring(0, 100)}` };
      } else {
        results.vercelAnalytics = { status: "error", message: `HTTP ${res.status}: ${await res.text().then(t => t.substring(0, 100))}` };
      }
    } catch (e: any) {
      results.vercelAnalytics = { status: "error", message: String(e?.message).substring(0, 100) };
    }
  } else {
    results.vercelAnalytics = { status: "skipped", message: "Faltan VERCEL_API_TOKEN, VERCEL_PROJECT_ID, o VERCEL_TEAM_ID" };
  }

  // Test 2: Upstash KV REST API
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const res = await fetch(`${process.env.KV_REST_API_URL}/ping`, {
        headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
      });
      if (res.ok) {
        const data = await res.json();
        results.upstashKV = { status: "ok", message: `Ping exitoso: ${JSON.stringify(data)}` };
      } else {
        results.upstashKV = { status: "error", message: `HTTP ${res.status}: ${await res.text().then(t => t.substring(0, 100))}` };
      }
    } catch (e: any) {
      results.upstashKV = { status: "error", message: String(e?.message).substring(0, 100) };
    }
  } else {
    results.upstashKV = { status: "skipped", message: "Faltan KV_REST_API_URL o KV_REST_API_TOKEN" };
  }

  return NextResponse.json({ envVars, results });
}

function mask(val: string | undefined) {
  if (!val) return "FALTA";
  return val.substring(0, 10) + "...";
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function today() {
  return new Date().toISOString().split("T")[0];
}

import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: cors() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  try {
    const url = process.env.KV_REST_API_URL || "";
    const token = process.env.KV_REST_API_TOKEN || "";

    if (!url || !token) {
      return NextResponse.json({ ok: false, error: "KV_REST_API_URL or KV_REST_API_TOKEN not found" }, { headers: cors() });
    }

    const redis = new Redis({ url, token });

    if (body.type === "event") {
      await redis.incr(`icemex:event:${today()}:${body.name}`);
      return NextResponse.json({ ok: true }, { headers: cors() });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const country = req.headers.get("x-vercel-ip-country") || "unknown";
    const todayStr = today();
    const hour = new Date().getHours();
    const ts = Date.now();
    const p = body.path || "/";
    const path = p === "/" ? "/" : p;

    await redis.incr(`icemex:pv:${todayStr}:${path}`);
    await redis.expire(`icemex:pv:${todayStr}:${path}`, 30 * 24 * 3600);

    if (ip && ip !== "unknown") {
      let hash = 0;
      for (let i = 0; i < ip.length; i++) hash = (hash << 5) - hash + ip.charCodeAt(i);
      await redis.set(`icemex:visitor:${todayStr}:${Math.abs(hash).toString(36)}`, ts, { ex: 30 * 24 * 3600 });
    }

    if (country && country !== "unknown") {
      await redis.incr(`icemex:country:${todayStr}:${country}`);
    }

    const ua = req.headers.get("user-agent") || "";
    let device = "Desktop";
    if (/iphone|ipod|android.*mobile/i.test(ua)) device = "Mobile";
    else if (/ipad|tablet/i.test(ua)) device = "Tablet";
    await redis.incr(`icemex:device:${todayStr}:${device}`);

    await redis.set(`icemex:realtime:${hour}:${ip.substring(0, 6)}`, ts, { ex: 300 });

    return NextResponse.json({ ok: true }, { headers: cors() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500, headers: cors() });
  }
}

function today() {
  return new Date().toISOString().split("T")[0];
}

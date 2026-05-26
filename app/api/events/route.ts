import { NextRequest, NextResponse } from "next/server";
import { recordPageView, recordEvent } from "@/lib/admin/kv-store";

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
    if (body.type === "event") {
      await recordEvent(body.name);
      return NextResponse.json({ ok: true }, { headers: cors() });
    }

    // Page view tracking
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const country = req.headers.get("x-vercel-ip-country") || "unknown";

    await recordPageView({
      path: body.path || req.headers.get("referer") || "/",
      userAgent: req.headers.get("user-agent") || undefined,
      ip,
      country,
    });

    return NextResponse.json({ ok: true }, { headers: cors() });
  } catch (e) {
    console.error("[events] Error recording:", e);
    return NextResponse.json({ ok: false }, { status: 500, headers: cors() });
  }
}

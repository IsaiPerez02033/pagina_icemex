import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getClientIp, hashIp, isSameOrigin, rateLimit } from "@/lib/security";
import { EVENT_NAMES, recordEvent, recordPageView, type EventName } from "@/lib/admin/kv-store";

// Rutas válidas para contar páginas vistas: solo minúsculas, números, guiones
// y diagonales (los códigos de producto se normalizan a minúsculas). Cualquier
// otra cosa se descarta para que nadie pueda inflar Redis con claves basura.
const PATH_RE = /^\/[a-z0-9\-/]{0,80}$/;

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req.headers)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const redis = getRedis();
  if (!redis) return NextResponse.json({ ok: false }, { status: 503 });

  const ip = getClientIp(req.headers);
  const visitor = hashIp(ip);
  if (!(await rateLimit(`ev:${visitor}`, 60, 60))) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as {
    type?: unknown;
    name?: unknown;
    path?: unknown;
  } | null;
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    if (body.type === "event") {
      if (!EVENT_NAMES.includes(body.name as EventName)) {
        return NextResponse.json({ ok: false }, { status: 400 });
      }
      await recordEvent(redis, body.name as EventName);
      return NextResponse.json({ ok: true });
    }

    const path = typeof body.path === "string" ? body.path.toLowerCase() : "";
    if (!PATH_RE.test(path) || path.startsWith("/admin")) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const country = req.headers.get("x-vercel-ip-country") || undefined;
    await recordPageView(redis, {
      path: path.length > 1 ? path.replace(/\/+$/, "") : path,
      visitor,
      country: country && /^[A-Z]{2}$/.test(country) ? country : undefined,
      userAgent: req.headers.get("user-agent") || "",
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

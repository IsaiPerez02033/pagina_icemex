import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getClientIp, hashIp, isSameOrigin, rateLimit } from "@/lib/security";
import { parseLead, saveLead } from "@/lib/leads";

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req.headers)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const redis = getRedis();
  if (!redis) return NextResponse.json({ ok: false }, { status: 503 });

  // 10 envíos por hora por visitante: suficiente para un humano.
  const visitor = hashIp(getClientIp(req.headers));
  if (!(await rateLimit(`lead:${visitor}`, 10, 3600))) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const lead = parseLead(await req.json().catch(() => null));
  if (!lead) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    await saveLead(redis, lead);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[leads]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

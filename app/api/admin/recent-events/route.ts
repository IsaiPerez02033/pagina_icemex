import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createClient } from "@vercel/kv";

export const dynamic = "force-dynamic";

interface TimelineEvent {
  name: string;
  ts: number;
}

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";

  if (!url || !token) {
    return NextResponse.json({ events: [] });
  }

  try {
    const redis = createClient({ url, token });
    const raw = await redis.lrange("icemex:timeline", 0, 9);
    const events: TimelineEvent[] = raw.map((r) => {
      try {
        return typeof r === "string" ? JSON.parse(r) : r;
      } catch {
        return { name: "unknown", ts: 0 };
      }
    });
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [] });
  }
}

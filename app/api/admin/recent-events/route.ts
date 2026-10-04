import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getRedis } from "@/lib/redis";

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

  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ events: [] });
  }

  try {
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

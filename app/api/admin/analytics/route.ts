import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getRedis } from "@/lib/redis";
import { getDashboardData } from "@/lib/admin/kv-store";
import {
  getDashboardMetrics,
  getTrafficData,
  getDeviceData,
  getTopPages,
  getCountries,
  getEvents,
  getRealtimeUsers,
} from "@/lib/admin/mock-data";

export const dynamic = "force-dynamic";

function mockResponse(source: "mock" | "kv_error") {
  return NextResponse.json({
    metrics: getDashboardMetrics(),
    traffic: getTrafficData(30),
    devices: getDeviceData(),
    topPages: getTopPages(),
    countries: getCountries(),
    events: getEvents(),
    realtime: getRealtimeUsers(),
    source,
    kvConnected: false,
  });
}

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const redis = getRedis();
  if (!redis) return mockResponse("mock");

  try {
    const d = await getDashboardData(redis, 30);

    return NextResponse.json({
      metrics: [
        { label: "Visitantes (30d)", value: d.visitors.toLocaleString(), change: 0, icon: "users" },
        { label: "Páginas vistas", value: d.pageViews.toLocaleString(), change: 0, icon: "activity" },
        { label: "Tasa de rebote", value: "—", change: 0, icon: "trending-down" },
        { label: "Tpo. promedio", value: "—", change: 0, icon: "check-circle" },
      ],
      traffic: d.traffic,
      devices: d.devices.map((x) => ({ name: x.device, value: x.percentage })),
      topPages: d.topPages.map((p) => ({ page: p.path, views: p.views, avgTime: "—", bounceRate: "—" })),
      countries: d.countries,
      events: d.events.map((e) => ({ name: e.name, count: e.count, trend: 0 })),
      realtime: d.realtime,
      source: "kv",
      kvConnected: true,
    });
  } catch (e) {
    console.error("[analytics]", e);
    return mockResponse("kv_error");
  }
}

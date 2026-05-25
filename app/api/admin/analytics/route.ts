import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getMetrics, getRealtimeCount, getEventCounts } from "@/lib/admin/kv-store";
import {
  getDashboardMetrics,
  getTrafficData,
  getDeviceData,
  getTopPages,
  getCountries,
  getEvents,
  getRealtimeUsers,
} from "@/lib/admin/mock-data";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Intentar datos reales de Vercel KV
  try {
    const kvMetrics = await getMetrics(30);
    const realtime = await getRealtimeCount();
    const eventCounts = await getEventCounts(30);

    if (kvMetrics && kvMetrics.visitors > 0) {
      return NextResponse.json({
        metrics: [
          { label: "Visitantes (30d)", value: kvMetrics.visitors.toLocaleString(), change: 0, icon: "users" },
          { label: "Páginas vistas", value: kvMetrics.pageViews.toLocaleString(), change: 0, icon: "activity" },
          { label: "Tasa de rebote", value: "—", change: 0, icon: "trending-down" },
          { label: "Tpo. promedio", value: "—", change: 0, icon: "check-circle" },
        ],
        traffic: getTrafficData(30),
        devices: kvMetrics.devices.length > 0
          ? kvMetrics.devices.map((d) => ({ name: d.device, value: d.percentage }))
          : getDeviceData(),
        topPages: kvMetrics.topPages.length > 0
          ? kvMetrics.topPages.map((p) => ({ page: p.path, views: p.views, avgTime: "—", bounceRate: "—" }))
          : getTopPages(),
        countries: kvMetrics.countries,
        events: eventCounts.length > 0
          ? eventCounts.map((e) => ({ name: e.name, count: e.count, trend: 0 }))
          : getEvents(),
        realtime: realtime || getRealtimeUsers(),
        source: "kv",
      });
    }
  } catch {
    // KV no configurado — usar mock data
  }

  return NextResponse.json({
    metrics: getDashboardMetrics(),
    traffic: getTrafficData(30),
    devices: getDeviceData(),
    topPages: getTopPages(),
    countries: getCountries(),
    events: getEvents(),
    realtime: getRealtimeUsers(),
    source: "mock",
  });
}

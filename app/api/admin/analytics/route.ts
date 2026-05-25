import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getVercelAnalytics } from "@/lib/admin/vercel-analytics";
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

  // Intentar datos reales de Vercel Analytics
  const vercel = await getVercelAnalytics();

  // Si hay datos de Vercel, mapearlos. Si no, usar mock data.
  const realTopPages = vercel?.topPages?.length
    ? vercel.topPages.map((p) => ({
        page: p.path,
        views: p.views,
        avgTime: "—",
        bounceRate: "—",
      }))
    : getTopPages();

  const realMetrics = vercel
    ? [
        { label: "Visitantes (30d)", value: vercel.visitors.toLocaleString(), change: 0, icon: "users" },
        { label: "Páginas vistas", value: vercel.pageViews.toLocaleString(), change: 0, icon: "activity" },
        { label: "Tasa de rebote", value: `${(vercel.bounceRate * 100).toFixed(1)}%`, change: 0, icon: "trending-down" },
        { label: "Tpo. promedio", value: formatDuration(vercel.avgDuration), change: 0, icon: "check-circle" },
      ]
    : getDashboardMetrics();

  return NextResponse.json({
    metrics: realMetrics,
    traffic: getTrafficData(30),
    devices: getDeviceData(),
    topPages: realTopPages,
    countries: getCountries(),
    events: getEvents(),
    realtime: getRealtimeUsers(),
    source: vercel ? "vercel_analytics" : "mock",
  });
}

function formatDuration(seconds: number) {
  if (!seconds || seconds === 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

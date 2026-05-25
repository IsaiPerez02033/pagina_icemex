import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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

  return NextResponse.json({
    metrics: getDashboardMetrics(),
    traffic: getTrafficData(30),
    devices: getDeviceData(),
    topPages: getTopPages(),
    countries: getCountries(),
    events: getEvents(),
    realtime: getRealtimeUsers(),
  });
}

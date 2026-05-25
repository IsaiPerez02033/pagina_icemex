import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getKeywords } from "@/lib/admin/mock-data";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const keywords = getKeywords();
  return NextResponse.json({
    keywords,
    totalImpressions: keywords.reduce((s, k) => s + k.impressions, 0),
    totalClicks: keywords.reduce((s, k) => s + k.clicks, 0),
    avgCtr: keywords.length > 0 ? keywords.reduce((s, k) => s + k.ctr, 0) / keywords.length : 0,
    avgPosition: keywords.length > 0 ? keywords.reduce((s, k) => s + k.position, 0) / keywords.length : 0,
  });
}

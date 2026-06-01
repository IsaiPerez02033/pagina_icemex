import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getSearchConsoleData } from "@/lib/admin/google/searchConsole";
import { getKeywords } from "@/lib/admin/mock-data";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Diagnóstico de variables faltantes
  const missing: string[] = [];
  if (!process.env.GOOGLE_CLIENT_ID) missing.push("GOOGLE_CLIENT_ID");
  if (!process.env.GOOGLE_CLIENT_SECRET) missing.push("GOOGLE_CLIENT_SECRET");
  if (!process.env.GOOGLE_REFRESH_TOKEN) missing.push("GOOGLE_REFRESH_TOKEN");

  // Intentar datos reales de Google Search Console
  let realError: string | null = null;
  try {
    const realData = await getSearchConsoleData();
    if (realData) {
      return NextResponse.json({ ...realData, source: "search_console" });
    }
  } catch (e: any) {
    realError = String(e?.message || e);
    console.error("[SearchConsole Route]", realError);
  }

  // Fallback a mock data con diagnóstico
  const keywords = getKeywords();
  return NextResponse.json({
    keywords,
    totalImpressions: keywords.reduce((s, k) => s + k.impressions, 0),
    totalClicks: keywords.reduce((s, k) => s + k.clicks, 0),
    avgCtr: keywords.length > 0 ? keywords.reduce((s, k) => s + k.ctr, 0) / keywords.length : 0,
    avgPosition: keywords.length > 0 ? keywords.reduce((s, k) => s + k.position, 0) / keywords.length : 0,
    source: "mock",
    diagnostics: {
      missingEnvVars: missing,
      scError: realError,
      hint: realError || (missing.length > 0
        ? `Faltan variables en Vercel: ${missing.join(", ")}.`
        : "Variables OK pero la API de Search Console no respondió."),
    },
  });
}

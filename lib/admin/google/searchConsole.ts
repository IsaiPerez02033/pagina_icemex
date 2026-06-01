// Google Search Console API — OAuth 2.0 con cuenta Gmail
// Requiere: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, SEARCH_CONSOLE_SITE_URL
//
// Setup:
// 1. Crear OAuth Client ID tipo Desktop en Google Cloud Console
// 2. Generar refresh token con el script scripts/oauth-token.js
// 3. Agregar las 3 vars en Vercel

import { google } from "googleapis";

export interface KeywordResult {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

export async function getSearchConsoleData(): Promise<{
  keywords: KeywordResult[];
  totalImpressions: number;
  totalClicks: number;
  avgCtr: number;
  avgPosition: number;
} | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const siteUrl = process.env.SEARCH_CONSOLE_SITE_URL || "https://icemex.mx";

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn("[SearchConsole] Falta GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET o GOOGLE_REFRESH_TOKEN");
    return null;
  }

  try {
    const auth = new google.auth.OAuth2(clientId, clientSecret, "http://localhost");
    auth.setCredentials({ refresh_token: refreshToken });

    const searchConsole = google.webmasters({ version: "v3", auth });

    const response = await searchConsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: "30daysAgo",
        endDate: "today",
        dimensions: ["query"],
        rowLimit: 10,
      },
    });

    const rows = response.data.rows || [];
    const keywords: KeywordResult[] = rows.map((r) => ({
      query: r.keys?.[0] || "unknown",
      impressions: r.impressions || 0,
      clicks: r.clicks || 0,
      ctr: Math.round((r.ctr || 0) * 100 * 10) / 10,
      position: Math.round((r.position || 0) * 10) / 10,
    }));

    const totalImpressions = keywords.reduce((s, k) => s + k.impressions, 0);
    const totalClicks = keywords.reduce((s, k) => s + k.clicks, 0);
    const avgCtr = keywords.length > 0 ? keywords.reduce((s, k) => s + k.ctr, 0) / keywords.length : 0;
    const avgPosition = keywords.length > 0 ? keywords.reduce((s, k) => s + k.position, 0) / keywords.length : 0;

    return { keywords, totalImpressions, totalClicks, avgCtr, avgPosition };
  } catch (e: any) {
    console.error("[SearchConsole] API error:", e?.message || e);
    return null;
  }
}

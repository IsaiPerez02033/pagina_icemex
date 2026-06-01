// Google Search Console API — Service account integration
// Requiere: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, SEARCH_CONSOLE_SITE_URL
//
// Pasos:
// 1. Agrega icemex-ga4@adept-primacy-453922-u6.iam.gserviceaccount.com como usuario en Search Console
// 2. Ve a https://search.google.com/search-console → Settings → Users and permissions → Add user
// 3. Pega el email del Service Account y asigna rol "Full" o "Restricted"

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
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const siteUrl = process.env.SEARCH_CONSOLE_SITE_URL || "https://icemex.mx";

  if (!clientEmail || !privateKey) {
    console.warn("[SearchConsole] GOOGLE_CLIENT_EMAIL o GOOGLE_PRIVATE_KEY no configurados");
    return null;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });

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

// Google Search Console API — Service account integration
// Requiere: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, propiedad verificada en Search Console
//
// Para activar:
// 1. Agregar el service account como usuario en Google Search Console
// 2. Configurar .env.local

export async function getSearchConsoleData() {
  // Placeholder — devuelve datos mock hasta que se configuren las credenciales
  return {
    totalImpressions: 45200,
    totalClicks: 3554,
    avgCtr: 7.86,
    avgPosition: 12.4,
  };
}

/*
// Implementación real (descomentar cuando estén las credenciales):

import { google } from "googleapis";

export async function getSearchConsoleData() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });

  const searchConsole = google.webmasters({ version: "v3", auth });

  const response = await searchConsole.searchanalytics.query({
    siteUrl: process.env.SEARCH_CONSOLE_SITE_URL!,
    requestBody: {
      startDate: "30daysAgo",
      endDate: "today",
      dimensions: ["query"],
      rowLimit: 10,
    },
  });

  const rows = response.data.rows || [];
  return {
    keywords: rows.map((r) => ({
      query: r.keys?.[0],
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: r.ctr,
      position: r.position,
    })),
  };
}
*/

export type SearchConsoleData = {
  totalImpressions: number;
  totalClicks: number;
  avgCtr: number;
  avgPosition: number;
};

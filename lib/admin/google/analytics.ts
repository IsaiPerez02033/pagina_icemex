// Google Analytics Data API (GA4) — Service account integration
// Requiere: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GA4_PROPERTY_ID
//
// Para activar:
// 1. Crear Service Account en Google Cloud Console
// 2. Dar acceso a la propiedad GA4
// 3. Configurar .env.local

// import { BetaAnalyticsDataClient } from "@google-analytics/data";

export async function getAnalyticsReport() {
  // Placeholder — devuelve datos mock hasta que se configuren las credenciales
  return {
    activeUsers: 34,
    totalVisitors: 847,
    bounceRate: 0.382,
    avgSessionDuration: 252,
  };
}

/*
// Implementación real (descomentar cuando estén las credenciales):

import { BetaAnalyticsDataClient } from "@google-analytics/data";

export async function getAnalyticsReport() {
  const client = new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
  });

  const [response] = await client.runReport({
    property: `properties/${process.env.GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    metrics: [
      { name: "activeUsers" },
      { name: "bounceRate" },
      { name: "averageSessionDuration" },
    ],
  });

  return {
    activeUsers: parseInt(response.rows?.[0]?.metricValues?.[0]?.value || "0"),
    bounceRate: parseFloat(response.rows?.[0]?.metricValues?.[1]?.value || "0"),
    avgSessionDuration: parseFloat(response.rows?.[0]?.metricValues?.[2]?.value || "0"),
  };
}
*/

export type AnalyticsReport = {
  activeUsers: number;
  totalVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
};

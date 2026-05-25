// Vercel Analytics API — datos server-side para el dashboard admin.
// Requiere: VERCEL_API_TOKEN (Settings → Tokens en Vercel Dashboard)
// Docs: https://vercel.com/docs/rest-api/endpoints/web-insights

const VERCEL_API = "https://api.vercel.com";
const TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

async function fetchVercel(endpoint: string) {
  if (!TOKEN) {
    console.warn("[Vercel Analytics] VERCEL_API_TOKEN no configurado");
    return null;
  }
  const res = await fetch(`${VERCEL_API}${endpoint}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export interface VercelAnalyticsData {
  visitors: number;
  pageViews: number;
  bounceRate: number;
  avgDuration: number;
  topPages: { path: string; views: number }[];
  countries: { country: string; visitors: number }[];
  devices: { device: string; percentage: number }[];
}

export async function getVercelAnalytics(): Promise<VercelAnalyticsData | null> {
  if (!TOKEN || !PROJECT_ID) return null;

  try {
    // Obtener métricas de audiencia (últimos 30 días)
    const audience = await fetchVercel(
      `/v1/web-insights/${PROJECT_ID}/audience?from=${daysAgo(30)}&to=today&limit=1`
    );

    // Obtener top pages
    const topPages = await fetchVercel(
      `/v1/web-insights/${PROJECT_ID}/pages?from=${daysAgo(7)}&to=today&limit=7`
    );

    return {
      visitors: audience?.data?.[0]?.visitors ?? 0,
      pageViews: audience?.data?.[0]?.pageViews ?? 0,
      bounceRate: audience?.data?.[0]?.bounceRate ?? 0,
      avgDuration: audience?.data?.[0]?.avgDuration ?? 0,
      topPages: (topPages?.data ?? []).map((p: { path: string; pageViews: number }) => ({
        path: p.path,
        views: p.pageViews,
      })),
      countries: [],
      devices: [],
    };
  } catch {
    return null;
  }
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function today() {
  return new Date().toISOString().split("T")[0];
}

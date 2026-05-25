import type { MetricCardData, TrafficPoint, DeviceData, TopPage, CountryData, KeywordData, EventData } from "./types";

export function getDashboardMetrics(): MetricCardData[] {
  return [
    { label: "Visitantes hoy", value: "847", change: 12.5, icon: "users" },
    { label: "Usuarios activos", value: "34", change: 8.2, icon: "activity" },
    { label: "Tasa de rebote", value: "38.2%", change: -3.1, icon: "trending-down" },
    { label: "Conversiones", value: "23", change: 18.4, icon: "check-circle" },
  ];
}

export function getTrafficData(days: number): TrafficPoint[] {
  const data: TrafficPoint[] = [];
  const base = 600;
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString("es-MX", { weekday: "short", day: "numeric" });
    const variation = Math.floor(Math.random() * 400) - 100;
    const weekend = date.getDay() === 0 || date.getDay() === 6 ? -150 : 0;
    data.push({
      date: dayName,
      visitors: base + variation + weekend,
      pageViews: Math.floor((base + variation + weekend) * 2.6),
    });
  }
  return data;
}

export function getDeviceData(): DeviceData[] {
  return [
    { name: "Desktop", value: 58 },
    { name: "Mobile", value: 35 },
    { name: "Tablet", value: 7 },
  ];
}

export function getTopPages(): TopPage[] {
  return [
    { page: "/", views: 3240, avgTime: "4m 12s", bounceRate: "32%" },
    { page: "/productos", views: 1820, avgTime: "2m 45s", bounceRate: "38%" },
    { page: "/producto/AL-LT1002", views: 940, avgTime: "1m 50s", bounceRate: "28%" },
    { page: "/catalogo", views: 720, avgTime: "3m 20s", bounceRate: "45%" },
    { page: "/servicios", views: 610, avgTime: "2m 10s", bounceRate: "40%" },
    { page: "/nosotros", views: 480, avgTime: "1m 35s", bounceRate: "52%" },
    { page: "/producto/IS-LA1005", views: 420, avgTime: "1m 40s", bounceRate: "25%" },
  ];
}

export function getCountries(): CountryData[] {
  return [
    { country: "México", flag: "MX", visitors: 6840 },
    { country: "Estados Unidos", flag: "US", visitors: 420 },
    { country: "Colombia", flag: "CO", visitors: 280 },
    { country: "Perú", flag: "PE", visitors: 195 },
    { country: "Chile", flag: "CL", visitors: 140 },
    { country: "España", flag: "ES", visitors: 85 },
  ];
}

export function getKeywords(): KeywordData[] {
  return [
    { query: "postes de alumbrado público", impressions: 12400, clicks: 620, ctr: 5.0, position: 8.2 },
    { query: "luminarias LED México", impressions: 8900, clicks: 445, ctr: 5.0, position: 10.5 },
    { query: "icemex", impressions: 5600, clicks: 1680, ctr: 30.0, position: 1.2 },
    { query: "fabricante de postes metálicos", impressions: 4200, clicks: 210, ctr: 5.0, position: 12.8 },
    { query: "alumbrado público municipal", impressions: 3800, clicks: 152, ctr: 4.0, position: 15.3 },
    { query: "iluminación solar para calles", impressions: 3100, clicks: 186, ctr: 6.0, position: 9.7 },
    { query: "reflectores LED industriales", impressions: 2400, clicks: 96, ctr: 4.0, position: 14.1 },
    { query: "cotizar iluminación proyecto", impressions: 1800, clicks: 72, ctr: 4.0, position: 11.4 },
    { query: "postes cónicos precio", impressions: 1500, clicks: 45, ctr: 3.0, position: 18.2 },
    { query: "herrajes eléctricos México", impressions: 1200, clicks: 48, ctr: 4.0, position: 16.5 },
  ];
}

export function getEvents(): EventData[] {
  return [
    { name: "WhatsApp clicks", count: 142, trend: 14.5 },
    { name: "Formularios enviados", count: 38, trend: 22.3 },
    { name: "Catálogo PDF descargado", count: 86, trend: 8.7 },
    { name: "Chatbot conversaciones", count: 210, trend: 31.2 },
  ];
}

export function getRealtimeUsers(): number {
  return Math.floor(Math.random() * 15) + 3;
}

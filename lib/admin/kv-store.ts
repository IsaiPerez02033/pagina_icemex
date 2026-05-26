// Vercel KV — almacenamiento serverless para métricas del dashboard.
// Requiere: Vercel KV activado en el proyecto (Settings → Storage → Connect KV)

import { createClient } from "@vercel/kv";

const kvClient = createClient({
  url: process.env.KV_REST_API_URL || process.env.KV_URL || process.env.REDIS_URL || "",
  token: process.env.KV_REST_API_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN || "",
});

const PREFIX = "icemex:";
const RETENTION_DAYS = 30;

export async function recordPageView(data: {
  path: string;
  referrer?: string;
  userAgent?: string;
  ip?: string;
  country?: string;
}) {
  const today = new Date().toISOString().split("T")[0];
  const hour = new Date().getHours();
  const ts = Date.now();

  const p = data.path === "/" ? "/" : data.path;

  await kvClient.incr(`${PREFIX}pv:${today}:${p}`);
  await kvClient.expire(`${PREFIX}pv:${today}:${p}`, RETENTION_DAYS * 24 * 3600);

  if (data.ip) {
    const visitorKey = `${PREFIX}visitor:${today}:${hashIP(data.ip)}`;
    await kvClient.set(visitorKey, ts, { ex: RETENTION_DAYS * 24 * 3600 });
  }

  if (data.country) {
    await kvClient.incr(`${PREFIX}country:${today}:${data.country}`);
    await kvClient.expire(`${PREFIX}country:${today}:${data.country}`, RETENTION_DAYS * 24 * 3600);
  }

  if (data.userAgent) {
    const device = detectDevice(data.userAgent);
    await kvClient.incr(`${PREFIX}device:${today}:${device}`);
    await kvClient.expire(`${PREFIX}device:${today}:${device}`, RETENTION_DAYS * 24 * 3600);
  }

  const realtimeKey = `${PREFIX}realtime:${hour}:${hashIP(data.ip || "unknown")}`;
  await kvClient.set(realtimeKey, ts, { ex: 300 });
}

export async function recordEvent(name: string) {
  const today = new Date().toISOString().split("T")[0];
  await kvClient.incr(`${PREFIX}event:${today}:${name}`);
  await kvClient.expire(`${PREFIX}event:${today}:${name}`, RETENTION_DAYS * 24 * 3600);
}

export async function getMetrics(days = 30) {
  const dates: string[] = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }

  let totalPageViews = 0;
  const topPages: Record<string, number> = {};
  let uniqueVisitors = 0;
  const countries: Record<string, number> = {};
  const devices: Record<string, number> = {};

  for (const date of dates) {
    const pvKeys = await kvClient.keys(`${PREFIX}pv:${date}:*`);
    for (const key of pvKeys) {
      const count = await kvClient.get<number>(key);
      if (count) {
        totalPageViews += count;
        const path = key.replace(`${PREFIX}pv:${date}:`, "");
        topPages[path] = (topPages[path] || 0) + count;
      }
    }

    const visitorKeys = await kvClient.keys(`${PREFIX}visitor:${date}:*`);
    uniqueVisitors += visitorKeys.length;

    const countryKeys = await kvClient.keys(`${PREFIX}country:${date}:*`);
    for (const key of countryKeys) {
      const count = await kvClient.get<number>(key);
      if (count) {
        const country = key.replace(`${PREFIX}country:${date}:`, "");
        countries[country] = (countries[country] || 0) + count;
      }
    }

    const deviceKeys = await kvClient.keys(`${PREFIX}device:${date}:*`);
    for (const key of deviceKeys) {
      const count = await kvClient.get<number>(key);
      if (count) {
        const device = key.replace(`${PREFIX}device:${date}:`, "");
        devices[device] = (devices[device] || 0) + count;
      }
    }
  }

  return {
    visitors: uniqueVisitors,
    pageViews: totalPageViews,
    topPages: Object.entries(topPages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 7)
      .map(([path, views]) => ({ path, views })),
    countries: Object.entries(countries)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([country, visitors]) => ({ country, visitors })),
    devices: Object.entries(devices).map(([device, count]) => ({
      device,
      percentage: Math.round((count / (totalPageViews || 1)) * 100),
    })),
  };
}

export async function getRealtimeCount() {
  const hour = new Date().getHours();
  const keys = await kvClient.keys(`${PREFIX}realtime:${hour}:*`);
  return keys.length;
}

export async function getEventCounts(days = 30) {
  const dates: string[] = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }

  const events: Record<string, number> = {};
  for (const date of dates) {
    const keys = await kvClient.keys(`${PREFIX}event:${date}:*`);
    for (const key of keys) {
      const count = await kvClient.get<number>(key);
      if (count) {
        const name = key.replace(`${PREFIX}event:${date}:`, "");
        events[name] = (events[name] || 0) + count;
      }
    }
  }

  return Object.entries(events).map(([name, count]) => ({ name, count }));
}

function hashIP(ip: string) {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const chr = ip.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
  }
  return Math.abs(hash).toString(36);
}

function detectDevice(ua: string) {
  const uaLower = ua.toLowerCase();
  if (/iphone|ipod/.test(uaLower)) return "Mobile";
  if (/android.*mobile/.test(uaLower)) return "Mobile";
  if (/ipad|tablet/.test(uaLower)) return "Tablet";
  return "Desktop";
}

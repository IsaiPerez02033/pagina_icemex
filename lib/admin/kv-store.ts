// Analytics propios en Upstash Redis.
//
// Modelo (una clave por día, todas con TTL):
//   icemex:d:{fecha}:pv       HASH  ruta → páginas vistas
//   icemex:d:{fecha}:country  HASH  país → visitas
//   icemex:d:{fecha}:device   HASH  Mobile/Tablet/Desktop → visitas
//   icemex:d:{fecha}:event    HASH  evento → conteo
//   icemex:d:{fecha}:uv       HyperLogLog de visitantes únicos (IP hasheada)
//   icemex:rt                 ZSET  visitante → último timestamp (tiempo real)
//   icemex:timeline           LIST  últimos 20 eventos (notificaciones)
//
// Leer 30 días son ~155 comandos en UN solo pipeline (antes: SCAN + GET por
// clave en serie, miles de viajes). Las fechas van en hora de México.

import type { Redis } from "@upstash/redis";
import { mxDate } from "@/lib/security";

const PREFIX = "icemex:";
const TTL = 35 * 24 * 3600;
const REALTIME_WINDOW_MS = 5 * 60 * 1000;

// Días anteriores a este corte se guardaron con el formato viejo
// (icemex:pv:{fecha}:{ruta}, etc.). Se leen con SCAN solo si el día no tiene
// datos nuevos. Pasados 30 días del corte este camino ya no se usa.
const LEGACY_CUTOVER = "2026-10-04";

export const EVENT_NAMES = [
  "whatsapp_click",
  "form_submit",
  "pdf_download",
  "chatbot_conversation",
] as const;
export type EventName = (typeof EVENT_NAMES)[number];

const dayKey = (date: string, kind: string) => `${PREFIX}d:${date}:${kind}`;

export function detectDevice(ua: string) {
  const u = ua.toLowerCase();
  if (/iphone|ipod|android.*mobile/.test(u)) return "Mobile";
  if (/ipad|tablet|android/.test(u)) return "Tablet";
  return "Desktop";
}

export async function recordPageView(
  redis: Redis,
  data: { path: string; visitor: string; country?: string; userAgent?: string }
) {
  const date = mxDate();
  const p = redis.pipeline();
  p.hincrby(dayKey(date, "pv"), data.path, 1);
  p.expire(dayKey(date, "pv"), TTL);
  p.pfadd(dayKey(date, "uv"), data.visitor);
  p.expire(dayKey(date, "uv"), TTL);
  if (data.country) {
    p.hincrby(dayKey(date, "country"), data.country, 1);
    p.expire(dayKey(date, "country"), TTL);
  }
  p.hincrby(dayKey(date, "device"), detectDevice(data.userAgent || ""), 1);
  p.expire(dayKey(date, "device"), TTL);
  const now = Date.now();
  p.zadd(`${PREFIX}rt`, { score: now, member: data.visitor });
  p.zremrangebyscore(`${PREFIX}rt`, 0, now - REALTIME_WINDOW_MS);
  await p.exec();
}

export async function recordEvent(redis: Redis, name: EventName) {
  const date = mxDate();
  const p = redis.pipeline();
  p.hincrby(dayKey(date, "event"), name, 1);
  p.expire(dayKey(date, "event"), TTL);
  p.lpush(`${PREFIX}timeline`, JSON.stringify({ name, ts: Date.now() }));
  p.ltrim(`${PREFIX}timeline`, 0, 19);
  p.expire(`${PREFIX}timeline`, TTL);
  await p.exec();
}

type Counts = Record<string, number>;
interface DayData {
  date: string;
  pv: Counts;
  country: Counts;
  device: Counts;
  event: Counts;
  uv: number;
}

function lastDates(days: number): string[] {
  const out: string[] = [];
  for (let i = days; i >= 0; i--) {
    out.push(mxDate(new Date(Date.now() - i * 24 * 3600 * 1000)));
  }
  return out;
}

function toCounts(h: unknown): Counts {
  const out: Counts = {};
  if (h && typeof h === "object") {
    for (const [k, v] of Object.entries(h as Record<string, unknown>)) {
      out[k] = Number(v) || 0;
    }
  }
  return out;
}

const sum = (c: Counts) => Object.values(c).reduce((a, b) => a + b, 0);

async function scanAll(redis: Redis, match: string): Promise<string[]> {
  const keys: string[] = [];
  let cursor: string | number = 0;
  do {
    const [next, found]: [string | number, string[]] = await redis.scan(cursor, {
      match,
      count: 500,
    });
    keys.push(...found);
    cursor = next;
  } while (String(cursor) !== "0");
  return keys;
}

async function legacyCounts(redis: Redis, kind: string, date: string) {
  const prefix = `${PREFIX}${kind}:${date}:`;
  const keys = await scanAll(redis, `${prefix}*`);
  if (keys.length === 0) return { counts: {} as Counts, keys };
  const values = await redis.mget<(number | null)[]>(...keys);
  const counts: Counts = {};
  keys.forEach((k, i) => {
    counts[k.slice(prefix.length)] = Number(values[i]) || 0;
  });
  return { counts, keys };
}

async function legacyDay(redis: Redis, date: string): Promise<DayData> {
  const [pv, country, device, event, visitors] = await Promise.all([
    legacyCounts(redis, "pv", date),
    legacyCounts(redis, "country", date),
    legacyCounts(redis, "device", date),
    legacyCounts(redis, "event", date),
    scanAll(redis, `${PREFIX}visitor:${date}:*`),
  ]);
  return {
    date,
    pv: pv.counts,
    country: country.counts,
    device: device.counts,
    event: event.counts,
    uv: visitors.length,
  };
}

async function readDays(redis: Redis, days: number): Promise<DayData[]> {
  const dates = lastDates(days);
  const p = redis.pipeline();
  for (const d of dates) {
    p.hgetall(dayKey(d, "pv"));
    p.hgetall(dayKey(d, "country"));
    p.hgetall(dayKey(d, "device"));
    p.hgetall(dayKey(d, "event"));
    p.pfcount(dayKey(d, "uv"));
  }
  const res = await p.exec<unknown[]>();

  return Promise.all(
    dates.map(async (date, i) => {
      const day: DayData = {
        date,
        pv: toCounts(res[i * 5]),
        country: toCounts(res[i * 5 + 1]),
        device: toCounts(res[i * 5 + 2]),
        event: toCounts(res[i * 5 + 3]),
        uv: Number(res[i * 5 + 4]) || 0,
      };
      if (date < LEGACY_CUTOVER && sum(day.pv) === 0) {
        return legacyDay(redis, date);
      }
      return day;
    })
  );
}

function merge(list: Counts[]): Counts {
  const out: Counts = {};
  for (const c of list) {
    for (const [k, v] of Object.entries(c)) out[k] = (out[k] || 0) + v;
  }
  return out;
}

const top = (c: Counts, n: number) =>
  Object.entries(c)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n);

export async function getDashboardData(redis: Redis, days = 30) {
  const [data, realtime] = await Promise.all([
    readDays(redis, days),
    redis.zcount(`${PREFIX}rt`, Date.now() - REALTIME_WINDOW_MS, "+inf"),
  ]);

  const pv = merge(data.map((d) => d.pv));
  const devices = merge(data.map((d) => d.device));
  const totalDevices = sum(devices) || 1;

  return {
    visitors: data.reduce((a, d) => a + d.uv, 0),
    pageViews: sum(pv),
    topPages: top(pv, 7).map(([path, views]) => ({ path, views })),
    countries: top(merge(data.map((d) => d.country)), 6).map(
      ([country, visitors]) => ({ country, visitors })
    ),
    devices: Object.entries(devices).map(([device, count]) => ({
      device,
      percentage: Math.round((count / totalDevices) * 100),
    })),
    events: Object.entries(merge(data.map((d) => d.event))).map(
      ([name, count]) => ({ name, count })
    ),
    traffic: data.map((d) => ({
      date: new Date(`${d.date}T12:00:00`).toLocaleDateString("es-MX", {
        weekday: "short",
        day: "numeric",
      }),
      visitors: d.uv,
      pageViews: sum(d.pv),
    })),
    realtime,
  };
}

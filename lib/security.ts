// Utilidades de seguridad para las rutas de API públicas.

import { createHash, timingSafeEqual } from "crypto";
import { getRedis } from "@/lib/redis";

/** IP del cliente según los headers de Vercel. */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Hash irreversible de la IP (no se guarda la IP en claro). */
export function hashIp(ip: string): string {
  const salt = process.env.NEXTAUTH_SECRET || "icemex";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 16);
}

/**
 * Solo acepta peticiones hechas desde el propio sitio (mismo host).
 * Los navegadores siempre mandan Origin en POST; los scripts externos que no
 * lo mandan, o lo mandan de otro dominio, quedan fuera.
 */
export function isSameOrigin(headers: Headers): boolean {
  const origin = headers.get("origin");
  const host = headers.get("x-forwarded-host") || headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Rate limit de ventana fija en Redis. Devuelve true si la petición se permite.
 * Si Redis no está disponible deja pasar (fail-open) para no tirar el sitio.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number
): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return true;
  try {
    const k = `icemex:rl:${key}`;
    const count = await redis.incr(k);
    if (count === 1) await redis.expire(k, windowSec);
    return count <= limit;
  } catch {
    return true;
  }
}

/** Comparación de strings en tiempo constante. */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** Fecha YYYY-MM-DD en hora de México (no UTC). */
export function mxDate(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

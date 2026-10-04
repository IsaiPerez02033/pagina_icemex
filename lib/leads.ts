// Leads de los formularios del sitio (cotización y descarga de catálogo).
// Antes solo se abrían en WhatsApp: si el visitante no le daba "enviar", el
// lead se perdía. Ahora se guardan en Redis y se ven en /admin/leads.

import type { Redis } from "@upstash/redis";

const KEY = "icemex:leads";
const MAX_LEADS = 5000;

export const LEAD_SOURCES = ["contacto", "catalogo"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export interface Lead {
  id: string;
  ts: number;
  source: LeadSource;
  nombre: string;
  empresa: string;
  email: string;
  tipo: string;
  mensaje: string;
  pagina: string;
}

const LIMITS = { nombre: 120, empresa: 160, email: 160, tipo: 120, mensaje: 2000, pagina: 120 };

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "";

/** Valida y normaliza el cuerpo recibido. Devuelve null si no sirve. */
export function parseLead(body: unknown): Omit<Lead, "id" | "ts"> | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (!LEAD_SOURCES.includes(b.source as LeadSource)) return null;
  const lead = {
    source: b.source as LeadSource,
    nombre: str(b.nombre, LIMITS.nombre),
    empresa: str(b.empresa, LIMITS.empresa),
    email: str(b.email, LIMITS.email).toLowerCase(),
    tipo: str(b.tipo, LIMITS.tipo),
    mensaje: str(b.mensaje, LIMITS.mensaje),
    pagina: str(b.pagina, LIMITS.pagina),
  };
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) return null;
  // Al menos una forma de identificar o contactar al lead.
  if (!lead.email && !lead.nombre && !lead.mensaje) return null;
  return lead;
}

export async function saveLead(redis: Redis, lead: Omit<Lead, "id" | "ts">) {
  const full: Lead = {
    ...lead,
    id: crypto.randomUUID(),
    ts: Date.now(),
  };
  const p = redis.pipeline();
  p.lpush(KEY, JSON.stringify(full));
  p.ltrim(KEY, 0, MAX_LEADS - 1);
  await p.exec();
  return full;
}

export async function listLeads(redis: Redis, limit = 500): Promise<Lead[]> {
  const raw = await redis.lrange(KEY, 0, limit - 1);
  return raw
    .map((r) => {
      try {
        return (typeof r === "string" ? JSON.parse(r) : r) as Lead;
      } catch {
        return null;
      }
    })
    .filter((l): l is Lead => !!l);
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getRedis } from "@/lib/redis";
import { listLeads, type Lead } from "@/lib/leads";

export const dynamic = "force-dynamic";

const COLUMNS: (keyof Lead)[] = ["ts", "source", "nombre", "empresa", "email", "tipo", "mensaje", "pagina"];

function toCsv(leads: Lead[]) {
  const cell = (v: unknown) => {
    const s = String(v ?? "");
    // Evita inyección de fórmulas al abrir el CSV en Excel.
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const rows = leads.map((l) =>
    COLUMNS.map((c) =>
      cell(c === "ts" ? new Date(l.ts).toLocaleString("es-MX", { timeZone: "America/Mexico_City" }) : l[c])
    ).join(",")
  );
  return "﻿" + [COLUMNS.join(","), ...rows].join("\n");
}

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const redis = getRedis();
  if (!redis) return NextResponse.json({ leads: [], configured: false });

  const leads = await listLeads(redis);
  if (req.nextUrl.searchParams.get("format") === "csv") {
    return new NextResponse(toCsv(leads), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads-icemex.csv"`,
      },
    });
  }
  return NextResponse.json({ leads, configured: true });
}

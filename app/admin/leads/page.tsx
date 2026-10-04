"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, Mail } from "lucide-react";
import type { Lead } from "@/lib/leads";

const sourceLabel: Record<string, string> = {
  contacto: "Cotización",
  catalogo: "Catálogo PDF",
};

const fmt = (ts: number) =>
  new Date(ts).toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        setLeads(d.leads ?? []);
        if (d.configured === false) setError("Redis no está configurado: los leads no se están guardando.");
      })
      .catch(() => setError("No se pudieron cargar los leads."))
      .finally(() => setLoading(false));
  }, []);

  const cell: React.CSSProperties = {
    padding: "12px 14px",
    borderBottom: "1px solid var(--grid-lines)",
    fontSize: 13,
    verticalAlign: "top",
    textAlign: "left",
  };

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h2 style={{ color: "var(--text-primary)", fontSize: 24, fontWeight: 400, letterSpacing: "0.02em", marginBottom: 4 }}>
            Leads
            {loading && <Loader2 size={16} style={{ marginLeft: 12, animation: "spin 1s linear infinite", color: "var(--text-muted)" }} />}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Formularios de cotización y descarga de catálogo · {leads.length} registros
          </p>
        </div>
        <a
          href="/api/admin/leads?format=csv"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999, border: "1px solid rgba(var(--cyan-rgb), 0.3)", color: "var(--accent-cyan)", fontSize: 13, textDecoration: "none" }}
        >
          <Download size={16} /> Exportar CSV
        </a>
      </div>

      {error && (
        <p style={{ color: "#f59e0b", fontSize: 14, marginBottom: 16 }}>{error}</p>
      )}

      {!loading && leads.length === 0 && !error ? (
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Aún no hay leads. Aparecerán aquí cuando alguien llene el formulario de contacto o descargue el catálogo.
        </p>
      ) : (
        <div style={{ overflowX: "auto", border: "1px solid var(--grid-lines)", borderRadius: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--text-primary)" }}>
            <thead>
              <tr style={{ color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {["Fecha", "Origen", "Nombre", "Empresa", "Contacto", "Proyecto", "Mensaje"].map((h) => (
                  <th key={h} style={{ ...cell, fontSize: 11, fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td style={{ ...cell, whiteSpace: "nowrap", color: "var(--text-muted)" }}>{fmt(l.ts)}</td>
                  <td style={cell}>{sourceLabel[l.source] ?? l.source}</td>
                  <td style={cell}>{l.nombre || "—"}</td>
                  <td style={cell}>{l.empresa || "—"}</td>
                  <td style={cell}>
                    {l.email ? (
                      <a href={`mailto:${l.email}`} style={{ color: "var(--accent-cyan)", display: "inline-flex", gap: 6, alignItems: "center" }}>
                        <Mail size={14} /> {l.email}
                      </a>
                    ) : "—"}
                  </td>
                  <td style={cell}>{l.tipo || "—"}</td>
                  <td style={{ ...cell, maxWidth: 360, color: "var(--text-muted)", whiteSpace: "pre-wrap" }}>{l.mensaje || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

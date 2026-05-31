"use client";

import { Eye, Clock, ArrowDown, ExternalLink, BadgeCheck } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";

const clarityProjectId = "wwuskpkf16";

export default function BehaviorPage() {
  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ color: "var(--text-primary)", fontSize: 24, fontWeight: 400, letterSpacing: "0.02em", marginBottom: 4 }}>
          Comportamiento de usuarios
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
          Heatmaps, grabaciones y profundidad de scroll · Microsoft Clarity
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
        <MetricCard label="Tiempo promedio" value="4m 12s" change={5.2} icon="activity" />
        <MetricCard label="Scroll promedio" value="68%" change={3.8} icon="trending-down" />
        <MetricCard label="Páginas/vista" value="3.4" change={-1.5} icon="users" />
        <MetricCard label="Tasa salida" value="32.5%" change={-4.1} icon="check-circle" />
      </div>

      <div
        style={{
          padding: 48,
          background: "linear-gradient(135deg, rgba(var(--card-rgb), 0.7), rgba(var(--card-rgb), 0.5))",
          border: "1px solid rgba(34, 197, 94, 0.2)",
          borderRadius: 16,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(34, 197, 94, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            color: "#22c55e",
          }}
        >
          <BadgeCheck size={32} />
        </div>
        <h3 style={{ color: "var(--text-primary)", fontSize: 18, fontWeight: 400, marginBottom: 8 }}>
          Microsoft Clarity · Conectado
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
          Clarity está activo y recolectando heatmaps, grabaciones de sesión y mapas de scroll de todos los visitantes de icemex.mx.
        </p>

        <a
          href={`https://clarity.microsoft.com/projects/view/${clarityProjectId}/dashboard`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginTop: 24,
            padding: "12px 24px",
            background: "var(--accent-cyan)",
            color: "var(--bg-primary)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            borderRadius: 999,
            textDecoration: "none",
            transition: "transform 0.2s ease",
          }}
        >
          Ver dashboard de Clarity
          <ExternalLink size={14} />
        </a>

        <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 40, flexWrap: "wrap" }}>
          {[
            { icon: Eye, label: "Heatmaps", desc: "Mapas de calor en vivo" },
            { icon: ArrowDown, label: "Scroll depth", desc: "Profundidad de scroll por página" },
            { icon: Clock, label: "Session recordings", desc: "Grabaciones de sesiones reales" },
          ].map((f) => (
            <div key={f.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(34, 197, 94, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                  color: "#22c55e",
                }}
              >
                <f.icon size={20} />
              </div>
              <div style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                {f.label}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 11 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

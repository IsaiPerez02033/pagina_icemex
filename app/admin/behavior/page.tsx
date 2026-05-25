"use client";

import { Eye, Clock, ArrowDown } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";

export default function BehaviorPage() {
  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ color: "var(--text-primary)", fontSize: 24, fontWeight: 400, letterSpacing: "0.02em", marginBottom: 4 }}>
          Comportamiento de usuarios
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
          Heatmaps, grabaciones y profundidad de scroll
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
          background: "rgba(var(--card-rgb), 0.6)",
          border: "1px solid rgba(var(--cyan-rgb), 0.1)",
          borderRadius: 16,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(var(--cyan-rgb), 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            color: "var(--accent-cyan)",
          }}
        >
          <Eye size={28} />
        </div>
        <h3 style={{ color: "var(--text-primary)", fontSize: 18, fontWeight: 400, marginBottom: 8 }}>
          Microsoft Clarity · Próximamente
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
          La integración con Microsoft Clarity está preparada para activarse. Conecta tu cuenta para ver heatmaps, grabaciones de sesiones y mapas de scroll en tiempo real.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 32, flexWrap: "wrap" }}>
          {[
            { icon: Eye, label: "Heatmaps", desc: "Mapas de calor" },
            { icon: ArrowDown, label: "Scroll depth", desc: "Profundidad de scroll" },
            { icon: Clock, label: "Session recordings", desc: "Grabaciones de sesión" },
          ].map((f) => (
            <div key={f.label} style={{ textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(var(--cyan-rgb), 0.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", color: "var(--text-muted)" }}>
                <f.icon size={20} />
              </div>
              <div style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{f.label}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 11 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

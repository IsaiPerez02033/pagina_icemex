"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { getKeywords } from "@/lib/admin/mock-data";
import type { KeywordData } from "@/lib/admin/types";

export default function SeoPage() {
  const keywords = getKeywords();
  const totalImpressions = keywords.reduce((s, k) => s + k.impressions, 0);
  const totalClicks = keywords.reduce((s, k) => s + k.clicks, 0);
  const avgCtr = keywords.length > 0 ? keywords.reduce((s, k) => s + k.ctr, 0) / keywords.length : 0;
  const avgPosition = keywords.length > 0 ? keywords.reduce((s, k) => s + k.position, 0) / keywords.length : 0;

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ color: "var(--text-primary)", fontSize: 24, fontWeight: 400, letterSpacing: "0.02em", marginBottom: 4 }}>SEO</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Google Search Console · keywords, impresiones y posición</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <MetricCard label="Impresiones totales" value={totalImpressions.toLocaleString()} change={8.5} icon="activity" />
        <MetricCard label="Clics totales" value={totalClicks.toLocaleString()} change={12.3} icon="check-circle" />
        <MetricCard label="CTR promedio" value={`${avgCtr.toFixed(1)}%`} change={2.1} icon="trending-down" />
        <MetricCard label="Posición media" value={avgPosition.toFixed(1)} change={-1.2} icon="users" />
      </div>

      <div style={{ padding: "20px", background: "rgba(var(--card-rgb), 0.6)", border: "1px solid rgba(var(--cyan-rgb), 0.1)", borderRadius: 16 }}>
        <h3 style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 500, letterSpacing: "0.04em", marginBottom: 16 }}>Top Keywords</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Keyword", "Impresiones", "Clics", "CTR", "Posición"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, borderBottom: "1px solid rgba(var(--cyan-rgb), 0.08)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {keywords.map((k: KeywordData) => (
                <tr key={k.query} style={{ borderBottom: "1px solid rgba(var(--cyan-rgb), 0.04)" }}>
                  <td style={{ padding: "10px 12px", color: "var(--text-primary)", fontSize: 13, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.query}</td>
                  <td style={{ padding: "10px 12px", color: "var(--text-muted)", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{k.impressions.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px", color: "var(--accent-cyan)", fontSize: 13, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{k.clicks.toLocaleString()}</td>
                  <td style={{ padding: "10px 12px", color: "var(--text-muted)", fontSize: 13 }}>{k.ctr}%</td>
                  <td style={{ padding: "10px 12px", color: k.position < 10 ? "#22c55e" : "var(--text-muted)", fontSize: 13, fontWeight: k.position < 10 ? 500 : 400 }}>
                    {k.position.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

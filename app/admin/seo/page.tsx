"use client";

import { useState, useEffect } from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import { getKeywords } from "@/lib/admin/mock-data";
import type { KeywordData } from "@/lib/admin/types";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function SeoPage() {
  const [loading, setLoading] = useState(true);
  const [isRealData, setIsRealData] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [totalImpressions, setTotalImpressions] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [avgCtr, setAvgCtr] = useState(0);
  const [avgPosition, setAvgPosition] = useState(0);
  const [keywords, setKeywords] = useState<KeywordData[]>(getKeywords());

  useEffect(() => {
    fetch("/api/admin/search-console")
      .then((r) => r.json())
      .then((data) => {
        if (data?.source === "search_console") {
          setIsRealData(true);
          setTotalImpressions(data.totalImpressions || 0);
          setTotalClicks(data.totalClicks || 0);
          setAvgCtr(data.avgCtr || 0);
          setAvgPosition(data.avgPosition || 0);
          setKeywords(data.keywords || []);
        } else {
          setIsRealData(false);
          setErrorMsg(data?.diagnostics?.scError || data?.diagnostics?.hint || null);
          const mock = getKeywords();
          setKeywords(mock);
          setTotalImpressions(mock.reduce((s, k) => s + k.impressions, 0));
          setTotalClicks(mock.reduce((s, k) => s + k.clicks, 0));
          setAvgCtr(mock.length > 0 ? mock.reduce((s, k) => s + k.ctr, 0) / mock.length : 0);
          setAvgPosition(mock.length > 0 ? mock.reduce((s, k) => s + k.position, 0) / mock.length : 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ color: "var(--text-primary)", fontSize: 24, fontWeight: 400, letterSpacing: "0.02em", marginBottom: 4 }}>
          SEO
          {loading && <Loader2 size={16} style={{ marginLeft: 10, animation: "spin 1s linear infinite", color: "var(--text-muted)", display: "inline-block" }} />}
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
          {isRealData ? "Google Search Console · datos reales" : "Datos simulados"} · keywords, impresiones y posición
        </p>
      </div>

      {isRealData ? (
        <div
          style={{
            padding: "14px 18px", marginBottom: 24,
            background: "rgba(34, 197, 94, 0.06)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: 12,
            display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-muted)",
          }}
        >
          <CheckCircle2 size={16} style={{ color: "#22c55e", flexShrink: 0 }} />
          <span>Conectado a Google Search Console · datos de los últimos 30 días.</span>
        </div>
      ) : (
        <div
          style={{
            padding: "14px 18px", marginBottom: 24,
            background: "rgba(var(--cyan-rgb), 0.06)", border: "1px solid rgba(var(--cyan-rgb), 0.15)", borderRadius: 12,
            display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-muted)",
          }}
        >
          <AlertCircle size={16} style={{ color: "var(--accent-cyan)", flexShrink: 0 }} />
          <span>
            {errorMsg || (
              <>
                Datos simulados. Para métricas SEO reales, agrega GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET y GOOGLE_REFRESH_TOKEN en Vercel.
              </>
            )}
          </span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <MetricCard label="Impresiones totales" value={totalImpressions.toLocaleString()} change={isRealData ? 0 : 8.5} icon="activity" />
        <MetricCard label="Clics totales" value={totalClicks.toLocaleString()} change={isRealData ? 0 : 12.3} icon="check-circle" />
        <MetricCard label="CTR promedio" value={`${avgCtr.toFixed(1)}%`} change={isRealData ? 0 : 2.1} icon="trending-down" />
        <MetricCard label="Posición media" value={avgPosition.toFixed(1)} change={isRealData ? 0 : -1.2} icon="users" />
      </div>

      <div style={{ padding: "20px", background: "rgba(var(--card-rgb), 0.6)", border: "1px solid rgba(var(--cyan-rgb), 0.1)", borderRadius: 16 }}>
        <h3 style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 500, letterSpacing: "0.04em", marginBottom: 16 }}>Top Keywords</h3>
        {isRealData && keywords.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 16px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.7, maxWidth: 440, margin: "0 auto" }}>
              Aún no hay keywords registradas para <code style={{ color: "var(--accent-cyan)" }}>icemex.mx</code>.
              Google Search Console puede tardar de 2 a 4 semanas en mostrar datos de búsqueda después de la indexación inicial.
              Vuelve a consultar esta sección más adelante.
            </p>
          </div>
        ) : (
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
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: "@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}" }} />
    </div>
  );
}

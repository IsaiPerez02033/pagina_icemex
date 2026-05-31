"use client";

import { useState, useEffect } from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import TrafficChart from "@/components/dashboard/TrafficChart";
import VisitorsTable from "@/components/dashboard/VisitorsTable";
import DateRangePicker from "@/components/dashboard/DateRangePicker";
import { getTrafficData, getTopPages, getDashboardMetrics } from "@/lib/admin/mock-data";
import type { MetricCardData, TrafficPoint, TopPage, DateRange } from "@/lib/admin/types";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>("30d");
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricCardData[]>(getDashboardMetrics());
  const [traffic, setTraffic] = useState<TrafficPoint[]>(getTrafficData(30));
  const [pages, setPages] = useState<TopPage[]>(getTopPages());
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((data) => {
        if (data?.source === "kv" && data.metrics) {
          setMetrics(data.metrics);
          setIsRealData(true);
        }
        if (data.traffic && data.traffic.length > 0) setTraffic(data.traffic);
        if (data.topPages && data.topPages.length > 0) setPages(data.topPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ color: "var(--text-primary)", fontSize: 24, fontWeight: 400, letterSpacing: "0.02em", marginBottom: 4 }}>
            Analytics
            {loading && <Loader2 size={16} style={{ marginLeft: 10, animation: "spin 1s linear infinite", color: "var(--text-muted)", display: "inline-block" }} />}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            {isRealData ? "Datos reales de KV" : "Datos simulados"} · tráfico, engagement y conversiones
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <TrafficChart data={traffic} />
      </div>

      <VisitorsTable data={pages} />

      <style dangerouslySetInnerHTML={{ __html: "@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}" }} />
    </div>
  );
}

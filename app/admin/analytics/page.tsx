"use client";

import { useState } from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import TrafficChart from "@/components/dashboard/TrafficChart";
import VisitorsTable from "@/components/dashboard/VisitorsTable";
import DateRangePicker from "@/components/dashboard/DateRangePicker";
import { getTrafficData, getTopPages, getDashboardMetrics } from "@/lib/admin/mock-data";
import type { DateRange } from "@/lib/admin/types";

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>("30d");
  const traffic = getTrafficData(range === "today" ? 1 : range === "7d" ? 7 : range === "30d" ? 30 : 90);
  const pages = getTopPages();
  const metrics = getDashboardMetrics();

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ color: "var(--text-primary)", fontSize: 24, fontWeight: 400, letterSpacing: "0.02em", marginBottom: 4 }}>Analytics</h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Tráfico, engagement y conversiones</p>
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
    </div>
  );
}

"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { TrafficPoint } from "@/lib/admin/types";

export default function TrafficChart({ data }: { data: TrafficPoint[] }) {
  return (
    <div
      style={{
        padding: "20px",
        background: "rgba(var(--card-rgb), 0.6)",
        border: "1px solid rgba(var(--cyan-rgb), 0.1)",
        borderRadius: 16,
        height: 300,
      }}
    >
      <h3
        style={{
          color: "var(--text-primary)",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.04em",
          marginBottom: 16,
        }}
      >
        Tráfico
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--cyan-rgb), 0.06)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "var(--bg-secondary)",
              border: "1px solid rgba(var(--cyan-rgb), 0.15)",
              borderRadius: 10,
              fontSize: 12,
              color: "var(--text-primary)",
            }}
          />
          <Line
            type="monotone"
            dataKey="visitors"
            stroke="var(--accent-cyan)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "var(--accent-cyan)" }}
          />
          <Line
            type="monotone"
            dataKey="pageViews"
            stroke="rgba(var(--cyan-rgb), 0.4)"
            strokeWidth={1.5}
            dot={false}
            strokeDasharray="4 4"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

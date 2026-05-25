"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { DeviceData } from "@/lib/admin/types";

const COLORS = ["var(--accent-cyan)", "rgba(var(--cyan-rgb), 0.5)", "rgba(var(--cyan-rgb), 0.25)"];

export default function DeviceChart({ data }: { data: DeviceData[] }) {
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
        Dispositivos
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            dataKey="value"
            stroke="var(--bg-primary)"
            strokeWidth={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--bg-secondary)",
              border: "1px solid rgba(var(--cyan-rgb), 0.15)",
              borderRadius: 10,
              fontSize: 12,
              color: "var(--text-primary)",
            }}
            formatter={(value: unknown) => `${value}%`}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

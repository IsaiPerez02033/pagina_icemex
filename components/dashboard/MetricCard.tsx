"use client";

import { motion } from "framer-motion";
import { Users, Activity, TrendingDown, CheckCircle, TrendingUp, TrendingDown as TrendingDownIcon } from "lucide-react";
import type { MetricCardData } from "@/lib/admin/types";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  users: Users as React.ComponentType<{ size?: number }>,
  activity: Activity as React.ComponentType<{ size?: number }>,
  "trending-down": TrendingDown as React.ComponentType<{ size?: number }>,
  "check-circle": CheckCircle as React.ComponentType<{ size?: number }>,
};

export default function MetricCard({ label, value, change, icon }: MetricCardData) {
  const Icon = (iconMap[icon] || Activity) as React.ComponentType<{ size?: number }>;
  const isPositive = change > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: "20px",
        background: "rgba(var(--card-rgb), 0.6)",
        border: "1px solid rgba(var(--cyan-rgb), 0.1)",
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "rgba(var(--cyan-rgb), 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-cyan)",
          }}
        >
          <Icon size={16} />
        </div>
      </div>

      <div>
        <span
          style={{
            fontSize: 32,
            color: "var(--text-primary)",
            fontWeight: 300,
            letterSpacing: "0.02em",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
        {isPositive ? (
          <TrendingUp size={14} color="var(--accent-cyan)" />
        ) : (
          <TrendingDownIcon size={14} color="var(--accent-red)" />
        )}
        <span style={{ color: isPositive ? "var(--accent-cyan)" : "var(--accent-red)", fontWeight: 500 }}>
          {isPositive ? "+" : ""}{change}%
        </span>
        <span style={{ color: "var(--text-muted)" }}>vs ayer</span>
      </div>
    </motion.div>
  );
}

"use client";

import type { DateRange } from "@/lib/admin/types";

const options: { value: DateRange; label: string }[] = [
  { value: "today", label: "Hoy" },
  { value: "7d", label: "7 días" },
  { value: "30d", label: "30 días" },
  { value: "90d", label: "90 días" },
];

export default function DateRangePicker({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (r: DateRange) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 4, background: "rgba(var(--card-rgb), 0.6)", borderRadius: 10, padding: 3, border: "1px solid rgba(var(--cyan-rgb), 0.08)" }}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            letterSpacing: "0.04em",
            color: value === o.value ? "var(--bg-primary)" : "var(--text-muted)",
            background: value === o.value ? "var(--accent-cyan)" : "transparent",
            transition: "all 0.2s ease",
            fontWeight: value === o.value ? 500 : 400,
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

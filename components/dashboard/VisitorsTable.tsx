"use client";

import type { TopPage } from "@/lib/admin/types";

export default function VisitorsTable({ data }: { data: TopPage[] }) {
  return (
    <div
      style={{
        padding: "20px",
        background: "rgba(var(--card-rgb), 0.6)",
        border: "1px solid rgba(var(--cyan-rgb), 0.1)",
        borderRadius: 16,
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
        Páginas más visitadas
      </h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Página", "Vistas", "Tiempo", "Rebote"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    fontSize: 10,
                    color: "var(--text-muted)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    borderBottom: "1px solid rgba(var(--cyan-rgb), 0.08)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.page}
                style={{
                  borderBottom: "1px solid rgba(var(--cyan-rgb), 0.04)",
                }}
              >
                <td
                  style={{
                    padding: "12px",
                    color: "var(--text-primary)",
                    fontSize: 13,
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontFamily: "monospace",
                    letterSpacing: "0.02em",
                  }}
                >
                  {row.page}
                </td>
                <td
                  style={{
                    padding: "12px",
                    color: "var(--accent-cyan)",
                    fontSize: 13,
                    fontWeight: 500,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {row.views.toLocaleString()}
                </td>
                <td
                  style={{
                    padding: "12px",
                    color: "var(--text-muted)",
                    fontSize: 13,
                  }}
                >
                  {row.avgTime}
                </td>
                <td
                  style={{
                    padding: "12px",
                    color: "var(--text-muted)",
                    fontSize: 13,
                  }}
                >
                  {row.bounceRate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

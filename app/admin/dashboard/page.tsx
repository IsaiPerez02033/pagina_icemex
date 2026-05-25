"use client";

import { useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/dashboard/MetricCard";
import TrafficChart from "@/components/dashboard/TrafficChart";
import DeviceChart from "@/components/dashboard/DeviceChart";
import VisitorsTable from "@/components/dashboard/VisitorsTable";
import DateRangePicker from "@/components/dashboard/DateRangePicker";
import { Zap, MessageCircle, FileText, Bot } from "lucide-react";
import {
  getDashboardMetrics,
  getTrafficData,
  getDeviceData,
  getTopPages,
  getEvents,
  getRealtimeUsers,
} from "@/lib/admin/mock-data";
import type { DateRange } from "@/lib/admin/types";

const eventIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  "WhatsApp clicks": MessageCircle as React.ComponentType<{ size?: number }>,
  "Formularios enviados": Zap as React.ComponentType<{ size?: number }>,
  "Catálogo PDF descargado": FileText as React.ComponentType<{ size?: number }>,
  "Chatbot conversaciones": Bot as React.ComponentType<{ size?: number }>,
};

export default function DashboardPage() {
  const [range, setRange] = useState<DateRange>("30d");
  const metrics = getDashboardMetrics();
  const traffic = getTrafficData(range === "today" ? 1 : range === "7d" ? 7 : range === "30d" ? 30 : 90);
  const devices = getDeviceData();
  const pages = getTopPages();
  const events = getEvents();
  const realtime = getRealtimeUsers();

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2
            style={{
              color: "var(--text-primary)",
              fontSize: 24,
              fontWeight: 400,
              letterSpacing: "0.02em",
              marginBottom: 4,
            }}
          >
            Dashboard
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13, letterSpacing: "0.04em" }}>
            Métricas de {range === "today" ? "hoy" : `los últimos ${range === "7d" ? "7" : range === "30d" ? "30" : "90"} días`}
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {/* Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <MetricCard {...m} />
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <TrafficChart data={traffic} />
        <DeviceChart data={devices} />
      </div>

      {/* Events row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {events.map((e) => {
          const Icon = eventIcons[e.name] || Zap;
          return (
            <div
              key={e.name}
              style={{
                padding: "18px",
                background: "rgba(var(--card-rgb), 0.6)",
                border: "1px solid rgba(var(--cyan-rgb), 0.1)",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "rgba(var(--cyan-rgb), 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-cyan)",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: 20,
                    color: "var(--text-primary)",
                    fontWeight: 400,
                    fontVariantNumeric: "tabular-nums",
                    display: "block",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {e.count.toLocaleString()}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {e.name}
                  {" · "}
                  <span style={{ color: e.trend > 0 ? "var(--accent-cyan)" : "var(--accent-red)" }}>
                    {e.trend > 0 ? "+" : ""}{e.trend}%
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time + Pages */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        <div
          style={{
            padding: "20px",
            background: "rgba(var(--card-rgb), 0.6)",
            border: "1px solid rgba(var(--cyan-rgb), 0.1)",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(var(--cyan-rgb), 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--accent-cyan)",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 8px #22c55e",
                animation: "pulse-green 2s ease-in-out infinite",
              }}
            />
          </div>
          <div>
            <span
              style={{
                fontSize: 28,
                color: "var(--text-primary)",
                fontWeight: 300,
                fontVariantNumeric: "tabular-nums",
                display: "block",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {realtime}
            </span>
            <span
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Usuarios en tiempo real
            </span>
          </div>
        </div>

        <VisitorsTable data={pages} />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes pulse-green { 0%,100% { opacity:0.6 } 50% { opacity:1 } }`,
        }}
      />
    </div>
  );
}

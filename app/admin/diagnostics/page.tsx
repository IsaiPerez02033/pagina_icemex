"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Loader2, AlertTriangle } from "lucide-react";

export default function DiagnosticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/diagnostics")
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setData({ error: String(e) }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Loader2 size={32} style={{ animation: "spin 1s linear infinite", color: "var(--accent-cyan)" }} />
        <p style={{ color: "var(--text-muted)", marginTop: 16 }}>Ejecutando diagnóstico de conexiones...</p>
        <style dangerouslySetInnerHTML={{ __html: "@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}" }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900 }}>
      <h2 style={{ color: "var(--text-primary)", fontSize: 24, fontWeight: 400, marginBottom: 8 }}>
        Diagnóstico de conexiones
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 32 }}>
        Estado actual de todas las variables de entorno y APIs
      </p>

      {/* Env vars */}
      <section style={{ marginBottom: 40 }}>
        <h3 style={{ color: "var(--accent-cyan)", fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
          Variables de entorno
        </h3>
        <div style={{ display: "grid", gap: 8 }}>
          {data?.envVars &&
            Object.entries(data.envVars).map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 16px",
                  background: "rgba(var(--card-rgb), 0.6)",
                  borderRadius: 10,
                  border: "1px solid rgba(var(--cyan-rgb), 0.1)",
                }}
              >
                <span style={{ color: "var(--text-primary)", fontSize: 13, fontFamily: "monospace" }}>{key}</span>
                <span
                  style={{
                    color: String(value).includes("FALTA") ? "var(--accent-red)" : "#22c55e",
                    fontSize: 12,
                    fontFamily: "monospace",
                  }}
                >
                  {String(value)}
                </span>
              </div>
            ))}
        </div>
      </section>

      {/* Connection tests */}
      <section>
        <h3 style={{ color: "var(--accent-cyan)", fontSize: 14, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
          Pruebas de conexión
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {data?.results &&
            Object.entries(data.results).map(([name, result]: any) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "16px",
                  background: "rgba(var(--card-rgb), 0.6)",
                  borderRadius: 12,
                  border: `1px solid ${
                    result.status === "ok"
                      ? "rgba(34,197,94,0.3)"
                      : result.status === "error"
                      ? "rgba(var(--accent-red), 0.3)"
                      : "rgba(var(--cyan-rgb), 0.15)"
                  }`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  {result.status === "ok" ? (
                    <Check size={16} color="#22c55e" />
                  ) : result.status === "error" ? (
                    <X size={16} color="var(--accent-red)" />
                  ) : (
                    <AlertTriangle size={16} color="var(--text-muted)" />
                  )}
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontSize: 14,
                      fontWeight: 500,
                      textTransform: "capitalize",
                    }}
                  >
                    {name}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 99,
                      color: result.status === "ok" ? "#22c55e" : result.status === "error" ? "var(--accent-red)" : "var(--text-muted)",
                      background: result.status === "ok" ? "rgba(34,197,94,0.1)" : result.status === "error" ? "rgba(var(--accent-red), 0.1)" : "rgba(var(--cyan-rgb), 0.1)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {result.status}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                  {result.message}
                </p>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Instructions */}
      <section
        style={{
          marginTop: 40,
          padding: 24,
          background: "rgba(var(--card-rgb), 0.6)",
          borderRadius: 16,
          border: "1px solid rgba(var(--cyan-rgb), 0.12)",
        }}
      >
        <h3 style={{ color: "var(--text-primary)", fontSize: 16, fontWeight: 500, marginBottom: 16 }}>
          ¿Qué hacer si algo falla?
        </h3>
        <ul style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 2, paddingLeft: 20 }}>
          <li><strong>Vercel Analytics:</strong> Necesitas VERCEL_API_TOKEN (crear en Settings → Tokens), VERCEL_PROJECT_ID y VERCEL_TEAM_ID en Vercel env vars.</li>
          <li><strong>Upstash KV:</strong> Necesitas KV_REST_API_URL y KV_REST_API_TOKEN. Se obtienen desde <a href="https://console.upstash.com" target="_blank" style={{color:"var(--accent-cyan)"}}>console.upstash.com</a> → tu base de datos → REST API.</li>
          <li><strong>Google Analytics:</strong> NEXT_PUBLIC_GA_MEASUREMENT_ID debe ser G-54WW1EWMS7. Ya está configurado si aparece ✅.</li>
        </ul>
      </section>
    </div>
  );
}

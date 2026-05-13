"use client";

import { buildWhatsAppUrlProyectos } from "@/lib/whatsapp";

type Specs = { label: string; value: string }[];

interface Props {
  code: string;
  name: string;
  line: string;
  tags: string[];
  tagline: string;
  description: string;
  applications: string[];
  specs: Specs;
  features: string[];
  certifications: string[];
  warranty: string;
}

export default function ProductCard({
  code,
  name,
  line,
  tags,
  tagline,
  applications,
  specs,
  features,
  certifications,
  warranty,
}: Props) {
  return (
    <div
      style={{
        background: "var(--bg-primary)",
        border: "1px solid rgba(var(--cyan-rgb), 0.18)",
        borderRadius: 18,
        overflow: "hidden",
        fontSize: 13,
        marginTop: 12,
      }}
    >
      <div
        style={{
          padding: "16px 18px",
          borderBottom: "1px solid rgba(var(--cyan-rgb), 0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 10,
              color: "var(--accent-cyan)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            {code} · {line}
          </span>
        </div>
        <h4
          style={{
            color: "var(--text-primary)",
            fontSize: 17,
            fontWeight: 500,
            letterSpacing: "0.02em",
            lineHeight: 1.2,
            margin: "0 0 4px",
            textTransform: "none",
          }}
        >
          {name}
        </h4>
        <p style={{ color: "var(--text-muted)", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
          {tagline}
        </p>
      </div>

      <div style={{ padding: "14px 18px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px 16px",
            marginBottom: 14,
          }}
        >
          {specs.slice(0, 8).map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {s.label}
              </span>
              <span style={{ color: "var(--text-primary)", fontSize: 12, fontWeight: 500 }}>
                {s.value}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 6,
            }}
          >
            Aplicaciones
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {applications.slice(0, 5).map((a) => (
              <span
                key={a}
                style={{
                  fontSize: 10,
                  color: "var(--text-primary)",
                  background: "rgba(var(--cyan-rgb), 0.06)",
                  border: "1px solid rgba(var(--cyan-rgb), 0.1)",
                  borderRadius: 999,
                  padding: "3px 10px",
                  letterSpacing: "0.04em",
                }}
              >
                {a}
              </span>
            ))}
          </div>
        </div>

        {features.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <span
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 4,
              }}
            >
              Características
            </span>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {features.map((f) => (
                <li
                  key={f}
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 11,
                    lineHeight: 1.5,
                    display: "flex",
                    gap: 6,
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ color: "var(--accent-cyan)", flexShrink: 0 }}>▸</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(certifications.length > 0 || warranty !== "Consultar con ventas") && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
              paddingTop: 10,
              borderTop: "1px solid rgba(var(--cyan-rgb), 0.06)",
            }}
          >
            {warranty !== "Consultar con ventas" && (
              <span
                style={{
                  fontSize: 10,
                  color: "var(--accent-cyan)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Garantía: {warranty}
              </span>
            )}
            {certifications.map((c) => (
              <span
                key={c}
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  border: "1px solid rgba(var(--cyan-rgb), 0.12)",
                  borderRadius: 999,
                  padding: "2px 8px",
                  letterSpacing: "0.06em",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "0 18px 16px" }}>
        <a
          href={buildWhatsAppUrlProyectos(
            `Hola ICEMEX, me interesa cotizar: *${name}* (${code}). ¿Me pueden dar precio y disponibilidad?`
          )}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 18px",
            background: "#25D366",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Cotizar este producto
        </a>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const certifications = [
  {
    code: "NOM-013-ENER",
    name: "Norma Mexicana de Eficiencia",
    description:
      "Cumplimiento con los estándares nacionales de eficiencia energética para alumbrado público.",
  },
  {
    code: "ISO 9001",
    name: "Gestión de calidad",
    description:
      "Sistema certificado de gestión de calidad en todos los procesos.",
  },
  {
    code: "ISO 14001",
    name: "Gestión ambiental",
    description:
      "Compromiso con prácticas responsables con el medio ambiente.",
  },
  {
    code: "ISO 45001",
    name: "Salud y seguridad",
    description:
      "Sistema de gestión de salud y seguridad en el trabajo.",
  },
  {
    code: "IP65 / IP66",
    name: "Hermeticidad total",
    description:
      "Protección contra polvo y agua para uso intemperie continuo.",
  },
  {
    code: "IK10",
    name: "Antivandálico",
    description:
      "Resistencia mecánica contra impactos y golpes severos.",
  },
];

const warranties = [
  { line: "Luminarias LED", years: "3 años" },
  { line: "Solar All in One", years: "10 años · 5 años batería" },
  { line: "Reflectores BetaLED®", years: "10 años" },
  { line: "AD-50W Solar", years: "10 años · 6 años batería" },
  { line: "LR Troffers USA", years: "10 años" },
];

export default function CertificationsBanner() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cert-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: ".cert-grid",
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".warranty-row",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: ".warranty-list",
            start: "top 88%",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background:
          "linear-gradient(180deg, transparent 0%, rgba(var(--cyan-rgb), 0.03) 50%, transparent 100%)",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ marginBottom: 64 }}>
          <p
            style={{
              color: "var(--accent-cyan)",
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Certificaciones
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 52px)",
              color: "var(--text-primary)",
              fontWeight: 300,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Calidad <span style={{ color: "var(--accent-cyan)" }}>certificada</span>
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 14,
              maxWidth: 600,
              lineHeight: 1.7,
            }}
          >
            Cada producto ICEMEX pasa por controles rigurosos y cumple con las
            normas nacionales e internacionales más exigentes del sector
            eléctrico y de iluminación.
          </p>
        </div>

        <div
          className="cert-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            marginBottom: 80,
          }}
        >
          {certifications.map((c) => (
            <div
              key={c.code}
              className="cert-card interactive"
              style={{
                padding: 28,
                background: "rgba(var(--card-rgb), 0.6)",
                border: "1px solid rgba(var(--cyan-rgb), 0.12)",
                borderLeft: "2px solid var(--accent-cyan)",
                borderRadius: 22,
                transition:
                  "border-color 0.3s ease, transform 0.3s ease, background 0.3s ease",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: "var(--accent-cyan)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                  fontWeight: 500,
                }}
              >
                ✓ Certificado
              </p>
              <h3
                style={{
                  color: "var(--text-primary)",
                  fontSize: 18,
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  textTransform: "none",
                  marginBottom: 10,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {c.code}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-primary)",
                  marginBottom: 8,
                  letterSpacing: "0.02em",
                }}
              >
                {c.name}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                }}
              >
                {c.description}
              </p>
            </div>
          ))}
        </div>

        <div>
          <p
            style={{
              color: "var(--accent-cyan)",
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Garantías por línea
          </p>

          <div
            className="warranty-list"
            style={{
              borderTop: "1px solid rgba(var(--cyan-rgb), 0.1)",
            }}
          >
            {warranties.map((w) => (
              <div
                key={w.line}
                className="warranty-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 24,
                  padding: "20px 0",
                  borderBottom: "1px solid rgba(var(--cyan-rgb), 0.06)",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "var(--text-primary)",
                    fontSize: 15,
                    letterSpacing: "0.02em",
                  }}
                >
                  {w.line}
                </span>
                <span
                  style={{
                    color: "var(--accent-cyan)",
                    fontSize: 13,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  {w.years}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .cert-card:hover {
          border-color: rgba(var(--cyan-rgb), 0.4) !important;
          transform: translateY(-3px);
          background: rgba(var(--card-rgb), 0.85) !important;
        }
      `}</style>
    </section>
  );
}

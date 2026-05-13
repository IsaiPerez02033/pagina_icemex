"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projects = [
  {
    n: "001",
    name: "Vialidades Periféricas",
    location: "Monterrey, NL",
    units: "Cobra · 1,240 piezas",
    year: "2024",
    type: "Alumbrado público AL-LC1001",
  },
  {
    n: "002",
    name: "Plaza Central — All in One",
    location: "Ciudad de México",
    units: "Solar 100W · 180 piezas",
    year: "2024",
    type: "Solar autónoma IS-LA1005",
  },
  {
    n: "003",
    name: "Parque Industrial",
    location: "Querétaro, QRO",
    units: "Postes cónicos · 92 unid.",
    year: "2025",
    type: "Postería + Titan AL-LT1002",
  },
  {
    n: "004",
    name: "Corredor Costero Solar",
    location: "Mazatlán, SIN",
    units: "AD-50W · 560 piezas",
    year: "2025",
    type: "Solar vialidades NOM-013",
  },
  {
    n: "005",
    name: "Centro Comercial",
    location: "Guadalajara, JAL",
    units: "GINHB High Bay · 320",
    year: "2025",
    type: "Comerciales LC-GINH1012",
  },
  {
    n: "006",
    name: "Estadio Municipal",
    location: "Puebla, PUE",
    units: "Reflectores 300W · 64",
    year: "2026",
    type: "Reflectores RF-RE1003",
  },
];

export default function ProjectsSection() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".project-row").forEach((row) => {
        gsap.fromTo(
          row,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
            },
          }
        );
      });

      gsap.fromTo(
        ".section-title-projects",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-title-projects",
            start: "top 85%",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="proyectos"
      ref={ref}
      style={{
        padding: "140px 32px",
        background:
          "linear-gradient(180deg, transparent 0%, rgba(var(--card-rgb), 0.6) 50%, transparent 100%)",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="section-title-projects" style={{ marginBottom: 80 }}>
          <p
            style={{
              color: "var(--accent-cyan)",
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            03 — Casos
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
            Proyectos
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 14,
              maxWidth: 600,
              lineHeight: 1.7,
            }}
          >
            Una selección de instalaciones recientes a lo largo del territorio
            mexicano, desde vialidades urbanas hasta complejos industriales y
            estadios.
          </p>
        </div>

        <div style={{ borderTop: "1px solid rgba(var(--cyan-rgb), 0.1)" }}>
          {projects.map((p) => (
            <div
              key={p.n}
              className="project-row interactive"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "60px 1.4fr 1fr 1.2fr 1fr 60px",
                gap: 24,
                padding: "28px 16px",
                borderBottom: "1px solid rgba(var(--cyan-rgb), 0.06)",
                alignItems: "center",
                color: "var(--text-primary)",
                fontSize: 14,
                transition: "background 0.3s ease, color 0.3s ease",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  color: "var(--accent-cyan)",
                  fontSize: 12,
                  letterSpacing: "0.2em",
                }}
              >
                {p.n}
              </span>
              <span style={{ fontWeight: 400, letterSpacing: "0.02em" }}>
                {p.name}
              </span>
              <span style={{ color: "var(--text-muted)" }}>{p.location}</span>
              <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
                {p.type}
              </span>
              <span style={{ color: "var(--text-muted)" }}>{p.units}</span>
              <span
                style={{
                  textAlign: "right",
                  color: "var(--text-muted)",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                }}
              >
                {p.year}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .project-row:hover {
          background: rgba(var(--cyan-rgb), 0.04);
        }
      `}</style>
    </section>
  );
}

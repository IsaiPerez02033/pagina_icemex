"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const highlights = [
  {
    n: "01",
    title: "Asesoría técnica",
    description:
      "Dimensionamiento luminotécnico y selección de SKUs antes de cotizar.",
  },
  {
    n: "02",
    title: "Instalación con HIAB",
    description:
      "Equipo de campo propio: grúa hidráulica, herramentario certificado, cuadrillas especializadas.",
  },
  {
    n: "03",
    title: "Mantenimiento",
    description:
      "Programa preventivo o correctivo para mantener tu inversión rindiendo años.",
  },
];

export default function ServicesTeaser() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".services-teaser-title > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".services-teaser-title",
            start: "top 85%",
          },
        }
      );

      gsap.utils
        .toArray<HTMLElement>(".services-teaser-card")
        .forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              delay: i * 0.08,
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
              },
            }
          );
        });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="servicios"
      style={{
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div
          className="services-teaser-title"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 64,
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <p
              style={{
                color: "var(--accent-cyan)",
                fontSize: 12,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              03 — Servicios
            </p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 52px)",
                color: "var(--text-primary)",
                fontWeight: 300,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                lineHeight: 1.1,
              }}
            >
              No solo te
              <br />
              <span style={{ color: "var(--accent-cyan)" }}>vendemos</span>
            </h2>
          </div>
          <p
            style={{
              maxWidth: 460,
              color: "var(--text-muted)",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            Asesoramos, levantamos en sitio, instalamos con grúa HIAB propia y
            damos mantenimiento. Un solo proveedor para todo el ciclo del
            proyecto.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
            marginBottom: 48,
          }}
        >
          {highlights.map((h) => (
            <div
              key={h.n}
              className="services-teaser-card"
              style={{
                position: "relative",
                padding: "32px 28px",
                background: "rgba(var(--card-rgb), 0.5)",
                border: "1px solid rgba(var(--cyan-rgb), 0.12)",
                borderRadius: 22,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                minHeight: 200,
                transition:
                  "border-color 0.3s ease, transform 0.3s ease, background 0.3s ease",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "var(--accent-cyan)",
                  letterSpacing: "0.32em",
                  fontWeight: 500,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {h.n}
              </span>
              <h3
                style={{
                  color: "var(--text-primary)",
                  fontSize: 20,
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                  textTransform: "none",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {h.title}
              </h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: 13,
                  lineHeight: 1.6,
                  margin: 0,
                  flex: 1,
                }}
              >
                {h.description}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Link
            href="/servicios"
            className="interactive"
            style={{
              padding: "18px 32px",
              background: "var(--accent-cyan)",
              color: "var(--bg-primary)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Ver todos los servicios →
          </Link>
        </div>
      </div>

      <style jsx>{`
        :global(.services-teaser-card:hover) {
          border-color: rgba(var(--cyan-rgb), 0.4) !important;
          transform: translateY(-4px);
          background: rgba(var(--card-rgb), 0.7) !important;
        }
      `}</style>
    </section>
  );
}

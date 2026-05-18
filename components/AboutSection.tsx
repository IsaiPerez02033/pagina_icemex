"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { n: "+20", label: "Años de experiencia" },
  { n: "176", label: "Productos en catálogo" },
  { n: "07", label: "Líneas de producto" },
  { n: "100%", label: "Tecnología LED" },
];

const certifications = [
  "ISO 9001",
  "ISO 14001",
  "ISO 45001",
  "NOM-013-ENER",
];

export default function AboutSection() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-text > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".about-text",
            start: "top 85%",
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".stat-block").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
            },
          }
        );
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 80,
          alignItems: "start",
        }}
      >
        <div className="about-text">
          <h2
            id="empresa"
            style={{
              color: "var(--accent-cyan)",
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: 16,
              fontWeight: 400,
            }}
          >
            01 — Empresa
          </h2>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 52px)",
              color: "var(--text-primary)",
              fontWeight: 300,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              lineHeight: 1.1,
              marginBottom: 32,
            }}
          >
            Material eléctrico,
            <br />
            <span style={{ color: "var(--accent-cyan)" }}>herrajes y luz</span>
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 15,
              lineHeight: 1.8,
              marginBottom: 24,
              maxWidth: 540,
            }}
          >
            ICEMEX S.A. de C.V. es una empresa mexicana especializada en la
            fabricación, distribución y comercialización de todo tipo de
            material eléctrico y herrajes. Más de dos décadas de trayectoria
            avalan cada proyecto.
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 15,
              lineHeight: 1.8,
              maxWidth: 540,
              marginBottom: 32,
            }}
          >
            Trabajamos con luminarias de alumbrado público con la última
            tecnología LED, sistemas fotovoltaicos, postes cónicos circulares,
            rectos circulares, hexagonales y tipo látigo, así como bases de
            concreto, anclas, brazos, focos, balastros, fotoceldas y
            transformadores. Distribución directa de fábrica para los mejores
            precios.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              borderTop: "1px solid rgba(var(--cyan-rgb), 0.08)",
              paddingTop: 20,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginRight: 12,
                lineHeight: "26px",
              }}
            >
              Certificaciones:
            </span>
            {certifications.map((c) => (
              <span
                key={c}
                style={{
                  fontSize: 11,
                  color: "var(--text-primary)",
                  padding: "4px 12px",
                  border: "1px solid rgba(var(--cyan-rgb), 0.2)",
                  borderRadius: 999,
                  letterSpacing: "0.08em",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 1,
            background: "rgba(var(--cyan-rgb), 0.1)",
            border: "1px solid rgba(var(--cyan-rgb), 0.1)",
            borderRadius: 22,
            overflow: "hidden",
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="stat-block"
              style={{
                background: "var(--bg-primary)",
                padding: "44px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                minHeight: 180,
              }}
            >
              <span
                style={{
                  fontSize: "clamp(40px, 5vw, 64px)",
                  color: "var(--text-primary)",
                  fontWeight: 300,
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                {s.n}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginTop: "auto",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

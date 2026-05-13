"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "@/lib/projects";
import { buildWhatsAppUrlProyectos } from "@/lib/whatsapp";

// Cada item define posición y tamaño en grid 12 cols × 8 rows = collage asimétrico
type Layout = {
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
  rotate?: number;
};

const layouts: Layout[] = [
  { colStart: 1, colSpan: 5, rowStart: 1, rowSpan: 3, rotate: -1 }, // 0 — Vialidad nocturna (grande)
  { colStart: 6, colSpan: 4, rowStart: 1, rowSpan: 2, rotate: 0.5 }, // 1 — FONATUR
  { colStart: 10, colSpan: 3, rowStart: 1, rowSpan: 2, rotate: -0.8 }, // 2 — GAM
  { colStart: 6, colSpan: 3, rowStart: 3, rowSpan: 2, rotate: 1 }, // 3 — Acolman señalética
  { colStart: 9, colSpan: 4, rowStart: 3, rowSpan: 3, rotate: -0.5 }, // 4 — Vialidad parque
  { colStart: 1, colSpan: 4, rowStart: 4, rowSpan: 3, rotate: 0.5 }, // 5 — Corredor solar
  { colStart: 5, colSpan: 4, rowStart: 5, rowSpan: 3, rotate: -1 }, // 6 — Solar rural
  { colStart: 9, colSpan: 4, rowStart: 6, rowSpan: 2, rotate: 0.8 }, // 7 — KIA
  { colStart: 1, colSpan: 4, rowStart: 7, rowSpan: 2, rotate: -0.5 }, // 8 — Postes torre
];

export default function ProjectsCollage() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState<Project | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Entrada con stagger por columna
      gsap.utils.toArray<HTMLElement>(".collage-item").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            delay: (i % 4) * 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
            },
          }
        );
      });

      gsap.fromTo(
        ".projects-title-collage",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".projects-title-collage",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cerrar modal con Esc
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      style={{
        position: "relative",
        background:
          "linear-gradient(180deg, transparent 0%, rgba(var(--card-rgb), 0.6) 50%, transparent 100%)",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div className="projects-title-collage" style={{ marginBottom: 64 }}>
          <p
            style={{
              color: "var(--accent-cyan)",
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            04 — Casos
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
            Una selección de instalaciones, piezas personalizadas y producción
            entregada a clientes públicos y privados. Haz clic en cualquier
            imagen para ver el detalle.
          </p>
        </div>

        {/* COLLAGE GRID */}
        <div className="collage-grid">
          {projects.map((p, i) => {
            const l = layouts[i] ?? layouts[layouts.length - 1];
            return (
              <button
                key={p.slug}
                type="button"
                className="collage-item interactive"
                onClick={() => setActive(p)}
                style={{
                  gridColumn: `${l.colStart} / span ${l.colSpan}`,
                  gridRow: `${l.rowStart} / span ${l.rowSpan}`,
                  ["--rot" as never]: `${l.rotate ?? 0}deg`,
                }}
                aria-label={`Ver proyecto ${p.title}`}
              >
                <div className="collage-img-wrap">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 880px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="collage-img-overlay" />
                </div>

                <div className="collage-meta">
                  <span className="collage-year">{p.year}</span>
                  <h4 className="collage-title">{p.title}</h4>
                  <span className="collage-category">{p.category}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {active && (
        <div
          className="project-modal-backdrop"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <div
            className="project-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="project-modal-close interactive"
              onClick={() => setActive(null)}
              aria-label="Cerrar"
            >
              ✕
            </button>

            <div className="project-modal-image">
              <Image
                src={active.image}
                alt={active.title}
                fill
                sizes="(max-width: 880px) 100vw, 600px"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>

            <div className="project-modal-body">
              <p className="project-modal-eyebrow">
                {active.year} · {active.category}
              </p>
              <h3 id="project-modal-title" className="project-modal-title">
                {active.title}
              </h3>
              <p className="project-modal-client">{active.client}</p>

              <div className="project-modal-grid">
                <div>
                  <span className="project-modal-label">Ubicación</span>
                  <span className="project-modal-value">{active.location}</span>
                </div>
                {active.units && (
                  <div>
                    <span className="project-modal-label">Volumen</span>
                    <span className="project-modal-value">{active.units}</span>
                  </div>
                )}
                {active.productCode && (
                  <div>
                    <span className="project-modal-label">Producto</span>
                    <span className="project-modal-value">
                      {active.productCode}
                    </span>
                  </div>
                )}
              </div>

              <p className="project-modal-description">{active.details}</p>

              <a
                href={buildWhatsAppUrlProyectos(
                  `Hola ICEMEX, me interesa cotizar un proyecto similar a: *${active.title}* (${active.year}). ¿Pueden ayudarme?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="project-modal-cta interactive"
              >
                Cotizar proyecto similar →
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products, lineNames, type ProductLine } from "@/lib/products";
import LineIllustration from "@/components/LineIllustrations";

interface LineCard {
  line: ProductLine;
  n: string;
  tagline: string;
}

const lineCards: LineCard[] = [
  {
    line: "AL",
    n: "01",
    tagline: "Vialidades, avenidas y caminos",
  },
  {
    line: "IS",
    n: "02",
    tagline: "Autónomo · 100% solar · MPPT patentado",
  },
  {
    line: "LU",
    n: "03",
    tagline: "Bolardos y postes decorativos",
  },
  {
    line: "RF",
    n: "04",
    tagline: "Alta potencia · BetaLED® · NanoOptic®",
  },
  {
    line: "LC",
    n: "05",
    tagline: "Naves, oficinas y centros comerciales",
  },
  {
    line: "PT",
    n: "06",
    tagline: "Recto, cónico, hexagonal y especiales",
  },
  {
    line: "AC",
    n: "07",
    tagline: "Brazos, anclas, bases y picobas",
  },
];

export default function ProductsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".line-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
            },
            delay: (i % 3) * 0.08,
          }
        );
      });

      gsap.fromTo(
        ".section-title-products",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".section-title-products",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="productos"
      ref={sectionRef}
      style={{
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div
          className="section-title-products"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 80,
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
              02 — Catálogo 2026
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
              Líneas de
              <br />
              producto
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
            Siete líneas que cubren desde alumbrado público y solar autónomo
            hasta bolardos urbanos, reflectores de alta potencia, luminarios
            comerciales, postería y accesorios. Haz clic en una línea para ver
            su catálogo completo.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {lineCards.map((c) => {
            return (
              <Link
                key={c.line}
                href="/catalogo"
                className="line-card interactive"
              >
                <div className="line-card-illu" aria-hidden>
                  <LineIllustration line={c.line} />
                  <div className="line-card-illu-overlay" />
                </div>

                <div className="line-card-body">
                  <div className="line-card-meta">
                    <span>
                      {c.n} · Línea {c.line}
                    </span>
                  </div>

                  <h3 className="line-card-title">{lineNames[c.line]}</h3>

                  <p className="line-card-tagline">{c.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA al catálogo completo */}
        <div className="catalog-cta">
          <div className="catalog-cta-grid">
            <div className="catalog-cta-content">
              <p className="catalog-cta-eyebrow">
                ¿Necesitas más detalle?
              </p>
              <h3 className="catalog-cta-title">
                Encuentra todo
                <br />
                en el <span>catálogo completo</span>
              </h3>
              <p className="catalog-cta-text">
                176 páginas con fichas técnicas, especificaciones,
                certificaciones y aplicaciones de los {products.length}{" "}
                productos disponibles. Descárgalo o consúltalo online.
              </p>

              <div className="catalog-cta-buttons">
                <Link href="/catalogo" className="catalog-cta-primary interactive">
                  ↓ Ver catálogo PDF
                </Link>
              </div>
            </div>

            <div className="catalog-cta-stats">
              <div>
                <span className="catalog-cta-num">176</span>
                <span className="catalog-cta-lbl">Páginas</span>
              </div>
              <div>
                <span className="catalog-cta-num">+50</span>
                <span className="catalog-cta-lbl">Productos</span>
              </div>
              <div>
                <span className="catalog-cta-num">07</span>
                <span className="catalog-cta-lbl">Líneas</span>
              </div>
              <div>
                <span className="catalog-cta-num">+20</span>
                <span className="catalog-cta-lbl">Años</span>
              </div>
            </div>
          </div>

          {/* Tira sutil de tecnologías abajo */}
          <div className="catalog-cta-techs">
            <span className="catalog-cta-techs-label">
              Tecnologías integradas
            </span>
            <div className="catalog-cta-techs-list">
              <span>Philips FastFlex</span>
              <span>·</span>
              <span>Cosmos White</span>
              <span>·</span>
              <span>Xitanium Drivers</span>
              <span>·</span>
              <span>BetaLED®</span>
              <span>·</span>
              <span>NanoOptic®</span>
              <span>·</span>
              <span>MPPT Patentado</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

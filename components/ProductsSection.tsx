"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lineNames, type ProductLine } from "@/lib/products";
import type { LineShowcase } from "@/lib/fichas";
import SpotlightCard from "@/components/SpotlightCard";
import catalogData from "@/lib/catalogo-paginas.json";

// Resumen de cada línea según sus fichas técnicas 2026.
const taglines: Record<ProductLine, string> = {
  AL: "LED de 20 a 250 W para calles, avenidas y carreteras · Philips y CREE",
  IS: "All in One y con panel independiente · sin cableado ni recibo de luz",
  LU: "Bolardos, columnas luminosas y 24 modelos de punta de poste",
  RF: "Reflectores de 120 a 600 W, campanas UFO y marquesinas CREE",
  LC: "Paneles, gabinetes y lineales · CREE TrueWhite® con IRC > 90",
  PT: "Rectos, cónicos y ornamentales de 3 a 15 m en acero A-36",
  AC: "Brazos, anclas, bases de concreto, picobas y señalización",
  CV: "Cámaras Wi-Fi PTZ, duales, foco cámara y solares · vista desde el celular",
};

export default function ProductsSection({ lines }: { lines: LineShowcase[] }) {
  const total = lines.reduce((sum, l) => sum + l.count, 0);
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
      className="page-section"
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
            {total} productos en {lines.length} líneas, desde alumbrado público y
            solar autónomo hasta bolardos urbanos, reflectores de alta potencia,
            luminarios comerciales, postería, accesorios y cámaras de seguridad.
            Cada uno con su ficha técnica descargable. Elige una línea para
            explorarla.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: 20,
          }}
        >
          {lines.map((c, i) => {
            return (
              <SpotlightCard key={c.line} className="p-0 border-none bg-transparent">
                <Link
                  href={`/productos?linea=${c.line}`}
                  className="line-card interactive group block w-full h-full"
                >
                  <div className="line-card-illu" aria-hidden>
                    <div className="line-card-illu-overlay" />
                    {/* eslint-disable-next-line @next/next/no-img-element -- foto webp ya optimizada por fichas-src/build.py */}
                    <img
                      src={c.thumb.src}
                      srcSet={`${c.thumb.src} ${c.thumb.width}w, ${c.photo.src} ${c.photo.width}w`}
                      sizes="(max-width: 700px) 80vw, 340px"
                      width={c.photo.width}
                      height={c.photo.height}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="line-card-body">
                    <div className="line-card-meta">
                      <span>
                        {String(i + 1).padStart(2, "0")} · Línea {c.line}
                      </span>
                      <span className="line-card-count">{c.count} productos</span>
                    </div>

                    <h3 className="line-card-title">{lineNames[c.line]}</h3>

                    <p className="line-card-tagline">{taglines[c.line]}</p>

                    <span className="line-card-action">Ver productos →</span>
                  </div>
                </Link>
              </SpotlightCard>
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
                {catalogData.pages} páginas con especificaciones, certificaciones y
                aplicaciones de iluminación, postería y herrajes, más un
                catálogo aparte de cámaras de seguridad. Cada producto con su
                ficha técnica descargable.
              </p>

              <div className="catalog-cta-buttons">
                <Link href="/catalogo" className="catalog-cta-primary interactive">
                  ↓ Ver catálogo PDF
                </Link>
                <Link href="/productos" className="catalog-cta-secondary interactive">
                  Explorar los {total} productos →
                </Link>
              </div>
            </div>

            <div className="catalog-cta-stats">
              <div>
                <span className="catalog-cta-num">{catalogData.pages}</span>
                <span className="catalog-cta-lbl">Páginas</span>
              </div>
              <div>
                <span className="catalog-cta-num">{total}</span>
                <span className="catalog-cta-lbl">Productos</span>
              </div>
              <div>
                <span className="catalog-cta-num">{String(lines.length).padStart(2, "0")}</span>
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
              <span>·</span>
              <span>CREE TrueWhite®</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

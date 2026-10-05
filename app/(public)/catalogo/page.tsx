import type { Metadata } from "next";
import Link from "next/link";
import { products, lineNames } from "@/lib/products";
import LeadMagnetForm from "@/components/LeadMagnetForm";
import { cameraCatalog, catalog } from "@/lib/fichas";

export const metadata: Metadata = {
  alternates: { canonical: "https://icemex.mx/catalogo" },
  title: "Catálogo PDF 2026",
  description:
    `Descarga gratis el catálogo oficial ICEMEX 2026: ${catalog.pages} páginas con fichas técnicas de luminarias LED, postes, reflectores, iluminación solar, herrajes y material eléctrico, y el catálogo de cámaras de seguridad Wi-Fi.`,
  keywords: [
    "catálogo iluminación", "fichas técnicas LED", "catálogo postes", "catálogo ICEMEX", "descargar catálogo iluminación", "especificaciones luminarias", "PDF iluminación pública",
    "catálogo cámaras de seguridad", "catálogo videovigilancia PDF", "fichas técnicas cámaras Wi-Fi",
  ],
  openGraph: {
    title: "Catálogo PDF 2026 · ICEMEX",
    description:
      `${catalog.pages} páginas con fichas técnicas de alumbrado público, iluminación solar, postes, reflectores, luminarios comerciales y herrajes. Descarga gratuita.`,
  },
};

const lineCounts = Object.entries(
  products.reduce<Record<string, number>>((acc, p) => {
    acc[p.line] = (acc[p.line] || 0) + 1;
    return acc;
  }, {})
);

export default function CatalogoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "https://icemex.mx" },
              { "@type": "ListItem", position: 2, name: "Catálogo PDF 2026" },
            ],
          }),
        }}
      />
      <div style={{ paddingTop: 32, minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 32px 120px",
        }}
      >
        {/* Hero: copy + portada (izquierda) + formulario gated (derecha) */}
        <header
          className="catalog-hero"
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 56,
            alignItems: "start",
            marginBottom: 80,
          }}
        >
          <div>
            <p
              style={{
                color: "var(--accent-cyan)",
                fontSize: 12,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Catálogo oficial 2026
            </p>
            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 68px)",
                color: "var(--text-primary)",
                fontWeight: 300,
                letterSpacing: "0.06em",
                lineHeight: 1.05,
                marginBottom: 24,
                textTransform: "uppercase",
              }}
            >
              {catalog.pages} páginas
              <br />
              <span style={{ color: "var(--accent-cyan)" }}>
                de fichas técnicas
              </span>
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: 15,
                lineHeight: 1.8,
                marginBottom: 32,
                maxWidth: 520,
              }}
            >
              Descarga el catálogo oficial completo con todas las fichas
              técnicas, especificaciones, certificaciones y aplicaciones.
              Llena tus datos para recibirlo y para que nuestro equipo pueda
              acompañarte con asesoría técnica sin costo.
            </p>

            {/* Portada del PDF */}
            {/* eslint-disable-next-line @next/next/no-img-element -- webp ya optimizado por fichas-src/catalogo.py */}
            <img
              src={catalog.cover.src}
              width={catalog.cover.width}
              height={catalog.cover.height}
              alt="Portada del Catálogo ICEMEX 2026"
              decoding="async"
              style={{
                display: "block",
                width: "100%",
                maxWidth: 360,
                height: "auto",
                borderRadius: 12,
                border: "1px solid rgba(var(--cyan-rgb), 0.15)",
                boxShadow: "0 30px 80px rgba(0, 0, 0, 0.35)",
              }}
            />

            {/* Meta del archivo */}
            <div
              style={{
                marginTop: 24,
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                fontSize: 11,
                color: "var(--text-muted)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              <span>{catalog.pages} páginas</span>
              <span style={{ color: "rgba(var(--cyan-rgb), 0.4)" }}>·</span>
              <span>PDF · {catalog.mb} MB</span>
              <span style={{ color: "rgba(var(--cyan-rgb), 0.4)" }}>·</span>
              <span>Edición 2026</span>
            </div>
          </div>

          {/* Formulario gated */}
          <div style={{ position: "sticky", top: 120 }}>
            <LeadMagnetForm
              pdfUrl={catalog.pdf}
              pdfFilename="Catalogo_ICEMEX2026.pdf"
              eyebrow="Descarga gratuita"
              headline="Recibe el catálogo completo"
              submitLabel="↓ Descargar catálogo"
              resourceLabel="Catálogo 2026"
              successTitle="¡Listo! El catálogo se está descargando"
              successMessage={`Por su tamaño (${catalog.mb} MB) la descarga puede tardar unos segundos. Si no inicia, usa el botón de abajo. Abrimos WhatsApp para que nuestro equipo pueda acompañarte con asesoría técnica.`}
            />
          </div>
        </header>

        {/* Líneas en el catálogo */}
        <section style={{ marginBottom: 80 }}>
          <p
            style={{
              color: "var(--accent-cyan)",
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Lo que encontrarás
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: 12,
            }}
          >
            {lineCounts.map(([line]) => (
              <div
                key={line}
                style={{
                  padding: 24,
                  background: "rgba(var(--card-rgb), 0.5)",
                  border: "1px solid rgba(var(--cyan-rgb), 0.08)",
                  borderRadius: 18,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Línea {line}
                </p>
                <h3
                  style={{
                    color: "var(--text-primary)",
                    fontSize: 18,
                    fontWeight: 400,
                    letterSpacing: "0.02em",
                    textTransform: "none",
                  }}
                >
                  {lineNames[line as keyof typeof lineNames]}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Info del catálogo */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: 1,
            background: "rgba(var(--cyan-rgb), 0.1)",
            border: "1px solid rgba(var(--cyan-rgb), 0.1)",
            borderRadius: 22,
            overflow: "hidden",
          }}
        >
          {[
            { n: String(catalog.pages), label: "Páginas" },
            { n: "07", label: "Líneas" },
            { n: String(Object.keys(catalog.fichas).length), label: "Fichas técnicas" },
            { n: "+20", label: "Años de trayectoria" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--bg-primary)",
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span
                style={{
                  color: "var(--text-primary)",
                  fontSize: 36,
                  fontWeight: 300,
                  letterSpacing: "0.04em",
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
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </section>

        {/* Catálogo de videovigilancia */}
        <section
          id="camaras"
          className="catalog-hero"
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 56,
            alignItems: "start",
            marginTop: 120,
            scrollMarginTop: 120,
          }}
        >
          <div>
            <p
              style={{
                color: "var(--accent-cyan)",
                fontSize: 12,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              Catálogo de videovigilancia 2026
            </p>
            <h2
              style={{
                fontSize: "clamp(30px, 4vw, 52px)",
                color: "var(--text-primary)",
                fontWeight: 300,
                letterSpacing: "0.06em",
                lineHeight: 1.05,
                marginBottom: 24,
                textTransform: "uppercase",
              }}
            >
              Cámaras
              <br />
              <span style={{ color: "var(--accent-cyan)" }}>de seguridad</span>
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: 15,
                lineHeight: 1.8,
                marginBottom: 32,
                maxWidth: 520,
              }}
            >
              {Object.keys(cameraCatalog.fichas).length} cámaras Wi-Fi con su
              ficha técnica: duales, PTZ para exterior, de interior, foco
              cámara y solares. Todas con vista remota desde el celular, audio
              bidireccional y visión nocturna; las instalamos y configuramos
              por ti.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element -- webp ya optimizado por fichas-src/catalogo.py */}
            <img
              src={cameraCatalog.cover.src}
              width={cameraCatalog.cover.width}
              height={cameraCatalog.cover.height}
              alt="Portada del Catálogo de Videovigilancia ICEMEX 2026"
              loading="lazy"
              decoding="async"
              style={{
                display: "block",
                width: "100%",
                maxWidth: 360,
                height: "auto",
                borderRadius: 12,
                border: "1px solid rgba(var(--cyan-rgb), 0.15)",
                boxShadow: "0 30px 80px rgba(0, 0, 0, 0.35)",
              }}
            />
            <div
              style={{
                marginTop: 24,
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                fontSize: 11,
                color: "var(--text-muted)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              <span>{cameraCatalog.pages} páginas</span>
              <span style={{ color: "rgba(var(--cyan-rgb), 0.4)" }}>·</span>
              <span>PDF · {cameraCatalog.mb} MB</span>
              <span style={{ color: "rgba(var(--cyan-rgb), 0.4)" }}>·</span>
              <Link href="/productos?linea=CV" style={{ color: "var(--accent-cyan)" }}>
                Ver las cámaras →
              </Link>
            </div>
          </div>
          <div style={{ position: "sticky", top: 120 }}>
            <LeadMagnetForm
              pdfUrl={cameraCatalog.pdf}
              pdfFilename="Catalogo_Videovigilancia_ICEMEX2026.pdf"
              eyebrow="Descarga gratuita"
              headline="Recibe el catálogo de cámaras"
              submitLabel="↓ Descargar catálogo de cámaras"
              resourceLabel="Catálogo de videovigilancia 2026"
              successTitle="¡Listo! El catálogo se está descargando"
              successMessage="Si la descarga no inicia, usa el botón de abajo. Abrimos WhatsApp para que nuestro equipo te ayude a elegir las cámaras para tu espacio."
            />
          </div>
        </section>
      </div>

      {/* Responsive: grid 1-col en mobile */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 880px) {
              .catalog-hero {
                grid-template-columns: 1fr !important;
                gap: 40px !important;
              }
              .catalog-hero > div:last-child {
                position: static !important;
              }
            }
          `,
        }}
      />
    </div>
    </>
  );
}

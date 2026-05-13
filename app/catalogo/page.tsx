import type { Metadata } from "next";
import { products, lineNames } from "@/lib/products";
import LeadMagnetForm from "@/components/LeadMagnetForm";

export const metadata: Metadata = {
  title: "Catálogo PDF 2026",
  description:
    "Descarga gratis el catálogo oficial ICEMEX 2026: 176 páginas con fichas técnicas de luminarias LED, postes, reflectores, iluminación solar, herrajes y material eléctrico. Especificaciones, certificaciones y aplicaciones.",
  keywords: [
    "catálogo iluminación", "fichas técnicas LED", "catálogo postes", "catálogo ICEMEX", "descargar catálogo iluminación", "especificaciones luminarias", "PDF iluminación pública",
  ],
  openGraph: {
    title: "Catálogo PDF 2026 · ICEMEX",
    description:
      "176 páginas con fichas técnicas de alumbrado público, iluminación solar, postes, reflectores, luminarios comerciales y herrajes. Descarga gratuita.",
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
    <div style={{ paddingTop: 140, minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 32px 120px",
        }}
      >
        {/* Hero: copy + portada simulada (izquierda) + formulario gated (derecha) */}
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
              176 páginas
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

            {/* Portada simulada del PDF */}
            <div
              style={{
                position: "relative",
                aspectRatio: "8.5 / 11",
                maxWidth: 360,
                background:
                  "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 60%, var(--bg-secondary) 100%)",
                border: "1px solid rgba(var(--cyan-rgb), 0.15)",
                borderRadius: 28,
                padding: 40,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 30px 80px rgba(0, 0, 0, 0.35)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 6,
                  background: "var(--accent-cyan)",
                }}
              />
              <div>
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--accent-cyan)",
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                    fontWeight: 600,
                  }}
                >
                  ICEMEX · S.A. de C.V.
                </p>
                <h2
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "clamp(20px, 3vw, 32px)",
                    fontWeight: 300,
                    letterSpacing: "0.04em",
                    lineHeight: 1.1,
                  }}
                >
                  Catálogo
                  <br />
                  <span style={{ color: "var(--accent-cyan)" }}>2026</span>
                </h2>
              </div>

              <div
                style={{
                  position: "absolute",
                  inset: 16,
                  border: "1px solid rgba(var(--cyan-rgb), 0.06)",
                  borderRadius: 18,
                  pointerEvents: "none",
                }}
              />

              <div>
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--text-muted)",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    lineHeight: 1.8,
                  }}
                >
                  Iluminamos tus sueños
                  <br />
                  materializamos tus ideas
                </p>
              </div>
            </div>

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
              <span>176 páginas</span>
              <span style={{ color: "rgba(var(--cyan-rgb), 0.4)" }}>·</span>
              <span>PDF · 99 MB</span>
              <span style={{ color: "rgba(var(--cyan-rgb), 0.4)" }}>·</span>
              <span>Edición 2026</span>
            </div>
          </div>

          {/* Formulario gated */}
          <div style={{ position: "sticky", top: 120 }}>
            <LeadMagnetForm
              pdfUrl="/catalogo-icemex-2026.pdf"
              pdfFilename="ICEMEX-Catalogo-2026.pdf"
              eyebrow="Descarga gratuita"
              headline="Recibe el catálogo completo"
              submitLabel="↓ Descargar catálogo"
              resourceLabel="Catálogo 2026"
              successTitle="¡Listo! El catálogo se está descargando"
              successMessage="Por su tamaño (99 MB) la descarga puede tardar unos segundos. Si no inicia, usa el botón de abajo. Abrimos WhatsApp para que nuestro equipo pueda acompañarte con asesoría técnica."
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
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 1,
            background: "rgba(var(--cyan-rgb), 0.1)",
            border: "1px solid rgba(var(--cyan-rgb), 0.1)",
            borderRadius: 22,
            overflow: "hidden",
          }}
        >
          {[
            { n: "176", label: "Páginas" },
            { n: "07", label: "Líneas" },
            { n: "+50", label: "Productos" },
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
  );
}

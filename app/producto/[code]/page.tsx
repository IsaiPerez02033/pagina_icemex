import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  products,
  lineNames,
  tagNames,
  getAllCodes,
  type ProductLine,
} from "@/lib/products";
import { buildWhatsAppUrlProyectos } from "@/lib/whatsapp";

export function generateStaticParams() {
  return getAllCodes().map((code) => ({ code }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Metadata {
  const { code } = params as unknown as { code: string };
  const p = products.find((x) => x.code === code);
  if (!p) return { title: "Producto no encontrado" };

  const title = `${p.name} (${p.code}) — ${lineNames[p.line]} · ICEMEX`;
  const description = `${p.tagline}. ${p.description.slice(0, 140)}. ${p.specs
    .slice(0, 3)
    .map((s) => `${s.label}: ${s.value}`)
    .join(" | ")}`;

  return {
    title,
    description,
    keywords: [
      p.name,
      lineNames[p.line],
      ...p.tags.map((t) => tagNames[t]),
      "ICEMEX",
      "cotizar",
      "precio",
      "ficha técnica",
    ],
    openGraph: {
      title: `${p.name} · ${lineNames[p.line]}`,
      description: p.tagline,
    },
    alternates: { canonical: `https://icemex.mx/producto/${p.code}` },
  };
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const p = products.find((x) => x.code === code);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    sku: p.code,
    brand: { "@type": "Brand", name: "ICEMEX" },
    category: lineNames[p.line],
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "MXN",
        description: "Cotizar para precio exacto",
      },
    },
    additionalProperty: p.specs.map((s) => ({
      "@type": "PropertyValue",
      name: s.label,
      value: s.value,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ paddingTop: 140, minHeight: "100vh" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 100px" }}>
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            style={{ marginBottom: 24 }}
          >
            <ol
              style={{
                listStyle: "none",
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
                fontSize: 12,
                color: "var(--text-muted)",
                letterSpacing: "0.08em",
              }}
            >
              <li>
                <Link
                  href="/"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Inicio
                </Link>
              </li>
              <span style={{ color: "var(--accent-cyan)" }}>/</span>
              <li>
                <Link
                  href="/productos"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Productos
                </Link>
              </li>
              <span style={{ color: "var(--accent-cyan)" }}>/</span>
              <li>
                <Link
                  href={`/productos?linea=${p.line}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {lineNames[p.line]}
                </Link>
              </li>
              <span style={{ color: "var(--accent-cyan)" }}>/</span>
              <li style={{ color: "var(--accent-cyan)" }}>{p.name}</li>
            </ol>
          </nav>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Inicio",
                    item: "https://icemex.mx",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Productos",
                    item: "https://icemex.mx/productos",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: lineNames[p.line],
                    item: `https://icemex.mx/productos?linea=${p.line}`,
                  },
                  {
                    "@type": "ListItem",
                    position: 4,
                    name: p.name,
                  },
                ],
              }),
            }}
          />

          {/* Header */}
          <div style={{ marginBottom: 56 }}>
            <p
              style={{
                color: "var(--accent-cyan)",
                fontSize: 12,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              {p.code} · {lineNames[p.line]}
            </p>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 56px)",
                color: "var(--text-primary)",
                fontWeight: 300,
                letterSpacing: "0.04em",
                textTransform: "none",
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              {p.name}
            </h1>
            <p
              style={{
                color: "var(--accent-cyan)",
                fontSize: 17,
                letterSpacing: "0.02em",
                maxWidth: 640,
              }}
            >
              {p.tagline}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 56,
            }}
          >
            {/* Columna izquierda: ficha */}
            <div>
              <section style={{ marginBottom: 48 }}>
                <h2
                  style={{
                    color: "var(--text-primary)",
                    fontSize: 20,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    marginBottom: 16,
                  }}
                >
                  Descripción
                </h2>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 15,
                    lineHeight: 1.8,
                  }}
                >
                  {p.description}
                </p>
              </section>

              <section style={{ marginBottom: 48 }}>
                <h2
                  style={{
                    color: "var(--text-primary)",
                    fontSize: 20,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    marginBottom: 16,
                  }}
                >
                  Ficha técnica
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "14px 24px",
                    padding: 28,
                    background: "rgba(var(--card-rgb), 0.5)",
                    border: "1px solid rgba(var(--cyan-rgb), 0.12)",
                    borderRadius: 18,
                  }}
                >
                  {p.specs.map((s) => (
                    <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
                      <span
                        style={{
                          color: "var(--text-primary)",
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                      >
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {p.features.length > 0 && (
                <section style={{ marginBottom: 48 }}>
                  <h2
                    style={{
                      color: "var(--text-primary)",
                      fontSize: 20,
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                      marginBottom: 16,
                    }}
                  >
                    Características
                  </h2>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                    {p.features.map((f) => (
                      <li
                        key={f}
                        style={{
                          color: "var(--text-muted)",
                          fontSize: 14,
                          lineHeight: 1.6,
                          display: "flex",
                          gap: 10,
                          alignItems: "baseline",
                        }}
                      >
                        <span style={{ color: "var(--accent-cyan)", flexShrink: 0 }}>▸</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section style={{ marginBottom: 48 }}>
                <h2
                  style={{
                    color: "var(--text-primary)",
                    fontSize: 20,
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    marginBottom: 16,
                  }}
                >
                  Aplicaciones
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {p.applications.map((a) => (
                    <span
                      key={a}
                      style={{
                        fontSize: 12,
                        color: "var(--text-primary)",
                        background: "rgba(var(--cyan-rgb), 0.08)",
                        border: "1px solid rgba(var(--cyan-rgb), 0.15)",
                        borderRadius: 999,
                        padding: "6px 16px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Columna derecha: meta + CTA */}
            <div>
              <div
                style={{
                  position: "sticky",
                  top: 120,
                  padding: 36,
                  background: "rgba(var(--card-rgb), 0.6)",
                  border: "1px solid rgba(var(--cyan-rgb), 0.15)",
                  borderRadius: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Categorías
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: 11,
                          color: "var(--accent-cyan)",
                          border: "1px solid rgba(var(--cyan-rgb), 0.2)",
                          borderRadius: 999,
                          padding: "4px 12px",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {tagNames[t]}
                      </span>
                    ))}
                  </div>
                </div>

                {p.certifications && p.certifications.length > 0 && (
                  <div>
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Certificaciones
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {p.certifications.map((c) => (
                        <span
                          key={c}
                          style={{
                            fontSize: 11,
                            color: "var(--text-primary)",
                            border: "1px solid rgba(var(--cyan-rgb), 0.1)",
                            borderRadius: 999,
                            padding: "4px 12px",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {p.warranty && (
                  <div>
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Garantía
                    </span>
                    <span style={{ color: "var(--accent-cyan)", fontSize: 14, letterSpacing: "0.04em" }}>
                      {p.warranty}
                    </span>
                  </div>
                )}

                <a
                  href={buildWhatsAppUrlProyectos(
                    `Hola ICEMEX, me interesa cotizar: *${p.name}* (${p.code}). ¿Me pueden dar precio y disponibilidad?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "18px 28px",
                    background: "#25D366",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    borderRadius: 999,
                    textDecoration: "none",
                    marginTop: 12,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Cotizar este producto
                </a>

                <Link
                  href="/productos"
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 13,
                    textAlign: "center",
                    marginTop: 8,
                    textDecoration: "none",
                  }}
                >
                  ← Volver al catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { products, lineNames, tagNames, type ProductLine } from "@/lib/products";

export const metadata: Metadata = {
  title: "Catálogo de productos",
  description:
    "Explora las 7 líneas de producto ICEMEX: alumbrado público, iluminación solar, luminarios urbanos, reflectores, luminarios comerciales, postes y herrajes. Fichas técnicas con especificaciones, certificaciones y aplicaciones.",
  keywords: [
    "catálogo iluminación",
    "productos ICEMEX",
    "luminarias LED",
    "postes metálicos",
    "iluminación solar",
    "reflectores industriales",
    "herrajes eléctricos",
    "cotizar luminarias",
  ],
  openGraph: {
    title: "Catálogo de productos · ICEMEX",
    description:
      "38 productos en 7 líneas. Alumbrado público, solar, urbano, reflectores, comerciales, postes y herrajes.",
  },
  alternates: { canonical: "https://icemex.mx/productos" },
};

const lines: ProductLine[] = ["AL", "IS", "LU", "RF", "LC", "PT", "AC"];

export default function ProductosPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://icemex.mx/producto/${p.code}`,
      name: p.name,
      description: p.tagline,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ paddingTop: 140, minHeight: "100vh" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 120px" }}>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              color: "var(--text-primary)",
              fontWeight: 300,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            Catálogo de{" "}
            <span style={{ color: "var(--accent-cyan)" }}>productos</span>
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 15,
              lineHeight: 1.8,
              maxWidth: 640,
              marginBottom: 64,
            }}
          >
            {products.length} productos en 7 líneas. Haz clic en cualquier
            producto para ver su ficha técnica completa con especificaciones,
            certificaciones y opción de cotización directa por WhatsApp.
          </p>

          {lines.map((line) => {
            const lineProducts = products.filter((p) => p.line === line);
            if (lineProducts.length === 0) return null;

            return (
              <section key={line} style={{ marginBottom: 72 }}>
                <h2
                  style={{
                    color: "var(--accent-cyan)",
                    fontSize: 12,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    marginBottom: 20,
                  }}
                >
                  {lineNames[line]} · {lineProducts.length} productos
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: 16,
                  }}
                >
                  {lineProducts.map((p) => (
                    <Link
                      key={p.code}
                      className="product-card-link"
                      href={`/producto/${p.code}`}
                      style={{
                        padding: 24,
                        background: "rgba(var(--card-rgb), 0.5)",
                        border: "1px solid rgba(var(--cyan-rgb), 0.1)",
                        borderRadius: 18,
                        textDecoration: "none",
                        color: "inherit",
                        transition:
                          "border-color 0.3s ease, transform 0.3s ease, background 0.3s ease",
                        display: "block",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 10,
                          color: "var(--accent-cyan)",
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          marginBottom: 8,
                          fontWeight: 500,
                        }}
                      >
                        {p.code}
                      </p>
                      <h3
                        style={{
                          color: "var(--text-primary)",
                          fontSize: 18,
                          fontWeight: 400,
                          letterSpacing: "0.02em",
                          textTransform: "none",
                          marginBottom: 8,
                          lineHeight: 1.2,
                        }}
                      >
                        {p.name}
                      </h3>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: 12,
                          lineHeight: 1.5,
                          marginBottom: 12,
                        }}
                      >
                        {p.tagline}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {p.tags.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            style={{
                              fontSize: 9,
                              color: "var(--text-muted)",
                              border: "1px solid rgba(var(--cyan-rgb), 0.12)",
                              borderRadius: 999,
                              padding: "2px 8px",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                            }}
                          >
                            {tagNames[t]}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .product-card-link:hover {
              border-color: rgba(var(--cyan-rgb), 0.4) !important;
              transform: translateY(-3px);
              background: rgba(var(--card-rgb), 0.7) !important;
            }
          `,
        }}
      />
    </>
  );
}

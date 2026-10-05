import ProductExplorer, { type ExplorerItem } from "@/components/ProductExplorer";
import type { Metadata } from "next";
import { catalogProducts, fichaForProduct, kpiValue, standaloneFichas } from "@/lib/fichas";

// Productos con ficha curada primero, luego el resto del catálogo 2026.
const items: ExplorerItem[] = [
  ...catalogProducts.map((p) => ({
    code: p.code,
    name: p.name,
    line: p.line,
    tags: p.tags,
    tagline: p.tagline,
    specs: p.specs.slice(0, 2),
    thumb: fichaForProduct(p.code)?.thumb,
  })),
  ...standaloneFichas.map((f) => ({
    code: f.code,
    name: f.name,
    line: f.line,
    tags: f.tags,
    tagline: f.kind,
    specs: f.kpis.slice(0, 2).map((k) => ({ label: k.l, value: kpiValue(k) })),
    thumb: f.thumb,
  })),
];

export const metadata: Metadata = {
  title: "Catálogo de productos",
  description:
    "Explora las 8 líneas de producto ICEMEX: alumbrado público, iluminación solar, luminarios urbanos, reflectores, luminarios comerciales, postes, herrajes y cámaras de seguridad. Fichas técnicas con especificaciones, certificaciones y aplicaciones.",
  keywords: [
    "catálogo iluminación",
    "productos ICEMEX",
    "luminarias LED",
    "postes metálicos",
    "iluminación solar",
    "reflectores industriales",
    "herrajes eléctricos",
    "cotizar luminarias",
    "cámaras de seguridad Wi-Fi",
  ],
  openGraph: {
    title: "Catálogo de productos · ICEMEX",
    description:
      `${items.length} productos en 8 líneas. Alumbrado público, solar, urbano, reflectores, comerciales, postes, herrajes y cámaras de seguridad.`,
  },
  alternates: { canonical: "https://icemex.mx/productos" },
};

export default function ProductosPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://icemex.mx/producto/${p.code}`,
      name: p.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ paddingTop: 32, minHeight: "100vh" }}>
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
            {items.length} productos en 7 líneas. Haz clic en cualquier
            producto para ver su ficha técnica completa con especificaciones,
            certificaciones y opción de cotización directa por WhatsApp.
          </p>

          <ProductExplorer items={items} />
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

import Link from "next/link";
import { lineNames, tagNames } from "@/lib/products";
import { fichas, type Ficha } from "@/lib/fichas";
import { buildWhatsAppUrlProyectos } from "@/lib/whatsapp";

const pagesLabel = (pages: number[]) =>
  pages.length === 1
    ? `Página ${pages[0]}`
    : `Páginas ${pages[0]}–${pages[pages.length - 1]}`;

/** Vista previa de la ficha + botón de descarga del PDF. */
export function FichaDownload({ ficha, eager = false }: { ficha: Ficha; eager?: boolean }) {
  return (
    <div className="ficha-download">
      <a href={ficha.pdf} target="_blank" rel="noopener" className="ficha-preview">
        {/* eslint-disable-next-line @next/next/no-img-element -- webp ya optimizado por scripts/build-fichas.py */}
        <img
          src={eager ? ficha.image.src : ficha.thumb.src}
          width={eager ? ficha.image.width : ficha.thumb.width}
          height={eager ? ficha.image.height : ficha.thumb.height}
          alt={`Ficha técnica de ${ficha.name} (${ficha.code}), Catálogo ICEMEX 2026`}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
        />
      </a>
      <a href={ficha.pdf} download className="action-secondary ficha-pdf-btn">
        ↓ Descargar ficha técnica (PDF)
      </a>
      <p className="ficha-pages">
        {pagesLabel(ficha.pages)} del Catálogo ICEMEX 2026
      </p>
    </div>
  );
}

/** Texto extraído del PDF, plegable (Google lo indexa igual). */
export function FichaText({ ficha }: { ficha: Ficha }) {
  if (!ficha.blocks.some((b) => b.t)) return null;
  return (
    <details className="ficha-text">
      <summary>Texto de la ficha técnica</summary>
      {ficha.blocks.map((b, i) =>
        b.h ? <h3 key={i}>{b.h}</h3> : <p key={i}>{b.t}</p>
      )}
    </details>
  );
}

export default function FichaPage({ ficha }: { ficha: Ficha }) {
  const related = fichas
    .filter((f) => f.line === ficha.line && f.code !== ficha.code)
    .slice(0, 6);
  const quote = buildWhatsAppUrlProyectos(
    `Hola ICEMEX, me interesa cotizar: *${ficha.name}* (${ficha.code}). ¿Me pueden dar precio y disponibilidad?`
  );

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: ficha.name,
      sku: ficha.code,
      description: ficha.summary || `Ficha técnica de ${ficha.name}`,
      image: `https://icemex.mx${ficha.image.src}`,
      brand: { "@type": "Brand", name: "ICEMEX" },
      category: lineNames[ficha.line],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://icemex.mx" },
        { "@type": "ListItem", position: 2, name: "Productos", item: "https://icemex.mx/productos" },
        {
          "@type": "ListItem",
          position: 3,
          name: lineNames[ficha.line],
          item: `https://icemex.mx/productos?linea=${ficha.line}`,
        },
        { "@type": "ListItem", position: 4, name: ficha.name },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="ficha-page">
        <nav aria-label="Breadcrumb" className="ficha-breadcrumb">
          <ol>
            <li><Link href="/">Inicio</Link></li>
            <li><Link href="/productos">Productos</Link></li>
            <li>
              <Link href={`/productos?linea=${ficha.line}`}>{lineNames[ficha.line]}</Link>
            </li>
            <li aria-current="page">{ficha.name}</li>
          </ol>
        </nav>

        <header className="ficha-header">
          <p className="eyebrow">
            {ficha.code} · {lineNames[ficha.line]}
          </p>
          <h1>{ficha.name}</h1>
          {ficha.summary && <p className="ficha-summary">{ficha.summary}</p>}
        </header>

        <div className="ficha-grid">
          <div>
            <FichaDownload ficha={ficha} eager />
            <FichaText ficha={ficha} />
          </div>

          <aside className="ficha-aside">
            {ficha.tags.length > 0 && (
              <div>
                <span className="ficha-label">Aplicaciones</span>
                <div className="ficha-chips">
                  {ficha.tags.map((t) => (
                    <Link key={t} href={`/productos?aplicacion=${t}`}>
                      {tagNames[t]}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <a href={quote} target="_blank" rel="noopener noreferrer" className="ficha-whatsapp">
              Cotizar por WhatsApp
            </a>
            <p className="ficha-note">
              Precio, disponibilidad y asesoría técnica (DIALux, NOM-013) sin costo.
            </p>
            <Link href="/productos" className="ficha-back">
              ← Volver al catálogo
            </Link>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="ficha-related" aria-labelledby="related-title">
            <h2 id="related-title">Más de {lineNames[ficha.line]}</h2>
            <ul>
              {related.map((f) => (
                <li key={f.code}>
                  <Link href={`/producto/${f.code}`} prefetch={false}>
                    <span className="eyebrow">{f.code}</span>
                    {f.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}

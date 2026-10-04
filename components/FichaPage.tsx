import Link from "next/link";
import { lineNames, tagNames, type ProductLine, type ProductTag } from "@/lib/products";
import { fichas, fichaHref, kpiValue, type Ficha } from "@/lib/fichas";
import { buildWhatsAppUrlProyectos } from "@/lib/whatsapp";

const pagesLabel = (pages: number[]) =>
  pages.length === 1
    ? `Página ${pages[0]}`
    : `Páginas ${pages[0]}–${pages[pages.length - 1]}`;

/** Portada de la ficha + botón de descarga del PDF. */
export function FichaDownload({ ficha }: { ficha: Ficha }) {
  return (
    <div className="ficha-download">
      <a href={ficha.pdf} target="_blank" rel="noopener" className="ficha-preview">
        {/* eslint-disable-next-line @next/next/no-img-element -- webp ya optimizado por scripts/build-fichas.py */}
        <img
          src={ficha.coverThumb.src}
          width={ficha.coverThumb.width}
          height={ficha.coverThumb.height}
          alt={`Portada de la ficha técnica de ${ficha.name} (${ficha.code})`}
          loading="lazy"
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

interface FichaPageProps {
  ficha: Ficha;
  /** Cuando la ficha es la de un producto del sitio, se muestran sus datos. */
  product?: { code: string; name: string; line: ProductLine; tags: ProductTag[] };
}

export default function FichaPage({ ficha, product }: FichaPageProps) {
  const code = product?.code ?? ficha.code;
  const name = product?.name ?? ficha.name;
  const line = product?.line ?? ficha.line;
  const tags = product?.tags ?? ficha.tags;

  const related = fichas
    .filter((f) => f.line === line && f.code !== ficha.code)
    .slice(0, 6);
  const quote = buildWhatsAppUrlProyectos(
    `Hola ICEMEX, me interesa cotizar: *${name}* (${code}). ¿Me pueden dar precio y disponibilidad?`
  );
  const subtitle = [ficha.power, ficha.variant].filter(Boolean).join(" · ");

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name,
      sku: code,
      description: ficha.description.join(" ") || `Ficha técnica de ${name}`,
      image: [`https://icemex.mx${ficha.image.src}`, `https://icemex.mx${ficha.cover.src}`],
      brand: { "@type": "Brand", name: "ICEMEX" },
      category: lineNames[line],
      additionalProperty: ficha.kpis.map((k) => ({
        "@type": "PropertyValue",
        name: k.l,
        value: kpiValue(k),
      })),
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
          name: lineNames[line],
          item: `https://icemex.mx/productos?linea=${line}`,
        },
        { "@type": "ListItem", position: 4, name },
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
              <Link href={`/productos?linea=${line}`}>{lineNames[line]}</Link>
            </li>
            <li aria-current="page">{name}</li>
          </ol>
        </nav>

        <section className="ficha-hero">
          <div className="ficha-stage">
            {/* eslint-disable-next-line @next/next/no-img-element -- foto webp ya optimizada por fichas-src/build.py */}
            <img
              src={ficha.mid.src}
              srcSet={`${ficha.mid.src} ${ficha.mid.width}w, ${ficha.image.src} ${ficha.image.width}w`}
              sizes="(max-width: 860px) 90vw, 560px"
              width={ficha.image.width}
              height={ficha.image.height}
              alt={`${name}, ${ficha.kind.toLowerCase()} ICEMEX`}
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="ficha-intro">
            <p className="eyebrow">
              {code} · {lineNames[line]}
            </p>
            <h1>{name}</h1>
            <p className="ficha-kind">{ficha.kind}</p>
            {subtitle && <p className="ficha-subtitle">{subtitle}</p>}
            {ficha.kpis.length > 0 && (
              <dl className={`ficha-kpis n${ficha.kpis.length}`}>
                {ficha.kpis.map((k) => (
                  <div key={k.l}>
                    <dt>{k.l}</dt>
                    <dd>
                      {k.v}
                      {k.u && <small> {k.u}</small>}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="ficha-actions">
              <a href={quote} target="_blank" rel="noopener noreferrer" className="ficha-whatsapp">
                Cotizar por WhatsApp
              </a>
              <a href={ficha.pdf} download className="action-secondary ficha-pdf-btn">
                ↓ Ficha técnica (PDF)
              </a>
            </div>
          </div>
        </section>

        <div className="ficha-grid">
          <div className="ficha-body">
            {ficha.description.length > 0 && (
              <section>
                <h2>Descripción</h2>
                {ficha.description.map((p) => (
                  <p key={p.slice(0, 40)} className="ficha-paragraph">{p}</p>
                ))}
              </section>
            )}

            {ficha.features.length > 0 && (
              <section>
                <h2>{ficha.isLuminaire ? "Tecnología" : "Características"}</h2>
                <ul className="ficha-features">
                  {ficha.features.map((f) => (
                    <li key={f.t}>
                      <strong>{f.t}</strong>
                      <span>{f.d}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {ficha.specs.length > 0 && (
              <section>
                <h2>Especificaciones técnicas</h2>
                <div className="ficha-specs">
                  {ficha.specs.map((g) => (
                    <table key={g.name}>
                      <caption>{g.name}</caption>
                      <tbody>
                        {g.rows.map(([label, value]) => (
                          <tr key={label}>
                            <th scope="row">{label}</th>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ))}
                </div>
              </section>
            )}

            {ficha.advantages.length > 0 && (
              <section>
                <h2>Ventajas</h2>
                <ul className="ficha-advantages">
                  {ficha.advantages.map((a) => (
                    <li key={a.t}>
                      <strong>{a.t}</strong>
                      <span>{a.d}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(ficha.dims.length > 0 || ficha.mount) && (
              <section>
                <h2>{ficha.dims.length > 0 ? "Dimensiones e instalación" : "Instalación"}</h2>
                {ficha.dims.length > 0 && (
                  <div className="ficha-specs">
                    <table>
                      <tbody>
                        {ficha.dims.map(([label, value]) => (
                          <tr key={label}>
                            <th scope="row">{label}</th>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {ficha.mount && <p className="ficha-paragraph">{ficha.mount}</p>}
              </section>
            )}
          </div>

          <aside className="ficha-aside">
            <FichaDownload ficha={ficha} />
            {(ficha.warranty.length > 0 || ficha.certs.length > 0) && (
              <div>
                <span className="ficha-label">Garantía y certificaciones</span>
                {ficha.warranty.map((w) => (
                  <p key={w} className="ficha-warranty">{w}</p>
                ))}
                {ficha.certs.length > 0 && (
                  <div className="ficha-chips">
                    {ficha.certs.map((c) => (
                      <span key={c.c} title={c.l}>{c.c}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
            {ficha.applications.length > 0 && (
              <div>
                <span className="ficha-label">Aplicaciones</span>
                <ul className="ficha-apps">
                  {ficha.applications.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {tags.length > 0 && (
              <div>
                <span className="ficha-label">Ver productos para</span>
                <div className="ficha-chips">
                  {tags.map((t) => (
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
            <h2 id="related-title">Más de {lineNames[line]}</h2>
            <ul>
              {related.map((f) => (
                <li key={f.code}>
                  <Link href={fichaHref(f)} prefetch={false}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- miniatura webp ya optimizada */}
                    <img
                      src={f.thumb.src}
                      width={f.thumb.width}
                      height={f.thumb.height}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
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

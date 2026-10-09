import Link from "next/link";
import { ArrowUpRight, FileDown } from "lucide-react";
import { fichaHref, getFicha, kpiValue, type Ficha } from "@/lib/fichas";
import { DESTACADOS } from "@/lib/destacados";

/** Indicadores que no repiten la potencia ni el dato secundario de la tarjeta. */
function highlights(f: Ficha) {
  const shown = `${f.power} ${f.variant}`;
  return f.kpis.filter((k) => !shown.includes(kpiValue(k))).slice(0, 3);
}

export default function DestacadosSection() {
  const items = DESTACADOS.map(getFicha).filter((f): f is Ficha => Boolean(f));
  if (!items.length) return null;

  return (
    <section className="page-section nov-section" id="destacados" aria-labelledby="nov-title">
      <div className="nov-wrap">
        <div className="nov-head">
          <div>
            <p className="svc-eyebrow">Selección ICEMEX</p>
            <h2 id="nov-title" className="svc-h2">
              Productos destacados
            </h2>
          </div>
          <p className="nov-lead">
            Los luminarios que más recomendamos para alumbrado público y espacios urbanos. Consulta su
            información completa y descarga su ficha técnica.
          </p>
        </div>

        <div className="nov-grid">
          {items.map((f, i) => {
            const href = fichaHref(f);
            return (
              <article key={f.code} className="nov-card">
                <Link href={href} className="nov-stage" aria-label={`${f.model}: ver información y ficha técnica`}>
                  <span className="nov-badge">Destacado</span>
                  <span className="nov-code">{f.code}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element -- foto webp ya optimizada por fichas-src/build.py */}
                  <img
                    src={f.mid.src}
                    width={f.mid.width}
                    height={f.mid.height}
                    alt={`${f.model}, ${f.kind.toLowerCase()}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </Link>
                <div className="nov-body">
                  <p className="nov-kind">{f.kind}</p>
                  <h3>
                    <Link href={href}>{f.model}</Link>
                  </h3>
                  {/* Siempre presente: cada hijo ocupa una fila del subgrid. */}
                  <p className="nov-power">{[f.power, f.variant].filter(Boolean).join(" · ")}</p>
                  <dl className="nov-kpis">
                    {highlights(f).map((k) => (
                      <div key={k.l}>
                        <dt>{k.l}</dt>
                        <dd>
                          {k.v}
                          {k.u && <small> {k.u}</small>}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="nov-actions">
                    <Link href={href} className="nov-btn nov-btn-primary">
                      Ver ficha <ArrowUpRight size={16} aria-hidden />
                    </Link>
                    <a href={f.pdf} className="nov-btn" download aria-label={`Descargar ficha técnica de ${f.model} en PDF`}>
                      <FileDown size={16} aria-hidden /> PDF
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

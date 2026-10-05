"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { lineNames, tagNames } from "@/lib/products";

export interface ExplorerItem {
  code: string;
  name: string;
  line: keyof typeof lineNames;
  tags: string[];
  tagline: string;
  specs: { label: string; value: string }[];
  thumb?: { src: string; width: number; height: number };
}

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export default function ProductExplorer({ items }: { items: ExplorerItem[] }) {
  const [query, setQuery] = useState("");
  const [line, setLine] = useState("");
  const [tag, setTag] = useState("");

  // Filtros desde la URL (?linea=AL&aplicacion=solar&q=cobra): los usan el
  // breadcrumb de cada producto y los chips de aplicación.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const l = params.get("linea")?.toUpperCase() ?? "";
    const t = params.get("aplicacion") ?? "";
    if (l in lineNames) setLine(l);
    if (t in tagNames) setTag(t);
    setQuery(params.get("q") ?? "");
  }, []);

  const found = useMemo(
    () =>
      items.filter(
        (p) =>
          (!line || p.line === line) &&
          (!tag || p.tags.includes(tag)) &&
          normalize(
            [p.code, p.name, p.tagline, ...p.specs.map((s) => s.value)].join(" ")
          ).includes(normalize(query.trim()))
      ),
    [items, query, line, tag]
  );

  return (
    <div className="explorer">
      <div className="explorer-filters">
        <label>
          Buscar producto
          <input
            type="search"
            placeholder="Nombre, código o potencia…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          Línea
          <select value={line} onChange={(e) => setLine(e.target.value)}>
            <option value="">Todas las líneas</option>
            {Object.entries(lineNames).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          Aplicación
          <select value={tag} onChange={(e) => setTag(e.target.value)}>
            <option value="">Todas las aplicaciones</option>
            {Object.entries(tagNames).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p role="status" className="result-count">
        {found.length}{" "}
        {found.length === 1 ? "producto encontrado" : "productos encontrados"}
      </p>
      <div className="explorer-grid">
        {found.map((p) => (
          <Link
            prefetch={false}
            href={`/producto/${p.code}`}
            className="explorer-card"
            key={p.code}
          >
            {p.thumb && (
              // eslint-disable-next-line @next/next/no-img-element -- miniatura webp ya optimizada
              <img
                className={p.line === "CV" ? "explorer-thumb on-dark" : "explorer-thumb"}
                src={p.thumb.src}
                width={p.thumb.width}
                height={p.thumb.height}
                alt=""
                loading="lazy"
                decoding="async"
              />
            )}
            <span className="eyebrow">
              {p.code} · {lineNames[p.line]}
            </span>
            <h2>{p.name}</h2>
            {p.tagline && <p>{p.tagline}</p>}
            {p.specs.length > 0 && (
              <dl>
                {p.specs.slice(0, 2).map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <span className="card-action">Ver ficha y cotizar ↗</span>
          </Link>
        ))}
      </div>
      {!found.length && (
        <div className="empty-results">
          <h2>No encontramos esa combinación</h2>
          <p>Prueba otro nombre, código o aplicación.</p>
          <button
            className="action-primary"
            onClick={() => {
              setQuery("");
              setLine("");
              setTag("");
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}

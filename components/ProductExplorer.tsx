"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { products, lineNames, tagNames } from "@/lib/products";
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export default function ProductExplorer() {
  const [query, setQuery] = useState("");
  const [line, setLine] = useState("");
  const [tag, setTag] = useState("");
  const found = useMemo(
    () =>
      products.filter(
        (p) =>
          (!line || p.line === line) &&
          (!tag || p.tags.some((t) => t === tag)) &&
          normalize(
            [p.code, p.name, p.tagline, ...p.specs.map((s) => s.value)].join(
              " ",
            ),
          ).includes(normalize(query.trim())),
      ),
    [query, line, tag],
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
            <span className="eyebrow">
              {p.code} · {lineNames[p.line]}
            </span>
            <h2>{p.name}</h2>
            <p>{p.tagline}</p>
            <dl>
              {p.specs.slice(0, 2).map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
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

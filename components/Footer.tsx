"use client";

import Link from "next/link";
import IcemexLogo from "@/components/IcemexLogo";

const socialLinks = [
  {
    href: "https://www.facebook.com/icemex3",
    label: "Facebook",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/icemex",
    label: "Instagram",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@icemex3",
    label: "TikTok",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/icemex-sa-de-cv-08784113a",
    label: "LinkedIn",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/catalogo", label: "Catálogo PDF" },
  { href: "/#contacto", label: "Contacto" },
];

const productLines = [
  "Alumbrado público (AL)",
  "Iluminación solar (IS)",
  "Luminarios urbanos (LU)",
  "Reflectores (RF)",
  "Luminarios comerciales (LC)",
  "Postes y postería (PT)",
  "Brazos y herrajes (AC)",
];

const styles = `
.footer-link:hover { color: var(--accent-cyan) !important; }
.social-icon:hover { color: var(--accent-cyan) !important; border-color: var(--accent-cyan) !important; transform: translateY(-2px); background: rgba(var(--cyan-rgb), 0.08); }
`;

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid rgba(var(--cyan-rgb), 0.08)",
        padding: "64px 32px 32px",
        marginTop: 80,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 48,
        }}
      >
        {/* Columna 1 — Logo y descripción */}
        <div>
          <IcemexLogo
            width={200}
            height={52}
            style={{
              objectFit: "contain",
              height: 52,
              width: "auto",
              marginBottom: 20,
              filter: "drop-shadow(0 0 14px rgba(var(--cyan-rgb), 0.18))",
            }}
          />
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 13,
              lineHeight: 1.7,
              maxWidth: 280,
            }}
          >
            Más de 20 años fabricando, distribuyendo y comercializando material
            eléctrico, herrajes, postería y luminarias LED en toda la República
            Mexicana.
          </p>
        </div>

        {/* Columna 2 — Navegación */}
        <div>
          <h4
            style={{
              color: "var(--text-primary)",
              fontSize: 12,
              letterSpacing: "0.22em",
              marginBottom: 18,
              fontWeight: 500,
            }}
          >
            Navegación
          </h4>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 13,
                    transition: "color 0.25s ease",
                  }}
                  className="footer-link"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 3 — Productos */}
        <div>
          <h4
            style={{
              color: "var(--text-primary)",
              fontSize: 12,
              letterSpacing: "0.22em",
              marginBottom: 18,
              fontWeight: 500,
            }}
          >
            Productos
          </h4>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              color: "var(--text-muted)",
              fontSize: 13,
            }}
          >
            {productLines.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>

        {/* Columna 4 — Contacto y redes sociales */}
        <div>
          <h4
            style={{
              color: "var(--text-primary)",
              fontSize: 12,
              letterSpacing: "0.22em",
              marginBottom: 18,
              fontWeight: 500,
            }}
          >
            Contacto
          </h4>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              color: "var(--text-muted)",
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            <li>Jorobas,Local 23D,Huhuetoca,México</li>
            <li>icemexjorobas@gmail.com</li>
            <li>593 916 3264</li>
          </ul>

          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="social-icon"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid rgba(var(--cyan-rgb), 0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  transition:
                    "color 0.25s ease, border-color 0.25s ease, transform 0.25s ease, background 0.25s ease",
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div
        style={{
          maxWidth: 1400,
          margin: "48px auto 0",
          paddingTop: 24,
          borderTop: "1px solid rgba(var(--cyan-rgb), 0.06)",
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p
          style={{
            color: "var(--accent-cyan)",
            fontSize: 12,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 300,
          }}
        >
          Iluminamos tus sueños · Materializamos tus ideas
        </p>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 11,
            letterSpacing: "0.05em",
          }}
        >
          © 2025 ICEMEX — Importaciones y Comercializaciones Eléctricas de
          México S.A. de C.V.
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </footer>
  );
}

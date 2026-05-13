import type { Metadata } from "next";
import Link from "next/link";
import IcemexLogo from "@/components/IcemexLogo";
import CertificationsBanner from "@/components/CertificationsBanner";

export const metadata: Metadata = {
  title: "Nosotros · ICEMEX — 20+ años iluminando México",
  description:
    "ICEMEX S.A. de C.V. — Empresa especializada en fabricación, distribución y comercialización de material eléctrico, herrajes y luminarias LED. Más de 20 años de experiencia.",
};

const milestones = [
  {
    year: "2004",
    title: "Fundación",
    description:
      "Nace ICEMEX como empresa especializada en fabricación, distribución y comercialización de material eléctrico y herrajes.",
  },
  {
    year: "2008",
    title: "Expansión nacional",
    description:
      "Ampliamos red de distribución directamente con fabricantes para garantizar los mejores precios del mercado.",
  },
  {
    year: "2014",
    title: "Tecnología LED",
    description:
      "Migración completa al portafolio LED con tecnología Philips FastFlex y drivers Xitanium.",
  },
  {
    year: "2018",
    title: "Línea solar",
    description:
      "Lanzamiento de la línea solar autónoma All in One con baterías de litio y controlador MPPT patentado.",
  },
  {
    year: "2022",
    title: "Certificaciones ISO",
    description:
      "Obtención de las certificaciones ISO 9001, 14001 y 45001 en gestión de calidad, ambiental y seguridad.",
  },
  {
    year: "2024",
    title: "NOM-013-ENER",
    description:
      "AD-50W primera luminaria solar para vialidades en obtener la certificación NOM-013-ENER-2013.",
  },
  {
    year: "2026",
    title: "Catálogo expandido",
    description:
      "176 páginas, 7 líneas de producto y presencia consolidada en proyectos de toda la República Mexicana.",
  },
];

const values = [
  {
    title: "Confiabilidad",
    description:
      "Más de dos décadas respaldando proyectos públicos, industriales y comerciales en todo México.",
  },
  {
    title: "Precio justo",
    description:
      "Distribución directa de fábrica para ofrecer los mejores precios del mercado sin sacrificar calidad.",
  },
  {
    title: "Ética y compromiso",
    description:
      "Cumplimos con normas nacionales e internacionales y respaldamos cada producto con garantías reales.",
  },
  {
    title: "Innovación",
    description:
      "Integramos las últimas tecnologías LED, controladores MPPT patentados y diseños certificados.",
  },
];

export default function NosotrosPage() {
  return (
    <div style={{ paddingTop: 140, minHeight: "100vh" }}>
      {/* Hero */}
      <header style={{ padding: "60px 32px 100px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p
            style={{
              color: "var(--accent-cyan)",
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Nosotros · Desde 2004
          </p>
          <h1
            style={{
              fontSize: "clamp(36px, 5.5vw, 76px)",
              color: "var(--text-primary)",
              fontWeight: 300,
              letterSpacing: "0.06em",
              lineHeight: 1.05,
              marginBottom: 32,
              textTransform: "uppercase",
              maxWidth: 900,
            }}
          >
            Más de
            <br />
            <span style={{ color: "var(--accent-cyan)" }}>20 años</span>{" "}
            iluminando
            <br />
            México
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 17,
              lineHeight: 1.8,
              maxWidth: 720,
            }}
          >
            ICEMEX S.A. de C.V. es una empresa mexicana especializada en la
            fabricación, distribución y comercialización de material eléctrico
            y herrajes. Nuestra trayectoria nos permite ofrecer confiabilidad,
            precio justo, ética, compromiso e innovación, respaldados por un
            grupo de especialistas que se preocupa por la salud y economía de
            nuestros clientes.
          </p>
        </div>
      </header>

      {/* Misión y visión */}
      <section
        style={{
          padding: "100px 32px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(var(--card-rgb), 0.6) 50%, transparent 100%)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: 48,
          }}
        >
          <div>
            <p
              style={{
                color: "var(--accent-cyan)",
                fontSize: 12,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Misión
            </p>
            <h2
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                color: "var(--text-primary)",
                fontWeight: 300,
                letterSpacing: "0.04em",
                lineHeight: 1.2,
                marginBottom: 20,
                textTransform: "none",
              }}
            >
              Innovar con lo último en tecnología eléctrica
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: 15,
                lineHeight: 1.8,
              }}
            >
              Ser una empresa que a través de nuestro modelo de negocios nos
              permita innovar con lo último en tecnología eléctrica y de
              construcción, aportando soluciones integrales que mejoren la
              calidad de vida y la eficiencia energética en cada proyecto.
            </p>
          </div>

          <div>
            <p
              style={{
                color: "var(--accent-cyan)",
                fontSize: 12,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Visión
            </p>
            <h2
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                color: "var(--text-primary)",
                fontWeight: 300,
                letterSpacing: "0.04em",
                lineHeight: 1.2,
                marginBottom: 20,
                textTransform: "none",
              }}
            >
              Iluminar el futuro de México
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: 15,
                lineHeight: 1.8,
              }}
            >
              Consolidarnos como referente nacional en iluminación pública,
              exterior e interior, con presencia en cada vialidad, parque,
              plaza y nave industrial del país. Iluminamos tus sueños,
              materializamos tus ideas.
            </p>
          </div>
        </div>
      </section>

      {/* Logo grande */}
      <section style={{ padding: "100px 32px", textAlign: "center" }}>
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            position: "relative",
            height: 200,
            filter: "drop-shadow(0 0 60px rgba(var(--cyan-rgb), 0.25))",
          }}
        >
          <IcemexLogo
            fill
            sizes="600px"
            style={{ objectFit: "contain" }}
          />
        </div>
        <p
          style={{
            marginTop: 32,
            color: "var(--accent-cyan)",
            fontSize: 12,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
          }}
        >
          Iluminamos tus sueños · Materializamos tus ideas
        </p>
      </section>

      {/* Trayectoria */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p
            style={{
              color: "var(--accent-cyan)",
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Trayectoria
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 52px)",
              color: "var(--text-primary)",
              fontWeight: 300,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              lineHeight: 1.1,
              marginBottom: 64,
            }}
          >
            Línea de tiempo
          </h2>

          <div
            style={{
              position: "relative",
              paddingLeft: 32,
              borderLeft: "1px solid rgba(var(--cyan-rgb), 0.18)",
            }}
          >
            {milestones.map((m) => (
              <div
                key={m.year}
                style={{
                  position: "relative",
                  paddingBottom: 48,
                  paddingLeft: 32,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: -7,
                    top: 8,
                    width: 13,
                    height: 13,
                    borderRadius: "50%",
                    background: "var(--accent-cyan)",
                    boxShadow: "0 0 16px var(--accent-cyan)",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    gap: 24,
                    flexWrap: "wrap",
                    alignItems: "baseline",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 28,
                      color: "var(--accent-cyan)",
                      letterSpacing: "0.08em",
                      fontWeight: 300,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {m.year}
                  </span>
                  <h3
                    style={{
                      fontSize: 18,
                      color: "var(--text-primary)",
                      fontWeight: 400,
                      letterSpacing: "0.02em",
                      textTransform: "none",
                    }}
                  >
                    {m.title}
                  </h3>
                </div>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 14,
                    lineHeight: 1.8,
                    maxWidth: 600,
                  }}
                >
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p
            style={{
              color: "var(--accent-cyan)",
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Valores
          </p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 52px)",
              color: "var(--text-primary)",
              fontWeight: 300,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              lineHeight: 1.1,
              marginBottom: 56,
            }}
          >
            Lo que nos define
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 1,
              background: "rgba(var(--cyan-rgb), 0.1)",
              border: "1px solid rgba(var(--cyan-rgb), 0.1)",
              borderRadius: 22,
              overflow: "hidden",
            }}
          >
            {values.map((v, i) => (
              <div
                key={v.title}
                style={{
                  background: "var(--bg-primary)",
                  padding: "44px 32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  0{i + 1}
                </span>
                <h3
                  style={{
                    fontSize: 22,
                    color: "var(--text-primary)",
                    fontWeight: 400,
                    letterSpacing: "0.04em",
                    textTransform: "none",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CertificationsBanner />

      {/* CTA final */}
      <section
        style={{
          padding: "100px 32px",
          textAlign: "center",
          borderTop: "1px solid rgba(var(--cyan-rgb), 0.08)",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            color: "var(--text-primary)",
            fontWeight: 300,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 32,
            lineHeight: 1.1,
          }}
        >
          ¿Listo para iluminar
          <br />
          <span style={{ color: "var(--accent-cyan)" }}>tu próximo proyecto</span>?
        </h2>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/#contacto"
            className="interactive"
            style={{
              padding: "18px 32px",
              background: "var(--accent-cyan)",
              color: "var(--bg-primary)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              borderRadius: 999,
            }}
          >
            Contáctanos
          </Link>
          <Link
            href="/catalogo"
            className="interactive"
            style={{
              padding: "18px 32px",
              background: "transparent",
              color: "var(--text-primary)",
              border: "1px solid rgba(var(--cyan-rgb), 0.22)",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
            }}
          >
            Ver catálogo →
          </Link>
        </div>
      </section>
    </div>
  );
}

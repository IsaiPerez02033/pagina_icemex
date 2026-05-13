import type { Metadata } from "next";
import Link from "next/link";
import { buildWhatsAppUrlProyectos } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Servicios · ICEMEX — Asesoría, levantamiento, instalación y mantenimiento",
  description:
    "Más allá del suministro: asesoría luminotécnica, levantamiento de obra, instalación con grúa HIAB y mantenimiento preventivo. Proveedor integral de iluminación pública para vialidades, parques e industria.",
};

const services = [
  {
    n: "01",
    title: "Asesoría técnica",
    tagline: "Antes de cotizar",
    description:
      "Dimensionamiento luminotécnico, cálculo de lux promedio, selección de la luminaria adecuada según norma NOM-013-ENER y aplicación específica (vialidad, parque, nave industrial). Te acompañamos desde la primera reunión.",
    deliverables: [
      "Estudio luminotécnico DIALux",
      "Recomendación de SKUs por proyecto",
      "Validación de cumplimiento normativo",
    ],
  },
  {
    n: "02",
    title: "Levantamiento de obra",
    tagline: "Visita en sitio",
    description:
      "Visita técnica al lugar del proyecto para medir distancias, evaluar postes existentes, alimentación eléctrica disponible y condiciones del terreno. Salimos con la información exacta para cotizar sin sorpresas.",
    deliverables: [
      "Inspección en campo",
      "Documentación fotográfica",
      "Plano de ubicación de luminarias",
    ],
  },
  {
    n: "03",
    title: "Suministro",
    tagline: "Distribución directa",
    description:
      "Importación y comercialización directa de fábrica. Materiales eléctricos, herrajes, postería cónica y recta, luminarias LED, sistemas solares y accesorios — más de 50 SKUs en stock o bajo pedido controlado.",
    deliverables: [
      "Distribución de Philips, Schneider, IUSA, Tecnolite",
      "Tiempos de entrega comprometidos",
      "Garantías por línea (3 a 10 años)",
    ],
  },
  {
    n: "04",
    title: "Instalación con HIAB",
    tagline: "Equipo propio",
    description:
      "Equipo de campo propio con grúa HIAB hidráulica, herramentario certificado y cuadrillas especializadas. Izaje de postes, montaje de brazos, cableado y puesta en servicio de luminarias — el proyecto llega encendido.",
    deliverables: [
      "Grúa HIAB para postes hasta 12 m",
      "Cuadrillas con certificación de altura",
      "Puesta en servicio y pruebas",
    ],
  },
  {
    n: "05",
    title: "Mantenimiento",
    tagline: "Post-venta",
    description:
      "Programa preventivo o correctivo: inspección periódica, reemplazo de drivers, balastros y luminarias, limpieza de difusores y reportes de estado del parque luminoso. Mantenemos tu inversión rindiendo años.",
    deliverables: [
      "Mantenimiento preventivo programado",
      "Atención correctiva 48h hábiles",
      "Reporte de estado del parque",
    ],
  },
];

const diferenciadores = [
  {
    n: "+20",
    label: "Años operando en México",
  },
  {
    n: "HIAB",
    label: "Equipo propio de izaje",
  },
  {
    n: "ISO",
    label: "9001 · 14001 · 45001",
  },
  {
    n: "NOM",
    label: "013-ENER-2013 certificada",
  },
];

export default function ServiciosPage() {
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
            Servicios · Proveedor integral
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
              maxWidth: 1000,
            }}
          >
            Más que un{" "}
            <span style={{ color: "var(--accent-cyan)" }}>proveedor</span>:
            <br />
            te llevamos la obra completa
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 17,
              lineHeight: 1.8,
              maxWidth: 720,
              marginBottom: 40,
            }}
          >
            Vendemos luminarias, postes y herrajes — pero también te asesoramos
            antes, levantamos la obra en sitio, instalamos con nuestra propia
            grúa HIAB y damos mantenimiento después. Un solo interlocutor para
            todo el ciclo.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href={buildWhatsAppUrlProyectos(
                "Hola, quiero asesoría técnica sobre los servicios de ICEMEX. Mi proyecto es:"
              )}
              target="_blank"
              rel="noopener noreferrer"
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
                display: "inline-block",
              }}
            >
              Solicitar asesoría gratis
            </a>
            <Link
              href="/#contacto"
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
                display: "inline-block",
              }}
            >
              Cotizar proyecto →
            </Link>
          </div>
        </div>
      </header>

      {/* Diferenciadores */}
      <section
        style={{
          padding: "0 32px 80px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 1,
            background: "rgba(var(--cyan-rgb), 0.1)",
            border: "1px solid rgba(var(--cyan-rgb), 0.1)",
            borderRadius: 22,
            overflow: "hidden",
          }}
        >
          {diferenciadores.map((d) => (
            <div
              key={d.label}
              style={{
                background: "var(--bg-primary)",
                padding: "44px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                minHeight: 160,
              }}
            >
              <span
                style={{
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  color: "var(--accent-cyan)",
                  fontWeight: 300,
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {d.n}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginTop: "auto",
                  lineHeight: 1.5,
                }}
              >
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios individuales */}
      <section style={{ padding: "60px 32px 100px" }}>
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
            Qué hacemos
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
              maxWidth: 720,
            }}
          >
            Cinco frentes,
            <br />
            <span style={{ color: "var(--accent-cyan)" }}>un mismo equipo</span>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 20,
            }}
          >
            {services.map((s) => (
              <article
                key={s.n}
                className="service-card"
                style={{
                  position: "relative",
                  padding: "36px 32px 32px",
                  background: "rgba(var(--card-rgb), 0.5)",
                  border: "1px solid rgba(var(--cyan-rgb), 0.12)",
                  borderRadius: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  transition:
                    "border-color 0.3s ease, transform 0.3s ease, background 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--accent-cyan)",
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      fontVariantNumeric: "tabular-nums",
                      fontWeight: 500,
                    }}
                  >
                    {s.n}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.tagline}
                  </span>
                </div>

                <h3
                  style={{
                    color: "var(--text-primary)",
                    fontSize: 24,
                    fontWeight: 400,
                    letterSpacing: "0.02em",
                    textTransform: "none",
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  {s.title}
                </h3>

                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: 14,
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {s.description}
                </p>

                <ul
                  style={{
                    listStyle: "none",
                    margin: "8px 0 0 0",
                    padding: "16px 0 0 0",
                    borderTop: "1px solid rgba(var(--cyan-rgb), 0.08)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  {s.deliverables.map((d) => (
                    <li
                      key={d}
                      style={{
                        fontSize: 13,
                        color: "var(--text-primary)",
                        letterSpacing: "0.02em",
                        lineHeight: 1.5,
                        display: "flex",
                        gap: 10,
                        alignItems: "baseline",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--accent-cyan)",
                          fontSize: 11,
                          flexShrink: 0,
                        }}
                      >
                        ▸
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo trabajamos — proceso */}
      <section
        style={{
          padding: "100px 32px",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(var(--card-rgb), 0.6) 50%, transparent 100%)",
        }}
      >
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
            Cómo trabajamos
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
            Del primer contacto a la
            <br />
            <span style={{ color: "var(--accent-cyan)" }}>obra encendida</span>
          </h2>

          <div
            style={{
              position: "relative",
              paddingLeft: 32,
              borderLeft: "1px solid rgba(var(--cyan-rgb), 0.18)",
            }}
          >
            {[
              {
                step: "01",
                title: "Contacto inicial",
                description:
                  "Nos cuentas el proyecto por WhatsApp, email o teléfono. En 24 horas hábiles asignamos un ingeniero de cuenta.",
              },
              {
                step: "02",
                title: "Diagnóstico técnico",
                description:
                  "Si el proyecto lo requiere, agendamos visita en sitio para levantamiento. Si es simple, lo resolvemos remoto con planos o coordenadas.",
              },
              {
                step: "03",
                title: "Propuesta",
                description:
                  "Cotización con SKUs específicos, plan de suministro, opción de instalación con HIAB y plan de mantenimiento si aplica.",
              },
              {
                step: "04",
                title: "Suministro e instalación",
                description:
                  "Coordinamos entrega en obra y movilizamos cuadrilla. Instalación con grúa HIAB, cableado, puesta en servicio y entrega del parque encendido.",
              },
              {
                step: "05",
                title: "Mantenimiento",
                description:
                  "Programa preventivo opcional con inspecciones periódicas, o correctivo bajo demanda con SLA de 48 horas hábiles.",
              },
            ].map((m) => (
              <div
                key={m.step}
                style={{
                  position: "relative",
                  paddingBottom: 40,
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
                    gap: 20,
                    flexWrap: "wrap",
                    alignItems: "baseline",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--accent-cyan)",
                      letterSpacing: "0.32em",
                      fontWeight: 500,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {m.step}
                  </span>
                  <h3
                    style={{
                      fontSize: 20,
                      color: "var(--text-primary)",
                      fontWeight: 400,
                      letterSpacing: "0.02em",
                      textTransform: "none",
                      margin: 0,
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
                    maxWidth: 640,
                    margin: 0,
                  }}
                >
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            marginBottom: 24,
            lineHeight: 1.1,
            maxWidth: 800,
            margin: "0 auto 24px",
          }}
        >
          ¿Tienes un proyecto
          <br />
          <span style={{ color: "var(--accent-cyan)" }}>en mente?</span>
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 15,
            lineHeight: 1.7,
            maxWidth: 520,
            margin: "0 auto 40px",
          }}
        >
          Cuéntanos qué necesitas. La primera asesoría técnica no tiene costo y
          la respondemos en menos de 24 horas hábiles.
        </p>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href={buildWhatsAppUrlProyectos(
              "Hola, vi su sección de servicios y quiero agendar una asesoría para mi proyecto."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive"
            style={{
              padding: "18px 32px",
              background: "#25D366",
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            Hablar por WhatsApp
          </a>
          <Link
            href="/#contacto"
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
            Llenar formulario →
          </Link>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildWhatsAppUrlProyectos } from "@/lib/whatsapp";

export default function ContactSection() {
  const ref = useRef<HTMLElement | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    email: "",
    tipo: "",
    mensaje: "",
  });

  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-content > *",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".contact-content",
            start: "top 85%",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contacto"
      ref={ref}
      style={{
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            "linear-gradient(rgba(var(--cyan-rgb),0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--cyan-rgb),0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 75%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 64,
          position: "relative",
        }}
        className="contact-content"
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
            05 — Contacto
          </p>
          <h2
            style={{
              fontSize: "clamp(32px, 4.5vw, 60px)",
              color: "var(--text-primary)",
              fontWeight: 300,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              lineHeight: 1.05,
              marginBottom: 32,
            }}
          >
            Cotiza
            <br />
            <span style={{ color: "var(--accent-cyan)" }}>tu proyecto</span>
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 15,
              lineHeight: 1.7,
              marginBottom: 24,
              maxWidth: 480,
            }}
          >
            Cuéntanos sobre tu proyecto de iluminación. Nuestro equipo técnico
            te acompañará desde el dimensionamiento luminotécnico hasta la
            entrega en obra.
          </p>

          <a
            href={buildWhatsAppUrlProyectos()}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 24px",
              background: "#25D366",
              color: "#FFFFFF",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: 32,
              borderRadius: 999,
              boxShadow: "0 8px 24px rgba(37, 211, 102, 0.3)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = "0 12px 32px rgba(37, 211, 102, 0.5)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "0 8px 24px rgba(37, 211, 102, 0.3)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chatear ahora por WhatsApp
          </a>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              fontSize: 14,
              color: "var(--text-muted)",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  color: "var(--accent-cyan)",
                  marginBottom: 6,
                  textTransform: "uppercase",
                }}
              >
                Email
              </p>
              <p style={{ color: "var(--text-primary)" }}>icemexjorobas@gmail.com</p>
            </div>
            <div>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  color: "var(--accent-cyan)",
                  marginBottom: 6,
                  textTransform: "uppercase",
                }}
              >
                Teléfono
              </p>
              <p style={{ color: "var(--text-primary)" }}>593 916 3264</p>
            </div>
            <div>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  color: "#25D366",
                  marginBottom: 6,
                  textTransform: "uppercase",
                }}
              >
                WhatsApp
              </p>
              <p style={{ color: "var(--text-primary)" }}>+52 55 6544 8428</p>
            </div>
            <div>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  color: "var(--accent-cyan)",
                  marginBottom: 6,
                  textTransform: "uppercase",
                }}
              >
                Oficina
              </p>
              <p style={{ color: "var(--text-primary)" }}>
                Jorobas,Local 23D, Huhuetoca, México
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const lines = [
              `*Nueva solicitud de cotización ICEMEX*`,
              ``,
              `*Nombre:* ${form.nombre || "—"}`,
              `*Empresa:* ${form.empresa || "—"}`,
              `*Email:* ${form.email || "—"}`,
              `*Tipo de proyecto:* ${form.tipo || "—"}`,
              ``,
              `*Mensaje:*`,
              form.mensaje || "—",
            ];
            const url = buildWhatsAppUrlProyectos(lines.join("\n"));
            window.open(url, "_blank", "noopener,noreferrer");
          }}
          className="contact-form"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            padding: "clamp(20px, 4vw, 36px)",
            background: "rgba(var(--card-rgb), 0.65)",
            border: "1px solid rgba(var(--cyan-rgb), 0.12)",
            borderRadius: 28,
            backdropFilter: "blur(8px)",
          }}
        >
          <Field
            label="Nombre"
            name="nombre"
            placeholder="Tu nombre completo"
            value={form.nombre}
            onChange={(v) => setForm({ ...form, nombre: v })}
          />
          <Field
            label="Empresa"
            name="empresa"
            placeholder="Razón social u organismo"
            value={form.empresa}
            onChange={(v) => setForm({ ...form, empresa: v })}
          />
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="contacto@empresa.mx"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
          <Field
            label="Tipo de proyecto"
            name="tipo"
            placeholder="Vialidad, plaza, parque industrial..."
            value={form.tipo}
            onChange={(v) => setForm({ ...form, tipo: v })}
          />
          <Field
            label="Mensaje"
            name="mensaje"
            placeholder="Cuéntanos los detalles del proyecto"
            multiline
            value={form.mensaje}
            onChange={(v) => setForm({ ...form, mensaje: v })}
          />
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              type="submit"
              className="interactive"
              style={{
                flex: 1,
                minWidth: 200,
                padding: "18px 24px",
                background: "#25D366",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                transition: "background 0.25s ease, transform 0.25s ease",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "#1FB955";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "#25D366";
                el.style.transform = "translateY(0)";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enviar por WhatsApp
            </button>
            <a
              href="mailto:icemexjorobas@gmail.com"
              className="interactive"
              style={{
                padding: "18px 24px",
                background: "transparent",
                color: "var(--text-primary)",
                border: "1px solid rgba(var(--cyan-rgb), 0.22)",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Email →
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  multiline,
  value,
  onChange,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  const baseStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(var(--cyan-rgb), 0.18)",
    padding: "10px 0",
    color: "var(--text-primary)",
    fontSize: 14,
    outline: "none",
    width: "100%",
  };
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.22em",
          color: "var(--text-muted)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      {multiline ? (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="interactive"
          style={{ ...baseStyle, resize: "vertical", fontFamily: "inherit" }}
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="interactive"
          style={baseStyle}
        />
      )}
    </label>
  );
}

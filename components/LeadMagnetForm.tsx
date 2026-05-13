"use client";

import { useState } from "react";
import { buildWhatsAppUrlProyectos } from "@/lib/whatsapp";

type Props = {
  /** Ruta absoluta del PDF dentro de /public (ej: "/catalogo-icemex-2026.pdf"). */
  pdfUrl: string;
  /** Nombre del archivo al descargar. */
  pdfFilename: string;
  /** Texto que aparece como eyebrow arriba del título del form. */
  eyebrow?: string;
  /** Título principal del form. */
  headline?: string;
  /** Texto del botón submit. */
  submitLabel?: string;
  /** Etiqueta corta del recurso para incluir en el mensaje a WhatsApp (ej: "Catálogo 2026"). */
  resourceLabel: string;
  /** Texto del título del estado de éxito. */
  successTitle?: string;
  /** Texto descriptivo del estado de éxito. */
  successMessage?: string;
};

type FormState = {
  email: string;
  nombre: string;
  organizacion: string;
  tipoProyecto: string;
};

const TIPOS_PROYECTO = [
  "",
  "Vialidad / avenida",
  "Parque o plaza pública",
  "Andador / ciclovía",
  "Nave industrial",
  "Estacionamiento",
  "Proyecto solar autónomo",
  "Mantenimiento de parque existente",
  "Otro / aún no defino",
];

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

export default function LeadMagnetForm({
  pdfUrl,
  pdfFilename,
  eyebrow = "Descarga gratuita",
  headline = "Recibe el archivo completo",
  submitLabel = "↓ Descargar",
  resourceLabel,
  successTitle = "¡Listo! El archivo se está descargando",
  successMessage = "Si la descarga no inició automáticamente, usa el botón de abajo. También abrimos WhatsApp para que nuestro equipo pueda contactarte — completa el envío si quieres asesoría personalizada.",
}: Props) {
  const [form, setForm] = useState<FormState>({
    email: "",
    nombre: "",
    organizacion: "",
    tipoProyecto: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(form.email)) {
      setError("Por favor escribe un email válido.");
      return;
    }

    // 1) Descarga inmediata del PDF
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = pdfFilename;
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 2) Construye mensaje a ICEMEX con los datos capturados y abre WhatsApp
    const lines = [
      `*Nueva descarga: ${resourceLabel}*`,
      "",
      `*Email:* ${form.email}`,
    ];
    if (form.nombre) lines.push(`*Nombre:* ${form.nombre}`);
    if (form.organizacion) lines.push(`*Organización:* ${form.organizacion}`);
    if (form.tipoProyecto) lines.push(`*Tipo de proyecto:* ${form.tipoProyecto}`);
    lines.push("");
    lines.push("Me gustaría que me contacten para platicar del proyecto.");

    const waUrl = buildWhatsAppUrlProyectos(lines.join("\n"));
    setTimeout(() => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }, 400);

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        style={{
          padding: "clamp(28px, 4vw, 40px)",
          background: "rgba(var(--card-rgb), 0.65)",
          border: "1px solid rgba(var(--cyan-rgb), 0.25)",
          borderRadius: 28,
          backdropFilter: "blur(8px)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(var(--cyan-rgb), 0.12)",
            border: "1px solid rgba(var(--cyan-rgb), 0.3)",
            marginBottom: 20,
            color: "var(--accent-cyan)",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3
          style={{
            fontSize: 24,
            color: "var(--text-primary)",
            fontWeight: 400,
            letterSpacing: "0.04em",
            textTransform: "none",
            marginBottom: 12,
            lineHeight: 1.2,
          }}
        >
          {successTitle}
        </h3>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 14,
            lineHeight: 1.7,
            marginBottom: 24,
            maxWidth: 460,
            margin: "0 auto 24px",
          }}
        >
          {successMessage}
        </p>
        <a
          href={pdfUrl}
          download={pdfFilename}
          className="interactive"
          style={{
            display: "inline-block",
            padding: "14px 28px",
            background: "var(--accent-cyan)",
            color: "var(--bg-primary)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          ↓ Descargar de nuevo
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="contact-form"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        padding: "clamp(24px, 4vw, 36px)",
        background: "rgba(var(--card-rgb), 0.65)",
        border: "1px solid rgba(var(--cyan-rgb), 0.18)",
        borderRadius: 28,
        backdropFilter: "blur(8px)",
      }}
    >
      <div>
        <p
          style={{
            fontSize: 11,
            color: "var(--accent-cyan)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {eyebrow}
        </p>
        <h3
          style={{
            fontSize: 22,
            color: "var(--text-primary)",
            fontWeight: 400,
            letterSpacing: "0.02em",
            textTransform: "none",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {headline}
        </h3>
      </div>

      <Field
        label="Email *"
        name="email"
        type="email"
        placeholder="tunombre@empresa.mx"
        required
        value={form.email}
        onChange={(v) => setForm({ ...form, email: v })}
      />

      <Field
        label="Nombre"
        name="nombre"
        placeholder="Tu nombre"
        value={form.nombre}
        onChange={(v) => setForm({ ...form, nombre: v })}
      />

      <Field
        label="Organización"
        name="organizacion"
        placeholder="Municipio, empresa o despacho"
        value={form.organizacion}
        onChange={(v) => setForm({ ...form, organizacion: v })}
      />

      <SelectField
        label="Tipo de proyecto (opcional)"
        name="tipoProyecto"
        value={form.tipoProyecto}
        options={TIPOS_PROYECTO}
        onChange={(v) => setForm({ ...form, tipoProyecto: v })}
      />

      {error && (
        <p
          style={{
            color: "var(--accent-red, #CC2020)",
            fontSize: 13,
            margin: 0,
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        className="interactive"
        style={{
          padding: "16px 24px",
          background: "var(--accent-cyan)",
          color: "var(--bg-primary)",
          border: "none",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          cursor: "pointer",
          marginTop: 4,
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform =
            "translateY(-2px)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 12px 28px rgba(var(--cyan-rgb), 0.35)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform =
            "translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        }}
      >
        {submitLabel}
      </button>

      <p
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          letterSpacing: "0.02em",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        Al descargar autorizas que ICEMEX te contacte por email o WhatsApp
        sobre temas relacionados con iluminación pública. No compartimos tus
        datos con terceros.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
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
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="interactive"
        style={{
          fontSize: 14,
          outline: "none",
          width: "100%",
        }}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
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
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="interactive"
        style={{
          fontSize: 14,
          outline: "none",
          width: "100%",
          background: "rgba(var(--text-rgb), 0.04)",
          border: "1px solid rgba(var(--cyan-rgb), 0.18)",
          borderRadius: "var(--radius-md)",
          padding: "14px 16px",
          color: "var(--text-primary)",
          appearance: "none",
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt || "Selecciona…"}
          </option>
        ))}
      </select>
    </label>
  );
}

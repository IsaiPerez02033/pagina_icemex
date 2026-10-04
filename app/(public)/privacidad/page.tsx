import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de ICEMEX S.A. de C.V.: datos de contacto, formularios, asistente virtual, WhatsApp y estadísticas del sitio.",
  alternates: { canonical: "https://icemex.mx/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <div style={{ paddingTop: 32, minHeight: "100vh", padding: "48px 24px 80px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p
          style={{
            color: "var(--accent-cyan)",
            fontSize: 12,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          Legal
        </p>
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            color: "var(--text-primary)",
            fontWeight: 300,
            letterSpacing: "0.04em",
            lineHeight: 1.15,
            marginBottom: 40,
            textTransform: "uppercase",
          }}
        >
          Política de privacidad
        </h1>

        <div style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.8 }}>
          <p style={{ marginBottom: 24 }}>
            ICEMEX S.A. de C.V. (&quot;ICEMEX&quot;) recopila y trata datos de contacto
            (nombre, teléfono, correo electrónico y contenido de mensajes) que
            nos proporcionan clientes, proveedores y colaboradores a través de
            nuestro sitio web, canales de venta y WhatsApp Business.
          </p>
          <p style={{ marginBottom: 24 }}>
            Utilizamos esta información únicamente para dar seguimiento a
            cotizaciones, pedidos, solicitudes de soporte y comunicación
            comercial relacionada con nuestros productos y servicios. No
            vendemos ni compartimos estos datos con terceros ajenos a la
            operación de ICEMEX.
          </p>
          <p style={{ marginBottom: 24 }}>
            Los mensajes enviados a través de nuestro número de WhatsApp
            Business son procesados mediante la API oficial de WhatsApp
            Business (Meta) y, en su caso, herramientas internas de
            automatización, con el único fin de responder solicitudes de
            cotización, estado de pedidos e información técnica de producto.
          </p>
          <p style={{ marginBottom: 24 }}>
            Cuando llenas un formulario del sitio (cotización o descarga del
            catálogo), guardamos los datos que escribes (nombre, empresa,
            correo, tipo de proyecto y mensaje) en nuestra base de datos para
            dar seguimiento a tu solicitud, además de abrir WhatsApp con el
            mensaje prellenado.
          </p>
          <p style={{ marginBottom: 24 }}>
            El asistente virtual del sitio (ICEMEXbot) envía los mensajes que
            escribes a un proveedor de inteligencia artificial (Groq) para
            generar la respuesta. No compartas en el chat datos sensibles como
            contraseñas, datos bancarios o identificaciones oficiales.
          </p>
          <p style={{ marginBottom: 24 }}>
            Para medir y mejorar el sitio usamos Vercel Analytics, Microsoft
            Clarity (que utiliza cookies y graba de forma anónima la navegación
            dentro del sitio) y estadísticas propias que guardan la página
            visitada, el país, el tipo de dispositivo y un identificador
            irreversible derivado de tu dirección IP; la IP no se almacena.
            Estas estadísticas se eliminan automáticamente a los 35 días.
          </p>
          <p style={{ marginBottom: 24 }}>
            Puedes solicitar la eliminación o corrección de tus datos en
            cualquier momento escribiéndonos a través de los canales de
            contacto publicados en{" "}
            <a
              href="/#contacto"
              style={{ color: "var(--accent-cyan)", textDecoration: "underline" }}
            >
              icemex.mx
            </a>
            .
          </p>
          <p>Última actualización: octubre de 2026.</p>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Cable, Smartphone } from "lucide-react";
import { buildWhatsAppUrlProyectos } from "@/lib/whatsapp";
export const metadata: Metadata = {
  title: "Venta e instalación de cámaras de seguridad",
  description:
    "Cámaras de seguridad CCTV e IP para casas, comercios y naves industriales. Cotiza suministro, instalación y configuración con ICEMEX.",
  alternates: { canonical: "https://icemex.mx/servicios/camaras-de-seguridad" },
};
const faqs = [
  [
    "¿Qué necesito para cotizar?",
    "Indícanos la ubicación, el tipo de inmueble, las áreas que quieres cubrir y si ya tienes cámaras o cableado. Con esa información revisamos el alcance de tu proyecto.",
  ],
  [
    "¿Puedo ver las cámaras desde mi celular?",
    "Podemos incluir configuración de acceso remoto con equipos compatibles. La disponibilidad depende del sistema elegido y de la conexión a internet del inmueble.",
  ],
  [
    "¿Cuántas cámaras necesito?",
    "Depende de los accesos, dimensiones y puntos que quieras observar. Te ayudamos a definir la cobertura antes de seleccionar los equipos.",
  ],
  [
    "¿Pueden revisar una instalación existente?",
    "Cuéntanos qué equipos tienes y qué necesitas mejorar. Revisamos compatibilidad y alcance para preparar una propuesta.",
  ],
];
export default function Cameras() {
  return (
    <article className="security-page">
      <header className="security-intro">
        <Link href="/servicios" className="eyebrow">
          Servicios / Videovigilancia
        </Link>
        <h1>
          Tu espacio.
          <br />
          <span>Siempre a la vista.</span>
        </h1>
        <p>
          Venta e instalación de cámaras de seguridad para hogares, comercios y
          espacios industriales. Del equipo adecuado a la configuración de tu
          sistema.
        </p>
        <a
          className="action-primary"
          href={buildWhatsAppUrlProyectos(
            "Hola ICEMEX, quiero cotizar cámaras de seguridad. Mi ubicación y tipo de inmueble son:",
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cotizar cámaras por WhatsApp ↗
        </a>
      </header>
      <section className="security-services" aria-label="Alcance del servicio">
        {[
          [
            Camera,
            "Equipos para tu espacio",
            "Selección y suministro de cámaras CCTV e IP, con opciones de grabación DVR/NVR según tu proyecto.",
          ],
          [
            Cable,
            "Instalación y conexión",
            "Montaje, cableado y puesta en servicio conforme al alcance de la cotización.",
          ],
          [
            Smartphone,
            "Acceso y configuración",
            "Configuración de visualización y acceso remoto en equipos compatibles.",
          ],
        ].map(([Icon, title, copy]) => {
          const I = Icon as typeof Camera;
          return (
            <div key={String(title)}>
              <I size={32} aria-hidden />
              <h2>{String(title)}</h2>
              <p>{String(copy)}</p>
            </div>
          );
        })}
      </section>
      <section className="security-process">
        <p className="eyebrow">Cómo empezamos</p>
        <h2>Una solución según lo que necesitas proteger.</h2>
        <ol>
          <li>
            <strong>Cuéntanos sobre tu espacio</strong>
            <p>Ubicación, accesos y áreas prioritarias.</p>
          </li>
          <li>
            <strong>Definimos el alcance</strong>
            <p>Equipos, instalación y configuración necesarios.</p>
          </li>
          <li>
            <strong>Recibe tu propuesta</strong>
            <p>Revisa los detalles antes de contratar.</p>
          </li>
        </ol>
      </section>
      <section className="security-faq">
        <h2>Antes de instalar</h2>
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <footer className="security-end">
        <h2>Hablemos de tu proyecto.</h2>
        <Link className="action-primary" href="/#contacto">
          Solicitar cotización ↗
        </Link>
      </footer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Venta e instalación de cámaras de seguridad",
            url: "https://icemex.mx/servicios/camaras-de-seguridad",
            provider: {
              "@type": "Organization",
              name: "ICEMEX",
              url: "https://icemex.mx",
            },
          }),
        }}
      />
    </article>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarClock,
  Cctv,
  ClipboardCheck,
  Construction,
  Factory,
  FileText,
  House,
  MessageCircle,
  Route,
  Search,
  ShieldCheck,
  Store,
  Trees,
  Truck,
  Wrench,
} from "lucide-react";
import { HiabTruck, LuxStudy, SurveyOverlay } from "@/components/ServiceArt";
import { getFicha } from "@/lib/fichas";
import { projects } from "@/lib/projects";
import { buildWhatsAppUrlProyectos } from "@/lib/whatsapp";

export const metadata: Metadata = {
  alternates: { canonical: "https://icemex.mx/servicios" },
  title: "Servicios",
  description:
    "Asesoría luminotécnica, levantamiento de obra, suministro directo de fábrica, instalación con grúa HIAB propia, mantenimiento preventivo/correctivo e instalación de cámaras de seguridad (CCTV / videovigilancia). Proveedor integral de iluminación y seguridad para vialidades, parques, naves industriales, comercios y residencias en México.",
  keywords: [
    "asesoría luminotécnica", "instalación de postes", "grúa HIAB", "mantenimiento de alumbrado", "suministro eléctrico", "levantamiento de obra", "iluminación México", "proveedor integral iluminación",
    "cámaras de seguridad", "instalación de cámaras", "venta de cámaras", "cámaras de vigilancia", "CCTV", "videovigilancia", "sistemas de seguridad", "cámaras IP", "seguridad",
  ],
  openGraph: {
    title: "Servicios · ICEMEX — Iluminación, instalación y cámaras de seguridad",
    description:
      "Más que un proveedor: asesoría luminotécnica, levantamiento en sitio, suministro, instalación con grúa HIAB propia, mantenimiento preventivo e instalación de cámaras de seguridad (CCTV). Todo el ciclo en un solo equipo.",
    images: [{ url: "/proyectos/vialidad-parque.jpg", width: 1280, height: 960 }],
  },
};

// Los logos traen mucho margen blanco: "cover" recorta ese margen y "contain"
// se usa en los que ocupan todo el lienzo.
const brands = [
  { src: "/marcas/philips.jpg", alt: "Philips", fit: "cover" },
  { src: "/marcas/schneider.jpg", alt: "Schneider Electric", fit: "cover" },
  { src: "/marcas/iusa.jpg", alt: "IUSA", fit: "contain" },
  { src: "/marcas/tecnolite.jpg", alt: "Tecnolite", fit: "contain" },
] as const;

function Photo({ src, alt, position = "50% 50%", sizes = "(max-width: 860px) 100vw, 560px", priority }: {
  src: string;
  alt: string;
  position?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: "cover", objectPosition: position }} />;
}

function CameraPanel() {
  const cams = ["CV-Q35", "CV-Q24", "CV-D21S"].map((c) => getFicha(c)!);
  return (
    <div className="svc-cams">
      <svg className="svc-cams-fov" viewBox="0 0 480 480" aria-hidden="true">
        <defs>
          <linearGradient id="fov" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#00d4ff" stopOpacity=".35" />
            <stop offset="1" stopColor="#00d4ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M240 220 L60 480 H420 Z" fill="url(#fov)" />
        <path d="M240 220 L60 480 M240 220 L420 480" stroke="#00d4ff" strokeOpacity=".5" strokeDasharray="6 8" />
      </svg>
      {cams.map((f, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={f.code} src={f.thumb.src} alt={f.name} className={`svc-cam svc-cam-${i}`} loading="lazy" />
      ))}
      <span className="svc-chip svc-chip-rec">
        <i /> REC · 24/7
      </span>
      <span className="svc-chip svc-chip-phone">Vista en vivo desde tu celular</span>
    </div>
  );
}

function MaintenanceCard() {
  return (
    <div className="svc-checklist">
      <p>Reporte de visita</p>
      <ul>
        {["Inspección del parque", "Drivers y conexiones", "Limpieza de difusores", "Reporte de estado"].map((t) => (
          <li key={t}>
            <BadgeCheck size={16} aria-hidden="true" /> {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

const services: {
  n: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  media: ReactNode;
  caption: string;
  extra?: ReactNode;
}[] = [
  {
    n: "01",
    title: "Asesoría técnica",
    tagline: "Antes de cotizar",
    description:
      "Dimensionamiento luminotécnico, cálculo de lux promedio, selección de la luminaria adecuada según norma NOM-013-ENER y aplicación específica (vialidad, parque, nave industrial). Te acompañamos desde la primera reunión.",
    deliverables: ["Estudio luminotécnico DIALux", "Recomendación de SKUs por proyecto", "Validación de cumplimiento normativo"],
    media: <LuxStudy />,
    caption: "Ilustrativo: así se ve un mapa de iluminancia de una vialidad.",
  },
  {
    n: "02",
    title: "Levantamiento de obra",
    tagline: "Visita en sitio",
    description:
      "Visita técnica al lugar del proyecto para medir distancias, evaluar postes existentes, alimentación eléctrica disponible y condiciones del terreno. Salimos con la información exacta para cotizar sin sorpresas.",
    deliverables: ["Inspección en campo", "Documentación fotográfica", "Plano de ubicación de luminarias"],
    media: (
      <>
        <Photo src="/proyectos/andador-gam.jpg" alt="Andador con postes de alumbrado en la alcaldía Gustavo A. Madero" position="50% 30%" />
        <SurveyOverlay />
      </>
    ),
    caption: "Andador GAM, Gustavo A. Madero, CDMX.",
  },
  {
    n: "03",
    title: "Suministro",
    tagline: "Distribución directa",
    description:
      "Importación y comercialización directa de fábrica. Materiales eléctricos, herrajes, postería cónica y recta, luminarias LED, sistemas solares y accesorios — más de 50 SKUs en stock o bajo pedido controlado.",
    deliverables: ["Distribución de Philips, Schneider, IUSA, Tecnolite", "Tiempos de entrega comprometidos", "Garantías por línea (3 a 10 años)"],
    media: <Photo src="/proyectos/postes-torre.jpg" alt="Bolardos triangulares LED en el taller ICEMEX, listos para entrega" position="50% 40%" />,
    caption: "Bolardos triangulares en taller ICEMEX, antes de su entrega.",
    extra: (
      <div className="svc-brands" aria-label="Marcas que distribuimos">
        {brands.map((b) => (
          <span key={b.alt}>
            <Image src={b.src} alt={b.alt} fill sizes="140px" style={{ objectFit: b.fit }} />
          </span>
        ))}
      </div>
    ),
  },
  {
    n: "04",
    title: "Instalación con HIAB",
    tagline: "Equipo propio",
    description:
      "Equipo de campo propio con grúa HIAB hidráulica, herramentario certificado y cuadrillas especializadas. Izaje de postes, montaje de brazos, cableado y puesta en servicio de luminarias — el proyecto llega encendido.",
    deliverables: ["Grúa HIAB para postes hasta 12 m", "Cuadrillas con certificación de altura", "Puesta en servicio y pruebas"],
    media: <HiabTruck />,
    caption: "Del camión al poste encendido, con la misma cuadrilla.",
  },
  {
    n: "05",
    title: "Mantenimiento",
    tagline: "Post-venta",
    description:
      "Programa preventivo o correctivo: inspección periódica, reemplazo de drivers, balastros y luminarias, limpieza de difusores y reportes de estado del parque luminoso. Mantenemos tu inversión rindiendo años.",
    deliverables: ["Mantenimiento preventivo programado", "Atención correctiva 48h hábiles", "Reporte de estado del parque"],
    media: (
      <>
        <Photo src="/proyectos/fonatur.jpg" alt="Poste torre FONATUR encendido de noche" position="50% 18%" />
        <MaintenanceCard />
      </>
    ),
    caption: "Corredor FONATUR.",
  },
  {
    n: "06",
    title: "Cámaras de seguridad",
    tagline: "CCTV y videovigilancia",
    description:
      "Venta e instalación de sistemas de videovigilancia CCTV e IP: cámaras, DVR/NVR, cableado estructurado y configuración de acceso remoto desde tu celular. Protege vialidades, obras, naves industriales, comercios y residencias con la misma cuadrilla que instala tu iluminación.",
    deliverables: ["Suministro de cámaras HD/IP, DVR y NVR", "Instalación, cableado y acceso remoto (app móvil)", "Mantenimiento y soporte del sistema"],
    media: <CameraPanel />,
    caption: "Cámaras PTZ, duales y solares de nuestro catálogo.",
    extra: (
      <Link href="/servicios/camaras-de-seguridad" className="svc-link interactive">
        Ver cámaras y modelos <ArrowRight size={16} aria-hidden="true" />
      </Link>
    ),
  },
];

const diferenciadores = [
  { n: "+20", label: "Años operando en México", icon: CalendarClock },
  { n: "HIAB", label: "Equipo propio de izaje", icon: Truck },
  { n: "ISO", label: "9001 · 14001 · 45001", icon: ShieldCheck },
  { n: "NOM", label: "013-ENER-2013 certificada", icon: BadgeCheck },
];

const sectores = [
  { label: "Vialidades", icon: Route },
  { label: "Parques y andadores", icon: Trees },
  { label: "Naves industriales", icon: Factory },
  { label: "Comercios", icon: Store },
  { label: "Residencias", icon: House },
  { label: "Gobierno y municipios", icon: Building2 },
  { label: "Obras y fraccionamientos", icon: Construction },
];

const pasos = [
  {
    title: "Contacto inicial",
    icon: MessageCircle,
    description: "Nos cuentas el proyecto por WhatsApp, email o teléfono. En 24 horas hábiles asignamos un ingeniero de cuenta.",
  },
  {
    title: "Diagnóstico técnico",
    icon: Search,
    description: "Si el proyecto lo requiere, agendamos visita en sitio para levantamiento. Si es simple, lo resolvemos remoto con planos o coordenadas.",
  },
  {
    title: "Propuesta",
    icon: FileText,
    description: "Cotización con SKUs específicos, plan de suministro, opción de instalación con HIAB y plan de mantenimiento si aplica.",
  },
  {
    title: "Suministro e instalación",
    icon: Truck,
    description: "Coordinamos entrega en obra y movilizamos cuadrilla. Instalación con grúa HIAB, cableado, puesta en servicio y entrega del parque encendido.",
  },
  {
    title: "Mantenimiento",
    icon: Wrench,
    description: "Programa preventivo opcional con inspecciones periódicas, o correctivo bajo demanda con SLA de 48 horas hábiles.",
  },
];

const obras = ["corredor-solar", "acolman", "vialidad-nocturna"].map((slug) => projects.find((p) => p.image.includes(slug))!);

export default function ServiciosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "https://icemex.mx" },
              { "@type": "ListItem", position: 2, name: "Servicios" },
            ],
          }),
        }}
      />
      <div className="svc-page">
        {/* Hero */}
        <header className="svc-hero">
          <div className="svc-hero-copy">
            <p className="svc-eyebrow">Servicios · Proveedor integral</p>
            <h1>
              Más que un <span>proveedor</span>:
              <br />
              te llevamos la obra completa
            </h1>
            <p className="svc-lead">
              Vendemos luminarias, postes y herrajes — pero también te asesoramos antes, levantamos la obra en sitio,
              instalamos con nuestra propia grúa HIAB, damos mantenimiento después e instalamos tus cámaras de
              seguridad. Un solo interlocutor para todo el ciclo.
            </p>
            <div className="svc-actions">
              <a
                href={buildWhatsAppUrlProyectos("Hola, quiero asesoría técnica sobre los servicios de ICEMEX. Mi proyecto es:")}
                target="_blank"
                rel="noopener noreferrer"
                className="svc-btn svc-btn-primary interactive"
              >
                Solicitar asesoría gratis
              </a>
              <Link href="/#contacto" className="svc-btn svc-btn-ghost interactive">
                Cotizar proyecto →
              </Link>
            </div>
          </div>

          <div className="svc-mosaic">
            <figure className="svc-mosaic-a">
              <Photo src="/proyectos/vialidad-parque.jpg" alt="Vialidad interna de ASA Aeropuerto iluminada de noche con postes y bolardos LED" sizes="(max-width: 860px) 60vw, 340px" priority />
            </figure>
            <figure className="svc-mosaic-b">
              <Photo src="/proyectos/solar-rural.jpg" alt="Luminaria solar autónoma instalada en zona suburbana" position="50% 20%" sizes="(max-width: 860px) 40vw, 240px" />
            </figure>
            <figure className="svc-mosaic-c">
              <Photo src="/proyectos/vialidad-nocturna.jpg" alt="Avenida con postes torre LED encendidos" sizes="(max-width: 860px) 40vw, 240px" />
            </figure>
            <span className="svc-chip svc-mosaic-chip">
              <i /> Obras entregadas encendidas
            </span>
          </div>
        </header>

        {/* Diferenciadores */}
        <section className="svc-section">
          <div className="svc-stats">
            {diferenciadores.map(({ n, label, icon: Icon }) => (
              <div key={label}>
                <Icon size={22} aria-hidden="true" />
                <strong>{n}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Servicios individuales */}
        <section className="svc-section">
          <p className="svc-eyebrow">Qué hacemos</p>
          <h2 className="svc-h2">
            Seis frentes,
            <br />
            <span>un mismo equipo</span>
          </h2>
          <nav className="svc-index" aria-label="Servicios">
            {services.map((s) => (
              <a key={s.n} href={`#servicio-${s.n}`}>
                <b>{s.n}</b> {s.title}
              </a>
            ))}
          </nav>

          <div className="svc-rows">
            {services.map((s) => (
              <article key={s.n} id={`servicio-${s.n}`} className="svc-row">
                <figure className="svc-media">
                  {s.media}
                  <span className="svc-num" aria-hidden="true">
                    {s.n}
                  </span>
                  <figcaption>{s.caption}</figcaption>
                </figure>
                <div className="svc-body">
                  <p className="svc-tag">
                    <b>{s.n}</b> {s.tagline}
                  </p>
                  <h3>{s.title}</h3>
                  <p className="svc-desc">{s.description}</p>
                  <ul>
                    {s.deliverables.map((d) => (
                      <li key={d}>
                        <ClipboardCheck size={16} aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  {s.extra}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Sectores */}
        <section className="svc-section">
          <p className="svc-eyebrow">Dónde trabajamos</p>
          <h2 className="svc-h2">
            Para cada tipo de <span>espacio</span>
          </h2>
          <ul className="svc-sectors">
            {sectores.map(({ label, icon: Icon }) => (
              <li key={label}>
                <span>
                  <Icon size={26} aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
            <li>
              <span>
                <Cctv size={26} aria-hidden="true" />
              </span>
              Seguridad y videovigilancia
            </li>
          </ul>
        </section>

        {/* Cómo trabajamos — proceso */}
        <section className="svc-section svc-process-wrap">
          <p className="svc-eyebrow">Cómo trabajamos</p>
          <h2 className="svc-h2">
            Del primer contacto a la
            <br />
            <span>obra encendida</span>
          </h2>
          <ol className="svc-process">
            {pasos.map(({ title, icon: Icon, description }, i) => (
              <li key={title}>
                <span className="svc-step-icon">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <b>{String(i + 1).padStart(2, "0")}</b>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Obras */}
        <section className="svc-section">
          <div className="svc-works-head">
            <div>
              <p className="svc-eyebrow">Obras realizadas</p>
              <h2 className="svc-h2">
                Resultados que <span>se ven de noche</span>
              </h2>
            </div>
            <Link href="/#proyectos" className="svc-link interactive">
              Ver todos los proyectos <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="svc-works">
            {obras.map((p) => (
              <Link key={p.slug} href="/#proyectos" className="svc-work">
                <Photo src={p.image} alt={p.title} sizes="(max-width: 860px) 100vw, 400px" />
                <span>
                  <small>
                    {p.category} · {p.year}
                  </small>
                  {p.title}
                  <em>{p.location}</em>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="svc-cta">
          <Photo src="/proyectos/vialidad-parque.jpg" alt="" sizes="100vw" />
          <div>
            <h2>
              ¿Tienes un proyecto
              <br />
              <span>en mente?</span>
            </h2>
            <p>
              Cuéntanos qué necesitas. La primera asesoría técnica no tiene costo y la respondemos en menos de 24 horas
              hábiles.
            </p>
            <div className="svc-actions">
              <a
                href={buildWhatsAppUrlProyectos("Hola, vi su sección de servicios y quiero agendar una asesoría para mi proyecto.")}
                target="_blank"
                rel="noopener noreferrer"
                className="svc-btn svc-btn-wa interactive"
              >
                Hablar por WhatsApp
              </a>
              <Link href="/#contacto" className="svc-btn svc-btn-ghost interactive">
                Llenar formulario →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

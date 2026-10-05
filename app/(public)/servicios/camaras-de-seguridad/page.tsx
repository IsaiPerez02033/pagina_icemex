import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Camera,
  Cctv,
  ClipboardCheck,
  Download,
  FileText,
  House,
  Layers,
  Lightbulb,
  type LucideIcon,
  MemoryStick,
  MessageCircle,
  Mic,
  MoonStar,
  Move,
  Plus,
  Smartphone,
  Sun,
  Video,
} from "lucide-react";
import { CoveragePlan } from "@/components/ServiceArt";
import { buildWhatsAppUrlProyectos } from "@/lib/whatsapp";
import { cameraCatalog, fichas, getFicha } from "@/lib/fichas";

const cameras = fichas.filter((f) => f.line === "CV");
// Categorías en el orden del catálogo de videovigilancia.
const groups = [...new Set(cameras.map((f) => f.group ?? "Cámaras"))];

export const metadata: Metadata = {
  title: "Venta e instalación de cámaras de seguridad",
  description: `Cámaras de seguridad Wi-Fi para casa, comercio y exterior: ${cameras.length} modelos duales, PTZ, foco cámara y solares con vista desde el celular. Cotiza suministro, instalación y configuración con ICEMEX.`,
  keywords: [
    "cámaras de seguridad", "venta de cámaras de seguridad", "instalación de cámaras", "cámaras wifi",
    "cámara PTZ", "foco cámara", "cámara solar", "cámara doble lente", "cámaras para exterior",
    "cámaras para casa", "CCTV", "videovigilancia",
  ],
  alternates: { canonical: "https://icemex.mx/servicios/camaras-de-seguridad" },
  openGraph: {
    images: [{ url: cameraCatalog.cover.src, width: cameraCatalog.cover.width, height: cameraCatalog.cover.height }],
  },
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

const groupInfo: Record<string, { icon: LucideIcon; text: string }> = {
  "Cámaras duales": { icon: Layers, text: "Dos lentes en un solo equipo: vista amplia y acercamiento al mismo tiempo." },
  "Cámaras para exterior": { icon: Cctv, text: "Para fachadas, patios y estacionamientos: con giro PTZ, tipo bala o con reflectores." },
  "Cámaras para interior": { icon: House, text: "Compactas para casa, oficina o local." },
  "Focos cámara": { icon: Lightbulb, text: "Se enroscan en un portalámparas, como un foco." },
  "Cámaras solares": { icon: Sun, text: "Panel solar y batería, para accesos, obras o terrenos sin corriente cerca." },
};

// Mayor resolución por lente (los modelos duales dicen "2 + 2 MP").
const maxMp = Math.max(...cameras.map((f) => Number(/(\d+)\s*MP/.exec(f.variant)?.[1] ?? 0)));
const ptz = cameras.filter((f) => f.variant.includes("PTZ")).length;

const stats = [
  { n: String(cameras.length), label: "Modelos de cámara" },
  { n: String(groups.length), label: "Categorías" },
  { n: String(ptz), label: "Con giro PTZ" },
  { n: `${maxMp} MP`, label: "Resolución máxima" },
];

const features = [
  { icon: Smartphone, label: "Vista desde el celular" },
  { icon: Mic, label: "Audio bidireccional" },
  { icon: MoonStar, label: "Visión nocturna" },
  { icon: MemoryStick, label: "Grabación en MicroSD" },
];

// Vistas de ejemplo para el monitor (fotos de obras ICEMEX).
const feeds = [
  { src: "/proyectos/vialidad-parque.jpg", cam: "CAM 01", place: "Acceso vehicular" },
  { src: "/proyectos/vialidad-nocturna.jpg", cam: "CAM 02", place: "Calle", ir: true },
  { src: "/proyectos/corredor-solar.jpg", cam: "CAM 03", place: "Estacionamiento", ir: true },
  { src: "/proyectos/andador-gam.jpg", cam: "CAM 04", place: "Andador" },
];

const thumb = (code: string) => getFicha(code)!.thumb.src;

function Feed({ src, cam, place, ir, sizes }: { src: string; cam: string; place: string; ir?: boolean; sizes: string }) {
  return (
    <div className={`cam-feed${ir ? " is-ir" : ""}`}>
      <Image src={src} alt="" fill sizes={sizes} style={{ objectFit: "cover" }} />
      <span className="cam-feed-top">
        <b>{cam}</b> {place}
      </span>
      <span className="cam-feed-rec">
        <i /> {ir ? "IR" : "EN VIVO"}
      </span>
    </div>
  );
}

function Monitor() {
  return (
    <div className="cam-monitor">
      <div className="cam-monitor-screen">
        {feeds.map((f) => (
          <Feed key={f.cam} {...f} sizes="(max-width: 860px) 50vw, 280px" />
        ))}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={thumb("CV-Q35")} alt="Cámara PTZ Q35 con reflectores LED" className="cam-monitor-cam" />
      <span className="svc-chip cam-monitor-chip">
        <i /> 4 cámaras en línea
      </span>
    </div>
  );
}

function Lineup() {
  const codes = ["CV-Q19", "CV-C07", "CV-Q29", "CV-Q32", "CV-D21S"];
  return (
    <div className="cam-lineup">
      {codes.map((c) => {
        const f = getFicha(c)!;
        return (
          <figure key={c}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.thumb.src} alt={f.name} loading="lazy" />
            <figcaption>{f.group?.replace("Cámaras ", "").replace("para ", "")}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}

function PhoneApp() {
  return (
    <div className="cam-phone-stage">
      <div className="cam-phone">
        <div className="cam-phone-notch" />
        <p className="cam-phone-title">
          Cochera <span>● En vivo</span>
        </p>
        <Feed src="/proyectos/vialidad-parque.jpg" cam="CAM 01" place="" sizes="240px" />
        <div className="cam-phone-pad" aria-hidden="true">
          <span className="up" />
          <span className="right" />
          <span className="down" />
          <span className="left" />
          <Move size={20} />
        </div>
        <div className="cam-phone-actions">
          <span>
            <Mic size={18} aria-hidden="true" /> Hablar
          </span>
          <span>
            <Camera size={18} aria-hidden="true" /> Foto
          </span>
          <span>
            <Video size={18} aria-hidden="true" /> Grabar
          </span>
        </div>
      </div>
    </div>
  );
}

const scope: { n: string; tag: string; title: string; copy: string; points: string[]; media: ReactNode; caption: string }[] = [
  {
    n: "01",
    tag: "Suministro",
    title: "Equipos para tu espacio",
    copy: "Selección y suministro de cámaras CCTV e IP, con opciones de grabación DVR/NVR según tu proyecto.",
    points: ["Duales, PTZ, bala, foco cámara y solares", "Interior y exterior", "Ficha técnica de cada modelo"],
    media: <Lineup />,
    caption: "Algunos modelos de nuestro catálogo de videovigilancia.",
  },
  {
    n: "02",
    tag: "Instalación",
    title: "Instalación y conexión",
    copy: "Montaje, cableado y puesta en servicio conforme al alcance de la cotización.",
    points: ["Ubicación de cada cámara según lo que quieres cubrir", "Montaje y conexión", "Pruebas de imagen y señal"],
    media: <CoveragePlan />,
    caption: "Ilustrativo: así planeamos la cobertura de un inmueble.",
  },
  {
    n: "03",
    tag: "Configuración",
    title: "Acceso y configuración",
    copy: "Configuración de visualización y acceso remoto en equipos compatibles.",
    points: ["App en tu celular", "Giro de cámaras PTZ y audio", "Alertas y grabación"],
    media: <PhoneApp />,
    caption: "Ilustrativo: vista en vivo desde la app.",
  },
];

const steps = [
  { icon: MessageCircle, title: "Cuéntanos sobre tu espacio", copy: "Ubicación, accesos y áreas prioritarias." },
  { icon: ClipboardCheck, title: "Definimos el alcance", copy: "Equipos, instalación y configuración necesarios." },
  { icon: FileText, title: "Recibe tu propuesta", copy: "Revisa los detalles antes de contratar." },
];

export default function Cameras() {
  return (
    <div className="svc-page cam-page">
      {/* Hero */}
      <header className="svc-hero">
        <div className="svc-hero-copy">
          <Link href="/servicios" className="svc-eyebrow">
            Servicios / Videovigilancia
          </Link>
          <h1>
            Tu espacio.
            <br />
            <span>Siempre a la vista.</span>
          </h1>
          <p className="svc-lead">
            Venta e instalación de cámaras de seguridad para hogares, comercios y espacios industriales. Del equipo
            adecuado a la configuración de tu sistema.
          </p>
          <div className="svc-actions">
            <a
              className="svc-btn svc-btn-primary interactive"
              href={buildWhatsAppUrlProyectos(
                "Hola ICEMEX, quiero cotizar cámaras de seguridad. Mi ubicación y tipo de inmueble son:",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cotizar por WhatsApp ↗
            </a>
            <a className="svc-btn svc-btn-ghost interactive" href="#modelos">
              Ver modelos ↓
            </a>
          </div>
        </div>
        <Monitor />
      </header>

      {/* Cifras y lo que incluyen */}
      <section className="svc-section">
        <div className="svc-stats">
          {stats.map((s) => (
            <div key={s.label}>
              <strong>{s.n}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <ul className="cam-features" aria-label="Todas las cámaras incluyen">
          {features.map(({ icon: Icon, label }) => (
            <li key={label}>
              <Icon size={22} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </section>

      {/* Alcance del servicio */}
      <section className="svc-section" aria-label="Alcance del servicio">
        <p className="svc-eyebrow">Qué incluye</p>
        <h2 className="svc-h2">
          Del equipo a la <span>vista en tu celular</span>
        </h2>
        <div className="svc-rows">
          {scope.map(({ n, tag, title, copy, points, media, caption }) => (
            <article key={n} className="svc-row">
              <figure className="svc-media">
                {media}
                <span className="svc-num" aria-hidden="true">
                  {n}
                </span>
                <figcaption>{caption}</figcaption>
              </figure>
              <div className="svc-body">
                <p className="svc-tag">
                  <b>{n}</b> {tag}
                </p>
                <h3>{title}</h3>
                <p className="svc-desc">{copy}</p>
                <ul>
                  {points.map((p) => (
                    <li key={p}>
                      <ClipboardCheck size={16} aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Catálogo */}
      <section className="svc-section security-catalog" id="modelos" aria-labelledby="security-catalog-title">
        <div className="svc-works-head">
          <div>
            <p className="svc-eyebrow">Catálogo de videovigilancia 2026</p>
            <h2 id="security-catalog-title" className="svc-h2">
              {cameras.length} cámaras para <span>cada espacio</span>
            </h2>
          </div>
          <Link className="svc-link interactive" href="/catalogo#camaras">
            <Download size={16} aria-hidden="true" /> Catálogo PDF ({cameraCatalog.pages} págs.)
          </Link>
        </div>
        <p className="security-catalog-lead">
          Todas con vista remota desde el celular, audio bidireccional, visión nocturna y grabación en MicroSD. Cada una
          con su ficha técnica.
        </p>
        <nav className="svc-index cam-groups-nav" aria-label="Categorías">
          {groups.map((g) => {
            const Icon = groupInfo[g]?.icon ?? Cctv;
            return (
              <a key={g} href={`#${slug(g)}`}>
                <Icon size={15} aria-hidden="true" /> {g}
              </a>
            );
          })}
        </nav>
        {groups.map((g) => {
          const list = cameras.filter((f) => (f.group ?? "Cámaras") === g);
          const info = groupInfo[g];
          const Icon = info?.icon ?? Cctv;
          return (
            <div key={g} id={slug(g)} className="security-group">
              <div className="cam-group-head">
                <span>
                  <Icon size={24} aria-hidden="true" />
                </span>
                <div>
                  <h3>
                    {g} <small>{list.length}</small>
                  </h3>
                  {info && <p>{info.text}</p>}
                </div>
              </div>
              <ul>
                {list.map((f) => (
                  <li key={f.code}>
                    <Link href={`/producto/${f.code}`} prefetch={false}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- miniatura webp ya optimizada */}
                      <img
                        src={f.thumb.src}
                        width={f.thumb.width}
                        height={f.thumb.height}
                        alt={`${f.name}, ${f.kind.toLowerCase()}`}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="eyebrow">{f.code}</span>
                      <strong>{f.name}</strong>
                      <span>{f.variant}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        <div className="security-catalog-cta">
          <Link className="svc-btn svc-btn-primary interactive" href="/catalogo#camaras">
            ↓ Descargar catálogo de cámaras ({cameraCatalog.pages} págs.)
          </Link>
          <Link className="svc-btn svc-btn-ghost interactive" href="/productos?linea=CV">
            Ver en el explorador →
          </Link>
        </div>
      </section>

      {/* Proceso */}
      <section className="svc-section">
        <p className="svc-eyebrow">Cómo empezamos</p>
        <h2 className="svc-h2">
          Una solución según lo que <span>necesitas proteger</span>
        </h2>
        <ol className="svc-process cam-process">
          {steps.map(({ icon: Icon, title, copy }, i) => (
            <li key={title}>
              <span className="svc-step-icon">
                <Icon size={24} aria-hidden="true" />
              </span>
              <b>{String(i + 1).padStart(2, "0")}</b>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Preguntas */}
      <section className="svc-section cam-faq">
        <p className="svc-eyebrow">Preguntas frecuentes</p>
        <h2 className="svc-h2">
          Antes de <span>instalar</span>
        </h2>
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <Plus size={20} aria-hidden="true" />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>

      {/* CTA */}
      <section className="svc-cta">
        <Image src="/proyectos/vialidad-nocturna.jpg" alt="" fill sizes="100vw" style={{ objectFit: "cover" }} />
        <div>
          <h2>
            Hablemos de
            <br />
            <span>tu proyecto</span>
          </h2>
          <p>Cuéntanos qué quieres proteger y te proponemos los equipos, la instalación y la configuración.</p>
          <div className="svc-actions">
            <a
              className="svc-btn svc-btn-wa interactive"
              href={buildWhatsAppUrlProyectos("Hola ICEMEX, quiero cotizar cámaras de seguridad. Mi ubicación y tipo de inmueble son:")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cotizar por WhatsApp
            </a>
            <Link className="svc-btn svc-btn-ghost interactive" href="/#contacto">
              Solicitar cotización →
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Venta e instalación de cámaras de seguridad",
            url: "https://icemex.mx/servicios/camaras-de-seguridad",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Cámaras de seguridad",
              itemListElement: cameras.map((f) => ({
                "@type": "Offer",
                itemOffered: {
                  "@type": "Product",
                  name: f.name,
                  sku: f.code,
                  url: `https://icemex.mx/producto/${f.code}`,
                  image: `https://icemex.mx${f.image.src}`,
                },
              })),
            },
            provider: {
              "@type": "Organization",
              name: "ICEMEX",
              url: "https://icemex.mx",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(([q, a]) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />
    </div>
  );
}

function slug(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

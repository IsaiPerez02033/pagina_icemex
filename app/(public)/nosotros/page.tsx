import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Eye,
  HandCoins,
  Lightbulb,
  type LucideIcon,
  Map as MapIcon,
  Scale,
  ShieldCheck,
  Target,
} from "lucide-react";
import BrandsSection from "@/components/BrandsSection";
import CertificationsBanner from "@/components/CertificationsBanner";
import IcemexLogo from "@/components/IcemexLogo";
import { catalog, fichas, getFicha, lineShowcase } from "@/lib/fichas";
import { lineNames } from "@/lib/products";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  alternates: { canonical: "https://icemex.mx/nosotros" },
  title: "Nosotros",
  description:
    "ICEMEX S.A. de C.V. — Empresa mexicana con más de 20 años fabricando y distribuyendo luminarias LED, postes, herrajes y material eléctrico. Historia, misión, visión, valores y certificaciones ISO 9001, 14001, 45001, NOM-013-ENER.",
  keywords: [
    "ICEMEX historia", "empresa de iluminación México", "fabricante de postes", "certificaciones ISO", "NOM-013-ENER", "material eléctrico México",
  ],
  openGraph: {
    title: "Nosotros · ICEMEX — 20+ años iluminando México",
    description:
      "Más de 20 años fabricando, distribuyendo y comercializando material eléctrico, herrajes y luminarias LED en México. Certificados ISO 9001, 14001, 45001.",
    images: [{ url: "/proyectos/andador-gam.jpg", width: 960, height: 1280 }],
  },
};

const lines = lineShowcase();
const productLines = lines.filter((l) => l.line !== "CV").length;

type Milestone = {
  year: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  image?: { src: string; alt: string; cover?: boolean };
};

const productImage = (code: string) => {
  const f = getFicha(code)!;
  return { src: f.thumb.src, alt: f.name };
};

const milestones: Milestone[] = [
  {
    year: "2004",
    title: "Fundación",
    description:
      "Nace ICEMEX como empresa especializada en fabricación, distribución y comercialización de material eléctrico y herrajes.",
    icon: Building2,
  },
  {
    year: "2008",
    title: "Expansión nacional",
    description:
      "Ampliamos red de distribución directamente con fabricantes para garantizar los mejores precios del mercado.",
    icon: MapIcon,
  },
  {
    year: "2014",
    title: "Tecnología LED",
    description: "Migración completa al portafolio LED con tecnología Philips FastFlex y drivers Xitanium.",
    image: productImage("AL-LC1001"),
  },
  {
    year: "2018",
    title: "Línea solar",
    description:
      "Lanzamiento de la línea solar autónoma All in One con baterías de litio y controlador MPPT patentado.",
    image: productImage("IS-LS1003"),
  },
  {
    year: "2022",
    title: "Certificaciones ISO",
    description:
      "Obtención de las certificaciones ISO 9001, 14001 y 45001 en gestión de calidad, ambiental y seguridad.",
    icon: ShieldCheck,
  },
  {
    year: "2024",
    title: "NOM-013-ENER",
    description:
      "AD-50W primera luminaria solar para vialidades en obtener la certificación NOM-013-ENER-2013.",
    image: productImage("IS-AO1030"),
  },
  {
    year: "2026",
    title: "Catálogo expandido",
    description: `Catálogo de ${catalog.pages} páginas con ${productLines} líneas de producto, nueva línea de cámaras de seguridad y presencia consolidada en proyectos de toda la República Mexicana.`,
    image: { src: catalog.cover.src, alt: "Portada del Catálogo ICEMEX 2026", cover: true },
  },
];

const values = [
  {
    title: "Confiabilidad",
    icon: ShieldCheck,
    description: "Más de dos décadas respaldando proyectos públicos, industriales y comerciales en todo México.",
  },
  {
    title: "Precio justo",
    icon: HandCoins,
    description: "Distribución directa de fábrica para ofrecer los mejores precios del mercado sin sacrificar calidad.",
  },
  {
    title: "Ética y compromiso",
    icon: Scale,
    description: "Cumplimos con normas nacionales e internacionales y respaldamos cada producto con garantías reales.",
  },
  {
    title: "Innovación",
    icon: Lightbulb,
    description: "Integramos las últimas tecnologías LED, controladores MPPT patentados y diseños certificados.",
  },
];

const stats = [
  { value: new Date().getFullYear() - 2004, prefix: "+", label: "Años en el mercado" },
  { value: fichas.length, label: "Productos con ficha técnica" },
  { value: lines.length, label: "Líneas de producto" },
  { value: catalog.pages, label: "Páginas de catálogo" },
];

const taller = ["postes-torre", "kia", "acolman"].map((slug) => projects.find((p) => p.image.includes(slug))!);

function Photo({ src, alt, position = "50% 50%", sizes, priority }: {
  src: string;
  alt: string;
  position?: string;
  sizes: string;
  priority?: boolean;
}) {
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: "cover", objectPosition: position }} />;
}

export default function NosotrosPage() {
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
              { "@type": "ListItem", position: 2, name: "Nosotros" },
            ],
          }),
        }}
      />
      <div className="svc-page">
        {/* Hero */}
        <header className="svc-hero">
          <div className="svc-hero-copy">
            <p className="svc-eyebrow">Nosotros · Desde 2004</p>
            <h1>
              Más de <span>20 años</span>
              <br />
              iluminando México
            </h1>
            <p className="svc-lead">
              ICEMEX S.A. de C.V. es una empresa mexicana especializada en la fabricación, distribución y
              comercialización de material eléctrico y herrajes. Nuestra trayectoria nos permite ofrecer confiabilidad,
              precio justo, ética, compromiso e innovación, respaldados por un grupo de especialistas que se preocupa por
              la salud y economía de nuestros clientes.
            </p>
            <div className="svc-actions">
              <Link href="/#contacto" className="svc-btn svc-btn-primary interactive">
                Contáctanos
              </Link>
              <Link href="/catalogo" className="svc-btn svc-btn-ghost interactive">
                Ver catálogo →
              </Link>
            </div>
          </div>

          <div className="svc-mosaic">
            <figure className="svc-mosaic-a">
              <Photo src="/proyectos/andador-gam.jpg" alt="Andador GAM iluminado con postes ICEMEX" position="50% 30%" sizes="(max-width: 860px) 60vw, 340px" priority />
            </figure>
            <figure className="svc-mosaic-b">
              <Photo src="/proyectos/fonatur.jpg" alt="Poste torre FONATUR encendido" position="50% 15%" sizes="(max-width: 860px) 40vw, 240px" />
            </figure>
            <figure className="svc-mosaic-c">
              <Photo src="/proyectos/corredor-solar.jpg" alt="Corredor solar carretero en Hidalgo" sizes="(max-width: 860px) 40vw, 240px" />
            </figure>
            <span className="svc-chip svc-mosaic-chip">
              <i /> Empresa 100% mexicana
            </span>
          </div>
        </header>

        {/* Cifras */}
        <section className="svc-section">
          <div className="svc-stats ab-stats">
            {stats.map((s) => (
              <div key={s.label}>
                <strong>
                  {s.prefix}
                  {s.value}
                </strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Misión y visión */}
        <section className="svc-section ab-mv">
          <article>
            <Photo src="/proyectos/vialidad-nocturna.jpg" alt="" sizes="(max-width: 860px) 100vw, 600px" />
            <div>
              <span className="ab-mv-icon">
                <Target size={26} aria-hidden="true" />
              </span>
              <p className="svc-eyebrow">Misión</p>
              <h2>Innovar con lo último en tecnología eléctrica</h2>
              <p>
                Ser una empresa que a través de nuestro modelo de negocios nos permita innovar con lo último en
                tecnología eléctrica y de construcción, aportando soluciones integrales que mejoren la calidad de vida y
                la eficiencia energética en cada proyecto.
              </p>
            </div>
          </article>
          <article>
            <Photo src="/proyectos/vialidad-parque.jpg" alt="" sizes="(max-width: 860px) 100vw, 600px" />
            <div>
              <span className="ab-mv-icon">
                <Eye size={26} aria-hidden="true" />
              </span>
              <p className="svc-eyebrow">Visión</p>
              <h2>Iluminar el futuro de México</h2>
              <p>
                Consolidarnos como referente nacional en iluminación pública, exterior e interior, con presencia en cada
                vialidad, parque, plaza y nave industrial del país. Iluminamos tus sueños, materializamos tus ideas.
              </p>
            </div>
          </article>
        </section>

        {/* Logo */}
        <section className="svc-section ab-logo">
          <div className="ab-logo-mark">
            <svg viewBox="0 0 400 400" aria-hidden="true">
              <circle cx="200" cy="200" r="190" />
              <circle cx="200" cy="200" r="150" />
              <circle cx="200" cy="200" r="110" />
            </svg>
            <div>
              <IcemexLogo fill sizes="420px" style={{ objectFit: "contain" }} />
            </div>
          </div>
          <p>Iluminamos tus sueños · Materializamos tus ideas</p>
        </section>

        {/* Líneas */}
        <section className="svc-section">
          <div className="svc-works-head">
            <div>
              <p className="svc-eyebrow">Lo que hacemos</p>
              <h2 className="svc-h2">
                {lines.length} líneas, <span>un solo proveedor</span>
              </h2>
            </div>
            <Link href="/productos" className="svc-link interactive">
              Ver todos los productos <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="ab-lines">
            {lines.map((l) => (
              <Link key={l.line} href={`/productos?linea=${l.line}`} className="ab-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.thumb.src} alt={lineNames[l.line]} loading="lazy" className={l.line === "CV" ? "on-dark" : undefined} />
                <strong>{lineNames[l.line]}</strong>
                <span>{l.count} productos</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Trayectoria */}
        <section className="svc-section">
          <p className="svc-eyebrow">Trayectoria</p>
          <h2 className="svc-h2">
            Línea de <span>tiempo</span>
          </h2>
          <ol className="ab-timeline">
            {milestones.map((m) => {
              const Icon = m.icon;
              return (
                <li key={m.year}>
                  <span className="ab-dot" aria-hidden="true" />
                  <article>
                    {m.image ? (
                      <div className={`ab-ms-media${m.image.cover ? " is-cover" : ""}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.image.src} alt={m.image.alt} loading="lazy" />
                      </div>
                    ) : (
                      Icon && (
                        <div className="ab-ms-media is-icon">
                          <Icon size={44} strokeWidth={1.4} aria-hidden="true" />
                        </div>
                      )
                    )}
                    <div>
                      <b>{m.year}</b>
                      <h3>{m.title}</h3>
                      <p>{m.description}</p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Valores */}
        <section className="svc-section">
          <p className="svc-eyebrow">Valores</p>
          <h2 className="svc-h2">
            Lo que nos <span>define</span>
          </h2>
          <div className="ab-values">
            {values.map(({ title, icon: Icon, description }, i) => (
              <div key={title}>
                <span className="ab-value-icon">
                  <Icon size={26} aria-hidden="true" />
                </span>
                <small>0{i + 1}</small>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Taller */}
        <section className="svc-section">
          <div className="svc-works-head">
            <div>
              <p className="svc-eyebrow">Fabricación propia</p>
              <h2 className="svc-h2">
                Del taller <span>a la obra</span>
              </h2>
            </div>
            <Link href="/#proyectos" className="svc-link interactive">
              Ver proyectos <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="svc-works">
            {taller.map((p) => (
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
      </div>

      <BrandsSection />
      <CertificationsBanner maxWidth={1200} />

      <div className="svc-page">
        <section className="svc-cta">
          <Photo src="/proyectos/corredor-solar.jpg" alt="" sizes="100vw" />
          <div>
            <h2>
              ¿Listo para iluminar
              <br />
              <span>tu próximo proyecto?</span>
            </h2>
            <p>Cuéntanos qué necesitas y te ayudamos a elegir la solución adecuada, del producto a la instalación.</p>
            <div className="svc-actions">
              <Link href="/#contacto" className="svc-btn svc-btn-primary interactive">
                Contáctanos
              </Link>
              <Link href="/catalogo" className="svc-btn svc-btn-ghost interactive">
                Ver catálogo →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

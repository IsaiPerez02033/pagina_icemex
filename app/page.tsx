import dynamic from "next/dynamic";
import type { Metadata } from "next";
import HeroSection from "@/components/HeroSection";

export const metadata: Metadata = {
  title: "ICEMEX — Iluminación pública, postes y luminarias LED en México",
  description:
    "Fabricante y distribuidor de alumbrado público, postes cónicos y rectos, luminarias LED, iluminación solar, reflectores, herrajes y material eléctrico. Cotiza tu proyecto de vialidad, parque o nave industrial. +20 años en México.",
  keywords: [
    "ICEMEX",
    "iluminación pública",
    "postes metálicos",
    "luminarias LED",
    "alumbrado público México",
    "fabricante de postes",
    "cotizar iluminación",
    "proyectos de alumbrado",
    "iluminación solar México",
    "reflectores LED industriales",
  ],
  openGraph: { title: "ICEMEX — Iluminación pública, postes y material eléctrico" },
};

const AboutSection = dynamic(() => import("@/components/AboutSection"));
const BrandsSection = dynamic(() => import("@/components/BrandsSection"));
const ProductsSection = dynamic(() => import("@/components/ProductsSection"));
const ServicesTeaser = dynamic(() => import("@/components/ServicesTeaser"));
const ProjectsCollage = dynamic(() => import("@/components/ProjectsCollage"));
const CertificationsBanner = dynamic(
  () => import("@/components/CertificationsBanner")
);
const ContactSection = dynamic(() => import("@/components/ContactSection"));

export default function HomePage() {
  return (
    <>
      <h1
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        ICEMEX — Iluminación pública, postes y luminarias LED en México
      </h1>
      <div
        id="hero-scroll"
        style={{
          position: "relative",
          height: "300dvh",
          width: "100%",
        }}
      >
        <section
          id="inicio"
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            height: "100dvh",
            overflow: "hidden",
          }}
        >
          <HeroSection />
        </section>
      </div>

      <div style={{ position: "relative", background: "var(--bg-primary)" }}>
        <AboutSection />
        <BrandsSection />
        <ProductsSection />
        <ServicesTeaser />
        <ProjectsCollage />
        <CertificationsBanner />
        <ContactSection />
      </div>
    </>
  );
}

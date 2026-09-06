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
    "cámaras de seguridad",
    "instalación de cámaras",
    "venta de cámaras",
    "CCTV",
    "videovigilancia",
    "seguridad",
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
      <HeroSection />

      <div style={{ position: "relative", background: "var(--bg-primary)" }}>

        <BrandsSection />
        <ProductsSection />
        <AboutSection />
        <ServicesTeaser />
        <ProjectsCollage />
        <CertificationsBanner />
        <ContactSection />
      </div>
    </>
  );
}

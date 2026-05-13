import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";

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

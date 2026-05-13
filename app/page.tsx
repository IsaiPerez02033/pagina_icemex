import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import BrandsSection from "@/components/BrandsSection";
import ProductsSection from "@/components/ProductsSection";
import ServicesTeaser from "@/components/ServicesTeaser";
import ProjectsCollage from "@/components/ProjectsCollage";
import CertificationsBanner from "@/components/CertificationsBanner";
import ContactSection from "@/components/ContactSection";

export default function HomePage() {
  return (
    <>
      {/*
        Contenedor scrubeable del hero:
        - Altura total 400vh (100vh visible + 300vh de "scroll para animar")
        - El section sticky de 100vh queda pinneado mientras el usuario scrollea
          dentro del contenedor → ScrollTrigger lo usa como trigger
      */}
      <div
        id="hero-scroll"
        style={{
          position: "relative",
          height: "300vh",
          width: "100%",
        }}
      >
        <section
          id="inicio"
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <HeroSection />
        </section>
      </div>

      {/* Las secciones de contenido vienen DESPUÉS del scroll del hero */}
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

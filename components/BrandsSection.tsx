"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Marcas distribuidas por ICEMEX — agregar/quitar editando este array.
const brands = [
  { src: "/marcas/adir.jpg", alt: "Adir" },
  { src: "/marcas/argos.jpg", alt: "Argos" },
  { src: "/marcas/condulac.jpg", alt: "Condulac" },
  { src: "/marcas/iusa.jpg", alt: "IUSA" },
  { src: "/marcas/philco.jpg", alt: "Philco" },
  { src: "/marcas/philips.jpg", alt: "Philips" },
  { src: "/marcas/poliflex.jpg", alt: "Poliflex" },
  { src: "/marcas/schneider.jpg", alt: "Schneider Electric" },
  { src: "/marcas/tecnolite.jpg", alt: "Tecnolite" },
  { src: "/marcas/tork.jpg", alt: "Tork" },
];

const doubledBrands = [...brands, ...brands];

export default function BrandsSection() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".brands-title-wrap > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".brands-title-wrap",
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".brands-marquee",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".brands-marquee",
            start: "top 90%",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="brands-section">
      <div className="brands-inner">
        <div className="brands-title-wrap">
          <p className="brands-eyebrow">Alianzas</p>
          <h2 className="brands-title">
            Marcas que <span>distribuimos</span>
          </h2>
          <p className="brands-text">
            Trabajamos directamente con fabricantes líderes del sector
            eléctrico y de iluminación para garantizar los mejores precios sin
            sacrificar calidad.
          </p>
        </div>

        <div className="brands-marquee" aria-label="Marcas distribuidas por ICEMEX">
          {/* Duplicamos la lista para que el loop sea sin saltos */}
          <div className="brands-track">
            {doubledBrands.map((b, i) => (
              <div key={`${b.src}-${i}`} className="brand-logo">
                <Image
                  src={b.src}
                  alt={b.alt}
                  fill
                  sizes="(max-width: 720px) 130px, 180px"
                  style={{ objectFit: "contain" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

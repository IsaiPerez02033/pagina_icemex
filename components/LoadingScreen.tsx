"use client";

import IcemexLogo from "@/components/IcemexLogo";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LoadingScreen() {
  const [mounted, setMounted] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !logoRef.current || !barRef.current) return;

    // Bloquear scroll mientras carga
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
      },
    });

    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
    )
      .fromTo(
        barRef.current,
        { width: "0%" },
        { width: "100%", duration: 1.6, ease: "power2.inOut" },
        "-=0.2"
      )
      .to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            setMounted(false);
            // Refrescar ScrollTrigger una vez que el loader desmonta
            // para que recalcule las medidas finales del layout
            requestAnimationFrame(() => {
              try {
                ScrollTrigger.refresh();
              } catch {}
            });
          },
        },
        "+=0.15"
      );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg-primary)",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      <div
        ref={logoRef}
        style={{
          position: "relative",
          width: "min(420px, 75vw)",
          height: "clamp(80px, 22vw, 140px)",
          filter: "drop-shadow(0 0 36px rgba(var(--cyan-rgb), 0.35))",
        }}
      >
        <IcemexLogo
          fill
          sizes="(max-width: 768px) 70vw, 420px"
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      <div
        style={{
          width: "min(360px, 60vw)",
          height: 2,
          background: "rgba(var(--cyan-rgb), 0.12)",
          overflow: "hidden",
          borderRadius: 1,
        }}
      >
        <div
          ref={barRef}
          style={{
            width: "0%",
            height: "100%",
            background: "var(--accent-cyan)",
            boxShadow: "0 0 12px var(--accent-cyan)",
          }}
        />
      </div>

      <div
        style={{
          color: "var(--text-muted)",
          fontSize: 11,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
        }}
      >
        Iluminando · Cargando · Energizando
      </div>
    </div>
  );
}

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
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const dismiss = () => {
    const container = containerRef.current;
    if (!container) return;
    tlRef.current?.kill();
    document.body.style.overflow = "";
    const finalize = () => {
      setMounted(false);
      try {
        ScrollTrigger.refresh();
      } catch {}
    };
    // Fallback duro: si el rAF/gsap está pausado (p. ej. pestaña en segundo
    // plano) la animación no completa; garantizamos el desmontaje igualmente.
    const hard = setTimeout(finalize, 450);
    gsap.to(container, {
      opacity: 0,
      duration: 0.35,
      ease: "power2.inOut",
      onComplete: () => {
        clearTimeout(hard);
        finalize();
      },
    });
  };

  useEffect(() => {
    if (!containerRef.current || !logoRef.current || !barRef.current) return;

    document.body.style.overflow = "hidden";

    // Tiempo mínimo de marca (para que no "parpadee") y tope máximo.
    const MIN_MS = 450;
    const MAX_MS = 1200;
    const start = performance.now();

    // Animación de entrada + barra corta. La barra se completa rápido; el
    // cierre real depende de que la página esté lista (window load) o del tope.
    const tl = gsap.timeline();
    tlRef.current = tl;

    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.94 },
      { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
    ).fromTo(
      barRef.current,
      { width: "0%" },
      { width: "100%", duration: 0.6, ease: "power2.inOut" },
      "-=0.15"
    );

    let closeTimer: ReturnType<typeof setTimeout>;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_MS - elapsed);
      closeTimer = setTimeout(dismiss, wait);
    };

    // Cerrar en cuanto la ventana termine de cargar (o si ya cargó), con tope.
    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }
    const capTimer = setTimeout(finish, MAX_MS);

    return () => {
      tl.kill();
      clearTimeout(closeTimer);
      clearTimeout(capTimer);
      window.removeEventListener("load", finish);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      onClick={dismiss}
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
        cursor: "pointer",
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
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: 10,
          letterSpacing: "0.12em",
          opacity: 0.5,
          marginTop: 24,
        }}
      >
        Click para saltar
      </p>
    </div>
  );
}

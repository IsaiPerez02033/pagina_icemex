"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import HeroStatic from "@/components/HeroStatic";

// La escena 3D (Three.js ~900KB) SOLO se importa cuando el equipo es capaz.
// Como el default es el hero estático, en gama baja / sin WebGL este chunk
// NUNCA se descarga ni se parsea.
const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
  loading: () => <HeroStatic />,
});

/**
 * Decide si el dispositivo puede correr la escena 3D con fluidez.
 * Conservador: solo descarta equipos con señales claras de gama baja, ahorro
 * de datos, movimiento reducido o sin WebGL. Cuando una señal no existe
 * (p. ej. deviceMemory en Safari) se asume capaz para no penalizar iPhones.
 */
function canRender3D(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }

    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    };

    // Ahorro de datos o red muy lenta (2G): fallback estático.
    if (nav.connection?.saveData) return false;
    const eff = nav.connection?.effectiveType || "";
    if (eff === "slow-2g" || eff === "2g") return false;

    // Memoria del dispositivo (si el navegador la expone).
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) {
      return false;
    }

    // Núcleos de CPU (si se exponen).
    if (
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency < 4
    ) {
      return false;
    }

    // Soporte real de WebGL.
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!gl) return false;
    (gl as WebGLRenderingContext)
      .getExtension("WEBGL_lose_context")
      ?.loseContext();
  } catch {
    return false;
  }

  return true;
}

export default function HeroSection() {
  // Arranca en estático en TODOS lados → pintado inmediato, sin Three.js.
  // Tras montar, los equipos capaces suben a la escena 3D.
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    if (canRender3D()) setUse3D(true);
  }, []);

  if (use3D) {
    return (
      <div id="hero-scroll" className="hero-scroll-container">
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
          <HeroScene />
        </section>
      </div>
    );
  }

  return <HeroStatic id="inicio" />;
}

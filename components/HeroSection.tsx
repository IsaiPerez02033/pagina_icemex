"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
    // ?hero=static fuerza el fallback (para revisar el hero de gama baja).
    if (new URLSearchParams(window.location.search).get("hero") === "static") {
      return false;
    }
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

    // Memoria del dispositivo (si el navegador la expone). Con 4 GB o más
    // (gama media-alta) el ensamble 3D corre fluido; iPhone no la expone →
    // se asume capaz.
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

    // Soporte real de WebGL. WebGL2 preferido, pero con fallback a WebGL1:
    // algunos navegadores (p. ej. Brave con fingerprint protection, o equipos
    // con aceleración por hardware limitada) no exponen WebGL2 pero sí WebGL1,
    // y react-three-fiber renderiza igual sobre WebGL1.
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
  // Al montar, los equipos capaces suben de inmediato a la escena 3D.
  const [use3D, setUse3D] = useState(false);
  const scrollAtSwap = useRef<{ y: number; staticHeight: number } | null>(null);

  useEffect(() => {
    if (!canRender3D()) return;
    const hero = document.getElementById("inicio");
    scrollAtSwap.current = {
      y: window.scrollY,
      staticHeight: hero?.offsetHeight ?? window.innerHeight,
    };
    setUse3D(true);
  }, []);

  // El 3D alarga el hero (scroll de ensamble). Si el visitante ya estaba más
  // abajo del hero (p. ej. recargó a media página), se compensa el scroll
  // para que el contenido que estaba viendo no se mueva.
  useLayoutEffect(() => {
    const prev = scrollAtSwap.current;
    if (!use3D || !prev || prev.y < prev.staticHeight) return;
    const container = document.getElementById("hero-scroll");
    if (container) window.scrollBy(0, container.offsetHeight - prev.staticHeight);
  }, [use3D]);

  if (use3D) {
    return (
      <div id="hero-scroll" className="hero-scroll-container">
        <section
          id="inicio"
          style={{
            position: "sticky",
            top: 0,
            width: "100%",
            height: "100svh",
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

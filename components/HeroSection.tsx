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

    // Ahorro de datos o red lenta (2G/3G): fallback estático.
    if (nav.connection?.saveData) return false;
    const eff = nav.connection?.effectiveType || "";
    if (eff === "slow-2g" || eff === "2g" || eff === "3g") return false;

    // Celulares: 3D solo en gama alta. Chrome redondea deviceMemory a
    // 0.5/1/2/4/8, así que > 4 significa 8 GB o más. Un Android de gama
    // media (4 GB) se queda con el hero estático, que es idéntico salvo la
    // ilustración. iPhone no expone deviceMemory → se asume capaz.
    const isPhone = window.matchMedia("(pointer: coarse) and (max-width: 900px)").matches;
    const minMemory = isPhone ? 8 : 4;
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory < minMemory) {
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

/** Ejecuta fn cuando la página terminó de cargar y el hilo principal está libre. */
function whenIdleAfterLoad(fn: () => void): () => void {
  let cancelled = false;
  let idleId = 0;
  const w = window as Window & {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  const run = () => {
    if (cancelled) return;
    if (w.requestIdleCallback) idleId = w.requestIdleCallback(fn, { timeout: 1500 });
    else idleId = window.setTimeout(fn, 300);
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", run);
    if (w.cancelIdleCallback) w.cancelIdleCallback(idleId);
    else clearTimeout(idleId);
  };
}

export default function HeroSection() {
  // Arranca en estático en TODOS lados → pintado inmediato, sin Three.js.
  // Tras cargar la página, los equipos capaces suben a la escena 3D.
  const [use3D, setUse3D] = useState(false);

  useEffect(() => {
    return whenIdleAfterLoad(() => {
      // El 3D alarga el hero (scroll de ensamble). Si el visitante ya bajó,
      // cambiarlo ahora le movería la página: se queda en estático.
      if (window.scrollY > 40) return;
      if (canRender3D()) setUse3D(true);
    });
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

"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
let warningsSilenced = false;

// Filtra warnings deprecados de Three.js (vienen del interior de
// @react-three/fiber y no podemos arreglarlos hasta que actualicen la lib)
const NOISY_WARNINGS = [
  "THREE.Clock",
  "PCFSoftShadowMap",
  "THREE.WebGLShadowMap: PCFSoftShadowMap",
];

function silenceNoisyWarnings() {
  if (warningsSilenced || typeof window === "undefined") return;
  warningsSilenced = true;
  const original = console.warn;
  console.warn = (...args: unknown[]) => {
    const first = args[0];
    if (
      typeof first === "string" &&
      NOISY_WARNINGS.some((m) => first.includes(m))
    ) {
      return;
    }
    original.apply(console, args as Parameters<typeof console.warn>);
  };
}

export default function GSAPProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    silenceNoisyWarnings();
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
    };
  }, []);

  return <>{children}</>;
}

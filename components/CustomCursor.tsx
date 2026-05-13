"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  // Por defecto NO mostrar nada hasta verificar que es desktop con mouse
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Solo activar en dispositivos con hover real (desktop)
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateEnabled = () => setEnabled(mq.matches);
    updateEnabled();
    mq.addEventListener("change", updateEnabled);

    return () => {
      mq.removeEventListener("change", updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.12, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.12, ease: "power3.out" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    const handleMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const handleEnter = () => {
      gsap.to(ring, { scale: 1.7, opacity: 1, duration: 0.25, ease: "power3.out" });
      gsap.to(cursor, { scale: 0.5, duration: 0.25, ease: "power3.out" });
    };

    const handleLeave = () => {
      gsap.to(ring, { scale: 1, opacity: 0.45, duration: 0.25, ease: "power3.out" });
      gsap.to(cursor, { scale: 1, duration: 0.25, ease: "power3.out" });
    };

    window.addEventListener("mousemove", handleMove);

    const sel = "a, button, input, textarea, select, [role=button], .interactive";
    const els = document.querySelectorAll<HTMLElement>(sel);
    els.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, [enabled]);

  // En touch: no renderizamos NADA
  if (!enabled) return null;

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "var(--accent-cyan)",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "screen",
          boxShadow: "0 0 12px var(--accent-cyan)",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid var(--accent-cyan)",
          opacity: 0.45,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />
    </>
  );
}

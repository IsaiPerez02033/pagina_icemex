"use client";

import React, { useState, useRef } from "react";
import { MoveHorizontal, Zap, ShieldCheck } from "lucide-react";

export default function ComparisonSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section className="relative py-20 px-4 md:px-8 max-w-[1400px] mx-auto select-none">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--accent-cyan)] mb-3 font-semibold">
          Tecnología & Impacto
        </p>
        <h2 className="text-3xl md:text-5xl font-light tracking-wide uppercase text-[var(--text-primary)]">
          Alumbrado Tradicional vs <span className="text-[var(--accent-cyan)] font-normal">LED ICEMEX</span>
        </h2>
        <p className="mt-4 text-sm text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
          Arrastra la barra interactiva para comparar la visibilidad, eficiencia energética y calidad lumínica de nuestras luminarias LED.
        </p>
      </div>

      {/* Contenedor del Slider */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[380px] md:h-[480px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl cursor-ew-resize bg-[#060910]"
      >
        {/* Capa ANTES (Alumbrado Tradicional de Sodio - Amarillo) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2b1800] via-[#4d2c00] to-[#1a1000] flex flex-col justify-between p-8">
          <div className="flex items-center gap-2 bg-amber-950/80 border border-amber-500/30 text-amber-300 px-4 py-1.5 rounded-full text-xs font-semibold w-fit backdrop-blur-md">
            <span>Sodio de Alta Presión Tradicional</span>
          </div>
          <div className="max-w-xs text-amber-200/80 text-sm space-y-1 bg-black/40 p-4 rounded-2xl backdrop-blur-sm border border-amber-500/10">
            <p className="font-semibold text-amber-300">❌ Alto Consumo & Mantenimiento</p>
            <p className="text-xs">Luz amarilla difusa, baja reproducción cromática (CRI &lt; 25) y desperdicio de energía en calor.</p>
          </div>
        </div>

        {/* Capa DESPUÉS (Luz LED ICEMEX - Recortada con Clip-Path) */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#061826] via-[#003847] to-[#001f29] flex flex-col justify-between p-8"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <div className="flex items-center gap-2 bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)]/40 text-[var(--accent-cyan)] px-4 py-1.5 rounded-full text-xs font-semibold w-fit backdrop-blur-md">
            <Zap className="w-4 h-4 text-[var(--accent-cyan)]" />
            <span>Luminaria LED ICEMEX (Hasta 80% Ahorro)</span>
          </div>
          <div className="max-w-xs text-cyan-100/90 text-sm space-y-1 bg-black/60 p-4 rounded-2xl backdrop-blur-md border border-[var(--accent-cyan)]/30">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[var(--accent-cyan)]" /> Visibilidad Clara & Garantía de 10 Años
            </p>
            <p className="text-xs text-gray-300">Óptica NanoOptic® de alta precisión, CRI &gt; 80, cero emisión de calor y encendido instantáneo.</p>
          </div>
        </div>

        {/* LÍNEA Y MANIJA DESLIZABLE */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)] cursor-ew-resize z-30"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.9)] border-2 border-[var(--accent-cyan)] hover:scale-110 transition-transform">
            <MoveHorizontal className="w-5 h-5 text-[var(--accent-cyan)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

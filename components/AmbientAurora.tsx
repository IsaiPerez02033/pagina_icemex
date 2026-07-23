"use client";

export default function AmbientAurora() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-40 dark:opacity-50"
    >
      {/* Orbe Cian Superior Izquierdo */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[var(--accent-cyan)]/20 blur-[130px] animate-aurora-slow"
      />
      {/* Orbe Azul/Noche Central */}
      <div
        className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full bg-[rgba(var(--cyan-rgb),0.15)] blur-[140px] animate-aurora-reverse"
      />
      {/* Orbe Cálido Inferior */}
      <div
        className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--accent-orange)]/10 blur-[150px] animate-aurora-slow"
      />
    </div>
  );
}

import type { ReactElement } from "react";
import type { ProductLine } from "@/lib/products";

const baseProps = {
  viewBox: "0 0 200 160",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  width: "100%",
  height: "100%",
  "aria-hidden": true,
};

/* Líneas estilo "blueprint" + un acento cyan luminoso por categoría */

function AL() {
  return (
    <svg {...baseProps}>
      <defs>
        <radialGradient id="al-glow" cx="50%" cy="42%" r="35%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Suelo */}
      <line x1="20" y1="140" x2="180" y2="140" />
      <line x1="40" y1="148" x2="160" y2="148" opacity="0.4" />
      {/* Poste */}
      <line x1="100" y1="140" x2="100" y2="50" />
      <rect x="95" y="138" width="10" height="6" />
      {/* Brazo */}
      <line x1="100" y1="50" x2="135" y2="50" />
      {/* Luminaria */}
      <rect x="128" y="48" width="22" height="6" fill="#00D4FF" stroke="#00D4FF" />
      {/* Halo */}
      <circle cx="139" cy="58" r="32" fill="url(#al-glow)" stroke="none" />
      {/* Rayos */}
      <line x1="139" y1="58" x2="115" y2="135" opacity="0.3" />
      <line x1="139" y1="58" x2="165" y2="135" opacity="0.3" />
      <line x1="139" y1="58" x2="139" y2="138" opacity="0.5" />
    </svg>
  );
}

function IS() {
  return (
    <svg {...baseProps}>
      <defs>
        <radialGradient id="is-glow" cx="50%" cy="30%" r="30%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Sol */}
      <circle cx="55" cy="45" r="14" fill="#00D4FF" stroke="#00D4FF" />
      <circle cx="55" cy="45" r="28" fill="url(#is-glow)" stroke="none" />
      <line x1="55" y1="20" x2="55" y2="10" />
      <line x1="55" y1="70" x2="55" y2="80" opacity="0.4" />
      <line x1="30" y1="45" x2="20" y2="45" />
      <line x1="80" y1="45" x2="90" y2="45" opacity="0.4" />
      <line x1="38" y1="28" x2="32" y2="22" />
      <line x1="72" y1="28" x2="78" y2="22" />
      {/* Panel solar */}
      <line x1="115" y1="60" x2="180" y2="40" />
      <line x1="120" y1="78" x2="185" y2="58" />
      <line x1="115" y1="60" x2="120" y2="78" />
      <line x1="180" y1="40" x2="185" y2="58" />
      <line x1="135" y1="55" x2="140" y2="73" opacity="0.6" />
      <line x1="155" y1="49" x2="160" y2="67" opacity="0.6" />
      {/* Poste */}
      <line x1="150" y1="78" x2="150" y2="140" />
      <line x1="20" y1="140" x2="180" y2="140" />
      {/* Luminaria */}
      <rect x="142" y="92" width="16" height="4" fill="#00D4FF" stroke="#00D4FF" />
    </svg>
  );
}

function LU() {
  return (
    <svg {...baseProps}>
      <defs>
        <radialGradient id="lu-glow" cx="50%" cy="50%" r="40%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <line x1="20" y1="140" x2="180" y2="140" />
      {/* Bolardo izquierdo */}
      <rect x="40" y="80" width="20" height="60" />
      <rect x="42" y="85" width="16" height="40" fill="#00D4FF" fillOpacity="0.3" stroke="#00D4FF" />
      <line x1="35" y1="78" x2="65" y2="78" />
      {/* Bolardo central (foco) */}
      <rect x="90" y="55" width="20" height="85" />
      <rect x="92" y="62" width="16" height="65" fill="#00D4FF" fillOpacity="0.5" stroke="#00D4FF" />
      <line x1="85" y1="53" x2="115" y2="53" />
      <ellipse cx="100" cy="100" rx="60" ry="40" fill="url(#lu-glow)" stroke="none" />
      {/* Bolardo derecho */}
      <rect x="140" y="92" width="18" height="48" />
      <rect x="142" y="98" width="14" height="32" fill="#00D4FF" fillOpacity="0.3" stroke="#00D4FF" />
      <line x1="135" y1="90" x2="163" y2="90" />
    </svg>
  );
}

function RF() {
  return (
    <svg {...baseProps}>
      <defs>
        <linearGradient id="rf-beam" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Reflector */}
      <rect x="30" y="30" width="44" height="34" />
      <rect x="34" y="34" width="36" height="26" fill="#00D4FF" fillOpacity="0.6" stroke="#00D4FF" />
      <line x1="52" y1="64" x2="52" y2="80" />
      <rect x="40" y="80" width="24" height="6" />
      {/* Haz de luz */}
      <polygon points="74,30 180,10 180,80 74,64" fill="url(#rf-beam)" stroke="none" />
      <line x1="74" y1="30" x2="180" y2="10" opacity="0.3" />
      <line x1="74" y1="64" x2="180" y2="80" opacity="0.3" />
      {/* Suelo */}
      <line x1="20" y1="140" x2="180" y2="140" />
      {/* Iluminación de campo deportivo */}
      <line x1="120" y1="140" x2="140" y2="140" stroke="#00D4FF" strokeWidth="2" />
      <line x1="150" y1="140" x2="170" y2="140" stroke="#00D4FF" strokeWidth="2" />
    </svg>
  );
}

function LC() {
  return (
    <svg {...baseProps}>
      <defs>
        <radialGradient id="lc-glow" cx="50%" cy="0%" r="50%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Techo */}
      <line x1="10" y1="20" x2="190" y2="20" />
      {/* Cables de suspensión */}
      <line x1="60" y1="20" x2="60" y2="40" opacity="0.6" />
      <line x1="100" y1="20" x2="100" y2="32" opacity="0.6" />
      <line x1="140" y1="20" x2="140" y2="40" opacity="0.6" />
      {/* Luminario panel rectangular */}
      <rect x="40" y="40" width="40" height="14" fill="#00D4FF" fillOpacity="0.4" stroke="#00D4FF" />
      <rect x="120" y="40" width="40" height="14" fill="#00D4FF" fillOpacity="0.4" stroke="#00D4FF" />
      {/* Campana central (high bay) */}
      <polygon points="90,32 110,32 115,52 85,52" fill="#00D4FF" fillOpacity="0.5" stroke="#00D4FF" />
      {/* Halos en piso */}
      <ellipse cx="60" cy="120" rx="32" ry="8" fill="url(#lc-glow)" stroke="none" />
      <ellipse cx="100" cy="120" rx="40" ry="10" fill="url(#lc-glow)" stroke="none" />
      <ellipse cx="140" cy="120" rx="32" ry="8" fill="url(#lc-glow)" stroke="none" />
      {/* Suelo */}
      <line x1="10" y1="140" x2="190" y2="140" />
    </svg>
  );
}

function PT() {
  return (
    <svg {...baseProps}>
      <line x1="20" y1="140" x2="180" y2="140" />
      {/* Poste recto circular */}
      <line x1="50" y1="140" x2="50" y2="40" />
      <rect x="46" y="138" width="8" height="6" />
      <circle cx="50" cy="36" r="6" fill="#00D4FF" stroke="#00D4FF" />
      {/* Poste cónico */}
      <line x1="100" y1="140" x2="103" y2="30" />
      <line x1="100" y1="140" x2="97" y2="30" />
      <rect x="93" y="138" width="14" height="6" />
      <circle cx="100" cy="26" r="6" fill="#00D4FF" stroke="#00D4FF" />
      {/* Poste especial con dos brazos (cisne) */}
      <line x1="150" y1="140" x2="150" y2="50" />
      <rect x="146" y="138" width="8" height="6" />
      <path d="M 150 50 Q 130 35, 130 60" />
      <path d="M 150 50 Q 170 35, 170 60" />
      <circle cx="130" cy="60" r="4" fill="#00D4FF" stroke="#00D4FF" />
      <circle cx="170" cy="60" r="4" fill="#00D4FF" stroke="#00D4FF" />
    </svg>
  );
}

function AC() {
  return (
    <svg {...baseProps}>
      {/* Brazo galvanizado horizontal */}
      <line x1="20" y1="40" x2="80" y2="40" />
      <line x1="80" y1="40" x2="80" y2="55" />
      <circle cx="20" cy="40" r="3" />
      <circle cx="80" cy="55" r="3" fill="#00D4FF" stroke="#00D4FF" />
      {/* Brazo escuadra */}
      <line x1="120" y1="20" x2="120" y2="60" />
      <line x1="120" y1="60" x2="160" y2="60" />
      <line x1="120" y1="40" x2="140" y2="60" opacity="0.5" />
      <circle cx="160" cy="60" r="3" fill="#00D4FF" stroke="#00D4FF" />
      {/* Base de concreto piramidal */}
      <polygon points="60,90 140,90 130,140 70,140" />
      <line x1="65" y1="100" x2="135" y2="100" opacity="0.4" />
      <circle cx="100" cy="115" r="6" fill="#00D4FF" fillOpacity="0.3" stroke="#00D4FF" />
      <line x1="100" y1="90" x2="100" y2="80" />
    </svg>
  );
}

const map: Record<ProductLine, () => ReactElement> = {
  AL,
  IS,
  LU,
  RF,
  LC,
  PT,
  AC,
};

export default function LineIllustration({ line }: { line: ProductLine }) {
  const Component = map[line] ?? AL;
  return <Component />;
}

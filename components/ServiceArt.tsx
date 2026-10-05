/**
 * Ilustraciones vectoriales de /servicios. Van sobre un panel oscuro en los
 * dos temas (como una pantalla), por eso usan colores fijos y no variables.
 */

const CYAN = "#00d4ff";
const INK = "#9fb0c6";

function Label({ x, y, text, anchor = "start", size = 13 }: { x: number; y: number; text: string; anchor?: "start" | "middle" | "end"; size?: number }) {
  // Caja aproximada al texto (mayúsculas espaciadas ≈ 0.72 em por carácter).
  const w = text.length * size * 0.72 + 18;
  const left = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  return (
    <g>
      <rect x={left} y={y - size - 6} width={w} height={size + 14} rx={(size + 14) / 2} fill="rgba(6,9,16,.82)" stroke="rgba(0,212,255,.45)" />
      <text x={left + w / 2} y={y + 1} textAnchor="middle" fontSize={size} fill="#fff" letterSpacing=".12em" fontWeight={500}>
        {text}
      </text>
    </g>
  );
}

/** Estudio luminotécnico en planta: vialidad, postes y mapa de iluminancia. */
export function LuxStudy() {
  const poles = [70, 240, 410];
  return (
    <svg viewBox="0 0 480 480" role="img" aria-label="Ejemplo de estudio luminotécnico en planta: vialidad con tres postes y su mapa de iluminancia">
      <defs>
        <radialGradient id="lux-heat">
          <stop offset="0" stopColor="#fff7c2" stopOpacity=".95" />
          <stop offset=".22" stopColor="#ffd23f" stopOpacity=".85" />
          <stop offset=".48" stopColor="#ff8a2a" stopOpacity=".55" />
          <stop offset=".72" stopColor="#22c97a" stopOpacity=".32" />
          <stop offset="1" stopColor="#1e6bff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lux-legend">
          <stop offset="0" stopColor="#1e6bff" />
          <stop offset=".35" stopColor="#22c97a" />
          <stop offset=".7" stopColor="#ff8a2a" />
          <stop offset="1" stopColor="#fff7c2" />
        </linearGradient>
        <pattern id="lux-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="rgba(0,212,255,.07)" />
        </pattern>
      </defs>
      <rect width="480" height="480" fill="#070c15" />
      <rect width="480" height="480" fill="url(#lux-grid)" />

      {/* Banquetas y arroyo vehicular */}
      <rect x="0" y="150" width="480" height="40" fill="#121a26" />
      <rect x="0" y="190" width="480" height="120" fill="#0d141f" />
      <rect x="0" y="310" width="480" height="40" fill="#121a26" />
      <line x1="0" y1="250" x2="480" y2="250" stroke="#cfd8e3" strokeOpacity=".5" strokeWidth="2" strokeDasharray="18 14" />

      <g style={{ mixBlendMode: "screen" }}>
        {poles.map((x) => (
          <ellipse key={x} cx={x} cy="228" rx="128" ry="104" fill="url(#lux-heat)" />
        ))}
      </g>

      {/* Curvas isolux */}
      {poles.map((x) => (
        <g key={x} fill="none" strokeDasharray="4 5">
          <ellipse cx={x} cy="226" rx="34" ry="28" stroke="#fff" strokeOpacity=".7" />
          <ellipse cx={x} cy="228" rx="66" ry="54" stroke="#ffd23f" strokeOpacity=".6" />
          <ellipse cx={x} cy="230" rx="100" ry="82" stroke="#22c97a" strokeOpacity=".45" />
        </g>
      ))}
      <g fontSize="11" fill="#fff" textAnchor="middle" letterSpacing=".06em">
        {[
          ["30 lx", 262],
          ["15 lx", 290],
          ["5 lx", 320],
        ].map(([t, y]) => (
          <g key={t}>
            <rect x="221" y={Number(y) - 11} width="38" height="15" rx="7.5" fill="rgba(7,12,21,.75)" />
            <text x="240" y={Number(y)}>{t}</text>
          </g>
        ))}
      </g>

      {/* Malla de cálculo */}
      <g fill="#fff" fillOpacity=".35">
        {Array.from({ length: 13 }, (_, i) =>
          [205, 235, 265, 295].map((y) => <circle key={`${i}-${y}`} cx={24 + i * 36} cy={y} r="1.6" />),
        )}
      </g>

      {/* Postes con su brazo hacia el arroyo */}
      {poles.map((x) => (
        <g key={x}>
          <line x1={x} y1="168" x2={x} y2="204" stroke={CYAN} strokeWidth="3" />
          <rect x={x - 9} y="200" width="18" height="9" rx="3" fill="#fff" />
          <circle cx={x} cy="168" r="7" fill="#070c15" stroke={CYAN} strokeWidth="3" />
        </g>
      ))}

      <text x="24" y="44" fontSize="12" fill={CYAN} letterSpacing=".28em">ESTUDIO LUMINOTÉCNICO</text>
      <text x="24" y="66" fontSize="12" fill={INK} letterSpacing=".16em">VISTA EN PLANTA · VIALIDAD</text>

      {/* Lo que validamos */}
      <g fontSize="12" fill="#e8edf5" letterSpacing=".04em">
        {["Lux promedio", "Uniformidad", "NOM-013-ENER"].map((t, i) => (
          <g key={t} transform={`translate(24 ${384 + i * 24})`}>
            <circle cx="7" cy="-4" r="7" fill="rgba(34,201,122,.18)" stroke="#22c97a" />
            <path d="M3.5 -4l2.5 2.5 4.5 -5" fill="none" stroke="#22c97a" strokeWidth="1.8" />
            <text x="22">{t}</text>
          </g>
        ))}
      </g>
      <g transform="translate(270 404)">
        <rect width="186" height="10" rx="5" fill="url(#lux-legend)" />
        <g fontSize="11" fill={INK}>
          <text y="30">0</text>
          <text x="93" y="30" textAnchor="middle">15</text>
          <text x="186" y="30" textAnchor="end">30+ lx</text>
        </g>
        <text y="-12" fontSize="11" fill={INK} letterSpacing=".2em">ILUMINANCIA</text>
      </g>
    </svg>
  );
}

/**
 * Cotas sobre la foto del andador GAM (960 × 1280). El recuadro es cuadrado y
 * la foto va con object-position 50% 30%, así que se ve de y = 96 a 1056.
 */
export function SurveyOverlay() {
  const tick = (x1: number, y1: number, x2: number, y2: number) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="4" />
  );
  return (
    <svg viewBox="0 96 960 960" className="svc-overlay" aria-hidden="true">
      <g stroke="#fff" strokeWidth="3" strokeDasharray="14 10" fill="none">
        {/* Altura de montaje del poste izquierdo */}
        <line x1="170" y1="104" x2="170" y2="1046" />
        {/* Interdistancia entre postes */}
        <line x1="300" y1="560" x2="808" y2="560" />
        {/* Ancho del andador */}
        <line x1="430" y1="905" x2="758" y2="905" />
      </g>
      {tick(150, 104, 190, 104)}
      {tick(150, 1046, 190, 1046)}
      {tick(300, 540, 300, 580)}
      {tick(808, 540, 808, 580)}
      {tick(430, 885, 430, 925)}
      {tick(758, 885, 758, 925)}

      {/* Puntos de luz */}
      {[
        [268, 230],
        [836, 400],
      ].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="42" fill="none" stroke={CYAN} strokeWidth="4" className="svc-pulse" />
          <circle cx={x} cy={y} r="10" fill={CYAN} />
        </g>
      ))}

      <g transform="rotate(-90 132 575)">
        <Label x={132} y={585} text="ALTURA DE MONTAJE" anchor="middle" size={24} />
      </g>
      <Label x={554} y={540} text="INTERDISTANCIA" anchor="middle" size={24} />
      <Label x={594} y={885} text="ANCHO DE ANDADOR" anchor="middle" size={24} />
      <Label x={836} y={330} text="PUNTO DE LUZ" anchor="end" size={24} />
    </svg>
  );
}

/** Camión con grúa HIAB izando un poste ya con su luminaria. */
export function HiabTruck() {
  const ground = 402;
  return (
    <svg viewBox="0 0 480 480" role="img" aria-label="Ilustración de camión con grúa HIAB izando un poste de alumbrado">
      <defs>
        <pattern id="hiab-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="rgba(0,212,255,.07)" />
        </pattern>
        <radialGradient id="hiab-glow" cx=".5" cy="0" r="1">
          <stop offset="0" stopColor="#fff7c2" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff7c2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hiab-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0a1220" />
          <stop offset="1" stopColor="#070b13" />
        </linearGradient>
      </defs>
      <rect width="480" height="480" fill="url(#hiab-sky)" />
      <rect width="480" height="480" fill="url(#hiab-grid)" />

      {/* Haz de la luminaria ya encendida */}
      <path d={`M384 154 L318 ${ground} L478 ${ground} L404 154 Z`} fill="url(#hiab-glow)" />

      {/* Piso */}
      <line x1="0" y1={ground} x2="480" y2={ground} stroke={CYAN} strokeOpacity=".5" strokeWidth="2" />
      <g stroke={CYAN} strokeOpacity=".18">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={i * 44} y1={ground + 4} x2={i * 44 - 18} y2={ground + 22} />
        ))}
      </g>

      <g fill="#0f1826" stroke={CYAN} strokeWidth="2.5" strokeLinejoin="round">
        {/* Plataforma con postes acostados */}
        <rect x="110" y="330" width="176" height="28" rx="3" />
        <g strokeWidth="2" stroke="#5c6f86">
          <line x1="150" y1="322" x2="282" y2="322" />
          <line x1="150" y1="314" x2="282" y2="314" />
        </g>
        {/* Cabina */}
        <path d="M30 372 V318 Q30 300 48 296 L82 292 Q100 292 104 306 L110 330 V372 Z" />
        <path d="M46 306 L82 302 Q92 302 94 312 L98 326 H46 Z" fill="#14324a" />
        {/* Chasis */}
        <rect x="26" y="358" width="270" height="16" rx="3" />
        {/* Estabilizador */}
        <path d={`M132 374 V${ground - 6}`} />
        <rect x="120" y={ground - 8} width="24" height="8" rx="2" />
        {/* Columna de la grúa */}
        <rect x="114" y="248" width="22" height="82" rx="3" />
      </g>

      {/* Llantas */}
      {[66, 222, 262].map((x) => (
        <g key={x}>
          <circle cx={x} cy="380" r="21" fill="#060910" stroke={CYAN} strokeWidth="2.5" />
          <circle cx={x} cy="380" r="8" fill="none" stroke="#5c6f86" strokeWidth="2" />
        </g>
      ))}

      {/* Pluma articulada y cilindros */}
      <g stroke={CYAN} strokeLinecap="round" fill="none">
        <line x1="128" y1="300" x2="196" y2="214" strokeWidth="5" strokeOpacity=".7" />
        <line x1="125" y1="254" x2="244" y2="150" strokeWidth="13" />
        <line x1="244" y1="150" x2="356" y2="96" strokeWidth="10" />
        <line x1="232" y1="176" x2="300" y2="112" strokeWidth="4" strokeOpacity=".7" />
      </g>
      <circle cx="244" cy="150" r="9" fill="#060910" stroke={CYAN} strokeWidth="3" />
      <circle cx="125" cy="254" r="9" fill="#060910" stroke={CYAN} strokeWidth="3" />

      {/* Gancho, eslinga y poste */}
      <line x1="356" y1="96" x2="356" y2="140" stroke="#cfd8e3" strokeWidth="2" />
      <path d="M346 136 Q356 150 366 136" fill="none" stroke="#cfd8e3" strokeWidth="3" />
      <path d="M356 146 L351 196 M356 146 L362 196" stroke="#cfd8e3" strokeWidth="2" />
      <rect x="350" y="166" width="12" height={ground - 174} rx="2" fill="#1b2738" stroke="#cfd8e3" strokeWidth="2" />
      <path d="M356 170 Q356 152 372 150 L392 150" fill="none" stroke="#cfd8e3" strokeWidth="4" />
      <rect x="380" y="144" width="30" height="11" rx="4" fill="#fff" />
      <rect x={346} y={ground - 10} width="20" height="10" fill="#1b2738" stroke="#cfd8e3" strokeWidth="2" />

      {/* Cota de altura */}
      <g stroke="#fff" strokeOpacity=".75" strokeWidth="1.5">
        <line x1="444" y1="144" x2="444" y2={ground} strokeDasharray="6 6" />
        <line x1="434" y1="144" x2="454" y2="144" />
        <line x1="434" y1={ground} x2="454" y2={ground} />
      </g>
      <g transform={`rotate(-90 462 ${(144 + ground) / 2})`}>
        <text x="462" y={(144 + ground) / 2 + 4} textAnchor="middle" fontSize="12" fill="#fff" letterSpacing=".2em">
          POSTES HASTA 12 M
        </text>
      </g>

      <text x="24" y="44" fontSize="12" fill={CYAN} letterSpacing=".28em">GRÚA HIAB PROPIA</text>
      <text x="24" y="66" fontSize="12" fill={INK} letterSpacing=".16em">IZAJE · MONTAJE · PUESTA EN SERVICIO</text>
    </svg>
  );
}

/** Punta de un abanico (campo de visión) desde (cx, cy) hacia `dir` grados. */
function wedge(cx: number, cy: number, dir: number, spread: number, r: number) {
  const pt = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)].map((n) => n.toFixed(1));
  const [x1, y1] = pt(dir - spread / 2);
  const [x2, y2] = pt(dir + spread / 2);
  return `M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} Z`;
}

/** Plano en planta de una casa con la ubicación y cobertura de cada cámara. */
export function CoveragePlan() {
  const cams: [number, number, number, number, number][] = [
    // x, y, dirección, apertura, alcance
    [358, 332, 75, 70, 130],
    [122, 332, 105, 70, 125],
    [122, 152, 225, 80, 105],
    [358, 152, 315, 80, 105],
    [292, 238, 150, 80, 160],
  ];
  const router = [250, 205];
  return (
    <svg viewBox="0 0 480 480" role="img" aria-label="Plano ilustrativo de una casa con cinco cámaras Wi-Fi y su campo de visión">
      <defs>
        <pattern id="cov-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="rgba(0,212,255,.07)" />
        </pattern>
        <radialGradient id="cov-fov" cx="0" cy="0" r="1">
          <stop offset="0" stopColor={CYAN} stopOpacity=".45" />
          <stop offset="1" stopColor={CYAN} stopOpacity=".04" />
        </radialGradient>
        <clipPath id="cov-lot">
          <rect x="30" y="90" width="420" height="360" />
        </clipPath>
        <clipPath id="cov-sala">
          <rect x="120" y="230" width="180" height="100" />
        </clipPath>
      </defs>
      <rect width="480" height="480" fill="#070c15" />
      <rect width="480" height="480" fill="url(#cov-grid)" />

      {/* El plano va un poco reducido para que el pie de foto no tape la calle. */}
      <g transform="translate(24 4) scale(.9)">
      {/* Terreno, cochera y casa */}
      <rect x="30" y="90" width="420" height="360" fill="#0b121c" stroke="#5c6f86" strokeDasharray="6 6" />
      <rect x="300" y="330" width="100" height="120" fill="#121a26" />
      <line x1="300" y1="450" x2="400" y2="450" stroke="#ffd23f" strokeWidth="4" />
      <rect x="120" y="150" width="240" height="180" fill="#0f1826" stroke="#5c6f86" strokeWidth="3" />
      <g stroke="#5c6f86" strokeWidth="2">
        <line x1="240" y1="150" x2="240" y2="230" />
        <line x1="120" y1="230" x2="300" y2="230" />
        <line x1="300" y1="230" x2="300" y2="330" />
      </g>
      <g fontSize="11" fill={INK} letterSpacing=".14em">
        <text x="180" y="196" textAnchor="middle">RECÁMARA</text>
        <text x="300" y="196" textAnchor="middle">COCINA</text>
        <text x="210" y="300" textAnchor="middle">SALA</text>
        <text x="350" y="420" textAnchor="middle">COCHERA</text>
        <text x="240" y="118" textAnchor="middle">PATIO</text>
        <text x="350" y="470" textAnchor="middle" fill="#ffd23f">ACCESO</text>
        <text x="90" y="470" textAnchor="middle">CALLE</text>
      </g>

      {/* Campos de visión */}
      <g clipPath="url(#cov-lot)">
        {cams.map(([x, y, d, s, r], i) => (
          <path
            key={`${x}-${y}`}
            d={wedge(x, y, d, s, r)}
            clipPath={i === cams.length - 1 ? "url(#cov-sala)" : undefined}
            fill="url(#cov-fov)"
            stroke={CYAN}
            strokeOpacity=".35"
          />
        ))}
      </g>

      {/* Enlace Wi-Fi de cada cámara al router */}
      <g stroke={CYAN} strokeOpacity=".5" strokeDasharray="2 6" strokeWidth="1.5">
        {cams.map(([x, y]) => (
          <line key={`${x}-${y}`} x1={router[0]} y1={router[1]} x2={x} y2={y} />
        ))}
      </g>
      <g transform={`translate(${router[0]} ${router[1]})`}>
        <circle r="15" fill="#060910" stroke={CYAN} strokeWidth="2" />
        <g fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round">
          <path d="M-7 -1 Q0 -8 7 -1" />
          <path d="M-4 3 Q0 -1 4 3" />
        </g>
        <circle cy="6" r="1.8" fill={CYAN} />
      </g>

      {cams.map(([x, y], i) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="11" fill={CYAN} fillOpacity=".18" className="svc-pulse" />
          <circle cx={x} cy={y} r="6" fill="#fff" stroke={CYAN} strokeWidth="3" />
          <text x={x + 10} y={y - 10} fontSize="10" fill="#fff" fontWeight={600}>
            {i + 1}
          </text>
        </g>
      ))}
      </g>

      <text x="24" y="44" fontSize="12" fill={CYAN} letterSpacing=".28em">PLANO DE COBERTURA</text>
      <text x="24" y="66" fontSize="12" fill={INK} letterSpacing=".16em">5 CÁMARAS WI-FI · 1 ROUTER</text>
    </svg>
  );
}

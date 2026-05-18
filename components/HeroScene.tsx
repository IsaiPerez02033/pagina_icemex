"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ============================================================
   PALETAS DE LA ESCENA 3D — una por tema
   ============================================================ */
type Palette = {
  // Fondo del canvas (gradient en CSS)
  bgGradient: string;
  fog: string;
  // Suelo + grid
  ground: string;
  grid: string;
  gridOpacity: number;
  centerLine: string;
  // Postería metálica
  pole: string;
  arm: string;
  housing: string;
  // Acentos / partículas
  accent: string; // dots, líneas accent
  // Luces
  ambient: number;
  sun: string;
  sunIntensity: number;
  fill: string;
  fillIntensity: number;
  warmLight: string; // luminaria encendida
  flash: string; // chispa al instalar
  // Postprocess
  bloomBase: number;
  bloomScroll: number;
};

const PALETTES: Record<"dark" | "light", Palette> = {
  dark: {
    bgGradient: "radial-gradient(ellipse at center, #0D1117 0%, #060910 70%)",
    fog: "#060910",
    ground: "#0D1117",
    grid: "#00D4FF",
    gridOpacity: 0.18,
    centerLine: "#FFFFFF",
    pole: "#8A9BB0",
    arm: "#8A9BB0",
    housing: "#C8C8C8",
    accent: "#00D4FF",
    ambient: 0.2,
    sun: "#A8C5FF",
    sunIntensity: 0.6,
    fill: "#00D4FF",
    fillIntensity: 0.15,
    warmLight: "#FFD080",
    flash: "#E07820",
    bloomBase: 0.9,
    bloomScroll: 1.4,
  },
  light: {
    // Cielo diurno cálido en lugar de noche
    bgGradient: "radial-gradient(ellipse at 50% 30%, #E8EEF5 0%, #BFD3E6 60%, #94B0CB 100%)",
    fog: "#BFD3E6",
    ground: "#A8B5C5",
    grid: "#007FA3",
    gridOpacity: 0.32,
    centerLine: "#FFFFFF",
    pole: "#3D4A5A",
    arm: "#3D4A5A",
    housing: "#6B7888",
    accent: "#007FA3",
    ambient: 0.7,
    sun: "#FFF1D6",
    sunIntensity: 1.1,
    fill: "#88C5DC",
    fillIntensity: 0.25,
    warmLight: "#FFC870",
    flash: "#E07820",
    bloomBase: 0.35,
    bloomScroll: 0.55,
  },
};

/** Lee el atributo data-theme del <html> y reacciona a cambios en vivo. */
function useThemeMode(): "dark" | "light" {
  const [mode, setMode] = useState<"dark" | "light">("dark");
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    const read = () => {
      const t = html.getAttribute("data-theme");
      setMode(t === "light" ? "light" : "dark");
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return mode;
}

/** Detecta dispositivo móvil para reducir carga de GPU. */
function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const check = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setMobile(window.innerWidth < 768);
      }, 150);
    };
    check();
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("resize", check);
      clearTimeout(timeout);
    };
  }, []);
  return mobile;
}

// Hook que conecta el progreso del scroll global a 0..1.
// Usa ref internamente para Three.js (sin re-render) y
// throttlea el state de React para el HUD a ~20fps.
function useScrollProgress() {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const lastSet = useRef(0);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    let st: ScrollTrigger | null = null;
    let resizeTimer: ReturnType<typeof setTimeout>;
    const raf = requestAnimationFrame(() => {
      const trigger =
        document.getElementById("hero-scroll") ?? document.body;
      st = ScrollTrigger.create({
        trigger,
        start: "top top",
        end: "bottom bottom",
        scrub: isMobile ? 0.5 : true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          const now = Date.now();
          if (now - lastSet.current > 50 || self.progress >= 1) {
            lastSet.current = now;
            setProgress(self.progress);
          }
        },
      });
      ScrollTrigger.refresh();
    });

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!ScrollTrigger.isScrolling()) {
          ScrollTrigger.refresh();
        }
      }, 250);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      if (st) st.kill();
    };
  }, [isMobile]);
  return { progress, progressRef };
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/* --- ETAPA 1: Suelo + grid + línea central --- */
function Ground({ progressRef, palette, isMobile }: { progressRef: React.RefObject<number>; palette: Palette; isMobile: boolean }) {
  const lineRef = useRef<THREE.Mesh | null>(null);

  useFrame(() => {
    const s = smoothstep(0, 0.1, progressRef.current);
    if (lineRef.current) {
      lineRef.current.scale.x = s;
    }
  });

  const divisions = isMobile ? 10 : 20;
  const gridGeo = useMemo(() => {
    const size = 20;
    const step = size / divisions;
    const half = size / 2;
    const positions: number[] = [];
    for (let i = 0; i <= divisions; i++) {
      const v = -half + i * step;
      positions.push(-half, 0.001, v, half, 0.001, v);
      positions.push(v, 0.001, -half, v, 0.001, half);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return g;
  }, [divisions]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color={palette.ground}
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      <lineSegments geometry={gridGeo}>
        <lineBasicMaterial
          color={palette.grid}
          transparent
          opacity={palette.gridOpacity}
          toneMapped={false}
        />
      </lineSegments>

      {/* Línea blanca central que se dibuja de izquierda a derecha */}
      <mesh
        ref={lineRef}
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0, 1, 1]}
      >
        <planeGeometry args={[18, 0.04]} />
        <meshBasicMaterial color={palette.centerLine} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* --- ETAPA 2: Construcción del poste --- */
function Pole({
  progressRef,
  baseRef,
  fusteRef,
  palette,
}: {
  progressRef: React.RefObject<number>;
  baseRef: React.RefObject<THREE.Mesh | null>;
  fusteRef: React.RefObject<THREE.Mesh | null>;
  palette: Palette;
}) {
  useFrame(() => {
    const p = progressRef.current;
    const baseStage = smoothstep(0.05, 0.15, p);
    const fusteStage = smoothstep(0.1, 0.4, p);
    if (baseRef.current) {
      baseRef.current.position.y = THREE.MathUtils.lerp(-3, 0.12, baseStage);
    }
    if (fusteRef.current) {
      fusteRef.current.position.y = THREE.MathUtils.lerp(-3, 1.5, fusteStage);
    }
  });

  return (
    <group>
      <mesh ref={baseRef} position={[0, -3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.4, 0.25, 32]} />
        <meshStandardMaterial color={palette.pole} metalness={0.9} roughness={0.15} />
      </mesh>

      <mesh ref={fusteRef} position={[0, -3, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.09, 3.0, 32]} />
        <meshStandardMaterial color={palette.pole} metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

/* --- ETAPA 2: Puntos cyan flotantes --- */
function FloatingDots({ progressRef, palette, isMobile }: { progressRef: React.RefObject<number>; palette: Palette; isMobile: boolean }) {
  const pointsRef = useRef<THREE.Points | null>(null);
  const count = isMobile ? 15 : 40;

  const geometry = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.8 + Math.random() * 1.4;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      // Y limitado al rango del poste (0.2 a 3.2)
      const y = Math.random() * 3 + 0.2;
      positions.push(x, y, z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, [count]);

  useFrame(({ clock }) => {
    const stage = smoothstep(0.15, 0.45, progressRef.current);
    if (pointsRef.current) {
      const m = pointsRef.current.material as THREE.PointsMaterial;
      m.opacity = stage * 0.9;
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color={palette.accent}
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0}
        toneMapped={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* --- ETAPA 3: Luminaria (brazo + carcasa + flash) --- */
function Luminaire({
  progressRef,
  flashRef,
  palette,
}: {
  progressRef: React.RefObject<number>;
  flashRef: React.RefObject<THREE.PointLight | null>;
  palette: Palette;
}) {
  const armRef = useRef<THREE.Mesh | null>(null);
  const housingRef = useRef<THREE.Mesh | null>(null);
  const flashedRef = useRef(false);

  const TOP_Y = 3.0;

  useFrame(() => {
    const p = progressRef.current;
    const armStage = smoothstep(0.35, 0.55, p);
    const housingStage = smoothstep(0.45, 0.65, p);
    if (armRef.current) {
      // brazo más corto centrado en x=0.6, longitud 1.2 ⇒ extremo en x=1.2
      armRef.current.position.set(0.6, TOP_Y, 0);
      armRef.current.rotation.z = THREE.MathUtils.lerp(-1.5, 0, armStage);
      // Solo aparece cuando el poste ya está completamente erguido
      // y comienza la fase de instalación del brazo (>= 30% de progreso).
      armRef.current.visible = p >= 0.3;
    }

    if (housingRef.current) {
      const finalX = 1.2;
      const finalY = TOP_Y - 0.05;
      const startY = finalY + 1.0; // Empieza más cerca para no salirse del frame
      housingRef.current.position.set(
        finalX,
        THREE.MathUtils.lerp(startY, finalY, housingStage),
        0
      );
      const m = housingRef.current.material as THREE.MeshStandardMaterial;
      m.opacity = housingStage;
      // La carcasa solo es visible (y proyecta sombra) cuando empieza a descender.
      // Sin esto, opacity:0 NO desactiva el shadow casting en three.js.
      housingRef.current.visible = housingStage > 0;
    }

    // Flash al hacer "click" de instalación cuando housingStage cruza 0.95
    if (flashRef.current) {
      if (housingStage > 0.95 && !flashedRef.current) {
        flashedRef.current = true;
        gsap.fromTo(
          flashRef.current,
          { intensity: 0 },
          {
            intensity: 5,
            duration: 0.15,
            ease: "power2.out",
            onComplete: () => {
              if (flashRef.current) {
                gsap.to(flashRef.current, {
                  intensity: 0,
                  duration: 0.15,
                  ease: "power2.in",
                });
              }
            },
          }
        );
      }
      if (housingStage < 0.3) {
        flashedRef.current = false;
        flashRef.current.intensity = 0;
      }
    }
  });

  return (
    <group>
      {/* Brazo */}
      <mesh ref={armRef} position={[0.6, TOP_Y, 0]} castShadow>
        <boxGeometry args={[1.2, 0.06, 0.06]} />
        <meshStandardMaterial color={palette.arm} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Carcasa LED */}
      <mesh ref={housingRef} position={[1.2, TOP_Y + 1.0, 0]} castShadow>
        <boxGeometry args={[0.7, 0.11, 0.28]} />
        <meshStandardMaterial
          color={palette.housing}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Flash de conexión */}
      <pointLight
        ref={flashRef}
        position={[1.2, TOP_Y - 0.05, 0]}
        color={palette.flash}
        intensity={0}
        distance={5}
        decay={2}
      />
    </group>
  );
}

/* --- ETAPA 4: Encendido --- */
function PowerOn({ progressRef, palette }: { progressRef: React.RefObject<number>; palette: Palette }) {
  const lightRef = useRef<THREE.PointLight | null>(null);
  const circleRef = useRef<THREE.Mesh | null>(null);
  const TOP_Y = 3.0;

  useFrame(() => {
    const stage = smoothstep(0.65, 1, progressRef.current);
    if (lightRef.current) {
      lightRef.current.intensity = stage * 4;
    }
    if (circleRef.current) {
      const m = circleRef.current.material as THREE.MeshStandardMaterial;
      m.opacity = stage * 0.6;
      (m as any).emissiveIntensity = stage * 1.6;
    }
  });

  return (
    <group>
      <pointLight
        ref={lightRef}
        position={[1.2, TOP_Y - 0.2, 0]}
        color={palette.warmLight}
        intensity={0}
        distance={10}
        decay={2}
      />

      {/* Halo emisivo bajo el poste */}
      <mesh
        ref={circleRef}
        position={[1.2, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[1.7, 64]} />
        <meshStandardMaterial
          color={palette.warmLight}
          emissive={palette.warmLight}
          emissiveIntensity={0}
          transparent
          opacity={0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* --- Cámara con pull-back --- */
function CameraRig({ progressRef }: { progressRef: React.RefObject<number> }) {
  const { camera } = useThree();

  useFrame(() => {
    const p = progressRef.current;
    const stage = smoothstep(0.65, 1, p);
    // Cámara alejada y centrada para que TODO el poste de 3m quepa en frame
    camera.position.x = 0;
    camera.position.z = THREE.MathUtils.lerp(8, 10, stage);
    camera.position.y = THREE.MathUtils.lerp(1.5, 1.9, smoothstep(0, 1, p));
    // LookAt al centro del conjunto (mitad del fuste)
    camera.lookAt(0.5, 1.5, 0);
  });

  return null;
}

/* --- Escena interna --- */
function Scene({ progressRef, palette, isMobile }: { progressRef: React.RefObject<number>; palette: Palette; isMobile: boolean }) {
  const baseRef = useRef<THREE.Mesh | null>(null);
  const fusteRef = useRef<THREE.Mesh | null>(null);
  const flashRef = useRef<THREE.PointLight | null>(null);

  return (
    <>
      <CameraRig progressRef={progressRef} />

      <ambientLight intensity={palette.ambient} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={palette.sunIntensity}
        color={palette.sun}
        castShadow={!isMobile}
      />
      <directionalLight
        position={[-6, 4, -4]}
        intensity={palette.fillIntensity}
        color={palette.fill}
      />

      <Ground progressRef={progressRef} palette={palette} isMobile={isMobile} />
      <Pole
        progressRef={progressRef}
        baseRef={baseRef}
        fusteRef={fusteRef}
        palette={palette}
      />
      <FloatingDots progressRef={progressRef} palette={palette} isMobile={isMobile} />
      <Luminaire progressRef={progressRef} flashRef={flashRef} palette={palette} />
      <PowerOn progressRef={progressRef} palette={palette} />

      <fog attach="fog" args={[palette.fog, 14, 28]} />
    </>
  );
}

export default function HeroScene() {
  const { progress, progressRef } = useScrollProgress();
  const mode = useThemeMode();
  const isMobile = useIsMobile();
  const palette = PALETTES[mode];
  const stage4 = smoothstep(0.75, 1, progress);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: palette.bgGradient,
        transition: "background 0.6s ease",
      }}
    >
      <Canvas
        key={mode}
        shadows={isMobile ? false : "percentage"}
        dpr={isMobile ? [1, 1] : [1, 2]}
        camera={{ position: [0, 1.5, 8], fov: 50, near: 0.1, far: 100 }}
        gl={{ antialias: !isMobile, alpha: true }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
      >
        <Scene progressRef={progressRef} palette={palette} isMobile={isMobile} />
        {!isMobile && (
          <EffectComposer>
            <Bloom
              intensity={palette.bloomBase + stage4 * palette.bloomScroll}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>

      {/* Overlay HUD */}
      <div
        className="hero-hud"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          padding: "clamp(110px, 14vw, 140px) clamp(20px, 4vw, 48px) clamp(28px, 4vw, 48px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ maxWidth: 760 }}>
          <h1
            style={{
              fontSize: "clamp(32px, 4.6vw, 64px)",
              lineHeight: 1.06,
              color: "var(--text-primary)",
              fontWeight: 300,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Iluminamos
            <br />
            <span style={{ color: "var(--accent-cyan)" }}>tus sueños</span>,
            <br />
            materializamos
            <br />
            tus ideas
          </h1>
          <p
            style={{
              marginTop: 24,
              maxWidth: 480,
              color: "var(--text-muted)",
              fontSize: 14,
              lineHeight: 1.7,
              letterSpacing: "0.02em",
            }}
          >
            Fabricación, distribución y comercialización de material eléctrico,
            herrajes, postería y luminarias LED. Más de 20 años iluminando
            México.
          </p>
        </div>

        <div
          className="hero-hud-bottom"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 16,
            color: "var(--text-muted)",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          <div className="scroll-hint">
            <span style={{ color: "var(--accent-cyan)" }}>▍</span>{" "}
            Scroll para instalar
          </div>
          <div className="hero-hud-progress" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span>Etapa {stageLabel(progress)} / 04</span>
            <div
              className="hero-hud-bar"
              style={{
                width: 120,
                height: 2,
                background: "rgba(var(--cyan-rgb), 0.15)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.round(progress * 100)}%`,
                  height: "100%",
                  background: "var(--accent-cyan)",
                  boxShadow: "0 0 8px var(--accent-cyan)",
                  transition: "width 0.05s linear",
                }}
              />
            </div>
            <span
              style={{
                color: "var(--accent-cyan)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {Math.round(progress * 100).toString().padStart(2, "0")}%
            </span>
          </div>
        </div>
      </div>

      {/* Barra superior de progreso global del hero */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "rgba(var(--cyan-rgb), 0.08)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            background: "var(--accent-cyan)",
            boxShadow: "0 0 12px var(--accent-cyan)",
            transition: "width 0.05s linear",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes pulse-scroll {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
        :global(.scroll-hint) {
          animation: pulse-scroll 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function stageLabel(p: number) {
  if (p < 0.1) return "01";
  if (p < 0.4) return "02";
  if (p < 0.65) return "03";
  return "04";
}

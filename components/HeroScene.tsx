"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const STEPS = ["Poste", "Brazo", "Luminaria", "Encendido"];
const STOPS = [0.27, 0.51, 0.75, 0.98];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
function ease(start: number, end: number, value: number) {
  const t = clamp((value - start) / (end - start));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function useSceneSettings() {
  const [settings, setSettings] = useState({ light: false, mobile: false });
  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const read = () =>
      setSettings({
        light: document.documentElement.dataset.theme === "light",
        mobile: query.matches,
      });
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    query.addEventListener("change", read);
    read();
    return () => {
      observer.disconnect();
      query.removeEventListener("change", read);
    };
  }, []);
  return settings;
}

// Scroll owns the target; Three interpolates it without React renders per frame.
function useAssemblyProgress() {
  const target = useRef(0);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const element = document.getElementById("hero-scroll");
    if (!element) return;
    const update = () => {
      const bounds = element.getBoundingClientRect();
      const stage = element.firstElementChild as HTMLElement;
      const travel = Math.max(1, bounds.height - stage.clientHeight);
      target.current = clamp(-bounds.top / travel);
      setStep(
        target.current < 0.29
          ? 0
          : target.current < 0.55
            ? 1
            : target.current < 0.8
              ? 2
              : 3,
      );
    };
    const resize = new ResizeObserver(update);
    resize.observe(element);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return { target, step };
}

// Bounded rendering: no continuous GPU work while resting or outside the hero.
function RenderDriver({
  active,
  mobile,
}: {
  active: boolean;
  mobile: boolean;
}) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    if (!active) return;
    let frame = 0,
      last = 0,
      until = 0;
    const tick = (time: number) => {
      frame = 0;
      if (document.hidden) return;
      if (time - last >= 1000 / (mobile ? 30 : 60) - 1) {
        last = time;
        invalidate();
      }
      if (time < until) frame = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (document.hidden) return;
      until = performance.now() + 1800;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else wake();
    };
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    document.addEventListener("visibilitychange", visibility);
    wake();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [active, mobile, invalidate]);
  return null;
}

function Assembly({
  target,
  light,
  mobile,
}: {
  target: React.RefObject<number>;
  light: boolean;
  mobile: boolean;
}) {
  const pole = useRef<THREE.Group>(null);
  const arm = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const model = useRef<THREE.Group>(null);
  const lens = useRef<THREE.MeshStandardMaterial>(null);
  const leds = useRef<THREE.MeshStandardMaterial>(null);
  const lamp = useRef<THREE.SpotLight>(null);
  const pool = useRef<THREE.ShaderMaterial>(null);
  const progress = useRef(0);
  const { camera, size } = useThree();
  const lookAt = useMemo(() => new THREE.Vector3(0.45, 1.93, 0), []);
  const lightTarget = useMemo(() => new THREE.Object3D(), []);
  lightTarget.position.set(1.52, 0, 0);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.16, 0.23, 0),
        new THREE.Vector3(0.55, 0.4, 0),
        new THREE.Vector3(1.24, 0.44, 0),
      ]),
    [],
  );
  const housing = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.43, -0.14);
    shape.quadraticCurveTo(-0.52, -0.14, -0.52, -0.05);
    shape.lineTo(-0.52, 0.05);
    shape.quadraticCurveTo(-0.52, 0.14, -0.43, 0.14);
    shape.lineTo(0.33, 0.2);
    shape.quadraticCurveTo(0.52, 0.2, 0.52, 0.06);
    shape.lineTo(0.52, -0.06);
    shape.quadraticCurveTo(0.52, -0.2, 0.33, -0.2);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.09,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.025,
      curveSegments: 8,
    });
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);
  useEffect(() => () => housing.dispose(), [housing]);

  useFrame((_, delta) => {
    const p = (progress.current = THREE.MathUtils.damp(
      progress.current,
      target.current,
      10,
      Math.min(delta, 0.05),
    ));
    const shaft = ease(0.015, 0.24, p);
    const bracket = ease(0.29, 0.49, p);
    const fixture = ease(0.55, 0.73, p);
    const power = ease(0.8, 0.94, p);
    if (pole.current) pole.current.scale.y = 0.035 + shaft * 0.965;
    if (arm.current) {
      arm.current.visible = p > 0.285;
      arm.current.position.set(
        -0.22 * (1 - bracket),
        3.57 + 0.48 * (1 - bracket),
        0,
      );
      arm.current.rotation.z = (1 - bracket) * 0.28;
      arm.current.scale.setScalar(0.7 + bracket * 0.3);
    }
    if (head.current) {
      head.current.visible = p > 0.545;
      head.current.position.set(
        1.55 + 0.55 * (1 - fixture),
        4.01 + 0.64 * (1 - fixture),
        0,
      );
      head.current.rotation.z = -0.18 * (1 - fixture);
    }
    if (lens.current) {
      lens.current.emissiveIntensity = power * 2.5;
      lens.current.color.set(light ? "#d8e2e7" : "#b9c7d0");
    }
    if (leds.current) leds.current.emissiveIntensity = power * 5;
    if (lamp.current) lamp.current.intensity = power * (light ? 22 : 38);
    if (pool.current)
      pool.current.uniforms.strength.value = power * (light ? 0.3 : 0.7);
    if (model.current)
      model.current.rotation.y = -0.25 + ease(0.1, 1, p) * 0.42;
    // Fit the complete assembly in both portrait and landscape viewports.
    const distance = Math.max(7.6, 3.7 / (size.width / size.height));
    camera.position.set(4.3, 3.2, distance);
    camera.lookAt(lookAt);
  });

  const metal = light ? "#677786" : "#afbecb";
  return (
    <>
      <hemisphereLight
        args={[
          light ? "#ffffff" : "#bdd7f6",
          light ? "#8d9298" : "#303e52",
          1.5,
        ]}
      />
      <directionalLight position={[2, 7, 5]} intensity={3.2} color="#fff5e7" />
      <directionalLight
        position={[-4, 4, -3]}
        intensity={4}
        color={light ? "#dcecf7" : "#8ebfe7"}
      />
      <directionalLight position={[4, 2, -4]} intensity={2} color="#ffffff" />
      <group ref={model}>
        <mesh position={[0, 0.015, 0]}>
          <cylinderGeometry args={[2.6, 2.6, 0.055, mobile ? 48 : 80]} />
          <meshStandardMaterial
            color={light ? "#cbd4dc" : "#17222d"}
            metalness={0.25}
            roughness={0.65}
          />
        </mesh>
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.35, 2.36, 64]} />
          <meshBasicMaterial color={light ? "#9aaab8" : "#3a5266"} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <boxGeometry args={[0.55, 0.15, 0.55]} />
          <meshStandardMaterial
            color={metal}
            metalness={0.65}
            roughness={0.32}
          />
        </mesh>
        {[-0.2, 0.2].flatMap((x) =>
          [-0.2, 0.2].map((z) => (
            <mesh key={`${x}:${z}`} position={[x, 0.23, z]}>
              <cylinderGeometry args={[0.042, 0.042, 0.09, 6]} />
              <meshStandardMaterial
                color={metal}
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          )),
        )}
        <group ref={pole} position={[0, 0.2, 0]}>
          <mesh position={[0, 1.7, 0]}>
            <cylinderGeometry args={[0.058, 0.115, 3.4, 24]} />
            <meshStandardMaterial
              color={metal}
              metalness={0.65}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.14, 0.17, 0.16, 24]} />
            <meshStandardMaterial
              color={metal}
              metalness={0.65}
              roughness={0.35}
            />
          </mesh>
          <mesh position={[0, 0.52, 0.109]}>
            <boxGeometry args={[0.075, 0.25, 0.009]} />
            <meshStandardMaterial
              color={light ? "#465562" : "#667b8e"}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        </group>
        <group ref={arm} visible={false}>
          <mesh>
            <tubeGeometry args={[curve, 24, 0.049, 10, false]} />
            <meshStandardMaterial
              color={metal}
              metalness={0.65}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0.005, 0]}>
            <cylinderGeometry args={[0.079, 0.079, 0.22, 20]} />
            <meshStandardMaterial
              color={metal}
              metalness={0.7}
              roughness={0.28}
            />
          </mesh>
        </group>
        <group ref={head} visible={false}>
          <mesh geometry={housing}>
            <meshStandardMaterial
              color={light ? "#425362" : "#8a9aa8"}
              metalness={0.7}
              roughness={0.28}
            />
          </mesh>
          {Array.from({ length: 7 }, (_, i) => (
            <mesh key={i} position={[-0.28 + i * 0.09, 0.12, 0]}>
              <boxGeometry args={[0.025, 0.045, 0.25]} />
              <meshStandardMaterial
                color={metal}
                metalness={0.7}
                roughness={0.35}
              />
            </mesh>
          ))}
          <mesh position={[0.05, -0.04, 0]}>
            <boxGeometry args={[0.72, 0.035, 0.275]} />
            <meshStandardMaterial
              ref={lens}
              color="#d8e2e7"
              emissive="#fff0cf"
              emissiveIntensity={0}
              metalness={0.1}
              roughness={0.22}
            />
          </mesh>
          <mesh position={[0.06, -0.061, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.59, 0.19]} />
            <meshStandardMaterial
              ref={leds}
              color="#efe4c9"
              emissive="#fff4dd"
              emissiveIntensity={0}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
        <primitive object={lightTarget} />
        <spotLight
          ref={lamp}
          position={[1.55, 3.95, 0]}
          target={lightTarget}
          color="#ffe7b6"
          angle={0.57}
          penumbra={1}
          distance={9}
          decay={2}
          intensity={0}
        />
        <mesh position={[1.1, 0.049, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4, 4]} />
          <shaderMaterial
            ref={pool}
            transparent
            depthWrite={false}
            uniforms={{
              strength: { value: 0 },
              tint: { value: new THREE.Color("#ffe2a4") },
            }}
            vertexShader="varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
            fragmentShader="varying vec2 vUv; uniform float strength; uniform vec3 tint; void main(){float r=length((vUv-.5)*2.);float a=pow(max(0.,1.-r*r),3.)*strength;gl_FragColor=vec4(tint,a);}"
          />
        </mesh>
      </group>
    </>
  );
}

export default function HeroScene() {
  const { target, step } = useAssemblyProgress();
  const { light, mobile } = useSceneSettings();
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  useEffect(() => {
    if (!root.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setActive(entry.isIntersecting),
    );
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  function goToStep(index: number) {
    const section = document.getElementById("hero-scroll");
    if (!section) return;
    const stage = section.firstElementChild as HTMLElement;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + (section.offsetHeight - stage.clientHeight) * STOPS[index],
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <div ref={root} className="assembly-hero">
      <div className="assembly-copy">
        <p className="assembly-eyebrow">ICEMEX · Ingeniería que ilumina</p>
        <h1>
          Iluminación que transforma.
          <br />
          <span>Seguridad que protege.</span>
        </h1>
        <p className="assembly-description">
          Del poste al último punto de luz. Fabricación, suministro e
          instalación para dar vida a tu proyecto. También, venta e instalación
          de cámaras de seguridad.
        </p>
        <div className="assembly-actions">
          <a className="action-primary" href="/productos">
            Explorar productos ↗
          </a>
          <a className="action-secondary" href="/#contacto">
            Cotizar proyecto
          </a>
        </div>
      </div>
      <div
        className="assembly-viewport"
        role="img"
        aria-label={`Ensamble ilustrativo de alumbrado público. Etapa ${step + 1}: ${STEPS[step]}.`}
      >
        <Canvas
          frameloop="demand"
          dpr={mobile ? [1, 1.25] : [1, 1.5]}
          camera={{ position: [4.3, 3.2, 7.6], fov: 39, near: 0.1, far: 40 }}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        >
          <RenderDriver key={String(light)} active={active} mobile={mobile} />
          <Assembly target={target} light={light} mobile={mobile} />
        </Canvas>
        <span className="assembly-caption">
          Ensamble ilustrativo · Alumbrado público
        </span>
      </div>
      <div className="assembly-timeline">
        <p>
          Desliza para ensamblar <span aria-hidden="true">↓</span>
        </p>
        <div className="assembly-steps" aria-label="Etapas del ensamble">
          {STEPS.map((name, index) => (
            <button
              key={name}
              onClick={() => goToStep(index)}
              aria-current={step === index ? "step" : undefined}
              className={index <= step ? "is-reached" : ""}
            >
              <span>0{index + 1}</span>
              {name}
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Hero estático — sin WebGL ni Three.js. Se usa como:
 *  1. Render inicial en TODOS los dispositivos (pintado instantáneo).
 *  2. Fallback permanente en equipos de gama baja o navegadores sin WebGL.
 *  3. Placeholder mientras carga la escena 3D en equipos capaces.
 *
 * Comparte layout y texto (HeroCopy) con HeroScene: al subir a 3D solo cambia
 * la ilustración (CSS → canvas). El texto no se mueve ni cambia de tamaño, así
 * que no hay salto de layout (CLS) ni un segundo LCP.
 */

export function HeroCopy() {
  return (
    <div className="assembly-copy">
      <p className="assembly-eyebrow">ICEMEX · Ingeniería que ilumina</p>
      <h1>
        Iluminación que transforma.
        <br />
        <span>Seguridad que protege.</span>
      </h1>
      <p className="assembly-description">
        Del poste al último punto de luz. Fabricación, suministro e instalación
        para dar vida a tu proyecto. También, venta e instalación de cámaras de
        seguridad.
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
  );
}

/** Ilustración del poste encendido, 100% CSS (se pinta una vez, sin animar). */
function StaticArt() {
  return (
    <div className="assembly-viewport" aria-hidden="true">
      <div className="hero-static-stage">
        <div className="hero-static-grid" />
        <div className="hero-static-pool" />
        <div className="hero-static-cone" />
        <div className="hero-static-pole" />
        <div className="hero-static-arm" />
        <div className="hero-static-head" />
      </div>
      <span className="assembly-caption">
        Alumbrado público · Postes · Luminarias LED
      </span>
    </div>
  );
}

export default function HeroStatic({ id }: { id?: string }) {
  return (
    <section id={id} className="hero-static">
      <div className="assembly-hero">
        <HeroCopy />
        <StaticArt />
      </div>
    </section>
  );
}

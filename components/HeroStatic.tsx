"use client";

/**
 * Hero estático premium — sin WebGL ni Three.js. Se usa como:
 *  1. Render inicial en TODOS los dispositivos (pintado instantáneo).
 *  2. Fallback permanente en equipos de gama baja o navegadores sin WebGL.
 *  3. Placeholder mientras carga la escena 3D en equipos capaces.
 *
 * Visualmente evoca el frame final de la escena 3D (poste + luz cálida) usando
 * solo gradientes CSS: se pinta una vez, no anima capas pesadas y es fluido en
 * cualquier gama. Es theme-aware vía las variables CSS de :root/[data-theme].
 */
export default function HeroStatic({ id }: { id?: string }) {
  return (
    <section id={id} className="hero-static">
      {/* Escenario luminoso (poste + cono de luz), 100% CSS */}
      <div className="hero-static-stage" aria-hidden>
        <div className="hero-static-pole" />
        <div className="hero-static-cone" />
        <div className="hero-static-pool" />
        <div className="hero-static-grid" />
      </div>

      <div className="hero-hud hero-static-hud">
        <div className="hero-static-copy">
          <h1 className="hero-static-title">
            Iluminamos
            <br />
            <span>tus sueños</span>,
            <br />
            materializamos
            <br />
            tus ideas
          </h1>
          <p className="hero-static-sub">
            Fabricación, distribución y comercialización de material eléctrico,
            herrajes, postería y luminarias LED. Más de 20 años iluminando
            México.
          </p>
        </div>

        <div className="hero-static-bottom">
          <div className="scroll-hint">
            <span style={{ color: "var(--accent-cyan)" }}>▍</span> Desliza para
            explorar
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import IcemexLogo from "@/components/IcemexLogo";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detección de scroll para cambiar la apariencia del navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar el drawer al cambiar de ruta o presionar Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Si pasamos de mobile a desktop con drawer abierto, cerrarlo
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 961px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header
        className={`navbar ${scrolled || open ? "navbar-scrolled" : ""} ${
          open ? "navbar-open" : ""
        }`}
      >
        <nav className="navbar-inner">
          <Link
            href="/"
            aria-label="ICEMEX inicio"
            className="navbar-logo"
            onClick={() => setOpen(false)}
          >
            <IcemexLogo
              width={560}
              height={190}
              priority
              style={{
                objectFit: "contain",
                height: "100%",
                width: "auto",
                filter: "drop-shadow(0 0 22px rgba(var(--cyan-rgb), 0.3))",
              }}
            />
          </Link>

          {/* Links desktop */}
          <ul className="navbar-links-desktop">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="navlink">
                  <span className="navlink-label">{l.label}</span>
                  <span className="navlink-underline" aria-hidden />
                  <span className="navlink-glow" aria-hidden />
                </Link>
              </li>
            ))}
            <li>
              <ThemeToggle />
            </li>
          </ul>

          {/* Theme toggle mobile (junto a la hamburguesa) */}
          <div className="navbar-mobile-actions">
            <ThemeToggle />
          </div>

          {/* Botón hamburguesa / cerrar */}
          <button
            type="button"
            className="navbar-burger interactive"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`burger-bar ${open ? "burger-bar-1" : ""}`} />
            <span className={`burger-bar ${open ? "burger-bar-2" : ""}`} />
            <span className={`burger-bar ${open ? "burger-bar-3" : ""}`} />
          </button>
        </nav>
      </header>

      {/* Drawer mobile — fuera del header para evitar el bug del backdrop-filter
          que crea un nuevo containing block para position: fixed */}
      {open && (
        <div
          className="navbar-drawer"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <ul className="navbar-drawer-links">
            {links.map((l, i) => (
              <li
                key={l.href}
                style={{ ["--i" as never]: i }}
                className="navbar-drawer-item"
              >
                <Link
                  href={l.href}
                  className="navlink-mobile interactive"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="navbar-drawer-footer">
            ICEMEX · Iluminamos tus sueños
          </p>
        </div>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import IcemexLogo from "@/components/IcemexLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { LimelightNav, NavItem } from "@/components/ui/limelight-nav";
import { Home, Info, Briefcase, BookOpen, Mail } from "lucide-react";

const links: (NavItem & { href: string; label: string })[] = [
  { id: "inicio", href: "/", label: "Inicio", icon: <Home className="w-4 h-4" /> },
  { id: "nosotros", href: "/nosotros", label: "Nosotros", icon: <Info className="w-4 h-4" /> },
  { id: "servicios", href: "/servicios", label: "Servicios", icon: <Briefcase className="w-4 h-4" /> },
  { id: "catalogo", href: "/catalogo", label: "Catálogo", icon: <BookOpen className="w-4 h-4" /> },
  { id: "contacto", href: "/#contacto", label: "Contacto", icon: <Mail className="w-4 h-4" /> },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("");

  // Detección de hash de la URL (por ejemplo para /#contacto)
  useEffect(() => {
    const updateHash = () => {
      if (typeof window !== "undefined") {
        setActiveHash(window.location.hash);
      }
    };
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  // Calcular el índice del elemento activo según la ruta actual
  const activeIndex = useMemo(() => {
    if (pathname === "/" && activeHash === "#contacto") {
      return 4; // Contacto
    }
    const idx = links.findIndex((l) => {
      if (l.href === "/") return pathname === "/";
      if (l.href.startsWith("/#")) return false;
      return pathname.startsWith(l.href);
    });
    return idx !== -1 ? idx : 0;
  }, [pathname, activeHash]);

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
              style={{
                objectFit: "contain",
                height: "100%",
                width: "auto",
                filter: "drop-shadow(0 0 22px rgba(var(--cyan-rgb), 0.3))",
              }}
            />
          </Link>

          {/* Links desktop con efecto LimelightNav */}
          <div className="navbar-links-desktop-wrapper flex items-center gap-3">
            <LimelightNav
              items={links}
              activeIndex={activeIndex}
              className="bg-transparent border-none p-0 h-12 rounded-full backdrop-blur-md"
              limelightClassName="bg-[var(--accent-cyan)] shadow-[0_20px_18px_var(--accent-cyan)]"
              iconContainerClassName="px-3 py-1 text-sm font-medium"
            />
            <div className="pl-2 border-l border-white/10 dark:border-white/10">
              <ThemeToggle />
            </div>
          </div>

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

      {/* Drawer mobile */}
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
                  className="navlink-mobile interactive flex items-center gap-2 justify-center"
                  onClick={() => setOpen(false)}
                >
                  {l.icon}
                  <span>{l.label}</span>
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

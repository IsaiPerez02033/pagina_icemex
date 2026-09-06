"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import IcemexLogo from "./IcemexLogo";
import ThemeToggle from "./ThemeToggle";
const links = [
  ["/productos", "Productos"],
  ["/servicios", "Servicios"],
  ["/servicios/camaras-de-seguridad", "Cámaras"],
  ["/nosotros", "Nosotros"],
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [path]);
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open) {
      d.showModal();
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        d.close();
        document.body.style.overflow = prev;
        trigger.current?.focus();
      };
    } else d.close();
  }, [open]);
  return (
    <>
      <header className="site-header">
        <Link href="/" aria-label="ICEMEX inicio" className="site-logo">
          <IcemexLogo
            width={168}
            height={58}
            sizes="168px"
            style={{ objectFit: "contain" }}
          />
        </Link>
        <nav className="site-desktop" aria-label="Navegación principal">
          {links.map(([url, label]) => (
            <Link
              key={url}
              href={url}
              aria-current={path === url ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="site-controls">
          <ThemeToggle />
          <Link className="header-quote" href="/#contacto">
            Cotizar ↗
          </Link>
          <button
            ref={trigger}
            className="menu-toggle"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            Menú
          </button>
        </div>
      </header>
      <dialog
        id="mobile-menu"
        ref={dialog}
        className="mobile-menu"
        onCancel={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div>
          <button
            autoFocus
            className="menu-close"
            onClick={() => setOpen(false)}
          >
            Cerrar menú ×
          </button>
          <nav aria-label="Navegación móvil">
            {links.map(([url, label]) => (
              <Link
                key={url}
                href={url}
                aria-current={path === url ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {label} ↗
              </Link>
            ))}
            <Link href="/catalogo" onClick={() => setOpen(false)}>
              Catálogo PDF ↗
            </Link>
            <Link href="/#contacto" onClick={() => setOpen(false)}>
              Cotizar proyecto ↗
            </Link>
          </nav>
        </div>
      </dialog>
    </>
  );
}

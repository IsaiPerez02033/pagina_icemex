"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessageSquare, PhoneCall } from "lucide-react";
import { buildWhatsAppUrlProyectos } from "@/lib/whatsapp";
import { sendEvent } from "@/lib/events";

export default function MobileBottomBar() {
  const pathname = usePathname();

  // No mostrar en panel de administración
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden w-[90%] max-w-[380px]">
      <nav
        aria-label="Navegación rápida móvil"
        className="flex items-center justify-around py-2 px-3 bg-[#0D1117]/90 dark:bg-[#0D1117]/90 border border-white/15 rounded-full backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all"
      >
        <Link
          href="/"
          className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] text-xs font-medium text-gray-300 hover:text-white active:scale-95 transition-all"
          aria-label="Ir a Inicio"
        >
          <Home className="w-5 h-5 mb-0.5 text-[var(--accent-cyan)]" />
          <span>Inicio</span>
        </Link>

        <Link
          href="/catalogo"
          className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] text-xs font-medium text-gray-300 hover:text-white active:scale-95 transition-all"
          aria-label="Ver Catálogo"
        >
          <BookOpen className="w-5 h-5 mb-0.5 text-[var(--accent-cyan)]" />
          <span>Catálogo</span>
        </Link>

        <Link
          href="/#contacto"
          className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] text-xs font-medium text-gray-300 hover:text-white active:scale-95 transition-all"
          aria-label="Ir a Cotizar"
        >
          <MessageSquare className="w-5 h-5 mb-0.5 text-[var(--accent-cyan)]" />
          <span>Cotizar</span>
        </Link>

        <a
          href={buildWhatsAppUrlProyectos("Hola ICEMEX, me gustaría solicitar una cotización desde su sitio web.")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sendEvent("whatsapp_click")}
          className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] text-xs font-medium text-emerald-400 hover:text-emerald-300 active:scale-95 transition-all"
          aria-label="Contactar por WhatsApp"
        >
          <PhoneCall className="w-5 h-5 mb-0.5 text-emerald-400 animate-pulse" />
          <span>WhatsApp</span>
        </a>
      </nav>
    </div>
  );
}

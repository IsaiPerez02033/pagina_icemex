"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { sendEvent } from "@/lib/events";

/**
 * Cuenta una página vista en cada cambio de ruta (incluida la navegación
 * interna con <Link>, que el script inline anterior no registraba) y los
 * clics a WhatsApp en cualquier parte del sitio público.
 */
export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const body = JSON.stringify({ path: pathname });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href*="wa.me"]');
      if (a) sendEvent("whatsapp_click");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

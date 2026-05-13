"use client";

import { useEffect, useState } from "react";
import { buildWhatsAppUrlVentas } from "@/lib/whatsapp";

// Re-export para no romper imports existentes
export { buildWhatsAppUrlProyectos, buildWhatsAppUrlVentas, buildWhatsAppUrl } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [showLabel, setShowLabel] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2800);
    const t2 = setTimeout(() => setShowLabel(false), 8000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  return (
    <a
      href={buildWhatsAppUrlVentas()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="wa-fab interactive"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <span className={`wa-tooltip ${showLabel ? "wa-tooltip-visible" : ""}`}>
        Cotiza por WhatsApp
      </span>

      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>

      <span className="wa-pulse" aria-hidden />
      <span className="wa-pulse wa-pulse-2" aria-hidden />

      <style jsx>{`
        .wa-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #25d366;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 12px 32px rgba(37, 211, 102, 0.45),
            0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 9000;
          transition:
            opacity 0.6s ease,
            transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.3s ease;
          cursor: none;
        }

        .wa-fab:hover {
          transform: translateY(-4px) scale(1.06) !important;
          box-shadow:
            0 18px 40px rgba(37, 211, 102, 0.6),
            0 6px 18px rgba(0, 0, 0, 0.4);
        }

        .wa-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #25d366;
          opacity: 0.5;
          z-index: -1;
          animation: wa-pulse 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          pointer-events: none;
        }

        .wa-pulse-2 {
          animation-delay: 1.2s;
        }

        @keyframes wa-pulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }

        .wa-tooltip {
          position: absolute;
          right: calc(100% + 14px);
          top: 50%;
          transform: translateY(-50%) translateX(8px);
          background: rgba(var(--card-rgb), 0.95);
          color: var(--text-primary);
          padding: 10px 16px;
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          white-space: nowrap;
          border: 1px solid rgba(var(--cyan-rgb), 0.2);
          border-radius: 2px;
          opacity: 0;
          pointer-events: none;
          backdrop-filter: blur(8px);
          transition:
            opacity 0.3s ease,
            transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wa-tooltip::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 100%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-left-color: rgba(var(--card-rgb), 0.95);
        }

        .wa-tooltip-visible {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        .wa-fab:hover .wa-tooltip {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        @media (max-width: 640px) {
          .wa-fab {
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
          }
          .wa-tooltip {
            display: none;
          }
        }
      `}</style>
    </a>
  );
}

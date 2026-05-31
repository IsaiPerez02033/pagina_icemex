"use client";

import { useSession } from "next-auth/react";
import { Bell, Menu, MessageCircle, FileText, Bot, Zap, ArrowRight } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

interface Props {
  onMenuClick: () => void;
}

interface TimelineEvent {
  name: string;
  ts: number;
}

const EVENT_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  whatsapp_click: MessageCircle,
  form_submit: Zap,
  pdf_download: FileText,
  chatbot_conversation: Bot,
};

const EVENT_LABELS: Record<string, string> = {
  whatsapp_click: "WhatsApp click",
  form_submit: "Formulario enviado",
  pdf_download: "PDF descargado",
  chatbot_conversation: "Chatbot conversación",
};

export default function Topbar({ onMenuClick }: Props) {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const longDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });
  const shortDate = format(new Date(), "dd MMM yyyy", { locale: es });

  useEffect(() => {
    fetch("/api/admin/recent-events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!showDropdown) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDropdown]);

  return (
    <header
      style={{
        padding: "clamp(10px, 2vw, 16px) clamp(12px, 3vw, 24px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(var(--cyan-rgb), 0.08)",
        background: "var(--bg-primary)",
        minHeight: 64,
        gap: 12,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <button onClick={onMenuClick} className="menu-btn" style={{ display: "none", width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(var(--cyan-rgb), 0.15)", background: "transparent", color: "var(--text-muted)", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Menu size={18} />
        </button>
        <div style={{ minWidth: 0 }}>
          <h1 className="topbar-date" style={{ color: "var(--text-primary)", fontSize: "clamp(14px, 2vw, 18px)", fontWeight: 500, letterSpacing: "0.02em", textTransform: "capitalize", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            <span className="date-long">{longDate}</span>
            <span className="date-short" style={{ display: "none" }}>{shortDate}</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "clamp(10px, 1vw, 12px)", letterSpacing: "0.06em", marginTop: 2, whiteSpace: "nowrap" }}>Panel de administración ICEMEX</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        {/* Bell + Dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowDropdown((v) => !v)}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              border: "1px solid rgba(var(--cyan-rgb), 0.15)", background: "transparent",
              color: "var(--text-muted)", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer", transition: "color 0.2s ease", flexShrink: 0,
              position: "relative",
            }}
          >
            <Bell size={16} />
            {events.length > 0 && (
              <span
                style={{
                  position: "absolute", top: 2, right: 2, width: 8, height: 8,
                  borderRadius: "50%", background: "var(--accent-cyan)",
                  boxShadow: "0 0 6px var(--accent-cyan)",
                }}
              />
            )}
          </button>

          {showDropdown && (
            <div
              style={{
                position: "absolute", top: 44, right: 0,                 width: "clamp(260px, 90vw, 320px)",
                background: "var(--bg-secondary)", border: "1px solid rgba(var(--cyan-rgb), 0.15)",
                borderRadius: 14, boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                zIndex: 9200, overflow: "hidden",
              }}
            >
              <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(var(--cyan-rgb), 0.08)" }}>
                <span style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500, letterSpacing: "0.04em" }}>Notificaciones</span>
              </div>

              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {events.length === 0 ? (
                  <div style={{ padding: "24px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>Sin notificaciones aún</div>
                ) : (
                  events.map((e, i) => {
                    const Icon = EVENT_ICONS[e.name] || Zap;
                    const label = EVENT_LABELS[e.name] || e.name;
                    const timeAgo = formatDistanceToNow(e.ts, { addSuffix: true, locale: es });
                    return (
                      <div
                        key={i}
                        style={{
                          padding: "10px 16px", display: "flex", alignItems: "center", gap: 10,
                          borderBottom: "1px solid rgba(var(--cyan-rgb), 0.04)",
                        }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(var(--cyan-rgb), 0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-cyan)", flexShrink: 0 }}>
                          <Icon size={14} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: "var(--text-primary)", fontSize: 12, letterSpacing: "0.02em" }}>{label}</div>
                          <div style={{ color: "var(--text-muted)", fontSize: 10, marginTop: 2 }}>{timeAgo}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <Link
                href="/admin/dashboard"
                onClick={() => setShowDropdown(false)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "10px 16px", borderTop: "1px solid rgba(var(--cyan-rgb), 0.08)",
                  color: "var(--accent-cyan)", fontSize: 12, letterSpacing: "0.06em",
                  textDecoration: "none",
                }}
              >
                Ver dashboard <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        <ThemeToggle />

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--accent-cyan)", color: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14, flexShrink: 0 }}>
            {session?.user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="avatar-text">
            <div style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>Admin</div>
            <div style={{ color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.04em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>
              {session?.user?.email}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 768px) {
            .menu-btn { display: flex !important; }
            .date-long { display: none !important; }
            .date-short { display: inline !important; }
          }
          @media (max-width: 480px) {
            .avatar-text { display: none !important; }
          }
        `
      }} />
    </header>
  );
}

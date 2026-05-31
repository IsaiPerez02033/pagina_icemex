"use client";

import { useSession } from "next-auth/react";
import { Bell, Menu } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ThemeToggle from "@/components/ThemeToggle";

interface Props {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: Props) {
  const { data: session } = useSession();

  const longDate = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });
  const shortDate = format(new Date(), "dd MMM yyyy", { locale: es });

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
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <button
          onClick={onMenuClick}
          className="menu-btn"
          style={{
            display: "none",
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid rgba(var(--cyan-rgb), 0.15)",
            background: "transparent",
            color: "var(--text-muted)",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Menu size={18} />
        </button>
        <div style={{ minWidth: 0 }}>
          <h1
            className="topbar-date"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(14px, 2vw, 18px)",
              fontWeight: 500,
              letterSpacing: "0.02em",
              textTransform: "capitalize",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span className="date-long">{longDate}</span>
            <span className="date-short" style={{ display: "none" }}>{shortDate}</span>
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "clamp(10px, 1vw, 12px)",
              letterSpacing: "0.06em",
              marginTop: 2,
              whiteSpace: "nowrap",
            }}
          >
            Panel de administración ICEMEX
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid rgba(var(--cyan-rgb), 0.15)",
            background: "transparent",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "color 0.2s ease",
            flexShrink: 0,
          }}
        >
          <Bell size={16} />
        </button>
        <ThemeToggle />

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--accent-cyan)",
              color: "var(--bg-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {session?.user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="avatar-text">
            <div style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>
              Admin
            </div>
            <div
              style={{
                color: "var(--text-muted)",
                fontSize: 11,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 160,
              }}
            >
              {session?.user?.email}
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 768px) {
              .menu-btn { display: flex !important; }
              .date-long { display: none !important; }
              .date-short { display: inline !important; }
            }
            @media (max-width: 480px) {
              .avatar-text { display: none !important; }
            }
          `,
        }}
      />
    </header>
  );
}

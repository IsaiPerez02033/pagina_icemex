"use client";

import { useSession } from "next-auth/react";
import { Bell, Zap } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Topbar() {
  const { data: session } = useSession();
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });

  return (
    <header
      style={{
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(var(--cyan-rgb), 0.08)",
        background: "var(--bg-primary)",
        minHeight: 64,
      }}
    >
      <div>
        <h1
          style={{
            color: "var(--text-primary)",
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "0.02em",
            textTransform: "capitalize",
          }}
        >
          {today}
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 12,
            letterSpacing: "0.06em",
            marginTop: 2,
          }}
        >
          Panel de administración ICEMEX
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
          }}
        >
          <Bell size={16} />
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
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
            }}
          >
            {session?.user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>
            <div style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500 }}>
              Admin
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.04em" }}>
              {session?.user?.email}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

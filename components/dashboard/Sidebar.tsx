"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Search,
  MousePointerClick,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
} from "lucide-react";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/behavior", label: "Comportamiento", icon: MousePointerClick },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: collapsed ? 64 : 240,
        minHeight: "100dvh",
        background: "var(--bg-secondary)",
        borderRight: "1px solid rgba(var(--cyan-rgb), 0.08)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 16px",
          borderBottom: "1px solid rgba(var(--cyan-rgb), 0.08)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "var(--accent-cyan)",
            color: "var(--bg-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          I
        </div>
        {!collapsed && (
          <span
            style={{
              color: "var(--text-primary)",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            ICEMEX
            <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 10, display: "block", letterSpacing: "0.12em" }}>
              Admin
            </span>
          </span>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                color: active ? "var(--accent-cyan)" : "var(--text-muted)",
                background: active ? "rgba(var(--cyan-rgb), 0.08)" : "transparent",
                textDecoration: "none",
                fontSize: 13,
                letterSpacing: "0.02em",
                transition: "all 0.2s ease",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <l.icon size={18} />
              {!collapsed && l.label}
            </Link>
          );
        })}
      </nav>

      {/* Collapse + Logout */}
      <div
        style={{
          padding: "8px",
          borderTop: "1px solid rgba(var(--cyan-rgb), 0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <button
          onClick={() => setCollapsed((c) => !c)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 10,
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontSize: 13,
            transition: "color 0.2s ease",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && "Colapsar"}
        </button>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 10,
            background: "transparent",
            border: "none",
            color: "var(--accent-red)",
            cursor: "pointer",
            fontSize: 13,
            transition: "color 0.2s ease",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <LogOut size={18} />
          {!collapsed && "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
}

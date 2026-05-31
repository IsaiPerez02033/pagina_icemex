"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SessionProvider>
      <div
        style={{
          display: "flex",
          minHeight: "100dvh",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main
            style={{
              flex: 1,
              padding: "clamp(12px, 3vw, 24px)",
              overflowY: "auto",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}

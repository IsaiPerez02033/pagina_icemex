"use client";

import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
        <Sidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Topbar />
          <main style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}

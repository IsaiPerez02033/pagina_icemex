"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse at center, var(--bg-secondary) 0%, var(--bg-primary) 70%)",
      }}
    />
  ),
});

export default function HeroSection() {
  return <HeroScene />;
}

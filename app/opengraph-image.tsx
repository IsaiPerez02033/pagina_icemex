import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ICEMEX — Iluminación pública, postes y luminarias LED";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #060910 0%, #0D1117 60%, #060910 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div
            style={{
              color: "#00D4FF",
              fontSize: 24,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            ICEMEX
          </div>
          <div
            style={{
              color: "#E8EDF5",
              fontSize: 52,
              fontWeight: 300,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textAlign: "center",
              maxWidth: 900,
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Iluminamos tus sueños,
            <br />
            materializamos tus ideas
          </div>
          <div
            style={{
              color: "#4A5568",
              fontSize: 20,
              letterSpacing: "0.08em",
              marginTop: 12,
            }}
          >
            Iluminación pública · Postes · Luminarias LED · Solar · Herrajes
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            color: "#00D4FF",
            fontSize: 14,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          icemex.mx
        </div>
      </div>
    ),
    { ...size }
  );
}

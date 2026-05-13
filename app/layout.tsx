import type { Metadata, Viewport } from "next";
import "./globals.css";
import GSAPProvider from "@/components/GSAPProvider";
import LoadingScreen from "@/components/LoadingScreen";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "ICEMEX — Iluminando el futuro de México",
  description:
    "ICEMEX (Importaciones y Comercializaciones Eléctricas de México S.A. de C.V.) — Iluminación pública, exterior e interior, postes cónicos y rectos circulares.",
  keywords: [
    "ICEMEX",
    "iluminación pública",
    "postes cónicos",
    "postes rectos",
    "luminarias LED",
    "México",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#060910",
};

// Script inline que se ejecuta antes del render para aplicar el tema
// guardado o el del sistema. Evita el "flash" de modo oscuro->claro al cargar.
const themeBootstrap = `
(function() {
  try {
    var stored = localStorage.getItem('icemex-theme');
    var theme = stored;
    if (theme !== 'light' && theme !== 'dark') {
      theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        <GSAPProvider>
          <LoadingScreen />
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <ChatWidget />
        </GSAPProvider>
      </body>
    </html>
  );
}

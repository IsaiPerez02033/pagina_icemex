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
  metadataBase: new URL("https://icemex.mx"),
  title: {
    default: "ICEMEX — Iluminación pública, postes y material eléctrico en México",
    template: "%s · ICEMEX",
  },
  description:
    "ICEMEX S.A. de C.V. — Más de 20 años fabricando y distribuyendo luminarias LED, postes cónicos y rectos, herrajes, bases de concreto y material eléctrico. Iluminación pública, solar, comercial e industrial en toda la República Mexicana.",
  keywords: [
    "ICEMEX",
    "iluminación pública",
    "luminarias LED",
    "postes cónicos",
    "postes rectos",
    "postes circulares",
    "herrajes",
    "bases de concreto",
    "brazos",
    "material eléctrico",
    "alumbrado público",
    "iluminación solar",
    "reflectores LED",
    "luminarias urbanas",
    "bolardos",
    "fabricación de postes",
    "México",
    "Huehuetoca",
    "Estado de México",
  ],
  authors: [{ name: "ICEMEX S.A. de C.V." }],
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://icemex.mx",
    siteName: "ICEMEX",
    title: "ICEMEX — Iluminando el futuro de México",
    description:
      "Fabricación, distribución y comercialización de material eléctrico, herrajes, postería y luminarias LED. +20 años iluminando México.",
    images: [
      {
        url: "/logo_icemex.png",
        width: 560,
        height: 190,
        alt: "ICEMEX logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ICEMEX — Iluminando el futuro de México",
    description:
      "Fabricación, distribución y comercialización de material eléctrico, herrajes, postería y luminarias LED.",
    images: ["/logo_icemex.png"],
  },
  alternates: {
    canonical: "https://icemex.mx",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "ICEMEX S.A. de C.V.",
              alternateName: "ICEMEX",
              description:
                "Fabricación, distribución y comercialización de material eléctrico, herrajes, postería y luminarias LED. Alumbrado público, iluminación solar, postes, reflectores y brazos en México desde 2004.",
              url: "https://icemex.mx",
              telephone: "+52 593 916 3264",
              email: "icemexjorobas@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Jorobas, Local 23D",
                addressLocality: "Huehuetoca",
                addressRegion: "Estado de México",
                addressCountry: "MX",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 19.8489,
                longitude: -99.2052,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "09:00",
                closes: "18:00",
              },
              sameAs: [
                "https://www.facebook.com/icemex3",
                "https://www.instagram.com/icemex",
                "https://www.tiktok.com/@icemex3",
                "https://www.linkedin.com/in/icemex-sa-de-cv-08784113a",
              ],
              knowsAbout: [
                "Alumbrado público",
                "Iluminación LED",
                "Iluminación solar",
                "Postes cónicos",
                "Postes rectos circulares",
                "Reflectores LED",
                "Brazos y herrajes",
                "Bases de concreto",
                "Material eléctrico",
                "Luminarias urbanas",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Catálogo ICEMEX 2026",
                itemListElement: [
                  { "@type": "Offer", itemOffered: { "@type": "Product", name: "Alumbrado público" } },
                  { "@type": "Offer", itemOffered: { "@type": "Product", name: "Iluminación solar" } },
                  { "@type": "Offer", itemOffered: { "@type": "Product", name: "Luminarios urbanos" } },
                  { "@type": "Offer", itemOffered: { "@type": "Product", name: "Reflectores" } },
                  { "@type": "Offer", itemOffered: { "@type": "Product", name: "Luminarios comerciales" } },
                  { "@type": "Offer", itemOffered: { "@type": "Product", name: "Postes y postería" } },
                  { "@type": "Offer", itemOffered: { "@type": "Product", name: "Brazos y herrajes" } },
                ],
              },
            }),
          }}
        />
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

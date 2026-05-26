import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"));

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

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
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ICEMEX — Iluminación pública y material eléctrico",
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
  verification: {
    google: "4mP768N3j_ujGtXneggK335WwUEprNw3ubCJN5m1-Fk",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#060910",
};

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
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
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
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
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Alumbrado público" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Iluminación solar" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Luminarios urbanos" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Reflectores" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Luminarios comerciales" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Postes y postería" } },
                  { "@type": "Offer", itemOffered: { "@type": "Service", name: "Brazos y herrajes" } },
                ],
              },
            }),
          }}
        />
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");`,
            }}
          />
        )}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}',{send_page_view:true});`,
              }}
            />
          </>
        )}
      </head>
      <body>
        <CustomCursor />
        {children}
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `fetch("/api/events",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:location.pathname})}).catch(()=>{})`,
          }}
        />
      </body>
    </html>
  );
}

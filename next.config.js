/** @type {import('next').NextConfig} */

const legacyCodes = require("./lib/legacy-codes.json");

// Cabeceras de seguridad para todo el sitio. La CSP se limita a directivas
// que no rompen los scripts inline (tema, JSON-LD, Clarity): impide que otro
// sitio meta icemex.mx en un iframe, plugins y cambios de <base>/<form>.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
];

const nextConfig = {
  skipTrailingSlashRedirect: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ["gsap", "@react-three/fiber", "three", "lucide-react"],
  },
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none';",
  },
  async redirects() {
    // Productos que tenían un código distinto al del catálogo oficial.
    return [
      ...Object.entries(legacyCodes).map(([from, to]) => ({
        source: `/producto/${from}`,
        destination: `/producto/${to}`,
        permanent: true,
      })),
      // Ficha duplicada que se eliminó (mismo contenido que BAS-0010).
      { source: "/fichas/BASE-PIRAMIDAL.pdf", destination: "/fichas/BAS-0010.pdf", permanent: true },
    ];
  },
  async headers() {
    // PDFs (catálogo y fichas): cambian poco, se cachean 1 día en el
    // navegador y 7 en el CDN.
    const pdfCache = [
      {
        key: "Cache-Control",
        value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    ];
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/Catalogo_ICEMEX2026.pdf", headers: pdfCache },
      { source: "/Catalogo_Videovigilancia_ICEMEX2026.pdf", headers: pdfCache },
      { source: "/fichas/:file", headers: pdfCache },
      { source: "/fichas/img/:file", headers: pdfCache },
    ];
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  skipTrailingSlashRedirect: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: [
      "gsap",
      "@react-three/fiber",
      "@react-three/drei",
      "@react-three/postprocessing",
      "three",
    ],
  },
  images: {
    remotePatterns: [],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none';",
  },
};

module.exports = nextConfig;

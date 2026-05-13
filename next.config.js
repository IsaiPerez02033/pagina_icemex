/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;

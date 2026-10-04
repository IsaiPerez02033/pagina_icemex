import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { standaloneFichas } from "@/lib/fichas";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://icemex.mx";

  const coreRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/servicios/camaras-de-seguridad`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/productos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/nosotros`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/servicios`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/catalogo`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/producto/${p.code}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const fichaRoutes: MetadataRoute.Sitemap = standaloneFichas.map((f) => ({
    url: `${baseUrl}/producto/${f.code}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...coreRoutes, ...productRoutes, ...fichaRoutes];
}

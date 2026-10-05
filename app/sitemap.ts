import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { fichaForProduct, standaloneFichas, type Ficha } from "@/lib/fichas";

const baseUrl = "https://icemex.mx";

// Foto del producto y portada de su ficha (Google Imágenes).
const images = (f?: Ficha) => (f ? [`${baseUrl}${f.image.src}`, `${baseUrl}${f.cover.src}`] : undefined);

export default function sitemap(): MetadataRoute.Sitemap {
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
    priority: 0.7,
    images: images(fichaForProduct(p.code)),
  }));

  const fichaRoutes: MetadataRoute.Sitemap = standaloneFichas.map((f) => ({
    url: `${baseUrl}/producto/${f.code}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    images: images(f),
  }));

  return [...coreRoutes, ...productRoutes, ...fichaRoutes];
}

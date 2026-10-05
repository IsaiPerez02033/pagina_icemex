import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { cameraCatalog, catalog, fichaForProduct, getFicha, lineShowcase, standaloneFichas, type Ficha } from "@/lib/fichas";
import { projects } from "@/lib/projects";

const baseUrl = "https://icemex.mx";

// Foto del producto y portada de su ficha (Google Imágenes).
const images = (f?: Ficha) => (f ? [`${baseUrl}${f.image.src}`, `${baseUrl}${f.cover.src}`] : undefined);

// Fotos que se ven en cada página principal.
const abs = (src: string) => `${baseUrl}${src}`;
const projectPhoto = (slug: string) => abs(projects.find((p) => p.image.includes(slug))!.image);
const photos = (...slugs: string[]) => slugs.map(projectPhoto);
const linePhotos = lineShowcase().map((l) => abs(l.photo.src));
const cameraPhotos = ["CV-Q35", "CV-Q19", "CV-C07", "CV-Q29", "CV-Q32", "CV-D21S"].map((c) => abs(getFicha(c)!.image.src));

export default function sitemap(): MetadataRoute.Sitemap {
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [...linePhotos, ...projects.map((p) => abs(p.image))],
    },
    {
      url: `${baseUrl}/servicios/camaras-de-seguridad`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      images: [abs(cameraCatalog.cover.src), ...cameraPhotos],
    },
    { url: `${baseUrl}/productos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9, images: linePhotos },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      images: [
        ...photos("andador-gam", "fonatur", "corredor-solar", "vialidad-nocturna", "vialidad-parque", "postes-torre", "kia", "acolman"),
        abs(catalog.cover.src),
      ],
    },
    {
      url: `${baseUrl}/servicios`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      images: photos("vialidad-parque", "solar-rural", "vialidad-nocturna", "andador-gam", "postes-torre", "fonatur", "corredor-solar", "acolman"),
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      images: [abs(catalog.cover.src), abs(cameraCatalog.cover.src)],
    },
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

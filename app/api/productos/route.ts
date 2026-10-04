import { NextRequest, NextResponse } from "next/server";
import { lineNames, tagNames } from "@/lib/products";
import {
  catalogProducts as products,
  fichas,
  fichaForProduct,
  fichaSpecs,
  getFicha,
  LEGACY_CODES,
} from "@/lib/fichas";

// Versión ligera de cada ficha para consumidores externos (sin texto largo).
const fichaSummary = (f: NonNullable<ReturnType<typeof getFicha>>) => ({
  code: f.code,
  name: f.name,
  line: f.line,
  pdf: `https://icemex.mx${f.pdf}`,
  image: `https://icemex.mx${f.cover.src}`,
  photo: `https://icemex.mx${f.image.src}`,
});

// Catálogo público de ICEMEX, consumido por el asistente de WhatsApp del
// almacén (icemex-almacen-api) para generar fichas técnicas. Mismos datos
// que ya se muestran en /catalogo y /productos, sin información sensible.
const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (code) {
    // Acepta también los códigos viejos que el sitio usaba antes de alinearse
    // al catálogo oficial (p. ej. IS-LA1005 → IS-LA1014).
    const legacy = Object.entries(LEGACY_CODES).find(
      ([old]) => old.toLowerCase() === code.toLowerCase()
    )?.[1];
    const wanted = (legacy ?? code).toLowerCase();
    const producto = products.find((p) => p.code.toLowerCase() === wanted);
    if (producto) {
      const ficha = fichaForProduct(producto.code);
      return NextResponse.json(
        { producto, ficha: ficha ? fichaSummary(ficha) : null },
        { headers: CACHE_HEADERS }
      );
    }
    const ficha = getFicha(wanted);
    if (ficha) {
      // Misma forma que Product para no romper a los consumidores actuales.
      const fromFicha = {
        code: ficha.code,
        name: ficha.name,
        line: ficha.line,
        tags: ficha.tags,
        tagline: ficha.kind,
        description: ficha.description.join("\n\n"),
        applications: ficha.applications,
        specs: fichaSpecs(ficha),
        features: [...ficha.features, ...ficha.advantages].map((x) => `${x.t}: ${x.d}`),
        certifications: ficha.certs.map((c) => c.c),
        warranty: ficha.warranty.join(" · ") || undefined,
      };
      return NextResponse.json(
        { producto: fromFicha, ficha: fichaSummary(ficha) },
        { headers: CACHE_HEADERS }
      );
    }
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404, headers: CACHE_HEADERS }
    );
  }

  return NextResponse.json(
    { products, lineNames, tagNames, fichas: fichas.map(fichaSummary) },
    { headers: CACHE_HEADERS }
  );
}

import { NextRequest, NextResponse } from "next/server";
import { products, lineNames, tagNames } from "@/lib/products";

// Catálogo público de ICEMEX, consumido por el asistente de WhatsApp del
// almacén (icemex-almacen-api) para generar fichas técnicas. Mismos datos
// que ya se muestran en /catalogo y /productos, sin información sensible.
const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (code) {
    const producto = products.find(
      (p) => p.code.toLowerCase() === code.toLowerCase()
    );
    if (!producto) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404, headers: CACHE_HEADERS }
      );
    }
    return NextResponse.json({ producto }, { headers: CACHE_HEADERS });
  }

  return NextResponse.json(
    { products, lineNames, tagNames },
    { headers: CACHE_HEADERS }
  );
}

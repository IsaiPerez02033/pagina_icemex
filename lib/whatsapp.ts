// Utilidad pura (server-safe) para construir URLs de WhatsApp.
// Dos líneas de contacto: proyectos (primario) y venta público (secundario).

const PHONE_PROYECTOS = "525575149833";
const PHONE_VENTAS = "525565448428";

const DEFAULT_MESSAGE =
  "Hola ICEMEX, me interesa cotizar productos del catálogo. ¿Pueden ayudarme?";

/**
 * WhatsApp para proyectos / cotizaciones (PRIMARIO).
 * Usar en: formulario de contacto, cotización de proyectos, fichas técnicas.
 */
export const buildWhatsAppUrlProyectos = (message: string = DEFAULT_MESSAGE) =>
  `https://wa.me/${PHONE_PROYECTOS}?text=${encodeURIComponent(message)}`;

/**
 * WhatsApp para venta al público (SECUNDARIO).
 * Usar en: FAB flotante, consultas generales.
 */
export const buildWhatsAppUrlVentas = (message: string = DEFAULT_MESSAGE) =>
  `https://wa.me/${PHONE_VENTAS}?text=${encodeURIComponent(message)}`;

/**
 * @deprecated Usar buildWhatsAppUrlProyectos o buildWhatsAppUrlVentas.
 */
export const buildWhatsAppUrl = buildWhatsAppUrlProyectos;

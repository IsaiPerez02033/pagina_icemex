import Image, { type ImageProps } from "next/image";

type Props = Omit<ImageProps, "src" | "alt"> & {
  alt?: string;
  className?: string;
};

/**
 * Logo de ICEMEX que se intercambia automáticamente entre la versión
 * blanca (modo oscuro) y la versión negra/color (modo claro) usando CSS
 * basado en `html[data-theme]`. Renderiza ambas imágenes; la inactiva
 * queda con `display: none`.
 *
 * Acepta cualquier prop de next/image (width, height, fill, sizes,
 * priority, style, etc.) y la propaga a ambas variantes.
 */
export default function IcemexLogo({ alt = "ICEMEX", className, ...rest }: Props) {
  const base = "icemex-logo";
  const extra = className ? ` ${className}` : "";
  return (
    <>
      <Image
        {...rest}
        src="/logo_icemex.png"
        alt={alt}
        className={`${base} ${base}--dark${extra}`}
      />
      <Image
        {...rest}
        src="/logo_icemex_modo_claro.png"
        alt={alt}
        className={`${base} ${base}--light${extra}`}
      />
    </>
  );
}

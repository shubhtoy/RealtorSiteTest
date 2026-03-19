import type { ImgHTMLAttributes } from "react";

type OptimizedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  sizes?: string;
};

const RESPONSIVE_WIDTHS = [640, 1280, 1920] as const;

function getOptimizedBase(src: string): string | null {
  if (!src.startsWith("/images/") && !src.startsWith("/uploads/")) return null;
  const dot = src.lastIndexOf(".");
  if (dot === -1) return null;
  const withoutExt = src.slice(0, dot);
  if (withoutExt.startsWith("/images/")) {
    return withoutExt.replace("/images/", "/images-optimized/");
  }
  return withoutExt.replace("/uploads/", "/uploads-optimized/");
}

function buildSrcSet(base: string, format: "avif" | "webp"): string {
  return RESPONSIVE_WIDTHS.map((width) => `${base}-${width}.${format} ${width}w`).join(", ");
}

export function OptimizedImage({ src, alt, sizes = "100vw", loading = "lazy", decoding = "async", ...rest }: OptimizedImageProps) {
  const optimizedBase = getOptimizedBase(src);

  if (!optimizedBase) {
    return <img src={src} alt={alt} loading={loading} decoding={decoding} {...rest} />;
  }

  const avifSet = buildSrcSet(optimizedBase, "avif");
  const webpSet = buildSrcSet(optimizedBase, "webp");

  return (
    <picture>
      <source type="image/avif" srcSet={avifSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSet} sizes={sizes} />
      <img src={src} alt={alt} loading={loading} decoding={decoding} {...rest} />
    </picture>
  );
}

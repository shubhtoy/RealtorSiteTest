import type { ImgHTMLAttributes } from "react";

type OptimizedImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  sizes?: string;
};

const RESPONSIVE_WIDTHS = [640, 1280, 1920] as const;

function resolveAssetPath(path: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;

  if (path.startsWith("/")) {
    return normalizedBase ? `${normalizedBase}${path}` : path;
  }

  return `${base.endsWith("/") ? base : `${base}/`}${path}`;
}

function stripBasePath(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  if (base !== "/" && path.startsWith(base)) {
    return `/${path.slice(base.length).replace(/^\/+/, "")}`;
  }
  return path;
}

function getOptimizedBase(src: string): string | null {
  const normalizedSrc = stripBasePath(src);
  if (!normalizedSrc.startsWith("/images/") && !normalizedSrc.startsWith("/uploads/")) return null;
  const dot = normalizedSrc.lastIndexOf(".");
  if (dot === -1) return null;
  const withoutExt = normalizedSrc.slice(0, dot);
  if (withoutExt.startsWith("/images/")) {
    return withoutExt.replace("/images/", "/images-optimized/");
  }
  return withoutExt.replace("/uploads/", "/uploads-optimized/");
}

function buildSrcSet(base: string, format: "avif" | "webp"): string {
  return RESPONSIVE_WIDTHS.map((width) => `${resolveAssetPath(`${base}-${width}.${format}`)} ${width}w`).join(", ");
}

export function OptimizedImage({ src, alt, sizes = "100vw", loading = "lazy", decoding = "async", ...rest }: OptimizedImageProps) {
  const optimizedBase = getOptimizedBase(src);
  const resolvedSrc = resolveAssetPath(src);

  if (!optimizedBase) {
    return <img src={resolvedSrc} alt={alt} loading={loading} decoding={decoding} {...rest} />;
  }

  const avifSet = buildSrcSet(optimizedBase, "avif");
  const webpSet = buildSrcSet(optimizedBase, "webp");

  return (
    <picture>
      <source type="image/avif" srcSet={avifSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSet} sizes={sizes} />
      <img src={resolvedSrc} alt={alt} loading={loading} decoding={decoding} {...rest} />
    </picture>
  );
}

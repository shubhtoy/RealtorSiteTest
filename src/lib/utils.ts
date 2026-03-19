import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveAppHref(href: string) {
  if (!href) return href

  if (/^(?:[a-z]+:)?\/\//i.test(href) || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return href
  }

  const base = import.meta.env.BASE_URL || "/"
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base

  if (href.startsWith("/")) {
    return normalizedBase ? `${normalizedBase}${href}` : href
  }

  return `${base.endsWith("/") ? base : `${base}/`}${href}`
}

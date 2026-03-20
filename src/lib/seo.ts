export interface PageMetaOptions {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
}

function updateMeta(nameOrProperty: string, content: string, attr: "name" | "property" = "name") {
  const selector = `meta[${attr}="${nameOrProperty}"]`;
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, nameOrProperty);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function updateCanonical(path: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", `https://babaflats.com${path}`);
}

export function setPageMeta(options: PageMetaOptions): void;
/** @deprecated Use the object overload instead */
export function setPageMeta(title: string, description: string, canonicalPath?: string): void;
export function setPageMeta(
  titleOrOptions: string | PageMetaOptions,
  description?: string,
  canonicalPath?: string,
): void {
  const opts: PageMetaOptions =
    typeof titleOrOptions === "string"
      ? { title: titleOrOptions, description: description ?? "", canonicalPath }
      : titleOrOptions;

  document.title = opts.title;

  updateMeta("description", opts.description);
  updateMeta("og:title", opts.title, "property");
  updateMeta("og:description", opts.description, "property");

  if (opts.ogImage) {
    updateMeta("og:image", opts.ogImage, "property");
  }

  if (opts.canonicalPath) {
    updateCanonical(opts.canonicalPath);
  }
}

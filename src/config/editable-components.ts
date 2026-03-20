/**
 * Configuration mapping for editable components
 * This connects actual site components to Puck editor definitions
 */

type EditablePropMap = Record<string, unknown>;

function parseDataProps(element: HTMLElement): EditablePropMap {
  const dataProps = element.getAttribute('data-props');
  if (!dataProps) return {};

  try {
    // JSON.parse returns `any` — cast to `unknown` for safe narrowing
    const parsed = JSON.parse(dataProps) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    return parsed as EditablePropMap;
  } catch {
    return {};
  }
}

function getStringProp(props: EditablePropMap, key: string): string | null {
  const value = props[key];
  return typeof value === 'string' ? value : null;
}

export type EditableComponentConfig = {
  // Selector to find the component in DOM
  selector: string;
  // Component type name (matches Puck config)
  type: string;
  // Path in the content structure (e.g., "home.hero", "global.header")
  path: string;
  // Function to extract props from the component
  extractProps?: (element: HTMLElement) => EditablePropMap;
  // Function to apply props to the component
  applyProps?: (element: HTMLElement, props: EditablePropMap) => void;
};

// Configuration for all editable components on the site
export const EDITABLE_COMPONENTS: EditableComponentConfig[] = [
  {
    selector: '[data-editable="site-header"]',
    type: "SiteHeader",
    path: "global.header",
    extractProps: (element) => {
      const parsedProps = parseDataProps(element);
      if (Object.keys(parsedProps).length > 0) {
        return {
          siteName: String(parsedProps.siteName ?? ""),
          tagline: String(parsedProps.tagline ?? ""),
          navCtaText: String(parsedProps.navCtaText ?? ""),
          navCtaLink: String(parsedProps.navCtaLink ?? ""),
          cityLabel: String(parsedProps.cityLabel ?? ""),
        };
      }
      
      // Fallback to DOM extraction
      const props: EditablePropMap = {};
      const siteNameEl = element.querySelector('[data-prop="siteName"]');
      const cityLabelEl = element.querySelector('[data-prop="cityLabel"]');
      const taglineEl = element.querySelector('[data-prop="tagline"]');
      const ctaEl = element.querySelector('[data-prop="cta"]');
      
      if (siteNameEl) props.siteName = siteNameEl.textContent;
      if (cityLabelEl) props.cityLabel = cityLabelEl.textContent;
      if (taglineEl) props.tagline = taglineEl.textContent;
      if (ctaEl) {
        props.navCtaText = ctaEl.textContent;
        props.navCtaLink = ctaEl.getAttribute('href') || "";
      }
      
      return props;
    },
    applyProps: (element, props) => {
      // Apply props back to the component
      const siteNameEl = element.querySelector('[data-prop="siteName"]');
      const cityLabelEl = element.querySelector('[data-prop="cityLabel"]');
      const taglineEl = element.querySelector('[data-prop="tagline"]');
      const ctaEl = element.querySelector('[data-prop="cta"]');

      const siteName = getStringProp(props, 'siteName');
      const cityLabel = getStringProp(props, 'cityLabel');
      const tagline = getStringProp(props, 'tagline');
      const navCtaText = getStringProp(props, 'navCtaText');
      const navCtaLink = getStringProp(props, 'navCtaLink');
      
      if (siteNameEl && siteName) siteNameEl.textContent = siteName;
      if (cityLabelEl && cityLabel) cityLabelEl.textContent = cityLabel;
      if (taglineEl && tagline) taglineEl.textContent = tagline;
      if (ctaEl && navCtaText) {
        ctaEl.textContent = navCtaText;
        if (navCtaLink) ctaEl.setAttribute('href', navCtaLink);
      }
    },
  },
  {
    selector: '[data-editable="site-footer"]',
    type: "SiteFooter",
    path: "global.footer",
    extractProps: (element) => {
      const parsedProps = parseDataProps(element);
      if (Object.keys(parsedProps).length > 0) {
        return {
          siteName: String(parsedProps.siteName ?? ""),
          description: String(parsedProps.description ?? ""),
          footerBadges: Array.isArray(parsedProps.footerBadges) ? parsedProps.footerBadges : [],
          phone: String(parsedProps.phone ?? ""),
          email: String(parsedProps.email ?? ""),
          addressLine: String(parsedProps.addressLine ?? ""),
          hoursLine: String(parsedProps.hoursLine ?? ""),
        };
      }
      
      // Fallback to DOM extraction
      const props: EditablePropMap = {};
      const siteNameEl = element.querySelector('[data-prop="siteName"]');
      const descriptionEl = element.querySelector('[data-prop="description"]');
      const footerBadgesEl = element.querySelector('[data-prop="footerBadges"]');
      
      if (siteNameEl) props.siteName = siteNameEl.textContent;
      if (descriptionEl) props.description = descriptionEl.textContent;
      if (footerBadgesEl) {
        // Extract badges from DOM
        const badges = Array.from(footerBadgesEl.querySelectorAll('.badge')).map(b => b.textContent);
        props.footerBadges = badges;
      }
      
      return props;
    },
    applyProps: (element, props) => {
      // Apply props back to the component
      const siteNameEl = element.querySelector('[data-prop="siteName"]');
      const descriptionEl = element.querySelector('[data-prop="description"]');
      const footerBadgesEl = element.querySelector('[data-prop="footerBadges"]');

      const siteName = getStringProp(props, 'siteName');
      const description = getStringProp(props, 'description');
      
      if (siteNameEl && siteName) siteNameEl.textContent = siteName;
      if (descriptionEl && description) descriptionEl.textContent = description;
      if (footerBadgesEl && props.footerBadges) {
        // Updating badge lists requires a full re-render from React state.
      }
    },
  },
  {
    selector: '[data-editable="home-hero"]',
    type: "HomeHero",
    path: "home.hero",
    extractProps: (element) => {
      const parsedProps = parseDataProps(element);
      if (Object.keys(parsedProps).length > 0) {
        return parsedProps;
      }
      
      const props: EditablePropMap = {};
      const titleEl = element.querySelector('[data-prop="title"]');
      const taglineEl = element.querySelector('[data-prop="tagline"]');
      const highlightEl = element.querySelector('[data-prop="highlight"]');
      const descriptionEl = element.querySelector('[data-prop="description"]');
      const primaryCtaEl = element.querySelector('[data-prop="primaryCta"]');
      const secondaryCtaEl = element.querySelector('[data-prop="secondaryCta"]');
      
      if (titleEl) props.title = titleEl.textContent;
      if (taglineEl) props.tagline = taglineEl.textContent;
      if (highlightEl) props.highlightText = highlightEl.textContent;
      if (descriptionEl) props.description = descriptionEl.textContent;
      if (primaryCtaEl) {
        props.primaryCtaText = primaryCtaEl.textContent;
        props.primaryCtaLink = primaryCtaEl.getAttribute('href');
      }
      if (secondaryCtaEl) {
        props.secondaryCtaText = secondaryCtaEl.textContent;
        props.secondaryCtaLink = secondaryCtaEl.getAttribute('href');
      }
      
      return props;
    },
  },
  {
    selector: '[data-editable="home-stats"]',
    type: "HomeStats",
    path: "home.stats",
    extractProps: (element) => parseDataProps(element),
  },
  {
    selector: '[data-editable="home-amenities"]',
    type: "HomeAmenities",
    path: "home.amenityPanels",
    extractProps: (element) => parseDataProps(element),
  },
  {
    selector: '[data-editable="home-testimonials"]',
    type: "HomeTestimonials",
    path: "home.testimonials",
    extractProps: (element) => parseDataProps(element),
  },
  {
    selector: '[data-editable="home-why"]',
    type: "HomeWhy",
    path: "home.whyCards",
    extractProps: (element) => parseDataProps(element),
  },
  {
    selector: '[data-editable="home-faq"]',
    type: "HomeFaq",
    path: "home.faq",
    extractProps: (element) => parseDataProps(element),
  },
  {
    selector: '[data-editable="gallery-hero"]',
    type: "GalleryHero",
    path: "gallery.hero",
  },
  {
    selector: '[data-editable="contact-form"]',
    type: "ContactForm",
    path: "contact.form",
  },
];

/**
 * Helper function to get component config by type
 */
export function getComponentConfig(type: string): EditableComponentConfig | undefined {
  return EDITABLE_COMPONENTS.find(comp => comp.type === type);
}

/**
 * Helper function to get component config by selector
 */
export function getComponentConfigBySelector(selector: string): EditableComponentConfig | undefined {
  return EDITABLE_COMPONENTS.find(comp => comp.selector === selector);
}

/**
 * Helper function to get component config by path
 */
export function getComponentConfigByPath(path: string): EditableComponentConfig | undefined {
  return EDITABLE_COMPONENTS.find(comp => comp.path === path);
}

/**
 * Extract all editable components from the current page
 */
export function extractEditableComponents(): Array<{
  element: HTMLElement;
  config: EditableComponentConfig;
  props: EditablePropMap;
}> {
  const results: Array<{
    element: HTMLElement;
    config: EditableComponentConfig;
    props: EditablePropMap;
  }> = [];

  EDITABLE_COMPONENTS.forEach(config => {
    const elements = document.querySelectorAll(config.selector);
    elements.forEach(element => {
      const props = config.extractProps 
        ? config.extractProps(element as HTMLElement)
        : {};
      
      results.push({
        element: element as HTMLElement,
        config,
        props,
      });
    });
  });

  return results;
}
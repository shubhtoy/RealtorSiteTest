import { describe, expect, it } from "vitest";
import { defaultEditableSiteDocument } from "@/lib/editable-content-defaults";
import { coerceEditableSiteDocument, validateEditableSiteDocument } from "@/lib/editable-content-store";

describe("editable-content-store validation", () => {
  it("accepts the default editable document", () => {
    const result = validateEditableSiteDocument(defaultEditableSiteDocument);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects malformed required types", () => {
    const malformed = {
      ...defaultEditableSiteDocument,
      global: {
        ...defaultEditableSiteDocument.global,
        navLinks: [{ to: 123, label: "Home" }],
      },
      home: {
        ...defaultEditableSiteDocument.home,
        stats: [{ value: "100", suffix: "+", label: "Residents" }],
      },
    // Intentionally malformed document for testing validation — double cast required
    } as unknown as typeof defaultEditableSiteDocument;

    const result = validateEditableSiteDocument(malformed);
    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.includes("global.navLinks"))).toBe(true);
    expect(result.errors.some((error) => error.includes("home.stats"))).toBe(true);
  });

  it("coerces partial payloads through hydration", () => {
    const partial = {
      version: 1,
      updatedAt: new Date().toISOString(),
      global: {
        siteName: "Custom Name",
        cityLabel: defaultEditableSiteDocument.global.cityLabel,
        tagline: defaultEditableSiteDocument.global.tagline,
        description: defaultEditableSiteDocument.global.description,
        phone: defaultEditableSiteDocument.global.phone,
        email: defaultEditableSiteDocument.global.email,
        addressLine: defaultEditableSiteDocument.global.addressLine,
        hoursLine: defaultEditableSiteDocument.global.hoursLine,
        navCtaText: defaultEditableSiteDocument.global.navCtaText,
        navCtaLink: defaultEditableSiteDocument.global.navCtaLink,
        navLinks: defaultEditableSiteDocument.global.navLinks,
        footerBadges: defaultEditableSiteDocument.global.footerBadges,
        seoTitleSuffix: defaultEditableSiteDocument.global.seoTitleSuffix,
      },
      home: {
        ...defaultEditableSiteDocument.home,
        ui: {
          residencesTitle: "Changed title",
        },
      },
      gallery: {
        ...defaultEditableSiteDocument.gallery,
      },
      contact: {
        ...defaultEditableSiteDocument.contact,
      },
    };

    const result = coerceEditableSiteDocument(partial);
    expect(result.document).not.toBeNull();
    expect(result.errors).toHaveLength(0);
    expect(result.document?.global.siteName).toBe("Custom Name");
    expect(result.document?.home.ui.residencesTitle).toBe("Changed title");
    expect(result.document?.home.ui.residencesEyebrow).toBe(defaultEditableSiteDocument.home.ui.residencesEyebrow);
  });

  it("rejects payloads missing top-level sections", () => {
    const result = coerceEditableSiteDocument({ version: 1 });
    expect(result.document).toBeNull();
    expect(result.errors.some((error) => error.includes("top-level"))).toBe(true);
  });
});

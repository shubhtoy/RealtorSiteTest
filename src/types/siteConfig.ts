export type SiteConfig = {
  siteName: string;
  cityLabel: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  addressLine: string;
  hoursLine: string;
  navCtaText: string;
  navCtaLink: string;
};

export type SiteConfigSource = "local" | "default";

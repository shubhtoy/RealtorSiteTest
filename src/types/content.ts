// Content type definitions for Baba Flats website

export interface HeroContent {
  tagline: string;
  title: string;
  flipWords: string[];
  description: string;
  images: string[];
  cta: {
    primary: {
      text: string;
      link: string;
    };
    secondary: {
      text: string;
      link: string;
    };
  };
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export interface FloorPlanItem {
  title: string;
  bedrooms: number;
  bathrooms: number;
  sqft: string;
  description: string;
  image: string;
  features: string[];
  priceRange?: string;
}

export interface AmenityCategory {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

export interface TestimonialItem {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface FocusCardItem {
  title: string;
  src: string;
}

export interface CTAContent {
  tagline: string;
  title: string;
  description: string;
  actions: {
    primary: {
      text: string;
      link: string;
      type: 'link' | 'phone';
    };
    secondary: {
      text: string;
      link: string;
      type: 'link' | 'phone';
    };
  };
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    full: string;
  };
  hours: {
    weekdays: string;
    weekends: string;
  };
  mapEmbedUrl: string;
}

export interface SiteMetadata {
  name: string;
  tagline: string;
  description: string;
  keywords: string[];
}

export interface NeighborhoodContent {
  title: string;
  tagline: string;
  description: string;
  highlights: {
    title: string;
    description: string;
    distance?: string;
  }[];
  nearbyPlaces: {
    category: string;
    places: string[];
  }[];
}

export interface PetPolicyContent {
  title: string;
  tagline: string;
  description: string;
  allowed: boolean;
  restrictions: {
    maxPets: number;
    weightLimit?: string;
    breeds?: string[];
  };
  amenities: string[];
  fees: {
    deposit?: string;
    monthlyRent?: string;
    note: string;
  };
}

export interface LeaseTermsContent {
  title: string;
  tagline: string;
  description: string;
  terms: {
    standard: string[];
    flexible: string[];
  };
  requirements: {
    title: string;
    items: string[];
  };
  utilities: {
    included: string[];
    tenant: string[];
  };
}

export interface CommunityFeaturesContent {
  title: string;
  tagline: string;
  description: string;
  features: {
    title: string;
    description: string;
    icon?: string;
  }[];
}

export interface AccessibilityContent {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  contact: string;
}

export interface ParkingContent {
  title: string;
  tagline: string;
  description: string;
  options: {
    type: string;
    description: string;
    cost?: string;
  }[];
}

export interface MaintenanceContent {
  title: string;
  tagline: string;
  description: string;
  services: string[];
  emergency: {
    phone: string;
    available: string;
  };
  requestProcess: string[];
}

export interface ResidentPortalContent {
  title: string;
  tagline: string;
  description: string;
  features: {
    title: string;
    description: string;
  }[];
  access: string;
}

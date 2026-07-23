export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  thumbnail: string;
  gallery: string[];
  description: string;
  problem: string;
  solution: string;
  result: string;
  technologies: string[];
  features: string[];
  demoUrl: string;
  githubUrl: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudyCaseProcess {
  step: number;
  title: string;
  description: string;
}

export interface StudyCaseItem {
  id: string;
  portfolioId: string;
  slug: string;
  judul: string;
  client: string;
  industry: string;
  problem: string;
  solution: string;
  process: StudyCaseProcess[];
  technology: string[];
  result: string;
  gallery: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HeroData {
  badge: string;
  headlines: { plain: string; accent: string }[];
  description: string;
  ctaPrimary: { text: string; url: string };
  ctaSecondary: { text: string; url: string };
  stats: { value: string; label: string }[];
  slides: { label: string; color: string; bg: string; icon: string }[];
  clients: string[];
  mockupImage: string;
  mockupUrl: string;
  mockupClient: string;
}

export interface AboutData {
  badge: string;
  title: string;
  titleAccent: string;
  story: string;
  missionTitle: string;
  mission: string;
  visionTitle: string;
  vision: string;
  stats: { value: string; label: string }[];
  values: { title: string; description: string }[];
  founderName: string;
  founderTitle: string;
  founderBio: string;
  founderImage: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
  size: string;
  published: boolean;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge: string;
  ctaText: string;
  published: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  published: boolean;
  order: number;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  published: boolean;
  order: number;
}

export interface SocialData {
  whatsapp: string;
  whatsappText: string;
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  twitter: string;
  youtube: string;
  linkedin: string;
  behance: string;
  dribbble: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  order: number;
  published: boolean;
}

export interface NavigationData {
  brand: string;
  logoUrl: string;
  items: NavItem[];
  ctaText: string;
  ctaUrl: string;
  ctaStyle: string;
}

export interface SEOData {
  default: { title: string; description: string; keywords: string; canonical: string; robots: string; };
  openGraph: { title: string; description: string; image: string; url: string; type: string; siteName: string; };
  twitter: { title: string; description: string; image: string; card: string; };
  sitemap: { enabled: boolean; changefreq: string; priority: string; };
  analytics: { googleAnalyticsId: string; googleTagManagerId: string; facebookPixelId: string; };
}

export interface SettingsData {
  siteName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  businessHours: string;
  currency: string;
  language: string;
  timezone: string;
  maintenanceMode: boolean;
  allowComments: boolean;
  publishConfig: { secret: string; githubOwner: string; githubRepo: string; githubBranch: string; };
}

export interface ServiceNavItem {
  name: string;
  href: string;
  description: string;
}

export const serviceNavItems: ServiceNavItem[] = [
  {
    name: "GTM & Growth",
    href: "/gtm-growth",
    description: "Positioning, KOL strategy, and launch systems.",
  },
  {
    name: "Product Studio",
    href: "/product-studio",
    description: "Product strategy, design, and full-stack delivery.",
  },
  {
    name: "Security Audit",
    href: "/security-audit",
    description: "Manual review, AI-assisted analysis, and formal verification.",
  },
];

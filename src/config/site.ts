// Central brand and site configuration.
// Change the brand name, navigation labels, links or metadata here; no
// component hard-codes any of these values.

/**
 * Resolves the public URL of the site.
 * - NEXT_PUBLIC_SITE_URL: set this when a real production domain exists.
 * - VERCEL_PROJECT_PRODUCTION_URL: provided automatically by Vercel.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  /** Working brand name. Provisional: change it here only. */
  name: "DevSuite",
  tagline: "Build with clarity.",
  title: "DevSuite — Build with clarity.",
  description:
    "Plan, design, and understand software with three focused tools: MobileRoad, Architecter, and CodebaseXplorer.",
  shortDescription:
    "A family of three independent, focused tools for planning, designing and understanding software.",
  url: resolveSiteUrl(),
  /** True only when a real domain was configured explicitly (enables the canonical URL). */
  hasCanonicalDomain: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
  locale: "en_US",
  /** Verified public GitHub profile that hosts the product repositories. */
  github: {
    label: "GitHub",
    href: "https://github.com/laynierdev",
  },
  nav: [
    { label: "Products", href: "#products" },
    { label: "Philosophy", href: "#philosophy" },
  ],
  primaryCta: { label: "Explore the tools", href: "#products" },
  secondaryCta: { label: "Discover our approach", href: "#philosophy" },
  hero: {
    heading: ["Build with", "clarity."],
    roles: ["Plan.", "Design.", "Understand."],
    description:
      "Three focused tools to help you turn software ideas into well-designed, understandable products.",
  },
} as const;

export type SiteConfig = typeof siteConfig;

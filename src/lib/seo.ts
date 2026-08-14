import type { Metadata } from "next";

export const siteName = "TONY SHRIMP";
export const siteDescription = "Premium freshwater shrimp storefront.";
export const siteIcon = "/logo/tony-shrimp-logo.png";
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tonyshrimp.com").replace(/\/$/, "");

export function formatSiteTitle(title?: string) {
  return title ? `${title} | ${siteName}` : siteName;
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetadataInput = Omit<Metadata, "title" | "description" | "openGraph"> & {
  title?: string;
  description?: string;
  openGraph?: Metadata["openGraph"];
};

export function createPageMetadata({
  title,
  description = siteDescription,
  openGraph,
  ...metadata
}: PageMetadataInput = {}): Metadata {
  return {
    ...metadata,
    title,
    description,
    openGraph: {
      title: formatSiteTitle(title),
      description,
      siteName,
      ...openGraph,
    },
  };
}

import type { Metadata } from "next";

export const siteName = "Tony Shrimp Australia";
export const siteShortName = "Tony Shrimp";
export const siteDescription =
  "Premium ornamental aquarium shrimp in Australia, selectively bred for colour, pattern and vigour with live arrival support.";
export const siteIcon = "/logo/tony-shrimp-logo.png";
export const facebookUrl = "https://facebook.com/thang.pham.790508";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tonyshrimp.com.au"
).replace(/\/$/, "");

export function formatSiteTitle(title?: string) {
  return title ? `${title} | ${siteName}` : siteName;
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const defaultOpenGraphImage = absoluteUrl(siteIcon);

type PageMetadataInput = Omit<
  Metadata,
  "title" | "description" | "openGraph"
> & {
  title?: string;
  description?: string;
  path?: string;
  openGraph?: Metadata["openGraph"];
};

export function createPageMetadata({
  title,
  description = siteDescription,
  path = "/",
  openGraph,
  ...metadata
}: PageMetadataInput = {}): Metadata {
  const url = absoluteUrl(path);

  return {
    ...metadata,
    title,
    description,
    alternates: {
      canonical: url,
      ...metadata.alternates,
    },
    openGraph: {
      title: formatSiteTitle(title),
      description,
      siteName,
      type: "website",
      url,
      images: [{ url: defaultOpenGraphImage }],
      ...openGraph,
    },
    other: {
      "og:see_also": facebookUrl,
      ...metadata.other,
    },
  };
}

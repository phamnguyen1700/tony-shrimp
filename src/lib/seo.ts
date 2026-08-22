import type { Metadata } from "next";

export const siteName = "Tony Shrimp Australia";
export const siteShortName = "Tony Shrimp";
export const siteTitleSuffix = "Tony Shrimp - Victoria";
export const siteDescription =
  "Premium ornamental aquarium shrimp in Australia, selectively bred for colour, pattern and vigour with live arrival support.";
export const siteIcon = "/favicon.png";
export const siteLogo = "/logo/tony-shrimp-logo.png";
export const facebookUrl = "https://facebook.com/thang.pham.790508";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tonyshrimp.com.au"
).replace(/\/$/, "");

export function formatSiteTitle(title?: string) {
  return title ? `${title} | ${siteTitleSuffix}` : siteTitleSuffix;
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const defaultOpenGraphImage = absoluteUrl(siteIcon);

export function createRootMetadata(): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    alternates: {
      canonical: absoluteUrl(),
    },
    openGraph: {
      title: siteName,
      description: siteDescription,
      url: absoluteUrl(),
      siteName,
      type: "website",
      images: [{ url: defaultOpenGraphImage }],
    },
    icons: {
      icon: [
        {
          url: siteIcon,
          type: "image/png",
          sizes: "500x500",
        },
      ],
      shortcut: siteIcon,
      apple: [
        {
          url: siteIcon,
          type: "image/png",
          sizes: "500x500",
        },
      ],
    },
  };
}

export function createNoIndexMetadata(): Metadata {
  return {
    robots: {
      index: false,
      follow: false,
    },
  };
}

type PageMetadataInput = Omit<
  Metadata,
  "title" | "description" | "openGraph"
> & {
  title?: string;
  absoluteTitle?: boolean;
  description?: string;
  path?: string;
  openGraph?: Metadata["openGraph"];
};

export function createPageMetadata({
  title,
  absoluteTitle = false,
  description = siteDescription,
  path = "/",
  openGraph,
  ...metadata
}: PageMetadataInput = {}): Metadata {
  const url = absoluteUrl(path);
  const formattedTitle = formatSiteTitle(title);

  return {
    ...metadata,
    title: { absolute: absoluteTitle && title ? title : formattedTitle },
    description,
    alternates: {
      canonical: url,
      ...metadata.alternates,
    },
    openGraph: {
      title: absoluteTitle && title ? title : formattedTitle,
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

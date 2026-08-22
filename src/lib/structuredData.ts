import { routes } from "@/config/routes";
import { markdownToDescriptionDraft } from "@/lib/shrimpDescription";
import type { ShrimpDetail } from "@/types/shrimp";
import {
  absoluteUrl,
  facebookUrl,
  siteDescription,
  siteIcon,
  siteLogo,
  siteName,
  siteShortName,
  siteUrl,
} from "./seo";

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    alternateName: siteShortName,
    url: absoluteUrl(),
  };
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    alternateName: siteShortName,
    url: absoluteUrl(),
    logo: absoluteUrl(siteLogo),
    description: siteDescription,
    sameAs: [facebookUrl],
  };
}

export function createBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function createBreadcrumbItems(
  items: Array<{ name: string; path: string }>,
) {
  return [{ name: siteName, path: "/" }, ...items];
}

export function createProductJsonLd(product: ShrimpDetail) {
  const image =
    product.images.find((item) => item.is_primary)?.url ??
    product.images[0]?.url ??
    undefined;
  const variant =
    product.variants.find((item) => item.is_active) ?? product.variants[0];
  const { overview } = markdownToDescriptionDraft(product.description);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      overview || `Premium ornamental aquarium shrimp from ${siteName}.`,
    image: image ? [image] : undefined,
    brand: {
      "@type": "Brand",
      name: siteShortName,
    },
    category: "Aquarium shrimp",
    sku: product.id,
    url: absoluteUrl(routes.product(product.slug)),
    offers: variant
      ? {
          "@type": "Offer",
          price: variant.price,
          priceCurrency: "AUD",
          availability: product.is_available
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          url: absoluteUrl(routes.product(product.slug)),
          seller: {
            "@type": "Organization",
            name: siteName,
            url: siteUrl,
          },
        }
      : undefined,
  };
}

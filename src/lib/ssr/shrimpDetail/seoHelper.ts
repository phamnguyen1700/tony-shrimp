import type { Metadata } from "next";
import { routes } from "@/config/routes";
import { createPageMetadata } from "@/lib/seo/metadata";
import { markdownToDescriptionDraft } from "@/lib/shrimp/description";
import { createShrimpSeoMetadata } from "@/lib/seo/shrimpMetadata";
import {
  createBreadcrumbItems,
  createBreadcrumbJsonLd,
  createProductJsonLd,
} from "@/lib/seo/structuredData";
import { shrimpService } from "@/services/shrimp";
import type { ShrimpDetail } from "@/types/shrimp";

export async function getShrimpDetailBySlugForSsr(slug: string) {
  return shrimpService.getShrimpDetailBySlug(slug);
}

export async function createShrimpDetailMetadata(slug: string): Promise<Metadata> {
  try {
    const shrimp = await getShrimpDetailBySlugForSsr(slug);
    const { overview } = markdownToDescriptionDraft(shrimp.description);
    const metadata = createShrimpSeoMetadata(shrimp, overview);

    return createPageMetadata({
      title: metadata.title,
      description: metadata.description,
      path: routes.product(shrimp.slug),
      openGraph: {
        description: metadata.description,
        images: shrimp.images[0]?.url ? [{ url: shrimp.images[0].url }] : undefined,
      },
    });
  } catch {
    return createPageMetadata({
      title: "Aquarium Shrimp Australia | Caridina & Neocaridina",
      description:
        "Premium ornamental freshwater shrimp from Victoria, Australia. Shop Caridina and Neocaridina with fair prices, reliable stock and limited rare releases.",
    });
  }
}

export function createShrimpDetailJsonLd(shrimp: ShrimpDetail) {
  return [
    createBreadcrumbJsonLd(
      createBreadcrumbItems([
        { name: "Aquarium Shrimp", path: routes.shop },
        { name: shrimp.name, path: routes.product(shrimp.slug) },
      ]),
    ),
    createProductJsonLd(shrimp),
  ];
}

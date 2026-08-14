import type { Metadata } from "next";
import ProductDetailFeature from "@/features/product-detail";
import { shrimpService } from "@/services/shrimp";
import { markdownToDescriptionDraft } from "@/lib/shrimpDescription";
import { routes } from "@/config/routes";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

function createMetaDescription(text: string, maxLength = 155) {
  const clean = text.trim();
  if (clean.length <= maxLength) return clean;

  const truncated = clean.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  const cut = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;

  return `${cut}...`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const shrimp = await shrimpService.getShrimpDetailBySlug(slug);
    const { title, overview } = markdownToDescriptionDraft(shrimp.description);

    const productTitle = title || shrimp.name;
    const metaDescription = createMetaDescription(
      overview ||
        `Buy ${shrimp.name} shrimp online in Australia at Tony Shrimp.`,
    );

    return createPageMetadata({
      title: productTitle,
      description: metaDescription,
      alternates: {
        canonical: absoluteUrl(routes.product(shrimp.slug)),
      },
      openGraph: {
        description: metaDescription,
        images: shrimp.images[0]?.url
          ? [{ url: shrimp.images[0].url }]
          : undefined,
      },
    });
  } catch {
    return createPageMetadata({
      title: "Aquarium Shrimp",
      description:
        "Premium ornamental freshwater shrimp for aquascapers, shipped Australia-wide.",
    });
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: slug } = await params;

  return <ProductDetailFeature slug={slug} />;
}

import type { Metadata } from "next";
import { Suspense } from "react";
import JsonLd from "@/components/common/seo/JsonLd";
import AquariumShrimpFeature from "@/features/aquarium-shrimp";
import ProductDetailFeature from "@/features/product-detail";
import { routes } from "@/config/routes";
import {
  createShrimpCollectionMetadata,
  getCatalogInitialProducts,
  getShrimpCollectionConfig,
  getShrimpCollectionInitialProducts,
} from "@/lib/ssr/collection";
import {
  createShrimpDetailJsonLd,
  createShrimpDetailMetadata,
  getShrimpDetailBySlugForSsr,
} from "@/lib/ssr/shrimpDetail/seoHelper";
import {
  createBreadcrumbItems,
  createBreadcrumbJsonLd,
} from "@/lib/structuredData";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = getShrimpCollectionConfig(slug);
  if (collection) return createShrimpCollectionMetadata(collection);

  return createShrimpDetailMetadata(slug);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: slug } = await params;
  const collection = getShrimpCollectionConfig(slug);

  if (collection) {
    const initialProducts = await getShrimpCollectionInitialProducts(collection);

    return (
      <>
        <JsonLd
          data={createBreadcrumbJsonLd(
            createBreadcrumbItems([
              { name: "Aquarium Shrimp", path: routes.shop },
              { name: collection.heading, path: `${routes.shop}/${collection.slug}` },
            ]),
          )}
        />
        <Suspense fallback={<div className="app-page" />}>
          <AquariumShrimpFeature
            initialProducts={initialProducts}
            initialQuery={collection.query}
            initialFilters={collection.filters}
            collectionTitle={collection.heading}
            activeCollectionSlug={collection.slug}
          />
        </Suspense>
      </>
    );
  }

  const [shrimp, products] = await Promise.all([
    getShrimpDetailBySlugForSsr(slug).catch(() => null),
    getCatalogInitialProducts().catch(() => []),
  ]);

  return (
    <>
      {shrimp && (
        <JsonLd
          data={createShrimpDetailJsonLd(shrimp)}
        />
      )}
      <ProductDetailFeature
        slug={slug}
        initialProduct={shrimp ?? undefined}
        initialProducts={products}
      />
    </>
  );
}

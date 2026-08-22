import { Suspense } from "react";
import JsonLd from "@/components/common/seo/JsonLd";
import AquariumShrimpFeature from "@/features/aquarium-shrimp";
import {
  catalogInitialQuery,
  createCatalogMetadata,
  getCatalogInitialProducts,
} from "@/lib/ssr/collection";
import {
  createBreadcrumbItems,
  createBreadcrumbJsonLd,
} from "@/lib/structuredData";

export const dynamic = "force-dynamic";

export const metadata = createCatalogMetadata();

export default async function Page() {
  const initialProducts = await getCatalogInitialProducts();

  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd(
          createBreadcrumbItems([
            { name: "Aquarium Shrimp", path: "/aquarium-shrimp" },
          ]),
        )}
      />
      <Suspense fallback={<div className="app-page" />}>
        <AquariumShrimpFeature
          initialProducts={initialProducts}
          initialQuery={catalogInitialQuery}
        />
      </Suspense>
    </>
  );
}

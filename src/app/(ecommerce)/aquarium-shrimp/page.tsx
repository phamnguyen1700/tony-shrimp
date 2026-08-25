import { Suspense } from "react";
import AppPageFallback from "@/components/common/layout/AppPageFallback";
import JsonLd from "@/components/common/seo/JsonLd";
import ServerMaintenanceScreen from "@/components/common/ServerMaintenanceScreen";
import AquariumShrimpFeature from "@/features/aquarium-shrimp";
import {
  catalogInitialQuery,
  createCatalogMetadata,
  getCatalogInitialProducts,
} from "@/lib/ssr/collection";
import {
  createBreadcrumbItems,
  createBreadcrumbJsonLd,
} from "@/lib/seo/structuredData";

export const dynamic = "force-dynamic";

export const metadata = createCatalogMetadata();

export default async function Page() {
  try {
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
        <Suspense fallback={<AppPageFallback />}>
          <AquariumShrimpFeature
            initialProducts={initialProducts}
            initialQuery={catalogInitialQuery}
          />
        </Suspense>
      </>
    );
  } catch {
    return <ServerMaintenanceScreen />;
  }
}

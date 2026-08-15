import { Suspense } from "react";
import JsonLd from "@/components/common/seo/JsonLd";
import AquariumShrimpFeature from "@/features/aquarium-shrimp";
import { createPageMetadata } from "@/lib/seo";
import { createBreadcrumbItems, createBreadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = createPageMetadata({
  title: "Aquarium Shrimp",
  description: "Shop premium ornamental aquarium shrimp from Tony Shrimp, including rare Caridina and Neocaridina lines.",
  path: "/aquarium-shrimp",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd(
          createBreadcrumbItems([{ name: "Aquarium Shrimp", path: "/aquarium-shrimp" }]),
        )}
      />
      <Suspense fallback={<div className="app-page" />}>
        <AquariumShrimpFeature />
      </Suspense>
    </>
  );
}

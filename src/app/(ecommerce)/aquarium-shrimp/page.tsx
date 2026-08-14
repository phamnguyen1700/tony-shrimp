import { Suspense } from "react";
import AquariumShrimpFeature from "@/features/aquarium-shrimp";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aquarium Shrimp",
  description: "Shop premium ornamental aquarium shrimp from Tony Shrimp, including rare Caridina and Neocaridina lines.",
  alternates: {
    canonical: absoluteUrl("/aquarium-shrimp"),
  },
});

export default function Page() {
  return (
    <Suspense fallback={<div className="app-page" />}>
      <AquariumShrimpFeature />
    </Suspense>
  );
}

import JsonLd from "@/components/common/seo/JsonLd";
import HomeFeature from "@/features/home";
import { createPageMetadata } from "@/lib/seo";
import { createOrganizationJsonLd, createWebsiteJsonLd } from "@/lib/structuredData";

export const metadata = createPageMetadata({
  title: "Premium Aquarium Shrimp Australia",
  description:
    "Tony Shrimp Australia breeds premium ornamental aquarium shrimp for aquascapers and shrimp keepers, with live arrival support.",
});

export default function Page() {
  return (
    <>
      <JsonLd data={[createWebsiteJsonLd(), createOrganizationJsonLd()]} />
      <HomeFeature />
    </>
  );
}


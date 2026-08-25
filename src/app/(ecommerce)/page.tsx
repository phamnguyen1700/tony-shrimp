import JsonLd from "@/components/common/seo/JsonLd";
import ServerMaintenanceScreen from "@/components/common/ServerMaintenanceScreen";
import HomeFeature from "@/features/home";
import { createPageMetadata } from "@/lib/seo/metadata";
import { getLandingInitialData } from "@/lib/ssr/landing";
import {
  createOrganizationJsonLd,
  createWebsiteJsonLd,
} from "@/lib/seo/structuredData";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title:
    "Premium Aquarium Shrimp Australia | Rare Caridina & Neocaridina Collection",
  description:
    "Discover rare ornamental shrimp from Tony Shrimp in Victoria, Australia, including limited Caridina and Neocaridina releases available in small numbers.",
});

export default async function Page() {
  try {
    const landingData = await getLandingInitialData();

    return (
      <>
        <JsonLd data={[createWebsiteJsonLd(), createOrganizationJsonLd()]} />
      <HomeFeature
        initialShrimp={landingData.initialShrimp}
        initialCollectionKind={landingData.initialCollectionKind}
      />
      </>
    );
  } catch {
    return <ServerMaintenanceScreen />;
  }
}

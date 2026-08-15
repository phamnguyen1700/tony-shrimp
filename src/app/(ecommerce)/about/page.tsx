import JsonLd from "@/components/common/seo/JsonLd";
import AboutFeature from "@/features/about";
import { createPageMetadata } from "@/lib/seo";
import { createBreadcrumbItems, createBreadcrumbJsonLd } from "@/lib/structuredData";

export const metadata = createPageMetadata({
  title: "About Tony Shrimp",
  description:
    "Learn about Tony Shrimp Australia, our premium ornamental freshwater shrimp, selective breeding standards and live arrival support.",
  path: "/about",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd(
          createBreadcrumbItems([{ name: "About Tony Shrimp", path: "/about" }]),
        )}
      />
      <AboutFeature />
    </>
  );
}

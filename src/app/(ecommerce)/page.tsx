import HomeFeature from "@/features/home";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Premium Aquarium Shrimp Australia",
  description: "Premium ornamental freshwater shrimp for aquascapers, shipped Australia-wide.",
});

export default function Page() {
  return <HomeFeature />;
}


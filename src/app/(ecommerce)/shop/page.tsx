import { Suspense } from "react";
import ShopFeature from "@/features/shop";

export default function Page() {
  return (
    <Suspense fallback={<div className="app-page" />}>
      <ShopFeature />
    </Suspense>
  );
}

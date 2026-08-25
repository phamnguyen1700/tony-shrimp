import { Suspense } from "react";
import AppPageFallback from "@/components/common/layout/AppPageFallback";
import CartFeature from "@/features/cart";

export default function Page() {
  return (
    <Suspense fallback={<AppPageFallback />}>
      <CartFeature />
    </Suspense>
  );
}

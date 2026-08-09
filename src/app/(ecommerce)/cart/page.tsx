import { Suspense } from "react";
import CartFeature from "@/features/cart";

export default function Page() {
  return (
    <Suspense fallback={<div className="app-page" />}>
      <CartFeature />
    </Suspense>
  );
}

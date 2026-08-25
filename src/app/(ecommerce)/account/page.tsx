import { Suspense } from "react";
import AppPageFallback from "@/components/common/layout/AppPageFallback";
import AccountFeature from "@/features/account";

export default function Page() {
  return (
    <Suspense fallback={<AppPageFallback />}>
      <AccountFeature />
    </Suspense>
  );
}

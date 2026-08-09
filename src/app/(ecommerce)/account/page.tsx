import { Suspense } from "react";
import AccountFeature from "@/features/account";

export default function Page() {
  return (
    <Suspense fallback={<div className="app-page" />}>
      <AccountFeature />
    </Suspense>
  );
}

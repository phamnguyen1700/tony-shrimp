import type { ReactNode } from "react";
import EcommerceLayout from "@/components/common/layout/EcommerceLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return <EcommerceLayout>{children}</EcommerceLayout>;
}


import type { ReactNode } from "react";
import AdminRouteLayout from "@/features/admin/components/AdminRouteLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return <AdminRouteLayout>{children}</AdminRouteLayout>;
}


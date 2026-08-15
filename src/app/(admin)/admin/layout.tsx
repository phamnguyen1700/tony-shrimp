import { Metadata } from "next";
import type { ReactNode } from "react";
import AdminRouteLayout from "@/features/admin/components/AdminRouteLayout";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <AdminRouteLayout>{children}</AdminRouteLayout>;
}

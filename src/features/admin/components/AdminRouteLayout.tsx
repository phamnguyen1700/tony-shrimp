"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import PageTransition from "@/components/common/motion/PageTransition";
import { routes } from "@/config/routes";
import { canAccessAdmin } from "@/lib/authAccess";
import { useCurrentUser } from "@/hooks/user";
import { getAuthTokens } from "@/services/auth";
import { useAppRuntime } from "@/providers/AppProviders";
import { useAuthStore } from "@/store/authStore";
import AdminLayout from "./AdminLayout";

function getActiveRoute(pathname: string) {
  if (pathname.startsWith("/admin/orders")) return "/admin/orders";
  if (pathname.startsWith("/admin/shrimp")) return "/admin/shrimp";
  return "/admin";
}

export default function AdminRouteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useAppRuntime();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const currentUserQuery = useCurrentUser();
  const hasTokens = Boolean(getAuthTokens());
  const isRestoringUser = hasTokens && !user && currentUserQuery.isLoading;
  const isLoadingAuth = !isHydrated || isRestoringUser;
  const canViewAdmin = canAccessAdmin(user);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!canViewAdmin) router.replace(routes.account);
  }, [canViewAdmin, isLoadingAuth, router]);

  if (isLoadingAuth || !canViewAdmin) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
          Checking access...
        </p>
      </div>
    );
  }

  return (
    <AdminLayout t={t} activeRoute={getActiveRoute(pathname)}>
      <PageTransition routeKey={pathname}>{children}</PageTransition>
    </AdminLayout>
  );
}

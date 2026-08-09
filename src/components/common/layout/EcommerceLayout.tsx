"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AppFooter from "@/components/common/layout/AppFooter";
import Navbar from "@/components/common/layout/Navbar";
import PageTransition from "@/components/common/motion/PageTransition";
import { useAppRuntime } from "@/providers/AppProviders";
import { useCartStore } from "@/store/cartStore";

export default function EcommerceLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t, lang, setLang, theme, setTheme } = useAppRuntime();
  const cartItems = useCartStore((state) => state.items);

  return (
    <>
      <Navbar
        t={t}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        cartItems={cartItems}
      />
      <PageTransition routeKey={pathname}>{children}</PageTransition>
      {pathname !== "/" && <AppFooter t={t} />}
    </>
  );
}

"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Navbar from "@/components/common/layout/Navbar";
import PageTransition from "@/components/common/motion/PageTransition";
import { useI18n } from "@/hooks/useI18n";
import { useTheme } from "@/hooks/useTheme";
import type { Lang, Translations } from "@/i18n";
import type { ThemeMode } from "@/hooks/useTheme";
import { useCartStore } from "@/store/cartStore";

interface AppRuntimeValue {
  t: Translations;
  lang: Lang;
  setLang: (lang: Lang) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const AppRuntimeContext = createContext<AppRuntimeValue | null>(null);

function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useI18n();
  const cartItems = useCartStore((state) => state.items);
  const hideNav = pathname.startsWith("/admin") || pathname === "/design-system";

  return (
    <AppRuntimeContext.Provider value={{ t, lang, setLang, theme, setTheme }}>
      {!hideNav && (
        <Navbar
          t={t}
          lang={lang}
          setLang={setLang}
          theme={theme}
          setTheme={setTheme}
          cartItems={cartItems}
        />
      )}
      <PageTransition routeKey={pathname}>{children}</PageTransition>
    </AppRuntimeContext.Provider>
  );
}

export default function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppFrame>{children}</AppFrame>
    </QueryClientProvider>
  );
}

export function useAppRuntime() {
  const context = useContext(AppRuntimeContext);
  if (!context) throw new Error("useAppRuntime must be used within AppProviders");
  return context;
}

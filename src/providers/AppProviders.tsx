"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useI18n } from "@/hooks/useI18n";
import { useTheme } from "@/hooks/useTheme";
import type { Lang, Translations } from "@/i18n";
import type { ThemeMode } from "@/hooks/useTheme";

interface AppRuntimeValue {
  t: Translations;
  lang: Lang;
  setLang: (lang: Lang) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const AppRuntimeContext = createContext<AppRuntimeValue | null>(null);

function AppFrame({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useI18n();

  return (
    <AppRuntimeContext.Provider value={{ t, lang, setLang, theme, setTheme }}>
      {children}
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
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4500,
          style: {
            background: "var(--card)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
            fontFamily: "var(--font-dm-sans)",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "var(--accent)",
              secondary: "var(--accent-foreground)",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export function useAppRuntime() {
  const context = useContext(AppRuntimeContext);
  if (!context) throw new Error("useAppRuntime must be used within AppProviders");
  return context;
}

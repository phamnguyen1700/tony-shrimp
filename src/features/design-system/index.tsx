"use client";

import { useAppRuntime } from "@/providers/AppProviders";
import DesignSystem from "./components/DesignSystem";

export default function DesignSystemFeature() {
  const { t, theme, setTheme, lang, setLang } = useAppRuntime();
  return <DesignSystem t={t} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} />;
}

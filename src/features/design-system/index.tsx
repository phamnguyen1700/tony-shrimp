"use client";

import { useAppRuntime } from "@/providers/AppProviders";
import DesignSystemScreen from "./components/DesignSystemScreen";

export default function DesignSystemFeature() {
  const { t, theme, setTheme, lang, setLang } = useAppRuntime();
  return <DesignSystemScreen t={t} theme={theme} setTheme={setTheme} lang={lang} setLang={setLang} />;
}

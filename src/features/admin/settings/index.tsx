"use client";

import { motion, useReducedMotion } from "motion/react";
import { useAppRuntime } from "@/providers/AppProviders";
import ThemeSettingsSection from "./components/ThemeSettingsSection";
import LanguageSettingsSection from "./components/LanguageSettingsSection";

export default function AdminSettingsFeature() {
  const { t, theme, setTheme, lang, setLang } = useAppRuntime();
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="w-full max-w-3xl space-y-6 p-6 md:p-8"
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
          {t.admin.settings}
        </h1>
      </div>

      <ThemeSettingsSection t={t} theme={theme} setTheme={setTheme} />
      <LanguageSettingsSection t={t} lang={lang} setLang={setLang} />
    </motion.div>
  );
}

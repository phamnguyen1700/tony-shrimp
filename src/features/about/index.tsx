"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import PageHero from "@/components/common/layout/PageHero";
import { fadeUp, staggerContainer } from "@/lib/motionVariants";
import { useAppRuntime } from "@/providers/AppProviders";
import AboutAccordionList from "./components/AboutAccordionList";

export default function AboutFeature() {
  const { t, lang } = useAppRuntime();
  const reduced = useReducedMotion();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const syncHash = () => {
      const nextHash = window.location.hash.replace("#", "");
      setActiveHash(nextHash);

      if (nextHash) {
        window.setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 120);
      }
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <main className="app-page">
      <div className="app-container">
        <motion.section
          className="grid gap-10 py-10 md:grid-cols-[0.8fr_1.2fr] md:py-16"
          variants={reduced ? undefined : staggerContainer}
          initial={reduced ? false : "hidden"}
          animate="visible"
        >
          <motion.div variants={reduced ? undefined : fadeUp}>
            <PageHero title={t.nav.about} reduced={reduced} className="mb-0" />
          </motion.div>
          <motion.div variants={reduced ? undefined : fadeUp}>
            <AboutAccordionList t={t} lang={lang} openId={activeHash} />
          </motion.div>
        </motion.section>
      </div>
    </main>
  );
}

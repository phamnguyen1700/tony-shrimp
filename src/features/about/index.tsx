"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import PageHero from "@/components/common/layout/PageHero";
import AppBreadcrumb from "@/components/common/navigation/AppBreadcrumb";
import { routes } from "@/config/routes";
import { fadeUp, staggerContainer } from "@/lib/config/motionVariants";
import { useAppRuntime } from "@/providers/AppProviders";
import AboutAccordionList from "./components/AboutAccordionList";

const aboutSectionIds = new Set(["shipping", "live-arrival", "doa", "contact"]);

export default function AboutFeature() {
  const { t, lang } = useAppRuntime();
  const reduced = useReducedMotion();
  const [activeHash, setActiveHash] = useState("");
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const scrollToSection = (sectionId: string) => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = window.setTimeout(() => {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 280);
    };

    const syncHash = () => {
      const nextHash = decodeURIComponent(window.location.hash.replace("#", ""));
      setActiveHash(nextHash);

      if (aboutSectionIds.has(nextHash)) {
        scrollToSection(nextHash);
      }
    };

    const syncSamePageHashLink = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest("a[href]");
      if (!link || !(link instanceof HTMLAnchorElement)) return;

      const url = new URL(link.href);
      const nextHash = decodeURIComponent(url.hash.replace("#", ""));

      if (
        url.pathname === window.location.pathname &&
        aboutSectionIds.has(nextHash)
      ) {
        setActiveHash(nextHash);
        scrollToSection(nextHash);
      }
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    document.addEventListener("click", syncSamePageHashLink);

    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      window.removeEventListener("hashchange", syncHash);
      document.removeEventListener("click", syncSamePageHashLink);
    };
  }, []);

  return (
    <main className="app-page">
      <div className="app-container">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <AppBreadcrumb
            items={[
              { label: t.brand, href: routes.home },
              { label: t.nav.about },
            ]}
          />
        </motion.div>
        <motion.section
          className="grid md:grid-cols-[0.8fr_1.2fr]"
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

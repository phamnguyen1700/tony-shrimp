import { motion } from "motion/react";
import type { Translations } from "@/i18n";

interface AccountHeaderProps {
  t: Translations;
  reduced: boolean | null;
}

export default function AccountHeader({ t, reduced }: AccountHeaderProps) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mb-8 md:mb-10"
    >
      <p className="mono-eyebrow mb-2">TONY SHRIMP AUSTRALIA</p>
      <h1 className="font-display text-5xl font-semibold italic leading-none text-foreground md:text-7xl">
        {t.account.title}
      </h1>
    </motion.div>
  );
}


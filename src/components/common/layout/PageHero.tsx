import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/config/utils";

interface PageHeroProps {
  title: string;
  eyebrow?: string | null;
  eyebrowSlot?: ReactNode;
  reduced: boolean | null;
  className?: string;
  titleClassName?: string;
}

export default function PageHero({
  title,
  eyebrow = "",
  eyebrowSlot,
  reduced,
  className = "",
  titleClassName,
}: PageHeroProps) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-5 md:mb-5 ${className}`}
    >
      {eyebrowSlot ??
        (eyebrow ? <p className="mono-eyebrow mb-2">{eyebrow}</p> : null)}
      <h1
        className={cn(
          "font-display text-5xl font-semibold italic leading-none text-foreground md:text-7xl",
          titleClassName,
        )}
      >
        {title}
      </h1>
    </motion.div>
  );
}

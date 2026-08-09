import Link from "next/link";
import { motion } from "motion/react";
import type { Translations } from "@/i18n";

interface CartEmptyStateProps {
  t: Translations;
  reduced: boolean | null;
  returnProduct: { href: string; name: string } | null;
}

export default function CartEmptyState({ t, reduced, returnProduct }: CartEmptyStateProps) {
  return (
    <motion.div
      className="space-y-4 py-24 text-center"
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
        {t.cart.empty}
      </p>
      <Link
        href={returnProduct?.href ?? "/shop"}
        className="inline-block font-mono-label text-xs uppercase tracking-widest text-accent underline underline-offset-2 transition-colors hover:text-accent/80"
      >
        {returnProduct ? `Back to ${returnProduct.name}` : t.cart.continueShopping} →
      </Link>
    </motion.div>
  );
}

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { Translations } from "@/i18n";
import { staggerContainer } from "@/lib/motionVariants";
import type { CartItem } from "@/types/cart";
import CartItemRow from "./CartItemRow";

interface CartItemsListProps {
  t: Translations;
  items: CartItem[];
  reduced: boolean | null;
  returnProduct: { href: string; name: string } | null;
  onRemoveItem: (lineId: string) => void;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
}

export default function CartItemsList({
  t,
  items,
  reduced,
  returnProduct,
  onRemoveItem,
  onUpdateQuantity,
}: CartItemsListProps) {
  return (
    <motion.div
      className="w-full flex-1"
      variants={reduced ? undefined : staggerContainer}
      initial={reduced ? false : "hidden"}
      animate="visible"
    >
      <div className="mb-4 hidden grid-cols-[1fr_auto_auto_auto] items-center gap-6 border-b border-border pb-3 md:grid">
        <p className="mono-section-label">ITEM</p>
        <p className="mono-section-label w-24 text-center">QTY</p>
        <p className="mono-section-label w-16 text-right">PRICE</p>
        <p className="mono-section-label w-4" />
      </div>

      <AnimatePresence initial={false}>
        {items.map((item) => (
          <CartItemRow
            key={item.lineId}
            t={t}
            item={item}
            reduced={reduced}
            onRemoveItem={onRemoveItem}
            onUpdateQuantity={onUpdateQuantity}
          />
        ))}
      </AnimatePresence>

      <div className="mt-6">
        <Link
          href={returnProduct?.href ?? "/shop"}
          className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
        >
          &larr; {returnProduct ? `Back to ${returnProduct.name}` : t.cart.continueShopping}
        </Link>
      </div>
    </motion.div>
  );
}

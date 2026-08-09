import Link from "next/link";
import { motion } from "motion/react";
import type { Translations } from "@/i18n";
import type { CartItem } from "@/types/cart";
import { fadeUp } from "@/lib/motionVariants";

interface CartItemRowProps {
  t: Translations;
  item: CartItem;
  reduced: boolean | null;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

function CartQuantityControl({
  item,
  compact,
  onUpdateQuantity,
}: {
  item: CartItem;
  compact?: boolean;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
}) {
  return (
    <div className={`quantity-stepper ${compact ? "" : "w-24"}`}>
      <button
        onClick={() => onUpdateQuantity(item.lineId, item.quantity - 1)}
        className={compact ? "h-8 w-8 quantity-stepper-button" : "h-8 w-8 quantity-stepper-button"}
      >
        -
      </button>
      <span className={compact ? "w-8 quantity-stepper-value" : "flex-1 quantity-stepper-value"}>
        {item.quantity}
      </span>
      <button
        onClick={() => onUpdateQuantity(item.lineId, item.quantity + 1)}
        className={compact ? "h-8 w-8 quantity-stepper-button" : "h-8 w-8 quantity-stepper-button"}
      >
        +
      </button>
    </div>
  );
}

export default function CartItemRow({
  t,
  item,
  reduced,
  onRemoveItem,
  onUpdateQuantity,
}: CartItemRowProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <motion.div
      layout
      variants={reduced ? undefined : fadeUp}
      initial={reduced ? false : "hidden"}
      animate="visible"
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      className="grid grid-cols-[70px_1fr] items-center gap-4 border-b border-border py-5 md:grid-cols-[70px_1fr_auto_auto_auto] md:gap-6"
    >
      <div className="ui-radius h-[70px] w-[70px] shrink-0 overflow-hidden bg-[#080b08]">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="mono-meta uppercase">No image</span>
          </div>
        )}
      </div>

      <div className="min-w-0">
        <Link
          href={`/products/${item.productId}`}
          className="block font-display text-sm font-semibold italic leading-snug text-foreground transition-colors hover:text-accent"
        >
          {item.name}
        </Link>
        {item.grade && <p className="mono-meta mt-0.5 uppercase">{item.grade}</p>}
        {item.variantName && <p className="mono-meta mt-0.5 uppercase">{item.variantName}</p>}
        <p className="mt-1 font-display text-sm font-medium text-foreground md:hidden">A${lineTotal}</p>
      </div>

      <div className="hidden md:flex">
        <CartQuantityControl item={item} onUpdateQuantity={onUpdateQuantity} />
      </div>

      <div className="hidden w-16 text-right md:block">
        <p className="font-display text-sm font-medium text-foreground">A${lineTotal}</p>
      </div>

      <button
        onClick={() => onRemoveItem(item.lineId)}
        className="hidden w-4 items-center justify-center text-muted-foreground transition-colors hover:text-foreground md:flex"
        aria-label={t.cart.remove}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M1 1L11 11M11 1L1 11"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="col-span-2 flex items-center justify-between md:hidden">
        <CartQuantityControl item={item} compact onUpdateQuantity={onUpdateQuantity} />
        <button
          onClick={() => onRemoveItem(item.lineId)}
          className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
        >
          {t.cart.remove}
        </button>
      </div>
    </motion.div>
  );
}

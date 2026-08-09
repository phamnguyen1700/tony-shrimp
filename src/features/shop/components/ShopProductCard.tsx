import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { Translations } from "@/i18n";
import { gradeBadgeClass, rarityBadgeClass, traitBadgeClass } from "@/lib/shrimpBadgeStyles";
import Badge, { StatusDot } from "@/shared/ui/Badge";
import type { ShrimpListItem } from "@/types/shrimp";

interface ShopProductCardProps {
  product: ShrimpListItem;
  t: Translations;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onAddToCart: (product: ShrimpListItem) => void;
}

export default function ShopProductCard({
  product,
  t,
  hovered,
  onHover,
  onAddToCart,
}: ShopProductCardProps) {
  const price = Number(product.min_price ?? 0);
  const speciesAndType = [product.species, product.type].filter(Boolean);

  return (
    <div
      className="group relative"
      onMouseEnter={() => onHover(product.id)}
      onMouseLeave={() => onHover(null)}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#080b08]">
          {product.primary_image_url ? (
            <img
              src={product.primary_image_url}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="mono-meta uppercase">No image</p>
            </div>
          )}
          <AnimatePresence>
            {hovered && (
              <motion.div
                className="absolute inset-x-0 bottom-0 hidden p-3 md:flex"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
              >
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onAddToCart(product);
                  }}
                  disabled={!product.is_available}
                  className="w-full bg-accent py-2 font-mono-label text-[11px] uppercase tracking-[0.16em] text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ borderRadius: "var(--radius)" }}
                >
                  {t.product.addToCart}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="space-y-1 pt-3">
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-display text-sm font-semibold italic leading-snug text-foreground">
              {product.name}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
            {speciesAndType.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                {index > 0 && <span aria-hidden>•</span>}
                <span>{item}</span>
              </span>
            ))}
            {product.grade && (
              <>
                {speciesAndType.length > 0 && <span aria-hidden>•</span>}
                <Badge variant="accent" className={gradeBadgeClass(product.grade)}>
                  {product.grade}
                </Badge>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.rarity && (
              <Badge variant="muted" className={rarityBadgeClass(product.rarity)}>
                {product.rarity}
              </Badge>
            )}
            {product.traits.map((trait) => (
              <Badge key={trait} variant="muted" className={traitBadgeClass(trait)}>
                {trait}
              </Badge>
            ))}
            {product.colors.map((color) => (
              <Badge key={color} variant="muted">
                {color}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-medium text-foreground">A${price}</p>
            <span className="flex items-center gap-1">
              <StatusDot status={product.is_available ? "in-stock" : "out-of-stock"} />
              <Badge variant={product.is_available ? "inStock" : "outOfStock"}>
                {product.is_available ? t.product.inStock : t.product.outOfStock}
              </Badge>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

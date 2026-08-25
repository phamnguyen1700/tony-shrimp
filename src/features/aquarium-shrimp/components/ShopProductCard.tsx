import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import AddToCartMotion from "@/components/common/motion/AddToCartMotion";
import FallbackImage from "@/components/common/images/FallbackImage";
import { routes } from "@/config/routes";
import type { Translations } from "@/i18n";
import { isVideoMediaUrl } from "@/lib/config/media";
import { gradeBadgeClass, rarityBadgeClass, traitBadgeClass } from "@/lib/shrimp/badgeStyles";
import { getShrimpListPrice } from "@/lib/shrimp/variantPricing";
import Badge, { StatusDot } from "@/components/ui/Badge";
import type { ShrimpListItem } from "@/types/shrimp";

interface ShopProductCardProps {
  product: ShrimpListItem;
  t: Translations;
  hovered: boolean;
  addDisabled: boolean;
  addLabel: string;
  isHighQuality: boolean;
  onHover: (id: string | null) => void;
  onAddToCart: (product: ShrimpListItem) => void;
  onContact: () => void;
}

export default function ShopProductCard({
  product,
  t,
  hovered,
  addDisabled,
  addLabel,
  isHighQuality,
  onHover,
  onAddToCart,
  onContact,
}: ShopProductCardProps) {
  const price = getShrimpListPrice(product);
  const speciesAndType = [product.species, product.line].filter(Boolean);

  return (
    <div
      className="group relative"
      onMouseEnter={() => onHover(product.id)}
      onMouseLeave={() => onHover(null)}
    >
      <Link href={routes.product(product.slug)} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#080b08]">
          {product.primary_image_url && isVideoMediaUrl(product.primary_image_url) ? (
            <video
              src={product.primary_image_url}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <FallbackImage
              src={product.primary_image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
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
                {isHighQuality ? (
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onContact();
                    }}
                    className="w-full bg-accent py-2 font-mono-label text-[11px] uppercase tracking-[0.16em] text-accent-foreground transition-colors hover:bg-accent/90"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    {t.product.contactUs}
                  </button>
                ) : (
                  <AddToCartMotion
                    className="w-full"
                    disabled={addDisabled}
                    imageUrl={product.primary_image_url}
                    label={product.name}
                    onAddToCart={() => onAddToCart(product)}
                  >
                    {({ disabled, onClick }) => (
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          void onClick();
                        }}
                        disabled={disabled}
                        className="w-full bg-accent py-2 font-mono-label text-[11px] uppercase tracking-[0.16em] text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-40"
                        style={{ borderRadius: "var(--radius)" }}
                      >
                        {addLabel}
                      </button>
                    )}
                  </AddToCartMotion>
                )}
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
                {index > 0 && <span aria-hidden>&bull;</span>}
                <span>{item}</span>
              </span>
            ))}
            {product.grade && (
              <>
                {speciesAndType.length > 0 && <span aria-hidden>&bull;</span>}
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
          </div>
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-medium text-foreground">
              {t.landing.from} A${price}
            </p>
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

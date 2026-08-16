import type { Translations } from "@/i18n";
import AddToCartMotion from "@/components/common/motion/AddToCartMotion";
import MotionButton from "@/components/common/motion/MotionButton";
import Badge, { StatusDot } from "@/components/ui/Badge";
import type { ShrimpDetail, ShrimpVariant } from "@/types/shrimp";

interface ProductPurchasePanelProps {
  t: Translations;
  product: ShrimpDetail;
  selectedVariant?: ShrimpVariant;
  selectedVariantId: string;
  imageUrl?: string;
  qty: number;
  /** Số lượng của variant này đã có sẵn trong giỏ hàng */
  qtyInCart: number;
  /** Số lượng tối đa còn có thể thêm = stock_quantity - qtyInCart */
  maxAddable: number;
  onAddToCart: () => void;
  onDecreaseQty: () => void;
  onIncreaseQty: () => void;
  onSelectVariant: (variantId: string) => void;
}

export default function ProductPurchasePanel({
  t,
  product,
  selectedVariant,
  selectedVariantId,
  imageUrl,
  qty,
  qtyInCart,
  maxAddable,
  onAddToCart,
  onDecreaseQty,
  onIncreaseQty,
  onSelectVariant,
}: ProductPurchasePanelProps) {
  const activeVariants = product.variants.filter(
    (variant) => variant.is_active,
  );
  const hasStock = Boolean(
    product.is_available &&
    selectedVariant?.is_active &&
    selectedVariant.stock_quantity > 0,
  );
  const isFullyInCart = hasStock && maxAddable <= 0;
  const isAvailable = hasStock && maxAddable > 0 && qty <= maxAddable;
  const price = selectedVariant ? Number(selectedVariant.price) : 0;

  return (
    <>
      <div className="space-y-2">
        <p className="mono-meta mb-1 uppercase">{t.product.from}</p>
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-display text-4xl font-semibold leading-none text-foreground">
            A${price}
          </p>
          <span className="flex items-center gap-2">
            <StatusDot status={hasStock ? "in-stock" : "out-of-stock"} />
            <Badge variant={hasStock ? "inStock" : "outOfStock"}>
              {hasStock ? t.product.inStock : t.product.outOfStock}
            </Badge>
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="mono-section-label">{t.product.quantity}</p>
        <div className="flex flex-row items-center gap-3">
          <select
            value={selectedVariantId}
            onChange={(event) => onSelectVariant(event.target.value)}
            className="h-14 min-w-0 flex-2 border border-border bg-card px-3 font-mono-label text-xs uppercase tracking-widest text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            style={{ borderRadius: "var(--radius)" }}
          >
            {activeVariants.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.name} • A${Number(variant.price)}
              </option>
            ))}
          </select>
          <div className="quantity-stepper">
            <button
              onClick={onDecreaseQty}
              className="quantity-stepper-button"
              disabled={qty <= 1}
            >
              -
            </button>
            <span className="quantity-stepper-value">{qty}</span>
            <button
              onClick={onIncreaseQty}
              className="quantity-stepper-button"
              disabled={qty >= maxAddable}
            >
              +
            </button>
          </div>
        </div>

        {hasStock && qtyInCart > 0 && (
          <p className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
            {isFullyInCart
              ? `Đã có ${qtyInCart} trong giỏ • đã đạt giới hạn kho`
              : `Đã có ${qtyInCart} trong giỏ • có thể thêm tối đa ${maxAddable}`}
          </p>
        )}

        <AddToCartMotion
          disabled={!isAvailable}
          imageUrl={imageUrl}
          label={product.name}
          onAddToCart={onAddToCart}
        >
          {({ disabled, onClick }) => (
            <MotionButton
              variant="accent"
              size="lg"
              className="w-full"
              disabled={disabled}
              onClick={() => void onClick()}
            >
              {isFullyInCart ? "ĐÃ THÊM TỐI ĐA" : t.product.addToCart}
            </MotionButton>
          )}
        </AddToCartMotion>
      </div>
    </>
  );
}

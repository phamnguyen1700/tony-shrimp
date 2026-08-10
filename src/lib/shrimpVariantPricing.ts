import type { ShrimpListItem, ShrimpVariant } from "@/types/shrimp";

export function getFirstShrimpVariant(product: ShrimpListItem): ShrimpVariant | null {
  if (product.first_variant) return product.first_variant;
  if (product.variants?.length) {
    return product.variants.find((variant) => variant.is_active) ?? product.variants[0] ?? null;
  }
  return null;
}

export function getShrimpListPrice(product: ShrimpListItem) {
  const variant = getFirstShrimpVariant(product);
  return Number(variant?.price ?? product.min_price ?? 0);
}

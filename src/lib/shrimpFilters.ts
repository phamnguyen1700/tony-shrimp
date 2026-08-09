import type { ShopFilters, ShrimpListItem } from "@/types/shrimp";

export const emptyShopFilters: ShopFilters = {
  types: [],
  colors: [],
  grades: [],
  rarities: [],
  traits: [],
  availability: [],
};

export function activeShopFilterCount(filters: ShopFilters) {
  return Object.values(filters).reduce((sum, values) => sum + values.length, 0);
}

export function filterShrimpProducts(products: ShrimpListItem[], filters: ShopFilters) {
  return products.filter((product) => {
    if (filters.types.length && !filters.types.includes(product.type)) return false;
    if (filters.colors.length && !product.colors.some((color) => filters.colors.includes(color))) return false;
    if (filters.grades.length && (!product.grade || !filters.grades.includes(product.grade))) return false;
    if (filters.rarities.length && (!product.rarity || !filters.rarities.includes(product.rarity))) return false;
    if (filters.traits.length && !filters.traits.some((trait) => product.traits.includes(trait))) return false;

    if (filters.availability.length) {
      const wantsInStock = filters.availability.includes("in-stock");
      const wantsOutOfStock = filters.availability.includes("out-of-stock");
      if (wantsInStock && !wantsOutOfStock && !product.is_available) return false;
      if (!wantsInStock && wantsOutOfStock && product.is_available) return false;
    }

    return true;
  });
}

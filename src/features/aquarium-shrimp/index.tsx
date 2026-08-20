"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import PageHero from "@/components/common/layout/PageHero";
import AppBreadcrumb from "@/components/common/navigation/AppBreadcrumb";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/config/api";
import { routes } from "@/config/routes";
import {
  useCatalogOptions,
  useFetchShrimpDetail,
  useShrimpList,
} from "@/hooks/shrimp";
import { fadeUp, staggerContainer } from "@/lib/motionVariants";
import {
  activeShopFilterCount,
  emptyShopFilters,
  filterShrimpProducts,
} from "@/lib/shrimpFilters";
import { useAppRuntime } from "@/providers/AppProviders";
import { useCart } from "@/store/cartStore";
import { useShrimpOptionsStore } from "@/store/shrimpStore";
import type {
  CatalogOptions,
  ShopFilters,
  ShrimpListItem,
  ShrimpVariant,
} from "@/types/shrimp";
import ShopEmptyState from "./components/ShopEmptyState";
import ShopFilterPanel from "./components/ShopFilterPanel";
import ShopMobileFilterBar from "./components/ShopMobileFilterBar";
import ShopMobileFilterSheet from "./components/ShopMobileFilterSheet";
import ShopProductCard from "./components/ShopProductCard";
import ShopProductGrid from "./components/ShopProductGrid";

const fallbackCatalogOptions: CatalogOptions = {
  catalog_statuses: [],
  sale_units: [],
  lines: [],
  colors: [],
  grades: [],
  rarities: [],
  traits: [],
};

export default function AquariumShrimpFeature() {
  const { t } = useAppRuntime();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();
  const { items, addItem } = useCart();
  const fetchShrimpDetail = useFetchShrimpDetail();
  const catalogOptionsQuery = useCatalogOptions();
  const storedOptions = useShrimpOptionsStore((state) => state.catalogOptions);
  const search = searchParams.get("search")?.trim() ?? "";
  const shrimpQuery = useShrimpList({
    limit: 100,
    ...(search ? { search } : {}),
  });
  const [filters, setFilters] = useState<ShopFilters>(emptyShopFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const options =
    catalogOptionsQuery.data ?? storedOptions ?? fallbackCatalogOptions;
  const products = shrimpQuery.data ?? [];
  const filteredProducts = filterShrimpProducts(products, filters);
  const filterCount = activeShopFilterCount(filters);

  function toggleFilter(key: keyof ShopFilters, value: string) {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  }

  function clearFilters() {
    setFilters(emptyShopFilters);
  }

  async function addProductToCart(product: ShrimpListItem) {
    if (!product.is_available) return;

    try {
      const detail = await fetchShrimpDetail(product.id);
      const activeVariants = detail.variants.filter(
        (variant) => variant.is_active,
      );
      const firstVariant =
        activeVariants.find((variant) => variant.stock_quantity > 0) ??
        activeVariants[0] ??
        detail.variants[0];
      if (!firstVariant) return;
      const qtyInCart = getCartQuantityForVariant(items, firstVariant.id);
      const maxAddable = Math.max(0, firstVariant.stock_quantity - qtyInCart);
      if (maxAddable <= 0) {
        toast.error("This item has reached the available stock in your cart.");
        return;
      }

      const imageUrl =
        detail.images.find((image) => image.is_primary)?.url ??
        detail.images[0]?.url ??
        product.primary_image_url ??
        undefined;

      addItem({
        productId: detail.id,
        productSlug: detail.slug,
        variantId: firstVariant.id,
        name: detail.name,
        variantName: firstVariant.name,
        grade: detail.grade ?? undefined,
        imageUrl,
        price: Number(firstVariant.price),
        saleUnit: firstVariant.sale_unit,
        saleQuantity: firstVariant.sale_quantity,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not add shrimp to cart."));
    }
  }

  return (
    <div className="min-h-screen bg-background pt-14">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <motion.div
          className="pt-8 md:pt-12"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <AppBreadcrumb
            items={[
              { label: t.brand, href: routes.home },
              { label: t.nav.shop },
            ]}
          />
        </motion.div>
        <PageHero
          title={t.shop.title}
          reduced={reduced}
          // className="py-2 md:py-5"
        />

        <ShopMobileFilterBar
          t={t}
          filterCount={filterCount}
          onOpen={() => setMobileFiltersOpen(true)}
          onClear={clearFilters}
        />

        <div className="grid gap-8 py-8 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden md:block">
            <div className="sticky top-24 space-y-5 border-r border-border pr-6">
              <ShopFilterPanel
                filters={filters}
                t={t}
                options={options}
                onToggle={toggleFilter}
              />
              {filterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
                >
                  {t.shop.clearAll}
                </button>
              )}
            </div>
          </aside>

          <motion.div
            variants={reduced ? undefined : staggerContainer}
            initial={reduced ? false : "hidden"}
            animate="visible"
          >
            <ShopProductGrid>
              {filteredProducts.map((product) => (
                <ShopProductCardContainer
                  key={product.id}
                  product={product}
                  t={t}
                  reduced={reduced}
                  hovered={hoveredId === product.id}
                  items={items}
                  onHover={setHoveredId}
                  onAddToCart={addProductToCart}
                />
              ))}
            </ShopProductGrid>
          </motion.div>
        </div>

        <ShopEmptyState
          isLoading={shrimpQuery.isLoading}
          isEmpty={!shrimpQuery.isLoading && filteredProducts.length === 0}
        />
      </div>

      <ShopMobileFilterSheet
        open={mobileFiltersOpen}
        t={t}
        filters={filters}
        options={options}
        filterCount={filterCount}
        resultCount={filteredProducts.length}
        onToggle={toggleFilter}
        onClear={clearFilters}
        onClose={() => setMobileFiltersOpen(false)}
      />
    </div>
  );
}

function ShopProductCardContainer({
  product,
  t,
  reduced,
  hovered,
  items,
  onHover,
  onAddToCart,
}: {
  product: ShrimpListItem;
  t: ReturnType<typeof useAppRuntime>["t"];
  reduced: boolean | null;
  hovered: boolean;
  items: ReturnType<typeof useCart>["items"];
  onHover: (id: string | null) => void;
  onAddToCart: (product: ShrimpListItem) => void;
}) {
  const defaultVariant = getDefaultListVariant(product);
  const qtyInCart = defaultVariant
    ? getCartQuantityForVariant(items, defaultVariant.id)
    : 0;
  const maxAddable = defaultVariant
    ? Math.max(0, defaultVariant.stock_quantity - qtyInCart)
    : 0;
  const addDisabled =
    !product.is_available ||
    (defaultVariant
      ? !defaultVariant.is_active ||
        defaultVariant.stock_quantity <= 0 ||
        maxAddable <= 0
      : false);
  const addLabel =
    product.is_available && defaultVariant && maxAddable <= 0
      ? "MAX IN CART"
      : t.product.addToCart;

  return (
    <motion.div variants={reduced ? undefined : fadeUp} layout>
      <ShopProductCard
        product={product}
        t={t}
        hovered={hovered}
        addDisabled={addDisabled}
        addLabel={addLabel}
        onHover={onHover}
        onAddToCart={onAddToCart}
      />
    </motion.div>
  );
}

function getDefaultListVariant(product: ShrimpListItem): ShrimpVariant | null {
  const activeVariants = product.variants?.filter((variant) => variant.is_active) ?? [];
  const inStockVariant = activeVariants.find((variant) => variant.stock_quantity > 0);
  if (inStockVariant) return inStockVariant;
  if (product.first_variant?.is_active) return product.first_variant;
  return activeVariants[0] ?? product.variants?.[0] ?? null;
}

function getCartQuantityForVariant(
  items: ReturnType<typeof useCart>["items"],
  variantId: string,
) {
  return items
    .filter((item) => item.variantId === variantId)
    .reduce((sum, item) => sum + item.quantity, 0);
}

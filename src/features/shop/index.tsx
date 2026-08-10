"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import PageHero from "@/components/common/layout/PageHero";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/config/api";
import { useCatalogOptions, useFetchShrimpDetail, useShrimpList } from "@/hooks/shrimp";
import { fadeUp, staggerContainer } from "@/lib/motionVariants";
import { activeShopFilterCount, emptyShopFilters, filterShrimpProducts } from "@/lib/shrimpFilters";
import { useAppRuntime } from "@/providers/AppProviders";
import { useCart } from "@/store/cartStore";
import { useShrimpOptionsStore } from "@/store/shrimpStore";
import type { CatalogOptions, ShopFilters, ShrimpListItem } from "@/types/shrimp";
import ShopEmptyState from "./components/ShopEmptyState";
import ShopFilterPanel from "./components/ShopFilterPanel";
import ShopMobileFilterBar from "./components/ShopMobileFilterBar";
import ShopMobileFilterSheet from "./components/ShopMobileFilterSheet";
import ShopProductCard from "./components/ShopProductCard";
import ShopProductGrid from "./components/ShopProductGrid";

const fallbackCatalogOptions: CatalogOptions = {
  catalog_statuses: [],
  sale_units: [],
  types: [],
  colors: [],
  grades: [],
  rarities: [],
  traits: [],
};

export default function ShopFeature() {
  const { t } = useAppRuntime();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();
  const { addItem } = useCart();
  const fetchShrimpDetail = useFetchShrimpDetail();
  const catalogOptionsQuery = useCatalogOptions();
  const storedOptions = useShrimpOptionsStore((state) => state.catalogOptions);
  const search = searchParams.get("search")?.trim() ?? "";
  const shrimpQuery = useShrimpList({ limit: 100, ...(search ? { search } : {}) });
  const [filters, setFilters] = useState<ShopFilters>(emptyShopFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const options = catalogOptionsQuery.data ?? storedOptions ?? fallbackCatalogOptions;
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
      const activeVariants = detail.variants.filter((variant) => variant.is_active);
      const firstVariant = activeVariants[0] ?? detail.variants[0];
      if (!firstVariant) return;
      const imageUrl =
        detail.images.find((image) => image.is_primary)?.url ??
        detail.images[0]?.url ??
        product.primary_image_url ??
        undefined;

      addItem({
        productId: detail.id,
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
        <PageHero title={t.shop.title} reduced={reduced} className="py-10 md:py-14" />

        <ShopMobileFilterBar
          t={t}
          filterCount={filterCount}
          onOpen={() => setMobileFiltersOpen(true)}
          onClear={clearFilters}
        />

        <div className="grid gap-8 py-8 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden md:block">
            <div className="sticky top-24 space-y-5 border-r border-border pr-6">
              <ShopFilterPanel filters={filters} t={t} options={options} onToggle={toggleFilter} />
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
                <motion.div key={product.id} variants={reduced ? undefined : fadeUp} layout>
                  <ShopProductCard
                    product={product}
                    t={t}
                    hovered={hoveredId === product.id}
                    onHover={setHoveredId}
                    onAddToCart={addProductToCart}
                  />
                </motion.div>
              ))}
            </ShopProductGrid>
          </motion.div>
        </div>

        <ShopEmptyState isLoading={shrimpQuery.isLoading} isEmpty={!shrimpQuery.isLoading && filteredProducts.length === 0} />
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

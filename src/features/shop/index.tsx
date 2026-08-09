"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useCatalogOptions, useShrimpList } from "@/hooks/shrimp";
import { fadeUp, staggerContainer } from "@/lib/motionVariants";
import { activeShopFilterCount, emptyShopFilters, filterShrimpProducts } from "@/lib/shrimpFilters";
import { useAppRuntime } from "@/providers/AppProviders";
import { useCart } from "@/store/cartStore";
import { useShrimpOptionsStore } from "@/store/shrimpStore";
import type { CatalogOptions, ShopFilters, ShrimpListItem } from "@/types/shrimp";
import ShopEmptyState from "./components/ShopEmptyState";
import ShopFilterPanel from "./components/ShopFilterPanel";
import ShopHero from "./components/ShopHero";
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

  function addProductToCart(product: ShrimpListItem) {
    if (!product.is_available) return;

    addItem({
      productId: product.id,
      name: product.name,
      grade: product.grade ?? undefined,
      imageUrl: product.primary_image_url ?? undefined,
      price: Number(product.min_price ?? 0),
    });
  }

  return (
    <div className="min-h-screen bg-background pt-14">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <motion.div
          className="py-10 md:py-14"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <ShopHero title={t.shop.title} />
        </motion.div>

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

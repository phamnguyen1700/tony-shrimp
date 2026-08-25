"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import PageHero from "@/components/common/layout/PageHero";
import LoadMoreSentinel from "@/components/common/lazy/LoadMoreSentinel";
import AppBreadcrumb from "@/components/common/navigation/AppBreadcrumb";
import toast from "react-hot-toast";
import { routes } from "@/config/routes";
import { facebookUrl } from "@/lib/seo/metadata";
import { getLocalizedApiErrorMessage } from "@/lib/config/apiErrorMessages";
import {
  useCatalogOptions,
  useFetchShrimpDetail,
  useShrimpList,
} from "@/hooks/shrimp";
import { useProgressiveItems } from "@/hooks/useProgressiveItems";
import { fadeUp, staggerContainer } from "@/lib/config/motionVariants";
import { shrimpCollectionLinks } from "@/lib/shrimp/collectionConfig";
import {
  activeShopFilterCount,
  emptyShopFilters,
  filterShrimpProducts,
} from "@/lib/shrimp/filters";
import { isHighQualityShrimp } from "@/lib/shrimp/highQuality";
import { useAppRuntime } from "@/providers/AppProviders";
import { useCart } from "@/store/cartStore";
import { useShrimpOptionsStore } from "@/store/shrimpStore";
import type {
  CatalogOptions,
  ShopFilters,
  ShrimpListItem,
  ShrimpListQuery,
  ShrimpVariant,
} from "@/types/shrimp";
import ShopEmptyState from "./components/ShopEmptyState";
import ShopCollectionIntro from "./components/ShopCollectionIntro";
import ShopCollectionLinks from "./components/ShopCollectionLinks";
import ShopFilterPanel from "./components/ShopFilterPanel";
import ShopMobileFilterBar from "./components/ShopMobileFilterBar";
import ShopMobileFilterSheet from "./components/ShopMobileFilterSheet";
import ShopProductCard from "./components/ShopProductCard";
import ShopProductGrid from "./components/ShopProductGrid";

const fallbackCatalogOptions: CatalogOptions = {
  species: [],
  catalog_statuses: [],
  sale_units: [],
  lines: [],
  colors: [],
  grades: [],
  rarities: [],
  traits: [],
};

const shopInitialVisibleCount = 9;
const shopVisibleStep = 9;

interface AquariumShrimpFeatureProps {
  initialProducts?: ShrimpListItem[];
  initialQuery?: ShrimpListQuery;
  initialFilters?: ShopFilters;
  collectionTitle?: string;
  activeCollectionSlug?: string;
}

export default function AquariumShrimpFeature({
  initialProducts,
  initialQuery,
  initialFilters,
  collectionTitle,
  activeCollectionSlug = "",
}: AquariumShrimpFeatureProps) {
  const { t } = useAppRuntime();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();
  const { items, addItem } = useCart();
  const fetchShrimpDetail = useFetchShrimpDetail();
  const catalogOptionsQuery = useCatalogOptions();
  const storedOptions = useShrimpOptionsStore((state) => state.catalogOptions);
  const search = searchParams.get("search")?.trim() ?? "";
  const shrimpQuery = useShrimpList({
    limit: 24,
    ...initialQuery,
    ...(search ? { search } : {}),
  }, {
    initialData: search ? undefined : initialProducts,
  });
  const [filters, setFilters] = useState<ShopFilters>(initialFilters ?? emptyShopFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const options =
    catalogOptionsQuery.data ?? storedOptions ?? fallbackCatalogOptions;
  const products = shrimpQuery.data ?? [];
  const collectionFilterOptions = useMemo(
    () => createFilterOptionsForProducts(products, options),
    [products, options],
  );
  const filteredProducts = useMemo(
    () => filterShrimpProducts(products, filters),
    [products, filters],
  );
  const {
    visibleItems: visibleProducts,
    hasMore: hasMoreVisibleProducts,
    loadMore: loadMoreVisibleProducts,
  } = useProgressiveItems(filteredProducts, {
    initialCount: shopInitialVisibleCount,
    step: shopVisibleStep,
  });
  const filterCount = activeShopFilterCount(filters);
  const collectionIntro = activeCollectionSlug
    ? t.shop.collections[activeCollectionSlug as keyof typeof t.shop.collections]
    : undefined;

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
    if (isHighQualityShrimp(product)) {
      toast.error(t.product.highQualityContactOnly);
      return;
    }

    try {
      const detail = await fetchShrimpDetail(product.id);
      if (isHighQualityShrimp(detail)) {
        toast.error(t.product.highQualityContactOnly);
        return;
      }
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
        toast.error(t.apiErrors.maxStockInCart);
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
      toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.addToCartFailed));
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
          title={collectionTitle ?? t.shop.title}
          reduced={reduced}
          titleClassName="text-3xl md:text-7xl"
          // className="py-2 md:py-5"
        />

        {collectionIntro && <ShopCollectionIntro intro={collectionIntro} />}

        <ShopCollectionLinks
          links={shrimpCollectionLinks}
          activeCollectionSlug={activeCollectionSlug}
          className="mt-6 border-y border-border py-4 md:hidden"
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
                options={collectionFilterOptions}
                collectionLinks={shrimpCollectionLinks}
                activeCollectionSlug={activeCollectionSlug}
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
            className="min-h-[420px]"
            variants={reduced ? undefined : staggerContainer}
            initial={reduced ? false : "hidden"}
            animate="visible"
          >
            {shrimpQuery.isLoading || filteredProducts.length === 0 ? (
              <ShopEmptyState
                isLoading={shrimpQuery.isLoading}
                isEmpty={!shrimpQuery.isLoading && filteredProducts.length === 0}
              />
            ) : (
              <>
                <ShopProductGrid>
                  {visibleProducts.map((product) => (
                    <ShopProductCardContainer
                      key={product.id}
                      product={product}
                      t={t}
                      reduced={reduced}
                      hovered={hoveredId === product.id}
                      items={items}
                      onHover={setHoveredId}
                      onAddToCart={addProductToCart}
                      onContact={() => window.open(facebookUrl, "_blank", "noopener,noreferrer")}
                    />
                  ))}
                </ShopProductGrid>
                <LoadMoreSentinel
                  enabled={hasMoreVisibleProducts}
                  onLoadMore={loadMoreVisibleProducts}
                  className="mt-8"
                />
              </>
            )}
          </motion.div>
        </div>
      </div>

      <ShopMobileFilterSheet
        open={mobileFiltersOpen}
        t={t}
        filters={filters}
        options={collectionFilterOptions}
        collectionLinks={shrimpCollectionLinks}
        activeCollectionSlug={activeCollectionSlug}
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
  onContact,
}: {
  product: ShrimpListItem;
  t: ReturnType<typeof useAppRuntime>["t"];
  reduced: boolean | null;
  hovered: boolean;
  items: ReturnType<typeof useCart>["items"];
  onHover: (id: string | null) => void;
  onAddToCart: (product: ShrimpListItem) => void;
  onContact: () => void;
}) {
  const defaultVariant = getDefaultListVariant(product);
  const isHighQuality = isHighQualityShrimp(product);
  const qtyInCart = defaultVariant
    ? getCartQuantityForVariant(items, defaultVariant.id)
    : 0;
  const maxAddable = defaultVariant
    ? Math.max(0, defaultVariant.stock_quantity - qtyInCart)
    : 0;
  const addDisabled =
    isHighQuality ||
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
        isHighQuality={isHighQuality}
        onHover={onHover}
        onAddToCart={onAddToCart}
        onContact={onContact}
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

function createFilterOptionsForProducts(
  products: ShrimpListItem[],
  catalogOptions: CatalogOptions,
): Pick<CatalogOptions, "species" | "lines" | "colors" | "grades" | "rarities" | "traits"> {
  const values = {
    species: new Set<string>(),
    lines: new Set<string>(),
    colors: new Set<string>(),
    grades: new Set<string>(),
    rarities: new Set<string>(),
    traits: new Set<string>(),
  };

  for (const product of products) {
    if (product.species) values.species.add(product.species);
    if (product.line) values.lines.add(product.line);
    for (const color of product.colors) values.colors.add(color);
    if (product.grade) values.grades.add(product.grade);
    if (product.rarity) values.rarities.add(product.rarity);
    for (const trait of product.traits) values.traits.add(trait);
  }

  return {
    species: orderFilterValues(catalogOptions.species ?? [], values.species),
    lines: orderFilterValues(catalogOptions.lines, values.lines),
    colors: orderFilterValues(catalogOptions.colors, values.colors),
    grades: orderFilterValues(catalogOptions.grades, values.grades),
    rarities: orderFilterValues(catalogOptions.rarities, values.rarities),
    traits: orderFilterValues(catalogOptions.traits, values.traits),
  };
}

function orderFilterValues(preferredOrder: string[], availableValues: Set<string>) {
  const ordered = preferredOrder.filter((value) => availableValues.has(value));
  const extras = [...availableValues]
    .filter((value) => !preferredOrder.includes(value))
    .sort((a, b) => a.localeCompare(b));

  return [...ordered, ...extras];
}

function getCartQuantityForVariant(
  items: ReturnType<typeof useCart>["items"],
  variantId: string,
) {
  return items
    .filter((item) => item.variantId === variantId)
    .reduce((sum, item) => sum + item.quantity, 0);
}

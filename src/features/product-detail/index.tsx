"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import AppBreadcrumb from "@/components/common/navigation/AppBreadcrumb";
import { routes } from "@/config/routes";
import { useShrimpDetailBySlug, useShrimpList } from "@/hooks/shrimp";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/config/motionVariants";
import { facebookUrl } from "@/lib/seo/metadata";
import { isHighQualityShrimp } from "@/lib/shrimp/highQuality";
import { useAppRuntime } from "@/providers/AppProviders";
import { useCart } from "@/store/cartStore";
import ProductAccordions from "./components/ProductAccordions";
import ProductBadgeList from "./components/ProductBadgeList";
import ProductDetailLayout from "./components/ProductDetailLayout";
import ProductInfoHeader from "./components/ProductInfoHeader";
import ProductLoadingState from "./components/ProductLoadingState";
import ProductMediaGallery from "./components/ProductMediaGallery";
import ProductNotFound from "./components/ProductNotFound";
import ProductPurchasePanel from "./components/ProductPurchasePanel";
import ProductWaterParameters from "./components/ProductWaterParameters";
import type { ShrimpDetail, ShrimpListItem } from "@/types/shrimp";

interface ProductDetailFeatureProps {
  slug: string;
  initialProduct?: ShrimpDetail;
  initialProducts?: ShrimpListItem[];
}

export default function ProductDetailFeature({
  slug,
  initialProduct,
  initialProducts,
}: ProductDetailFeatureProps) {
  const { t } = useAppRuntime();
  const reduced = useReducedMotion();
  const { items, addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const detailQuery = useShrimpDetailBySlug(slug, { initialData: initialProduct });
  const listQuery = useShrimpList({ limit: 24 }, { initialData: initialProducts });

  const product = detailQuery.data;
  const isHighQuality = product ? isHighQualityShrimp(product) : false;
  const activeVariants =
    product?.variants.filter((variant) => variant.is_active) ?? [];
  const selectedVariant =
    activeVariants.find((variant) => variant.id === selectedVariantId) ??
    activeVariants[0] ??
    product?.variants[0];

  const qtyInCart =
    product && selectedVariant
      ? (items.find(
          (item) =>
            item.productId === product.id &&
            item.variantId === selectedVariant.id,
        )?.quantity ?? 0)
      : 0;

  const maxAddable = selectedVariant
    ? Math.max(0, selectedVariant.stock_quantity - qtyInCart)
    : 0;

  useEffect(() => {
    setQty((value) => {
      if (maxAddable <= 0) return 1;
      return Math.min(Math.max(value, 1), maxAddable);
    });
  }, [selectedVariant?.id, maxAddable]);

  useEffect(() => {
    if (!product) return;

    sessionStorage.setItem(
      "tony-last-viewed-product",
      JSON.stringify({
        href: routes.product(product.slug),
        name: product.name,
      }),
    );
  }, [product]);

  if (detailQuery.isLoading) {
    return <ProductLoadingState />;
  }

  if (!product || detailQuery.isError) {
    return <ProductNotFound t={t} />;
  }

  const imageUrl =
    product.images.find((image) => image.is_primary)?.url ??
    product.images[0]?.url ??
    undefined;
  const products = listQuery.data ?? [];
  const productIndex = products.findIndex((item) => item.slug === product.slug);

  function handleAddToCart() {
    if (!product || !selectedVariant) return;
    if (isHighQuality) return;
    if (qty <= 0 || qty > maxAddable) return;

    addItem(
      {
        productId: product.id,
        productSlug: product.slug,
        variantId: selectedVariant.id,
        name: product.name,
        variantName: selectedVariant.name,
        grade: product.grade ?? undefined,
        imageUrl,
        price: Number(selectedVariant.price),
        saleUnit: selectedVariant.sale_unit,
        saleQuantity: selectedVariant.sale_quantity,
      },
      qty,
    );
  }

  function handleContact() {
    window.open(facebookUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <ProductDetailLayout>
      <motion.div
        className="mb-6"
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <AppBreadcrumb
          items={[
            { label: t.brand, href: routes.home },
            { label: t.nav.shop, href: routes.shop },
            { label: product.name },
          ]}
        />
      </motion.div>
      <motion.div
        className="grid gap-8 md:grid-cols-2 md:gap-16"
        variants={reduced ? undefined : staggerContainer}
        initial={reduced ? false : "hidden"}
        animate="visible"
      >
        <motion.div
          className="space-y-6"
          variants={reduced ? undefined : staggerContainer}
        >
          <motion.div
            variants={reduced ? undefined : fadeIn}
            transition={{ duration: 0.5 }}
          >
            <ProductMediaGallery product={product} />
          </motion.div>
          <motion.div variants={reduced ? undefined : fadeUp}>
            <ProductAccordions t={t} product={product} />
          </motion.div>
        </motion.div>

        <motion.div
          className="space-y-6"
          variants={reduced ? undefined : staggerContainer}
        >
          <motion.div variants={reduced ? undefined : fadeUp}>
            <ProductInfoHeader
              product={product}
              productIndex={Math.max(0, productIndex)}
              totalProducts={products.length || 1}
            />
          </motion.div>
          <motion.div variants={reduced ? undefined : fadeUp}>
            <ProductBadgeList product={product} />
          </motion.div>
          <motion.div variants={reduced ? undefined : fadeUp}>
            <ProductPurchasePanel
              t={t}
              product={product}
              selectedVariant={selectedVariant}
              selectedVariantId={selectedVariant?.id ?? ""}
              imageUrl={imageUrl}
              qty={qty}
              qtyInCart={qtyInCart}
              maxAddable={maxAddable}
              isHighQuality={isHighQuality}
              onAddToCart={handleAddToCart}
              onContact={handleContact}
              onDecreaseQty={() => setQty((value) => Math.max(1, value - 1))}
              onIncreaseQty={() =>
                setQty((value) => Math.min(maxAddable, value + 1))
              }
              onSelectVariant={setSelectedVariantId}
            />
          </motion.div>
          <motion.div variants={reduced ? undefined : fadeUp}>
            <ProductWaterParameters t={t} product={product} />
          </motion.div>
        </motion.div>
      </motion.div>
    </ProductDetailLayout>
  );
}

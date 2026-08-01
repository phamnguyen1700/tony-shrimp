"use client";

import { useAppRuntime } from "@/providers/AppProviders";
import ProductDetailScreen from "./components/ProductDetailScreen";

export default function ProductDetailFeature({ slug }: { slug: string }) {
  const { t } = useAppRuntime();
  return <ProductDetailScreen t={t} slug={slug} />;
}

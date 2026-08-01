"use client";

import { useAppRuntime } from "@/providers/AppProviders";
import ShopScreen from "./components/ShopScreen";

export default function ShopFeature() {
  const { t } = useAppRuntime();
  return <ShopScreen t={t} />;
}

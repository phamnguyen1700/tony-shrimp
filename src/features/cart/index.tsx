"use client";

import { useAppRuntime } from "@/providers/AppProviders";
import CartScreen from "./components/CartScreen";

export default function CartFeature() {
  const { t } = useAppRuntime();
  return <CartScreen t={t} />;
}

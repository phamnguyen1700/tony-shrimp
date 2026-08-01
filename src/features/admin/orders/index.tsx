"use client";

import { useAppRuntime } from "@/providers/AppProviders";
import OrdersAdminScreen from "./components/OrdersAdminScreen";

export default function AdminOrdersFeature() {
  const { t } = useAppRuntime();
  return <OrdersAdminScreen t={t} />;
}

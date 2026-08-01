"use client";

import { useAppRuntime } from "@/providers/AppProviders";
import OrderDetailScreen from "./components/OrderDetailScreen";

export default function AdminOrderDetailFeature({ id }: { id: string }) {
  const { t } = useAppRuntime();
  return <OrderDetailScreen t={t} id={id} />;
}

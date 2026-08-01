"use client";

import { useAppRuntime } from "@/providers/AppProviders";
import OrderTrackingScreen from "./components/OrderTrackingScreen";

export default function OrderTrackingFeature({ id }: { id: string }) {
  const { t } = useAppRuntime();
  return <OrderTrackingScreen t={t} id={id} />;
}

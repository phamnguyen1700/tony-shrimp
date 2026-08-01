"use client";

import { useAppRuntime } from "@/providers/AppProviders";
import DashboardScreen from "./components/DashboardScreen";

export default function AdminDashboardFeature() {
  const { t } = useAppRuntime();
  return <DashboardScreen t={t} />;
}

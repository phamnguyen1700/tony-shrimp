"use client";

import { useAppRuntime } from "@/providers/AppProviders";
import ShrimpAdminScreen from "./components/ShrimpAdminScreen";

export default function AdminShrimpFeature() {
  const { t } = useAppRuntime();
  return <ShrimpAdminScreen t={t} />;
}

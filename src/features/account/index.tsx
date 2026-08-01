"use client";

import { useAppRuntime } from "@/providers/AppProviders";
import AccountScreen from "./components/AccountScreen";

export default function AccountFeature() {
  const { t } = useAppRuntime();
  return <AccountScreen t={t} />;
}

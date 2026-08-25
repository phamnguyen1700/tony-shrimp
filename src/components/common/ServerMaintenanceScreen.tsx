"use client";

import ServerMaintenance from "@/components/common/ServerMaintenance";
import { useAppRuntime } from "@/providers/AppProviders";

export default function ServerMaintenanceScreen() {
  const { t } = useAppRuntime();

  return <ServerMaintenance t={t} />;
}

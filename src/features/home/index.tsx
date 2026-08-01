"use client";

import { useAppRuntime } from "@/providers/AppProviders";
import LandingScreen from "./components/LandingScreen";

export default function HomeFeature() {
  const { t } = useAppRuntime();
  return <LandingScreen t={t} />;
}

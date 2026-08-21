import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics";
import type { AnalyticsPeriodKey } from "@/types/analytics";

export const analyticsQueryKeys = {
  ownerDashboard: (period: AnalyticsPeriodKey) =>
    ["owner", "analytics", "dashboard", period] as const,
  ownerPayouts: (limit: number) =>
    ["owner", "analytics", "payouts", limit] as const,
  ownerTraffic: (period: AnalyticsPeriodKey) =>
    ["owner", "analytics", "traffic", period] as const,
  ownerRealtime: () => ["owner", "analytics", "realtime"] as const,
};

export function useOwnerAnalyticsDashboard(period: AnalyticsPeriodKey = "30d") {
  return useQuery({
    queryKey: analyticsQueryKeys.ownerDashboard(period),
    queryFn: () => analyticsService.getOwnerDashboard(period),
  });
}

export function useOwnerAnalyticsPayouts(limit = 10) {
  return useQuery({
    queryKey: analyticsQueryKeys.ownerPayouts(limit),
    queryFn: () => analyticsService.listOwnerPayouts(limit),
  });
}

export function useOwnerAnalyticsTraffic(period: AnalyticsPeriodKey = "30d") {
  return useQuery({
    queryKey: analyticsQueryKeys.ownerTraffic(period),
    queryFn: () => analyticsService.getOwnerTraffic(period),
  });
}

export function useOwnerAnalyticsRealtime() {
  return useQuery({
    queryKey: analyticsQueryKeys.ownerRealtime(),
    queryFn: () => analyticsService.getOwnerRealtime(),
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });
}

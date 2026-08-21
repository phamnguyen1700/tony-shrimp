import { apiClient } from "@/config/api";
import { endpoints } from "@/config/endpoints";
import type {
  AnalyticsDashboardResponse,
  AnalyticsPayoutListResponse,
  AnalyticsPeriodKey,
  AnalyticsRealtimeResponse,
  AnalyticsTrafficResponse,
} from "@/types/analytics";

export const analyticsService = {
  async getOwnerDashboard(period: AnalyticsPeriodKey = "30d") {
    const response = await apiClient.get<AnalyticsDashboardResponse>(
      endpoints.ownerAnalytics.dashboard,
      { params: { period } },
    );
    return response.data;
  },

  async listOwnerPayouts(limit = 10) {
    const response = await apiClient.get<AnalyticsPayoutListResponse>(
      endpoints.ownerAnalytics.payouts,
      { params: { limit } },
    );
    return response.data;
  },

  async getOwnerTraffic(period: AnalyticsPeriodKey = "30d") {
    const response = await apiClient.get<AnalyticsTrafficResponse>(
      endpoints.ownerAnalytics.traffic,
      { params: { period } },
    );
    return response.data;
  },

  async getOwnerRealtime() {
    const response = await apiClient.get<AnalyticsRealtimeResponse>(
      endpoints.ownerAnalytics.realtime,
    );
    return response.data;
  },
};

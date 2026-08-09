import { endpoints } from "@/config/endpoints";
import { apiClient } from "@/config/api";

export interface HealthResponse {
  status: "ok";
}

export const healthService = {
  async check() {
    const response = await apiClient.get<HealthResponse>(endpoints.health);
    return response.data;
  },
};

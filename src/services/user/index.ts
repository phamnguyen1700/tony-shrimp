import { endpoints } from "@/config/endpoints";
import { apiClient } from "@/config/api";
import type { AuthUser } from "@/types/user";

export const userService = {
  async getCurrentUser() {
    const response = await apiClient.get<AuthUser>(endpoints.auth.me);
    return response.data;
  },
};

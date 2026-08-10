import { apiClient } from "@/config/api";
import { endpoints } from "@/config/endpoints";
import type {
  OwnerUserDetail,
  OwnerUserListQuery,
  OwnerUserListResponse,
  UpdateOwnerUserRolePayload,
} from "@/types/customer";

export const customerService = {
  async listOwnerUsers(params?: OwnerUserListQuery) {
    const response = await apiClient.get<OwnerUserListResponse>(endpoints.ownerUsers.users, {
      params,
    });
    return response.data;
  },

  async getOwnerUserDetail(userId: string) {
    const response = await apiClient.get<OwnerUserDetail>(endpoints.ownerUsers.user(userId));
    return response.data;
  },

  async activateOwnerUser(userId: string) {
    const response = await apiClient.patch<OwnerUserDetail>(endpoints.ownerUsers.activate(userId));
    return response.data;
  },

  async deactivateOwnerUser(userId: string) {
    const response = await apiClient.patch<OwnerUserDetail>(endpoints.ownerUsers.deactivate(userId));
    return response.data;
  },

  async updateOwnerUserRole(userId: string, payload: UpdateOwnerUserRolePayload) {
    const response = await apiClient.patch<OwnerUserDetail>(endpoints.ownerUsers.role(userId), payload);
    return response.data;
  },

  async hardDeleteOwnerUser(userId: string) {
    await apiClient.delete<void>(endpoints.ownerUsers.user(userId));
  },
};


import { apiClient } from "@/config/api";
import { endpoints } from "@/config/endpoints";
import type {
  OwnerNotificationListQuery,
  OwnerNotificationListResponse,
} from "@/types/notification";

export const notificationService = {
  async listOwnerNotifications(params?: OwnerNotificationListQuery) {
    const response = await apiClient.get<OwnerNotificationListResponse>(
      endpoints.ownerNotifications.notifications,
      { params },
    );

    return response.data;
  },

  async markOwnerNotificationRead(notificationId: string) {
    const response = await apiClient.patch<void>(endpoints.ownerNotifications.read(notificationId));
    return response.data;
  },

  async markAllOwnerNotificationsRead() {
    const response = await apiClient.patch<void>(endpoints.ownerNotifications.readAll);
    return response.data;
  },
};

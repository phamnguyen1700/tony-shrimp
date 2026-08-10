export type OwnerNotificationType = "new_order" | string;

export interface OwnerNotificationData {
  order_id?: string;
  order_number?: string;
  [key: string]: unknown;
}

export interface OwnerNotification {
  id: string;
  recipient_user_id: string | null;
  recipient_role: string | null;
  type: OwnerNotificationType;
  title: string;
  message: string;
  data: OwnerNotificationData | null;
  read_at: string | null;
  created_at: string;
}

export interface OwnerNotificationListResponse {
  items: OwnerNotification[];
  total: number;
  unread_count: number;
  limit: number;
  offset: number;
}

export interface OwnerNotificationListQuery {
  unread_only?: boolean;
  limit?: number;
  offset?: number;
}

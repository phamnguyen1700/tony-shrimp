"use client";

import LivePushFeed from "@/components/common/motion/LivePushFeed";
import { useMarkOwnerNotificationRead, useOwnerNotifications } from "@/hooks/notification";
import AdminNotificationCard from "./AdminNotificationCard";

export default function AdminNotificationsPanel() {
  const notificationsQuery = useOwnerNotifications({ unread_only: true, limit: 8, offset: 0 });
  const markNotificationReadMutation = useMarkOwnerNotificationRead();
  const notifications = notificationsQuery.data?.items ?? [];

  return (
    <aside className="border-t border-border p-6 md:p-8 xl:sticky xl:top-0 xl:min-h-screen xl:border-l xl:border-t-0">
      <div className="mb-4">
        <div>
          <p className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Notifications
          </p>
          <p className="mt-1 font-body text-xs text-muted-foreground">
            Unread order alerts stay here until you read them.
          </p>
        </div>
      </div>

      {notificationsQuery.isLoading ? (
        <p className="py-10 text-center font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
          Loading notifications...
        </p>
      ) : notifications.length > 0 ? (
        <LivePushFeed
          items={notifications}
          maxVisible={6}
          gap={8}
          animation="scale"
          renderItem={(notification, index) => (
            <AdminNotificationCard
              notification={notification}
              index={index}
              onRead={(notificationId) => markNotificationReadMutation.mutate(notificationId)}
            />
          )}
        />
      ) : (
        <p className="py-10 text-center font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
          No unread order notifications.
        </p>
      )}
    </aside>
  );
}

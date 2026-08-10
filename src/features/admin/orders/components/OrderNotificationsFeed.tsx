import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import LivePushFeed from "@/components/common/motion/LivePushFeed";
import type { OwnerNotification } from "@/types/notification";
import OrderNotificationBell from "./OrderNotificationBell";
import OrderNotificationCard from "./OrderNotificationCard";

interface OrderNotificationsFeedProps {
  notifications: OwnerNotification[];
  isLoading: boolean;
  onMarkRead: (notificationId: string) => void;
}

export default function OrderNotificationsFeed({
  notifications,
  isLoading,
  onMarkRead,
}: OrderNotificationsFeedProps) {
  const [playNotificationBell] = useSound("/sounds/notification.wav", {
    interrupt: true,
    soundEnabled: true,
    volume: 0.55,
  });
  const playedNotificationIdsRef = useRef<Set<string>>(new Set());
  const hasPrimedNotificationsRef = useRef(false);
  const [bellPulse, setBellPulse] = useState(0);

  useEffect(() => {
    if (!hasPrimedNotificationsRef.current) {
      playedNotificationIdsRef.current = new Set(
        notifications.map((notification) => notification.id),
      );
      hasPrimedNotificationsRef.current = true;
      if (notifications.length > 0) setBellPulse((value) => value + 1);
      return;
    }

    const newNotifications = notifications.filter(
      (notification) => !playedNotificationIdsRef.current.has(notification.id),
    );
    if (newNotifications.length === 0) return;

    for (const notification of newNotifications) {
      playedNotificationIdsRef.current.add(notification.id);
    }

    newNotifications.forEach((_, index) => {
      window.setTimeout(() => {
        setBellPulse((value) => value + 1);
        playNotificationBell();
      }, index * 220);
    });
  }, [notifications, playNotificationBell]);

  return (
    <section className="border-t border-border pt-6 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Notifications
          </p>
          <p className="mt-1 font-body text-xs text-muted-foreground">
            Unread order alerts stay here until you read them.
          </p>
        </div>
        <OrderNotificationBell
          unreadCount={notifications.length}
          pulseKey={bellPulse}
          onPlay={() => {
            setBellPulse((value) => value + 1);
            playNotificationBell();
          }}
        />
      </div>

      {isLoading ? (
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
            <OrderNotificationCard
              notification={notification}
              index={index}
              onRead={onMarkRead}
            />
          )}
        />
      ) : (
        <p className="py-10 text-center font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
          No unread order notifications.
        </p>
      )}
    </section>
  );
}

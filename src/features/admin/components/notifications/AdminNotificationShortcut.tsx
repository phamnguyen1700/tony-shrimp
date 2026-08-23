"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useSound from "use-sound";
import { routes } from "@/config/routes";
import { useOwnerNotifications } from "@/hooks/notification";
import AdminNotificationBell from "./AdminNotificationBell";

export default function AdminNotificationShortcut() {
  const router = useRouter();
  const notificationsQuery = useOwnerNotifications({ unread_only: true, limit: 8, offset: 0 });
  const notifications = notificationsQuery.data?.items ?? [];
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
    <AdminNotificationBell
      unreadCount={notifications.length}
      pulseKey={bellPulse}
      label={notificationsQuery.isLoading ? "Loading order notifications" : "Open orders"}
      onClick={() => router.push(routes.admin.orders)}
    />
  );
}

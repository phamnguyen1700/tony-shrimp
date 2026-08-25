"use client";

import { useEffect, useMemo, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { endpoints } from "@/config/endpoints";
import { env } from "@/config/env";
import { getLocalizedApiErrorMessage } from "@/lib/config/apiErrorMessages";
import { useAppRuntime } from "@/providers/AppProviders";
import { ownerNotificationListQuerySchema } from "@/schema/notification";
import { notificationService } from "@/services/notification";
import type {
  OwnerNotification,
  OwnerNotificationListQuery,
  OwnerNotificationListResponse,
} from "@/types/notification";

export const notificationQueryKeys = {
  ownerList: (params?: OwnerNotificationListQuery) =>
    ["owner", "notifications", params ?? {}] as const,
};

function toWebSocketUrl(path: string) {
  const base = env.apiBaseUrl.replace(/^http/i, "ws").replace(/\/$/, "");
  return `${base}${path}`;
}

function isOwnerNotification(value: unknown): value is OwnerNotification {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<OwnerNotification>;
  return typeof candidate.id === "string" && typeof candidate.title === "string";
}

export function useOwnerNotifications(params?: OwnerNotificationListQuery, enabled = true) {
  const validParams = ownerNotificationListQuerySchema.parse(params ?? {});

  return useQuery({
    queryKey: notificationQueryKeys.ownerList(validParams),
    queryFn: () => notificationService.listOwnerNotifications(validParams),
    enabled,
  });
}

export function useMarkOwnerNotificationRead() {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.markOwnerNotificationRead(notificationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["owner", "notifications"] });
    },
    onError: (error) => toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.markNotificationReadFailed)),
  });
}

export function useMarkAllOwnerNotificationsRead() {
  const queryClient = useQueryClient();
  const { t } = useAppRuntime();

  return useMutation({
    mutationFn: () => notificationService.markAllOwnerNotificationsRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["owner", "notifications"] });
    },
    onError: (error) => toast.error(getLocalizedApiErrorMessage(error, t, t.apiErrors.markNotificationsReadFailed)),
  });
}

export function useOwnerNotificationStream(enabled = true) {
  const queryClient = useQueryClient();
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef<number | null>(null);

  const listQueryKey = useMemo(
    () => notificationQueryKeys.ownerList({ unread_only: false, limit: 20, offset: 0 }),
    [],
  );

  useEffect(() => {
    if (!enabled) return;

    let socket: WebSocket | null = null;
    let closedByEffect = false;

    function syncNotifications() {
      void queryClient.invalidateQueries({ queryKey: ["owner", "notifications"] });
    }

    function connect() {
      socket = new WebSocket(toWebSocketUrl(endpoints.ownerNotifications.ws));

      socket.addEventListener("open", () => {
        reconnectAttemptRef.current = 0;
        syncNotifications();
      });

      socket.addEventListener("message", (event) => {
        try {
          const payload = JSON.parse(event.data) as unknown;
          if (!isOwnerNotification(payload)) {
            syncNotifications();
            return;
          }

          queryClient.setQueryData<OwnerNotificationListResponse>(listQueryKey, (current) => {
            if (!current) return current;
            if (current.items.some((item) => item.id === payload.id)) return current;

            return {
              ...current,
              total: current.total + 1,
              unread_count: current.unread_count + (payload.read_at ? 0 : 1),
              items: [payload, ...current.items].slice(0, current.limit),
            };
          });

          toast.success(payload.title || "New notification.");
          void queryClient.invalidateQueries({ queryKey: ["owner", "notifications"] });
          void queryClient.invalidateQueries({ queryKey: ["owner", "orders"] });
        } catch {
          syncNotifications();
        }
      });

      socket.addEventListener("close", () => {
        if (closedByEffect) return;

        const attempt = reconnectAttemptRef.current + 1;
        reconnectAttemptRef.current = attempt;
        const delay = Math.min(30_000, 1000 * 2 ** Math.min(attempt, 5));

        reconnectTimerRef.current = window.setTimeout(() => {
          syncNotifications();
          connect();
        }, delay);
      });
    }

    connect();

    return () => {
      closedByEffect = true;
      if (reconnectTimerRef.current) window.clearTimeout(reconnectTimerRef.current);
      socket?.close();
    };
  }, [enabled, listQueryKey, queryClient]);
}

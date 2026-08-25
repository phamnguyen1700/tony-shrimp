import type { Translations } from "@/i18n";
import type { OrderStatus } from "@/types/order";

export function formatOrderMoney(value: string | number | null | undefined) {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return "A$0";
  return `A$${amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2)}`;
}

export function formatOrderDate(value: string | null | undefined) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatOrderDateTime(value: string | null | undefined) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getOrderStatusLabel(status: OrderStatus, t: Translations) {
  const map: Record<OrderStatus, string> = {
    processing: t.order.processing,
    shipped: t.order.shipped,
    delivered: t.order.delivered,
    cancelled: t.order.cancelled,
  };
  return map[status];
}

const pendingOrderKey = "tony-pending-order-id";

export function savePendingOrderId(orderId: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(pendingOrderKey, orderId);
}

export function clearPendingOrderId(orderId?: string) {
  if (typeof window === "undefined") return;
  if (!orderId || window.sessionStorage.getItem(pendingOrderKey) === orderId) {
    window.sessionStorage.removeItem(pendingOrderKey);
  }
}

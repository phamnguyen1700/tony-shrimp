import type { OrderDetail, OrderSummary } from "@/types/order";
import type { Lang } from "@/i18n";

type OrderWithPayment = Pick<OrderSummary | OrderDetail, "status" | "payment_status">;

export function isPendingPaymentOrder(order: OrderWithPayment) {
  const status = String(order.status).toLowerCase();
  const paymentStatus = String(order.payment_status).toLowerCase();

  return status === "processing" && paymentStatus === "pending";
}

export function isPaidOrder(order: OrderWithPayment) {
  return String(order.payment_status).toLowerCase() === "paid";
}

export function getPaymentStatusLabel(order: OrderWithPayment, lang: Lang) {
  return isPaidOrder(order)
    ? lang === "vi"
      ? "Đã thanh toán"
      : "Paid"
    : lang === "vi"
      ? "Chưa thanh toán"
      : "Unpaid";
}

export function getPendingPaymentCopy(lang: Lang) {
  if (lang === "vi") {
    return {
      title: "Tiếp tục thanh toán đơn hàng",
      message: "Bạn chưa hoàn tất thanh toán.",
      pay: "Thanh toán",
      cancel: "Hủy & khôi phục",
      restored: "Đã khôi phục giỏ hàng.",
    };
  }

  return {
    title: "Continue to your payment",
    message: "You have not completed payment yet.",
    pay: "Pay now",
    cancel: "Cancel & restore",
    restored: "Cart restored.",
  };
}

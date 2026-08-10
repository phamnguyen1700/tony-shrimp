import type { Translations } from "@/i18n";
import { formatOrderDate, formatOrderMoney } from "@/lib/orderFormat";
import type { OrderDetail } from "@/types/order";

interface OrderDetailSummaryProps {
  t: Translations;
  order: OrderDetail;
}

export default function OrderDetailSummary({ t, order }: OrderDetailSummaryProps) {
  return (
    <div className="ui-radius space-y-4 border border-border p-5">
      <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        ORDER DETAILS
      </p>
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
            {t.order.orderNumber}
          </p>
          <p className="font-mono-label text-xs text-foreground">{order.order_number}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
            {t.order.orderDate}
          </p>
          <p className="font-mono-label text-xs text-foreground">{formatOrderDate(order.created_at)}</p>
        </div>
      </div>
      <div className="space-y-2 border-t border-border pt-4">
        <div className="flex justify-between">
          <p className="font-body text-sm text-muted-foreground">{t.cart.subtotal}</p>
          <p className="font-display text-sm text-foreground">{formatOrderMoney(order.subtotal_amount)}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-body text-sm text-muted-foreground">{t.cart.shipping}</p>
          <p className="font-display text-sm text-foreground">{formatOrderMoney(order.shipping_amount)}</p>
        </div>
        <div className="flex justify-between border-t border-border pt-2">
          <p className="font-mono-label text-xs uppercase tracking-[0.16em]">{t.cart.total}</p>
          <p className="font-display text-base font-semibold text-foreground">
            {formatOrderMoney(order.total_amount)}
          </p>
        </div>
      </div>
    </div>
  );
}

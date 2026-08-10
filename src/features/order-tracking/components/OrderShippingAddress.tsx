import type { OrderDetail } from "@/types/order";

interface OrderShippingAddressProps {
  order: OrderDetail;
}

export default function OrderShippingAddress({ order }: OrderShippingAddressProps) {
  return (
    <div className="ui-radius space-y-2 border border-border p-5">
      <p className="mb-3 font-mono-label text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        SHIPPING ADDRESS
      </p>
      <p className="font-body text-sm text-foreground">{order.shipping_address.recipient_name}</p>
      {"recipient_phone" in order.shipping_address && order.shipping_address.recipient_phone && (
        <p className="font-body text-sm text-muted-foreground">{order.shipping_address.recipient_phone}</p>
      )}
      <p className="font-body text-sm text-muted-foreground">{order.shipping_address.address_line1}</p>
      {order.shipping_address.address_line2 && (
        <p className="font-body text-sm text-muted-foreground">{order.shipping_address.address_line2}</p>
      )}
      <p className="font-body text-sm text-muted-foreground">
        {order.shipping_address.suburb} {order.shipping_address.state} {order.shipping_address.postcode}
      </p>
    </div>
  );
}

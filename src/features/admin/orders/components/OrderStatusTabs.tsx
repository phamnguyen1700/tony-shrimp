import type { Translations } from "@/i18n";
import { getOrderStatusLabel } from "@/lib/orderFormat";
import type { OrderStatus } from "@/types/order";

interface Props {
  t: Translations;
  activeStatus: OrderStatus | "";
  onStatusChange: (status: OrderStatus | "") => void;
}

const orderTabs: (OrderStatus | "")[] = ["", "processing", "shipped", "delivered", "cancelled"];

export default function OrderStatusTabs({ t, activeStatus, onStatusChange }: Props) {
  return (
    <div className="flex flex-wrap gap-6 border-b border-border">
      {orderTabs.map((tab) => {
        const isActive = activeStatus === tab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onStatusChange(tab)}
            className={`relative pb-3 font-mono-label text-xs uppercase tracking-[0.18em] transition-colors ${
              isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{tab ? getOrderStatusLabel(tab, t) : "All"}</span>
            {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
          </button>
        );
      })}
    </div>
  );
}

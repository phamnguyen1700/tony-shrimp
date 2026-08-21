import DashboardPanel from "@/components/common/dashboard/DashboardPanel";
import Trend from "@/components/common/dashboard/Trend";
import type { PaymentSummaryItem } from "@/types/adminDashboard";

interface PaymentSummaryProps {
  items: PaymentSummaryItem[];
  labels: {
    paymentSummary: string;
    thisPeriod: string;
  };
}

export default function PaymentSummary({ items, labels }: PaymentSummaryProps) {
  return (
    <DashboardPanel title={labels.paymentSummary} eyebrow={labels.thisPeriod}>
      <div className="space-y-0">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-start justify-between gap-4 border-b border-border py-5 first:pt-0 last:border-0 last:pb-0"
          >
            <span className="text-sm font-semibold text-foreground">{item.label}</span>
            <div className="text-right">
              <strong className="block font-display text-xl font-semibold text-foreground">
                {item.value}
              </strong>
              {item.change && (
                <span className="mt-2 block">
                  <Trend value={item.change} down={item.down} />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}

import BarChart from "@/components/common/charts/BarChart";
import DashboardPanel from "@/components/common/dashboard/DashboardPanel";
import type { EcommerceFunnel as EcommerceFunnelData } from "@/types/adminDashboard";

interface EcommerceFunnelProps {
  funnel?: EcommerceFunnelData;
  labels: {
    ecommerceFunnel: string;
    customerJourney: string;
    visitors: string;
    completedOrders: string;
    conversionRate: string;
  };
  unavailableText?: string;
}

function parsePercent(value: string | null) {
  return value === null ? 0 : Number(value);
}

export default function EcommerceFunnel({
  funnel,
  labels,
  unavailableText = "Unavailable",
}: EcommerceFunnelProps) {
  if (!funnel) {
    return (
      <DashboardPanel title={labels.ecommerceFunnel} eyebrow={labels.customerJourney}>
        <p className="py-8 text-sm font-medium text-muted-foreground">
          {unavailableText}
        </p>
      </DashboardPanel>
    );
  }

  const funnelItems = [
    {
      label: labels.visitors,
      value: funnel.visitors,
      displayValue: funnel.visitors.toLocaleString(),
    },
    {
      label: labels.completedOrders,
      value: funnel.completedOrders,
      displayValue: funnel.completedOrders.toLocaleString(),
    },
    {
      label: labels.conversionRate,
      value: parsePercent(funnel.conversionRate),
      displayValue:
        funnel.conversionRate === null
          ? unavailableText
          : `${Number(funnel.conversionRate).toFixed(2)}%`,
    },
  ];

  return (
    <DashboardPanel title={labels.ecommerceFunnel} eyebrow={labels.customerJourney}>
      <BarChart items={funnelItems} heightClassName="h-44" showValues />
    </DashboardPanel>
  );
}

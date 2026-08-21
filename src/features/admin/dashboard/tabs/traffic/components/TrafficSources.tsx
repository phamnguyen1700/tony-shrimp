import BarChart from "@/components/common/charts/BarChart";
import DashboardPanel from "@/components/common/dashboard/DashboardPanel";
import type { Source } from "@/types/adminDashboard";

interface TrafficSourcesProps {
  sources: Source[];
  labels: {
    trafficSources: string;
    byChannel: string;
  };
}

export default function TrafficSources({ sources, labels }: TrafficSourcesProps) {
  return (
    <DashboardPanel title={labels.trafficSources} eyebrow={labels.byChannel}>
      <BarChart
        items={sources.map((source) => ({
          label: source.name,
          value: source.value,
          displayValue: `${source.value}%`,
        }))}
        heightClassName="h-44"
        showValues
      />
    </DashboardPanel>
  );
}

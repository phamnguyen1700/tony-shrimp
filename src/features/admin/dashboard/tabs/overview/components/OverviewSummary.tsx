import MetricCard from "@/components/common/dashboard/MetricCard";
import type { Stat } from "@/types/adminDashboard";

interface OverviewSummaryProps {
  stats: Stat[];
  helperLabel: string;
  liveHelperLabel: string;
}

export default function OverviewSummary({
  stats,
  helperLabel,
  liveHelperLabel,
}: OverviewSummaryProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <MetricCard
          key={stat.label}
          {...stat}
          helperLabel={helperLabel}
          liveHelperLabel={liveHelperLabel}
        />
      ))}
    </section>
  );
}

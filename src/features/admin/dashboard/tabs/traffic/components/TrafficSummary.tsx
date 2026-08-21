import MetricCard from "@/components/common/dashboard/MetricCard";
import type { Stat } from "@/types/adminDashboard";
import RealtimeTraffic from "./RealtimeTraffic";

interface TrafficSummaryProps {
  stats: Stat[];
  helperLabel: string;
  liveHelperLabel: string;
}

export default function TrafficSummary({
  stats,
  helperLabel,
  liveHelperLabel,
}: TrafficSummaryProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        stat.live ? (
          <RealtimeTraffic
            key={stat.label}
            label={stat.label}
            activeUsers={stat.value}
            liveHelperLabel={liveHelperLabel}
          />
        ) : (
          <MetricCard
            key={stat.label}
            {...stat}
            helperLabel={helperLabel}
            liveHelperLabel={liveHelperLabel}
          />
        )
      ))}
    </section>
  );
}

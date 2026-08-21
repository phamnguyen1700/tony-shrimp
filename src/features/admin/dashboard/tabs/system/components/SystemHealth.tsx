import DashboardPanel from "@/components/common/dashboard/DashboardPanel";
import type { SystemMetric } from "@/types/adminDashboard";

interface SystemHealthProps {
  metrics: SystemMetric[];
}

export default function SystemHealth({ metrics }: SystemHealthProps) {
  return (
    <DashboardPanel title="System health" eyebrow="Live status">
      <div className="space-y-5">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center gap-3 text-sm font-semibold text-foreground"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                metric.status === "good" ? "bg-accent" : "bg-muted-foreground/25"
              }`}
            />
            <span>{metric.label}</span>
            <strong className="ml-auto font-mono-label text-xs">{metric.value}</strong>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}

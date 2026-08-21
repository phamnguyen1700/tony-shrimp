import ComingSoon from "@/components/common/ComingSoon";
import type { SystemMetric } from "@/types/adminDashboard";
import ApiPerformance from "./components/ApiPerformance";
import DeploymentActivity from "./components/DeploymentActivity";
import Infrastructure from "./components/Infrastructure";
import ServerResources from "./components/ServerResources";
import SystemHealth from "./components/SystemHealth";

interface SystemTabProps {
  systemMetrics: SystemMetric[];
  labels: {
    title: string;
    description: string;
    label: string;
    imageAlt: string;
  };
}

export default function SystemTab({ systemMetrics, labels }: SystemTabProps) {
  return (
    <ComingSoon
      title={labels.title}
      description={labels.description}
      label={labels.label}
      imageSrc="/coming-soon/comming-soon.png"
      imageAlt={labels.imageAlt}
    >
      <div className="space-y-5">
        <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Operational monitoring
        </p>
        <div className="grid gap-5 lg:grid-cols-3">
          <SystemHealth metrics={systemMetrics} />
          <Infrastructure />
          <ApiPerformance />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <ServerResources />
          <DeploymentActivity />
        </div>
      </div>
    </ComingSoon>
  );
}

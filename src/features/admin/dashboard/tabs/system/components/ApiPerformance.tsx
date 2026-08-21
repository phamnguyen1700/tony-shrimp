import DashboardPanel from "@/components/common/dashboard/DashboardPanel";
import MiniBars from "@/components/common/dashboard/MiniBars";

export default function ApiPerformance() {
  return (
    <DashboardPanel title="API performance" eyebrow="P95 latency">
      <strong className="block font-display text-4xl font-semibold leading-none text-foreground">
        184ms
      </strong>
      <MiniBars values={[42, 48, 44, 52, 58, 54, 62, 70, 66, 78, 74, 82]} accent />
    </DashboardPanel>
  );
}

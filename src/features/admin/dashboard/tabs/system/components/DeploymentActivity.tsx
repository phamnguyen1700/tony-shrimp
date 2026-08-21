import DashboardPanel from "@/components/common/dashboard/DashboardPanel";
import DashboardTable from "@/components/common/dashboard/DashboardTable";

const rows = [
  ["Production deploy", "Success", "12m ago"],
  ["Database backup", "Success", "1h ago"],
  ["Worker restart", "Complete", "3h ago"],
];

export default function DeploymentActivity() {
  return (
    <DashboardPanel title="Deployment activity" eyebrow="Recent events">
      <DashboardTable headers={["Event", "Status", "Time"]} rows={rows} />
    </DashboardPanel>
  );
}

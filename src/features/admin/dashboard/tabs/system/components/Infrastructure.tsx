import DashboardPanel from "@/components/common/dashboard/DashboardPanel";

const metrics = [
  ["CPU usage", "24%"],
  ["Memory", "61%"],
  ["Disk", "38%"],
];

export default function Infrastructure() {
  return (
    <DashboardPanel title="Infrastructure" eyebrow="Resource usage">
      <div className="space-y-0">
        {metrics.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 border-b border-border py-5 text-sm font-semibold text-foreground first:pt-0 last:border-0 last:pb-0"
          >
            <span>{label}</span>
            <strong className="font-display text-2xl font-semibold">{value}</strong>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}

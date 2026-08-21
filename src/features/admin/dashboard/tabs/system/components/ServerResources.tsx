import DashboardPanel from "@/components/common/dashboard/DashboardPanel";

const resources = [
  ["Uptime", "99.98%"],
  ["Error rate", "0.14%"],
];

export default function ServerResources() {
  return (
    <DashboardPanel title="Server resources" eyebrow="Current allocation">
      <div className="space-y-0">
        {resources.map(([label, value]) => (
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

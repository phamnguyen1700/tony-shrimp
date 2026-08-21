import MetricCard from "@/components/common/dashboard/MetricCard";

interface RealtimeTrafficProps {
  label: string;
  activeUsers: string;
  liveHelperLabel: string;
}

export default function RealtimeTraffic({
  label,
  activeUsers,
  liveHelperLabel,
}: RealtimeTrafficProps) {
  return (
    <MetricCard
      label={label}
      value={activeUsers}
      live
      liveHelperLabel={liveHelperLabel}
    />
  );
}

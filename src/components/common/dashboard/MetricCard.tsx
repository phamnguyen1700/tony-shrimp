import Trend from "./Trend";

export interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  live?: boolean;
  helperLabel?: string;
  liveHelperLabel?: string;
}

export default function MetricCard({
  label,
  value,
  change,
  live = false,
  helperLabel = "vs. previous period",
  liveHelperLabel = "right now",
}: MetricCardProps) {
  const isLongValue = value.length > 10;

  return (
    <div className="border border-border bg-card p-5 md:p-6">
      <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <strong
        className={`mt-4 block font-display font-semibold leading-none text-foreground ${
          isLongValue ? "text-xl md:text-2xl" : "text-3xl md:text-4xl"
        }`}
      >
        {value}
      </strong>
      <div className="mt-5 flex min-h-4 items-center gap-2 text-xs">
        {live ? (
          <span className="h-3 w-3 rounded-full border-2 border-primary bg-accent" />
        ) : (
          change && <Trend value={change} />
        )}
        {(live || change) && (
          <span className="text-muted-foreground">
            {live ? liveHelperLabel : helperLabel}
          </span>
        )}
      </div>
    </div>
  );
}

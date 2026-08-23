interface PieChartItem {
  label: string;
  value: number;
  displayValue?: string;
}

interface PieChartProps {
  items: PieChartItem[];
  sizeClassName?: string;
  compact?: boolean;
  horizontal?: boolean;
}

const colors = [
  "var(--primary)",
  "var(--secondary)",
  "var(--accent)",
  "var(--muted-foreground)",
  "var(--border)",
];

export default function PieChart({
  items,
  sizeClassName = "size-40",
  compact = false,
  horizontal = false,
}: PieChartProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let cursor = 0;
  const gradient = items
    .map((item, index) => {
      const start = cursor;
      const end = total > 0 ? cursor + (item.value / total) * 100 : cursor;
      cursor = end;
      return `${colors[index % colors.length]} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div
      className={`grid min-w-0 items-center ${
        horizontal ? "grid-cols-[auto_minmax(0,1fr)]" : ""
      } ${compact ? "gap-3" : "gap-6"}`}
    >
      <div
        className={`mx-auto rounded-full border border-border ${sizeClassName}`}
        style={{ background: `conic-gradient(${gradient})` }}
        aria-hidden="true"
      />
      <div className={`min-w-0 ${compact ? "space-y-2" : "space-y-4"}`}>
        {items.map((item, index) => {
          const percent = total > 0 ? (item.value / total) * 100 : 0;

          return (
            <div
              key={item.label}
              className={`grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border text-sm last:border-0 ${
                compact ? "pb-2" : "pb-3"
              }`}
            >
              <span className="flex min-w-0 items-center gap-3 font-semibold text-foreground">
                <span
                  className="size-2.5 shrink-0"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="truncate">{item.label}</span>
              </span>
              <strong className="whitespace-nowrap font-mono-label text-xs text-foreground">
                {item.displayValue ?? `${percent.toFixed(1)}%`}
              </strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

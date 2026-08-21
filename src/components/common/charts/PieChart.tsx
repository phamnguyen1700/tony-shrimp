interface PieChartItem {
  label: string;
  value: number;
  displayValue?: string;
}

interface PieChartProps {
  items: PieChartItem[];
}

const colors = [
  "var(--primary)",
  "var(--secondary)",
  "var(--accent)",
  "var(--muted-foreground)",
  "var(--border)",
];

export default function PieChart({ items }: PieChartProps) {
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
    <div className="grid items-center gap-6 md:grid-cols-[180px_1fr]">
      <div
        className="mx-auto size-44 rounded-full border border-border"
        style={{ background: `conic-gradient(${gradient})` }}
        aria-hidden="true"
      />
      <div className="space-y-4">
        {items.map((item, index) => {
          const percent = total > 0 ? (item.value / total) * 100 : 0;

          return (
            <div
              key={item.label}
              className="flex items-center justify-between gap-4 border-b border-border pb-3 text-sm last:border-0"
            >
              <span className="flex min-w-0 items-center gap-3 font-semibold text-foreground">
                <span
                  className="size-2.5 shrink-0"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="truncate">{item.label}</span>
              </span>
              <strong className="font-mono-label text-xs text-foreground">
                {item.displayValue ?? `${percent.toFixed(1)}%`}
              </strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface BarChartItem {
  label: string;
  value: number;
  displayValue?: string;
}

interface BarChartProps {
  items: BarChartItem[];
  heightClassName?: string;
  showValues?: boolean;
}

export default function BarChart({
  items,
  heightClassName = "h-40",
  showValues = false,
}: BarChartProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="w-full">
      <div className={`flex ${heightClassName} items-end gap-2`} aria-hidden="true">
        {items.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            {showValues && (
              <span className="max-w-full truncate font-mono-label text-[10px] text-muted-foreground">
                {item.displayValue ?? item.value.toLocaleString()}
              </span>
            )}
            <span
              className="block w-full min-w-5 bg-primary/75 dark:bg-[#d6d0c1]"
              style={{ height: `${Math.max(8, (item.value / maxValue) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div
        className="mt-4 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item) => (
          <span
            key={item.label}
            className="truncate text-center font-mono-label text-[10px] uppercase tracking-wider text-muted-foreground"
            title={item.label}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

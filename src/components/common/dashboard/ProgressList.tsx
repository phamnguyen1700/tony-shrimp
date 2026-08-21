interface ProgressListProps {
  items: Array<{
    label: string;
    value: string;
    width: string;
  }>;
}

export default function ProgressList({ items }: ProgressListProps) {
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-3 flex items-center justify-between gap-4 text-sm font-semibold text-foreground">
            <span>{item.label}</span>
            <strong className="font-mono-label text-xs">{item.value}</strong>
          </div>
          <div className="h-px bg-border">
            <span className="block h-px bg-secondary" style={{ width: item.width }} />
          </div>
        </div>
      ))}
    </div>
  );
}

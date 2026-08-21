interface DashboardTableProps {
  headers: string[];
  rows: string[][];
}

export default function DashboardTable({ headers, rows }: DashboardTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[420px]">
        <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-border pb-3 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
          {headers.map((header) => (
            <span key={header} className="last:text-right">
              {header}
            </span>
          ))}
        </div>
        {rows.map((row) => (
          <div
            key={row.join("-")}
            className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-border py-4 text-sm font-semibold text-foreground last:border-0"
          >
            {row.map((cell, index) =>
              index === row.length - 1 ? (
                <strong
                  key={`${cell}-${index}`}
                  className="text-right font-mono-label text-xs"
                >
                  {cell}
                </strong>
              ) : (
                <span
                  key={`${cell}-${index}`}
                  className={index > 0 ? "font-mono-label text-xs" : ""}
                >
                  {cell}
                </span>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

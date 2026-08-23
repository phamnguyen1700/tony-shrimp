import type { ReactNode } from "react";

interface DashboardPanelProps {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function DashboardPanel({
  title,
  eyebrow,
  action,
  children,
  className = "",
}: DashboardPanelProps) {
  return (
    <section className={`border border-border bg-card p-3 ${className}`}>
      <div className="mb-2.5 flex items-start justify-between gap-4">
        <div>
          {eyebrow && (
            <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 font-display text-base font-semibold leading-none text-foreground">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

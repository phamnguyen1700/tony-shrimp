import type { ReactNode } from "react";

interface ShopFilterSectionProps {
  title: string;
  children: ReactNode;
}

export default function ShopFilterSection({
  title,
  children,
}: ShopFilterSectionProps) {
  return (
    <div className="space-y-2">
      <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-extrabold">
        {title}
      </p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

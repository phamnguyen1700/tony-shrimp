import type { ReactNode } from "react";
import { cn } from "@/lib/config/utils";

interface ShopFilterSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function ShopFilterSection({
  title,
  children,
  className,
}: ShopFilterSectionProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-muted-foreground font-extrabold">
        {title}
      </p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

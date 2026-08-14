import type { ReactNode } from "react";

interface ShopProductGridProps {
  children: ReactNode;
}

export default function ShopProductGrid({ children }: ShopProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
      {children}
    </div>
  );
}

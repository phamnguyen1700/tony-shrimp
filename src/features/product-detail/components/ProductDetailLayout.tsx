import type { ReactNode } from "react";

interface ProductDetailLayoutProps {
  children: ReactNode;
}

export default function ProductDetailLayout({ children }: ProductDetailLayoutProps) {
  return (
    <div className="app-page">
      <div className="app-container">{children}</div>
    </div>
  );
}

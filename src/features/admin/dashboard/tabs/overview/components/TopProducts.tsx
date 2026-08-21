import DashboardPanel from "@/components/common/dashboard/DashboardPanel";
import DashboardTable from "@/components/common/dashboard/DashboardTable";
import type { Product } from "@/types/adminDashboard";

interface TopProductsProps {
  products: Product[];
  labels: {
    topProducts: string;
    byRevenue: string;
    product: string;
    orders: string;
    revenueColumn: string;
  };
  unavailable?: boolean;
  unavailableText?: string;
}

export default function TopProducts({
  products,
  labels,
  unavailable = false,
  unavailableText = "Could not load",
}: TopProductsProps) {
  return (
    <DashboardPanel title={labels.topProducts} eyebrow={labels.byRevenue}>
      {unavailable ? (
        <p className="py-8 text-sm font-medium text-muted-foreground">
          {unavailableText}
        </p>
      ) : (
        <DashboardTable
          headers={[labels.product, labels.orders, labels.revenueColumn]}
          rows={products.map((product) => [
            product.name,
            product.orders,
            product.revenue,
          ])}
        />
      )}
    </DashboardPanel>
  );
}

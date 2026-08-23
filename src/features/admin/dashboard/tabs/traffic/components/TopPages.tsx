import PieChart from "@/components/common/charts/PieChart";
import DashboardPanel from "@/components/common/dashboard/DashboardPanel";
import type { TopPage } from "@/types/adminDashboard";

interface TopPagesProps {
  pages: TopPage[];
  labels: {
    topPages: string;
    byPageViews: string;
    views: string;
  };
  emptyText?: string;
}

export default function TopPages({
  pages,
  labels,
  emptyText = "No page data",
}: TopPagesProps) {
  return (
    <DashboardPanel title={labels.topPages} eyebrow={labels.byPageViews}>
      {pages.length > 0 ? (
        <PieChart
          items={pages.slice(0, 5).map((page) => ({
            label: page.path,
            value: page.views,
            displayValue: `${page.views.toLocaleString()} ${labels.views}`,
          }))}
          sizeClassName="size-40"
          compact
          horizontal
        />
      ) : (
        <p className="py-8 text-sm font-medium text-muted-foreground">{emptyText}</p>
      )}
    </DashboardPanel>
  );
}

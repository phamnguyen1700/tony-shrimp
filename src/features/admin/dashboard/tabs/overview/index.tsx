import type { AnalyticsPeriodKey } from "@/types/analytics";
import type {
  PaymentSummaryItem,
  Product,
  RevenuePoint,
  Stat,
} from "@/types/adminDashboard";
import OverviewSummary from "./components/OverviewSummary";
import PaymentSummary from "./components/PaymentSummary";
import PerformanceChart from "./components/PerformanceChart";
import TopProducts from "./components/TopProducts";

interface OverviewTabProps {
  period: AnalyticsPeriodKey;
  sevenDaysLabel: string;
  thirtyDaysLabel: string;
  statusLabel?: string;
  errorMessage?: string;
  stats: Stat[];
  revenueData: RevenuePoint[];
  paymentSummary: PaymentSummaryItem[];
  topProducts: Product[];
  periodLabel: string;
  revenueTotal: string;
  revenueChange?: string;
  revenueAxisPrefix: string;
  chartLabels?: string[];
  unavailable: boolean;
  unavailableText: string;
  labels: {
    common: {
      vsPreviousPeriod: string;
      rightNow: string;
    };
    overview: {
      performance: string;
      revenue: string;
      visitors: string;
      totalRevenue: string;
      uniqueVisitors: string;
      paymentSummary: string;
      thisPeriod: string;
      topProducts: string;
      byRevenue: string;
      product: string;
      orders: string;
      revenueColumn: string;
    };
  };
  onPeriodChange: (period: AnalyticsPeriodKey) => void;
}

export default function OverviewTab({
  period,
  sevenDaysLabel,
  thirtyDaysLabel,
  statusLabel,
  errorMessage,
  stats,
  revenueData,
  paymentSummary,
  topProducts,
  periodLabel,
  revenueTotal,
  revenueChange,
  revenueAxisPrefix,
  chartLabels,
  unavailable,
  unavailableText,
  labels,
  onPeriodChange,
}: OverviewTabProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {errorMessage ? (
          <p className="text-sm font-medium text-destructive">{errorMessage}</p>
        ) : (
          <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {statusLabel}
          </p>
        )}
        <div className="flex border border-border">
          {(["7d", "30d"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onPeriodChange(item)}
              className={`h-9 px-4 text-xs font-semibold transition-colors ${
                period === item
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item === "7d" ? sevenDaysLabel : thirtyDaysLabel}
            </button>
          ))}
        </div>
      </div>

      <OverviewSummary
        stats={stats}
        helperLabel={labels.common.vsPreviousPeriod}
        liveHelperLabel={labels.common.rightNow}
      />

      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <PerformanceChart
          labels={labels.overview}
          data={revenueData}
          periodLabel={periodLabel}
          revenueTotal={revenueTotal}
          revenueChange={revenueChange}
          revenueAxisPrefix={revenueAxisPrefix}
          xLabels={chartLabels}
          unavailable={unavailable}
          unavailableText={unavailableText}
        />
        <PaymentSummary items={paymentSummary} labels={labels.overview} />
      </div>

      <TopProducts
        products={topProducts}
        labels={labels.overview}
        unavailable={unavailable}
        unavailableText={unavailableText}
      />
    </div>
  );
}

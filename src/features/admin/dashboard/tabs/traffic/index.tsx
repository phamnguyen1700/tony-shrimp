import type { AnalyticsPeriodKey } from "@/types/analytics";
import type {
  EcommerceFunnel as EcommerceFunnelData,
  Source,
  Stat,
  TopPage,
  TrafficPoint,
} from "@/types/adminDashboard";
import EcommerceFunnel from "./components/EcommerceFunnel";
import TopPages from "./components/TopPages";
import TrafficSources from "./components/TrafficSources";
import TrafficSummary from "./components/TrafficSummary";
import WebsiteTrafficChart from "./components/WebsiteTrafficChart";

interface TrafficTabProps {
  stats: Stat[];
  trafficData: TrafficPoint[];
  trafficSources: Source[];
  topPages: TopPage[];
  funnel?: EcommerceFunnelData;
  period: AnalyticsPeriodKey;
  sevenDaysLabel: string;
  thirtyDaysLabel: string;
  statusLabel?: string;
  errorMessage?: string;
  unavailableText: string;
  labels: {
    common: {
      vsPreviousPeriod: string;
      rightNow: string;
      noTrafficData: string;
    };
    traffic: {
      webAnalytics: string;
      websiteTraffic: string;
      users: string;
      sessions: string;
      pageViews: string;
      last30Days: string;
      trafficSources: string;
      byChannel: string;
      ecommerceFunnel: string;
      customerJourney: string;
      visitors: string;
      completedOrders: string;
      conversionRate: string;
      topPages: string;
      byPageViews: string;
      views: string;
      noPageData: string;
    };
  };
  onPeriodChange: (period: AnalyticsPeriodKey) => void;
}

export default function TrafficTab({
  stats,
  trafficData,
  trafficSources,
  topPages,
  funnel,
  period,
  sevenDaysLabel,
  thirtyDaysLabel,
  statusLabel,
  errorMessage,
  unavailableText,
  labels,
  onPeriodChange,
}: TrafficTabProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {errorMessage ? (
          <p className="text-sm font-medium text-destructive">{errorMessage}</p>
        ) : (
          <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {statusLabel ?? labels.traffic.webAnalytics}
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

      <TrafficSummary
        stats={stats}
        helperLabel={labels.common.vsPreviousPeriod}
        liveHelperLabel={labels.common.rightNow}
      />

      {trafficData.length > 0 ? (
        <WebsiteTrafficChart data={trafficData} labels={labels.traffic} />
      ) : (
        <div className="border border-border bg-card p-5 text-sm font-medium text-muted-foreground md:p-6">
          {unavailableText}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-3">
        <TrafficSources sources={trafficSources} labels={labels.traffic} />
        <EcommerceFunnel
          funnel={funnel}
          labels={labels.traffic}
          unavailableText={unavailableText}
        />
        <TopPages
          pages={topPages}
          labels={labels.traffic}
          emptyText={trafficUnavailableText(labels, unavailableText)}
        />
      </div>
    </div>
  );
}

function trafficUnavailableText(
  labels: TrafficTabProps["labels"],
  unavailableText: string,
) {
  return unavailableText || labels.traffic.noPageData;
}

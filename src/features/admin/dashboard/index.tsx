"use client";

import { Activity, BarChart3, Server } from "lucide-react";
import { useState } from "react";
import { getApiErrorMessage } from "@/config/api";
import {
  useOwnerAnalyticsDashboard,
  useOwnerAnalyticsRealtime,
  useOwnerAnalyticsTraffic,
} from "@/hooks/analytics";
import { useI18n } from "@/hooks/useI18n";
import type {
  AnalyticsDashboardResponse,
  AnalyticsPeriodKey,
  AnalyticsTrafficResponse,
} from "@/types/analytics";
import type {
  EcommerceFunnel,
  PaymentSummaryItem,
  Product,
  RevenuePoint,
  Source,
  Stat,
  SystemMetric,
  TopPage,
  TrafficPoint,
} from "@/types/adminDashboard";
import OverviewTab from "./tabs/overview";
import SystemTab from "./tabs/system";
import TrafficTab from "./tabs/traffic";

type DashboardTab = "overview" | "traffic" | "system";

const tabs: Array<{
  id: DashboardTab;
  icon: typeof BarChart3;
}> = [
  { id: "overview", icon: BarChart3 },
  { id: "traffic", icon: Activity },
  { id: "system", icon: Server },
];

const revenueData: RevenuePoint[] = [
  46, 54, 64, 56, 66, 78, 69, 82, 94, 86, 98, 110, 101, 114, 126, 116, 128, 140,
  132, 144, 156, 146, 158, 170, 160, 172, 184, 174, 186, 198,
].map((value, index) => ({
  date: `Day ${index + 1}`,
  value,
}));

const products: Product[] = [
  { name: "Red Boa", orders: "482", revenue: "A$8,420.00" },
  { name: "Orange Eye Blue Devil", orders: "216", revenue: "A$6,912.00" },
  { name: "Orange Eye Red Demon", orders: "194", revenue: "A$3,686.00" },
  { name: "Extreme Red King Kong", orders: "154", revenue: "A$2,464.00" },
];

const systemMetrics: SystemMetric[] = [
  { label: "API uptime", value: "99.98%", status: "good" },
  { label: "P95 latency", value: "184ms", status: "good" },
  { label: "Error rate", value: "0.14%", status: "warn" },
  { label: "Webhooks", value: "Operational", status: "good" },
];

function formatMoney(value: string, currency: string) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
  }).format(Number(value));
}

function getCurrencyPrefix(currency?: string) {
  return currency === "AUD" ? "A$" : "$";
}

function formatPercent(value: string | null) {
  return value === null ? undefined : `${Number(value).toFixed(1)}%`;
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("en-AU").format(value);
}

function formatPeriodLabel(
  period: AnalyticsDashboardResponse["period"],
  labels: { sevenDays: string; thirtyDays: string },
) {
  return period.key === "7d" ? labels.sevenDays : labels.thirtyDays;
}

function formatShortDate(date: string) {
  const parsed = new Date(`${date}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-AU", {
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  }).format(parsed);
}

function pickChartLabels(points: RevenuePoint[]) {
  if (points.length <= 5) return points.map((point) => formatShortDate(point.date));

  const lastIndex = points.length - 1;
  return [0, 0.25, 0.5, 0.75, 1].map((position) =>
    formatShortDate(points[Math.round(lastIndex * position)].date),
  );
}

function mapRevenueData(data?: AnalyticsDashboardResponse): RevenuePoint[] {
  if (!data) return [];

  return data.revenue_series.map((point) => ({
    date: point.date,
    value: Number(point.gross),
  }));
}

function mapKpiStats(
  unavailableText: string,
  labels: {
    grossRevenue: string;
    orders: string;
    averageOrderValue: string;
    refunds: string;
  },
  data?: AnalyticsDashboardResponse,
): Stat[] {
  if (!data) {
    return [
      { label: labels.grossRevenue, value: unavailableText },
      { label: labels.orders, value: unavailableText },
      { label: labels.averageOrderValue, value: unavailableText },
      { label: labels.refunds, value: unavailableText },
    ];
  }

  return [
    {
      label: labels.grossRevenue,
      value: formatMoney(data.summary.gross_revenue, data.summary.currency),
      change: formatPercent(data.summary.gross_revenue_change_percent),
    },
    {
      label: labels.orders,
      value: formatInteger(data.summary.orders),
      change: formatPercent(data.summary.orders_change_percent),
    },
    {
      label: labels.averageOrderValue,
      value: formatMoney(data.average_order_value.amount, data.average_order_value.currency),
    },
    {
      label: labels.refunds,
      value: formatMoney(data.payments.refund_amount, data.payments.currency),
      change: data.payments.refund_count > 0 ? formatInteger(data.payments.refund_count) : undefined,
    },
  ];
}

function mapPaymentSummary(
  unavailableText: string,
  labels: {
    successfulPayments: string;
    refunds: string;
    averageOrderValue: string;
  },
  data?: AnalyticsDashboardResponse,
): PaymentSummaryItem[] {
  if (!data) {
    return [
      { label: labels.successfulPayments, value: unavailableText },
      { label: labels.refunds, value: unavailableText },
      { label: labels.averageOrderValue, value: unavailableText },
    ];
  }

  return [
    {
      label: labels.successfulPayments,
      value: formatMoney(data.summary.gross_revenue, data.summary.currency),
      change: formatPercent(data.summary.gross_revenue_change_percent),
    },
    {
      label: labels.refunds,
      value: formatMoney(data.payments.refund_amount, data.payments.currency),
      down: true,
    },
    {
      label: labels.averageOrderValue,
      value: formatMoney(data.average_order_value.amount, data.average_order_value.currency),
    },
  ];
}

function mapTopProducts(data?: AnalyticsDashboardResponse): Product[] {
  if (!data) return [];

  return data.top_products.map((product) => ({
    name: product.name,
    orders: formatInteger(product.quantity),
    revenue: formatMoney(product.revenue, data.summary.currency),
  }));
}

function formatRate(value: string | null, fractionDigits = 1) {
  return value === null ? undefined : `${Number(value).toFixed(fractionDigits)}%`;
}

function mapTrafficStats(
  unavailableText: string,
  liveNow: string,
  labels: {
    visitors: string;
    sessions: string;
    engagementRate: string;
    liveNow: string;
  },
  data?: AnalyticsTrafficResponse,
): Stat[] {
  if (!data) {
    return [
      { label: labels.visitors, value: unavailableText },
      { label: labels.sessions, value: unavailableText },
      { label: labels.engagementRate, value: unavailableText },
      { label: labels.liveNow, value: liveNow, live: true },
    ];
  }

  return [
    {
      label: labels.visitors,
      value: formatInteger(data.summary.users),
      change: formatPercent(data.summary.users_change_percent),
    },
    {
      label: labels.sessions,
      value: formatInteger(data.summary.sessions),
      change: formatPercent(data.summary.sessions_change_percent),
    },
    {
      label: labels.engagementRate,
      value: formatRate(data.summary.engagement_rate) ?? unavailableText,
      change: formatPercent(data.summary.engagement_rate_change_percent),
    },
    { label: labels.liveNow, value: liveNow, live: true },
  ];
}

function mapTrafficData(data?: AnalyticsTrafficResponse): TrafficPoint[] {
  if (!data) return [];

  return data.series.map((point) => ({
    date: point.date,
    users: point.users,
    sessions: point.sessions,
    pageViews: point.page_views,
  }));
}

function mapTrafficSources(data?: AnalyticsTrafficResponse): Source[] {
  if (!data) return [];

  return data.sources.map((source) => ({
    name: source.channel,
    value: Number(source.percent),
  }));
}

function mapTopPages(data?: AnalyticsTrafficResponse): TopPage[] {
  if (!data) return [];

  return data.top_pages.map((page) => ({
    path: page.path,
    views: page.views,
    users: page.users,
  }));
}

function mapEcommerceFunnel(data?: AnalyticsTrafficResponse): EcommerceFunnel | undefined {
  if (!data) return undefined;

  return {
    visitors: data.ecommerce_funnel.visitors,
    completedOrders: data.ecommerce_funnel.completed_orders,
    conversionRate: data.ecommerce_funnel.conversion_rate,
  };
}

export default function AdminDashboardFeature() {
  const { t } = useI18n();
  const analyticsText = t.admin.analytics;
  const dashboardText = t.admin.dashboardPage;
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [period, setPeriod] = useState<AnalyticsPeriodKey>("30d");
  const dashboardQuery = useOwnerAnalyticsDashboard(period);
  const trafficQuery = useOwnerAnalyticsTraffic(period);
  const realtimeQuery = useOwnerAnalyticsRealtime();
  const dashboard = dashboardQuery.data;
  const traffic = trafficQuery.data;
  const analyticsUnavailable = !dashboard;
  const trafficUnavailable = !traffic;
  const liveNow = realtimeQuery.data
    ? formatInteger(realtimeQuery.data.active_users)
    : analyticsText.unavailable;
  const overviewRevenueData = mapRevenueData(dashboard);
  const overviewKpiStats = mapKpiStats(
    analyticsText.unavailable,
    dashboardText.overview,
    dashboard,
  );
  const overviewPaymentSummary = mapPaymentSummary(
    analyticsText.unavailable,
    dashboardText.overview,
    dashboard,
  );
  const overviewTopProducts = mapTopProducts(dashboard);
  const periodLabel = dashboard
    ? formatPeriodLabel(dashboard.period, {
        sevenDays: analyticsText.sevenDays,
        thirtyDays: analyticsText.thirtyDays,
      })
    : period === "7d"
      ? analyticsText.sevenDays
      : analyticsText.thirtyDays;
  const revenueChange = formatPercent(dashboard?.summary.gross_revenue_change_percent ?? null);
  const revenueTotal = dashboard
    ? formatMoney(dashboard.summary.gross_revenue, dashboard.summary.currency)
    : analyticsText.unavailable;
  const revenueAxisPrefix = getCurrencyPrefix(dashboard?.summary.currency);
  const chartLabels = dashboard ? pickChartLabels(overviewRevenueData) : undefined;
  const trafficStats = mapTrafficStats(
    analyticsText.unavailable,
    liveNow,
    dashboardText.traffic,
    traffic,
  );
  const trafficData = mapTrafficData(traffic);
  const trafficSources = mapTrafficSources(traffic);
  const trafficTopPages = mapTopPages(traffic);
  const trafficFunnel = mapEcommerceFunnel(traffic);

  return (
    <div className="min-h-screen bg-background px-4 py-5 md:px-6">
      <div className="mx-auto max-w-[1720px]">
        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex h-10 items-center gap-2 border-b px-4 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                {dashboardText.tabs[tab.id]}
              </button>
            );
          })}
        </div>

        {activeTab === "overview" && (
          <OverviewTab
            period={period}
            sevenDaysLabel={analyticsText.sevenDays}
            thirtyDaysLabel={analyticsText.thirtyDays}
            statusLabel={
              dashboardQuery.isFetching
                ? analyticsText.refreshing
                : analyticsText.ownerAnalytics
            }
            errorMessage={
              dashboardQuery.isError
                ? getApiErrorMessage(dashboardQuery.error, analyticsText.loadFailed)
                : undefined
            }
            stats={overviewKpiStats}
            revenueData={overviewRevenueData}
            paymentSummary={overviewPaymentSummary}
            topProducts={overviewTopProducts}
            periodLabel={periodLabel}
            revenueTotal={revenueTotal}
            revenueChange={revenueChange}
            revenueAxisPrefix={revenueAxisPrefix}
            chartLabels={chartLabels}
            unavailable={analyticsUnavailable}
            unavailableText={analyticsText.unavailable}
            labels={{
              common: dashboardText.common,
              overview: dashboardText.overview,
            }}
            onPeriodChange={setPeriod}
          />
        )}

        {activeTab === "traffic" && (
          <TrafficTab
            stats={trafficStats}
            trafficData={trafficData}
            trafficSources={trafficSources}
            topPages={trafficTopPages}
            funnel={trafficFunnel}
            period={period}
            sevenDaysLabel={analyticsText.sevenDays}
            thirtyDaysLabel={analyticsText.thirtyDays}
            statusLabel={
              trafficQuery.isFetching
                ? analyticsText.refreshing
                : dashboardText.traffic.webAnalytics
            }
            errorMessage={
              trafficQuery.isError
                ? getApiErrorMessage(trafficQuery.error, analyticsText.loadFailed)
                : undefined
            }
            unavailableText={
              trafficUnavailable
                ? analyticsText.unavailable
                : dashboardText.common.noTrafficData
            }
            labels={{
              common: dashboardText.common,
              traffic: dashboardText.traffic,
            }}
            onPeriodChange={setPeriod}
          />
        )}

        {activeTab === "system" && (
          <SystemTab
            systemMetrics={systemMetrics}
            labels={dashboardText.system}
          />
        )}
      </div>
    </div>
  );
}

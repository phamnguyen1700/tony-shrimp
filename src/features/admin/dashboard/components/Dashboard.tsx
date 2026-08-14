"use client";

import { Activity, BarChart3 } from "lucide-react";
import { useState } from "react";
import { RevenueTab } from "./RevenueTab";
import { TrafficSystemTab } from "./TrafficSystemTab";
import type { Country, Product, RevenuePoint, Source, Stat, SystemMetric, TrafficPoint, Transaction } from "./shared";

type DashboardTab = "revenue" | "traffic-system";

interface Props {
  revenueStats: Stat[];
  trafficStats: Stat[];
  revenueData: RevenuePoint[];
  trafficData: TrafficPoint[];
  transactions: Transaction[];
  products: Product[];
  sources: Source[];
  countries: Country[];
  systemMetrics: SystemMetric[];
}

const tabs: Array<{
  id: DashboardTab;
  label: string;
  icon: typeof BarChart3;
}> = [
  { id: "revenue", label: "Revenue", icon: BarChart3 },
  { id: "traffic-system", label: "Traffic & system", icon: Activity },
];

export default function Dashboard({
  revenueStats,
  trafficStats,
  revenueData,
  trafficData,
  transactions,
  products,
  sources,
  countries,
  systemMetrics,
}: Props) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("revenue");

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
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-5">
          {activeTab === "revenue" ? (
            <RevenueTab stats={revenueStats} chartData={revenueData} transactions={transactions} products={products} />
          ) : (
            <TrafficSystemTab stats={trafficStats} trafficData={trafficData} sources={sources} countries={countries} systemMetrics={systemMetrics} />
          )}
        </div>
      </div>
    </div>
  );
}

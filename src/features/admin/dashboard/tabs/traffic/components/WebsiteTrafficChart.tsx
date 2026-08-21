"use client";

import { useState } from "react";
import BarChart from "@/components/common/charts/BarChart";
import DashboardPanel from "@/components/common/dashboard/DashboardPanel";
import type { TrafficPoint } from "@/types/adminDashboard";

interface WebsiteTrafficChartProps {
  data: TrafficPoint[];
  labels: {
    websiteTraffic: string;
    last30Days: string;
    users: string;
    sessions: string;
    pageViews: string;
  };
}

const metricKeys = ["users", "sessions", "pageViews"] as const;

type TrafficMetric = (typeof metricKeys)[number];

export default function WebsiteTrafficChart({ data, labels }: WebsiteTrafficChartProps) {
  const [metric, setMetric] = useState<TrafficMetric>("users");
  const latestValue = data[data.length - 1]?.[metric] ?? 0;
  const metrics = [
    { key: "users", label: labels.users },
    { key: "sessions", label: labels.sessions },
    { key: "pageViews", label: labels.pageViews },
  ] as const;

  return (
    <DashboardPanel
      title={labels.websiteTraffic}
      eyebrow={labels.last30Days}
      action={
        <div className="flex border border-border">
          {metrics.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setMetric(item.key)}
              className={`h-8 px-3 text-xs font-semibold transition-colors ${
                metric === item.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      }
      className="min-h-[360px]"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <strong className="block font-display text-4xl font-semibold leading-none text-foreground">
            {latestValue.toLocaleString()}
          </strong>
          <span className="mt-3 block text-sm text-muted-foreground">
            {metrics.find((item) => item.key === metric)?.label.toLowerCase()}
          </span>
        </div>
      </div>
      <div className="mt-10">
        <BarChart
          items={data.slice(-14).map((point) => ({
            label: point.date.replace("Day ", "D"),
            value: point[metric],
          }))}
          heightClassName="h-44"
        />
      </div>
    </DashboardPanel>
  );
}

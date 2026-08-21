"use client";

import { useState } from "react";
import DashboardPanel from "@/components/common/dashboard/DashboardPanel";
import Trend from "@/components/common/dashboard/Trend";
import type { RevenuePoint } from "@/types/adminDashboard";

interface PerformanceChartProps {
  labels: {
    performance: string;
    revenue: string;
    visitors: string;
    totalRevenue: string;
    uniqueVisitors: string;
  };
  data: RevenuePoint[];
  periodLabel?: string;
  revenueTotal?: string;
  revenueChange?: string;
  revenueAxisPrefix?: string;
  xLabels?: string[];
  unavailable?: boolean;
  unavailableText?: string;
}

function toChartPath(values: number[]) {
  if (values.length === 0) return "";

  const max = Math.max(...values, 1);
  const width = 700;
  const height = 220;
  const step = values.length > 1 ? width / (values.length - 1) : width;

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - (value / max) * 190;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
}

export default function PerformanceChart({
  labels,
  data,
  periodLabel = "Last 30 days",
  revenueTotal = "$24,860.42",
  revenueChange = "18.4%",
  revenueAxisPrefix = "$",
  xLabels = ["May 15", "May 22", "May 29", "Jun 05", "Jun 12"],
  unavailable = false,
  unavailableText = "Could not load",
}: PerformanceChartProps) {
  const metrics = [labels.revenue, labels.visitors] as const;
  const [metric, setMetric] = useState<(typeof metrics)[number]>(labels.revenue);
  const isRevenueMetric = metric === labels.revenue;
  const hasChartData = isRevenueMetric && !unavailable;
  const values = data.map((point) => point.value);
  const path = hasChartData ? toChartPath(values) : "";
  const maxValue = Math.max(...values, 1);
  const revenueYAxisTop = Math.ceil(maxValue / 100) * 100;

  return (
    <DashboardPanel
      title={labels.performance}
      eyebrow={periodLabel}
      className="min-h-[420px]"
      action={
        <div className="flex border border-border">
          {metrics.map((item) => (
            <button
              key={item}
              className={`h-9 px-4 text-xs transition-colors ${
                metric === item
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setMetric(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      }
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <strong className="block font-display text-4xl font-semibold leading-none text-foreground">
            {isRevenueMetric ? revenueTotal : unavailableText}
          </strong>
          <span className="mt-3 block text-sm text-muted-foreground">
            {isRevenueMetric ? labels.totalRevenue : labels.uniqueVisitors}
          </span>
        </div>
        {isRevenueMetric && revenueChange && !unavailable ? (
          <Trend value={revenueChange} />
        ) : null}
      </div>

      <div className="grid min-h-64 grid-cols-[44px_1fr] gap-3">
        <div className="flex flex-col justify-between py-3 font-mono-label text-[10px] text-muted-foreground">
          <span>
            {isRevenueMetric
              ? `${revenueAxisPrefix}${revenueYAxisTop.toLocaleString()}`
              : "-"}
          </span>
          <span>
            {isRevenueMetric
              ? `${revenueAxisPrefix}${Math.round(revenueYAxisTop / 2).toLocaleString()}`
              : "-"}
          </span>
          <span>0</span>
        </div>
        <div className="relative min-w-0">
          <div className="absolute inset-x-0 bottom-8 top-3 flex flex-col justify-between">
            <i className="border-t border-dashed border-border" />
            <i className="border-t border-dashed border-border" />
            <i className="border-t border-dashed border-border" />
            <i className="border-t border-dashed border-border" />
          </div>
          <svg
            className="relative z-10 h-full w-full"
            viewBox="0 0 700 230"
            preserveAspectRatio="none"
            role="img"
            aria-label={`${metric} trend chart`}
          >
            {path ? (
              <>
                <path d={`${path} L700,230 L0,230 Z`} fill="var(--accent)" fillOpacity=".09" />
                <path
                  d={path}
                  fill="none"
                  stroke="var(--accent)"
                  strokeOpacity=".22"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
              </>
            ) : null}
          </svg>
          {!hasChartData ? (
            <div className="absolute inset-x-0 top-1/2 text-center text-sm font-medium text-muted-foreground">
              {unavailableText}
            </div>
          ) : (
            <div className="absolute inset-x-0 bottom-0 flex justify-between font-mono-label text-[10px] text-muted-foreground">
              {xLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardPanel>
  );
}

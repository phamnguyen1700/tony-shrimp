"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  FunnelList,
  MetricCard,
  Panel,
  ProgressList,
  StateBody,
  Table,
  Trend,
  type Product,
  type RevenuePoint,
  type Stat,
  type Transaction,
} from "./shared";

function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const [metric, setMetric] = useState<"Revenue" | "Visitors">("Revenue");
  const values = data.map((point) => point.value);
  const path = values.map((value, index) => `${index === 0 ? "M" : "L"}${index * 24},${220 - value}`).join(" ");

  return (
    <Panel
      title="Performance"
      eyebrow="Last 30 days"
      className="min-h-[420px]"
      action={
        <div className="flex border border-border">
          {(["Revenue", "Visitors"] as const).map((item) => (
            <button
              key={item}
              className={`h-9 px-4 text-xs transition-colors ${
                metric === item ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
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
            {metric === "Revenue" ? "$24,860.42" : "48,392"}
          </strong>
          <span className="mt-3 block text-sm text-muted-foreground">
            {metric === "Revenue" ? "total revenue" : "unique visitors"}
          </span>
        </div>
        <Trend value="18.4%" />
      </div>

      <div className="grid min-h-64 grid-cols-[44px_1fr] gap-3">
        <div className="flex flex-col justify-between py-3 font-mono-label text-[10px] text-muted-foreground">
          <span>{metric === "Revenue" ? "$200k" : "200k"}</span>
          <span>{metric === "Revenue" ? "$100k" : "100k"}</span>
          <span>0</span>
        </div>
        <div className="relative min-w-0">
          <div className="absolute inset-x-0 top-3 bottom-8 flex flex-col justify-between">
            <i className="border-t border-dashed border-border" />
            <i className="border-t border-dashed border-border" />
            <i className="border-t border-dashed border-border" />
            <i className="border-t border-dashed border-border" />
          </div>
          <svg className="relative z-10 h-full w-full" viewBox="0 0 700 230" preserveAspectRatio="none" role="img" aria-label={`${metric} trend chart`}>
            <path d={`${path} L700,230 L0,230 Z`} fill="var(--accent)" fillOpacity=".09" />
            <path d={path} fill="none" stroke="var(--accent)" strokeOpacity=".22" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex justify-between font-mono-label text-[10px] text-muted-foreground">
            <span>May 15</span>
            <span>May 22</span>
            <span>May 29</span>
            <span>Jun 05</span>
            <span>Jun 12</span>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function PaymentSummary() {
  const rows = [
    { label: "Successful payments", value: "$24,860.42", trend: <Trend value="18.4%" /> },
    { label: "Refunds", value: "$1,240.00", trend: <Trend value="2.1%" down /> },
    { label: "Average order value", value: "$86.42", trend: <Trend value="4.6%" /> },
  ];

  return (
    <Panel title="Payment summary" eyebrow="This period">
      <div className="space-y-0">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-4 border-b border-border py-5 first:pt-0 last:border-0 last:pb-0">
            <span className="text-sm font-semibold text-foreground">{row.label}</span>
            <div className="text-right">
              <strong className="block font-display text-xl font-semibold text-foreground">{row.value}</strong>
              <span className="mt-2 block">{row.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function RevenueBreakdown() {
  return (
    <Panel title="Revenue breakdown" eyebrow="By category">
      <StateBody>
        <ProgressList
          items={[
            { label: "Product sales", value: "72%", width: "72%" },
            { label: "Memberships", value: "18%", width: "18%" },
            { label: "Digital goods", value: "10%", width: "10%" },
          ]}
        />
      </StateBody>
    </Panel>
  );
}

function RecentTransactionsTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <Panel title="Recent transactions" eyebrow="Latest activity" action={<button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">View all <ArrowUpRight size={14} /></button>}>
      <Table headers={["Customer", "Status", "Amount"]} rows={transactions.map((row) => [row.customer, row.status, row.amount])} />
    </Panel>
  );
}

function TopSellingProductsTable({ products }: { products: Product[] }) {
  return (
    <Panel title="Top products" eyebrow="By revenue">
      <Table headers={["Product", "Orders", "Revenue"]} rows={products.map((row) => [row.name, row.orders, row.revenue])} />
    </Panel>
  );
}

function SystemHealth() {
  return (
    <Panel title="System health" eyebrow="Live status">
      <div className="space-y-5">
        {[
          ["good", "API latency", "142ms"],
          ["good", "Checkout", "Operational"],
          ["warn", "Email delivery", "Degraded"],
        ].map(([status, label, value]) => (
          <div key={label} className="flex items-center gap-3 text-sm font-semibold text-foreground">
            <span className={`h-2 w-2 rounded-full ${status === "good" ? "bg-accent" : "bg-muted-foreground/25"}`} />
            <span>{label}</span>
            <strong className="ml-auto font-mono-label text-xs">{value}</strong>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function RevenueTab({
  stats,
  chartData,
  transactions,
  products,
}: {
  stats: Stat[];
  chartData: RevenuePoint[];
  transactions: Transaction[];
  products: Product[];
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <RevenueChart data={chartData} />
        <Panel title="Sales funnel" eyebrow="Customer journey">
          <FunnelList
            items={[
              { label: "Visitors", value: "48,392", width: "100%" },
              { label: "Product views", value: "18,742", width: "74%" },
              { label: "Added to cart", value: "4,820", width: "46%" },
              { label: "Completed orders", value: "1,284", width: "27%" },
            ]}
          />
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <PaymentSummary />
        <RevenueBreakdown />
        <SystemHealth />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_1.1fr_.75fr]">
        <RecentTransactionsTable transactions={transactions} />
        <TopSellingProductsTable products={products} />
        <Panel title="Top countries" eyebrow="Visitors">
          <div className="space-y-5">
            {[
              ["United States", "62%"],
              ["Canada", "14%"],
              ["United Kingdom", "9%"],
              ["Australia", "6%"],
            ].map(([country, value]) => (
              <div key={country} className="flex items-center justify-between gap-4 text-sm font-semibold text-foreground">
                <span>{country}</span>
                <strong className="font-mono-label text-xs">{value}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

"use client";

import { ArrowDownRight, ArrowUpRight, CircleHelp } from "lucide-react";
import type { ReactNode } from "react";

export type DashboardState = "ready" | "loading" | "empty" | "error";

export interface RevenuePoint {
  date: string;
  value: number;
}

export interface TrafficPoint {
  date: string;
  users: number;
  sessions: number;
}

export interface Product {
  name: string;
  orders: string;
  revenue: string;
}

export interface Transaction {
  customer: string;
  amount: string;
  status: string;
}

export interface Source {
  name: string;
  value: number;
}

export interface Country {
  name: string;
  value: number;
}

export interface SystemMetric {
  label: string;
  value: string;
  status: "good" | "warn";
}

export interface Stat {
  label: string;
  value: string;
  change?: string;
  live?: boolean;
}

export function Panel({
  title,
  eyebrow,
  action,
  children,
  className = "",
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`border border-border bg-card p-5 md:p-6 ${className}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          {eyebrow && <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</p>}
          <h2 className="mt-3 font-display text-xl font-semibold leading-none text-foreground">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StateBody({ state = "ready", children }: { state?: DashboardState; children: ReactNode }) {
  if (state === "loading") {
    return (
      <div className="space-y-3">
        <div className="h-4 w-full animate-pulse bg-secondary" />
        <div className="h-4 w-3/4 animate-pulse bg-secondary" />
        <div className="h-4 w-1/2 animate-pulse bg-secondary" />
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div className="flex min-h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
        <CircleHelp size={18} />
        <p>No activity in this range.</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex min-h-32 flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
        <p>Couldn&apos;t load this section.</p>
        <button className="border border-border px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-widest text-foreground">
          Retry
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

export function Trend({ value, down = false }: { value: string; down?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 font-mono-label text-xs ${down ? "text-muted-foreground" : "text-accent"}`}>
      {down ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
      {value}
    </span>
  );
}

export function MetricCard({ label, value, change, live = false }: Stat) {
  return (
    <div className="border border-border bg-card p-5 md:p-6">
      <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <strong className="mt-4 block font-display text-3xl font-semibold leading-none text-foreground md:text-4xl">{value}</strong>
      <div className="mt-5 flex items-center gap-2 text-xs">
        {live ? <span className="h-3 w-3 rounded-full border-2 border-primary bg-accent" /> : change && <Trend value={change} />}
        <span className="text-muted-foreground">{live ? "right now" : "vs. previous period"}</span>
      </div>
    </div>
  );
}

export function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[420px]">
        <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-border pb-3 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
          {headers.map((header) => (
            <span key={header} className="last:text-right">
              {header}
            </span>
          ))}
        </div>
        {rows.map((row) => (
          <div key={row.join("-")} className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-border py-4 text-sm font-semibold text-foreground last:border-0">
            {row.map((cell, index) =>
              index === row.length - 1 ? (
                <strong key={`${cell}-${index}`} className="text-right font-mono-label text-xs">
                  {cell}
                </strong>
              ) : (
                <span key={`${cell}-${index}`} className={index > 0 ? "font-mono-label text-xs" : ""}>
                  {cell}
                </span>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MiniBars({ values, accent = false }: { values: number[]; accent?: boolean }) {
  return (
    <div className="mt-6 flex h-24 items-end gap-1" aria-hidden="true">
      {values.map((value, index) => (
        <span
          key={index}
          style={{ height: `${value}%` }}
          className={`block min-h-3 flex-1 ${accent && index > values.length - 4 ? "bg-secondary/60" : "bg-primary/75 dark:bg-[#d6d0c1]"}`}
        />
      ))}
    </div>
  );
}

export function FunnelList({
  items,
}: {
  items: Array<{
    label: string;
    value: string;
    width: string;
  }>;
}) {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-3 flex items-center justify-between gap-4 text-sm font-semibold text-foreground">
            <span>{item.label}</span>
            <strong className="font-mono-label text-xs">{item.value}</strong>
          </div>
          <div className="h-px bg-border">
            <span className="block h-px bg-secondary" style={{ width: item.width }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProgressList({
  items,
}: {
  items: Array<{
    label: string;
    value: string;
    width: string;
  }>;
}) {
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-3 flex items-center justify-between gap-4 text-sm font-semibold text-foreground">
            <span>{item.label}</span>
            <strong className="font-mono-label text-xs">{item.value}</strong>
          </div>
          <div className="h-px bg-border">
            <span className="block h-px bg-secondary" style={{ width: item.width }} />
          </div>
        </div>
      ))}
    </div>
  );
}

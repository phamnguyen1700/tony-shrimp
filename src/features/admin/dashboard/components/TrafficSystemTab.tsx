import { Globe2 } from "lucide-react";
import { FunnelList, MetricCard, MiniBars, Panel, ProgressList, Table, type Country, type Source, type Stat, type SystemMetric, type TrafficPoint } from "./shared";

function WebsiteTrafficChart({ data }: { data: TrafficPoint[] }) {
  return (
    <Panel title="Website traffic" eyebrow="Last 30 days" className="min-h-[260px]">
      <div>
        <strong className="block font-display text-4xl font-semibold leading-none text-foreground">{data[data.length - 1]?.users.toLocaleString()}</strong>
        <span className="mt-3 block text-sm text-muted-foreground">active users</span>
      </div>
      <MiniBars values={data.slice(-12).map((point) => Math.min(100, point.users / 2))} accent />
    </Panel>
  );
}

function EcommerceFunnel() {
  return (
    <Panel title="Ecommerce funnel" eyebrow="Customer journey">
      <FunnelList
        items={[
          { label: "Visitors", value: "48,392", width: "100%" },
          { label: "Product views", value: "18,742", width: "74%" },
          { label: "Added to cart", value: "4,820", width: "46%" },
          { label: "Completed orders", value: "1,284", width: "27%" },
        ]}
      />
    </Panel>
  );
}

function TrafficSources({ sources }: { sources: Source[] }) {
  return (
    <Panel title="Traffic sources" eyebrow="By channel">
      <ProgressList items={sources.map((source) => ({ label: source.name, value: `${source.value}%`, width: `${source.value}%` }))} />
    </Panel>
  );
}

function TopPagesTable() {
  return (
    <Panel title="Top pages" eyebrow="By page views">
      <Table
        headers={["Page", "Views", "Exit rate"]}
        rows={[
          ["/shop", "12,842", "21.4%"],
          ["/recipes/summer-rolls", "8,402", "28.7%"],
          ["/about-tony", "6,218", "19.2%"],
          ["/journal", "4,982", "34.1%"],
        ]}
      />
    </Panel>
  );
}

function TopCountries({ countries }: { countries: Country[] }) {
  return (
    <Panel title="Top countries" eyebrow="Visitors">
      <div className="space-y-5">
        {countries.map((country) => (
          <div key={country.name} className="flex items-center justify-between gap-4 text-sm font-semibold text-foreground">
            <span className="inline-flex items-center gap-2">
              <Globe2 size={15} />
              {country.name}
            </span>
            <strong className="font-mono-label text-xs">{country.value}%</strong>
          </div>
        ))}
      </div>
      <MiniBars values={[34, 48, 42, 56, 62, 52, 66, 70, 58, 74, 82, 68]} accent />
    </Panel>
  );
}

function SystemStatus({ metrics }: { metrics: SystemMetric[] }) {
  return (
    <Panel title="System status" eyebrow="Live status">
      <div className="space-y-5">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex items-center gap-3 text-sm font-semibold text-foreground">
            <span className={`h-2 w-2 rounded-full ${metric.status === "good" ? "bg-accent" : "bg-muted-foreground/25"}`} />
            <span>{metric.label}</span>
            <strong className="ml-auto font-mono-label text-xs">{metric.value}</strong>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function InfrastructureMetrics() {
  return (
    <Panel title="Infrastructure" eyebrow="Resource usage">
      <div className="space-y-0">
        {[
          ["CPU usage", "24%"],
          ["Memory", "61%"],
          ["Disk", "38%"],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 border-b border-border py-5 first:pt-0 last:border-0 last:pb-0 text-sm font-semibold text-foreground">
            <span>{label}</span>
            <strong className="font-display text-2xl font-semibold">{value}</strong>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ApiPerformanceChart() {
  return (
    <Panel title="API performance" eyebrow="P95 latency">
      <strong className="block font-display text-4xl font-semibold leading-none text-foreground">184ms</strong>
      <MiniBars values={[42, 48, 44, 52, 58, 54, 62, 70, 66, 78, 74, 82]} accent />
    </Panel>
  );
}

function ServerResourcesChart() {
  return (
    <Panel title="Server resources" eyebrow="Current allocation">
      <div className="space-y-0">
        {[
          ["Uptime", "99.98%"],
          ["Error rate", "0.14%"],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 border-b border-border py-5 first:pt-0 last:border-0 last:pb-0 text-sm font-semibold text-foreground">
            <span>{label}</span>
            <strong className="font-display text-2xl font-semibold">{value}</strong>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function TrafficSystemTab({
  stats,
  trafficData,
  sources,
  countries,
  systemMetrics,
}: {
  stats: Stat[];
  trafficData: TrafficPoint[];
  sources: Source[];
  countries: Country[];
  systemMetrics: SystemMetric[];
}) {
  return (
    <>
      <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Web analytics</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <WebsiteTrafficChart data={trafficData} />
        <EcommerceFunnel />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <TrafficSources sources={sources} />
        <TopPagesTable />
        <TopCountries countries={countries} />
      </div>

      <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-muted-foreground">System health</p>
      <div className="grid gap-5 lg:grid-cols-3">
        <SystemStatus metrics={systemMetrics} />
        <InfrastructureMetrics />
        <ApiPerformanceChart />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ServerResourcesChart />
        <Panel title="Deployment activity" eyebrow="Recent events">
          <Table
            headers={["Event", "Status", "Time"]}
            rows={[
              ["Production deploy", "Success", "12m ago"],
              ["Database backup", "Success", "1h ago"],
              ["Worker restart", "Complete", "3h ago"],
            ]}
          />
        </Panel>
      </div>
    </>
  );
}

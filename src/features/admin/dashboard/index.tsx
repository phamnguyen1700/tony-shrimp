import ComingSoon from "@/components/common/ComingSoon";
import Dashboard from "./components/Dashboard";
import type { Country, Product, RevenuePoint, Source, Stat, SystemMetric, TrafficPoint, Transaction } from "./components/shared";

const revenueStats: Stat[] = [
  { label: "Gross revenue", value: "$24,860.42", change: "18.4%" },
  { label: "Orders", value: "1,284", change: "12.7%" },
  { label: "Conversion rate", value: "4.82%", change: "0.8%" },
  { label: "Active visitors", value: "342", live: true },
];

const trafficStats: Stat[] = [
  { label: "Visitors", value: "48,392", change: "22.1%" },
  { label: "Sessions", value: "62,104", change: "18.7%" },
  { label: "Page views", value: "128,442", change: "14.2%" },
  { label: "Bounce rate", value: "38.4%", change: "3.2%" },
];

const revenueData: RevenuePoint[] = [
  46, 54, 64, 56, 66, 78, 69, 82, 94, 86, 98, 110, 101, 114, 126, 116, 128, 140, 132, 144, 156, 146, 158, 170, 160, 172, 184, 174, 186, 198,
].map((value, index) => ({
  date: `Day ${index + 1}`,
  value,
}));

const trafficData: TrafficPoint[] = [
  128, 162, 148, 176, 188, 170, 198, 206, 184, 218, 236, 204, 224, 242, 216, 238, 256, 248, 264, 282, 274, 298, 316, 304, 332, 348, 338, 366, 392, 421,
].map((users, index) => ({
  date: `Day ${index + 1}`,
  users,
  sessions: Math.round(users * 1.28),
}));

const transactions: Transaction[] = [
  { customer: "Maya Chen", status: "Paid", amount: "A$240.00" },
  { customer: "Theo Martin", status: "Paid", amount: "A$86.42" },
  { customer: "Ari Singh", status: "Refunded", amount: "A$129.00" },
  { customer: "Nina Cole", status: "Paid", amount: "A$64.00" },
];

const products: Product[] = [
  { name: "Red Boa", orders: "482", revenue: "A$8,420.00" },
  { name: "Orange Eye Blue Devil", orders: "216", revenue: "A$6,912.00" },
  { name: "Orange Eye Red Demon", orders: "194", revenue: "A$3,686.00" },
  { name: "Extreme Red King Kong", orders: "154", revenue: "A$2,464.00" },
];

const sources: Source[] = [
  { name: "Direct", value: 42 },
  { name: "Organic search", value: 31 },
  { name: "Social", value: 18 },
  { name: "Referral", value: 9 },
];

const countries: Country[] = [
  { name: "United States", value: 62 },
  { name: "Canada", value: 14 },
  { name: "United Kingdom", value: 9 },
  { name: "Australia", value: 6 },
];

const systemMetrics: SystemMetric[] = [
  { label: "API uptime", value: "99.98%", status: "good" },
  { label: "P95 latency", value: "184ms", status: "good" },
  { label: "Error rate", value: "0.14%", status: "warn" },
  { label: "Webhooks", value: "Operational", status: "good" },
];

export default function AdminDashboardFeature() {
  return (
    <ComingSoon
      title="Admin dashboard coming soon"
      description="Revenue, traffic, and system analytics are in preview while the final admin dashboard is being prepared."
      imageSrc="/coming-soon/comming-soon.png"
      imageAlt="Admin dashboard coming soon"
    >
      <Dashboard
        revenueStats={revenueStats}
        trafficStats={trafficStats}
        revenueData={revenueData}
        trafficData={trafficData}
        transactions={transactions}
        products={products}
        sources={sources}
        countries={countries}
        systemMetrics={systemMetrics}
      />
    </ComingSoon>
  );
}

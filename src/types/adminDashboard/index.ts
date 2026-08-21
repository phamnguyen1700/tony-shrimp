export interface RevenuePoint {
  date: string;
  value: number;
}

export interface TrafficPoint {
  date: string;
  users: number;
  sessions: number;
  pageViews: number;
}

export interface Source {
  name: string;
  value: number;
}

export interface TopPage {
  path: string;
  views: number;
  users: number;
}

export interface EcommerceFunnel {
  visitors: number;
  completedOrders: number;
  conversionRate: string | null;
}

export interface Product {
  name: string;
  orders: string;
  revenue: string;
}

export interface PaymentSummaryItem {
  label: string;
  value: string;
  change?: string;
  down?: boolean;
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

export type AnalyticsPeriodKey = "7d" | "30d";

export interface AnalyticsDashboardResponse {
  period: {
    key: AnalyticsPeriodKey;
    from: string;
    to: string;
    timezone: string;
  };
  summary: {
    gross_revenue: string;
    gross_revenue_change_percent: string | null;
    orders: number;
    orders_change_percent: string | null;
    currency: string;
  };
  payments: {
    successful_count: number;
    failed_count: number;
    attempts: number;
    success_rate: string;
    refund_amount: string;
    refund_count: number;
    stripe_fees: string;
    net_revenue: string;
    currency: string;
  };
  balance: {
    available: string;
    pending: string;
    currency: string;
  };
  average_order_value: {
    amount: string;
    currency: string;
  };
  revenue_series: Array<{
    date: string;
    gross: string;
    fees: string;
    net: string;
  }>;
  top_products: Array<{
    name: string;
    quantity: number;
    revenue: string;
  }>;
  disputes: {
    open_count: number;
    amount_at_risk: string;
    currency: string;
  };
}

export interface AnalyticsPayoutListResponse {
  payouts: Array<{
    amount: string;
    currency: string;
    status: string;
    created: string;
    arrival_date: string | null;
  }>;
}

export interface AnalyticsTrafficResponse {
  period: {
    key: AnalyticsPeriodKey;
    from: string;
    to: string;
    timezone: string;
  };
  summary: {
    users: number;
    users_change_percent: string | null;
    sessions: number;
    sessions_change_percent: string | null;
    page_views: number;
    page_views_change_percent: string | null;
    engagement_rate: string;
    engagement_rate_change_percent: string | null;
    bounce_rate: string;
  };
  series: Array<{
    date: string;
    users: number;
    sessions: number;
    page_views: number;
  }>;
  sources: Array<{
    channel: string;
    users: number;
    sessions: number;
    percent: string;
  }>;
  top_pages: Array<{
    path: string;
    views: number;
    users: number;
  }>;
  ecommerce_funnel: {
    visitors: number;
    completed_orders: number;
    conversion_rate: string | null;
  };
}

export interface AnalyticsRealtimeResponse {
  active_users: number;
  top_active_pages: Array<{
    path: string;
    active_users: number;
  }>;
}

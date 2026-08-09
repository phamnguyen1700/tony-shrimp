export const routes = {
  home: "/",
  shop: "/shop",
  cart: "/cart",
  account: "/account",
  product: (id: string) => `/products/${id}`,
  order: (id: string) => `/orders/${id}`,
  admin: {
    dashboard: "/admin",
    shrimp: "/admin/shrimp",
    orders: "/admin/orders",
    order: (id: string) => `/admin/orders/${id}`,
  },
} as const;

export const routes = {
  home: "/",
  shop: "/aquarium-shrimp",
  cart: "/cart",
  account: "/account",
  product: (slug: string) => `/aquarium-shrimp/${slug}`,
  order: (id: string) => `/orders/${id}`,
  admin: {
    dashboard: "/admin",
    shrimp: "/admin/shrimp",
    orders: "/admin/orders",
    order: (id: string) => `/admin/orders/${id}`,
  },
} as const;

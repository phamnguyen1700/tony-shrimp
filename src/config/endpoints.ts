export const endpoints = {
  health: "/health/",
  auth: {
    requestOtp: "/auth/request-otp",
    verifyOtp: "/auth/verify-otp",
    me: "/auth/me",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  catalog: {
    options: "/catalog/options",
    shrimp: "/catalog/shrimp",
    shrimpDetail: (shrimpId: string) => `/catalog/shrimp/${shrimpId}`,
  },
  ownerCatalog: {
    options: "/owner/catalog/options",
    shrimp: "/owner/catalog/shrimp",
    shrimpDetail: (shrimpId: string) => `/owner/catalog/shrimp/${shrimpId}`,
    deleteShrimp: (shrimpId: string) => `/owner/catalog/shrimp/${shrimpId}`,
    activateShrimp: (shrimpId: string) => `/owner/catalog/shrimp/${shrimpId}/activate`,
    deactivateShrimp: (shrimpId: string) => `/owner/catalog/shrimp/${shrimpId}/deactivate`,
    variants: (shrimpId: string) => `/owner/catalog/shrimp/${shrimpId}/variants`,
    variant: (shrimpId: string, variantId: string) =>
      `/owner/catalog/shrimp/${shrimpId}/variants/${variantId}`,
    careParameter: (shrimpId: string) => `/owner/catalog/shrimp/${shrimpId}/care-parameter`,
    presignImage: (shrimpId: string) => `/owner/catalog/shrimp/${shrimpId}/images/presign`,
    images: (shrimpId: string) => `/owner/catalog/shrimp/${shrimpId}/images`,
    image: (shrimpId: string, imageId: string) =>
      `/owner/catalog/shrimp/${shrimpId}/images/${imageId}`,
  },
  products: "/products",
  orders: "/orders",
} as const;

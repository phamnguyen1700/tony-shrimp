export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: string
  name: string
  grade?: string
  imageKey: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  number: string
  date: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  shippingAddress: {
    name: string
    line1: string
    city: string
    state: string
    postcode: string
  }
  carrier?: string
  trackingNumber?: string
  shippedDate?: string
  estimatedDelivery?: string
  statusHistory: { status: OrderStatus; timestamp: string; note?: string }[]
}

export const sampleOrders: Order[] = [
  {
    id: 'ts-1042',
    number: 'TS-1042',
    date: '2026-07-28',
    status: 'shipped',
    items: [
      { productId: '2', name: 'Blue Snowflake Galaxy', grade: 'SS Grade', imageKey: 'blue-snowflake-galaxy', quantity: 3, unitPrice: 40 },
      { productId: '1', name: 'Red Boa', grade: 'SS Grade', imageKey: 'red-boa', quantity: 1, unitPrice: 45 },
    ],
    subtotal: 165,
    shipping: 15,
    total: 180,
    shippingAddress: { name: 'Alex Nguyen', line1: '42 Botanical Ave', city: 'Melbourne', state: 'VIC', postcode: '3000' },
    carrier: 'Australia Post Express',
    trackingNumber: 'EX1234567890AU',
    shippedDate: '2026-07-29',
    estimatedDelivery: '2026-08-01',
    statusHistory: [
      { status: 'processing', timestamp: '2026-07-28T09:15:00', note: 'Order received and payment confirmed.' },
      { status: 'shipped', timestamp: '2026-07-29T11:30:00', note: 'Dispatched via Australia Post Express. Live arrival guarantee applies.' },
    ],
  },
  {
    id: 'ts-1038',
    number: 'TS-1038',
    date: '2026-07-14',
    status: 'delivered',
    items: [
      { productId: '5', name: 'Orange Boa', grade: 'SS Grade', imageKey: 'orange-boa', quantity: 2, unitPrice: 45 },
    ],
    subtotal: 90,
    shipping: 15,
    total: 105,
    shippingAddress: { name: 'Alex Nguyen', line1: '42 Botanical Ave', city: 'Melbourne', state: 'VIC', postcode: '3000' },
    carrier: 'Australia Post Express',
    trackingNumber: 'EX9876543210AU',
    shippedDate: '2026-07-15',
    statusHistory: [
      { status: 'processing', timestamp: '2026-07-14T14:00:00' },
      { status: 'shipped', timestamp: '2026-07-15T10:00:00' },
      { status: 'delivered', timestamp: '2026-07-16T13:45:00', note: 'Delivered. All shrimp arrived in excellent condition.' },
    ],
  },
]

export const adminOrders: Order[] = [
  ...sampleOrders,
  {
    id: 'ts-1043',
    number: 'TS-1043',
    date: '2026-07-30',
    status: 'processing',
    items: [
      { productId: '6', name: 'Blue Boa', grade: 'SS Grade / OE', imageKey: 'blue-boa', quantity: 2, unitPrice: 50 },
      { productId: '3', name: 'Yellow Snowflake Galaxy', grade: 'SS Grade', imageKey: 'yellow-snowflake-galaxy', quantity: 1, unitPrice: 38 },
    ],
    subtotal: 138,
    shipping: 15,
    total: 153,
    shippingAddress: { name: 'Sarah Kim', line1: '15 Reef Street', city: 'Sydney', state: 'NSW', postcode: '2000' },
    statusHistory: [
      { status: 'processing', timestamp: '2026-07-30T08:45:00', note: 'Order received.' },
    ],
  },
  {
    id: 'ts-1041',
    number: 'TS-1041',
    date: '2026-07-26',
    status: 'delivered',
    items: [
      { productId: '4', name: 'Red Snowflake Galaxy', grade: 'SS Grade', imageKey: 'red-snowflake-galaxy', quantity: 4, unitPrice: 42 },
    ],
    subtotal: 168,
    shipping: 15,
    total: 183,
    shippingAddress: { name: 'Marcus Chen', line1: '8 Aqua Lane', city: 'Brisbane', state: 'QLD', postcode: '4000' },
    carrier: 'StarTrack Express',
    trackingNumber: 'ST2468013579',
    shippedDate: '2026-07-27',
    statusHistory: [
      { status: 'processing', timestamp: '2026-07-26T10:00:00' },
      { status: 'shipped', timestamp: '2026-07-27T09:00:00' },
      { status: 'delivered', timestamp: '2026-07-28T11:00:00' },
    ],
  },
]

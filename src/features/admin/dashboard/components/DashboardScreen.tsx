import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import type { Translations } from '@/i18n'
import { adminOrders } from '@/data/orders'
import { shrimpProducts } from '@/data/shrimp'
import Badge from '@/shared/ui/Badge'
import { staggerContainer, staggerFast, fadeUp } from '@/lib/motionVariants'
import type { OrderStatus } from '@/data/orders'

interface Props {
  t: Translations
}

const badgeVariant = (status: OrderStatus) => {
  const map: Record<OrderStatus, 'processing' | 'shipped' | 'delivered' | 'cancelled'> = {
    processing: 'processing',
    shipped: 'shipped',
    delivered: 'delivered',
    cancelled: 'cancelled',
  }
  return map[status]
}

const statCards = (t: Translations) => [
  {
    label: t.admin.processingOrders,
    value: adminOrders.filter((o) => o.status === 'processing').length,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: t.admin.shippedOrders,
    value: adminOrders.filter((o) => o.status === 'shipped').length,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
  {
    label: t.admin.availableProducts,
    value: shrimpProducts.filter((s) => s.status !== 'out-of-stock').length,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: t.admin.lowAvailability,
    value: shrimpProducts.filter((s) => s.status === 'low-stock').length,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
]

export default function Dashboard({ t }: Props) {
  const reduced = useReducedMotion()
  const recentOrders = [...adminOrders].slice(0, 5)

  return (
    <div className="p-6 md:p-8 max-w-6xl">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8">
          {t.admin.dashboard}
        </h1>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          variants={reduced ? undefined : staggerFast}
          initial={reduced ? undefined : 'hidden'}
          animate={reduced ? undefined : 'visible'}
        >
          {statCards(t).map((card) => (
            <motion.div
              key={card.label}
              variants={reduced ? undefined : fadeUp}
              className="bg-card border border-border p-5"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-muted-foreground">{card.icon}</span>
              </div>
              <div className="font-display text-3xl font-semibold text-foreground mb-1">{card.value}</div>
              <div className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{card.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono-label text-xs uppercase tracking-widest text-foreground">{t.admin.recentOrders}</h2>
          <Link href="/admin/orders" className="font-mono-label text-xs uppercase tracking-widest text-accent hover:underline">
            View all →
          </Link>
        </div>

        <div className="hidden md:block bg-card border border-border overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Order #', 'Customer', 'Items', 'Total', 'Date', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <motion.tbody
              variants={reduced ? undefined : staggerContainer}
              initial={reduced ? undefined : 'hidden'}
              animate={reduced ? undefined : 'visible'}
            >
              {recentOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  variants={reduced ? undefined : fadeUp}
                  className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono-label text-xs text-foreground">{order.number}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{order.shippingAddress.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{order.items.length}</td>
                  <td className="px-4 py-3 text-sm text-foreground">A${order.total}</td>
                  <td className="px-4 py-3 font-mono-label text-xs text-muted-foreground">{order.date}</td>
                  <td className="px-4 py-3">
                    <Badge variant={badgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono-label text-xs uppercase tracking-widest text-accent hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
          {recentOrders.map((order) => (
            <div key={order.id} className="bg-card border border-border p-4" style={{ borderRadius: 'var(--radius)' }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-mono-label text-xs text-foreground">{order.number}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{order.shippingAddress.name}</div>
                </div>
                <Badge variant={badgeVariant(order.status)}>{order.status}</Badge>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="font-mono-label text-xs text-muted-foreground uppercase tracking-widest">
                  {order.items.length} items · A${order.total}
                </div>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="font-mono-label text-xs uppercase tracking-widest text-accent hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

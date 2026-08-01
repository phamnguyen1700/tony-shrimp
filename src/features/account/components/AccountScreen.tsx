import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import type { Translations } from '@/i18n'
import { sampleOrders } from '@/data/orders'
import type { OrderStatus } from '@/data/orders'
import Badge from '@/shared/ui/Badge'
import Input from '@/shared/ui/Input'
import MotionButton from '@/components/common/motion/MotionButton'

interface Props {
  t: Translations
}

type Tab = 'orders' | 'profile' | 'addresses'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getStatusBadgeVariant(status: OrderStatus): 'processing' | 'shipped' | 'delivered' | 'cancelled' {
  return status
}

function getStatusLabel(status: OrderStatus, t: Translations) {
  const map: Record<OrderStatus, string> = {
    processing: t.order.processing,
    shipped: t.order.shipped,
    delivered: t.order.delivered,
    cancelled: t.order.cancelled,
  }
  return map[status]
}

export default function Account({ t }: Props) {
  const reduced = useReducedMotion()
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const [profileName, setProfileName] = useState('Alex Nguyen')
  const [profileEmail, setProfileEmail] = useState('alex@example.com')
  const [profilePhone, setProfilePhone] = useState('+61 400 000 000')

  const tabs: { key: Tab; label: string }[] = [
    { key: 'orders', label: t.account.myOrders },
    { key: 'profile', label: t.account.profile },
    { key: 'addresses', label: t.account.addresses },
  ]

  return (
    <div className="pt-14 min-h-screen bg-background">
      <div className="max-w-screen-lg mx-auto px-4 md:px-8 py-8 md:py-12">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-10"
        >
          <p className="font-mono-label text-[11px] tracking-[0.22em] text-muted-foreground uppercase mb-2">
            TONY SHRIMP AUSTRALIA
          </p>
          <h1 className="font-display italic font-semibold text-5xl md:text-7xl text-foreground leading-none">
            {t.account.title}
          </h1>
        </motion.div>

        <div className="border-b border-border mb-8">
          <div className="flex gap-0">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-0 mr-8 pb-3 font-mono-label text-xs tracking-[0.16em] uppercase transition-colors ${
                  activeTab === tab.key ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div
                    className="absolute bottom-0 inset-x-0 h-[1.5px] bg-accent"
                    layoutId="tab-indicator"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {sampleOrders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  className="border border-border p-5 hover:border-foreground/20 transition-colors"
                  style={{ borderRadius: 'var(--radius)' }}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: reduced ? 0 : idx * 0.07 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-display italic font-semibold text-base text-foreground">{order.number}</p>
                        <Badge variant={getStatusBadgeVariant(order.status)}>{getStatusLabel(order.status, t)}</Badge>
                      </div>
                      <p className="font-mono-label text-[11px] tracking-widest text-muted-foreground uppercase mt-1">
                        {formatDate(order.date)}
                      </p>
                      <p className="font-body text-sm text-muted-foreground mt-2">
                        {order.items.map(i => `${i.name}${i.grade ? ` (${i.grade})` : ''} ×${i.quantity}`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-lg font-semibold text-foreground">A${order.total}</p>
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-block mt-2 font-mono-label text-[11px] tracking-[0.16em] uppercase text-accent hover:text-accent/80 transition-colors"
                      >
                        {t.order.viewOrder}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}

              {sampleOrders.length === 0 && (
                <div className="py-16 text-center">
                  <p className="font-mono-label text-xs tracking-widest text-muted-foreground uppercase">No orders yet.</p>
                  <Link
                    href="/shop"
                    className="inline-block mt-4 font-mono-label text-xs tracking-widest uppercase text-accent underline underline-offset-2"
                  >
                    Browse the shop →
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-md"
            >
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="font-mono-label text-[11px] tracking-[0.16em] uppercase text-muted-foreground">Full Name</label>
                  <Input
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono-label text-[11px] tracking-[0.16em] uppercase text-muted-foreground">Email</label>
                  <Input
                    type="email"
                    value={profileEmail}
                    onChange={e => setProfileEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono-label text-[11px] tracking-[0.16em] uppercase text-muted-foreground">Phone</label>
                  <Input
                    type="tel"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    placeholder="+61 400 000 000"
                  />
                </div>
                <MotionButton variant="accent" size="md">
                  SAVE CHANGES
                </MotionButton>
              </div>
            </motion.div>
          )}

          {activeTab === 'addresses' && (
            <motion.div
              key="addresses"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <div
                className="border border-border p-5"
                style={{ borderRadius: 'var(--radius)' }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-body text-sm font-medium text-foreground">Alex Nguyen</p>
                      <span className="font-mono-label text-xs tracking-widest uppercase px-1.5 py-0.5 bg-accent/10 text-accent border border-accent/20" style={{ borderRadius: 'var(--radius)' }}>
                        DEFAULT
                      </span>
                    </div>
                    <p className="font-body text-sm text-muted-foreground">42 Botanical Ave</p>
                    <p className="font-body text-sm text-muted-foreground">Melbourne VIC 3000</p>
                    <p className="font-body text-sm text-muted-foreground">Australia</p>
                  </div>
                  <button className="font-mono-label text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors">
                    Edit
                  </button>
                </div>
              </div>

              <button
                className="flex items-center gap-2 font-mono-label text-xs tracking-[0.16em] uppercase text-accent hover:text-accent/80 transition-colors py-2"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                + Add Address
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 pt-8 border-t border-border">
          <button className="font-mono-label text-xs tracking-[0.16em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            {t.account.signOut}
          </button>
        </div>
      </div>
    </div>
  )
}

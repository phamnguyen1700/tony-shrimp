import { motion, useReducedMotion } from 'motion/react'
import type { Translations } from '@/i18n'
import { sampleOrders } from '@/data/orders'
import type { OrderStatus } from '@/data/orders'
import { shrimpImages } from '@/assets/images'
import Badge from '@/shared/ui/Badge'

interface Props {
  t: Translations
  id: string
}

const STATUS_STEPS: OrderStatus[] = ['processing', 'shipped', 'delivered']

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
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

export default function OrderTracking({ t, id }: Props) {
  const reduced = useReducedMotion()

  const order = sampleOrders.find(o => o.id === (id ?? 'ts-1042')) ?? sampleOrders[0]

  const statusIndex = STATUS_STEPS.indexOf(order.status)
  const isCancelled = order.status === 'cancelled'

  function stepState(stepStatus: OrderStatus): 'completed' | 'active' | 'future' {
    const stepIdx = STATUS_STEPS.indexOf(stepStatus)
    if (isCancelled) return 'future'
    if (stepIdx < statusIndex) return 'completed'
    if (stepIdx === statusIndex) return 'active'
    return 'future'
  }

  const historyByStatus = Object.fromEntries(
    order.statusHistory.map(h => [h.status, h])
  )

  return (
    <div className="pt-14 min-h-screen bg-background">
      <div className="max-w-screen-lg mx-auto px-4 md:px-8 py-8 md:py-12">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-12"
        >
          <p className="font-mono-label text-[9px] tracking-[0.3em] text-muted-foreground uppercase mb-2">
            {t.order.orderNumber}
          </p>
          <h1 className="font-display italic font-semibold text-4xl md:text-6xl text-foreground leading-none">
            {order.number}
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <Badge variant={getStatusBadgeVariant(order.status)}>{getStatusLabel(order.status, t)}</Badge>
            <span className="font-mono-label text-[9px] tracking-widest text-muted-foreground">{formatDate(order.date)}</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-[1fr_320px] gap-8 md:gap-12 items-start">
          <div>
            <div className="mb-10">
              <div className="relative pl-8">
                {isCancelled ? (
                  <motion.div
                    initial={reduced ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 py-4"
                  >
                    <div className="absolute left-0 w-5 h-5 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                    <div>
                      <p className="font-mono-label text-[10px] tracking-[0.2em] uppercase text-red-500">{t.order.cancelled}</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="absolute left-[9px] top-5 bottom-5 w-[1px] bg-border" />
                )}

                {!isCancelled && STATUS_STEPS.map((step, idx) => {
                  const state = stepState(step)
                  const historyEntry = historyByStatus[step]
                  return (
                    <motion.div
                      key={step}
                      className="relative flex gap-4 pb-8 last:pb-0"
                      initial={reduced ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: reduced ? 0 : idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div
                        className={`absolute -left-8 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          state === 'completed' ? 'bg-accent border-accent' :
                          state === 'active' ? 'bg-accent border-accent' :
                          'bg-background border-border'
                        }`}
                      >
                        {state === 'completed' && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3L3 5L7 1" stroke="var(--accent-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {state === 'active' && <span className="w-2 h-2 rounded-full bg-accent-foreground" />}
                      </div>

                      <div className="flex-1 pt-0.5">
                        <p className={`font-mono-label text-[10px] tracking-[0.2em] uppercase ${state !== 'future' ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {getStatusLabel(step, t)}
                        </p>
                        {historyEntry && (
                          <>
                            <p className="font-mono-label text-[9px] tracking-widest text-muted-foreground mt-1">
                              {formatDateTime(historyEntry.timestamp)}
                            </p>
                            {historyEntry.note && (
                              <p className="font-body text-sm text-muted-foreground mt-1">{historyEntry.note}</p>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {(order.status === 'shipped' || order.status === 'delivered') && order.carrier && (
              <motion.div
                className="border border-border p-5 space-y-3 mb-8"
                style={{ borderRadius: 'var(--radius)' }}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3 }}
              >
                <p className="font-mono-label text-[9px] tracking-[0.2em] uppercase text-muted-foreground">TRACKING</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-mono-label text-[9px] tracking-widest uppercase text-muted-foreground">{t.order.carrier}</p>
                    <p className="font-body text-sm text-foreground mt-0.5">{order.carrier}</p>
                  </div>
                  <div>
                    <p className="font-mono-label text-[9px] tracking-widest uppercase text-muted-foreground">{t.order.trackingNumber}</p>
                    <p className="font-mono-label text-xs text-foreground mt-0.5">{order.trackingNumber}</p>
                  </div>
                  {order.shippedDate && (
                    <div>
                      <p className="font-mono-label text-[9px] tracking-widest uppercase text-muted-foreground">{t.order.shippedDate}</p>
                      <p className="font-body text-sm text-foreground mt-0.5">{formatDate(order.shippedDate)}</p>
                    </div>
                  )}
                </div>
                <a
                  href={`https://auspost.com.au/mypost/track/#/search?trackingId=${order.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-mono-label text-[10px] tracking-[0.2em] uppercase text-accent hover:text-accent/80 transition-colors"
                >
                  {t.order.trackPackage}
                </a>
              </motion.div>
            )}

            <motion.div
              className="space-y-4"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.35 }}
            >
              <p className="font-mono-label text-[9px] tracking-[0.2em] uppercase text-muted-foreground">ITEMS</p>
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-border">
                  <div className="w-14 h-14 bg-[#080b08] shrink-0" style={{ borderRadius: 'var(--radius)' }}>
                    <img src={shrimpImages[item.imageKey]} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display italic font-semibold text-sm text-foreground">{item.name}</p>
                    {item.grade && <p className="font-mono-label text-[9px] tracking-widest text-muted-foreground uppercase">{item.grade}</p>}
                  </div>
                  <p className="font-mono-label text-[10px] tracking-widest text-muted-foreground">×{item.quantity}</p>
                  <p className="font-display text-sm font-medium text-foreground">A${item.unitPrice * item.quantity}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="space-y-6"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="border border-border p-5 space-y-4" style={{ borderRadius: 'var(--radius)' }}>
              <p className="font-mono-label text-[9px] tracking-[0.2em] uppercase text-muted-foreground">ORDER DETAILS</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="font-mono-label text-[9px] tracking-widest uppercase text-muted-foreground">{t.order.orderNumber}</p>
                  <p className="font-mono-label text-[10px] text-foreground">{order.number}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-mono-label text-[9px] tracking-widest uppercase text-muted-foreground">{t.order.orderDate}</p>
                  <p className="font-mono-label text-[10px] text-foreground">{formatDate(order.date)}</p>
                </div>
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between">
                  <p className="font-body text-sm text-muted-foreground">{t.cart.subtotal}</p>
                  <p className="font-display text-sm text-foreground">A${order.subtotal}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-body text-sm text-muted-foreground">{t.cart.shipping}</p>
                  <p className="font-display text-sm text-foreground">A${order.shipping}</p>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <p className="font-mono-label text-[10px] tracking-[0.2em] uppercase">{t.cart.total}</p>
                  <p className="font-display text-base font-semibold text-foreground">A${order.total}</p>
                </div>
              </div>
            </div>

            <div className="border border-border p-5 space-y-2" style={{ borderRadius: 'var(--radius)' }}>
              <p className="font-mono-label text-[9px] tracking-[0.2em] uppercase text-muted-foreground mb-3">SHIPPING ADDRESS</p>
              <p className="font-body text-sm text-foreground">{order.shippingAddress.name}</p>
              <p className="font-body text-sm text-muted-foreground">{order.shippingAddress.line1}</p>
              <p className="font-body text-sm text-muted-foreground">
                {order.shippingAddress.city} {order.shippingAddress.state} {order.shippingAddress.postcode}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

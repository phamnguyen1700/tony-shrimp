import { useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import type { Translations } from '@/i18n'
import type { Order, OrderStatus } from '@/data/orders'
import { adminOrders } from '@/data/orders'
import { getShrimpImage } from '@/assets/images'
import Badge from '@/shared/ui/Badge'
import MotionButton from '@/components/common/motion/MotionButton'
import Dialog from '@/shared/ui/Dialog'
import Input from '@/shared/ui/Input'
import { fadeIn, fadeUp, staggerContainer } from '@/lib/motionVariants'

interface Props {
  t: Translations
  id: string
}

const badgeVariant = (s: OrderStatus) => s as 'processing' | 'shipped' | 'delivered' | 'cancelled'

const statusLabel: Record<OrderStatus, string> = {
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export default function OrderDetail({ t, id }: Props) {
  const reduced = useReducedMotion()

  const original = adminOrders.find((o) => o.id === id)
  const [order, setOrder] = useState<Order | undefined>(original)
  const [shipDialogOpen, setShipDialogOpen] = useState(false)
  const [shipForm, setShipForm] = useState({ carrier: '', trackingNumber: '', shippedDate: '' })

  if (!order) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Order not found.</p>
      </div>
    )
  }

  const confirmShipped = () => {
    const now = new Date().toISOString()
    setOrder((prev) =>
      prev
        ? {
            ...prev,
            status: 'shipped',
            carrier: shipForm.carrier,
            trackingNumber: shipForm.trackingNumber,
            shippedDate: shipForm.shippedDate,
            statusHistory: [
              ...prev.statusHistory,
              { status: 'shipped' as OrderStatus, timestamp: now, note: `Shipped via ${shipForm.carrier}` },
            ],
          }
        : prev
    )
    setShipDialogOpen(false)
  }

  return (
    <>
      <motion.div
        className="p-6 md:p-8 max-w-6xl"
        variants={reduced ? undefined : fadeIn}
        initial={reduced ? undefined : 'hidden'}
        animate={reduced ? undefined : 'visible'}
        transition={{ duration: 0.35 }}
      >
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 font-mono-label text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display text-2xl font-semibold text-foreground">{order.number}</h1>
                <Badge variant={badgeVariant(order.status)}>{statusLabel[order.status]}</Badge>
              </div>
              <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{t.order.orderDate}: {order.date}</p>
            </div>

            <div className="bg-card border border-border p-5" style={{ borderRadius: 'var(--radius)' }}>
              <h2 className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-4">Shipping Address</h2>
              <p className="text-sm text-foreground font-medium">{order.shippingAddress.name}</p>
              <p className="text-sm text-muted-foreground mt-1">{order.shippingAddress.line1}</p>
              <p className="text-sm text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postcode}</p>
            </div>

            <div className="bg-card border border-border overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">Order Items</h2>
              </div>
              <motion.div
                variants={reduced ? undefined : staggerContainer}
                initial={reduced ? undefined : 'hidden'}
                animate={reduced ? undefined : 'visible'}
              >
                {order.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={reduced ? undefined : fadeUp}
                    className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0"
                  >
                    <img
                      src={getShrimpImage(item.imageKey)}
                      alt={item.name}
                      className="w-14 h-14 object-cover flex-shrink-0"
                      style={{ borderRadius: 'var(--radius-sm)' }}
                    />
                    <div className="flex-1">
                      <div className="text-sm text-foreground">{item.name}</div>
                      {item.grade && <div className="font-mono-label text-xs text-muted-foreground mt-0.5">{item.grade}</div>}
                      <div className="font-mono-label text-xs text-muted-foreground mt-1">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-sm text-foreground">A${item.unitPrice * item.quantity}</div>
                  </motion.div>
                ))}
              </motion.div>
              <div className="px-5 py-4 space-y-2 border-t border-border bg-secondary/20">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">A${order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">A${order.shipping}</span>
                </div>
                <div className="flex justify-between text-sm font-medium pt-2 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">A${order.total}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border p-5 lg:sticky lg:top-6" style={{ borderRadius: 'var(--radius)' }}>
              <h2 className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-4">Status</h2>
              <Badge variant={badgeVariant(order.status)} className="mb-5">{statusLabel[order.status]}</Badge>

              {order.status === 'processing' && (
                <MotionButton variant="accent" size="sm" className="w-full mb-5" onClick={() => setShipDialogOpen(true)}>
                  {t.admin.markShipped}
                </MotionButton>
              )}

              {order.status === 'shipped' && order.carrier && (
                <div className="space-y-2 mb-5 pb-5 border-b border-border">
                  <div>
                    <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{t.order.carrier}</p>
                    <p className="text-sm text-foreground mt-0.5">{order.carrier}</p>
                  </div>
                  {order.trackingNumber && (
                    <div>
                      <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{t.order.trackingNumber}</p>
                      <p className="text-sm text-foreground mt-0.5 font-mono-label">{order.trackingNumber}</p>
                    </div>
                  )}
                  {order.shippedDate && (
                    <div>
                      <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{t.order.shippedDate}</p>
                      <p className="text-sm text-foreground mt-0.5">{order.shippedDate}</p>
                    </div>
                  )}
                </div>
              )}

              <h3 className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-3">History</h3>
              <div className="space-y-3">
                {order.statusHistory.map((entry, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="w-2 h-2 rounded-full bg-accent mt-1 flex-shrink-0" />
                      {idx < order.statusHistory.length - 1 && (
                        <span className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>
                    <div className="pb-3">
                      <div className="font-mono-label text-xs uppercase tracking-widest text-foreground">{statusLabel[entry.status]}</div>
                      <div className="font-mono-label text-[11px] text-muted-foreground mt-0.5">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                      {entry.note && <div className="text-xs text-muted-foreground mt-0.5">{entry.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <Dialog
        open={shipDialogOpen}
        onClose={() => setShipDialogOpen(false)}
        title="Mark as Shipped"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <Input
            label="Shipping Carrier"
            placeholder="e.g. Australia Post Express"
            value={shipForm.carrier}
            onChange={(e) => setShipForm((f) => ({ ...f, carrier: e.target.value }))}
          />
          <Input
            label="Tracking Number"
            placeholder="e.g. EX1234567890AU"
            value={shipForm.trackingNumber}
            onChange={(e) => setShipForm((f) => ({ ...f, trackingNumber: e.target.value }))}
          />
          <Input
            label="Shipping Date"
            type="date"
            value={shipForm.shippedDate}
            onChange={(e) => setShipForm((f) => ({ ...f, shippedDate: e.target.value }))}
          />
        </div>
        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <MotionButton variant="accent" size="sm" onClick={confirmShipped}>
            Confirm
          </MotionButton>
          <MotionButton variant="ghost" size="sm" onClick={() => setShipDialogOpen(false)}>
            Cancel
          </MotionButton>
        </div>
      </Dialog>
    </>
  )
}

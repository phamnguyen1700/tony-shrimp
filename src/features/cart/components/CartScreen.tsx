import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import type { Translations } from '@/i18n'
import { shrimpImages } from '@/assets/images'
import { useCart } from '@/store/cartStore'
import MotionButton from '@/components/common/motion/MotionButton'
import { fadeUp, staggerContainer } from '@/lib/motionVariants'

interface Props {
  t: Translations
}

export default function Cart({ t }: Props) {
  const reduced = useReducedMotion()
  const { items, removeItem, updateQuantity, subtotal } = useCart()

  const shipping = items.length > 0 ? 15 : 0
  const total = subtotal + shipping

  return (
    <div className="pt-14 min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-12"
        >
          <p className="font-mono-label text-[11px] tracking-[0.22em] text-muted-foreground uppercase mb-2">
            TONY SHRIMP AUSTRALIA
          </p>
          <h1 className="font-display italic font-semibold text-5xl md:text-7xl text-foreground leading-none">
            {t.cart.title}
          </h1>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            className="py-24 text-center space-y-4"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-mono-label text-xs tracking-widest text-muted-foreground uppercase">{t.cart.empty}</p>
            <Link
              href="/shop"
              className="inline-block font-mono-label text-xs tracking-widest uppercase text-accent underline underline-offset-2 hover:text-accent/80 transition-colors"
            >
              {t.cart.continueShopping} →
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <motion.div
              className="flex-1 w-full"
              variants={reduced ? undefined : staggerContainer}
              initial={reduced ? false : 'hidden'}
              animate="visible"
            >
              <div className="border-b border-border pb-3 mb-4 hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-6 items-center">
                <p className="font-mono-label text-[11px] tracking-[0.16em] uppercase text-muted-foreground">ITEM</p>
                <p className="font-mono-label text-[11px] tracking-[0.16em] uppercase text-muted-foreground w-24 text-center">QTY</p>
                <p className="font-mono-label text-[11px] tracking-[0.16em] uppercase text-muted-foreground w-16 text-right">PRICE</p>
                <p className="font-mono-label text-[11px] tracking-[0.16em] uppercase text-muted-foreground w-4" />
              </div>

              <AnimatePresence initial={false}>
                {items.map(item => (
                  <motion.div
                    key={item.productId}
                    layout
                    variants={reduced ? undefined : fadeUp}
                    initial={reduced ? false : 'hidden'}
                    animate="visible"
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    className="grid grid-cols-[70px_1fr] md:grid-cols-[70px_1fr_auto_auto_auto] gap-4 md:gap-6 items-center py-5 border-b border-border"
                  >
                    <div className="w-[70px] h-[70px] bg-[#080b08] overflow-hidden shrink-0" style={{ borderRadius: 'var(--radius)' }}>
                      <img
                        src={shrimpImages[item.imageKey]}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-display italic font-semibold text-sm text-foreground hover:text-accent transition-colors block leading-snug"
                      >
                        {item.name}
                      </Link>
                      {item.grade && (
                        <p className="font-mono-label text-[11px] tracking-widest text-muted-foreground uppercase mt-0.5">{item.grade}</p>
                      )}
                      <p className="font-display text-sm font-medium text-foreground mt-1 md:hidden">A${item.price * item.quantity}</p>
                    </div>

                    <div className="hidden md:flex items-center border border-border w-24" style={{ borderRadius: 'var(--radius)' }}>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center font-mono-label text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center font-mono-label text-xs text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center font-mono-label text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="hidden md:block w-16 text-right">
                      <p className="font-display text-sm font-medium text-foreground">A${item.price * item.quantity}</p>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="hidden md:flex w-4 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={t.cart.remove}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    </button>

                    <div className="col-span-2 md:hidden flex items-center justify-between">
                      <div className="flex items-center border border-border" style={{ borderRadius: 'var(--radius)' }}>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center font-mono-label text-sm text-muted-foreground hover:text-foreground"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-mono-label text-xs text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center font-mono-label text-sm text-muted-foreground hover:text-foreground"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="font-mono-label text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                      >
                        {t.cart.remove}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="mt-6">
                <Link
                  href="/shop"
                  className="font-mono-label text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                >
                  ← {t.cart.continueShopping}
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="w-full lg:w-80 lg:sticky lg:top-24"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="border border-border p-6 space-y-4" style={{ borderRadius: 'var(--radius)' }}>
                <p className="font-mono-label text-xs tracking-[0.16em] uppercase text-foreground">ORDER SUMMARY</p>
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-body text-sm text-muted-foreground">{t.cart.subtotal}</p>
                    <p className="font-display text-sm font-medium text-foreground">A${subtotal}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-body text-sm text-muted-foreground">{t.cart.shipping}</p>
                    <p className="font-display text-sm font-medium text-foreground">A$15</p>
                  </div>
                </div>
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <p className="font-mono-label text-xs tracking-[0.16em] uppercase text-foreground">{t.cart.total}</p>
                  <p className="font-display text-xl font-semibold text-foreground">A${total}</p>
                </div>
                <MotionButton variant="accent" size="lg" className="w-full mt-2">
                  {t.cart.checkout}
                </MotionButton>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

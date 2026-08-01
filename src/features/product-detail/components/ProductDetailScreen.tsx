import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import type { Translations } from '@/i18n'
import { shrimpProducts } from '@/data/shrimp'
import { shrimpImages } from '@/assets/images'
import { useCart } from '@/store/cartStore'
import Badge, { StatusDot } from '@/shared/ui/Badge'
import MotionButton from '@/components/common/motion/MotionButton'
import { fadeUp, staggerContainer, fadeIn } from '@/lib/motionVariants'

interface Props {
  t: Translations
  slug: string
}

function AccordionSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-border">
      <button
        className="w-full flex items-center justify-between py-4 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-mono-label text-[10px] tracking-[0.2em] uppercase text-foreground">{title}</span>
        <span className="font-mono-label text-base text-muted-foreground leading-none select-none">{open ? '−' : '+'}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm text-muted-foreground font-body leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProductDetail({ t, slug }: Props) {
  const reduced = useReducedMotion()
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)

  const productFound = shrimpProducts.find(s => s.slug === slug)

  if (!productFound) {
    return (
      <div className="pt-14 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-mono-label text-[10px] tracking-widest text-muted-foreground uppercase">Product not found</p>
          <Link href="/shop" className="font-mono-label text-[10px] tracking-widest uppercase text-accent underline underline-offset-2">
            ← Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const product = productFound!
  const productIndex = shrimpProducts.findIndex(s => s.slug === slug)
  const totalProducts = shrimpProducts.length

  function getStatusVariant(status: string): 'inStock' | 'lowStock' | 'outOfStock' {
    if (status === 'in-stock') return 'inStock'
    if (status === 'low-stock') return 'lowStock'
    return 'outOfStock'
  }

  function getStatusLabel(status: string) {
    if (status === 'in-stock') return t.product.inStock
    if (status === 'low-stock') return t.product.lowStock
    return t.product.outOfStock
  }

  function handleAddToCart() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      grade: product.grade,
      imageKey: product.imageKey,
      price: product.price,
    }, qty)
  }

  const wp = product.waterParams

  return (
    <div className="pt-14 min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <motion.div
          className="grid md:grid-cols-2 gap-8 md:gap-16"
          variants={reduced ? undefined : staggerContainer}
          initial={reduced ? false : 'hidden'}
          animate="visible"
        >
          <motion.div
            className="bg-[#080b08] aspect-[4/3] md:aspect-auto md:min-h-[520px] flex items-center justify-center overflow-hidden sticky md:top-20"
            variants={reduced ? undefined : fadeIn}
            transition={{ duration: 0.5 }}
          >
            <img
              src={shrimpImages[product.imageKey]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </motion.div>

          <motion.div
            className="space-y-6"
            variants={reduced ? undefined : staggerContainer}
            initial={reduced ? false : 'hidden'}
            animate="visible"
          >
            <motion.div variants={reduced ? undefined : fadeUp}>
              <p className="font-mono-label text-[9px] tracking-[0.3em] text-muted-foreground uppercase mb-3">
                {String(productIndex + 1).padStart(2, '0')} / {String(totalProducts).padStart(2, '0')}
              </p>
              <h1 className="font-display italic font-semibold text-4xl md:text-5xl text-foreground leading-tight">
                {product.nameParts.map((part, i) => (
                  <span key={i} className="block">{part}</span>
                ))}
              </h1>
              <p className="font-mono-label text-[9px] tracking-[0.3em] text-muted-foreground uppercase mt-2">
                {product.classification}
              </p>
            </motion.div>

            <motion.div variants={reduced ? undefined : fadeUp} className="flex items-center gap-3 flex-wrap">
              {product.grade && <Badge variant="accent">{product.grade}</Badge>}
              {(product.specialTraits ?? []).map(trait => (
                <Badge key={trait} variant="muted">{trait}</Badge>
              ))}
              <Badge variant="muted">{product.type}</Badge>
            </motion.div>

            <motion.div variants={reduced ? undefined : fadeUp}>
              <p className="font-mono-label text-[9px] tracking-widest text-muted-foreground uppercase mb-1">{t.product.from}</p>
              <p className="font-display font-semibold text-4xl text-foreground">A${product.price}</p>
            </motion.div>

            <motion.div variants={reduced ? undefined : fadeUp} className="flex items-center gap-2">
              <StatusDot status={product.status} />
              <Badge variant={getStatusVariant(product.status)}>{getStatusLabel(product.status)}</Badge>
              {product.status !== 'out-of-stock' && (
                <span className="font-mono-label text-[9px] tracking-widest text-muted-foreground">{product.quantity} available</span>
              )}
            </motion.div>

            <motion.div variants={reduced ? undefined : fadeUp} className="space-y-3">
              <p className="font-mono-label text-[9px] tracking-[0.2em] uppercase text-muted-foreground">{t.product.quantity}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border" style={{ borderRadius: 'var(--radius)' }}>
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center font-mono-label text-base text-muted-foreground hover:text-foreground transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-mono-label text-sm text-foreground">{qty}</span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center font-mono-label text-base text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <MotionButton
                variant="accent"
                size="lg"
                className="w-full"
                disabled={product.status === 'out-of-stock'}
                onClick={handleAddToCart}
              >
                {t.product.addToCart}
              </MotionButton>
            </motion.div>

            <motion.div variants={reduced ? undefined : fadeUp}>
              <div className="border-t border-border pt-6 space-y-4">
                <p className="font-mono-label text-[9px] tracking-[0.2em] uppercase text-muted-foreground">{t.product.waterParams}</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {[
                    { label: t.product.temperature, value: `${wp.tempMin}–${wp.tempMax}°C` },
                    { label: t.product.ph, value: `${wp.phMin}–${wp.phMax}` },
                    { label: t.product.gh, value: `${wp.ghMin}–${wp.ghMax} dGH` },
                    { label: t.product.kh, value: `${wp.khMin}–${wp.khMax} dKH` },
                    { label: t.product.tds, value: `${wp.tdsMin}–${wp.tdsMax} ppm` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="font-mono-label text-[9px] tracking-widest text-muted-foreground uppercase">{label}</p>
                      <p className="font-mono-label text-xs text-foreground mt-0.5">{value}</p>
                    </div>
                  ))}
                  <div>
                    <p className="font-mono-label text-[9px] tracking-widest text-muted-foreground uppercase">{t.product.careLevel}</p>
                    <Badge variant={product.careLevel === 'Beginner' ? 'inStock' : product.careLevel === 'Intermediate' ? 'lowStock' : 'outOfStock'} className="mt-0.5">
                      {product.careLevel}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={reduced ? undefined : fadeUp} className="space-y-0">
              <AccordionSection title={t.product.description}>
                <p>{product.description}</p>
                {product.traits.length > 0 && (
                  <ul className="mt-3 space-y-1 list-disc list-inside">
                    {product.traits.map(trait => (
                      <li key={trait}>{trait}</li>
                    ))}
                  </ul>
                )}
              </AccordionSection>
              <AccordionSection title={t.product.shipping}>
                <p>
                  All shrimp are shipped live via Australia Post Express Post or StarTrack overnight courier. Orders are dispatched Monday to Wednesday to ensure safe arrival. A flat shipping rate of A$15 applies to all orders Australia-wide.
                </p>
              </AccordionSection>
              <AccordionSection title={t.product.doaPolicy}>
                <p>
                  We guarantee live arrival on all orders. If any shrimp arrive deceased, please photograph the unopened bag within 2 hours of delivery and contact us. We will arrange a replacement or refund. Our DOA policy does not cover transit delays outside our control.
                </p>
              </AccordionSection>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

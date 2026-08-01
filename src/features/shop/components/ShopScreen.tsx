import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import type { Translations } from '@/i18n'
import { shrimpProducts } from '@/data/shrimp'
import { shrimpImages } from '@/assets/images'
import { useCart } from '@/store/cartStore'
import Badge, { StatusDot } from '@/shared/ui/Badge'
import MotionButton from '@/components/common/motion/MotionButton'
import { fadeUp, staggerContainer, bottomSheetSlide } from '@/lib/motionVariants'

interface Props {
  t: Translations
}

interface Filters {
  types: string[]
  colours: string[]
  lines: string[]
  specialTraits: string[]
  availability: string[]
}

const COLOURS = ['Red', 'Blue', 'Yellow', 'Orange', 'Black', 'White']
const LINES = ['Boa', 'Galaxy', 'Snowflake', 'Fancy Tiger', 'Dragon', 'Metallic', 'Devil']
const SPECIAL_TRAITS = ['Orange Eye']

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <span
        className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors ${checked ? 'bg-accent border-accent' : 'border-border bg-transparent'}`}
        style={{ borderRadius: '2px' }}
        aria-hidden
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="var(--accent-foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className="font-mono-label text-[11px] tracking-widest text-foreground/70 group-hover:text-foreground transition-colors">
        {label}
      </span>
    </label>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="font-mono-label text-[9px] tracking-[0.2em] text-muted-foreground uppercase">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function FilterPanel({ filters, setFilters, t }: { filters: Filters; setFilters: React.Dispatch<React.SetStateAction<Filters>>; t: Translations }) {
  function toggle(key: keyof Filters, value: string) {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter(v => v !== value) : [...prev[key], value],
    }))
  }

  return (
    <div className="space-y-5">
      <FilterSection title={t.shop.type}>
        {(['Caridina', 'Neocaridina'] as const).map(type => (
          <FilterCheckbox key={type} label={type} checked={filters.types.includes(type)} onChange={() => toggle('types', type)} />
        ))}
      </FilterSection>
      <FilterSection title={t.shop.colour}>
        {COLOURS.map(c => (
          <FilterCheckbox key={c} label={c} checked={filters.colours.includes(c)} onChange={() => toggle('colours', c)} />
        ))}
      </FilterSection>
      <FilterSection title={t.shop.linePattern}>
        {LINES.map(l => (
          <FilterCheckbox key={l} label={l} checked={filters.lines.includes(l)} onChange={() => toggle('lines', l)} />
        ))}
      </FilterSection>
      <FilterSection title={t.shop.specialTrait}>
        {SPECIAL_TRAITS.map(st => (
          <FilterCheckbox key={st} label={st} checked={filters.specialTraits.includes(st)} onChange={() => toggle('specialTraits', st)} />
        ))}
      </FilterSection>
      <FilterSection title={t.shop.availability}>
        <FilterCheckbox label={t.shop.inStock} checked={filters.availability.includes('in-stock')} onChange={() => toggle('availability', 'in-stock')} />
        <FilterCheckbox label={t.shop.outOfStock} checked={filters.availability.includes('out-of-stock')} onChange={() => toggle('availability', 'out-of-stock')} />
      </FilterSection>
    </div>
  )
}

function activeFilterCount(filters: Filters) {
  return filters.types.length + filters.colours.length + filters.lines.length + filters.specialTraits.length + filters.availability.length
}

export default function Shop({ t }: Props) {
  const reduced = useReducedMotion()
  const { addItem } = useCart()
  const [filters, setFilters] = useState<Filters>({ types: [], colours: [], lines: [], specialTraits: [], availability: [] })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filterCount = activeFilterCount(filters)

  const filtered = shrimpProducts.filter(p => {
    if (filters.types.length && !filters.types.includes(p.type)) return false
    if (filters.colours.length && !filters.colours.some(c => p.colors.some(pc => pc.toLowerCase().includes(c.toLowerCase())))) return false
    if (filters.lines.length && !filters.lines.some(l => p.lines.some(pl => pl.toLowerCase().includes(l.toLowerCase())))) return false
    if (filters.specialTraits.length && !(p.specialTraits ?? []).some(st => filters.specialTraits.some(f => st.toLowerCase().includes(f.toLowerCase())))) return false
    if (filters.availability.length) {
      const available = filters.availability.includes('in-stock') || filters.availability.includes('low-stock')
      const outOf = filters.availability.includes('out-of-stock')
      const isAvailable = p.status === 'in-stock' || p.status === 'low-stock'
      if (available && !outOf && !isAvailable) return false
      if (!available && outOf && p.status !== 'out-of-stock') return false
    }
    return true
  })

  function clearAll() {
    setFilters({ types: [], colours: [], lines: [], specialTraits: [], availability: [] })
  }

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

  return (
    <div className="pt-14 min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <motion.div
          className="py-10 md:py-14"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono-label text-[9px] tracking-[0.3em] text-muted-foreground uppercase mb-2">
            TONY SHRIMP AUSTRALIA
          </p>
          <h1 className="font-display italic font-semibold text-5xl md:text-7xl text-foreground leading-none">
            {t.shop.title}
          </h1>
        </motion.div>

        <div className="hidden md:flex items-start gap-8 pb-6 border-b border-border">
          <div className="flex-1 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <p className="font-mono-label text-[9px] tracking-[0.2em] text-muted-foreground uppercase">{t.shop.type}:</p>
              {(['Caridina', 'Neocaridina'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    types: prev.types.includes(type) ? prev.types.filter(v => v !== type) : [...prev.types, type],
                  }))}
                  className={`font-mono-label text-[10px] tracking-widest px-2.5 py-1 border transition-colors ${filters.types.includes(type) ? 'border-accent text-accent bg-accent/8' : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'}`}
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <p className="font-mono-label text-[9px] tracking-[0.2em] text-muted-foreground uppercase">{t.shop.colour}:</p>
              {COLOURS.map(c => (
                <button
                  key={c}
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    colours: prev.colours.includes(c) ? prev.colours.filter(v => v !== c) : [...prev.colours, c],
                  }))}
                  className={`font-mono-label text-[10px] tracking-widest px-2.5 py-1 border transition-colors ${filters.colours.includes(c) ? 'border-accent text-accent bg-accent/8' : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'}`}
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          {filterCount > 0 && (
            <button
              onClick={clearAll}
              className="font-mono-label text-[10px] tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors shrink-0"
            >
              {t.shop.clearAll}
            </button>
          )}
        </div>

        <div className="md:hidden flex items-center justify-between py-4 border-b border-border">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 font-mono-label text-[10px] tracking-widest text-foreground uppercase"
          >
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 1H13M3 5H11M5 9H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {t.shop.showFilters}
            {filterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-accent text-accent-foreground text-[9px] flex items-center justify-center">
                {filterCount}
              </span>
            )}
          </button>
          {filterCount > 0 && (
            <button onClick={clearAll} className="font-mono-label text-[10px] tracking-widest text-muted-foreground underline">
              {t.shop.clearAll}
            </button>
          )}
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 py-8"
          variants={reduced ? undefined : staggerContainer}
          initial={reduced ? false : 'hidden'}
          animate="visible"
        >
          {filtered.map(product => (
            <motion.div
              key={product.id}
              variants={reduced ? undefined : fadeUp}
              layout
              className="group relative"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative overflow-hidden bg-[#080b08] aspect-[4/3]">
                  <img
                    src={shrimpImages[product.imageKey]}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <AnimatePresence>
                    {hoveredId === product.id && (
                      <motion.div
                        className="absolute inset-x-0 bottom-0 p-3 hidden md:flex"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.18 }}
                      >
                        <button
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (product.status !== 'out-of-stock') {
                              addItem({
                                productId: product.id,
                                slug: product.slug,
                                name: product.name,
                                grade: product.grade,
                                imageKey: product.imageKey,
                                price: product.price,
                              })
                            }
                          }}
                          disabled={product.status === 'out-of-stock'}
                          className="w-full py-2 font-mono-label text-[9px] tracking-[0.2em] uppercase bg-accent text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ borderRadius: 'var(--radius)' }}
                        >
                          {t.product.addToCart}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="pt-3 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-display italic font-semibold text-sm text-foreground leading-snug">{product.name}</h2>
                  </div>
                  <p className="font-mono-label text-[9px] tracking-widest text-muted-foreground uppercase">{product.classification}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-display text-sm font-medium text-foreground">A${product.price}</p>
                    <span className="flex items-center gap-1">
                      <StatusDot status={product.status} />
                      <Badge variant={getStatusVariant(product.status)}>{getStatusLabel(product.status)}</Badge>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-mono-label text-[10px] tracking-widest text-muted-foreground uppercase">No shrimp match your filters.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 bg-card border-t border-border rounded-t-2xl md:hidden overflow-y-auto"
              style={{ maxHeight: '85vh' }}
              variants={bottomSheetSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <p className="font-mono-label text-[10px] tracking-[0.2em] uppercase text-foreground">{t.shop.filters}</p>
                  <button onClick={() => setMobileFiltersOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <FilterPanel filters={filters} setFilters={setFilters} t={t} />
                <div className="mt-6 flex gap-3">
                  {filterCount > 0 && (
                    <button
                      onClick={() => { clearAll(); setMobileFiltersOpen(false) }}
                      className="flex-1 py-3 font-mono-label text-[10px] tracking-widest uppercase border border-border text-muted-foreground hover:text-foreground transition-colors"
                      style={{ borderRadius: 'var(--radius)' }}
                    >
                      {t.shop.clearAll}
                    </button>
                  )}
                  <MotionButton variant="accent" size="md" className="flex-1" onClick={() => setMobileFiltersOpen(false)}>
                    SHOW {filtered.length} RESULTS
                  </MotionButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

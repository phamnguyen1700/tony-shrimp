import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import type { Translations, Lang } from '@/i18n'
import type { ThemeMode } from '@/hooks/useTheme'
import AdminDataTable, { type AdminDataTableColumn } from '@/components/common/table/AdminDataTable'
import Badge from '@/components/ui/Badge'
import MotionButton from '@/components/common/motion/MotionButton'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { getShrimpImage } from '@/assets/images'
import { shrimpProducts } from '@/data/shrimp'
import { fadeUp, fadeIn, modalScale, staggerContainer, staggerFast } from '@/lib/motionVariants'
import { gradeBadgeClass, rarityBadgeClass, traitBadgeClass } from '@/lib/shrimpBadgeStyles'

interface Props {
  t: Translations
  theme: ThemeMode
  setTheme: (m: ThemeMode) => void
  lang: Lang
  setLang: (l: Lang) => void
}

const colorTokens = [
  { name: 'background', var: '--background' },
  { name: 'foreground', var: '--foreground' },
  { name: 'card', var: '--card' },
  { name: 'primary', var: '--primary' },
  { name: 'secondary', var: '--secondary' },
  { name: 'muted', var: '--muted' },
  { name: 'accent', var: '--accent' },
  { name: 'border', var: '--border' },
]

const sections = ['Colors', 'Typography', 'Buttons', 'Badges', 'Forms', 'Product Card', 'Admin Table', 'Status', 'Spacing', 'Motion']

const spacingScale = [2, 4, 8, 12, 16, 24, 32, 48, 64]

interface AdminTableDemoRow {
  id: string
  name: string
  species: string
  type: string
  imageKey: string
}

const adminTableDemoRows: AdminTableDemoRow[] = [
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    species: 'Neocaridina',
    type: 'Ocean',
    imageKey: 'ocean-blue',
  },
]

function sectionId(section: string) {
  return section.toLowerCase().replace(/\s+/g, '-')
}

function ColorSwatch({ name, cssVar }: { name: string; cssVar: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="w-full h-14 border border-border"
        style={{ backgroundColor: `var(${cssVar})`, borderRadius: 'var(--radius-sm)' }}
      />
      <div className="font-mono-label text-xs uppercase tracking-widest text-foreground">{name}</div>
      <div className="font-mono-label text-[11px] text-muted-foreground">{cssVar}</div>
    </div>
  )
}

function SectionAnchor({ id }: { id: string }) {
  return <div id={id} className="scroll-mt-16" />
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-6 pb-3 border-b border-border">
      {children}
    </h2>
  )
}

export default function DesignSystem({ t, theme, setTheme, lang, setLang }: Props) {
  const reduced = useReducedMotion()
  const [motionFadeVisible, setMotionFadeVisible] = useState(false)
  const [motionSlideVisible, setMotionSlideVisible] = useState(false)
  const [motionScaleVisible, setMotionScaleVisible] = useState(false)

  const sampleProducts = shrimpProducts.slice(0, 2)
  const adminTableDemoColumns: AdminDataTableColumn<AdminTableDemoRow>[] = [
    {
      key: 'name',
      header: 'Name',
      className: 'admin-data-name-cell',
      render: (row) => (
        <>
          <div className="text-sm font-body text-foreground">{row.name}</div>
          <div className="mt-0.5 font-mono-label text-xs text-muted-foreground">{row.species}</div>
        </>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      align: 'center',
      className: 'admin-data-type-cell',
      render: (row) => row.type,
    },
    {
      key: 'badges',
      header: 'Badges',
      className: 'admin-data-badge-cell',
      render: () => (
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="accent" className={gradeBadgeClass('SS')}>SS</Badge>
          <Badge variant="muted" className={rarityBadgeClass('Rare')}>Rare</Badge>
          <Badge variant="muted" className={traitBadgeClass('Galaxy')}>Galaxy</Badge>
          <Badge variant="muted">Blue</Badge>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      align: 'center',
      className: 'min-w-[130px]',
      render: () => (
        <button className="font-mono-label text-xs uppercase tracking-widest text-accent hover:underline">
          View Prices
        </button>
      ),
    },
    {
      key: 'available',
      header: 'Available',
      align: 'center',
      className: 'min-w-[110px]',
      render: () => <Badge variant="inStock">Yes</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      className: 'min-w-[120px]',
      render: () => <Badge variant="default">Active</Badge>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      className: 'admin-data-action-cell',
      render: () => (
        <div className="flex items-center justify-center gap-3">
          <button className="font-mono-label text-xs uppercase tracking-widest text-accent hover:underline">Edit</button>
          <button className="font-mono-label text-xs uppercase tracking-widest text-red-500 hover:underline">Deactivate</button>
        </div>
      ),
    },
    {
      key: 'image',
      header: 'Primary Image',
      align: 'center',
      className: 'admin-data-image-cell',
      render: (row) => (
        <div className="admin-image-slots">
          <div className="admin-image-slot">
            <img src={getShrimpImage(row.imageKey)} alt={row.name} className="h-full w-full object-cover" />
          </div>
          <div className="admin-image-slot-empty">+</div>
          <div className="admin-image-slot-empty">+</div>
          <div className="admin-image-slot-empty">+</div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-20 flex items-center justify-between px-6">
        <div className="font-mono-label text-xs uppercase tracking-widest text-foreground">
          TONY SHRIMP · DESIGN SYSTEM
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {(['light', 'dark', 'system'] as ThemeMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setTheme(m)}
                className={`px-2.5 py-1 font-mono-label text-[11px] uppercase tracking-widest transition-colors border
                  ${theme === m
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'bg-transparent text-muted-foreground border-border hover:text-foreground'
                  }`}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {(['en', 'vi'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 font-mono-label text-[11px] uppercase tracking-widest transition-colors border
                  ${lang === l
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'bg-transparent text-muted-foreground border-border hover:text-foreground'
                  }`}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        <aside className="hidden lg:flex flex-col w-44 sticky top-14 self-start h-[calc(100vh-3.5rem)] border-r border-border py-6 px-4 gap-1">
          {sections.map((s) => (
            <a
              key={s}
              href={`#${sectionId(s)}`}
              className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground hover:text-accent py-1.5 transition-colors"
            >
              {s}
            </a>
          ))}
        </aside>

        <main className="flex-1 max-w-4xl px-6 lg:px-10 py-10 space-y-16">

          <section>
            <SectionAnchor id="colors" />
            <SectionTitle>Colors</SectionTitle>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
              {colorTokens.map((ct) => (
                <ColorSwatch key={ct.var} name={ct.name} cssVar={ct.var} />
              ))}
            </div>
          </section>

          <section>
            <SectionAnchor id="typography" />
            <SectionTitle>Typography</SectionTitle>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="font-display text-6xl italic text-foreground leading-none">Fraunces</div>
                <div className="font-display text-4xl font-semibold text-foreground">Display Heading</div>
                <div className="font-display text-3xl text-foreground">H1 · Section Title</div>
                <div className="font-display text-2xl text-foreground">H2 · Subsection</div>
                <div className="font-display text-xl text-foreground">H3 · Card Heading</div>
                <div className="font-display text-lg text-foreground">H4 · Minor Heading</div>
              </div>
              <div className="space-y-3 pt-4 border-t border-border">
                <p className="font-body text-base text-foreground">Body text · DM Sans regular · The quick brown fox jumps over the lazy dog.</p>
                <p className="font-body text-sm text-muted-foreground">Small body · muted foreground · Supporting detail text appears here.</p>
                <p className="font-body text-xs text-muted-foreground">Caption · extra small · Metadata and supplementary information.</p>
              </div>
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="font-mono-label text-xs uppercase tracking-widest text-foreground">MONO LABEL · DM MONO · UPPERCASE</div>
                <div className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">SMALL LABEL · SECTION HEADER · METADATA</div>
                <div className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">MICRO LABEL · TABLE HEADERS · TIMESTAMPS</div>
              </div>
              <div className="space-y-3 pt-4 border-t border-border">
                <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-2">Vietnamese samples</p>
                <div className="font-display text-2xl text-foreground">Cửa hàng · Giỏ hàng · Tài khoản</div>
                <div className="font-body text-sm text-muted-foreground">Đang xử lý · Đã gửi · Đã giao · Đã huỷ</div>
                <div className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">ĐƠN HÀNG · SẢN PHẨM · KHÁCH HÀNG</div>
              </div>
            </div>
          </section>

          <section>
            <SectionAnchor id="buttons" />
            <SectionTitle>Buttons</SectionTitle>
            <div className="space-y-6">
              {(['primary', 'secondary', 'ghost', 'accent'] as const).map((variant) => (
                <div key={variant} className="flex flex-wrap items-center gap-3">
                  <span className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground w-20">{variant}</span>
                  <MotionButton variant={variant} size="sm">Small</MotionButton>
                  <MotionButton variant={variant} size="md">Medium</MotionButton>
                  <MotionButton variant={variant} size="lg">Large</MotionButton>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionAnchor id="badges" />
            <SectionTitle>Badges</SectionTitle>
            <div className="flex flex-wrap gap-3">
              <Badge variant="inStock">In Stock</Badge>
              <Badge variant="lowStock">Low Stock</Badge>
              <Badge variant="outOfStock">Out of Stock</Badge>
              <Badge variant="processing">Processing</Badge>
              <Badge variant="shipped">Shipped</Badge>
              <Badge variant="delivered">Delivered</Badge>
              <Badge variant="cancelled">Cancelled</Badge>
              <Badge variant="default">Default</Badge>
              <Badge variant="accent">Accent</Badge>
              <Badge variant="muted">Muted</Badge>
              <Badge variant="accent" className={gradeBadgeClass('S')}>S</Badge>
              <Badge variant="accent" className={gradeBadgeClass('SS')}>SS</Badge>
              <Badge variant="accent" className={gradeBadgeClass('SSS')}>SSS</Badge>
              <Badge variant="muted" className={traitBadgeClass('Galaxy')}>Galaxy</Badge>
              <Badge variant="muted" className={rarityBadgeClass('Common')}>Common</Badge>
              <Badge variant="muted" className={rarityBadgeClass('Rare')}>Rare</Badge>
              <Badge variant="muted" className={rarityBadgeClass('Extremely Rare')}>Extremely Rare</Badge>
            </div>
          </section>

          <section>
            <SectionAnchor id="forms" />
            <SectionTitle>Forms</SectionTitle>
            <div className="max-w-sm space-y-5">
              <Input label="Default Input" placeholder="Placeholder text..." />
              <Input label="With value" defaultValue="Tony Shrimp" />
              <Input label="With error" defaultValue="bad@" error="Please enter a valid email address." />
              <Select
                label="Select"
                options={[
                  { value: '', label: 'Choose an option...' },
                  { value: 'caridina', label: 'Caridina' },
                  { value: 'neocaridina', label: 'Neocaridina' },
                ]}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono-label uppercase tracking-widest text-muted-foreground">Textarea</label>
                <textarea
                  rows={3}
                  placeholder="Enter description..."
                  className="w-full px-3 py-2.5 text-sm font-body bg-card border border-border text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none"
                  style={{ borderRadius: 'var(--radius)' }}
                />
              </div>
            </div>
          </section>

          <section>
            <SectionAnchor id="product-card" />
            <SectionTitle>Product Card</SectionTitle>
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              {sampleProducts.map((p) => (
                <div key={p.id} className="bg-card border border-border overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={getShrimpImage(p.imageKey)}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="font-display text-sm text-foreground leading-tight mb-1">{p.name}</div>
                    {p.grade && (
                      <div className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground mb-2">{p.grade}</div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-foreground">A${p.price}</span>
                      <Badge variant={p.status === 'in-stock' ? 'inStock' : p.status === 'low-stock' ? 'lowStock' : 'outOfStock'}>
                        {p.status === 'in-stock' ? 'In Stock' : p.status === 'low-stock' ? 'Low' : 'Out'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionAnchor id="admin-table" />
            <SectionTitle>Admin Table</SectionTitle>
            <AdminDataTable
              rows={adminTableDemoRows}
              columns={adminTableDemoColumns}
              getRowKey={(row) => row.id}
              emptyText="No rows"
              pageSize={10}
              minWidth="1480px"
            />
          </section>

          <section>
            <SectionAnchor id="status" />
            <SectionTitle>Status</SectionTitle>
            <div className="max-w-sm space-y-0">
              {(['processing', 'shipped', 'delivered'] as const).map((status, idx, arr) => (
                <div key={status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-accent' : 'bg-muted-foreground'}`} />
                    {idx < arr.length - 1 && <span className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-6">
                    <div className="font-mono-label text-xs uppercase tracking-widest text-foreground">{status}</div>
                    <div className="font-mono-label text-[11px] text-muted-foreground mt-0.5">
                      {idx === 0 ? '28 Jul 2026' : idx === 1 ? '29 Jul 2026' : '31 Jul 2026'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {idx === 0 ? 'Order received and being prepared' : idx === 1 ? 'Shipped via Australia Post Express' : 'Delivered to recipient'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionAnchor id="spacing" />
            <SectionTitle>Spacing</SectionTitle>
            <div className="space-y-3">
              {spacingScale.map((px) => (
                <div key={px} className="flex items-center gap-4">
                  <div className="font-mono-label text-xs text-muted-foreground w-10 text-right">{px}px</div>
                  <div
                    className="bg-accent/30 border border-accent/40 h-4"
                    style={{ width: `${px}px`, borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionAnchor id="motion" />
            <SectionTitle>Motion</SectionTitle>
            <div className="space-y-8">
              <div className="flex flex-wrap gap-3 items-center">
                <MotionButton variant="secondary" size="sm" onClick={() => setMotionFadeVisible((v) => !v)}>
                  Toggle Fade In
                </MotionButton>
                <AnimatePresence>
                  {motionFadeVisible && (
                    <motion.div
                      variants={reduced ? undefined : fadeIn}
                      initial={reduced ? undefined : 'hidden'}
                      animate={reduced ? undefined : 'visible'}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="px-4 py-2 bg-accent/10 border border-accent/20 text-accent font-mono-label text-xs uppercase tracking-widest"
                      style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                      Fade In Element
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <MotionButton variant="secondary" size="sm" onClick={() => setMotionSlideVisible((v) => !v)}>
                  Toggle Slide Up
                </MotionButton>
                <AnimatePresence>
                  {motionSlideVisible && (
                    <motion.div
                      variants={reduced ? undefined : fadeUp}
                      initial={reduced ? undefined : 'hidden'}
                      animate={reduced ? undefined : 'visible'}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="px-4 py-2 bg-primary text-primary-foreground font-mono-label text-xs uppercase tracking-widest"
                      style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                      Slide Up Element
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <MotionButton variant="secondary" size="sm" onClick={() => setMotionScaleVisible((v) => !v)}>
                  Toggle Scale
                </MotionButton>
                <AnimatePresence>
                  {motionScaleVisible && (
                    <motion.div
                      variants={reduced ? undefined : modalScale}
                      initial={reduced ? undefined : 'hidden'}
                      animate={reduced ? undefined : 'visible'}
                      exit={reduced ? { opacity: 0 } : 'exit'}
                      className="px-4 py-2 bg-secondary border border-border text-foreground font-mono-label text-xs uppercase tracking-widest"
                      style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                      Scale Element
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground mb-4">Stagger Demo</p>
                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={reduced ? undefined : staggerFast}
                  initial={reduced ? undefined : 'hidden'}
                  animate={reduced ? undefined : 'visible'}
                >
                  {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'].map((label) => (
                    <motion.div
                      key={label}
                      variants={reduced ? undefined : fadeUp}
                      className="px-3 py-1.5 bg-muted font-mono-label text-xs uppercase tracking-widest text-muted-foreground"
                      style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                      {label}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}

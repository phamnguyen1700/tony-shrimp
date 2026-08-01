import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { Translations } from '@/i18n'
import type { ShrimpProduct, ShrimpStatus } from '@/data/shrimp'
import { shrimpProducts as initialProducts } from '@/data/shrimp'
import { shrimpImages } from '@/assets/images'
import AdminLayout from './AdminLayout'
import Badge from '@/components/ui/Badge'
import MotionButton from '@/components/motion/MotionButton'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { staggerContainer, fadeUp } from '@/lib/motionVariants'

interface Props {
  t: Translations
}

const statusBadgeVariant = (s: ShrimpStatus) => {
  if (s === 'in-stock') return 'inStock'
  if (s === 'low-stock') return 'lowStock'
  return 'outOfStock'
}

const statusLabel: Record<ShrimpStatus, string> = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
}

interface FormState {
  name: string
  type: string
  lines: string
  colors: string
  grade: string
  price: string
  quantity: string
  description: string
  careLevel: string
  status: string
  featured: boolean
}

const emptyForm: FormState = {
  name: '',
  type: 'Caridina',
  lines: '',
  colors: '',
  grade: '',
  price: '',
  quantity: '',
  description: '',
  careLevel: 'Beginner',
  status: 'in-stock',
  featured: false,
}

export default function ShrimpAdmin({ t }: Props) {
  const reduced = useReducedMotion()
  const [products, setProducts] = useState<ShrimpProduct[]>(initialProducts)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  const openEdit = (p: ShrimpProduct) => {
    setEditingId(p.id)
    setForm({
      name: p.name,
      type: p.type,
      lines: p.lines.join(', '),
      colors: p.colors.join(', '),
      grade: p.grade ?? '',
      price: String(p.price),
      quantity: String(p.quantity),
      description: p.description,
      careLevel: p.careLevel,
      status: p.status,
      featured: p.featured,
    })
    setFormOpen(true)
  }

  const saveForm = () => {
    if (editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: form.name,
                type: form.type as ShrimpProduct['type'],
                lines: form.lines.split(',').map((s) => s.trim()).filter(Boolean),
                colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
                grade: form.grade || undefined,
                price: parseFloat(form.price) || p.price,
                quantity: parseInt(form.quantity) || p.quantity,
                description: form.description,
                careLevel: form.careLevel as ShrimpProduct['careLevel'],
                status: form.status as ShrimpStatus,
                featured: form.featured,
              }
            : p
        )
      )
    } else {
      const newProduct: ShrimpProduct = {
        id: String(Date.now()),
        slug: form.name.toLowerCase().replace(/\s+/g, '-'),
        name: form.name,
        nameParts: form.name.split(' '),
        classification: form.type,
        type: form.type as ShrimpProduct['type'],
        lines: form.lines.split(',').map((s) => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
        grade: form.grade || undefined,
        price: parseFloat(form.price) || 0,
        status: form.status as ShrimpStatus,
        quantity: parseInt(form.quantity) || 0,
        description: form.description,
        careLevel: form.careLevel as ShrimpProduct['careLevel'],
        waterParams: { tempMin: 22, tempMax: 26, phMin: 6.0, phMax: 7.5, ghMin: 4, ghMax: 8, khMin: 0, khMax: 2, tdsMin: 100, tdsMax: 200 },
        imageKey: 'red-boa',
        featured: form.featured,
        traits: [],
        number: String(products.length + 1).padStart(3, '0'),
        specialTraits: [],
      }
      setProducts((prev) => [newProduct, ...prev])
    }
    setFormOpen(false)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget))
      setDeleteTarget(null)
    }
  }

  return (
    <AdminLayout t={t} activeRoute="/admin/shrimp">
      <div className="p-6 md:p-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">{t.admin.shrimp}</h1>
          <MotionButton variant="accent" size="sm" onClick={openAdd}>
            {t.admin.addShrimp}
          </MotionButton>
        </div>

        <div className="hidden md:block bg-card border border-border overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['', 'Name', 'Type', 'Price', 'Qty', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
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
              {products.map((p) => (
                <motion.tr
                  key={p.id}
                  variants={reduced ? undefined : fadeUp}
                  className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <img
                      src={shrimpImages[p.imageKey]}
                      alt={p.name}
                      className="w-10 h-10 object-cover"
                      style={{ borderRadius: 'var(--radius-sm)' }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-body text-foreground">{p.name}</div>
                    {p.grade && <div className="font-mono-label text-[10px] text-muted-foreground mt-0.5">{p.grade}</div>}
                  </td>
                  <td className="px-4 py-3 font-mono-label text-xs text-muted-foreground">{p.type}</td>
                  <td className="px-4 py-3 text-sm text-foreground">A${p.price}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{p.quantity}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusBadgeVariant(p.status)}>{statusLabel[p.status]}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEdit(p)}
                        className="font-mono-label text-[10px] uppercase tracking-widest text-accent hover:underline"
                      >
                        {t.admin.editShrimp}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p.id)}
                        className="font-mono-label text-[10px] uppercase tracking-widest text-red-500 hover:underline"
                      >
                        {t.admin.deleteShrimp}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
          {products.map((p) => (
            <div key={p.id} className="bg-card border border-border p-4 flex gap-3" style={{ borderRadius: 'var(--radius)' }}>
              <img
                src={shrimpImages[p.imageKey]}
                alt={p.name}
                className="w-14 h-14 object-cover flex-shrink-0"
                style={{ borderRadius: 'var(--radius-sm)' }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-body text-foreground">{p.name}</div>
                    <div className="font-mono-label text-[10px] text-muted-foreground mt-0.5">{p.type} · A${p.price}</div>
                  </div>
                  <Badge variant={statusBadgeVariant(p.status)}>{statusLabel[p.status]}</Badge>
                </div>
                <div className="flex gap-4 mt-2">
                  <button onClick={() => openEdit(p)} className="font-mono-label text-[10px] uppercase tracking-widest text-accent">
                    {t.admin.editShrimp}
                  </button>
                  <button onClick={() => setDeleteTarget(p.id)} className="font-mono-label text-[10px] uppercase tracking-widest text-red-500">
                    {t.admin.deleteShrimp}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? t.admin.editShrimp : t.admin.addShrimp}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <Input
            label="Product Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Select
            label="Category"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            options={[{ value: 'Caridina', label: 'Caridina' }, { value: 'Neocaridina', label: 'Neocaridina' }]}
          />
          <Input
            label="Line / Pattern"
            value={form.lines}
            placeholder="e.g. Boa, Galaxy"
            onChange={(e) => setForm((f) => ({ ...f, lines: e.target.value }))}
          />
          <Input
            label="Primary Color"
            value={form.colors}
            placeholder="e.g. Red, Blue"
            onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))}
          />
          <Input
            label="Grade"
            value={form.grade}
            placeholder="e.g. SS Grade"
            onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price (A$)"
              type="number"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />
            <Input
              label="Available Qty"
              type="number"
              value={form.quantity}
              onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono-label uppercase tracking-widest text-muted-foreground">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2.5 text-sm font-body bg-card border border-border text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring resize-none"
              style={{ borderRadius: 'var(--radius)' }}
            />
          </div>
          <Select
            label="Difficulty"
            value={form.careLevel}
            onChange={(e) => setForm((f) => ({ ...f, careLevel: e.target.value }))}
            options={[
              { value: 'Beginner', label: 'Beginner' },
              { value: 'Intermediate', label: 'Intermediate' },
              { value: 'Advanced', label: 'Advanced' },
            ]}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            options={[
              { value: 'in-stock', label: 'In Stock' },
              { value: 'low-stock', label: 'Low Stock' },
              { value: 'out-of-stock', label: 'Out of Stock' },
            ]}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="w-4 h-4 accent-[var(--accent)]"
            />
            <span className="text-xs font-mono-label uppercase tracking-widest text-muted-foreground">Featured</span>
          </label>
        </div>
        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          <MotionButton variant="accent" size="sm" onClick={saveForm}>
            Save
          </MotionButton>
          <MotionButton variant="ghost" size="sm" onClick={() => setFormOpen(false)}>
            Cancel
          </MotionButton>
        </div>
      </Dialog>

      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Delete"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <MotionButton variant="primary" size="sm" onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
            Delete
          </MotionButton>
          <MotionButton variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
            Cancel
          </MotionButton>
        </div>
      </Dialog>
    </AdminLayout>
  )
}

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Translations } from '@/i18n'
import type { OrderStatus } from '@/data/orders'
import { adminOrders } from '@/data/orders'
import AdminLayout from '@/features/admin/components/AdminLayout'
import Badge from '@/shared/ui/Badge'
import Input from '@/shared/ui/Input'

interface Props {
  t: Translations
}

type Tab = 'all' | OrderStatus

const tabs: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
]

const badgeVariant = (s: OrderStatus) => s as 'processing' | 'shipped' | 'delivered' | 'cancelled'

const PAGE_SIZE = 10

export default function OrdersAdmin({ t }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = adminOrders
    if (activeTab !== 'all') list = list.filter((o) => o.status === activeTab)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (o) =>
          o.number.toLowerCase().includes(q) ||
          o.shippingAddress.name.toLowerCase().includes(q)
      )
    }
    return list
  }, [activeTab, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setPage(1)
  }

  return (
    <AdminLayout t={t} activeRoute="/admin/orders">
      <div className="p-6 md:p-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">{t.admin.orders}</h1>
        </div>

        <div className="mb-5 max-w-xs">
          <Input
            placeholder="Search by order # or customer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        <div className="flex gap-0 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2.5 font-mono-label text-[10px] uppercase tracking-widest transition-colors relative
                ${activeTab === tab.id ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
              )}
            </button>
          ))}
        </div>

        <div className="hidden md:block bg-card border border-border overflow-hidden mb-4" style={{ borderRadius: 'var(--radius)' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Order #', 'Customer', 'Items', 'Total', 'Date', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3 font-mono-label text-xs text-foreground">{order.number}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{order.shippingAddress.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground max-w-[180px]">
                    <div className="truncate">{order.items.map((i) => i.name).join(', ')}</div>
                    <div className="font-mono-label text-[10px] text-muted-foreground">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">A${order.total}</td>
                  <td className="px-4 py-3 font-mono-label text-xs text-muted-foreground">{order.date}</td>
                  <td className="px-4 py-3">
                    <Badge variant={badgeVariant(order.status)}>{order.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono-label text-[10px] uppercase tracking-widest text-accent hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3 mb-4">
          {paginated.map((order) => (
            <div key={order.id} className="bg-card border border-border p-4" style={{ borderRadius: 'var(--radius)' }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-mono-label text-xs text-foreground">{order.number}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{order.shippingAddress.name}</div>
                </div>
                <Badge variant={badgeVariant(order.status)}>{order.status}</Badge>
              </div>
              <div className="text-xs text-muted-foreground mb-3 line-clamp-1">{order.items.map((i) => i.name).join(', ')}</div>
              <div className="flex items-center justify-between">
                <div className="font-mono-label text-[10px] text-muted-foreground uppercase tracking-widest">
                  {order.items.length} items · A${order.total} · {order.date}
                </div>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="font-mono-label text-[10px] uppercase tracking-widest text-accent hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
          {paginated.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No orders found.</p>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-widest border border-border text-foreground disabled:opacity-40 hover:bg-secondary transition-colors"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-widest border border-border text-foreground disabled:opacity-40 hover:bg-secondary transition-colors"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

interface Props {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'muted' | 'inStock' | 'lowStock' | 'outOfStock' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  className?: string
}

const variantStyles = {
  default: 'bg-secondary text-secondary-foreground border border-border',
  accent: 'bg-accent/10 text-accent border border-accent/20',
  muted: 'bg-muted text-muted-foreground',
  inStock: 'text-accent border border-accent/30 bg-accent/8',
  lowStock: 'text-amber-600 dark:text-amber-400 border border-amber-400/30 bg-amber-400/8',
  outOfStock: 'text-muted-foreground border border-border bg-muted',
  processing: 'text-blue-600 dark:text-blue-400 border border-blue-400/30 bg-blue-400/8',
  shipped: 'text-accent border border-accent/30 bg-accent/8',
  delivered: 'text-muted-foreground border border-border bg-muted',
  cancelled: 'text-red-500 border border-red-400/30 bg-red-400/8',
}

export default function Badge({ children, variant = 'default', className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono-label font-medium uppercase tracking-widest ${variantStyles[variant]} ${className}`}
      style={{ borderRadius: 'var(--radius)' }}
    >
      {children}
    </span>
  )
}

export function StatusDot({ status }: { status: 'in-stock' | 'low-stock' | 'out-of-stock' }) {
  const colors = {
    'in-stock': 'bg-accent',
    'low-stock': 'bg-amber-500',
    'out-of-stock': 'bg-muted-foreground',
  }
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors[status]}`} aria-hidden />
}

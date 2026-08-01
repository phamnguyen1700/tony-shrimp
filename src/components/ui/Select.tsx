import type { SelectHTMLAttributes } from 'react'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export default function Select({ label, options, className = '', id, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-mono-label uppercase tracking-widest text-muted-foreground">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          w-full px-3 py-2.5 text-sm font-body appearance-none
          bg-card border border-border text-foreground cursor-pointer
          focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring
          ${className}
        `}
        style={{ borderRadius: 'var(--radius)' }}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

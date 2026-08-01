import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', id, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-mono-label uppercase tracking-widest text-muted-foreground">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full px-3 py-2.5 text-sm font-body
          bg-card border border-border text-foreground
          placeholder:text-muted-foreground
          transition-colors duration-150
          focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        style={{ borderRadius: 'var(--radius)' }}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/config/utils'

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, options, className, id, ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-mono-label uppercase tracking-widest text-muted-foreground">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={cn(`ui-radius
          w-full px-3 py-2.5 text-sm font-body appearance-none
          bg-card border border-border text-foreground cursor-pointer
          focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring
        `, className)}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
})

export default Select

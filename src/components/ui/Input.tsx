import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/config/utils'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, className, id, ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-mono-label uppercase tracking-widest text-muted-foreground">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(`ui-radius
          w-full px-3 py-2.5 text-sm font-body
          bg-card border border-border text-foreground
          placeholder:text-muted-foreground
          transition-colors duration-150
          focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring
          disabled:opacity-50 disabled:cursor-not-allowed
        `, error && 'border-red-500 focus:ring-red-500', className)}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
})

export default Input

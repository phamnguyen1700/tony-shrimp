import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { buttonTap } from '@/lib/motionVariants'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
}

const variantStyles = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80',
  ghost: 'text-foreground hover:bg-secondary',
  accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs tracking-widest',
  md: 'px-5 py-2.5 text-xs tracking-widest',
  lg: 'px-7 py-3.5 text-xs tracking-widest',
}

export default function MotionButton({ children, variant = 'primary', size = 'md', className = '', ...props }: Props) {
  const reduced = useReducedMotion()

  return (
    <motion.button
      variants={reduced ? undefined : buttonTap}
      initial="rest"
      whileHover={reduced ? undefined : 'hover'}
      whileTap={reduced ? undefined : 'tap'}
      className={`
        ui-radius
        inline-flex items-center justify-center gap-2 font-body font-medium
        uppercase transition-colors duration-150 cursor-pointer
        focus-visible:outline-ring disabled:opacity-40 disabled:cursor-not-allowed
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { staggerContainer, fadeUp } from '@/lib/config/motionVariants'

interface Props {
  children: ReactNode[]
  className?: string
  itemClassName?: string
  delay?: number
  as?: 'div' | 'span'
}

export default function StaggeredText({ children, className, itemClassName, delay = 0, as = 'div' }: Props) {
  const reduced = useReducedMotion()
  const Tag = as

  if (reduced) {
    return (
      <div className={className}>
        {children.map((child, i) => (
          <span key={i} className={itemClassName}>{child}</span>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      style={{ transitionDelay: `${delay}ms` } as any}
    >
      {children.map((child, i) => (
        <motion.span
          key={i}
          className={itemClassName}
          variants={fadeUp}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {child}
        </motion.span>
      ))}
    </motion.div>
  )
}

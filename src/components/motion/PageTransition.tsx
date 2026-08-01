import { motion, AnimatePresence } from 'motion/react'
import type { ReactNode } from 'react'
import { pageTransition } from '@/lib/motionVariants'
import { useReducedMotion } from 'motion/react'

interface Props {
  children: ReactNode
  routeKey: string
}

export default function PageTransition({ children, routeKey }: Props) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div key={routeKey}>{children}</div>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

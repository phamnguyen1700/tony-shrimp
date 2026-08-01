import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { modalScale } from '@/lib/motionVariants'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  maxWidth?: string
}

export default function Dialog({ open, onClose, title, children, maxWidth = 'max-w-md' }: Props) {
  const reduced = useReducedMotion()

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`relative w-full ${maxWidth} bg-card border border-border shadow-2xl`}
            style={{ borderRadius: 'var(--radius-lg)' }}
            variants={reduced ? undefined : modalScale}
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'visible'}
            exit={reduced ? { opacity: 0 } : 'exit'}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              {title && (
                <h3 className="text-sm font-mono-label uppercase tracking-widest text-foreground">{title}</h3>
              )}
              <button
                onClick={onClose}
                className="ml-auto text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

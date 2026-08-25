import * as DialogPrimitive from '@radix-ui/react-dialog'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { modalScale } from '@/lib/config/motionVariants'

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
    <DialogPrimitive.Root open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <DialogPrimitive.Overlay asChild forceMount>
                <motion.div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </DialogPrimitive.Overlay>
              <DialogPrimitive.Content asChild forceMount>
                <motion.div
                  className={`ui-radius-lg relative w-full ${maxWidth} bg-card border border-border shadow-2xl`}
                  variants={reduced ? undefined : modalScale}
                  initial={reduced ? { opacity: 0 } : 'hidden'}
                  animate={reduced ? { opacity: 1 } : 'visible'}
                  exit={reduced ? { opacity: 0 } : 'exit'}
                >
                  <div className="flex items-center justify-between p-6 border-b border-border">
                    <DialogPrimitive.Title
                      className={title
                        ? 'text-sm font-mono-label uppercase tracking-widest text-foreground'
                        : 'sr-only'}
                    >
                      {title ?? 'Dialog'}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Close asChild>
                      <button
                        className="ml-auto text-muted-foreground hover:text-foreground transition-colors p-1"
                        aria-label="Close"
                      >
                        <X className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </DialogPrimitive.Close>
                  </div>
                  <div className="p-6">{children}</div>
                </motion.div>
              </DialogPrimitive.Content>
            </div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

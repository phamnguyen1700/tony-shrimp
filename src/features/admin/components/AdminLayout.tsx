import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import type { Translations } from '@/i18n'
import { drawerSlide } from '@/lib/motionVariants'

interface Props {
  children: ReactNode
  t: Translations
  activeRoute: string
}

const navItems = (t: Translations) => [
  {
    href: '/admin',
    label: t.admin.dashboard,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="3" width="7" height="7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="14" width="7" height="7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="14" width="7" height="7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/admin/shrimp',
    label: t.admin.shrimp,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c-4.5 0-8 2.5-8 7 0 3 1.5 5 4 6.5L6 20h12l-2-3.5c2.5-1.5 4-3.5 4-6.5 0-4.5-3.5-7-8-7z" />
      </svg>
    ),
  },
  {
    href: '/admin/orders',
    label: t.admin.orders,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    href: '/admin/customers',
    label: t.admin.customers,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: '/admin/settings',
    label: t.admin.settings,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

function NavContent({ t, activeRoute, onClose }: { t: Translations; activeRoute: string; onClose?: () => void }) {
  return (
    <>
      <div className="px-5 py-5 border-b border-border">
        <Link href="/" className="block" onClick={onClose}>
          <div className="font-display text-base font-semibold text-foreground leading-none">TONY SHRIMP</div>
          <div className="font-mono-label text-[11px] tracking-widest text-muted-foreground mt-0.5">AUSTRALIA · ADMIN</div>
        </Link>
      </div>
      <nav className="py-3">
        {navItems(t).map((item) => {
          const isActive = activeRoute === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm font-body transition-colors duration-150 relative
                ${isActive
                  ? 'text-accent bg-accent/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-accent" />
              )}
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}

export default function AdminLayout({ children, t, activeRoute }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const reduced = useReducedMotion()

  return (
    <div className="min-h-screen bg-background">
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-56 bg-card border-r border-border z-30">
        <NavContent t={t} activeRoute={activeRoute} />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-20 flex items-center justify-between px-4">
        <div className="font-display text-sm font-semibold text-foreground">TONY SHRIMP</div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              className="absolute top-0 left-0 h-full w-56 bg-card border-r border-border"
              variants={reduced ? undefined : { ...drawerSlide, hidden: { x: '-100%', opacity: 0 }, exit: { x: '-100%', opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } } }}
              initial={reduced ? { opacity: 0 } : 'hidden'}
              animate={reduced ? { opacity: 1 } : 'visible'}
              exit={reduced ? { opacity: 0 } : 'exit'}
            >
              <div className="flex items-center justify-end px-4 h-14 border-b border-border">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 text-muted-foreground hover:text-foreground"
                  aria-label="Close menu"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <NavContent t={t} activeRoute={activeRoute} onClose={() => setDrawerOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <main className="ml-0 md:ml-56 pt-14 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}

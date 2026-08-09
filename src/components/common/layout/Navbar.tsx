import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import type { ThemeMode } from '@/hooks/useTheme'
import type { Lang } from '@/i18n'
import type { Translations } from '@/i18n'
import type { CartItem } from '@/types/cart'
import { canAccessAdmin } from '@/lib/authAccess'
import { useAuthStore } from '@/store/authStore'
import MobileDrawer from './MobileDrawer'
import NavSearch from './NavSearch'

interface Props {
  t: Translations
  lang: Lang
  setLang: (l: Lang) => void
  theme: ThemeMode
  setTheme: (m: ThemeMode) => void
  cartItems: CartItem[]
}

export default function Navbar({ t, lang, setLang, theme, setTheme, cartItems }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const user = useAuthStore((state) => state.user)
  const isLanding = pathname === '/'
  const canGoAdmin = canAccessAdmin(user)
  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0)
  const cartHref = pathname.startsWith('/products/') ? '/cart?fromLastViewed=1' : '/cart'

  const nextTheme: ThemeMode = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
  const themeIcon = theme === 'light' ? '☀' : theme === 'dark' ? '☾' : '◑'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          isLanding ? 'bg-transparent' : 'bg-background/95 backdrop-blur-md border-b border-border'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between h-14">
          {/* Brand */}
          <Link href={canGoAdmin ? "/admin" : "/"} className="flex flex-col leading-none group">
            <span
              className="font-display font-semibold tracking-[0.18em] text-sm uppercase"
              style={{ color: isLanding ? '#edeae3' : 'var(--foreground)' }}
            >
              {t.brand}
            </span>
            <span
              className="font-mono-label text-[11px] tracking-[0.24em] uppercase"
              style={{ color: isLanding ? 'rgba(237,234,227,0.45)' : 'var(--muted-foreground)' }}
            >
              {t.tagline}{canGoAdmin ? ' · ADMIN' : ''}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {[
              { to: '/shop', label: t.nav.shop },
              { to: '/about', label: t.nav.about },
            ].map(({ to, label }) => (
              <Link
                key={to}
                href={to}
                className={`text-xs font-mono-label uppercase tracking-widest transition-colors duration-150 ${
                  isLanding
                    ? 'text-white/60 hover:text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <NavSearch isLanding={isLanding} />

            {/* Language */}
            <button
              onClick={() => setLang(lang === 'en' ? 'vi' : 'en')}
              className={`hidden md:flex text-xs font-mono-label tracking-widest uppercase transition-colors p-2 ${
                isLanding ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {lang === 'en' ? 'VI' : 'EN'}
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(nextTheme)}
              className={`hidden md:flex text-xs p-2 transition-colors ${isLanding ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label={`Switch to ${nextTheme} theme`}
            >
              {themeIcon}
            </button>

            {/* Account */}
            <Link
              href="/account"
              className={`hidden md:flex p-2 transition-colors ${isLanding ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label={t.nav.account}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" strokeWidth={1.5} />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeWidth={1.5} strokeLinecap="round" />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              href={cartHref}
              className={`relative flex p-2 transition-colors ${isLanding ? 'text-white/60 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label={`${t.nav.cart} (${totalItems})`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                <line x1="3" y1="6" x2="21" y2="6" strokeWidth={1.5} />
                <path d="M16 10a4 4 0 01-8 0" strokeWidth={1.5} strokeLinecap="round" />
              </svg>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={reduced ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                    animate={reduced ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                    exit={reduced ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[11px] font-mono-label flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Mobile menu */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={`md:hidden p-2 transition-colors ${isLanding ? 'text-white/70 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth={1.5} strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        t={t}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
      />
    </>
  )
}

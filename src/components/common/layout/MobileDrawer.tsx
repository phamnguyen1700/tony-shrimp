import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import type { ThemeMode } from '@/hooks/useTheme'
import type { Lang, Translations } from '@/i18n'
import { drawerSlide } from '@/lib/motionVariants'

interface Props {
  open: boolean
  onClose: () => void
  t: Translations
  lang: Lang
  setLang: (l: Lang) => void
  theme: ThemeMode
  setTheme: (m: ThemeMode) => void
}

export default function MobileDrawer({ open, onClose, t, lang, setLang, theme, setTheme }: Props) {
  const reduced = useReducedMotion()

  const navLinks = [
    { to: '/shop', label: t.nav.shop },
    { to: '/about', label: t.nav.about },
    { to: '/account', label: t.nav.myOrders },
    { to: '/account', label: t.nav.account },
  ]

  const footerLinks = [
    { to: '/shipping', label: t.nav.shipping },
    { to: '/doa', label: t.nav.doaPolicy },
    { to: '/contact', label: t.nav.contact },
  ]

  const themes: ThemeMode[] = ['light', 'dark', 'system']

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-72 bg-card border-l border-border flex flex-col"
            variants={reduced ? undefined : drawerSlide}
            initial={reduced ? { opacity: 0 } : 'hidden'}
            animate={reduced ? { opacity: 1 } : 'visible'}
            exit={reduced ? { opacity: 0 } : 'exit'}
          >
            <div className="flex items-center justify-between px-6 h-14 border-b border-border">
              <span className="font-display text-sm font-semibold tracking-[0.15em] uppercase">{t.brand}</span>
              <button
                onClick={onClose}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 px-6 py-8 flex flex-col gap-1 overflow-y-auto">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.to}
                  onClick={onClose}
                  className="py-3 text-sm font-mono-label uppercase tracking-widest text-foreground/70 hover:text-foreground border-b border-border/40 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-[10px] font-mono-label uppercase tracking-widest text-muted-foreground mb-3">{t.nav.language}</p>
                <div className="flex gap-2">
                  {(['en', 'vi'] as Lang[]).map(l => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`px-3 py-1.5 text-xs font-mono-label uppercase tracking-widest border transition-colors ${
                        lang === l
                          ? 'border-accent text-accent bg-accent/10'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                      style={{ borderRadius: 'var(--radius)' }}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-mono-label uppercase tracking-widest text-muted-foreground mb-3">{t.nav.theme}</p>
                <div className="flex gap-2">
                  {themes.map(m => (
                    <button
                      key={m}
                      onClick={() => setTheme(m)}
                      className={`px-3 py-1.5 text-xs font-mono-label uppercase tracking-widest border transition-colors ${
                        theme === m
                          ? 'border-accent text-accent bg-accent/10'
                          : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                      style={{ borderRadius: 'var(--radius)' }}
                    >
                      {m === 'light' ? t.theme.light : m === 'dark' ? t.theme.dark : t.theme.system}
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            <div className="px-6 pb-8 flex flex-col gap-1 border-t border-border pt-4">
              {footerLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.to}
                  onClick={onClose}
                  className="py-2 text-xs font-mono-label uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

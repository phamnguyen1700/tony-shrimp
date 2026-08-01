import { useState, useEffect } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
const DEFAULT_THEME: ThemeMode = 'dark'

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system'
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  const resolved = mode === 'system' ? getSystemTheme() : mode
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME)

  useEffect(() => {
    const storedTheme = localStorage.getItem('tony-theme')
    const nextTheme = isThemeMode(storedTheme) ? storedTheme : DEFAULT_THEME
    setThemeState(nextTheme)
    applyTheme(nextTheme)
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  function setTheme(mode: ThemeMode) {
    if (typeof localStorage !== 'undefined') localStorage.setItem('tony-theme', mode)
    setThemeState(mode)
  }

  const resolved: 'light' | 'dark' = theme === 'system' ? getSystemTheme() : theme

  return { theme, setTheme, resolved }
}

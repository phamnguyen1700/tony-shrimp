import { useState, useEffect } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

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
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof localStorage === 'undefined') return 'dark'
    return (localStorage.getItem('tony-theme') as ThemeMode) ?? 'dark'
  })

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

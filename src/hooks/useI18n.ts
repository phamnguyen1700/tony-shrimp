import { useEffect, useState } from 'react'
import { type Lang, getT } from '@/i18n'

const DEFAULT_LANG: Lang = 'en'

function isLang(value: string | null): value is Lang {
  return value === 'en' || value === 'vi'
}

export function useI18n() {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG)

  useEffect(() => {
    const storedLang = localStorage.getItem('tony-lang')
    setLangState(isLang(storedLang) ? storedLang : DEFAULT_LANG)
  }, [])

  function setLang(l: Lang) {
    if (typeof localStorage !== 'undefined') localStorage.setItem('tony-lang', l)
    setLangState(l)
  }

  const t = getT(lang)

  return { lang, setLang, t }
}

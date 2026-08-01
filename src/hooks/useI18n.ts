import { useState } from 'react'
import { type Lang, getT } from '@/i18n'

export function useI18n() {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof localStorage === 'undefined') return 'en'
    return (localStorage.getItem('tony-lang') as Lang) ?? 'en'
  })

  function setLang(l: Lang) {
    if (typeof localStorage !== 'undefined') localStorage.setItem('tony-lang', l)
    setLangState(l)
  }

  const t = getT(lang)

  return { lang, setLang, t }
}

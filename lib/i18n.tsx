'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import ptBR from '@/locales/pt-BR.json'
import en from '@/locales/en.json'

type Language = 'pt-BR' | 'en'
type Translations = typeof ptBR

const translations: Record<Language, Translations> = { 'pt-BR': ptBR, en }

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt-BR',
  setLanguage: () => {},
  t: (key) => key,
})

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? path
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt-BR')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('language') as Language
      if (stored && (stored === 'pt-BR' || stored === 'en')) {
        setLanguageState(stored)
      } else {
        const browser = navigator.language
        setLanguageState(browser.startsWith('pt') ? 'pt-BR' : 'en')
      }
    } catch {}
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    try { localStorage.setItem('language', lang) } catch {}
  }, [])

  const t = useCallback((key: string): string => {
    return getNestedValue(translations[language], key)
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

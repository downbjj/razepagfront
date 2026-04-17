'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'

export default function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  const isLight = theme === 'light'
  const textMain  = isLight ? '#111111' : '#ffffff'
  const textMuted = isLight ? '#6b7280' : '#9ca3af'
  const navBg     = isLight ? 'rgba(244,244,248,0.95)' : 'rgba(0,0,0,0.90)'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-[#A855F7]/20" style={{background: navBg}}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.png" alt="Razepag" width={200} height={60} className="object-contain" priority />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/recursos"    className="text-sm transition-colors hover:text-[#A855F7]" style={{color: textMuted}}>{t('nav.features')}</Link>
          <Link href="/documentacao" className="text-sm transition-colors hover:text-[#A855F7]" style={{color: textMuted}}>{t('nav.docs')}</Link>
          <Link href="/suporte"     className="text-sm transition-colors hover:text-[#A855F7]" style={{color: textMuted}}>{t('nav.support')}</Link>
          <Link href="/termos"      className="text-sm transition-colors hover:text-[#A855F7]" style={{color: textMuted}}>{t('nav.terms')}</Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === 'pt-BR' ? 'en' : 'pt-BR')}
            className="text-xs border rounded-full px-2.5 py-1 transition-all hover:border-purple-500/50"
            style={{background:'rgba(168,85,247,0.05)', borderColor:'rgba(168,85,247,0.2)', color:'#a855f7'}}
          >
            {language === 'pt-BR' ? 'PT-Br' : 'EN-Us'}
          </button>

          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-full border transition-all"
            style={{borderColor:'rgba(168,85,247,0.2)', color:'#a855f7', background:'rgba(168,85,247,0.05)'}}
            title={theme === 'dark' ? t('common.light_mode') : t('common.dark_mode')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/login"
            className="text-sm border border-[#A855F7]/40 px-3 py-1.5 rounded-lg transition-colors hover:border-[#A855F7] hover:text-[#A855F7]"
            style={{color: textMuted}}
          >
            {t('nav.login')}
          </Link>
          <Link href="/register" className="text-sm text-white px-4 py-2 rounded-lg font-medium transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]" style={{background:'#A855F7'}}>
            {t('nav.register')}
          </Link>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1" style={{color: textMuted}}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[#A855F7]/20 px-4 py-4 space-y-3" style={{background: navBg}}>
          <Link href="/recursos"     className="block text-sm py-2 hover:text-[#A855F7]" style={{color: textMuted}} onClick={() => setMenuOpen(false)}>{t('nav.features')}</Link>
          <Link href="/documentacao" className="block text-sm py-2 hover:text-[#A855F7]" style={{color: textMuted}} onClick={() => setMenuOpen(false)}>{t('nav.docs')}</Link>
          <Link href="/suporte"      className="block text-sm py-2 hover:text-[#A855F7]" style={{color: textMuted}} onClick={() => setMenuOpen(false)}>{t('nav.support')}</Link>
          <Link href="/termos"       className="block text-sm py-2 hover:text-[#A855F7]" style={{color: textMuted}} onClick={() => setMenuOpen(false)}>{t('nav.terms')}</Link>
          <div className="pt-2 flex gap-3">
            <Link href="/login" className="flex-1 text-center text-sm border border-[#A855F7]/40 px-4 py-2 rounded-lg hover:border-[#A855F7] transition-colors" style={{color: textMuted}} onClick={() => setMenuOpen(false)}>{t('nav.login')}</Link>
            <Link href="/register" className="flex-1 text-center text-sm text-white px-4 py-2 rounded-lg font-medium" style={{background:'#A855F7'}} onClick={() => setMenuOpen(false)}>{t('nav.register')}</Link>
          </div>
          <div className="pt-2 flex gap-2">
            <button onClick={() => setLanguage(language === 'pt-BR' ? 'en' : 'pt-BR')} className="text-xs border rounded-full px-2.5 py-1" style={{background:'rgba(168,85,247,0.05)', borderColor:'rgba(168,85,247,0.2)', color:'#a855f7'}}>
              {language === 'pt-BR' ? 'PT-Br' : 'EN-Us'}
            </button>
            <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded-full border" style={{borderColor:'rgba(168,85,247,0.2)', color:'#a855f7', background:'rgba(168,85,247,0.05)'}}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

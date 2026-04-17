'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle, ArrowRight, Shield, Zap,
  Clock, Code2, Webhook, ChevronRight, ExternalLink,
  Smartphone, Globe, Lock
} from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import LandingNav from '@/components/layout/LandingNav'

export default function LandingPage() {
  const { t } = useLanguage()
  const { theme } = useTheme()

  const isLight = theme === 'light'
  const pageBg = isLight ? '#f4f4f8' : '#000000'
  const textMain = isLight ? '#111111' : '#ffffff'
  const textMuted = isLight ? '#6b7280' : '#9ca3af'
  const textDim = isLight ? '#9ca3af' : '#6b7280'
  const cardBg = isLight ? '#ffffff' : '#0d0d0d'
  const cardBorder = isLight ? '#e0e0e8' : '#1f1f1f'
  const statsBorder = isLight ? 'rgba(168,85,247,0.15)' : 'rgba(168,85,247,0.1)'

  return (
    <div className="min-h-screen overflow-x-hidden" style={{background: pageBg, color: textMain}}>

      <LandingNav />

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px]" style={{background:'rgba(168,85,247,0.10)'}} />
          <div className="absolute inset-0 opacity-30" style={{backgroundImage:'linear-gradient(rgba(168,85,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.05) 1px, transparent 1px)',backgroundSize:'50px 50px'}} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-8" style={{background:'rgba(168,85,247,0.1)',borderColor:'rgba(168,85,247,0.3)'}}>
            <div className="w-1.5 h-1.5 bg-[#A855F7] rounded-full animate-pulse" />
            <span className="text-xs text-purple-400 font-medium">{t('hero.badge')}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6" style={{color: textMain}}>
            {t('hero.title')}
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{color: textMuted}}>
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all group" style={{background:'#A855F7'}}>
              {t('hero.cta_primary')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/documentacao" className="inline-flex items-center justify-center gap-2 border border-[#A855F7]/40 hover:border-[#A855F7] px-8 py-4 rounded-xl font-semibold text-base transition-all" style={{color: textMuted}}>
              {t('hero.cta_secondary')}
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm" style={{color: textDim}}>
            {['Sem taxa de manutenção', 'Integração em minutos', 'PIX 24/7'].map(item => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#A855F7]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{color: textMain}}>
              {t('features.title')}{' '}
              <span style={{color:'#A855F7'}}>{t('features.title_highlight')}</span>
            </h2>
            <p style={{color: textMuted}} className="max-w-xl mx-auto">Plataforma completa com API, painel administrativo e webhooks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { num:'01', icon: Code2,   title: t('features.instant.title'),  desc: t('features.instant.description') },
              { num:'02', icon: Webhook, title: t('features.api.title'),       desc: t('features.api.description') },
              { num:'03', icon: Shield,  title: t('features.secure.title'),    desc: t('features.secure.description') },
              { num:'04', icon: Clock,   title: t('features.dashboard.title'), desc: t('features.dashboard.description') },
            ].map(f => (
              <div key={f.num} className="group relative rounded-2xl p-8 transition-all" style={{background: cardBg, border:`1px solid ${cardBorder}`}}>
                <div className="flex items-start gap-5">
                  <span className="text-4xl font-black font-mono flex-shrink-0" style={{color:'rgba(168,85,247,0.2)'}}>{f.num}</span>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{background:'rgba(168,85,247,0.1)'}}>
                        <f.icon className="w-5 h-5" style={{color:'#A855F7'}} />
                      </div>
                      <h3 className="text-lg font-semibold" style={{color: textMain}}>{f.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{color: textMuted}}>{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-4" style={{borderTop:`1px solid ${statsBorder}`,borderBottom:`1px solid ${statsBorder}`}}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value:'< 3s',    label: t('stats.transactions') },
            { value:'99.9%',   label: t('stats.uptime') },
            { value:'24/7',    label: t('stats.support') },
            { value:'3%+R$1',  label: t('hero.stat_fee') },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black mb-1" style={{color:'#A855F7'}}>{s.value}</p>
              <p className="text-sm" style={{color: textMuted}}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{color: textMain}}>{t('how_it_works.title')}</h2>
            <p style={{color: textMuted}}>Comece a receber em 3 passos simples</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step:'1', icon: Smartphone, title: t('how_it_works.step1_title'), desc: t('how_it_works.step1_desc') },
              { step:'2', icon: Globe,      title: t('how_it_works.step2_title'), desc: t('how_it_works.step2_desc') },
              { step:'3', icon: Lock,       title: t('how_it_works.step3_title'), desc: t('how_it_works.step3_desc') },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.3)'}}>
                  <s.icon className="w-9 h-9" style={{color:'#A855F7'}} />
                </div>
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white mb-3" style={{background:'#A855F7'}}>
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{color: textMain}}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{color: textMuted}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MID CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl p-12 text-center overflow-hidden" style={{background:'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(94,24,160,0.08))',border:'1px solid rgba(168,85,247,0.3)'}}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl" style={{background:'rgba(168,85,247,0.08)'}} />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{color: textMain}}>
                {t('cta.title')} <span style={{color:'#A855F7'}}>{t('cta.subtitle')}</span>
              </h2>
              <p className="mb-8 max-w-lg mx-auto" style={{color: textMuted}}>
                {t('cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="inline-flex items-center justify-center gap-2 text-white px-8 py-4 rounded-xl font-semibold transition-all group" style={{background:'#A855F7'}}>
                  {t('cta.button')}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center gap-2 border px-8 py-4 rounded-xl font-semibold transition-all" style={{borderColor:'rgba(168,85,247,0.4)',color: textMuted}}>
                  {t('nav.login')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-4" style={{borderTop:`1px solid ${cardBorder}`}}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <Image src="/logo.png" alt="Razepag" width={220} height={66} className="object-contain" />
              </div>
              <p className="text-sm leading-relaxed" style={{color: textDim}}>{t('footer.description')}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4" style={{color: textMain}}>{t('footer.product')}</h4>
              <ul className="space-y-3">
                {[[t('nav.features'),'/recursos'],[t('nav.docs'),'/documentacao'],[t('nav.register'),'/register'],[t('nav.login'),'/login']].map(([l,h]) => (
                  <li key={h}><Link href={h} className="text-sm transition-colors hover:text-[#A855F7]" style={{color: textDim}}>{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4" style={{color: textMain}}>{t('footer.company')}</h4>
              <ul className="space-y-3">
                {[[t('nav.terms'),'/termos'],[t('nav.support'),'/suporte']].map(([l,h]) => (
                  <li key={h}><Link href={h} className="text-sm transition-colors hover:text-[#A855F7]" style={{color: textDim}}>{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4" style={{color: textMain}}>Contato</h4>
              <ul className="space-y-3">
                <li><a href="mailto:suporte@razepag.com" className="text-sm transition-colors hover:text-[#A855F7]" style={{color: textDim}}>suporte@razepag.com</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{borderTop:`1px solid ${cardBorder}`}}>
            <p className="text-sm" style={{color: textDim}}>© 2026 Razepag. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock, Mail, User, Phone, Zap, Moon, Sun, AtSign } from 'lucide-react'
import api, { setAuthTokens, setUser } from '@/lib/api'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'

export default function RegisterPage() {
  const router = useRouter()
  const { t, language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', username: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload: any = { ...form }
      if (!payload.phone)    delete payload.phone
      if (!payload.username) delete payload.username

      const { data } = await api.post('/auth/register', payload)
      const { user, accessToken, refreshToken } = data.data

      setAuthTokens(accessToken, refreshToken)
      setUser(user)

      toast.success(t('auth.account_created'))
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const cardBg = theme === 'light' ? '#ffffff' : '#0d0d0d'
  const inputBg = theme === 'light' ? '#f0f0f5' : '#141414'
  const borderColor = theme === 'light' ? '#e0e0e8' : '#1f1f1f'
  const textColor = theme === 'light' ? '#111111' : 'white'
  const labelColor = theme === 'light' ? '#374151' : '#d1d5db'
  const mutedColor = theme === 'light' ? '#6b7280' : '#6b7280'

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center p-4" style={{background:'var(--background)'}}>
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top-right toggles */}
      <div className="fixed top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setLanguage(language === 'pt-BR' ? 'en' : 'pt-BR')}
          className="text-sm border rounded-full px-2.5 py-1 transition-all"
          style={{background:'rgba(168,85,247,0.05)', borderColor:'rgba(168,85,247,0.2)', color:'#a855f7'}}
        >
          {language === 'pt-BR' ? '🇧🇷 PT' : '🇺🇸 EN'}
        </button>
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-full border transition-all"
          style={{borderColor:'rgba(168,85,247,0.2)', color:'#a855f7', background:'rgba(168,85,247,0.05)'}}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-2">
            <Image
              src="/logo.png"
              alt="Razepag"
              width={260}
              height={78}
              className="object-contain"
              priority
            />
          </div>
          <p className="text-xl font-bold tracking-wide" style={{background: 'linear-gradient(90deg, #A855F7, #d8b4fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{t('auth.register_title')}</p>
        </div>

        <div className="rounded-2xl p-8 shadow-card border" style={{background: cardBg, borderColor}}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: labelColor}}>{t('auth.name')} *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color: mutedColor}} />
                <input
                  type="text" required minLength={2} value={form.name} onChange={set('name')}
                  className="w-full border pl-10 pr-4 py-3 rounded-xl transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                  style={{background: inputBg, borderColor, color: textColor}}
                  placeholder={t('auth.name_placeholder')}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: labelColor}}>{t('auth.email')} *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color: mutedColor}} />
                <input
                  type="email" required value={form.email} onChange={set('email')}
                  className="w-full border pl-10 pr-4 py-3 rounded-xl transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                  style={{background: inputBg, borderColor, color: textColor}}
                  placeholder={t('auth.email_placeholder')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: labelColor}}>{t('auth.password')} *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color: mutedColor}} />
                <input
                  type={showPassword ? 'text' : 'password'} required minLength={8} value={form.password} onChange={set('password')}
                  className="w-full border pl-10 pr-12 py-3 rounded-xl transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                  style={{background: inputBg, borderColor, color: textColor}}
                  placeholder={t('auth.password_hint')}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{color: mutedColor}}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: labelColor}}>@Username (opcional)</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color: mutedColor}} />
                <input
                  type="text" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                  className="w-full border pl-10 pr-4 py-3 rounded-xl transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                  style={{background: inputBg, borderColor, color: textColor}}
                  placeholder="seuusuario"
                  maxLength={30}
                />
              </div>
              <p className="text-xs mt-1" style={{color: mutedColor}}>Para receber transferências internas gratuitas</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: labelColor}}>{t('auth.phone_optional')}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color: mutedColor}} />
                <input
                  type="tel" value={form.phone} onChange={set('phone')}
                  className="w-full border pl-10 pr-4 py-3 rounded-xl transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                  style={{background: inputBg, borderColor, color: textColor}}
                  placeholder={t('auth.phone_placeholder')}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-gradient-purple text-white py-3 rounded-xl font-semibold shadow-neon-purple-sm hover:shadow-neon-purple transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />{t('auth.creating')}</>
              ) : t('auth.register_button')}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{color: mutedColor}}>
            {t('auth.has_account')}{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">{t('auth.sign_in')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

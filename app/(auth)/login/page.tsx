'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Eye, EyeOff, Lock, Mail, Moon, Sun } from 'lucide-react'
import api, { setAuthTokens, setUser } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'

export default function LoginPage() {
  const router = useRouter()
  const qc = useQueryClient()
  const { t, language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await api.post('/auth/login', form)
      const { user, accessToken, refreshToken } = data.data

      setAuthTokens(accessToken, refreshToken)
      setUser(user)
      qc.clear()

      toast.success(`${t('auth.welcome')}, ${user.name}!`)

      if (user.role === 'ADMIN' || user.role === 'OWNER') {
        router.push('/admin')
      } else if (!user.accountActivated) {
        router.push('/dashboard/profile')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const cardBg = theme === 'light' ? '#ffffff' : '#0d0d0d'
  const inputBg = theme === 'light' ? '#f0f0f5' : '#141414'
  const borderColor = theme === 'light' ? '#e0e0e8' : '#1f1f1f'
  const textColor = theme === 'light' ? '#111111' : 'white'
  const mutedColor = theme === 'light' ? '#6b7280' : '#6b7280'

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center p-4" style={{background:'var(--background)'}}>
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top-right toggles */}
      <div className="fixed top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setLanguage(language === 'pt-BR' ? 'en' : 'pt-BR')}
          className="text-sm border rounded-full px-2.5 py-1 transition-all"
          style={{background:'rgba(138,43,226,0.05)', borderColor:'rgba(138,43,226,0.2)', color:'#a855f7'}}
        >
          {language === 'pt-BR' ? '🇧🇷 PT' : '🇺🇸 EN'}
        </button>
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-full border transition-all"
          style={{borderColor:'rgba(138,43,226,0.2)', color:'#a855f7', background:'rgba(138,43,226,0.05)'}}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image
              src="/logo.png"
              alt="RazePague"
              width={200}
              height={56}
              className="object-contain"
              priority
            />
          </div>
          <p className="text-sm" style={{color: mutedColor}}>{t('auth.login_title')}</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-card border" style={{background: cardBg, borderColor}}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: theme === 'light' ? '#374151' : '#d1d5db'}}>{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color: mutedColor}} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border pl-10 pr-4 py-3 rounded-xl transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                  style={{background: inputBg, borderColor, color: textColor}}
                  placeholder={t('auth.email_placeholder')}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: theme === 'light' ? '#374151' : '#d1d5db'}}>{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color: mutedColor}} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full border pl-10 pr-12 py-3 rounded-xl transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
                  style={{background: inputBg, borderColor, color: textColor}}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{color: mutedColor}}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right -mt-1">
              <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                Esqueceu a senha?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-purple text-white py-3 rounded-xl font-semibold shadow-neon-purple-sm hover:shadow-neon-purple transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />
                  {t('auth.logging_in')}
                </>
              ) : t('auth.login_button')}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{color: mutedColor}}>
            {t('auth.no_account')}{' '}
            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              {t('auth.sign_up')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

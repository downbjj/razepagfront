'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)

    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch {
      // Always show success to prevent email enumeration
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0a0f' }}>
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image src="/logo.png" alt="Razepag" width={220} height={66} className="object-contain" priority />
          </div>
        </div>

        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: '#0d0d14', border: '1px solid rgba(168,85,247,0.2)' }}>
          {sent ? (
            /* Success state */
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <CheckCircle className="w-7 h-7 text-green-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white mb-2">E-mail enviado!</h1>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Se o endereço <span className="text-purple-300 font-medium">{email}</span> estiver cadastrado,
                  você receberá um link para redefinir sua senha em instantes.
                </p>
                <p className="text-xs text-gray-600 mt-3">
                  Verifique também a pasta de spam.
                </p>
              </div>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors mt-2"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para o login
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="mb-6">
                <h1 className="text-lg font-bold text-white">Esqueceu sua senha?</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Informe seu e-mail para receber o link de redefinição.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white focus:outline-none transition-all"
                      style={{ background: '#141414', border: '1px solid rgba(168,85,247,0.25)' }}
                      placeholder="seu@email.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                  style={{ background: 'linear-gradient(135deg, #A855F7, #6a0dad)', boxShadow: '0 0 20px rgba(168,85,247,0.25)' }}
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : 'Enviar link de redefinição'
                  }
                </button>
              </form>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors mt-5"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para o login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

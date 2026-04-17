'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!token) {
      toast.error('Link inválido ou expirado')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.newPassword.length < 8) return toast.error('Senha deve ter pelo menos 8 caracteres')
    if (form.newPassword !== form.confirmPassword) return toast.error('As senhas não coincidem')

    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, newPassword: form.newPassword })
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Token inválido ou expirado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0a0f' }}>
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image src="/logo.png" alt="Razepag" width={220} height={66} className="object-contain" priority />
          </div>
        </div>

        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: '#0d0d14', border: '1px solid rgba(168,85,247,0.2)' }}>
          {!token ? (
            <div className="text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto" />
              <div>
                <h1 className="text-lg font-bold text-white">Link inválido</h1>
                <p className="text-sm text-gray-500 mt-1">Este link é inválido ou expirou.</p>
              </div>
              <Link href="/forgot-password"
                className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors">
                Solicitar novo link
              </Link>
            </div>
          ) : done ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <CheckCircle className="w-7 h-7 text-green-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Senha redefinida!</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Sua senha foi alterada com sucesso. Redirecionando para o login...
                </p>
              </div>
              <Link href="/login"
                className="flex items-center justify-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Ir para o login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-lg font-bold text-white">Criar nova senha</h1>
                <p className="text-sm text-gray-500 mt-1">Escolha uma senha forte para sua conta.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Nova senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      required
                      value={form.newPassword}
                      onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
                      className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white focus:outline-none transition-all"
                      style={{ background: '#141414', border: '1px solid rgba(168,85,247,0.25)' }}
                      placeholder="Mínimo 8 caracteres"
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowNew(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {form.newPassword.length > 0 && form.newPassword.length < 8 && (
                    <p className="text-xs text-red-400 mt-1">Mínimo 8 caracteres</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirmar senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      value={form.confirmPassword}
                      onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                      className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white focus:outline-none transition-all"
                      style={{ background: '#141414', border: '1px solid rgba(168,85,247,0.25)' }}
                      placeholder="Repita a nova senha"
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {form.confirmPassword && form.confirmPassword !== form.newPassword && (
                    <p className="text-xs text-red-400 mt-1">As senhas não coincidem</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !form.newPassword || !form.confirmPassword}
                  className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                  style={{ background: 'linear-gradient(135deg, #A855F7, #6a0dad)', boxShadow: '0 0 20px rgba(168,85,247,0.25)' }}
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : 'Redefinir Senha'
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0f' }}>
        <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}

'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Shield, Lock, Eye, EyeOff, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

export default function SecurityPage() {
  const qc = useQueryClient()
  const [pinForm, setPinForm] = useState({ currentPin: '', newPin: '', confirmPin: '' })
  const [showPin, setShowPin] = useState(false)

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/users/me').then(r => r.data.data),
  })
  const { data: pinStatus, refetch: refetchPin } = useQuery({
    queryKey: ['pinStatus'],
    queryFn: () => api.get('/users/me/pin/status').then(r => r.data.data),
  })

  const hasPin = pinStatus?.hasPin ?? profile?.hasPin ?? false

  const setupPinMutation = useMutation({
    mutationFn: (data: any) => api.post('/users/me/pin', data).then(r => r.data),
    onSuccess: () => {
      setPinForm({ currentPin: '', newPin: '', confirmPin: '' })
      refetchPin()
      qc.invalidateQueries({ queryKey: ['profile'] })
      toast.success(hasPin ? 'PIN alterado com sucesso!' : 'PIN configurado com sucesso!')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Erro ao configurar PIN'),
  })

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pinForm.newPin.length < 4) return toast.error('PIN deve ter pelo menos 4 dígitos')
    if (pinForm.newPin !== pinForm.confirmPin) return toast.error('Os PINs não coincidem')
    if (hasPin && !pinForm.currentPin) return toast.error('Informe o PIN atual')
    setupPinMutation.mutate({
      pin:        pinForm.newPin,
      currentPin: hasPin ? pinForm.currentPin : undefined,
    })
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Segurança da Conta</h1>
        <p className="text-xs text-gray-500 mt-0.5">Gerencie seu PIN de transação e configurações de segurança</p>
      </div>

      {/* Account status cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Cash-in (Receber)',     value: profile?.cashInEnabled,    },
          { label: 'Cash-out (Sacar)',       value: profile?.cashOutEnabled,   },
          { label: 'API habilitada',         value: profile?.apiEnabled,       },
          { label: 'Conta Ativada',          value: profile?.accountActivated, },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: '#111118', border: '1px solid rgba(168,85,247,0.12)' }}>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.value ? 'bg-green-400' : 'bg-gray-600'}`} />
            <span className="text-xs text-gray-400">{item.label}</span>
            <span className={`ml-auto text-xs font-medium ${item.value ? 'text-green-400' : 'text-gray-600'}`}>
              {item.value ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        ))}
      </div>

      {/* PIN section */}
      <div className="rounded-2xl p-5 space-y-4"
        style={{ background: '#111118', border: '1px solid rgba(168,85,247,0.15)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white">PIN de Transação</h2>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
            hasPin
              ? 'text-green-400 bg-green-400/10'
              : 'text-yellow-400 bg-yellow-400/10'
          }`}>
            {hasPin
              ? <><CheckCircle className="w-3 h-3" /> Configurado</>
              : <><AlertTriangle className="w-3 h-3" /> Não configurado</>
            }
          </span>
        </div>

        {!hasPin && (
          <div className="text-xs text-yellow-400 px-3 py-2 rounded-lg flex items-start gap-2"
            style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)' }}>
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            Configure um PIN para proteger suas transferências e saques.
          </div>
        )}

        <form onSubmit={handlePinSubmit} className="space-y-4">
          {hasPin && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">PIN atual</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={6}
                  value={pinForm.currentPin}
                  onChange={e => setPinForm(f => ({ ...f, currentPin: e.target.value.replace(/\D/g, '') }))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none tracking-widest"
                  style={{ background: '#0d0d14', border: '1px solid rgba(168,85,247,0.2)' }}
                  placeholder="••••"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              {hasPin ? 'Novo PIN' : 'PIN'} (4–6 dígitos)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={6}
                required
                value={pinForm.newPin}
                onChange={e => setPinForm(f => ({ ...f, newPin: e.target.value.replace(/\D/g, '') }))}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-white focus:outline-none tracking-widest"
                style={{ background: '#0d0d14', border: '1px solid rgba(168,85,247,0.2)' }}
                placeholder="••••"
              />
              <button type="button" onClick={() => setShowPin(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirmar PIN</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                maxLength={6}
                required
                value={pinForm.confirmPin}
                onChange={e => setPinForm(f => ({ ...f, confirmPin: e.target.value.replace(/\D/g, '') }))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none tracking-widest"
                style={{ background: '#0d0d14', border: '1px solid rgba(168,85,247,0.2)' }}
                placeholder="••••"
              />
            </div>
            {pinForm.confirmPin && pinForm.confirmPin !== pinForm.newPin && (
              <p className="text-xs text-red-400 mt-1">Os PINs não coincidem</p>
            )}
          </div>

          <button
            type="submit"
            disabled={setupPinMutation.isPending || !pinForm.newPin || !pinForm.confirmPin}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
            style={{ background: 'linear-gradient(135deg, #A855F7, #6a0dad)', boxShadow: '0 0 14px rgba(168,85,247,0.25)' }}
          >
            {setupPinMutation.isPending
              ? <RefreshCw className="w-4 h-4 animate-spin" />
              : <Shield className="w-4 h-4" />
            }
            {hasPin ? 'Alterar PIN' : 'Configurar PIN'}
          </button>
        </form>
      </div>

      {/* 2FA (coming soon) */}
      <div className="rounded-2xl p-5 opacity-60"
        style={{ background: '#111118', border: '1px solid rgba(168,85,247,0.1)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white">Autenticação de Dois Fatores (2FA)</h2>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full text-gray-500"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            Em breve
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Adicione uma camada extra de segurança com aplicativo autenticador (Google Authenticator / Authy).
        </p>
      </div>
    </div>
  )
}

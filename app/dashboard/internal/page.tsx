'use client'

import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Users, DollarSign, FileText, CheckCircle, Gift, AtSign, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

export default function InternalTransferPage() {
  const [form, setForm] = useState({ username: '', amount: '', description: '', pin: '' })
  const [result, setResult] = useState<any>(null)
  const [showPin, setShowPin] = useState(false)

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/users/me').then(r => r.data.data),
  })
  const { data: pinStatus } = useQuery({
    queryKey: ['pinStatus'],
    queryFn: () => api.get('/users/me/pin/status').then(r => r.data.data),
  })

  const balance = parseFloat(meData?.wallet?.balance || '0')
  const hasPin  = pinStatus?.hasPin ?? false

  const transfer = useMutation({
    mutationFn: (data: any) =>
      api.post('/pix/internal-transfer', data).then(r => r.data.data),
    onSuccess: (data) => {
      setResult(data)
      toast.success('Transferência realizada!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Erro na transferência')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (!form.username.trim()) return toast.error('Informe o @username do destinatário')
    if (!amount || amount <= 0)  return toast.error('Informe um valor válido')
    if (amount > balance)        return toast.error('Saldo insuficiente')
    transfer.mutate({
      username:    form.username.replace(/^@/, ''),
      amount,
      description: form.description || undefined,
      pin:         form.pin || undefined,
    })
  }

  if (result) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="rounded-2xl p-8 text-center space-y-4"
          style={{ background: '#111118', border: '1px solid rgba(34,197,94,0.2)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'rgba(34,197,94,0.1)' }}>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Transferência Realizada!</h2>
            <p className="text-gray-400 text-sm mt-1">Sem taxas cobradas</p>
          </div>
          <div className="rounded-xl p-4 text-left space-y-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Valor</span>
              <span className="text-white font-medium">{formatCurrency(result.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Taxa</span>
              <span className="text-green-400 text-sm font-medium">Grátis</span>
            </div>
            <div className="flex justify-between border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <span className="text-gray-500 text-sm">Destinatário</span>
              <span className="text-white text-sm">{result.recipient?.name}</span>
            </div>
          </div>
          <button
            onClick={() => { setResult(null); setForm({ username: '', amount: '', description: '', pin: '' }) }}
            className="w-full py-3 text-sm text-purple-400 rounded-xl transition-all"
            style={{ border: '1px solid rgba(168,85,247,0.3)' }}
          >
            Nova Transferência
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Transferência Interna</h1>
        <p className="text-xs text-gray-500 mt-0.5">Transferência entre contas RazePag — sem custos</p>
      </div>

      {/* Free badge */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
        style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
        <Gift className="w-4 h-4 text-green-400 flex-shrink-0" />
        <p className="text-xs text-green-400">
          Transferências entre contas RazePag são <strong>completamente gratuitas</strong> — sem taxa alguma.
        </p>
      </div>

      {/* Balance */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl"
        style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
        <span className="text-gray-400 text-sm">Saldo disponível</span>
        <span className="text-white font-bold">{formatCurrency(balance)}</span>
      </div>

      <div className="rounded-2xl p-5 space-y-4"
        style={{ background: '#111118', border: '1px solid rgba(168,85,247,0.15)' }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              @Username do destinatário <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text" required
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value.replace(/^@/, '') }))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                style={{ background: '#0d0d14', border: '1px solid rgba(168,85,247,0.2)' }}
                placeholder="usuario"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
              <Users className="w-3 h-3" />
              Somente usuários cadastrados na RazePag
            </p>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Valor (R$) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="number" required min="0.01" step="0.01"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                style={{ background: '#0d0d14', border: '1px solid rgba(168,85,247,0.2)' }}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Descrição</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text" maxLength={140}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                style={{ background: '#0d0d14', border: '1px solid rgba(168,85,247,0.2)' }}
                placeholder="Opcional"
              />
            </div>
          </div>

          {/* PIN */}
          {hasPin && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                PIN de transação <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={6}
                  value={form.pin}
                  onChange={e => setForm(f => ({ ...f, pin: e.target.value.replace(/\D/g, '') }))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all tracking-widest"
                  style={{ background: '#0d0d14', border: '1px solid rgba(168,85,247,0.2)' }}
                  placeholder="••••"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={transfer.isPending || !form.username || !form.amount}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            style={{ background: 'linear-gradient(135deg, #A855F7, #6a0dad)', boxShadow: '0 0 14px rgba(168,85,247,0.25)' }}
          >
            {transfer.isPending ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enviando...</>
            ) : (
              <><Users className="w-4 h-4" />Transferir (Grátis)</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

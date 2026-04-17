'use client'

import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Send, DollarSign, Hash, FileText, CheckCircle, Users, Gift } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatCurrency, calculateFee, calculateNet } from '@/lib/utils'

export default function TransferPage() {
  const [form, setForm] = useState({ pixKey: '', amount: '', description: '' })
  const [result, setResult] = useState<any>(null)

  const amt = parseFloat(form.amount) || 0
  const fee = amt > 0 ? calculateFee(amt) : 0
  const total = amt > 0 ? amt + fee : 0

  const { data: walletData } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => api.get('/users/me').then(r => r.data.data),
  })
  const balance = parseFloat(walletData?.wallet?.balance || '0')

  const transfer = useMutation({
    mutationFn: (data: any) => api.post('/pix/send', data).then(r => r.data.data),
    onSuccess: (data) => {
      setResult(data)
      toast.success('Transferência concluída!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Erro na transferência')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (total > balance) {
      toast.error('Saldo insuficiente (valor + taxa)')
      return
    }
    transfer.mutate({
      pixKey: form.pixKey,
      amount: parseFloat(form.amount),
      description: form.description || undefined,
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
            <h2 className="text-xl font-bold text-white">Transferência Concluída!</h2>
            <p className="text-gray-400 text-sm mt-1">Fundos enviados com sucesso</p>
          </div>
          <div className="rounded-xl p-4 text-left space-y-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Valor</span>
              <span className="text-white font-medium">{formatCurrency(result.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Taxa</span>
              <span className="text-gray-400">{formatCurrency(result.fee)}</span>
            </div>
            <div className="flex justify-between border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <span className="text-gray-500 text-sm">Destinatário</span>
              <span className="text-white text-sm">{result.recipient?.name}</span>
            </div>
          </div>
          <button onClick={() => { setResult(null); setForm({ pixKey: '', amount: '', description: '' }) }}
            className="w-full py-3 text-sm text-purple-400 rounded-xl transition-all"
            style={{ border: '1px solid rgba(138,43,226,0.3)' }}>
            Nova Transferência
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Transferir via PIX</h1>
        <p className="text-xs text-gray-500 mt-0.5">Enviar para chave PIX externa (taxa aplicada)</p>
      </div>

      {/* Internal transfer tip */}
      <Link href="/dashboard/internal"
        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:opacity-90"
        style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
        <Gift className="w-4 h-4 text-green-400 flex-shrink-0" />
        <div>
          <p className="text-xs text-green-400 font-medium">Transferência Interna — Grátis!</p>
          <p className="text-xs text-green-400/60">Envie para usuários RazePag por @username sem nenhuma taxa.</p>
        </div>
        <Users className="w-4 h-4 text-green-400 ml-auto flex-shrink-0" />
      </Link>

      {/* Balance */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl"
        style={{ background: 'rgba(138,43,226,0.08)', border: '1px solid rgba(138,43,226,0.2)' }}>
        <span className="text-gray-400 text-sm">Saldo disponível</span>
        <span className="text-white font-bold">{formatCurrency(balance)}</span>
      </div>

      <div className="rounded-2xl p-5 space-y-4"
        style={{ background: '#111118', border: '1px solid rgba(138,43,226,0.15)' }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Chave PIX do destinatário *</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text" required value={form.pixKey}
                onChange={e => setForm(f => ({ ...f, pixKey: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                style={{ background: '#0d0d14', border: '1px solid rgba(138,43,226,0.2)' }}
                placeholder="E-mail, CPF, telefone ou chave aleatória"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Valor (R$) *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="number" required min="0.01" max={balance} step="0.01"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                style={{ background: '#0d0d14', border: '1px solid rgba(138,43,226,0.2)' }}
                placeholder="0.00"
              />
            </div>
          </div>

          {amt > 0 && (
            <div className="rounded-xl px-4 py-3 space-y-1.5 text-sm"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex justify-between">
                <span className="text-gray-500">Valor da transferência</span>
                <span className="text-white">{formatCurrency(amt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Taxa (3% + R$1,00)</span>
                <span className="text-red-400">+ {formatCurrency(fee)}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-1.5 font-semibold">
                <span className="text-gray-400">Total debitado</span>
                <span className={total > balance ? 'text-red-400' : 'text-white'}>{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Descrição</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text" maxLength={140}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                style={{ background: '#0d0d14', border: '1px solid rgba(138,43,226,0.2)' }}
                placeholder="Opcional"
              />
            </div>
          </div>

          <button
            type="submit" disabled={transfer.isPending || !form.pixKey || !form.amount}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
            style={{ background: 'linear-gradient(135deg, #8A2BE2, #6a0dad)', boxShadow: '0 0 14px rgba(138,43,226,0.25)' }}
          >
            {transfer.isPending ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enviando...</>
            ) : (
              <><Send className="w-4 h-4" />Enviar PIX</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

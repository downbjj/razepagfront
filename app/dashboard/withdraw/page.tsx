'use client'

import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Download, Hash, DollarSign, Building, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

export default function WithdrawPage() {
  const [form, setForm] = useState({ amount: '', pixKey: '', pixKeyType: 'EMAIL', bankName: '' })

  const { data: userData } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/users/me').then(r => r.data.data),
  })
  const balance = parseFloat(userData?.wallet?.balance || '0')

  const withdraw = useMutation({
    mutationFn: (data: any) => api.post('/pix/send', data).then(r => r.data.data),
    onSuccess: () => {
      toast.success('Saque solicitado! Processando via PIX...')
      setForm({ amount: '', pixKey: '', pixKeyType: 'EMAIL', bankName: '' })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Falha no saque')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    const fee = amount * 0.03 + 1.00
    if (amount + fee > balance) {
      toast.error('Saldo insuficiente (incluindo taxa)')
      return
    }
    withdraw.mutate({ amount, pixKey: form.pixKey, description: form.bankName ? `Saque - ${form.bankName}` : undefined })
  }

  const amount = parseFloat(form.amount) || 0
  const fee = parseFloat((amount * 0.03 + 1.00).toFixed(2))
  const youReceive = amount

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Withdraw</h1>
        <p className="text-gray-500 text-sm mt-1">Cash out to your PIX key</p>
      </div>

      {/* Balance */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex items-center justify-between">
        <span className="text-gray-400 text-sm">Available Balance</span>
        <span className="text-white font-bold text-lg">{formatCurrency(balance)}</span>
      </div>

      {/* Info */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-400">
          <p className="font-medium text-yellow-400 mb-1">Política de Saque</p>
          <ul className="space-y-1 text-xs">
            <li>• Taxa: 3% + R$1,00 por saque</li>
            <li>• Mínimo: R$10,00</li>
            <li>• Processamento automático via PIX</li>
          </ul>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">PIX Key Type</label>
            <select
              value={form.pixKeyType} onChange={e => setForm(f => ({ ...f, pixKeyType: e.target.value }))}
              className="w-full bg-surface-2 border border-border text-white px-4 py-3 rounded-xl focus:border-purple-500 transition-all"
            >
              <option value="EMAIL">Email</option>
              <option value="CPF">CPF</option>
              <option value="CNPJ">CNPJ</option>
              <option value="PHONE">Phone</option>
              <option value="EVP">Random Key (EVP)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">PIX Key *</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text" required value={form.pixKey} onChange={e => setForm(f => ({ ...f, pixKey: e.target.value }))}
                className="w-full bg-surface-2 border border-border text-white pl-10 pr-4 py-3 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all placeholder-gray-600"
                placeholder="Your destination PIX key"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bank (optional)</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text" value={form.bankName} onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))}
                className="w-full bg-surface-2 border border-border text-white pl-10 pr-4 py-3 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all placeholder-gray-600"
                placeholder="e.g. Nubank, Itaú..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Amount (R$) *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="number" required min="10" max={balance} step="0.01"
                value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full bg-surface-2 border border-border text-white text-lg pl-10 pr-4 py-3 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all placeholder-gray-600"
                placeholder="Min R$10.00"
              />
            </div>
          </div>

          {/* Fee summary */}
          {amount > 0 && (
            <div className="bg-surface-2 border border-border rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="text-white">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Taxa (3% + R$1,00)</span>
                <span className="text-red-400">-{formatCurrency(fee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total debitado</span>
                <span className="text-white">{formatCurrency(amount + fee)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-medium">
                <span className="text-gray-300">Destinatário recebe</span>
                <span className="text-green-400">{formatCurrency(youReceive)}</span>
              </div>
            </div>
          )}

          <button
            type="submit" disabled={withdraw.isPending || !form.pixKey || !form.amount}
            className="w-full bg-gradient-purple text-white py-3 rounded-xl font-semibold shadow-neon-purple-sm hover:shadow-neon-purple transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {withdraw.isPending ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />Processando...</>
            ) : (
              <><Download className="w-4 h-4" />Solicitar Saque</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

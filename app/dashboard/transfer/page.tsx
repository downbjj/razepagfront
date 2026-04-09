'use client'

import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Send, DollarSign, Hash, FileText, CheckCircle, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

export default function TransferPage() {
  const [form, setForm] = useState({ pixKey: '', amount: '', description: '' })
  const [result, setResult] = useState<any>(null)

  const { data: walletData } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => api.get('/users/me').then(r => r.data.data),
  })
  const balance = parseFloat(walletData?.wallet?.balance || '0')

  const transfer = useMutation({
    mutationFn: (data: any) => api.post('/pix/transfer', data).then(r => r.data.data),
    onSuccess: (data) => {
      setResult(data)
      toast.success('Transfer completed!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Transfer failed')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (parseFloat(form.amount) > balance) {
      toast.error('Insufficient balance')
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
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-surface border border-green-500/20 rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Transfer Completed!</h2>
            <p className="text-gray-400 text-sm mt-1">Funds sent successfully</p>
          </div>
          <div className="bg-surface-2 border border-border rounded-xl p-4 text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Amount</span>
              <span className="text-white font-medium">{formatCurrency(result.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Fee</span>
              <span className="text-gray-400">{formatCurrency(result.fee)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-gray-500 text-sm">Recipient</span>
              <span className="text-white text-sm">{result.recipient?.name}</span>
            </div>
          </div>
          <button onClick={() => { setResult(null); setForm({ pixKey: '', amount: '', description: '' }) }}
            className="w-full py-3 text-sm text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500/10 transition-all">
            New Transfer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Transfer</h1>
        <p className="text-gray-500 text-sm mt-1">Send funds to another PayGateway user</p>
      </div>

      {/* Balance */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex items-center justify-between">
        <span className="text-gray-400 text-sm">Available Balance</span>
        <span className="text-white font-bold text-lg">{formatCurrency(balance)}</span>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Recipient PIX Key *</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text" required value={form.pixKey} onChange={e => setForm(f => ({ ...f, pixKey: e.target.value }))}
                className="w-full bg-surface-2 border border-border text-white pl-10 pr-4 py-3 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all placeholder-gray-600"
                placeholder="Email, CPF, phone, or PIX key"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Only transfers to users registered on this platform
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Amount (R$) *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="number" required min="0.01" max={balance} step="0.01"
                value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full bg-surface-2 border border-border text-white text-lg pl-10 pr-4 py-3 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all placeholder-gray-600"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text" maxLength={140}
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                className="w-full bg-surface-2 border border-border text-white pl-10 pr-4 py-3 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all placeholder-gray-600"
                placeholder="Optional description"
              />
            </div>
          </div>

          <button
            type="submit" disabled={transfer.isPending || !form.pixKey || !form.amount}
            className="w-full bg-gradient-purple text-white py-3 rounded-xl font-semibold shadow-neon-purple-sm hover:shadow-neon-purple transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {transfer.isPending ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />Sending...</>
            ) : (
              <><Send className="w-4 h-4" />Send Transfer</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

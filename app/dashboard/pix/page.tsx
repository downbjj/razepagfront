'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QrCode, Copy, Check, RefreshCw, DollarSign, FileText, Clock, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatCurrency, calculateFee, calculateNet } from '@/lib/utils'

export default function PixChargePage() {
  const qc = useQueryClient()
  const [form, setForm]   = useState({ amount: '', description: '' })
  const [charge, setCharge] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  // Poll the transaction status while it's PENDING
  const { data: statusData } = useQuery({
    queryKey: ['pix-status', charge?.id],
    queryFn:  () => api.get(`/pix/transactions/${charge.id}`).then(r => r.data.data),
    enabled:  !!charge?.id && charge?.status === 'PENDING',
    refetchInterval: 5000,
    onSuccess: (data: any) => {
      if (data.status === 'PAID') {
        toast.success('Pagamento confirmado! Saldo creditado.')
        qc.invalidateQueries({ queryKey: ['dashboard'] })
        setCharge((prev: any) => ({ ...prev, status: 'PAID' }))
      } else if (data.status === 'CANCELLED' || data.status === 'FAILED') {
        setCharge((prev: any) => ({ ...prev, status: data.status }))
      }
    },
  } as any)

  const txStatus = statusData?.status || charge?.status

  const createCharge = useMutation({
    mutationFn: (data: any) => api.post('/pix/charge', data).then(r => r.data.data),
    onSuccess: (data: any) => {
      // API returns: { id, amount, fee, netAmount, status, pix: { qrCode, copyPaste, expiresAt } }
      setCharge(data)
      toast.success('QR Code gerado! Aguardando pagamento...')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Erro ao criar cobrança')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (isNaN(amount) || amount <= 0) return
    createCharge.mutate({ amount, description: form.description || undefined })
  }

  const copyToClipboard = async () => {
    const text = charge?.pix?.copyPaste
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Código PIX copiado!')
      setTimeout(() => setCopied(false), 3000)
    } catch {
      toast.error('Não foi possível copiar. Copie manualmente.')
    }
  }

  const reset = () => {
    setCharge(null)
    setForm({ amount: '', description: '' })
    setCopied(false)
  }

  const amt = parseFloat(form.amount) || 0
  const fee = amt > 0 ? calculateFee(amt) : 0
  const net = amt > 0 ? calculateNet(amt) : 0

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Cobrar via PIX</h1>
        <p className="text-gray-500 text-sm mt-1">Gere um QR Code para receber pagamento</p>
      </div>

      {!charge ? (
        <div className="bg-surface border border-border rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Valor (R$) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="number" required min="2" max="50000" step="0.01"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white text-lg pl-10 pr-4 py-3 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all placeholder-gray-600"
                  placeholder="0,00"
                />
              </div>

              {/* Fee breakdown */}
              {amt > 0 && (
                <div className="mt-2 text-xs rounded-lg px-3 py-2.5 space-y-1" style={{background:'rgba(138,43,226,0.06)',border:'1px solid rgba(138,43,226,0.15)'}}>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Valor da cobrança</span>
                    <span className="text-white">{formatCurrency(amt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Taxa (3% + R$1,00)</span>
                    <span className="text-red-400">- {formatCurrency(fee)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-1 font-semibold">
                    <span className="text-gray-400">Você recebe</span>
                    <span className="text-green-400">{formatCurrency(net > 0 ? net : 0)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Descrição <span className="text-gray-600">(opcional)</span></label>
              <div className="relative">
                <FileText className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="text" maxLength={140}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white pl-10 pr-4 py-3 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all placeholder-gray-600"
                  placeholder="Ex: Pedido #1234, Assinatura mensal..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={createCharge.isPending || !form.amount || amt <= 0}
              className="w-full bg-gradient-purple text-white py-3 rounded-xl font-semibold shadow-neon-purple-sm hover:shadow-neon-purple transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createCharge.isPending ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />Gerando...</>
              ) : (
                <><QrCode className="w-4 h-4" />Gerar QR Code</>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-5 animate-fade-in">
          {/* Status header */}
          <div className="text-center">
            {txStatus === 'PAID' ? (
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Pagamento Confirmado!</span>
              </div>
            ) : txStatus === 'CANCELLED' || txStatus === 'FAILED' ? (
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-4">
                <span className="text-red-400 text-sm font-medium">Cobrança cancelada</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-4">
                <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="text-yellow-400 text-sm font-medium">Aguardando Pagamento</span>
              </div>
            )}

            <p className="text-3xl font-bold text-white">{formatCurrency(charge.amount)}</p>
            <p className="text-xs text-gray-500 mt-1">
              Você recebe: <span className="text-green-400 font-semibold">{formatCurrency(charge.netAmount)}</span>
            </p>
            {charge.description && <p className="text-gray-400 text-sm mt-1">{charge.description}</p>}
          </div>

          {/* QR Code — shown while pending */}
          {txStatus !== 'PAID' && charge.pix?.qrCode && (
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                <img
                  src={charge.pix.qrCode}
                  alt="PIX QR Code"
                  className="w-52 h-52"
                />
              </div>
            </div>
          )}

          {/* Copy & Paste — shown while pending */}
          {txStatus !== 'PAID' && charge.pix?.copyPaste && (
            <div>
              <p className="text-xs text-gray-500 mb-2 text-center">Ou use o código Copia e Cola:</p>
              <div className="bg-surface-2 border border-border rounded-xl p-3 flex items-center gap-3">
                <p className="flex-1 text-xs text-gray-300 font-mono truncate">
                  {charge.pix.copyPaste.slice(0, 55)}...
                </p>
                <button
                  onClick={copyToClipboard}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3 py-1.5 rounded-lg hover:bg-purple-500/20 transition-all"
                >
                  {copied
                    ? <><Check className="w-3 h-3" />Copiado!</>
                    : <><Copy className="w-3 h-3" />Copiar</>
                  }
                </button>
              </div>
            </div>
          )}

          {/* Expiry */}
          {txStatus !== 'PAID' && charge.pix?.expiresAt && (
            <p className="text-xs text-gray-600 text-center">
              Expira em: {new Date(charge.pix.expiresAt).toLocaleString('pt-BR')}
            </p>
          )}

          {/* Transaction ID */}
          <div className="bg-surface-2 border border-border/50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-600">ID da Transação</p>
            <p className="text-xs font-mono text-gray-400 mt-0.5 break-all">{charge.id}</p>
          </div>

          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-400 hover:text-white border border-border hover:border-border-bright rounded-xl transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Nova Cobrança
          </button>
        </div>
      )}
    </div>
  )
}

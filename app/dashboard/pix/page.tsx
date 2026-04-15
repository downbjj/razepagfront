'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { QrCode, Copy, Check, RefreshCw, DollarSign, FileText, Clock, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatCurrency, calculateFee, calculateNet } from '@/lib/utils'

export default function PixChargePage() {
  const qc     = useQueryClient()
  const router = useRouter()
  const [form, setForm]     = useState({ amount: '', description: '' })
  const [charge, setCharge] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [paid, setPaid]     = useState(false)

  // Poll the transaction status while it's PENDING
  const { data: statusData } = useQuery({
    queryKey:       ['pix-status', charge?.id],
    queryFn:        () => api.get(`/pix/transactions/${charge.id}`).then(r => r.data.data),
    enabled:        !!charge?.id && !paid,
    refetchInterval: 4000,
  })

  // Detect confirmation via useEffect (React Query v5 removed onSuccess)
  useEffect(() => {
    if (!statusData) return
    if (statusData.status === 'PAID' && !paid) {
      setPaid(true)
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      // Redirect after 3s
      setTimeout(() => router.push('/dashboard'), 3000)
    } else if (statusData.status === 'CANCELLED' || statusData.status === 'FAILED') {
      setCharge((prev: any) => ({ ...prev, status: statusData.status }))
    }
  }, [statusData, paid, qc, router])

  const txStatus = statusData?.status || charge?.status

  const createCharge = useMutation({
    mutationFn: (data: any) => api.post('/pix/charge', data).then(r => r.data.data),
    onSuccess: (data: any) => {
      setCharge(data)
      setPaid(false)
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
    setPaid(false)
  }

  const amt = parseFloat(form.amount) || 0
  const fee = amt > 0 ? calculateFee(amt) : 0
  const net = amt > 0 ? calculateNet(amt) : 0

  // ── Tela de sucesso ────────────────────────────────────────────────────────
  if (paid) {
    return (
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-fade-in">
        {/* Ícone animado */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(34,197,94,0.12)',
            border: '2px solid rgba(34,197,94,0.4)',
            boxShadow: '0 0 40px rgba(34,197,94,0.25)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          <CheckCircle2 className="w-12 h-12 text-green-400" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">Pagamento Confirmado!</h2>
          <p className="text-gray-400 mt-2 text-sm">
            <span className="text-green-400 font-semibold">{formatCurrency(charge?.netAmount || 0)}</span> creditado no seu saldo
          </p>
        </div>

        {/* Resumo */}
        <div
          className="w-full rounded-2xl px-5 py-4 text-sm space-y-2.5"
          style={{ background: '#111118', border: '1px solid rgba(34,197,94,0.2)' }}
        >
          <div className="flex justify-between">
            <span className="text-gray-500">Valor pago</span>
            <span className="text-white font-medium">{formatCurrency(charge?.amount || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Taxa</span>
            <span className="text-red-400">- {formatCurrency(charge?.fee || 0)}</span>
          </div>
          <div className="flex justify-between border-t pt-2" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <span className="text-gray-400 font-semibold">Você recebeu</span>
            <span className="text-green-400 font-bold">{formatCurrency(charge?.netAmount || 0)}</span>
          </div>
        </div>

        <p className="text-xs text-gray-600">Redirecionando para o painel em instantes...</p>

        <div className="flex gap-3 w-full">
          <button
            onClick={reset}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Nova Cobrança
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #8A2BE2, #6a0dad)', boxShadow: '0 0 18px rgba(138,43,226,0.35)' }}
          >
            Ir ao Painel
          </button>
        </div>
      </div>
    )
  }

  // ── Formulário + QR ────────────────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Cobrar via PIX</h1>
        <p className="text-gray-500 text-sm mt-1">Gere um QR Code para receber pagamento</p>
      </div>

      {!charge ? (
        <div className="bg-surface border border-border rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
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
              {amt > 0 && (
                <div className="mt-2 text-xs rounded-lg px-3 py-2.5 space-y-1" style={{ background: 'rgba(138,43,226,0.06)', border: '1px solid rgba(138,43,226,0.15)' }}>
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
              {createCharge.isPending
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />Gerando...</>
                : <><QrCode className="w-4 h-4" />Gerar QR Code</>
              }
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-5 animate-fade-in">
          {/* Status */}
          <div className="text-center">
            {txStatus === 'CANCELLED' || txStatus === 'FAILED' ? (
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

          {/* QR Code */}
          {charge.pix?.qrCode && (
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                <img src={charge.pix.qrCode} alt="PIX QR Code" className="w-52 h-52" />
              </div>
            </div>
          )}

          {/* Copy & Paste */}
          {charge.pix?.copyPaste && (
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
                  {copied ? <><Check className="w-3 h-3" />Copiado!</> : <><Copy className="w-3 h-3" />Copiar</>}
                </button>
              </div>
            </div>
          )}

          {/* Expiry */}
          {charge.pix?.expiresAt && (
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

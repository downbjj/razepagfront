'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Wallet, TrendingUp, BarChart2, Hash,
  ArrowDownLeft, ArrowUpRight, RefreshCw, QrCode, Send,
  X, Copy, Check, AlertTriangle, CreditCard, ExternalLink,
  Users, Lock, AtSign, Gift
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from 'recharts'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import {
  formatCurrency, formatDate,
  TRANSACTION_TYPE_LABELS, getStatusBadgeClass, TRANSACTION_STATUS_LABELS,
  isCredit, getTransactionColor, getTransactionSign
} from '@/lib/utils'

// ─── Sparkline mini chart ──────────────────────────────────────────────────────
function Spark({ color }: { color: string }) {
  const data = [3, 7, 4, 9, 6, 11, 8].map((v, i) => ({ v }))
  return (
    <ResponsiveContainer width={80} height={36}>
      <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <defs>
          <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone" dataKey="v"
          stroke={color} strokeWidth={1.5}
          fill={`url(#sg-${color.replace('#', '')})`}
          dot={false} isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Metric card ──────────────────────────────────────────────────────────────
function MetricCard({ title, value, color, sparkColor, change }: {
  title: string; value: string; color: string; sparkColor: string; change?: string
}) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: '#111118', border: '1px solid rgba(138,43,226,0.15)' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{title}</p>
          <p className="text-xl font-bold" style={{ color }}>{value}</p>
          {change && <p className="text-xs text-gray-600 mt-0.5">{change}</p>}
        </div>
        <Spark color={sparkColor} />
      </div>
    </div>
  )
}

// ─── PIX modal ────────────────────────────────────────────────────────────────
function PixModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ amount: '', description: '' })
  const [charge, setCharge] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  const createCharge = useMutation({
    mutationFn: (data: any) => api.post('/pix/charge', data).then(r => r.data.data),
    onSuccess: (data: any) => {
      setCharge(data)
      toast.success('QR Code gerado!')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Erro ao gerar cobrança'),
  })

  const copy = async () => {
    if (!charge?.pix?.copyPaste) return
    await navigator.clipboard.writeText(charge.pix.copyPaste)
    setCopied(true)
    toast.success('Código copiado!')
    setTimeout(() => setCopied(false), 3000)
  }

  const amt = parseFloat(form.amount) || 0
  const fee = amt > 0 ? parseFloat((amt * 0.03 + 1).toFixed(2)) : 0
  const net = amt > 0 ? Math.max(0, parseFloat((amt - fee).toFixed(2))) : 0

  return (
    <ModalWrap title="Adicionar créditos via PIX" onClose={onClose}>
      {!charge ? (
        <form onSubmit={e => { e.preventDefault(); if (amt > 0) createCharge.mutate({ amount: amt, description: form.description || undefined }) }} className="space-y-4">
          <Field label="Valor (R$)">
            <input
              type="number" min="2" max="50000" step="0.01" required
              value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className="modal-input" placeholder="0,00"
            />
          </Field>
          {amt > 0 && (
            <div className="text-xs rounded-xl px-4 py-3 space-y-1.5" style={{ background: 'rgba(138,43,226,0.06)', border: '1px solid rgba(138,43,226,0.15)' }}>
              <Row label="Valor" val={formatCurrency(amt)} />
              <Row label="Taxa (3% + R$1,00)" val={`- ${formatCurrency(fee)}`} valClass="text-red-400" />
              <div className="border-t pt-1.5" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <Row label="Você recebe" val={formatCurrency(net)} valClass="text-green-400 font-semibold" />
              </div>
            </div>
          )}
          <Field label="Descrição (opcional)">
            <input
              type="text" maxLength={140}
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="modal-input" placeholder="Ex: Pedido #1234"
            />
          </Field>
          <PurpleBtn disabled={createCharge.isPending || amt <= 0} loading={createCharge.isPending}>
            <QrCode className="w-4 h-4" /> Gerar QRCODE
          </PurpleBtn>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          <p className="text-2xl font-bold text-white">{formatCurrency(charge.amount)}</p>
          <p className="text-xs text-gray-500">Você recebe: <span className="text-green-400 font-semibold">{formatCurrency(charge.netAmount)}</span></p>
          {(charge.pix?.copyPaste || charge.pix?.qrCode) && (
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-2xl shadow">
                <img
                  src={charge.pix?.copyPaste
                    ? `https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(charge.pix.copyPaste)}`
                    : charge.pix.qrCode}
                  alt="QR Code PIX" className="w-48 h-48"
                />
              </div>
            </div>
          )}
          {charge.pix?.copyPaste && (
            <button onClick={copy} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'rgba(138,43,226,0.12)', border: '1px solid rgba(138,43,226,0.3)', color: '#c084fc' }}>
              {copied ? <><Check className="w-4 h-4" />Copiado!</> : <><Copy className="w-4 h-4" />Copiar código Pix Copia e Cola</>}
            </button>
          )}
          <button onClick={() => { setCharge(null); setForm({ amount: '', description: '' }); qc.invalidateQueries({ queryKey: ['dashboard'] }) }}
            className="text-xs text-gray-500 hover:text-white transition-colors">
            Nova cobrança
          </button>
        </div>
      )}
    </ModalWrap>
  )
}

// ─── Withdraw modal ───────────────────────────────────────────────────────────
function WithdrawModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ pixKey: '', amount: '', description: '', pin: '' })

  const withdraw = useMutation({
    mutationFn: (data: any) => api.post('/transactions/withdraw', data).then(r => r.data.data),
    onSuccess: () => {
      toast.success('Saque solicitado com sucesso!')
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      onClose()
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Erro ao solicitar saque'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (isNaN(amount) || amount < 10) return toast.error('Valor mínimo R$ 10,00')
    withdraw.mutate({ pixKey: form.pixKey, amount })
  }

  return (
    <ModalWrap title="Gerar saque" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Chave PIX">
          <input required value={form.pixKey} onChange={e => setForm(f => ({ ...f, pixKey: e.target.value }))}
            className="modal-input" placeholder="CPF, e-mail, telefone ou chave aleatória" />
        </Field>
        <Field label="Valor (R$)">
          <input type="number" min="10" max="50000" step="0.01" required
            value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            className="modal-input" placeholder="0,00" />
        </Field>
        <Field label="Descrição (opcional)">
          <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="modal-input" placeholder="Ex: Saque mensal" maxLength={140} />
        </Field>
        <Field label="PIN (6 dígitos)">
          <input type="password" inputMode="numeric" maxLength={6} required
            value={form.pin} onChange={e => setForm(f => ({ ...f, pin: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
            className="modal-input text-center tracking-widest text-xl" placeholder="••••••" />
        </Field>
        <PurpleBtn disabled={withdraw.isPending} loading={withdraw.isPending}>
          <Send className="w-4 h-4" /> Transferir agora
        </PurpleBtn>
      </form>
    </ModalWrap>
  )
}

// ─── Internal Transfer modal ─────────────────────────────────────────────────
function InternalTransferModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [form, setForm] = useState({ username: '', amount: '', description: '', pin: '' })
  const [done, setDone] = useState<any>(null)

  const transfer = useMutation({
    mutationFn: (data: any) => api.post('/pix/internal-transfer', data).then(r => r.data.data),
    onSuccess: (data: any) => {
      setDone(data)
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Erro na transferência'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(form.amount)
    if (!form.username.trim()) return toast.error('Informe o usuário recebedor')
    if (!amount || amount <= 0) return toast.error('Informe um valor válido')
    transfer.mutate({
      username:    form.username.replace(/^@/, ''),
      amount,
      description: form.description || undefined,
      pin:         form.pin || undefined,
    })
  }

  if (done) {
    return (
      <ModalWrap title="Nova Transferência Interna" onClose={onClose}>
        <div className="space-y-4 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <Check className="w-7 h-7 text-green-400" />
          </div>
          <p className="text-white font-semibold">Transferência realizada!</p>
          <div className="text-xs rounded-xl px-4 py-3 space-y-1.5 text-left"
            style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <Row label="Valor" val={`R$ ${parseFloat(form.amount).toFixed(2)}`} valClass="text-white" />
            <Row label="Taxa" val="Grátis" valClass="text-green-400 font-semibold" />
            <Row label="Destinatário" val={done.recipient?.name || `@${form.username}`} valClass="text-white" />
          </div>
          <button onClick={() => { setDone(null); setForm({ username: '', amount: '', description: '', pin: '' }) }}
            className="text-xs text-gray-500 hover:text-white transition-colors">
            Nova transferência
          </button>
        </div>
      </ModalWrap>
    )
  }

  return (
    <ModalWrap title="Nova Transferência Interna" onClose={onClose}>
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4"
        style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
        <Gift className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
        <p className="text-xs text-green-400">Transferências internas são <strong>gratuitas</strong></p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Usuário recebedor">
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            <input
              required
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value.replace(/^@/, '').toLowerCase() }))}
              className="modal-input pl-9"
              placeholder="username"
            />
          </div>
        </Field>
        <Field label="Valor *">
          <input
            type="number" min="0.01" step="0.01" required
            value={form.amount}
            onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            className="modal-input" placeholder="R$ 0,00"
          />
        </Field>
        <Field label="Descrição">
          <input
            maxLength={140}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="modal-input" placeholder="Opcional"
          />
        </Field>
        <Field label="Confirme seu PIN *">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            <input
              type="password"
              inputMode="numeric" maxLength={6}
              value={form.pin}
              onChange={e => setForm(f => ({ ...f, pin: e.target.value.replace(/\D/g, '') }))}
              className="modal-input pl-9 tracking-widest"
              placeholder="••••"
            />
          </div>
        </Field>
        <PurpleBtn disabled={transfer.isPending || !form.username || !form.amount} loading={transfer.isPending}>
          <Users className="w-4 h-4" /> Enviar pagamento
        </PurpleBtn>
      </form>
    </ModalWrap>
  )
}

// ─── Checkout Pro modal ───────────────────────────────────────────────────────
function CheckoutModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ title: '', amount: '' })
  const [link, setLink] = useState<string | null>(null)

  const createPreference = useMutation({
    mutationFn: (data: any) => api.post('/checkout/preference', data).then(r => r.data.data),
    onSuccess: (data: any) => {
      // sandboxUrl para testes, initPoint para produção
      setLink(data.sandboxUrl || data.initPoint)
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Erro ao criar preferência'),
  })

  const amt = parseFloat(form.amount) || 0

  return (
    <ModalWrap title="Checkout Pro — Mercado Pago" onClose={onClose}>
      {!link ? (
        <form onSubmit={e => {
          e.preventDefault()
          if (amt > 0 && form.title.trim()) {
            createPreference.mutate({ title: form.title.trim(), amount: amt })
          }
        }} className="space-y-4">
          <Field label="Descrição do produto / serviço">
            <input
              required maxLength={100}
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="modal-input" placeholder="Ex: Plano Premium, Consultoria..."
            />
          </Field>
          <Field label="Valor (R$)">
            <input
              type="number" min="0.01" step="0.01" required
              value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className="modal-input" placeholder="0,00"
            />
          </Field>
          {amt > 0 && (
            <div className="text-xs rounded-xl px-4 py-3" style={{ background: 'rgba(138,43,226,0.06)', border: '1px solid rgba(138,43,226,0.15)' }}>
              <Row label="Valor a cobrar" val={formatCurrency(amt)} />
              <p className="text-gray-600 mt-1.5">O cliente paga pelo checkout do Mercado Pago (cartão, PIX, boleto)</p>
            </div>
          )}
          <PurpleBtn disabled={createPreference.isPending || amt <= 0 || !form.title.trim()} loading={createPreference.isPending}>
            <CreditCard className="w-4 h-4" /> Gerar link de pagamento
          </PurpleBtn>
        </form>
      ) : (
        <div className="space-y-4 text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <Check className="w-7 h-7 text-green-400" />
          </div>
          <p className="text-white font-semibold">Link gerado com sucesso!</p>
          <p className="text-xs text-gray-500">Compartilhe o link abaixo com seu cliente</p>
          <a
            href={link} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #009ee3, #007bb5)', boxShadow: '0 0 18px rgba(0,158,227,0.3)' }}
          >
            <ExternalLink className="w-4 h-4" /> Abrir checkout
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(link)
              toast.success('Link copiado!')
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all"
            style={{ background: 'rgba(138,43,226,0.08)', border: '1px solid rgba(138,43,226,0.2)', color: '#c084fc' }}
          >
            <Copy className="w-3.5 h-3.5" /> Copiar link
          </button>
          <button onClick={() => { setLink(null); setForm({ title: '', amount: '' }) }}
            className="text-xs text-gray-500 hover:text-white transition-colors">
            Novo link
          </button>
        </div>
      )}
    </ModalWrap>
  )
}

// ─── Shared modal chrome ──────────────────────────────────────────────────────
function ModalWrap({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: '#111118', border: '1px solid rgba(138,43,226,0.25)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Row({ label, val, valClass }: { label: string; val: string; valClass?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={valClass || 'text-white'}>{val}</span>
    </div>
  )
}

function PurpleBtn({ children, disabled, loading }: { children: React.ReactNode; disabled?: boolean; loading?: boolean }) {
  return (
    <button type="submit" disabled={disabled}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
      style={{ background: 'linear-gradient(135deg, #8A2BE2, #6a0dad)', boxShadow: '0 0 18px rgba(138,43,226,0.35)' }}>
      {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : children}
    </button>
  )
}

// ─── Custom tooltip for area chart ────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-xs shadow-lg" style={{ background: '#1a1a24', border: '1px solid rgba(138,43,226,0.2)' }}>
      <p className="text-gray-400 mb-1 font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey === 'deposits' ? 'Depósitos' : 'Saques'}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [showPix, setShowPix] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showInternal, setShowInternal] = useState(false)
  const [chartTab, setChartTab] = useState<'deposits' | 'withdrawals'>('deposits')

  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/users/dashboard').then(r => r.data.data),
    refetchInterval: 15000,
  })

  const user         = dashboardData?.user
  const wallet       = user?.wallet
  const transactions = dashboardData?.recentTransactions || []
  const weeklyData   = dashboardData?.weeklyData || []
  const summary      = dashboardData?.summary || {}

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-[1200px]">
      {/* Modals */}
      {showPix && <PixModal onClose={() => setShowPix(false)} />}
      {showWithdraw && <WithdrawModal onClose={() => setShowWithdraw(false)} />}
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
      {showInternal && <InternalTransferModal onClose={() => setShowInternal(false)} />}

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Olá, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-xs text-gray-500 mt-0.5">Bem-vindo ao seu painel</p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Atualizar
        </button>
      </div>

      {/* ── 4 Metric cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          title="Saldo Disp."
          value={formatCurrency(wallet?.balance || 0)}
          color="#22c55e"
          sparkColor="#22c55e"
          change="Disponível para saque"
        />
        <MetricCard
          title="Faturamento"
          value={formatCurrency(summary.monthlyReceived || 0)}
          color="#c084fc"
          sparkColor="#8A2BE2"
          change="Este mês"
        />
        <MetricCard
          title="Ticket Médio"
          value={formatCurrency(summary.ticketMedio || 0)}
          color="#60a5fa"
          sparkColor="#3b82f6"
          change={`${summary.monthlyCount || 0} transações`}
        />
        <MetricCard
          title="Transações"
          value={String(summary.transactionCount || 0)}
          color="#f59e0b"
          sparkColor="#f59e0b"
          change={`${summary.pendingCount || 0} pendentes`}
        />
      </div>

      {/* ── Bloqueio Cautelar ── */}
      {(wallet?.pendingBalance || 0) > 0 && (
        <div className="rounded-2xl px-5 py-4 flex items-center gap-4"
          style={{ background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.2)' }}>
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-yellow-300">Bloqueio Cautelar</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatCurrency(wallet.pendingBalance)} em análise · {summary.pendingCount || 0} transação(ões) pendente(s)
            </p>
          </div>
        </div>
      )}

      {/* ── Chart + Summary row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* 7-day area chart */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: '#111118', border: '1px solid rgba(138,43,226,0.15)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Movimentação Dos Últimos 7 Dias</h2>
              <p className="text-xs text-gray-500 mt-0.5">Visão diária consolidada</p>
            </div>
            <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(138,43,226,0.2)' }}>
              {(['deposits', 'withdrawals'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setChartTab(tab)}
                  className="text-xs px-3 py-1.5 transition-all font-medium"
                  style={chartTab === tab
                    ? { background: 'rgba(138,43,226,0.25)', color: '#c084fc' }
                    : { color: '#6b7280' }}
                >
                  {tab === 'deposits' ? 'Depósitos' : 'Saques'}
                </button>
              ))}
            </div>
          </div>

          {weeklyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gDeposits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gWithdrawals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => v === 0 ? '0' : `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                {chartTab === 'deposits'
                  ? <Area type="monotone" dataKey="deposits" stroke="#22c55e" strokeWidth={2} fill="url(#gDeposits)" dot={false} />
                  : <Area type="monotone" dataKey="withdrawals" stroke="#ef4444" strokeWidth={2} fill="url(#gWithdrawals)" dot={false} />
                }
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-44 flex items-center justify-center text-gray-600 text-sm">Sem dados ainda</div>
          )}
        </div>

        {/* Monthly report */}
        <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: '#111118', border: '1px solid rgba(138,43,226,0.15)' }}>
          <h2 className="text-sm font-semibold text-white">Relatório Do Mês Atual</h2>

          <div className="flex-1 space-y-3">
            <div className="rounded-xl p-4" style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <p className="text-xs text-gray-500 mb-1">Total Entradas</p>
              <p className="text-lg font-bold text-green-400">{formatCurrency(summary.monthlyReceived || 0)}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <p className="text-xs text-gray-500 mb-1">Total Saídas</p>
              <p className="text-lg font-bold text-red-400">{formatCurrency(summary.monthlySent || 0)}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'rgba(138,43,226,0.07)', border: '1px solid rgba(138,43,226,0.15)' }}>
              <p className="text-xs text-gray-500 mb-1">Saldo Líquido</p>
              <p className="text-lg font-bold text-purple-300">
                {formatCurrency(Math.max(0, (summary.monthlyReceived || 0) - (summary.monthlySent || 0)))}
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => setShowPix(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #8A2BE2, #6a0dad)', boxShadow: '0 0 12px rgba(138,43,226,0.3)' }}
            >
              <QrCode className="w-3.5 h-3.5" /> Receber
            </button>
            <button
              onClick={() => setShowWithdraw(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-gray-300 transition-all hover:bg-white/5"
              style={{ border: '1px solid rgba(138,43,226,0.25)' }}
            >
              <Send className="w-3.5 h-3.5" /> Sacar
            </button>
          </div>
          <button
            onClick={() => setShowInternal(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
            style={{ border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', background: 'rgba(34,197,94,0.06)' }}
          >
            <Users className="w-3.5 h-3.5" /> Transferência Interna (Grátis)
          </button>
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #009ee3, #007bb5)', boxShadow: '0 0 12px rgba(0,158,227,0.25)' }}
          >
            <CreditCard className="w-3.5 h-3.5" /> Checkout Pro
          </button>
        </div>
      </div>

      {/* ── Recent transactions ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#111118', border: '1px solid rgba(138,43,226,0.15)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(138,43,226,0.1)' }}>
          <h2 className="text-sm font-semibold text-white">Resumo Últimas Transações</h2>
          <a href="/dashboard/transactions" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
            Ver todas →
          </a>
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 text-center text-gray-600 text-sm">
            <ArrowUpRight className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Nenhuma transação ainda
          </div>
        ) : (
          <div>
            {transactions.map((tx: any, i: number) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                style={i < transactions.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.04)' } : {}}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCredit(tx.type) ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}>
                  {isCredit(tx.type)
                    ? <ArrowDownLeft className="w-4 h-4 text-green-400" />
                    : <ArrowUpRight  className="w-4 h-4 text-red-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {TRANSACTION_TYPE_LABELS[tx.type] || tx.type}
                  </p>
                  <p className="text-xs text-gray-600">{formatDate(tx.createdAt)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-semibold ${getTransactionColor(tx.type)}`}>
                    {getTransactionSign(tx.type)}{formatCurrency(tx.type === 'DEPOSIT' ? (tx.netAmount ?? tx.amount) : tx.amount)}
                  </p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${getStatusBadgeClass(tx.status)}`}>
                    {TRANSACTION_STATUS_LABELS[tx.status] || tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Users, TrendingUp, DollarSign, Activity,
  RefreshCw, Search, Ban, CheckCircle, SlidersHorizontal
} from 'lucide-react'
import api from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="rounded-xl p-5" style={{background:'#0d0d0d',border:'1px solid #1f1f1f'}}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color || 'text-white'}`}>{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{background:'rgba(168,85,247,0.1)'}}>
          <Icon className="w-5 h-5" style={{color:'#A855F7'}} />
        </div>
      </div>
    </div>
  )
}

export default function RazeControlPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [balanceUserId, setBalanceUserId] = useState('')
  const [balanceAmount, setBalanceAmount] = useState('')
  const [balanceNote, setBalanceNote] = useState('')

  const { data: overview, isLoading: loadingOverview, refetch } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => api.get('/admin/overview').then(r => r.data.data),
    refetchInterval: 15000,
  })

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users-raze', search],
    queryFn: () => api.get(`/admin/users?search=${search}&limit=20`).then(r => r.data.data),
  })

  const { data: recentTx } = useQuery({
    queryKey: ['admin-recent-tx'],
    queryFn: () => api.get('/admin/transactions?limit=10').then(r => r.data.data),
    refetchInterval: 10000,
  })

  const freezeMutation = useMutation({
    mutationFn: ({ id, freeze }: { id: string; freeze: boolean }) =>
      api.patch(`/admin/users/${id}/${freeze ? 'freeze' : 'unfreeze'}`),
    onSuccess: (_, vars) => {
      toast.success(vars.freeze ? 'Usuário congelado' : 'Usuário ativado')
      qc.invalidateQueries({ queryKey: ['admin-users-raze'] })
    },
    onError: () => toast.error('Erro ao alterar status'),
  })

  const adjustMutation = useMutation({
    mutationFn: () => api.post(`/admin/users/${balanceUserId}/adjust-balance`, {
      amount: parseFloat(balanceAmount),
      note: balanceNote || 'Ajuste manual pelo Admin',
    }),
    onSuccess: () => {
      toast.success('Saldo ajustado!')
      setBalanceUserId(''); setBalanceAmount(''); setBalanceNote('')
      qc.invalidateQueries({ queryKey: ['admin-users-raze'] })
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro ao ajustar saldo'),
  })

  const users = usersData?.users || usersData || []
  const transactions = recentTx?.transactions || recentTx || []

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Raze Control</h1>
          <p className="text-gray-500 text-sm mt-1">Painel central de controle — RazePague</p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Usuários"      value={overview?.totalUsers ?? '—'}                         icon={Users}     />
        <StatCard title="Total Movimentado"   value={formatCurrency(overview?.totalVolume ?? 0)}           icon={TrendingUp} color="text-green-400" />
        <StatCard title="Total em Taxas"      value={formatCurrency(overview?.totalFees ?? 0)}             icon={DollarSign} color="text-purple-400" />
        <StatCard title="Transações Hoje"     value={overview?.transactionsToday ?? '—'}                   icon={Activity}  />
      </div>

      {/* Usuários + Ajuste */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Lista de usuários */}
        <div className="xl:col-span-2 rounded-2xl overflow-hidden" style={{background:'#0d0d0d',border:'1px solid #1f1f1f'}}>
          <div className="p-5 flex items-center justify-between" style={{borderBottom:'1px solid #1f1f1f'}}>
            <h2 className="font-semibold text-white">Usuários</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar usuário..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-black border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none w-48"
                style={{borderColor:'#2a2a2a'}}
              />
            </div>
          </div>

          {loadingUsers ? (
            <div className="p-8 text-center text-gray-600 text-sm">Carregando...</div>
          ) : (
            <div className="divide-y" style={{borderColor:'#1f1f1f'}}>
              {users.slice(0, 10).map((u: any) => (
                <div key={u.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{u.name}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-sm font-semibold text-green-400">{formatCurrency(u.wallet?.balance ?? 0)}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {u.status}
                    </span>
                  </div>
                  <button
                    onClick={() => freezeMutation.mutate({ id: u.id, freeze: u.status === 'ACTIVE' })}
                    className="flex-shrink-0 p-1.5 rounded-lg transition-all hover:bg-white/5"
                    title={u.status === 'ACTIVE' ? 'Congelar' : 'Ativar'}
                  >
                    {u.status === 'ACTIVE'
                      ? <Ban className="w-4 h-4 text-red-400" />
                      : <CheckCircle className="w-4 h-4 text-green-400" />
                    }
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ajuste de saldo */}
        <div className="rounded-2xl p-6" style={{background:'#0d0d0d',border:'1px solid #1f1f1f'}}>
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal className="w-5 h-5" style={{color:'#A855F7'}} />
            <h2 className="font-semibold text-white">Ajustar Saldo</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">ID do Usuário</label>
              <input
                type="text"
                placeholder="uuid do usuário"
                value={balanceUserId}
                onChange={e => setBalanceUserId(e.target.value)}
                className="w-full bg-black border rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none font-mono"
                style={{borderColor:'#2a2a2a'}}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Valor (positivo = crédito, negativo = débito)</label>
              <input
                type="number"
                step="0.01"
                placeholder="ex: 100.00 ou -50.00"
                value={balanceAmount}
                onChange={e => setBalanceAmount(e.target.value)}
                className="w-full bg-black border rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none"
                style={{borderColor:'#2a2a2a'}}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Motivo (opcional)</label>
              <input
                type="text"
                placeholder="Motivo do ajuste..."
                value={balanceNote}
                onChange={e => setBalanceNote(e.target.value)}
                className="w-full bg-black border rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none"
                style={{borderColor:'#2a2a2a'}}
              />
            </div>
            <button
              onClick={() => adjustMutation.mutate()}
              disabled={!balanceUserId || !balanceAmount || adjustMutation.isPending}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
              style={{background:'#A855F7'}}
            >
              {adjustMutation.isPending ? 'Ajustando...' : 'Aplicar Ajuste'}
            </button>
          </div>
        </div>
      </div>

      {/* Últimas transações em tempo real */}
      <div className="rounded-2xl overflow-hidden" style={{background:'#0d0d0d',border:'1px solid #1f1f1f'}}>
        <div className="p-5 flex items-center justify-between" style={{borderBottom:'1px solid #1f1f1f'}}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <h2 className="font-semibold text-white">Últimas Transações em Tempo Real</h2>
          </div>
          <span className="text-xs text-gray-600">Atualiza a cada 10s</span>
        </div>
        <div className="divide-y" style={{borderColor:'#1f1f1f'}}>
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-600 text-sm">Nenhuma transação ainda</div>
          ) : transactions.map((tx: any) => (
            <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type?.includes('IN') ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                <Activity className={`w-4 h-4 ${tx.type?.includes('IN') ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{tx.user?.name || tx.userId?.slice(0, 8)}</p>
                <p className="text-xs text-gray-600">{tx.type} · {formatDate(tx.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${tx.type?.includes('IN') ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type?.includes('IN') ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
                <p className="text-xs text-gray-600">taxa: {formatCurrency(tx.fee || 0)}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${tx.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400' : tx.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-gray-500/10 text-gray-400'}`}>
                {tx.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { Users, ArrowUpDown, DollarSign, TrendingUp, Clock, AlertTriangle, ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react'
import api from '@/lib/api'
import { formatCurrency, formatDate, TRANSACTION_TYPE_LABELS, getStatusBadgeClass, TRANSACTION_STATUS_LABELS, getTransactionColor } from '@/lib/utils'

function AdminStatCard({ title, value, icon: Icon, color, bg, subtitle }: any) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboardPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then(r => r.data.data),
    refetchInterval: 60000,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full spinner" />
      </div>
    )
  }

  // API returns flat fields — normalize for display
  const users = {
    total:  data?.totalUsers   || 0,
    active: data?.activeUsers  || 0,
    frozen: data?.frozenUsers  || 0,
  }
  const transactions = {
    total:   data?.totalTransactions   || 0,
    pending: data?.pendingTransactions || 0,
    today:   data?.transactionsToday   || 0,
  }
  const financials = {
    totalBalance:    data?.balanceTotal || 0,
    completedVolume: data?.totalVolume  || 0,
    totalFees:       data?.totalFees    || 0,
  }
  const recentTransactions = data?.recentTransactions || []

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time platform metrics</p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <RefreshCw className="w-4 h-4" />Refresh
        </button>
      </div>

      {/* User stats */}
      <div>
        <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">Users</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminStatCard title="Total Users" value={users?.total || 0} icon={Users} color="text-white" bg="bg-surface-2" />
          <AdminStatCard title="Active" value={users?.active || 0} icon={Users} color="text-green-400" bg="bg-green-500/10" />
          <AdminStatCard title="Frozen" value={users?.frozen || 0} icon={AlertTriangle} color="text-red-400" bg="bg-red-500/10" />
        </div>
      </div>

      {/* Financial stats */}
      <div>
        <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">Financials</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            title="Total Balance (All)" value={formatCurrency(financials?.totalBalance || 0)}
            icon={DollarSign} color="text-purple-400" bg="bg-purple-500/10" subtitle="Sum of all wallets"
          />
          <AdminStatCard
            title="Completed Volume" value={formatCurrency(financials?.completedVolume || 0)}
            icon={TrendingUp} color="text-green-400" bg="bg-green-500/10" subtitle="All time"
          />
          <AdminStatCard
            title="Total Fees Collected" value={formatCurrency(financials?.totalFees || 0)}
            icon={DollarSign} color="text-yellow-400" bg="bg-yellow-500/10" subtitle="Revenue"
          />
          <AdminStatCard
            title="Pending Txns" value={transactions?.pending || 0}
            icon={Clock} color="text-orange-400" bg="bg-orange-500/10" subtitle="Needs attention"
          />
        </div>
      </div>

      {/* Recent transactions */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Recent Transactions</h2>
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentTransactions?.slice(0, 15).map((tx: any) => (
                  <tr key={tx.id} className="table-row-hover">
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-sm text-white">{tx.user?.name}</p>
                        <p className="text-xs text-gray-600">{tx.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-gray-300">{TRANSACTION_TYPE_LABELS[tx.type]}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-sm font-medium ${getTransactionColor(tx.type)}`}>
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(tx.status)}`}>
                        {TRANSACTION_STATUS_LABELS[tx.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-500">{formatDate(tx.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

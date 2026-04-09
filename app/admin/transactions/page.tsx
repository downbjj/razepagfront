'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '@/lib/api'
import { formatCurrency, formatDate, TRANSACTION_TYPE_LABELS, getStatusBadgeClass, TRANSACTION_STATUS_LABELS, getTransactionColor } from '@/lib/utils'

export default function AdminTransactionsPage() {
  const [page, setPage] = useState(1)
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-transactions', page, type, status],
    queryFn: () => api.get('/admin/transactions', { params: { page, limit: 25, type: type || undefined, status: status || undefined } }).then(r => r.data.data),
    keepPreviousData: true,
  } as any)

  const transactions = data?.transactions || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">All Transactions</h1>
        <p className="text-gray-500 text-sm mt-1">{data?.total?.toLocaleString() || 0} total transactions</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={type} onChange={e => { setType(e.target.value); setPage(1) }}
          className="bg-surface border border-border text-white px-4 py-2 rounded-xl text-sm focus:border-red-500/50 transition-all">
          <option value="">All Types</option>
          <option value="PIX_IN">PIX In</option>
          <option value="PIX_OUT">PIX Out</option>
          <option value="TRANSFER_IN">Transfer In</option>
          <option value="TRANSFER_OUT">Transfer Out</option>
          <option value="WITHDRAWAL">Withdrawal</option>
          <option value="ADJUSTMENT">Adjustment</option>
        </select>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="bg-surface border border-border text-white px-4 py-2 rounded-xl text-sm focus:border-red-500/50 transition-all">
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        {(type || status) && (
          <button onClick={() => { setType(''); setStatus(''); setPage(1) }}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-border rounded-xl transition-all">
            Clear
          </button>
        )}
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full spinner" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['User', 'Type', 'Amount', 'Fee', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((tx: any) => (
                    <tr key={tx.id} className="table-row-hover">
                      <td className="px-5 py-3">
                        <div>
                          <p className="text-sm text-white">{tx.user?.name}</p>
                          <p className="text-xs text-gray-600">{tx.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${tx.type.includes('IN') ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                            {tx.type.includes('IN') ? <ArrowDownLeft className="w-3 h-3 text-green-400" /> : <ArrowUpRight className="w-3 h-3 text-red-400" />}
                          </div>
                          <span className="text-sm text-gray-300">{TRANSACTION_TYPE_LABELS[tx.type]}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-sm font-medium ${getTransactionColor(tx.type)}`}>
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-gray-500">{formatCurrency(tx.fee)}</span>
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
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-1.5 rounded-lg border border-border disabled:opacity-30 hover:border-red-500/30 transition-all">
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-border disabled:opacity-30 hover:border-red-500/30 transition-all">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

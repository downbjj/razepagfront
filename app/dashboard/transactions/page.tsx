'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import api from '@/lib/api'
import {
  formatCurrency, formatDate,
  getTransactionColor, getTransactionSign, isCredit,
  TRANSACTION_TYPE_LABELS, getStatusBadgeClass, TRANSACTION_STATUS_LABELS
} from '@/lib/utils'

export default function TransactionsPage() {
  const [page, setPage]     = useState(1)
  const [type, setType]     = useState('')
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['transactions', page, type, status],
    queryFn:  () => api.get('/pix/transactions', {
      params: { page, limit: 20, type: type || undefined, status: status || undefined },
    }).then(r => r.data.data),
    keepPreviousData: true,
  } as any)

  const transactions = data?.transactions || []
  const totalPages   = data?.totalPages   || 1
  const total        = data?.total        || 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Transações</h1>
        <p className="text-gray-500 text-sm mt-1">Histórico completo de todas as suas movimentações</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={type}
          onChange={e => { setType(e.target.value); setPage(1) }}
          className="bg-surface border border-border text-white px-4 py-2 rounded-xl text-sm focus:border-purple-500 transition-all"
        >
          <option value="">Todos os tipos</option>
          <option value="DEPOSIT">PIX Recebido</option>
          <option value="WITHDRAW">Saque / PIX Enviado</option>
          <option value="TRANSFER">Transferência</option>
          <option value="ADJUSTMENT">Ajuste</option>
        </select>

        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="bg-surface border border-border text-white px-4 py-2 rounded-xl text-sm focus:border-purple-500 transition-all"
        >
          <option value="">Todos os status</option>
          <option value="PENDING">Pendente</option>
          <option value="PAID">Pago</option>
          <option value="PROCESSING">Processando</option>
          <option value="FAILED">Falhou</option>
          <option value="CANCELLED">Cancelado</option>
        </select>

        {(type || status) && (
          <button
            onClick={() => { setType(''); setStatus(''); setPage(1) }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-white border border-border hover:border-border-bright rounded-xl transition-all"
          >
            <X className="w-3.5 h-3.5" />
            Limpar
          </button>
        )}

        {total > 0 && (
          <span className="ml-auto text-xs text-gray-500">{total} transações</span>
        )}
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full spinner" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <ArrowUpRight className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Nenhuma transação encontrada</p>
            {(type || status) && (
              <p className="text-xs mt-1">Tente remover os filtros</p>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Taxa</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Líquido</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((tx: any) => (
                    <tr key={tx.id} className="table-row-hover">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCredit(tx.type) ? 'bg-green-500/10' : 'bg-red-500/10'
                          }`}>
                            {isCredit(tx.type)
                              ? <ArrowDownLeft className="w-3.5 h-3.5 text-green-400" />
                              : <ArrowUpRight  className="w-3.5 h-3.5 text-red-400" />
                            }
                          </div>
                          <div>
                            <p className="text-sm text-white">{TRANSACTION_TYPE_LABELS[tx.type] || tx.type}</p>
                            {tx.description && (
                              <p className="text-xs text-gray-600 truncate max-w-xs">{tx.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-sm font-semibold ${getTransactionColor(tx.type)}`}>
                          {getTransactionSign(tx.type)}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className="text-sm text-gray-500">
                          {Number(tx.fee) > 0 ? formatCurrency(tx.fee) : '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className="text-sm text-gray-300">
                          {tx.type === 'DEPOSIT' ? formatCurrency(tx.netAmount) : '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(tx.status)}`}>
                          {TRANSACTION_STATUS_LABELS[tx.status] || tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className="text-sm text-gray-400">{formatDate(tx.createdAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                <p className="text-xs text-gray-500">Página {page} de {totalPages}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg border border-border disabled:opacity-30 hover:border-purple-500/30 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-border disabled:opacity-30 hover:border-purple-500/30 transition-all"
                  >
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

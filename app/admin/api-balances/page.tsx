'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Wallet, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function ApiBalancesPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-api-balances', page],
    queryFn: () => api.get('/admin/api-balances', { params: { page, limit: 20 } }).then(r => r.data.data),
    refetchInterval: 30000,
  })

  const users      = data?.users      || []
  const totalPages = data?.totalPages || 1
  const totals     = data?.systemTotals

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Saldos API</h1>
        <p className="text-gray-500 text-sm mt-1">Visão geral dos saldos de todos os usuários</p>
      </div>

      {/* System totals */}
      {totals && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Saldo Total', value: formatCurrency(totals.balance ?? 0), color: 'text-purple-400' },
            { label: 'Pendente Total', value: formatCurrency(totals.pendingBalance ?? 0), color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="bg-surface border border-border rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full spinner" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Wallet className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Nenhum usuário encontrado</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Usuário', 'Saldo', 'Pendente', 'Depositado', 'Sacado', 'API Keys', 'Transações'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u: any) => (
                    <tr key={u.id} className="table-row-hover">
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-white font-medium">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-green-400">{formatCurrency(u.balance)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-yellow-400">{formatCurrency(u.pendingBalance)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-400">{formatCurrency(u.totalDeposited)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-400">{formatCurrency(u.totalWithdrawn)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-400">{u._count?.apiKeys ?? 0}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-400">{u._count?.transactions ?? 0}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                <p className="text-xs text-gray-500">Página {page} de {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-1.5 rounded-lg border border-border disabled:opacity-30 hover:border-purple-500/30 transition-all">
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-border disabled:opacity-30 hover:border-purple-500/30 transition-all">
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

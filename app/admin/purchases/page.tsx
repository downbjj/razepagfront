'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  PENDING:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  COMPLETED: 'bg-green-500/10  text-green-400  border-green-500/20',
  CANCELLED: 'bg-red-500/10   text-red-400    border-red-500/20',
}

export default function PurchasesPage() {
  const [page, setPage]     = useState(1)
  const [status, setStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-purchases', page, status],
    queryFn: () => api.get('/admin/purchases', {
      params: { page, limit: 20, status: status || undefined },
    }).then(r => r.data.data),
  })

  const purchases  = data?.purchases  || []
  const totalPages = data?.totalPages || 1
  const total      = data?.total      || 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Compras</h1>
        <p className="text-gray-500 text-sm mt-1">{total} compras registradas</p>
      </div>

      <div className="flex gap-3">
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="bg-surface border border-border text-white px-4 py-2 rounded-xl text-sm focus:border-purple-500 transition-all">
          <option value="">Todos os status</option>
          <option value="PENDING">Pendente</option>
          <option value="COMPLETED">Concluído</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full spinner" />
          </div>
        ) : purchases.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Nenhuma compra encontrada</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Usuário', 'Produto', 'Quantidade', 'Valor', 'Status', 'Data'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {purchases.map((p: any) => (
                    <tr key={p.id} className="table-row-hover">
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-white font-medium">{p.user?.name}</p>
                        <p className="text-xs text-gray-500">{p.user?.email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-gray-300">{p.product?.name}</p>
                        <p className="text-xs text-gray-600">{formatCurrency(p.product?.price)} / un</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-400">{p.quantity}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-green-400">{formatCurrency(p.amount)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[p.status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-gray-500">{formatDate(p.createdAt)}</span>
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

'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bitcoin, CheckCircle, XCircle, X, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

const STATUS_COLORS: Record<string, string> = {
  PENDING:    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  PROCESSING: 'bg-blue-500/10   text-blue-400   border-blue-500/20',
  COMPLETED:  'bg-green-500/10  text-green-400  border-green-500/20',
  REJECTED:   'bg-red-500/10   text-red-400    border-red-500/20',
}

export default function CryptoWithdrawalsPage() {
  const qc = useQueryClient()
  const [page, setPage]     = useState(1)
  const [status, setStatus] = useState('PENDING')
  const [reviewModal, setReviewModal] = useState<any>(null)
  const [reviewForm, setReviewForm]   = useState({ action: 'APPROVE', txHash: '', adminNote: '' })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-crypto-withdrawals', page, status],
    queryFn: () => api.get('/admin/crypto-withdrawals', {
      params: { page, limit: 20, status: status || undefined },
    }).then(r => r.data.data),
    refetchInterval: 30000,
  })

  const review = useMutation({
    mutationFn: ({ id, ...d }: any) => api.patch(`/admin/crypto-withdrawals/${id}/review`, d),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['admin-crypto-withdrawals'] })
      setReviewModal(null)
      toast.success(vars.action === 'APPROVE' ? 'Saque aprovado' : 'Saque rejeitado')
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const withdrawals = data?.withdrawals || []
  const totalPages  = data?.totalPages  || 1
  const total       = data?.total       || 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Saques Cripto</h1>
          <p className="text-gray-500 text-sm mt-1">{total} solicitações encontradas</p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>

      <div className="flex gap-3">
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="bg-surface border border-border text-white px-4 py-2 rounded-xl text-sm focus:border-purple-500 transition-all">
          <option value="">Todos</option>
          <option value="PENDING">Pendentes</option>
          <option value="PROCESSING">Em processamento</option>
          <option value="COMPLETED">Concluídos</option>
          <option value="REJECTED">Rejeitados</option>
        </select>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full spinner" />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Bitcoin className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Nenhum saque encontrado</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Usuário', 'Valor', 'Moeda', 'Endereço', 'Rede', 'Status', 'TX Hash', 'Data', 'Ações'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {withdrawals.map((w: any) => (
                    <tr key={w.id} className="table-row-hover">
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-white font-medium">{w.user?.name}</p>
                        <p className="text-xs text-gray-500">{w.user?.email}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm font-semibold text-orange-400">{Number(w.amount).toFixed(8)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-gray-300 font-mono">{w.currency}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-gray-400 font-mono" title={w.address}>
                          {w.address.slice(0, 12)}…{w.address.slice(-6)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-gray-500">{w.network || '—'}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_COLORS[w.status] || ''}`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {w.txHash ? (
                          <span className="text-xs text-blue-400 font-mono" title={w.txHash}>
                            {w.txHash.slice(0, 10)}…
                          </span>
                        ) : <span className="text-xs text-gray-600">—</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-gray-500">{formatDate(w.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {w.status === 'PENDING' && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => { setReviewModal(w); setReviewForm({ action: 'APPROVE', txHash: '', adminNote: '' }) }}
                              className="text-xs px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg hover:bg-green-500/20 transition-all flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Aprovar
                            </button>
                            <button
                              onClick={() => { setReviewModal(w); setReviewForm({ action: 'REJECT', txHash: '', adminNote: '' }) }}
                              className="text-xs px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Rejeitar
                            </button>
                          </div>
                        )}
                        {w.adminNote && w.status !== 'PENDING' && (
                          <p className="text-xs text-gray-600 max-w-[120px] truncate" title={w.adminNote}>{w.adminNote}</p>
                        )}
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

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {reviewForm.action === 'APPROVE' ? 'Aprovar' : 'Rejeitar'} Saque Cripto
              </h3>
              <button onClick={() => setReviewModal(null)} className="text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-surface-2 rounded-xl p-4 text-sm space-y-1">
              <p className="text-gray-400">Usuário: <span className="text-white">{reviewModal.user?.name}</span></p>
              <p className="text-gray-400">Valor: <span className="text-orange-400 font-mono">{Number(reviewModal.amount).toFixed(8)} {reviewModal.currency}</span></p>
              <p className="text-gray-400">Endereço: <span className="text-white font-mono text-xs">{reviewModal.address}</span></p>
              {reviewModal.network && <p className="text-gray-400">Rede: <span className="text-white">{reviewModal.network}</span></p>}
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                {['APPROVE', 'REJECT'].map(a => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={reviewForm.action === a} onChange={() => setReviewForm(f => ({ ...f, action: a }))} className="accent-purple-500" />
                    <span className={`text-sm ${a === 'APPROVE' ? 'text-green-400' : 'text-red-400'}`}>
                      {a === 'APPROVE' ? 'Aprovar' : 'Rejeitar'}
                    </span>
                  </label>
                ))}
              </div>
              {reviewForm.action === 'APPROVE' && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">TX Hash (opcional)</label>
                  <input type="text" value={reviewForm.txHash} onChange={e => setReviewForm(f => ({ ...f, txHash: e.target.value }))}
                    className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600 font-mono"
                    placeholder="0x..." />
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Observação {reviewForm.action === 'REJECT' ? '(obrigatório)' : '(opcional)'}</label>
                <textarea value={reviewForm.adminNote} onChange={e => setReviewForm(f => ({ ...f, adminNote: e.target.value }))} rows={2}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600 resize-none"
                  placeholder={reviewForm.action === 'REJECT' ? 'Motivo da rejeição...' : 'Observação...'} />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => review.mutate({ id: reviewModal.id, action: reviewForm.action, txHash: reviewForm.txHash || undefined, adminNote: reviewForm.adminNote || undefined })}
                disabled={review.isPending || (reviewForm.action === 'REJECT' && !reviewForm.adminNote.trim())}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-all border ${
                  reviewForm.action === 'APPROVE'
                    ? 'bg-green-500/15 border-green-500/30 text-green-400 hover:bg-green-500/25'
                    : 'bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25'
                }`}>
                {review.isPending ? 'Processando...' : reviewForm.action === 'APPROVE' ? 'Confirmar aprovação' : 'Confirmar rejeição'}
              </button>
              <button onClick={() => setReviewModal(null)}
                className="px-4 py-2.5 border border-border text-gray-400 rounded-xl text-sm hover:text-white transition-all">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

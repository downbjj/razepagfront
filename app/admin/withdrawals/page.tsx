'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, X, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminWithdrawalsPage() {
  const qc = useQueryClient()
  const [rejectModal, setRejectModal] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-withdrawals'],
    queryFn: () => api.get('/admin/transactions', { params: { type: 'WITHDRAWAL', status: 'PENDING', limit: 50 } }).then(r => r.data.data),
    refetchInterval: 30000,
  })

  const approve = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/transactions/${id}/approve-withdrawal`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-withdrawals'] }); toast.success('Withdrawal approved') },
    onError: (e: any) => toast.error(e.response?.data?.message),
  })

  const reject = useMutation({
    mutationFn: ({ id, reason }: any) => api.patch(`/admin/transactions/${id}/reject-withdrawal`, { reason }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-withdrawals'] }); setRejectModal(null); toast.success('Withdrawal rejected') },
    onError: (e: any) => toast.error(e.response?.data?.message),
  })

  const withdrawals = data?.transactions || []

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pending Withdrawals</h1>
          <p className="text-gray-500 text-sm mt-1">{withdrawals.length} pending approval</p>
        </div>
        <button onClick={() => refetch()} className="text-sm text-gray-400 hover:text-white transition-colors">Refresh</button>
      </div>

      {withdrawals.length > 0 && (
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 text-sm text-yellow-400">
          {withdrawals.length} withdrawal{withdrawals.length > 1 ? 's' : ''} awaiting approval. Review and approve or reject.
        </div>
      )}

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full spinner" />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Download className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No pending withdrawals</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {withdrawals.map((tx: any) => (
              <div key={tx.id} className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">{tx.user?.name}</p>
                      <p className="text-xs text-gray-500">{tx.user?.email}</p>
                    </div>
                    <div className="text-right ml-auto">
                      <p className="text-lg font-bold text-white">{formatCurrency(tx.amount)}</p>
                      <p className="text-xs text-gray-500">Fee: {formatCurrency(tx.fee)}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-4 text-xs text-gray-600">
                    <span>PIX: <span className="text-gray-300 font-mono">{tx.pixKey}</span></span>
                    <span>Date: {formatDate(tx.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => approve.mutate(tx.id)}
                    disabled={approve.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/20 transition-all disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />Approve
                  </button>
                  <button
                    onClick={() => { setRejectModal(tx.id); setRejectReason('') }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/20 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-white">Reject Withdrawal</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Reason *</label>
              <input type="text" value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                className="w-full bg-surface-2 border border-border text-white px-4 py-3 rounded-xl focus:border-red-500/50 transition-all placeholder-gray-600"
                placeholder="Invalid PIX key, insufficient docs..." />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => reject.mutate({ id: rejectModal, reason: rejectReason })}
                disabled={!rejectReason || reject.isPending}
                className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-all">
                {reject.isPending ? 'Rejecting...' : 'Reject & Refund'}
              </button>
              <button onClick={() => setRejectModal(null)} className="px-4 py-2.5 border border-border text-gray-400 rounded-xl text-sm transition-all hover:text-white">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

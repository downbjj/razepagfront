'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, Search, Freeze, MoreVertical, UserCheck, Snowflake, Plus, DollarSign, Eye } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminUsersPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [adjustModal, setAdjustModal] = useState<{ userId: string; name: string } | null>(null)
  const [adjustForm, setAdjustForm] = useState({ amount: '', description: '' })
  const [freezeModal, setFreezeModal] = useState<{ userId: string; name: string } | null>(null)
  const [freezeReason, setFreezeReason] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search, status],
    queryFn: () => api.get('/admin/users', { params: { page, limit: 20, search: search || undefined, status: status || undefined } }).then(r => r.data.data),
  })

  const freezeUser = useMutation({
    mutationFn: ({ id, reason }: any) => api.patch(`/admin/users/${id}/freeze`, { reason }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); setFreezeModal(null); toast.success('User frozen') },
    onError: (e: any) => toast.error(e.response?.data?.message),
  })

  const unfreezeUser = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/users/${id}/unfreeze`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('User unfrozen') },
  })

  const adjustBalance = useMutation({
    mutationFn: ({ id, ...data }: any) => api.post(`/admin/users/${id}/adjust-balance`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); setAdjustModal(null); toast.success('Balance adjusted') },
    onError: (e: any) => toast.error(e.response?.data?.message),
  })

  const users = data?.users || []

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">{data?.total || 0} total users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full bg-surface border border-border text-white pl-10 pr-4 py-2 rounded-xl text-sm focus:border-red-500/50 transition-all placeholder-gray-600"
            placeholder="Search by name, email, document..."
          />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="bg-surface border border-border text-white px-4 py-2 rounded-xl text-sm focus:border-red-500/50 transition-all">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="FROZEN">Frozen</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full spinner" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-600"><Users className="w-8 h-8 mx-auto mb-2 opacity-40" /><p>No users found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['User', 'Balance', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u: any) => (
                  <tr key={u.id} className="table-row-hover">
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-white">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                        {u.document && <p className="text-xs text-gray-600 font-mono">{u.document}</p>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-green-400">{formatCurrency(u.wallet?.balance || 0)}</p>
                      {parseFloat(u.wallet?.pendingBalance || 0) > 0 && (
                        <p className="text-xs text-yellow-400">+{formatCurrency(u.wallet?.pendingBalance)} pending</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        u.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        u.status === 'FROZEN' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>{u.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-gray-500">{formatDate(u.createdAt)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {u.status === 'ACTIVE' ? (
                          <button onClick={() => { setFreezeModal({ userId: u.id, name: u.name }); setFreezeReason('') }}
                            className="text-xs px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all"
                            title="Freeze">
                            Freeze
                          </button>
                        ) : (
                          <button onClick={() => unfreezeUser.mutate(u.id)}
                            className="text-xs px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg hover:bg-green-500/20 transition-all">
                            Unfreeze
                          </button>
                        )}
                        <button onClick={() => { setAdjustModal({ userId: u.id, name: u.name }); setAdjustForm({ amount: '', description: '' }) }}
                          className="text-xs px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-all">
                          Adjust
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Freeze Modal */}
      {freezeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-white">Freeze Account: {freezeModal.name}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Reason *</label>
              <input type="text" value={freezeReason} onChange={e => setFreezeReason(e.target.value)}
                className="w-full bg-surface-2 border border-border text-white px-4 py-3 rounded-xl focus:border-red-500/50 transition-all placeholder-gray-600"
                placeholder="Suspicious activity detected..." />
            </div>
            <div className="flex gap-3">
              <button onClick={() => freezeUser.mutate({ id: freezeModal.userId, reason: freezeReason })}
                disabled={!freezeReason || freezeUser.isPending}
                className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-red-500/30 transition-all">
                {freezeUser.isPending ? 'Freezing...' : 'Freeze Account'}
              </button>
              <button onClick={() => setFreezeModal(null)} className="px-4 py-2.5 border border-border text-gray-400 rounded-xl text-sm transition-all hover:text-white">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Balance Modal */}
      {adjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-white">Adjust Balance: {adjustModal.name}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Amount (positive = credit, negative = debit) *</label>
              <input type="number" step="0.01" value={adjustForm.amount} onChange={e => setAdjustForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full bg-surface-2 border border-border text-white px-4 py-3 rounded-xl focus:border-yellow-500/50 transition-all placeholder-gray-600"
                placeholder="e.g. 100 or -50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
              <input type="text" value={adjustForm.description} onChange={e => setAdjustForm(f => ({ ...f, description: e.target.value }))}
                className="w-full bg-surface-2 border border-border text-white px-4 py-3 rounded-xl focus:border-yellow-500/50 transition-all placeholder-gray-600"
                placeholder="Support ticket #123..." />
            </div>
            <div className="flex gap-3">
              <button onClick={() => adjustBalance.mutate({ id: adjustModal.userId, amount: parseFloat(adjustForm.amount), description: adjustForm.description })}
                disabled={!adjustForm.amount || !adjustForm.description || adjustBalance.isPending}
                className="flex-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-yellow-500/30 transition-all">
                {adjustBalance.isPending ? 'Adjusting...' : 'Apply Adjustment'}
              </button>
              <button onClick={() => setAdjustModal(null)} className="px-4 py-2.5 border border-border text-gray-400 rounded-xl text-sm transition-all hover:text-white">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

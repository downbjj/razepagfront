'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Percent, Edit2, Trash2, X, ChevronLeft, ChevronRight, Globe, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function UserFeesPage() {
  const qc = useQueryClient()
  const [page, setPage]  = useState(1)
  const [modal, setModal] = useState<any>(null)
  const [form, setForm]  = useState({ feePercent: '3', feeFixed: '1', notes: '' })
  const [globalForm, setGlobalForm] = useState({ feePercent: '', feeFixed: '' })

  // Search user to assign fee
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  const { data: globalFeeData } = useQuery({
    queryKey: ['admin-global-fee'],
    queryFn: () => api.get('/admin/fees/global').then(r => {
      const d = r.data.data
      setGlobalForm({ feePercent: String(d.feePercent), feeFixed: String(d.feeFixed) })
      return d
    }),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-user-fees', page],
    queryFn: () => api.get('/admin/user-fees', { params: { page, limit: 20 } }).then(r => r.data.data),
  })

  const setGlobalFee = useMutation({
    mutationFn: (d: any) => api.patch('/admin/fees/global', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-global-fee'] }); toast.success('Taxa global atualizada!') },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const updateFee = useMutation({
    mutationFn: ({ userId, ...d }: any) => api.patch(`/admin/user-fees/${userId}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-user-fees'] }); setModal(null); toast.success('Taxa atualizada') },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const deleteFee = useMutation({
    mutationFn: (userId: string) => api.delete(`/admin/user-fees/${userId}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-user-fees'] }); toast.success('Taxa removida') },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const searchUsers = async () => {
    if (!search.trim()) return
    setSearching(true)
    try {
      const res = await api.get('/admin/users', { params: { search, limit: 10 } })
      setSearchResults(res.data?.data?.users || [])
    } finally {
      setSearching(false)
    }
  }

  const fees       = data?.fees       || []
  const totalPages = data?.totalPages || 1

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Taxas de Usuários</h1>
        <p className="text-gray-500 text-sm mt-1">Configure taxas personalizadas por usuário. Padrão: 3% + R$1,00</p>
      </div>

      {/* Global fee */}
      <div className="bg-surface border border-purple-500/20 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-white">Taxa Padrão Global</h2>
          <span className="text-xs text-gray-500 ml-1">— aplicada a todos os usuários sem taxa individual</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Taxa % padrão</label>
            <input type="number" step="0.01" min="0" max="100" value={globalForm.feePercent}
              onChange={e => setGlobalForm(f => ({ ...f, feePercent: e.target.value }))}
              className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all"
              placeholder="3" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Taxa fixa padrão (R$)</label>
            <input type="number" step="0.01" min="0" value={globalForm.feeFixed}
              onChange={e => setGlobalForm(f => ({ ...f, feeFixed: e.target.value }))}
              className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all"
              placeholder="1.00" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-purple-400">
            Fórmula: taxa = valor × {globalForm.feePercent || 0}% + R${Number(globalForm.feeFixed || 0).toFixed(2)}
          </p>
          <button
            onClick={() => setGlobalFee.mutate({ feePercent: parseFloat(globalForm.feePercent), feeFixed: parseFloat(globalForm.feeFixed) })}
            disabled={setGlobalFee.isPending || !globalForm.feePercent || !globalForm.feeFixed}
            className="flex items-center gap-2 text-sm text-white px-4 py-2 rounded-xl font-medium disabled:opacity-50"
            style={{ background: '#A855F7' }}>
            <Save className="w-3.5 h-3.5" />
            {setGlobalFee.isPending ? 'Salvando...' : 'Salvar taxa global'}
          </button>
        </div>
      </div>

      {/* Search & assign */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white">Atribuir taxa personalizada por usuário</h2>
        <div className="flex gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchUsers()}
            className="flex-1 bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
            placeholder="Buscar usuário por nome ou e-mail..." />
          <button onClick={searchUsers} disabled={searching}
            className="text-sm text-white px-4 py-2.5 rounded-xl font-medium disabled:opacity-50"
            style={{ background: '#A855F7' }}>
            {searching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        {searchResults.length > 0 && (
          <div className="border border-border rounded-xl overflow-hidden">
            {searchResults.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0 hover:bg-white/5 transition-colors">
                <div>
                  <p className="text-sm text-white">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
                <button
                  onClick={() => {
                    setModal({ userId: u.id, userName: u.name })
                    setForm({ feePercent: '3', feeFixed: '1', notes: '' })
                    setSearchResults([])
                    setSearch('')
                  }}
                  className="text-xs px-3 py-1.5 text-white rounded-lg font-medium" style={{ background: '#A855F7' }}>
                  Configurar taxa
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current custom fees */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-white">Taxas customizadas ativas</h2>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full spinner" />
          </div>
        ) : fees.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <Percent className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Nenhuma taxa customizada configurada</p>
            <p className="text-xs mt-1">Todos os usuários usam a taxa padrão (3% + R$1,00)</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Usuário', 'Taxa %', 'Taxa Fixa (R$)', 'Observação', 'Desde', 'Ações'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {fees.map((f: any) => (
                    <tr key={f.id} className="table-row-hover">
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-white">{f.user?.name}</p>
                        <p className="text-xs text-gray-500">{f.user?.email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-purple-400">{f.feePercent}%</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-purple-400">R$ {Number(f.feeFixed).toFixed(2)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-400">{f.notes || '—'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-gray-500">{formatDate(f.createdAt)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setModal({ userId: f.userId, userName: f.user?.name }); setForm({ feePercent: String(f.feePercent), feeFixed: String(f.feeFixed), notes: f.notes || '' }) }}
                            className="text-xs px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all flex items-center gap-1">
                            <Edit2 className="w-3 h-3" /> Editar
                          </button>
                          <button onClick={() => deleteFee.mutate(f.userId)} disabled={deleteFee.isPending}
                            className="text-xs px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-1">
                            <Trash2 className="w-3 h-3" /> Remover
                          </button>
                        </div>
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

      {/* Fee Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Taxa: {modal.userName}</h3>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Taxa % *</label>
                <input type="number" step="0.01" min="0" max="100" value={form.feePercent}
                  onChange={e => setForm(f => ({ ...f, feePercent: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Taxa Fixa (R$) *</label>
                <input type="number" step="0.01" min="0" value={form.feeFixed}
                  onChange={e => setForm(f => ({ ...f, feeFixed: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1.5">Observação</label>
                <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="Motivo da taxa especial..." />
              </div>
            </div>
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg px-3 py-2">
              <p className="text-xs text-purple-400">
                Fórmula: taxa = valor × {form.feePercent || 0}% + R${Number(form.feeFixed || 0).toFixed(2)}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => updateFee.mutate({ userId: modal.userId, feePercent: parseFloat(form.feePercent), feeFixed: parseFloat(form.feeFixed), notes: form.notes || undefined })}
                disabled={!form.feePercent || !form.feeFixed || updateFee.isPending}
                className="flex-1 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
                style={{ background: '#A855F7' }}>
                {updateFee.isPending ? 'Salvando...' : 'Salvar taxa'}
              </button>
              <button onClick={() => setModal(null)}
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

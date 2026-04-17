'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FileText, Plus, Edit2, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function PopupsPage() {
  const qc = useQueryClient()
  const [modal, setModal]   = useState<'create' | 'edit' | null>(null)
  const [selected, setSelected] = useState<any>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null)
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '', link: '', priority: '0', startAt: '', endAt: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-popups'],
    queryFn: () => api.get('/admin/popups', { params: { limit: 50 } }).then(r => r.data.data),
  })

  const createPopup = useMutation({
    mutationFn: (d: any) => api.post('/admin/popups', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-popups'] }); setModal(null); toast.success('Popup criado') },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const updatePopup = useMutation({
    mutationFn: ({ id, ...d }: any) => api.patch(`/admin/popups/${id}`, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-popups'] }); setModal(null); toast.success('Popup atualizado') },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const deletePopup = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/popups/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-popups'] }); setDeleteConfirm(null); toast.success('Popup removido') },
  })

  const openCreate = () => {
    setForm({ title: '', content: '', imageUrl: '', link: '', priority: '0', startAt: '', endAt: '' })
    setSelected(null); setModal('create')
  }

  const openEdit = (p: any) => {
    setForm({
      title: p.title, content: p.content, imageUrl: p.imageUrl || '', link: p.link || '',
      priority: String(p.priority), startAt: p.startAt?.slice(0, 16) || '', endAt: p.endAt?.slice(0, 16) || '',
    })
    setSelected(p); setModal('edit')
  }

  const handleSubmit = () => {
    const payload = {
      title: form.title, content: form.content,
      imageUrl: form.imageUrl || undefined, link: form.link || undefined,
      priority: parseInt(form.priority) || 0,
      startAt: form.startAt || undefined, endAt: form.endAt || undefined,
    }
    if (modal === 'create') createPopup.mutate(payload)
    else updatePopup.mutate({ id: selected.id, ...payload })
  }

  const popups    = data?.popups || []
  const isPending = createPopup.isPending || updatePopup.isPending

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Popups</h1>
          <p className="text-gray-500 text-sm mt-1">{popups.length} popups cadastrados</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 text-sm text-white px-4 py-2 rounded-xl font-medium"
          style={{ background: '#A855F7' }}>
          <Plus className="w-4 h-4" /> Novo popup
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full spinner" />
          </div>
        ) : popups.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Nenhum popup cadastrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Título', 'Prioridade', 'Status', 'Período', 'Ações'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {popups.map((p: any) => (
                  <tr key={p.id} className="table-row-hover">
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-white font-medium">{p.title}</p>
                      <p className="text-xs text-gray-600 truncate max-w-xs">{p.content.slice(0, 60)}…</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-gray-400">{p.priority}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        p.status === 'ACTIVE'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-xs text-gray-500">
                        {p.startAt ? <span>De: {formatDate(p.startAt)}</span> : <span>Sempre</span>}
                        {p.endAt && <span className="block">Até: {formatDate(p.endAt)}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)}
                          className="text-xs px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all flex items-center gap-1">
                          <Edit2 className="w-3 h-3" /> Editar
                        </button>
                        <button onClick={() => setDeleteConfirm(p)}
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
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{modal === 'create' ? 'Novo Popup' : 'Editar Popup'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Título *</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="Título do popup" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Conteúdo *</label>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600 resize-none"
                  placeholder="Conteúdo HTML ou texto..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Link</label>
                  <input type="text" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                    className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                    placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Prioridade</label>
                  <input type="number" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                    className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                    placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Início</label>
                  <input type="datetime-local" value={form.startAt} onChange={e => setForm(f => ({ ...f, startAt: e.target.value }))}
                    className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Fim</label>
                  <input type="datetime-local" value={form.endAt} onChange={e => setForm(f => ({ ...f, endAt: e.target.value }))}
                    className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">URL da imagem</label>
                <input type="text" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="https://..." />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSubmit} disabled={!form.title || !form.content || isPending}
                className="flex-1 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
                style={{ background: '#A855F7' }}>
                {isPending ? 'Salvando...' : modal === 'create' ? 'Criar popup' : 'Salvar'}
              </button>
              <button onClick={() => setModal(null)}
                className="px-4 py-2.5 border border-border text-gray-400 rounded-xl text-sm hover:text-white transition-all">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold text-white">Remover popup?</h3>
            <p className="text-sm text-gray-400">
              Tem certeza que deseja remover <strong className="text-white">{deleteConfirm.title}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => deletePopup.mutate(deleteConfirm.id)} disabled={deletePopup.isPending}
                className="flex-1 bg-red-500/15 border border-red-500/30 text-red-400 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-red-500/25 transition-all">
                {deletePopup.isPending ? 'Removendo...' : 'Confirmar'}
              </button>
              <button onClick={() => setDeleteConfirm(null)}
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

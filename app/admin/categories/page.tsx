'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Tag, Plus, Edit2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function CategoriesPage() {
  const qc = useQueryClient()
  const [modal, setModal]   = useState<'create' | 'edit' | null>(null)
  const [selected, setSelected] = useState<any>(null)
  const [form, setForm] = useState({ name: '', description: '', slug: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories-page'],
    queryFn: () => api.get('/admin/categories').then(r => r.data.data),
  })

  const createCat = useMutation({
    mutationFn: (data: any) => api.post('/admin/categories', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories-page'] }); qc.invalidateQueries({ queryKey: ['admin-categories'] }); setModal(null); toast.success('Categoria criada') },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const updateCat = useMutation({
    mutationFn: ({ id, ...data }: any) => api.patch(`/admin/categories/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories-page'] }); qc.invalidateQueries({ queryKey: ['admin-categories'] }); setModal(null); toast.success('Categoria atualizada') },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const openCreate = () => {
    setForm({ name: '', description: '', slug: '' })
    setSelected(null)
    setModal('create')
  }

  const openEdit = (c: any) => {
    setForm({ name: c.name, description: c.description || '', slug: c.slug })
    setSelected(c)
    setModal('edit')
  }

  const handleSubmit = () => {
    const payload = { name: form.name, description: form.description || undefined, slug: form.slug }
    if (modal === 'create') createCat.mutate(payload)
    else updateCat.mutate({ id: selected.id, ...payload })
  }

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const categories = Array.isArray(data) ? data : data?.categories || data?.data || []
  const isPending  = createCat.isPending || updateCat.isPending

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categorias</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categorias cadastradas</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 text-sm text-white px-4 py-2 rounded-xl font-medium transition-all hover:shadow-[0_0_15px_rgba(138,43,226,0.4)]"
          style={{ background: '#8A2BE2' }}>
          <Plus className="w-4 h-4" /> Nova categoria
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full spinner" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Tag className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Nenhuma categoria cadastrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Nome', 'Slug', 'Descrição', 'Produtos', 'Status', 'Criado em', 'Ações'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((c: any) => (
                  <tr key={c.id} className="table-row-hover">
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-white font-medium">{c.name}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-gray-500 font-mono">{c.slug}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-gray-400 truncate max-w-xs block">{c.description || '—'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-gray-400">{c._count?.products ?? 0}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        c.isActive
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>{c.isActive ? 'Ativa' : 'Inativa'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-gray-500">{formatDate(c.createdAt)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => openEdit(c)}
                        className="text-xs px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all flex items-center gap-1">
                        <Edit2 className="w-3 h-3" /> Editar
                      </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{modal === 'create' ? 'Nova Categoria' : 'Editar Categoria'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Nome *</label>
                <input type="text" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: autoSlug(e.target.value) }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="Nome da categoria" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Slug *</label>
                <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600 font-mono"
                  placeholder="nome-da-categoria" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Descrição</label>
                <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="Descrição opcional" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSubmit} disabled={!form.name || !form.slug || isPending}
                className="flex-1 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-all"
                style={{ background: '#8A2BE2' }}>
                {isPending ? 'Salvando...' : modal === 'create' ? 'Criar' : 'Salvar'}
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

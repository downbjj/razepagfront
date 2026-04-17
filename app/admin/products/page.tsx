'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ShoppingBag, Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function ProductsPage() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [selected, setSelected] = useState<any>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', sku: '', stock: '', imageUrl: '', categoryId: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: () => api.get('/admin/products', { params: { page, limit: 20 } }).then(r => r.data.data),
  })

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.get('/admin/categories').then(r => r.data.data),
  })

  const createProduct = useMutation({
    mutationFn: (data: any) => api.post('/admin/products', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); setModal(null); toast.success('Produto criado') },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const updateProduct = useMutation({
    mutationFn: ({ id, ...data }: any) => api.patch(`/admin/products/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); setModal(null); toast.success('Produto atualizado') },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const deleteProduct = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/products/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); setDeleteConfirm(null); toast.success('Produto removido') },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const openCreate = () => {
    setForm({ name: '', description: '', price: '', sku: '', stock: '', imageUrl: '', categoryId: '' })
    setSelected(null)
    setModal('create')
  }

  const openEdit = (p: any) => {
    setForm({ name: p.name, description: p.description || '', price: String(p.price), sku: p.sku || '', stock: String(p.stock ?? ''), imageUrl: p.imageUrl || '', categoryId: p.categoryId || '' })
    setSelected(p)
    setModal('edit')
  }

  const handleSubmit = () => {
    const payload = {
      name: form.name,
      description: form.description || undefined,
      price: parseFloat(form.price),
      sku: form.sku || undefined,
      stock: form.stock ? parseInt(form.stock) : undefined,
      imageUrl: form.imageUrl || undefined,
      categoryId: form.categoryId || undefined,
    }
    if (modal === 'create') createProduct.mutate(payload)
    else updateProduct.mutate({ id: selected.id, ...payload })
  }

  const products   = data?.products   || []
  const totalPages = data?.totalPages || 1
  const total      = data?.total      || 0
  const catList    = (Array.isArray(categories) ? categories : categories?.categories || categories?.data || [])

  const isPending = createProduct.isPending || updateProduct.isPending

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Produtos</h1>
          <p className="text-gray-500 text-sm mt-1">{total} produtos cadastrados</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 text-sm text-white px-4 py-2 rounded-xl font-medium transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          style={{ background: '#A855F7' }}>
          <Plus className="w-4 h-4" /> Novo produto
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full spinner" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Nenhum produto cadastrado</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Produto', 'Preço', 'Categoria', 'Estoque', 'Status', 'Criado em', 'Ações'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((p: any) => (
                    <tr key={p.id} className="table-row-hover">
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-white font-medium">{p.name}</p>
                        {p.sku && <p className="text-xs text-gray-600 font-mono">SKU: {p.sku}</p>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-green-400">{formatCurrency(p.price)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-400">{p.category?.name || '—'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-400">{p.stock ?? '∞'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                          p.status === 'ACTIVE'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>{p.status}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-gray-500">{formatDate(p.createdAt)}</span>
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

      {/* Create/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg space-y-4 my-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{modal === 'create' ? 'Novo Produto' : 'Editar Produto'}</h3>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1.5">Nome *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="Nome do produto" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Preço (R$) *</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Estoque</label>
                <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="Ilimitado" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">SKU</label>
                <input type="text" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="SKU-001" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Categoria</label>
                <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all">
                  <option value="">Sem categoria</option>
                  {catList.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1.5">URL da imagem</label>
                <input type="text" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1.5">Descrição</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600 resize-none"
                  placeholder="Descrição do produto..." />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSubmit} disabled={!form.name || !form.price || isPending}
                className="flex-1 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-all"
                style={{ background: '#A855F7' }}>
                {isPending ? 'Salvando...' : modal === 'create' ? 'Criar produto' : 'Salvar alterações'}
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
            <h3 className="text-lg font-semibold text-white">Remover produto?</h3>
            <p className="text-sm text-gray-400">
              Tem certeza que deseja remover <strong className="text-white">{deleteConfirm.name}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button onClick={() => deleteProduct.mutate(deleteConfirm.id)} disabled={deleteProduct.isPending}
                className="flex-1 bg-red-500/15 border border-red-500/30 text-red-400 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-red-500/25 transition-all">
                {deleteProduct.isPending ? 'Removendo...' : 'Confirmar remoção'}
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

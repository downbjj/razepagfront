'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Sliders, Plus, Edit2, Trash2, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

// Sensitive keys that should be masked in UI
const SENSITIVE_KEYS = ['password', 'secret', 'key', 'token', 'api_key', 'webhook_secret']
const isSensitive = (key: string) => SENSITIVE_KEYS.some(s => key.toLowerCase().includes(s))

export default function EnvConfigPage() {
  const qc = useQueryClient()
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue]   = useState('')
  const [newModal, setNewModal]     = useState(false)
  const [newForm, setNewForm]       = useState({ key: '', value: '', description: '' })
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null)
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({})

  const { data, isLoading } = useQuery({
    queryKey: ['admin-env-config'],
    queryFn: () => api.get('/admin/configs').then(r => r.data.data),
  })

  const updateConfig = useMutation({
    mutationFn: ({ key, value }: any) => api.patch(`/admin/configs/${key}`, { value }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-env-config'] })
      setEditingKey(null)
      toast.success('Configuração atualizada')
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const deleteConfig = useMutation({
    mutationFn: (key: string) => api.delete(`/admin/configs/${key}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-env-config'] })
      setDeleteConfirm(null)
      toast.success('Configuração removida')
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const createConfig = useMutation({
    mutationFn: ({ key, value }: any) => api.patch(`/admin/configs/${key}`, { value }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-env-config'] })
      setNewModal(false)
      setNewForm({ key: '', value: '', description: '' })
      toast.success('Configuração criada')
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const configs = Array.isArray(data) ? data : data?.configs || data?.data || []

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Configurações de Ambiente</h1>
          <p className="text-gray-500 text-sm mt-1">{configs.length} variáveis configuradas</p>
        </div>
        <button onClick={() => setNewModal(true)}
          className="flex items-center gap-2 text-sm text-white px-4 py-2 rounded-xl font-medium"
          style={{ background: '#8A2BE2' }}>
          <Plus className="w-4 h-4" /> Nova configuração
        </button>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3">
        <p className="text-xs text-yellow-400">
          ⚠️ Atenção: modificar configurações de ambiente pode afetar o comportamento do sistema em produção. Tenha certeza antes de salvar.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full spinner" />
          </div>
        ) : configs.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Sliders className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Nenhuma configuração encontrada</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {configs.map((cfg: any) => {
              const sensitive = isSensitive(cfg.key)
              const revealed  = showSensitive[cfg.key]
              const isEditing = editingKey === cfg.key

              return (
                <div key={cfg.key} className="px-5 py-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono font-semibold text-purple-400">{cfg.key}</span>
                        {sensitive && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full">
                            sensível
                          </span>
                        )}
                      </div>
                      {cfg.description && <p className="text-xs text-gray-500 mb-2">{cfg.description}</p>}

                      {isEditing ? (
                        <div className="flex gap-2 items-center">
                          <input type={sensitive ? 'password' : 'text'} value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="flex-1 bg-surface-2 border border-purple-500/40 text-white px-3 py-2 rounded-lg text-sm font-mono focus:border-purple-500 transition-all"
                            autoFocus />
                          <button onClick={() => updateConfig.mutate({ key: cfg.key, value: editValue })}
                            disabled={updateConfig.isPending}
                            className="flex items-center gap-1 text-xs px-3 py-2 bg-green-500/15 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/25 transition-all">
                            <Save className="w-3 h-3" /> Salvar
                          </button>
                          <button onClick={() => setEditingKey(null)}
                            className="text-xs px-3 py-2 border border-border text-gray-400 rounded-lg hover:text-white transition-all">
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-gray-300 break-all">
                            {sensitive && !revealed ? '••••••••••••' : cfg.value}
                          </span>
                          {sensitive && (
                            <button onClick={() => setShowSensitive(s => ({ ...s, [cfg.key]: !revealed }))}
                              className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                              {revealed ? 'ocultar' : 'mostrar'}
                            </button>
                          )}
                        </div>
                      )}

                      <p className="text-[10px] text-gray-700 mt-1">
                        Atualizado: {formatDate(cfg.updatedAt)}
                      </p>
                    </div>

                    {!isEditing && (
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => { setEditingKey(cfg.key); setEditValue(cfg.value) }}
                          className="text-xs px-2 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all flex items-center gap-1">
                          <Edit2 className="w-3 h-3" /> Editar
                        </button>
                        <button onClick={() => setDeleteConfirm(cfg)}
                          className="text-xs px-2 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> Remover
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* New Config Modal */}
      {newModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Nova Configuração</h3>
              <button onClick={() => setNewModal(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Chave *</label>
                <input type="text" value={newForm.key} onChange={e => setNewForm(f => ({ ...f, key: e.target.value.toUpperCase().replace(/\s+/g, '_') }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600 font-mono"
                  placeholder="MINHA_CONFIG" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Valor *</label>
                <input type="text" value={newForm.value} onChange={e => setNewForm(f => ({ ...f, value: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="Valor da configuração" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => createConfig.mutate({ key: newForm.key, value: newForm.value })}
                disabled={!newForm.key || !newForm.value || createConfig.isPending}
                className="flex-1 text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
                style={{ background: '#8A2BE2' }}>
                {createConfig.isPending ? 'Salvando...' : 'Criar configuração'}
              </button>
              <button onClick={() => setNewModal(false)}
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
            <h3 className="text-lg font-semibold text-white">Remover configuração?</h3>
            <p className="text-sm text-gray-400">
              Tem certeza que deseja remover <strong className="text-white font-mono">{deleteConfirm.key}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button onClick={() => deleteConfig.mutate(deleteConfirm.key)} disabled={deleteConfig.isPending}
                className="flex-1 bg-red-500/15 border border-red-500/30 text-red-400 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-red-500/25 transition-all">
                {deleteConfig.isPending ? 'Removendo...' : 'Confirmar remoção'}
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

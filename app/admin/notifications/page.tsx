'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, Send, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

const TYPE_COLORS: Record<string, string> = {
  INFO:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  WARNING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  SUCCESS: 'bg-green-500/10 text-green-400 border-green-500/20',
  ERROR:   'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function NotificationsPage() {
  const qc = useQueryClient()
  const [page, setPage]        = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', message: '', type: 'INFO', broadcast: true, userIds: '',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-notifications', page],
    queryFn: () => api.get('/admin/notifications', { params: { page, limit: 30 } }).then(r => r.data.data),
  })

  const send = useMutation({
    mutationFn: (d: any) => api.post('/admin/notifications/send', d),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['admin-notifications'] })
      setShowForm(false)
      toast.success(res.data?.data?.message || 'Notificação enviada')
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const handleSend = () => {
    const payload: any = {
      title: form.title, message: form.message, type: form.type,
      broadcast: form.broadcast,
    }
    if (!form.broadcast && form.userIds.trim()) {
      payload.userIds = form.userIds.split(',').map(s => s.trim()).filter(Boolean)
    }
    send.mutate(payload)
  }

  const notifications = data?.notifications || []
  const total         = data?.total         || 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Enviar Notificações</h1>
          <p className="text-gray-500 text-sm mt-1">{total} notificações enviadas</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 text-sm text-white px-4 py-2 rounded-xl font-medium"
          style={{ background: '#A855F7' }}>
          <Send className="w-4 h-4" /> Enviar nova
        </button>
      </div>

      {/* Send Form */}
      {showForm && (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Nova notificação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1.5">Título *</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                placeholder="Título da notificação" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-400 mb-1.5">Mensagem *</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3}
                className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600 resize-none"
                placeholder="Texto da notificação..." />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Tipo</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all">
                <option value="INFO">INFO</option>
                <option value="WARNING">WARNING</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Destinatários</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={form.broadcast} onChange={() => setForm(f => ({ ...f, broadcast: true }))} className="accent-purple-500" />
                  <span className="text-sm text-gray-300">Todos os usuários</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={!form.broadcast} onChange={() => setForm(f => ({ ...f, broadcast: false }))} className="accent-purple-500" />
                  <span className="text-sm text-gray-300">Específicos</span>
                </label>
              </div>
            </div>
            {!form.broadcast && (
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-400 mb-1.5">IDs dos usuários (separados por vírgula)</label>
                <input type="text" value={form.userIds} onChange={e => setForm(f => ({ ...f, userIds: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="uuid1, uuid2, uuid3..." />
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={handleSend} disabled={!form.title || !form.message || send.isPending}
              className="flex items-center gap-2 text-sm text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50"
              style={{ background: '#A855F7' }}>
              <Send className="w-4 h-4" />
              {send.isPending ? 'Enviando...' : form.broadcast ? 'Enviar para todos' : 'Enviar para selecionados'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2.5 border border-border text-gray-400 rounded-xl text-sm hover:text-white transition-all">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Log */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full spinner" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Nenhuma notificação enviada ainda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Título', 'Mensagem', 'Tipo', 'Usuário', 'Broadcast', 'Enviado em'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {notifications.map((n: any) => (
                  <tr key={n.id} className="table-row-hover">
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-white font-medium">{n.title}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-gray-400 truncate max-w-xs">{n.message}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full border ${TYPE_COLORS[n.type] || ''}`}>{n.type}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-gray-400">{n.user?.name || '—'}</p>
                      <p className="text-xs text-gray-600">{n.user?.email || ''}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full border ${n.isBroadcast ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-600/20'}`}>
                        {n.isBroadcast ? 'Broadcast' : 'Individual'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-gray-500">{formatDate(n.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Webhook, Plus, Trash2, Power, ExternalLink, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

const EVENT_OPTIONS = [
  'payment.completed', 'payment.failed', 'payment.pending',
  'transfer.completed', 'transfer.received',
  'withdrawal.approved', 'withdrawal.rejected',
]

export default function WebhooksPage() {
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [activeTab, setActiveTab] = useState<'webhooks' | 'logs'>('webhooks')
  const [form, setForm] = useState({ url: '', events: ['payment.completed', 'payment.failed'] })

  const { data: webhooks = [], isLoading } = useQuery({
    queryKey: ['webhooks'],
    queryFn: () => api.get('/webhooks').then(r => r.data.data),
  })

  const { data: logsData } = useQuery({
    queryKey: ['webhook-logs'],
    queryFn: () => api.get('/webhooks/logs').then(r => r.data.data),
    enabled: activeTab === 'logs',
    refetchInterval: 15000,
  })

  const createWebhook = useMutation({
    mutationFn: (data: any) => api.post('/webhooks', data).then(r => r.data.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['webhooks'] }); setShowCreate(false); toast.success('Webhook created!') },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  })

  const deleteWebhook = useMutation({
    mutationFn: (id: string) => api.delete(`/webhooks/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['webhooks'] }); toast.success('Deleted') },
  })

  const toggleWebhook = useMutation({
    mutationFn: (id: string) => api.patch(`/webhooks/${id}/toggle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['webhooks'] }),
  })

  const toggleEvent = (event: string) => {
    setForm(f => ({
      ...f,
      events: f.events.includes(event) ? f.events.filter(e => e !== event) : [...f.events, event],
    }))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Webhooks</h1>
          <p className="text-gray-500 text-sm mt-1">Receive real-time notifications for payment events</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-gradient-purple text-white px-4 py-2 rounded-xl text-sm font-medium shadow-neon-purple-sm hover:shadow-neon-purple transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Endpoint
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-2 p-1 rounded-xl w-fit">
        {(['webhooks', 'logs'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              activeTab === tab ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-gray-500 hover:text-white'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Add Webhook Endpoint</h2>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Endpoint URL *</label>
            <input
              type="url" required value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              className="w-full bg-surface-2 border border-border text-white px-4 py-3 rounded-xl focus:border-purple-500 transition-all placeholder-gray-600"
              placeholder="https://yourapp.com/webhook"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Events to receive</label>
            <div className="flex flex-wrap gap-2">
              {EVENT_OPTIONS.map(event => (
                <button key={event} type="button" onClick={() => toggleEvent(event)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    form.events.includes(event)
                      ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                      : 'border-border text-gray-500 hover:border-gray-600'
                  }`}>
                  {event}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => createWebhook.mutate(form)}
              disabled={createWebhook.isPending || !form.url || form.events.length === 0}
              className="flex-1 bg-gradient-purple text-white py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-all"
            >
              {createWebhook.isPending ? 'Creating...' : 'Create Webhook'}
            </button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2.5 border border-border text-gray-400 hover:text-white rounded-xl text-sm transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {activeTab === 'webhooks' ? (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full spinner" />
            </div>
          ) : webhooks.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <Webhook className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>No webhooks configured</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {webhooks.map((w: any) => (
                <div key={w.id} className="px-5 py-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${w.isActive ? 'bg-purple-500/10' : 'bg-gray-500/10'}`}>
                      <Webhook className={`w-4 h-4 ${w.isActive ? 'text-purple-400' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono text-white truncate">{w.url}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${w.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'}`}>
                          {w.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {w.events?.map((e: string) => (
                          <span key={e} className="text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">{e}</span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Created {formatDate(w.createdAt)}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => toggleWebhook.mutate(w.id)}
                        className={`p-1.5 border rounded-lg transition-all ${w.isActive ? 'text-yellow-500/70 border-yellow-500/20 hover:bg-yellow-500/10' : 'text-green-500/70 border-green-500/20 hover:bg-green-500/10'}`}>
                        <Power className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { if (confirm('Delete webhook?')) deleteWebhook.mutate(w.id) }}
                        className="p-1.5 text-red-500/70 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-sm font-medium text-gray-400">Delivery Logs</h3>
          </div>
          {!logsData?.logs?.length ? (
            <div className="text-center py-12 text-gray-600">No logs yet</div>
          ) : (
            <div className="divide-y divide-border">
              {logsData.logs.map((log: any) => (
                <div key={log.id} className="px-5 py-3 flex items-center gap-4">
                  {log.success ? (
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{log.event}</p>
                    <p className="text-xs text-gray-600">{formatDate(log.createdAt)} · Attempt {log.attempts}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    log.responseStatus >= 200 && log.responseStatus < 300
                      ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {log.responseStatus || 'No response'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

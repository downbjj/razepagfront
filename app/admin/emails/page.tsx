'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Mail, Send, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function EmailsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    subject: '', body: '', broadcast: true, to: '', toUserIds: '',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-emails'],
    queryFn: () => api.get('/admin/emails', { params: { limit: 50 } }).then(r => r.data.data),
  })

  const send = useMutation({
    mutationFn: (d: any) => api.post('/admin/emails/send', d),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['admin-emails'] })
      setShowForm(false)
      toast.success(res.data?.data?.message || 'E-mail registrado')
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Erro'),
  })

  const handleSend = () => {
    const payload: any = { subject: form.subject, body: form.body }
    if (form.broadcast) {
      payload.broadcast = true
    } else if (form.toUserIds.trim()) {
      payload.toUserIds = form.toUserIds.split(',').map(s => s.trim()).filter(Boolean)
    } else if (form.to.trim()) {
      payload.to = form.to.trim()
    }
    send.mutate(payload)
  }

  const logs  = data?.logs  || []
  const total = data?.total || 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Enviar E-mails</h1>
          <p className="text-gray-500 text-sm mt-1">{total} e-mails registrados</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 text-sm text-white px-4 py-2 rounded-xl font-medium"
          style={{ background: '#8A2BE2' }}>
          <Send className="w-4 h-4" /> Novo e-mail
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-4 py-3">
        <p className="text-xs text-blue-400">
          Os e-mails são registrados no log. Configure um provedor de e-mail (Nodemailer, SES, Resend) para envio real em produção.
        </p>
      </div>

      {/* Compose Form */}
      {showForm && (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Compor e-mail</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Destinatários</label>
              <div className="flex gap-4 mb-2">
                {[
                  { val: 'broadcast', label: 'Todos os usuários' },
                  { val: 'users', label: 'Por ID de usuários' },
                  { val: 'email', label: 'E-mail específico' },
                ].map(opt => (
                  <label key={opt.val} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio"
                      checked={form.broadcast ? opt.val === 'broadcast' : form.toUserIds ? opt.val === 'users' : opt.val === 'email'}
                      onChange={() => setForm(f => ({ ...f, broadcast: opt.val === 'broadcast', toUserIds: '', to: '' }))}
                      className="accent-purple-500" />
                    <span className="text-sm text-gray-300">{opt.label}</span>
                  </label>
                ))}
              </div>
              {!form.broadcast && form.toUserIds !== undefined && !form.to && (
                <input type="text" value={form.toUserIds} onChange={e => setForm(f => ({ ...f, toUserIds: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="uuid1, uuid2, ..." />
              )}
              {!form.broadcast && form.to !== undefined && !form.toUserIds && (
                <input type="email" value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))}
                  className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="destinatario@exemplo.com" />
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Assunto *</label>
              <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600"
                placeholder="Assunto do e-mail" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Corpo do e-mail *</label>
              <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={6}
                className="w-full bg-surface-2 border border-border text-white px-4 py-2.5 rounded-xl text-sm focus:border-purple-500/50 transition-all placeholder-gray-600 resize-none font-mono"
                placeholder="Conteúdo do e-mail (HTML ou texto)..." />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSend} disabled={!form.subject || !form.body || send.isPending}
              className="flex items-center gap-2 text-sm text-white px-6 py-2.5 rounded-xl font-medium disabled:opacity-50"
              style={{ background: '#8A2BE2' }}>
              <Send className="w-4 h-4" />
              {send.isPending ? 'Enviando...' : 'Enviar e-mail'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2.5 border border-border text-gray-400 rounded-xl text-sm hover:text-white transition-all">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Log table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full spinner" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Nenhum e-mail registrado ainda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Para', 'Assunto', 'Status', 'Enviado por', 'Data'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((l: any) => (
                  <tr key={l.id} className="table-row-hover">
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-gray-300">{l.to}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-white">{l.subject}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 w-fit ${
                        l.status === 'SENT'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {l.status === 'SENT' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {l.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-gray-500 font-mono">{l.sentBy?.slice(0, 8) || '—'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-gray-500">{formatDate(l.createdAt)}</span>
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

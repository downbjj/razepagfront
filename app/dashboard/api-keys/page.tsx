'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Shield, Plus, Trash2, RefreshCw, Eye, EyeOff, Copy, Check,
  ChevronDown, ChevronUp, Globe, Power, Activity, AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

// ─── types ────────────────────────────────────────────────────────────────────
interface ApiClient {
  id: string
  clientId: string
  name: string
  allowedIps: string[]
  isActive: boolean
  requestCount: number
  createdAt: string
  updatedAt: string
}

// ─── helpers ──────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  )
}

function SecretBanner({ data, onDismiss }: { data: any; onDismiss: () => void }) {
  const [copiedId, setCopiedId] = useState(false)
  const [copiedSecret, setCopiedSecret] = useState(false)

  const copy = async (text: string, which: 'id' | 'secret') => {
    await navigator.clipboard.writeText(text)
    if (which === 'id') { setCopiedId(true); setTimeout(() => setCopiedId(false), 3000) }
    else { setCopiedSecret(true); setTimeout(() => setCopiedSecret(false), 3000) }
    toast.success('Copiado!')
  }

  return (
    <div className="rounded-2xl p-5 space-y-4"
      style={{ background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.3)' }}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
        <p className="text-sm font-semibold text-yellow-300">
          Salve o client_secret agora — ele NÃO será mostrado novamente!
        </p>
      </div>

      <div className="space-y-3">
        {/* client_id */}
        <div>
          <p className="text-xs text-gray-500 mb-1 font-medium">client_id</p>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: '#0d0d14', border: '1px solid rgba(138,43,226,0.2)' }}>
            <code className="flex-1 text-xs text-purple-300 font-mono break-all">{data.clientId}</code>
            <button onClick={() => copy(data.clientId, 'id')}
              className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
              {copiedId ? <><Check className="w-3 h-3" />Copiado</> : <><Copy className="w-3 h-3" />Copiar</>}
            </button>
          </div>
        </div>

        {/* client_secret */}
        <div>
          <p className="text-xs text-gray-500 mb-1 font-medium">client_secret <span className="text-yellow-400">(mostrado apenas agora)</span></p>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: '#0d0d14', border: '1px solid rgba(234,179,8,0.3)' }}>
            <code className="flex-1 text-xs text-yellow-300 font-mono break-all">{data.clientSecret}</code>
            <button onClick={() => copy(data.clientSecret, 'secret')}
              className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
              {copiedSecret ? <><Check className="w-3 h-3" />Copiado</> : <><Copy className="w-3 h-3" />Copiar</>}
            </button>
          </div>
        </div>
      </div>

      <button onClick={onDismiss} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
        Já salvei, fechar
      </button>
    </div>
  )
}

// ─── ClientRow ────────────────────────────────────────────────────────────────
function ClientRow({
  client, onToggle, onDelete, onReset, onUpdateIps,
}: {
  client: ApiClient
  onToggle: () => void
  onDelete: () => void
  onReset: () => void
  onUpdateIps: (ips: string[]) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [editIps, setEditIps] = useState(false)
  const [ipsText, setIpsText] = useState(client.allowedIps.join('\n'))
  const [copiedId, setCopiedId] = useState(false)

  const copyId = async () => {
    await navigator.clipboard.writeText(client.clientId)
    setCopiedId(true)
    toast.success('client_id copiado!')
    setTimeout(() => setCopiedId(false), 3000)
  }

  const saveIps = () => {
    const ips = ipsText.split('\n').map(s => s.trim()).filter(Boolean)
    onUpdateIps(ips)
    setEditIps(false)
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: '#111118', border: `1px solid ${client.isActive ? 'rgba(138,43,226,0.2)' : 'rgba(255,255,255,0.05)'}` }}>

      {/* Main row */}
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Status dot */}
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${client.isActive ? 'bg-green-400' : 'bg-gray-600'}`}
          style={client.isActive ? { boxShadow: '0 0 6px #22c55e' } : {}} />

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white">{client.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              client.isActive
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
            }`}>
              {client.isActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          {/* client_id — always visible, always copiable */}
          <div className="flex items-center gap-2 mt-1">
            <code className="text-xs text-purple-400 font-mono truncate max-w-xs">{client.clientId}</code>
            <button onClick={copyId} className="text-gray-600 hover:text-purple-400 transition-colors flex-shrink-0">
              {copiedId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-600">
              <Globe className="w-3 h-3 inline mr-0.5" />
              {client.allowedIps.length === 0 ? 'Todos os IPs' : `${client.allowedIps.length} IP(s) autorizado(s)`}
            </span>
            <span className="text-xs text-gray-600">
              <Activity className="w-3 h-3 inline mr-0.5" />
              {client.requestCount} requisições
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Reset credentials */}
          <button
            onClick={() => { if (confirm('Isso invalida as credenciais atuais. Confirmar?')) onReset() }}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-all text-gray-400 hover:text-white"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            title="Resetar credenciais"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Toggle */}
          <button
            onClick={onToggle}
            className={`p-1.5 rounded-lg transition-all ${
              client.isActive
                ? 'text-yellow-400/70 hover:text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/10'
                : 'text-green-400/70 hover:text-green-400 border border-green-500/20 hover:bg-green-500/10'
            }`}
            title={client.isActive ? 'Desativar' : 'Ativar'}
          >
            <Power className="w-3.5 h-3.5" />
          </button>

          {/* Delete */}
          <button
            onClick={() => { if (confirm(`Excluir "${client.name}"? Esta ação é irreversível.`)) onDelete() }}
            className="p-1.5 text-red-500/60 hover:text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all"
            title="Excluir"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Expand */}
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-1.5 text-gray-500 hover:text-white transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded: IPs + usage */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {/* client_secret hint */}
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">client_secret</p>
              <div className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)' }}>
                <code className="text-xs text-gray-600 font-mono">••••••••••••••••••••••••</code>
                <span className="text-xs text-gray-600 ml-auto">oculto</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Use "Reset" para gerar novas credenciais.</p>
            </div>

            {/* Dates */}
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500 font-medium">Informações</p>
              <p className="text-xs text-gray-600">Criado em: {formatDate(client.createdAt)}</p>
              <p className="text-xs text-gray-600">Atualizado: {formatDate(client.updatedAt)}</p>
              <p className="text-xs text-gray-600">Requisições: {client.requestCount}</p>
            </div>
          </div>

          {/* IP whitelist editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> IPs Permitidos
                <span className="text-gray-600">(vazio = qualquer IP)</span>
              </p>
              {!editIps && (
                <button onClick={() => setEditIps(true)} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                  Editar
                </button>
              )}
            </div>

            {editIps ? (
              <div className="space-y-2">
                <textarea
                  value={ipsText}
                  onChange={e => setIpsText(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl px-3 py-2 text-xs font-mono text-gray-200 resize-none"
                  style={{ background: '#0d0d14', border: '1px solid rgba(138,43,226,0.3)', outline: 'none' }}
                  placeholder={"192.168.1.1\n10.0.0.0\n203.0.113.5"}
                />
                <div className="flex gap-2">
                  <button onClick={saveIps}
                    className="text-xs px-3 py-1.5 rounded-lg text-white font-medium transition-all"
                    style={{ background: 'rgba(138,43,226,0.25)', border: '1px solid rgba(138,43,226,0.4)' }}>
                    Salvar IPs
                  </button>
                  <button onClick={() => { setEditIps(false); setIpsText(client.allowedIps.join('\n')) }}
                    className="text-xs px-3 py-1.5 rounded-lg text-gray-400 hover:text-white transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl px-3 py-2.5 min-h-[2.5rem]"
                style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)' }}>
                {client.allowedIps.length === 0 ? (
                  <p className="text-xs text-gray-600">Nenhum IP restrito — qualquer IP pode autenticar</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {client.allowedIps.map(ip => (
                      <span key={ip} className="text-xs font-mono px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(138,43,226,0.1)', border: '1px solid rgba(138,43,226,0.2)', color: '#c084fc' }}>
                        {ip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ApiKeysPage() {
  const qc = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [newCreds, setNewCreds] = useState<any>(null)   // shown once after create/reset
  const [form, setForm] = useState({ name: '', allowedIps: '' })

  const { data: clients = [], isLoading } = useQuery<ApiClient[]>({
    queryKey: ['api-clients'],
    queryFn:  () => api.get('/api-keys/clients').then(r => r.data.data),
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api-keys/clients', data).then(r => r.data.data),
    onSuccess: (data) => {
      setNewCreds(data)
      setShowCreate(false)
      setForm({ name: '', allowedIps: '' })
      qc.invalidateQueries({ queryKey: ['api-clients'] })
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Erro ao criar credencial'),
  })

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/api-keys/clients/${id}/toggle`).then(r => r.data.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['api-clients'] })
      toast.success(data.message)
    },
    onError: () => toast.error('Erro ao alterar status'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api-keys/clients/${id}`).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['api-clients'] }); toast.success('Credencial excluída') },
    onError: () => toast.error('Erro ao excluir'),
  })

  const resetMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/api-keys/clients/${id}/reset`).then(r => r.data.data),
    onSuccess: (data) => {
      setNewCreds(data)
      qc.invalidateQueries({ queryKey: ['api-clients'] })
    },
    onError: () => toast.error('Erro ao resetar credenciais'),
  })

  const updateIpsMutation = useMutation({
    mutationFn: ({ id, ips }: { id: string; ips: string[] }) =>
      api.patch(`/api-keys/clients/${id}/ips`, { allowedIps: ips }).then(r => r.data.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['api-clients'] }); toast.success('IPs atualizados') },
    onError: () => toast.error('Erro ao atualizar IPs'),
  })

  const handleCreate = () => {
    if (!form.name.trim()) return toast.error('Informe um nome')
    const ips = form.allowedIps.split('\n').map(s => s.trim()).filter(Boolean)
    createMutation.mutate({ name: form.name.trim(), allowedIps: ips })
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Credenciais de API</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Autenticação via <code className="text-purple-400">client_id</code> + <code className="text-purple-400">client_secret</code>
          </p>
        </div>
        <button
          onClick={() => setShowCreate(s => !s)}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #8A2BE2, #6a0dad)', boxShadow: '0 0 14px rgba(138,43,226,0.3)' }}
        >
          <Plus className="w-4 h-4" />
          Nova Credencial
        </button>
      </div>

      {/* New credentials banner (shown after create or reset) */}
      {newCreds && <SecretBanner data={newCreds} onDismiss={() => setNewCreds(null)} />}

      {/* Create form */}
      {showCreate && (
        <div className="rounded-2xl p-5 space-y-4" style={{ background: '#111118', border: '1px solid rgba(138,43,226,0.2)' }}>
          <h2 className="text-sm font-semibold text-white">Nova Credencial</h2>
          <Field label="Nome *">
            <input
              type="text" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="modal-input" placeholder="Ex: Minha Loja / ERP Interno"
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
            />
          </Field>
          <Field label="IPs Permitidos (opcional — um por linha, vazio = qualquer IP)">
            <textarea
              value={form.allowedIps}
              onChange={e => setForm(f => ({ ...f, allowedIps: e.target.value }))}
              rows={3}
              className="modal-input resize-none"
              placeholder={"192.168.1.1\n10.0.0.0\n203.0.113.5"}
            />
          </Field>
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={createMutation.isPending || !form.name.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg, #8A2BE2, #6a0dad)' }}
            >
              {createMutation.isPending
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Shield className="w-4 h-4" />Gerar Credenciais</>
              }
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 text-sm text-gray-400 hover:text-white transition-colors rounded-xl"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* How to use */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(138,43,226,0.05)', border: '1px solid rgba(138,43,226,0.15)' }}>
        <p className="text-xs font-semibold text-purple-400 mb-2">Como usar</p>
        <pre className="text-xs text-gray-400 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">{`# Criar cobrança PIX
curl -X POST https://api.razepag.com/api/gateway/pix/create \\
  -H "client_id: client_xxxxxxxxxxxx" \\
  -H "client_secret: secret_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"amount":100,"description":"Pedido 001","payerEmail":"c@email.com","payerName":"João","payerCpf":"12345678909"}'

# Consultar status
curl https://api.razepag.com/api/gateway/payment/ID_RETORNADO \\
  -H "client_id: client_xxxxxxxxxxxx" \\
  -H "client_secret: secret_xxxxxxxxxxxx"`}</pre>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : clients.length === 0 ? (
        <div className="rounded-2xl py-14 flex flex-col items-center gap-3"
          style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Shield className="w-10 h-10 text-gray-700" />
          <p className="text-sm text-gray-600">Nenhuma credencial criada ainda</p>
          <button onClick={() => setShowCreate(true)}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
            Criar primeira credencial
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map(client => (
            <ClientRow
              key={client.id}
              client={client}
              onToggle={() => toggleMutation.mutate(client.id)}
              onDelete={() => deleteMutation.mutate(client.id)}
              onReset={() => resetMutation.mutate(client.id)}
              onUpdateIps={ips => updateIpsMutation.mutate({ id: client.id, ips })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

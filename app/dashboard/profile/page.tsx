'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  User, Mail, Phone, Lock, Eye, EyeOff, Save, RefreshCw, AtSign, CreditCard, CheckCircle, XCircle,
  AlertTriangle, QrCode, Copy, Check, MapPin, Calendar, Building2, Hash, Key,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import api, { getUser, setUser, setAuthTokens } from '@/lib/api'

const inputCls = 'w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all'
const inputStyle = { background: '#0d0d14', border: '1px solid rgba(138,43,226,0.2)' }
const readonlyStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }

export default function ProfilePage() {
  const qc = useQueryClient()
  const router = useRouter()

  // ── State ────────────────────────────────────────────────────────────────
  const [activationPolling, setActivationPolling] = useState(false)
  const [activationTab, setActivationTab]         = useState<'normal' | 'anonymous'>('normal')
  const [anonymousCharge, setAnonymousCharge]     = useState<any>(null)
  const [copiedQr, setCopiedQr]                   = useState(false)
  const profileInitialized                        = useRef(false)

  const [normalForm, setNormalForm] = useState({
    cpf: '', dateOfBirth: '', addressStreet: '', addressNumber: '',
    addressCity: '', addressState: '', addressZipCode: '',
  })

  const [profileForm, setProfileForm] = useState({
    name: '', phone: '', username: '', cpf: '',
    addressStreet: '', addressNumber: '', addressCity: '', addressState: '', addressZipCode: '',
  })

  const [pwForm, setPwForm]         = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // ── Queries ──────────────────────────────────────────────────────────────
  // Única query para /users/me — reutilizada para perfil e polling de ativação
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/users/me').then(r => r.data.data),
    refetchInterval: activationPolling ? 5000 : false,
  })

  // Detecta ativação via efeito na query unificada
  useEffect(() => {
    if (activationPolling && profile?.accountActivated) {
      setActivationPolling(false)
      sessionStorage.removeItem('anon_charge')
      toast.success('Conta habilitada com sucesso!')
      // Renova o token para que o middleware reconheça a conta como ativada
      const refreshToken = Cookies.get('refresh_token')
      if (refreshToken) {
        api.post('/auth/refresh', { refreshToken })
          .then(r => {
            const { accessToken, refreshToken: newRefresh } = r.data.data
            setAuthTokens(accessToken, newRefresh)
            qc.invalidateQueries()
            setTimeout(() => router.push('/dashboard'), 500)
          })
          .catch(() => {
            qc.invalidateQueries()
            setTimeout(() => router.push('/dashboard'), 500)
          })
      } else {
        qc.invalidateQueries()
        setTimeout(() => router.push('/dashboard'), 1500)
      }
    }
  }, [profile?.accountActivated, activationPolling, qc, router])

  // Restaura charge pendente do sessionStorage ao montar
  useEffect(() => {
    const saved = sessionStorage.getItem('anon_charge')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setAnonymousCharge(parsed)
        setActivationPolling(true)
      } catch { sessionStorage.removeItem('anon_charge') }
    }
  }, [])

  // Inicializa formulário somente na primeira carga
  useEffect(() => {
    if (profile && !profileInitialized.current) {
      profileInitialized.current = true
      setProfileForm({
        name:           profile.name           || '',
        phone:          profile.phone          || '',
        username:       profile.username       || '',
        cpf:            profile.cpf            || '',
        addressStreet:  profile.addressStreet  || '',
        addressNumber:  profile.addressNumber  || '',
        addressCity:    profile.addressCity    || '',
        addressState:   profile.addressState   || '',
        addressZipCode: profile.addressZipCode || '',
      })
      if (profile.cpf) setNormalForm(f => ({ ...f, cpf: profile.cpf }))
    }
  }, [profile])

  // ── Mutations ─────────────────────────────────────────────────────────────
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => api.patch('/users/me', data).then(r => r.data.data),
    onSuccess: (data) => {
      profileInitialized.current = false          // permite re-inicializar com dados novos
      qc.invalidateQueries({ queryKey: ['profile'] })
      const current = getUser()
      if (current) setUser({ ...current, name: data.name, phone: data.phone })
      toast.success('Perfil atualizado!')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Erro ao atualizar perfil'),
  })

  const changePasswordMutation = useMutation({
    mutationFn: (data: any) => api.post('/auth/change-password', data).then(r => r.data),
    onSuccess: () => {
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Senha alterada com sucesso!')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Erro ao alterar senha'),
  })

  const activateNormalMutation = useMutation({
    mutationFn: (data: any) => api.post('/users/activate/normal', data).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      qc.invalidateQueries({ queryKey: ['me'] })
      toast.success('Conta habilitada com sucesso!')
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Erro ao ativar conta'),
  })

  const anonymousActivationMutation = useMutation({
    mutationFn: () => api.post('/users/activate/anonymous').then(r => r.data.data),
    onSuccess: (data) => {
      setAnonymousCharge(data)
      setActivationPolling(true)
      sessionStorage.setItem('anon_charge', JSON.stringify(data))
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Erro ao gerar QR Code'),
  })

  // ── Handlers ──────────────────────────────────────────────────────────────
  const isAnonymous = profile?.accountType === 'ANONYMOUS'
  const isActivated = profile?.accountActivated
  const isAdmin     = profile?.role === 'ADMIN' || profile?.role === 'OWNER'

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: any = {
      phone:    profileForm.phone    || undefined,
      username: profileForm.username || undefined,
    }
    // Endereço só para conta Normal ativada
    if (isActivated && !isAnonymous) {
      if (profileForm.addressStreet)  payload.addressStreet  = profileForm.addressStreet
      if (profileForm.addressNumber)  payload.addressNumber  = profileForm.addressNumber
      if (profileForm.addressCity)    payload.addressCity    = profileForm.addressCity
      if (profileForm.addressState)   payload.addressState   = profileForm.addressState
      if (profileForm.addressZipCode) payload.addressZipCode = profileForm.addressZipCode
    }
    updateProfileMutation.mutate(payload)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pwForm.currentPassword) return toast.error('Informe a senha atual')
    if (pwForm.newPassword.length < 8) return toast.error('Nova senha deve ter pelo menos 8 caracteres')
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('As senhas não coincidem')
    changePasswordMutation.mutate({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
  }

  const handleActivateNormal = (e: React.FormEvent) => {
    e.preventDefault()
    const { cpf, dateOfBirth, addressStreet, addressNumber, addressCity, addressState, addressZipCode } = normalForm
    if (!cpf || !dateOfBirth || !addressStreet || !addressNumber || !addressCity || !addressState || !addressZipCode)
      return toast.error('Preencha todos os campos obrigatórios')
    activateNormalMutation.mutate(normalForm)
  }

  const handleCopyPaste = () => {
    const copyPaste = anonymousCharge?.pix?.copyPaste
    if (copyPaste) {
      navigator.clipboard.writeText(copyPaste)
      setCopiedQr(true)
      setTimeout(() => setCopiedQr(false), 2000)
      toast.success('Código copiado!')
    }
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white">Meu Perfil</h1>
          <p className="text-xs text-gray-500 mt-0.5">Gerencie seus dados cadastrais e senha</p>
        </div>
        {!isActivated && !isAdmin && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold text-red-400"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <AlertTriangle className="w-3.5 h-3.5" /> Conta não Habilitada
          </span>
        )}
        {(isActivated || isAdmin) && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold text-green-400"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
            <CheckCircle className="w-3.5 h-3.5" /> Conta Habilitada
          </span>
        )}
      </div>

      {/* Avatar */}
      <div className="rounded-2xl p-5 flex items-center gap-5"
        style={{ background: '#111118', border: '1px solid rgba(138,43,226,0.15)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #8A2BE2, #5e18a0)', boxShadow: '0 0 24px rgba(138,43,226,0.3)' }}>
          {profile?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-white">{profile?.name}</p>
          {profile?.username && <p className="text-sm text-purple-400">@{profile.username}</p>}
          <p className="text-sm text-gray-500">{profile?.email}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(138,43,226,0.12)', border: '1px solid rgba(138,43,226,0.25)', color: '#c084fc' }}>
              {profile?.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
            </span>
            {(isActivated || isAdmin)
              ? <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-green-400"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <CheckCircle className="w-2.5 h-2.5" /> Verificada
                </span>
              : <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-yellow-400"
                  style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
                  <XCircle className="w-2.5 h-2.5" /> Pendente
                </span>
            }
            {(isActivated || isAdmin) && profile?.accountType && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-blue-400"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                {profile.accountType === 'ANONYMOUS' ? 'Anônima' : 'Normal'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── NÃO ATIVADA: seção de habilitação ── */}
      {!isActivated && !isAdmin && (
        <div className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(239,68,68,0.25)' }}>
          <div className="px-5 py-4"
            style={{ background: 'rgba(239,68,68,0.06)', borderBottom: '1px solid rgba(239,68,68,0.15)' }}>
            <p className="text-sm font-semibold text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Habilite sua conta para acessar o dashboard completo
            </p>
            <p className="text-xs text-gray-500 mt-1">Escolha uma das opções abaixo para continuar</p>
          </div>

          {/* Tabs */}
          <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {(['normal', 'anonymous'] as const).map(tab => (
              <button key={tab} onClick={() => setActivationTab(tab)}
                className={`flex-1 py-3 text-sm font-medium transition-all ${
                  activationTab === tab ? 'text-purple-300 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-300'
                }`}
                style={{ background: activationTab === tab ? 'rgba(138,43,226,0.06)' : '#111118' }}>
                {tab === 'normal' ? 'Conta Normal — Grátis' : 'Conta Anônima — R$49,90'}
              </button>
            ))}
          </div>

          <div className="p-5" style={{ background: '#111118' }}>

            {/* Ativação normal */}
            {activationTab === 'normal' && (
              <form onSubmit={handleActivateNormal} className="space-y-4">
                <p className="text-xs text-gray-500">Preencha seus dados pessoais para ativar a conta gratuitamente.</p>
                <div className="grid grid-cols-2 gap-3">

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">CPF *</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input type="text" required value={normalForm.cpf} maxLength={14} placeholder="000.000.000-00"
                        onChange={e => setNormalForm(f => ({ ...f, cpf: e.target.value }))}
                        className={inputCls} style={inputStyle} />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Data de Nascimento *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input type="date" required value={normalForm.dateOfBirth}
                        onChange={e => setNormalForm(f => ({ ...f, dateOfBirth: e.target.value }))}
                        className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }} />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Rua / Logradouro *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input type="text" required value={normalForm.addressStreet} placeholder="Rua das Flores"
                        onChange={e => setNormalForm(f => ({ ...f, addressStreet: e.target.value }))}
                        className={inputCls} style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Número *</label>
                    <input type="text" required value={normalForm.addressNumber} placeholder="123"
                      onChange={e => setNormalForm(f => ({ ...f, addressNumber: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                      style={inputStyle} />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">CEP *</label>
                    <input type="text" required value={normalForm.addressZipCode} placeholder="00000-000" maxLength={9}
                      onChange={e => setNormalForm(f => ({ ...f, addressZipCode: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                      style={inputStyle} />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Cidade *</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input type="text" required value={normalForm.addressCity} placeholder="São Paulo"
                        onChange={e => setNormalForm(f => ({ ...f, addressCity: e.target.value }))}
                        className={inputCls} style={inputStyle} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Estado *</label>
                    <select required value={normalForm.addressState}
                      onChange={e => setNormalForm(f => ({ ...f, addressState: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                      style={inputStyle}>
                      <option value="">UF</option>
                      {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>

                </div>
                <button type="submit" disabled={activateNormalMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                  style={{ background: 'linear-gradient(135deg, #8A2BE2, #6a0dad)', boxShadow: '0 0 14px rgba(138,43,226,0.25)' }}>
                  {activateNormalMutation.isPending
                    ? <><RefreshCw className="w-4 h-4 animate-spin" />Ativando...</>
                    : <><CheckCircle className="w-4 h-4" />Ativar Conta Normal</>}
                </button>
              </form>
            )}

            {/* Ativação anônima */}
            {activationTab === 'anonymous' && (
              <div className="space-y-4">
                <div className="rounded-xl p-4 text-sm"
                  style={{ background: 'rgba(138,43,226,0.06)', border: '1px solid rgba(138,43,226,0.15)' }}>
                  <p className="text-gray-300 font-medium mb-2">Conta Anônima — R$49,90</p>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li>• Nenhum dado pessoal adicional necessário</li>
                    <li>• Pagamento único via PIX</li>
                    <li>• Ativação automática após confirmação do pagamento</li>
                    <li>• Acesso completo ao dashboard</li>
                  </ul>
                </div>

                {!anonymousCharge ? (
                  <button onClick={() => anonymousActivationMutation.mutate()}
                    disabled={anonymousActivationMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                    style={{ background: 'linear-gradient(135deg, #8A2BE2, #6a0dad)', boxShadow: '0 0 14px rgba(138,43,226,0.25)' }}>
                    {anonymousActivationMutation.isPending
                      ? <><RefreshCw className="w-4 h-4 animate-spin" />Gerando QR Code...</>
                      : <><QrCode className="w-4 h-4" />Gerar QR Code — R$49,90</>}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-3">
                      {anonymousCharge.pix?.copyPaste && (
                        <div className="rounded-xl overflow-hidden p-3"
                          style={{ background: '#fff', width: 216, height: 216 }}>
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(anonymousCharge.pix.copyPaste)}`}
                            alt="QR Code PIX" style={{ width: 192, height: 192 }} />
                        </div>
                      )}
                      <p className="text-sm font-semibold text-white">Pague R$49,90 via PIX</p>
                      <p className="text-xs text-gray-500 text-center">
                        Escaneie o QR Code ou copie o código Pix abaixo.<br />
                        A ativação é automática após o pagamento.
                      </p>
                    </div>
                    {anonymousCharge.pix?.copyPaste && (
                      <div className="rounded-xl p-3 flex items-center gap-2"
                        style={{ background: '#0d0d14', border: '1px solid rgba(138,43,226,0.2)' }}>
                        <p className="flex-1 text-xs text-gray-400 font-mono truncate">
                          {anonymousCharge.pix.copyPaste}
                        </p>
                        <button onClick={handleCopyPaste}
                          className="flex-shrink-0 p-1.5 rounded-lg transition-all hover:bg-white/10">
                          {copiedQr ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-4 h-4 border border-purple-500/50 border-t-purple-500 rounded-full animate-spin flex-shrink-0" />
                      Aguardando confirmação do pagamento...
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── ATIVADA: status de serviços + dados cadastrais ── */}
      {(isActivated || isAdmin) && (
        <>
          {/* Status de serviços */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Cash-in',  active: profile?.cashInEnabled  },
              { label: 'Cash-out', active: profile?.cashOutEnabled },
              { label: 'API',      active: profile?.apiEnabled     },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center gap-1.5 py-3 rounded-xl"
                style={{ background: '#111118', border: '1px solid rgba(138,43,226,0.1)' }}>
                <div className={`w-2 h-2 rounded-full ${s.active ? 'bg-green-400' : 'bg-gray-600'}`} />
                <span className="text-xs text-gray-400">{s.label}</span>
                <span className={`text-xs font-medium ${s.active ? 'text-green-400' : 'text-gray-600'}`}>
                  {s.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            ))}
          </div>

          {/* Dados Cadastrais */}
          <div className="rounded-2xl p-5 space-y-4"
            style={{ background: '#111118', border: '1px solid rgba(138,43,226,0.15)' }}>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-semibold text-white">Dados Cadastrais</h2>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">

              {/* E-mail — sempre readonly */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="email" value={profile?.email || ''} readOnly
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                    style={readonlyStyle} />
                </div>
                <p className="text-xs text-gray-600 mt-1">O e-mail não pode ser alterado</p>
              </div>

              {/* Nome — readonly após ativação */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Nome completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="text" value={profileForm.name} readOnly
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                    style={readonlyStyle} />
                </div>
                <p className="text-xs text-gray-600 mt-1">O nome não pode ser alterado após a ativação</p>
              </div>

              {/* CPF — readonly, somente conta Normal */}
              {!isAnonymous && profile?.cpf && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">CPF</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input type="text" value={profile.cpf} readOnly
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                      style={readonlyStyle} />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">O CPF não pode ser alterado após a ativação</p>
                </div>
              )}

              {/* Telefone — editável */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="tel" value={profileForm.phone} placeholder="+55 (11) 99999-9999"
                    onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                    className={inputCls} style={inputStyle} />
                </div>
              </div>

              {/* @Username — editável */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">@Username</label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="text" value={profileForm.username} placeholder="seuusuario" maxLength={30}
                    onChange={e => setProfileForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                    className={inputCls} style={inputStyle} />
                </div>
                <p className="text-xs text-gray-600 mt-1">Usado para receber transferências internas gratuitas</p>
              </div>

              {/* Endereço — somente conta Normal */}
              {!isAnonymous && (
                <>
                  <div className="pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-xs font-medium text-gray-500 mb-3">Endereço Residencial</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Rua / Logradouro</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input type="text" value={profileForm.addressStreet} placeholder="Rua das Flores"
                        onChange={e => setProfileForm(f => ({ ...f, addressStreet: e.target.value }))}
                        className={inputCls} style={inputStyle} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Número</label>
                      <input type="text" value={profileForm.addressNumber} placeholder="123"
                        onChange={e => setProfileForm(f => ({ ...f, addressNumber: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                        style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">CEP</label>
                      <input type="text" value={profileForm.addressZipCode} placeholder="00000-000" maxLength={9}
                        onChange={e => setProfileForm(f => ({ ...f, addressZipCode: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                        style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Cidade</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input type="text" value={profileForm.addressCity} placeholder="São Paulo"
                          onChange={e => setProfileForm(f => ({ ...f, addressCity: e.target.value }))}
                          className={inputCls} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">Estado</label>
                      <select value={profileForm.addressState}
                        onChange={e => setProfileForm(f => ({ ...f, addressState: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                        style={inputStyle}>
                        <option value="">UF</option>
                        {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Chave PIX — readonly */}
              {profile?.pixKey && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Chave PIX</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input type="text" value={profile.pixKey} readOnly
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-gray-500 cursor-not-allowed font-mono text-xs"
                      style={readonlyStyle} />
                  </div>
                </div>
              )}

              <button type="submit" disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                style={{ background: 'linear-gradient(135deg, #8A2BE2, #6a0dad)', boxShadow: '0 0 14px rgba(138,43,226,0.25)' }}>
                {updateProfileMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar Alterações
              </button>
            </form>
          </div>

          {/* Alterar Senha */}
          <div className="rounded-2xl p-5 space-y-4"
            style={{ background: '#111118', border: '1px solid rgba(138,43,226,0.15)' }}>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-semibold text-white">Alterar Senha</h2>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {[
                { label: 'Senha atual',         key: 'currentPassword', show: showCurrent, toggle: setShowCurrent },
                { label: 'Nova senha',          key: 'newPassword',     show: showNew,     toggle: setShowNew     },
                { label: 'Confirmar nova senha',key: 'confirmPassword', show: showConfirm, toggle: setShowConfirm },
              ].map(({ label, key, show, toggle }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input type={show ? 'text' : 'password'} value={(pwForm as any)[key]}
                      onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                      style={inputStyle}
                      placeholder={key === 'newPassword' ? 'Mínimo 8 caracteres' : '••••••••'} />
                    <button type="button" onClick={() => toggle(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {key === 'newPassword' && pwForm.newPassword.length > 0 && pwForm.newPassword.length < 8 && (
                    <p className="text-xs text-red-400 mt-1">Mínimo 8 caracteres</p>
                  )}
                  {key === 'confirmPassword' && pwForm.confirmPassword && pwForm.confirmPassword !== pwForm.newPassword && (
                    <p className="text-xs text-red-400 mt-1">As senhas não coincidem</p>
                  )}
                </div>
              ))}
              <button type="submit"
                disabled={changePasswordMutation.isPending || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                style={{ background: 'rgba(138,43,226,0.2)', border: '1px solid rgba(138,43,226,0.35)' }}>
                {changePasswordMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                Alterar Senha
              </button>
            </form>
          </div>
        </>
      )}

      {/* Alterar senha disponível também para não ativados */}
      {!isActivated && !isAdmin && (
        <div className="rounded-2xl p-5 space-y-4"
          style={{ background: '#111118', border: '1px solid rgba(138,43,226,0.15)' }}>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white">Alterar Senha</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { label: 'Senha atual',          key: 'currentPassword', show: showCurrent, toggle: setShowCurrent },
              { label: 'Nova senha',           key: 'newPassword',     show: showNew,     toggle: setShowNew     },
              { label: 'Confirmar nova senha', key: 'confirmPassword', show: showConfirm, toggle: setShowConfirm },
            ].map(({ label, key, show, toggle }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type={show ? 'text' : 'password'} value={(pwForm as any)[key]}
                    onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                    style={inputStyle}
                    placeholder={key === 'newPassword' ? 'Mínimo 8 caracteres' : '••••••••'} />
                  <button type="button" onClick={() => toggle(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {key === 'newPassword' && pwForm.newPassword.length > 0 && pwForm.newPassword.length < 8 && (
                  <p className="text-xs text-red-400 mt-1">Mínimo 8 caracteres</p>
                )}
                {key === 'confirmPassword' && pwForm.confirmPassword && pwForm.confirmPassword !== pwForm.newPassword && (
                  <p className="text-xs text-red-400 mt-1">As senhas não coincidem</p>
                )}
              </div>
            ))}
            <button type="submit"
              disabled={changePasswordMutation.isPending || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
              style={{ background: 'rgba(138,43,226,0.2)', border: '1px solid rgba(138,43,226,0.35)' }}>
              {changePasswordMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              Alterar Senha
            </button>
          </form>
        </div>
      )}

    </div>
  )
}

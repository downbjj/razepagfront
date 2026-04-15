'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  User, Mail, Phone, Key, Lock, Eye, EyeOff, Save, RefreshCw, AtSign, CreditCard, CheckCircle, XCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import api, { getUser, setUser } from '@/lib/api'

export default function ProfilePage() {
  const qc = useQueryClient()
  const localUser = getUser()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/users/me').then(r => r.data.data),
  })

  const [profileForm, setProfileForm] = useState({ name: '', phone: '', username: '', cpf: '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name:     profile.name     || '',
        phone:    profile.phone    || '',
        username: profile.username || '',
        cpf:      profile.cpf      || '',
      })
    }
  }, [profile])

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => api.patch('/users/me', data).then(r => r.data.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      // Update local storage user info
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

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileForm.name.trim()) return toast.error('Nome não pode ser vazio')
    const payload: any = { name: profileForm.name, phone: profileForm.phone || undefined }
    if (profileForm.username) payload.username = profileForm.username
    if (profileForm.cpf)      payload.cpf      = profileForm.cpf
    updateProfileMutation.mutate(payload)
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pwForm.currentPassword) return toast.error('Informe a senha atual')
    if (pwForm.newPassword.length < 8) return toast.error('Nova senha deve ter pelo menos 8 caracteres')
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('As senhas não coincidem')
    changePasswordMutation.mutate({
      currentPassword: pwForm.currentPassword,
      newPassword: pwForm.newPassword,
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Meu Perfil</h1>
        <p className="text-xs text-gray-500 mt-0.5">Gerencie seus dados cadastrais e senha</p>
      </div>

      {/* Avatar block */}
      <div className="rounded-2xl p-5 flex items-center gap-5"
        style={{ background: '#111118', border: '1px solid rgba(138,43,226,0.15)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #8A2BE2, #5e18a0)', boxShadow: '0 0 24px rgba(138,43,226,0.3)' }}>
          {profile?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-white">{profile?.name}</p>
          {profile?.username && (
            <p className="text-sm text-purple-400">@{profile.username}</p>
          )}
          <p className="text-sm text-gray-500">{profile?.email}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(138,43,226,0.12)', border: '1px solid rgba(138,43,226,0.25)', color: '#c084fc' }}>
              {profile?.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
            </span>
            {profile?.accountActivated
              ? <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-green-400"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <CheckCircle className="w-2.5 h-2.5" /> Verificada
                </span>
              : <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-yellow-400"
                  style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
                  <XCircle className="w-2.5 h-2.5" /> Pendente
                </span>
            }
          </div>
        </div>
      </div>

      {/* Services status */}
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

      {/* Profile form */}
      <div className="rounded-2xl p-5 space-y-5"
        style={{ background: '#111118', border: '1px solid rgba(138,43,226,0.15)' }}>
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-white">Dados Cadastrais</h2>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          {/* Email — read only */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="email"
                value={profile?.email || ''}
                readOnly
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">O e-mail não pode ser alterado</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Nome completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={profileForm.name}
                onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                style={{ background: '#0d0d14', border: '1px solid rgba(138,43,226,0.2)' }}
                placeholder="Seu nome completo"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Telefone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="tel"
                value={profileForm.phone}
                onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                style={{ background: '#0d0d14', border: '1px solid rgba(138,43,226,0.2)' }}
                placeholder="+55 (11) 99999-9999"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">@Username</label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={profileForm.username}
                onChange={e => setProfileForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                style={{ background: '#0d0d14', border: '1px solid rgba(138,43,226,0.2)' }}
                placeholder="seuusuario"
                maxLength={30}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">Usado para receber transferências internas gratuitas</p>
          </div>

          {/* CPF */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">CPF</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={profileForm.cpf}
                onChange={e => setProfileForm(f => ({ ...f, cpf: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                style={{ background: '#0d0d14', border: '1px solid rgba(138,43,226,0.2)' }}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>
          </div>

          {/* PIX key — read only */}
          {profile?.pixKey && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Chave PIX</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="text"
                  value={profile.pixKey}
                  readOnly
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-gray-500 cursor-not-allowed font-mono text-xs"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
            style={{ background: 'linear-gradient(135deg, #8A2BE2, #6a0dad)', boxShadow: '0 0 14px rgba(138,43,226,0.25)' }}
          >
            {updateProfileMutation.isPending
              ? <RefreshCw className="w-4 h-4 animate-spin" />
              : <Save className="w-4 h-4" />
            }
            Salvar Alterações
          </button>
        </form>
      </div>

      {/* Password change form */}
      <div className="rounded-2xl p-5 space-y-5"
        style={{ background: '#111118', border: '1px solid rgba(138,43,226,0.15)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-semibold text-white">Alterar Senha</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {/* Current password */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Senha atual</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type={showCurrent ? 'text' : 'password'}
                value={pwForm.currentPassword}
                onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                style={{ background: '#0d0d14', border: '1px solid rgba(138,43,226,0.2)' }}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowCurrent(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Nova senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type={showNew ? 'text' : 'password'}
                value={pwForm.newPassword}
                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                style={{ background: '#0d0d14', border: '1px solid rgba(138,43,226,0.2)' }}
                placeholder="Mínimo 8 caracteres"
              />
              <button type="button" onClick={() => setShowNew(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {pwForm.newPassword.length > 0 && pwForm.newPassword.length < 8 && (
              <p className="text-xs text-red-400 mt-1">Mínimo 8 caracteres</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirmar nova senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type={showConfirm ? 'text' : 'password'}
                value={pwForm.confirmPassword}
                onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-white focus:outline-none transition-all"
                style={{ background: '#0d0d14', border: '1px solid rgba(138,43,226,0.2)' }}
                placeholder="Repita a nova senha"
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {pwForm.confirmPassword && pwForm.confirmPassword !== pwForm.newPassword && (
              <p className="text-xs text-red-400 mt-1">As senhas não coincidem</p>
            )}
          </div>

          <button
            type="submit"
            disabled={changePasswordMutation.isPending || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
            style={{ background: 'rgba(138,43,226,0.2)', border: '1px solid rgba(138,43,226,0.35)' }}
          >
            {changePasswordMutation.isPending
              ? <RefreshCw className="w-4 h-4 animate-spin" />
              : <Lock className="w-4 h-4" />
            }
            Alterar Senha
          </button>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { UserCheck, FileClock, FileCheck, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'

function KycStatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  )
}

export default function KycSystemPage() {
  const { data: pending }  = useQuery({
    queryKey: ['kyc-pending'],
    queryFn:  () => api.get('/admin/documents', { params: { status: 'PENDING',  limit: 1 } }).then(r => r.data.data?.total || 0),
    refetchInterval: 30000,
  })
  const { data: approved } = useQuery({
    queryKey: ['kyc-approved'],
    queryFn:  () => api.get('/admin/documents', { params: { status: 'APPROVED', limit: 1 } }).then(r => r.data.data?.total || 0),
  })
  const { data: rejected } = useQuery({
    queryKey: ['kyc-rejected'],
    queryFn:  () => api.get('/admin/documents', { params: { status: 'REJECTED', limit: 1 } }).then(r => r.data.data?.total || 0),
  })

  const total = (pending || 0) + (approved || 0) + (rejected || 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Sistema KYC</h1>
        <p className="text-gray-500 text-sm mt-1">Painel de controle de verificação de identidade</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KycStatCard label="Total" value={total} icon={UserCheck} color="text-white" bg="bg-surface-2" />
        <KycStatCard label="Pendentes" value={pending || 0} icon={Clock} color="text-yellow-400" bg="bg-yellow-500/10" />
        <KycStatCard label="Aprovados" value={approved || 0} icon={FileCheck} color="text-green-400" bg="bg-green-500/10" />
        <KycStatCard label="Rejeitados" value={rejected || 0} icon={XCircle} color="text-red-400" bg="bg-red-500/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/documents"
          className="bg-surface border border-border rounded-xl p-6 hover:border-yellow-500/30 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <FileClock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Revisar Pendentes</p>
              <p className="text-xs text-gray-500">{pending || 0} aguardando revisão</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">Analise e aprove ou rejeite documentos enviados pelos usuários.</p>
        </Link>

        <Link href="/admin/documents/approved"
          className="bg-surface border border-border rounded-xl p-6 hover:border-green-500/30 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Documentos Aprovados</p>
              <p className="text-xs text-gray-500">{approved || 0} aprovados</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">Visualize todos os documentos já aprovados na plataforma.</p>
        </Link>

        <Link href="/admin/documents?status=REJECTED"
          className="bg-surface border border-border rounded-xl p-6 hover:border-red-500/30 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Documentos Rejeitados</p>
              <p className="text-xs text-gray-500">{rejected || 0} rejeitados</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">Visualize e gerencie documentos rejeitados.</p>
        </Link>
      </div>

      {/* Info box */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white mb-4">Como funciona o KYC</h2>
        <div className="space-y-3 text-sm text-gray-400">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-xs text-purple-400 font-bold">1</div>
            <p>Usuário envia documento via API ou painel (CPF, RG, CNH, Selfie, etc.)</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-xs text-purple-400 font-bold">2</div>
            <p>Admin analisa o documento na aba "Documentos" e aprova ou rejeita com observação</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-xs text-purple-400 font-bold">3</div>
            <p>Usuário é notificado e pode continuar ou reenviar documentos conforme necessário</p>
          </div>
        </div>
      </div>
    </div>
  )
}

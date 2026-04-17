'use client'

import Link from 'next/link'
import { QrCode, Webhook, Shield, BarChart3, Key, Send, ArrowRight } from 'lucide-react'
import LandingNav from '@/components/layout/LandingNav'

export default function RecursosPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <LandingNav />

      <div className="max-w-5xl mx-auto px-4 pt-36 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6" style={{background:'rgba(168,85,247,0.1)',borderColor:'rgba(168,85,247,0.3)'}}>
            <span className="text-xs text-purple-400 font-medium">Funcionalidades</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Recursos do <span className="text-transparent bg-clip-text" style={{backgroundImage:'linear-gradient(135deg,#A855F7,#c084fc)'}}>RazePague</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Tudo que você precisa para aceitar e gerenciar pagamentos PIX na sua plataforma.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              icon: QrCode,
              title: 'Cobranças PIX com QR Code',
              desc: 'Gere QR Codes dinâmicos para receber pagamentos. O cliente escaneia e paga instantaneamente pelo app do banco.',
              items: ['QR Code dinâmico', 'Código copia e cola', 'Expiração configurável', 'Confirmação automática'],
            },
            {
              icon: Webhook,
              title: 'Webhooks em tempo real',
              desc: 'Receba notificações instantâneas em sua aplicação quando um pagamento for confirmado.',
              items: ['Notificação imediata', 'Assinatura HMAC-SHA256', 'Retry automático', 'Logs completos'],
            },
            {
              icon: Shield,
              title: 'Segurança avançada',
              desc: 'Proteção completa com autenticação JWT, criptografia e conformidade bancária.',
              items: ['JWT + Refresh Tokens', 'Rate limiting', 'Sanitização de dados', 'Auditoria completa'],
            },
            {
              icon: BarChart3,
              title: 'Dashboard completo',
              desc: 'Monitore saldo, transações e métricas em tempo real com interface moderna.',
              items: ['Saldo disponível e pendente', 'Histórico de transações', 'Filtros avançados', 'Exportação'],
            },
            {
              icon: Key,
              title: 'API com autenticação',
              desc: 'API REST completa com autenticação por API Key para integrar em qualquer sistema.',
              items: ['API Key por usuário', 'Endpoints documentados', 'Rate limiting por chave', 'Logs de uso'],
            },
            {
              icon: Send,
              title: 'Transferências internas',
              desc: 'Transfira saldo entre usuários da plataforma instantaneamente, sem taxas extras.',
              items: ['Transferência por PIX key', 'Instantâneo', 'Notificação para ambos', 'Histórico detalhado'],
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl p-6" style={{background:'#0d0d0d',border:'1px solid #1f1f1f'}}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(168,85,247,0.12)'}}>
                  <f.icon className="w-5 h-5" style={{color:'#A855F7'}} />
                </div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              </div>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{f.desc}</p>
              <ul className="space-y-1.5">
                {f.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:'#A855F7'}} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center rounded-2xl p-10" style={{background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.2)'}}>
          <h2 className="text-2xl font-bold text-white mb-3">Pronto para começar?</h2>
          <p className="text-gray-400 mb-6">Crie sua conta gratuitamente e comece a receber pagamentos PIX hoje.</p>
          <Link href="/register" className="inline-flex items-center gap-2 text-white px-8 py-3 rounded-xl font-semibold" style={{background:'#A855F7'}}>
            Crie sua conta <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

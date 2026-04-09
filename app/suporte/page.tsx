'use client'

import { Mail, MessageCircle, FileText, Clock } from 'lucide-react'
import LandingNav from '@/components/layout/LandingNav'

export default function SuportePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <LandingNav />

      <div className="max-w-4xl mx-auto px-4 pt-36 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Central de Suporte</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Estamos aqui para ajudar. Escolha o melhor canal de atendimento.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Mail,          title:'E-mail',           desc:'suporte@razepague.com', sub:'Resposta em até 24h', href:'mailto:suporte@razepague.com' },
            { icon: MessageCircle, title:'Chat ao Vivo',      desc:'Disponível no painel', sub:'Seg-Sex 9h-18h', href:'/login' },
            { icon: FileText,      title:'Documentação',      desc:'Guias e referência API', sub:'Sempre disponível', href:'/documentacao' },
          ].map(c => (
            <a key={c.title} href={c.href} className="block rounded-2xl p-6 text-center transition-all hover:border-[#8A2BE2]/40" style={{background:'#0d0d0d',border:'1px solid #1f1f1f'}}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{background:'rgba(138,43,226,0.12)'}}>
                <c.icon className="w-6 h-6" style={{color:'#8A2BE2'}} />
              </div>
              <h3 className="font-semibold text-white mb-1">{c.title}</h3>
              <p className="text-sm text-gray-400">{c.desc}</p>
              <p className="text-xs text-gray-600 mt-1 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" /> {c.sub}
              </p>
            </a>
          ))}
        </div>

        {/* FAQ */}
        <div className="rounded-2xl p-8" style={{background:'#0d0d0d',border:'1px solid #1f1f1f'}}>
          <h2 className="text-2xl font-bold text-white mb-6">Perguntas frequentes</h2>
          <div className="space-y-6">
            {[
              { q:'Qual a taxa por transação?',         a:'Nossa taxa é de 3% + R$1,00 por transação. Sem mensalidade, sem taxa de manutenção.' },
              { q:'Em quanto tempo cai o pagamento?',   a:'Pagamentos PIX são confirmados em segundos. Automaticamente, 24/7.' },
              { q:'Como integro o PIX no meu sistema?', a:'Basta criar sua conta, obter uma API Key no painel e usar nossos endpoints. Veja a documentação para exemplos.' },
              { q:'Como configuro webhooks?',           a:'No painel do usuário, acesse "Webhooks" e cadastre sua URL. Você receberá notificações assinadas com HMAC-SHA256.' },
              { q:'Quando posso sacar meu saldo?',      a:'O saldo disponível pode ser sacado a qualquer momento, sujeito a uma taxa de 2% sobre o valor.' },
              { q:'Os dados são seguros?',              a:'Sim. Usamos criptografia SSL/TLS, senhas com bcrypt, tokens JWT e seguimos as normas do Banco Central do Brasil.' },
            ].map(f => (
              <div key={f.q} className="pb-6" style={{borderBottom:'1px solid #1f1f1f'}}>
                <h3 className="font-medium text-white mb-2">{f.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">Não encontrou o que procurava?</p>
          <a href="mailto:suporte@razepague.com" className="text-sm mt-2 inline-block" style={{color:'#8A2BE2'}}>
            Envie um e-mail para suporte@razepague.com
          </a>
        </div>
      </div>
    </div>
  )
}

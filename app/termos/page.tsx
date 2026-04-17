'use client'

import Link from 'next/link'
import LandingNav from '@/components/layout/LandingNav'

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <LandingNav />

      <div className="max-w-3xl mx-auto px-4 pt-36 pb-20">
        <h1 className="text-4xl font-bold text-white mb-2">Termos de Uso</h1>
        <p className="text-gray-500 mb-10 text-sm">Última atualização: Janeiro de 2025</p>

        <div className="prose prose-invert max-w-none space-y-8">
          {[
            {
              title: '1. Aceitação dos Termos',
              text: 'Ao criar uma conta na Razepag, você concorda com estes Termos de Uso e com nossa Política de Privacidade. Se você não concordar com qualquer parte destes termos, não poderá utilizar nossos serviços.',
            },
            {
              title: '2. Descrição do Serviço',
              text: 'A Razepag é uma plataforma de gateway de pagamentos que permite a criação e recebimento de cobranças via PIX, transferências entre usuários e gestão financeira através de nossa API e painel web.',
            },
            {
              title: '3. Cadastro e Conta',
              text: 'Para usar nossos serviços, você deve ter pelo menos 18 anos, fornecer informações verdadeiras e manter a confidencialidade de sua senha. Você é responsável por todas as atividades realizadas em sua conta.',
            },
            {
              title: '4. Taxas e Pagamentos',
              text: 'Cobramos uma taxa de 3% + R$1,00 por transação processada. Para saques, a taxa é de 2% sobre o valor sacado. Não há mensalidade ou taxa de manutenção. As taxas podem ser alteradas com aviso prévio de 30 dias.',
            },
            {
              title: '5. Uso Aceitável',
              text: 'Você concorda em usar a Razepag apenas para fins legais. É proibido utilizar a plataforma para atividades ilegais, fraudes, lavagem de dinheiro ou qualquer atividade que viole leis brasileiras ou regulamentações do Banco Central.',
            },
            {
              title: '6. Segurança',
              text: 'A Razepag emprega medidas de segurança de nível bancário, incluindo criptografia SSL/TLS, autenticação JWT e conformidade com as normas do Banco Central do Brasil. No entanto, você é responsável por manter a segurança de suas credenciais.',
            },
            {
              title: '7. Limitação de Responsabilidade',
              text: 'A Razepag não se responsabiliza por perdas indiretas, lucros cessantes ou danos consequentes. Nossa responsabilidade máxima fica limitada ao valor das taxas pagas nos últimos 12 meses.',
            },
            {
              title: '8. Rescisão',
              text: 'A Razepag reserva-se o direito de suspender ou encerrar contas que violem estes termos, com ou sem aviso prévio. Você pode encerrar sua conta a qualquer momento, mediante saque do saldo disponível.',
            },
            {
              title: '9. Privacidade',
              text: 'Coletamos apenas os dados necessários para operar o serviço. Seus dados pessoais são protegidos nos termos da Lei Geral de Proteção de Dados (LGPD). Não vendemos seus dados para terceiros.',
            },
            {
              title: '10. Contato',
              text: 'Para dúvidas sobre estes termos, entre em contato através do e-mail juridico@razepag.com ou acesse nossa Central de Suporte.',
            },
          ].map(s => (
            <div key={s.title} className="pb-6" style={{borderBottom:'1px solid #1f1f1f'}}>
              <h2 className="text-lg font-semibold text-white mb-3" style={{color:'#c084fc'}}>{s.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl text-center" style={{background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.2)'}}>
          <p className="text-gray-400 text-sm mb-4">Dúvidas sobre os termos?</p>
          <Link href="/suporte" className="text-sm font-medium" style={{color:'#A855F7'}}>
            Fale com nosso suporte →
          </Link>
        </div>
      </div>
    </div>
  )
}

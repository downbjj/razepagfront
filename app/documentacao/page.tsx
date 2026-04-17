'use client'

import Link from 'next/link'
import { Code2, ArrowRight, Terminal } from 'lucide-react'
import LandingNav from '@/components/layout/LandingNav'

export default function DocumentacaoPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <LandingNav />

      <div className="max-w-4xl mx-auto px-4 pt-36 pb-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6" style={{background:'rgba(168,85,247,0.1)',borderColor:'rgba(168,85,247,0.3)'}}>
            <Code2 className="w-3 h-3 text-purple-400" />
            <span className="text-xs text-purple-400 font-medium">API Reference</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Documentação Oficial</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Integre pagamentos PIX na sua aplicação com nossa API REST simples e poderosa.
          </p>
        </div>

        <div className="space-y-8">
          {/* Authentication */}
          <section className="rounded-2xl p-8" style={{background:'#0d0d0d',border:'1px solid #1f1f1f'}}>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Terminal className="w-5 h-5" style={{color:'#A855F7'}} /> Autenticação
            </h2>
            <p className="text-gray-500 text-sm mb-4">Todas as requisições autenticadas requerem o header <code className="text-purple-400 bg-black/40 px-1.5 py-0.5 rounded text-xs">Authorization: Bearer {'{token}'}</code></p>
            <div className="rounded-xl p-4 font-mono text-sm overflow-x-auto" style={{background:'#050505',border:'1px solid #2a2a2a'}}>
              <p className="text-gray-500"># Login</p>
              <p className="text-green-400">POST /api/auth/login</p>
              <p className="text-gray-300 mt-2">{'{'}</p>
              <p className="text-gray-300 ml-4">"email": "user@email.com",</p>
              <p className="text-gray-300 ml-4">"password": "sua_senha"</p>
              <p className="text-gray-300">{'}'}</p>
            </div>
          </section>

          {/* Criar cobrança */}
          <section className="rounded-2xl p-8" style={{background:'#0d0d0d',border:'1px solid #1f1f1f'}}>
            <h2 className="text-xl font-bold text-white mb-2">Criar Cobrança PIX</h2>
            <p className="text-gray-500 text-sm mb-4">Gera um QR Code PIX para receber um pagamento.</p>
            <div className="rounded-xl p-4 font-mono text-sm overflow-x-auto mb-4" style={{background:'#050505',border:'1px solid #2a2a2a'}}>
              <p className="text-green-400">POST /api/pix/charge</p>
              <p className="text-gray-500 mt-2"># Body</p>
              <p className="text-gray-300">{'{'}</p>
              <p className="text-gray-300 ml-4">"amount": 100.00,</p>
              <p className="text-gray-300 ml-4">"description": "Pedido #1234" <span className="text-gray-600">// opcional</span></p>
              <p className="text-gray-300">{'}'}</p>
            </div>
            <div className="rounded-xl p-4 font-mono text-sm overflow-x-auto" style={{background:'#050505',border:'1px solid #2a2a2a'}}>
              <p className="text-gray-500"># Resposta</p>
              <p className="text-gray-300">{'{'}</p>
              <p className="text-gray-300 ml-4">"id": "uuid",</p>
              <p className="text-gray-300 ml-4">"amount": 100.00,</p>
              <p className="text-gray-300 ml-4">"fee": 4.00, <span className="text-gray-600">// 3% + R$1,00</span></p>
              <p className="text-gray-300 ml-4">"netAmount": 96.00,</p>
              <p className="text-gray-300 ml-4">"status": "PENDING",</p>
              <p className="text-gray-300 ml-4">"pixQrCode": "data:image/png;base64,...",</p>
              <p className="text-gray-300 ml-4">"pixCopyPaste": "00020126..."</p>
              <p className="text-gray-300">{'}'}</p>
            </div>
          </section>

          {/* Consultar status */}
          <section className="rounded-2xl p-8" style={{background:'#0d0d0d',border:'1px solid #1f1f1f'}}>
            <h2 className="text-xl font-bold text-white mb-2">Consultar Transação</h2>
            <p className="text-gray-500 text-sm mb-4">Verifica o status de uma transação específica.</p>
            <div className="rounded-xl p-4 font-mono text-sm overflow-x-auto" style={{background:'#050505',border:'1px solid #2a2a2a'}}>
              <p className="text-blue-400">GET /api/pix/transactions/{'{id}'}</p>
              <p className="text-gray-500 mt-2"># Resposta</p>
              <p className="text-gray-300">{'{'}</p>
              <p className="text-gray-300 ml-4">"id": "uuid",</p>
              <p className="text-gray-300 ml-4">"type": "PIX_IN",</p>
              <p className="text-gray-300 ml-4">"status": "COMPLETED", <span className="text-gray-600">// PENDING | COMPLETED | FAILED</span></p>
              <p className="text-gray-300 ml-4">"amount": 100.00,</p>
              <p className="text-gray-300 ml-4">"fee": 4.00,</p>
              <p className="text-gray-300 ml-4">"netAmount": 96.00,</p>
              <p className="text-gray-300 ml-4">"createdAt": "2025-01-01T00:00:00Z"</p>
              <p className="text-gray-300">{'}'}</p>
            </div>
          </section>

          {/* Webhooks */}
          <section className="rounded-2xl p-8" style={{background:'#0d0d0d',border:'1px solid #1f1f1f'}}>
            <h2 className="text-xl font-bold text-white mb-2">Webhooks</h2>
            <p className="text-gray-500 text-sm mb-4">Configure uma URL para receber notificações automáticas quando pagamentos forem confirmados.</p>
            <div className="rounded-xl p-4 font-mono text-sm overflow-x-auto mb-4" style={{background:'#050505',border:'1px solid #2a2a2a'}}>
              <p className="text-gray-500"># Payload enviado para sua URL</p>
              <p className="text-gray-300">{'{'}</p>
              <p className="text-gray-300 ml-4">"event": "payment.completed",</p>
              <p className="text-gray-300 ml-4">"data": {'{'}</p>
              <p className="text-gray-300 ml-8">"transactionId": "uuid",</p>
              <p className="text-gray-300 ml-8">"amount": 100.00,</p>
              <p className="text-gray-300 ml-8">"netAmount": 96.00</p>
              <p className="text-gray-300 ml-4">{'}'},</p>
              <p className="text-gray-300 ml-4">"timestamp": "2025-01-01T00:00:00Z"</p>
              <p className="text-gray-300">{'}'}</p>
            </div>
            <p className="text-xs text-gray-600">A assinatura HMAC-SHA256 é enviada no header <code className="text-purple-400">X-Webhook-Signature</code></p>
          </section>

          {/* API v1 — EcomPag-compatible */}
          <section className="rounded-2xl p-8" style={{background:'#0d0d0d',border:'1px solid #1f1f1f'}}>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-white">API Gateway (v1/v2)</h2>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{background:'rgba(168,85,247,0.15)',color:'#c084fc',border:'1px solid rgba(168,85,247,0.3)'}}>client_id + client_secret</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Endpoints para integração direta — use <code className="text-purple-400 bg-black/40 px-1 rounded text-xs">client_id</code> e <code className="text-purple-400 bg-black/40 px-1 rounded text-xs">client_secret</code> como parâmetros (query ou body).
            </p>

            <div className="space-y-4">
              {/* QR Code */}
              <div className="rounded-xl p-4 font-mono text-sm overflow-x-auto" style={{background:'#050505',border:'1px solid #2a2a2a'}}>
                <p className="text-gray-500 mb-1"># Gerar QR Code PIX</p>
                <p className="text-green-400">POST /api/v1/c1/qrcode.php</p>
                <p className="text-gray-300 mt-2">{'{'}</p>
                <p className="text-gray-300 ml-4">"client_id": "...",</p>
                <p className="text-gray-300 ml-4">"client_secret": "...",</p>
                <p className="text-gray-300 ml-4">"valor": 100.00,</p>
                <p className="text-gray-300 ml-4">"nome": "João Silva",</p>
                <p className="text-gray-300 ml-4">"cpf": "123.456.789-00",</p>
                <p className="text-gray-300 ml-4">"descricao": "Pedido #1234",</p>
                <p className="text-gray-300 ml-4">"url_callback": "https://seusite.com/webhook" <span className="text-gray-600">// opcional</span></p>
                <p className="text-gray-300">{'}'}</p>
                <p className="text-gray-500 mt-3 mb-1"># Resposta</p>
                <p className="text-gray-300">{'{ "gateway": "razepag", "transactionId": "...", "status": "PENDING", "type": "RECEIVEPIX",\n  "amount": 100.00, "tax": 4.00, "total": 96.00, "qrcode": "base64...", "qrcode_text": "00020..." }'}</p>
              </div>

              {/* Payment */}
              <div className="rounded-xl p-4 font-mono text-sm overflow-x-auto" style={{background:'#050505',border:'1px solid #2a2a2a'}}>
                <p className="text-gray-500 mb-1"># Enviar PIX (saída)</p>
                <p className="text-green-400">POST /api/v1/c1/payment.php</p>
                <p className="text-gray-300 mt-2">{'{ "client_id": "...", "client_secret": "...", "chave_pix": "...", "valor": 50.00 }'}</p>
              </div>

              {/* Status */}
              <div className="rounded-xl p-4 font-mono text-sm overflow-x-auto" style={{background:'#050505',border:'1px solid #2a2a2a'}}>
                <p className="text-gray-500 mb-1"># Consultar status</p>
                <p className="text-blue-400">GET /api/v1/c1/status.php?client_id=...&client_secret=...&transaction_id=...</p>
              </div>

              {/* Balance */}
              <div className="rounded-xl p-4 font-mono text-sm overflow-x-auto" style={{background:'#050505',border:'1px solid #2a2a2a'}}>
                <p className="text-gray-500 mb-1"># Consultar saldo</p>
                <p className="text-blue-400">GET /api/v2/account/balance.php?client_id=...&client_secret=...</p>
                <p className="text-gray-300 mt-2">{'{ "gateway": "razepag", "balance": 250.00, "pending_balance": 0.00 }'}</p>
              </div>
            </div>
          </section>

          {/* Webhook format */}
          <section className="rounded-2xl p-8" style={{background:'#0d0d0d',border:'1px solid #1f1f1f'}}>
            <h2 className="text-xl font-bold text-white mb-2">Formato do Webhook</h2>
            <p className="text-gray-500 text-sm mb-4">Payload enviado para sua URL de callback quando um pagamento é confirmado.</p>
            <div className="rounded-xl p-4 font-mono text-sm overflow-x-auto" style={{background:'#050505',border:'1px solid #2a2a2a'}}>
              <p className="text-gray-300">{'{'}</p>
              <p className="text-gray-300 ml-4">"gateway": "razepag",</p>
              <p className="text-gray-300 ml-4">"transactionId": "uuid",</p>
              <p className="text-gray-300 ml-4">"external_id": "sua-referencia",</p>
              <p className="text-gray-300 ml-4">"status": "PAID",</p>
              <p className="text-gray-300 ml-4">"type": "RECEIVEPIX", <span className="text-gray-600">// ou PAYMENT / TRANSFER</span></p>
              <p className="text-gray-300 ml-4">"amount": 100.00,</p>
              <p className="text-gray-300 ml-4">"tax": 4.00,</p>
              <p className="text-gray-300 ml-4">"total": 96.00,</p>
              <p className="text-gray-300 ml-4">"created_at": "2025-01-01T00:00:00Z",</p>
              <p className="text-gray-300 ml-4">"updated_at": "2025-01-01T00:00:00Z"</p>
              <p className="text-gray-300">{'}'}</p>
            </div>
            <p className="text-xs text-gray-600 mt-3">Assinatura HMAC-SHA256 no header <code className="text-purple-400">X-Webhook-Signature</code></p>
          </section>

          {/* Transferência interna */}
          <section className="rounded-2xl p-8" style={{background:'#0d0d0d',border:'1px solid #1f1f1f'}}>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-white">Transferência Interna</h2>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{background:'rgba(34,197,94,0.1)',color:'#4ade80',border:'1px solid rgba(34,197,94,0.2)'}}>Grátis</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Transferências entre contas RazePag por <code className="text-purple-400 bg-black/40 px-1 rounded text-xs">@username</code> são completamente gratuitas — sem taxa alguma.
            </p>
            <div className="rounded-xl p-4 font-mono text-sm overflow-x-auto" style={{background:'#050505',border:'1px solid #2a2a2a'}}>
              <p className="text-green-400">POST /api/v1/transfer</p>
              <p className="text-gray-300 mt-2">{'{ "client_id": "...", "client_secret": "...", "username": "joaosilva", "valor": 50.00 }'}</p>
            </div>
          </section>

          {/* Taxas */}
          <section className="rounded-2xl p-8" style={{background:'#0d0d0d',border:'1px solid #1f1f1f'}}>
            <h2 className="text-xl font-bold text-white mb-2">Sistema de Taxas</h2>
            <p className="text-gray-500 text-sm mb-4">Todas as transações seguem a mesma regra de taxa.</p>
            <div className="rounded-xl p-4 font-mono text-sm" style={{background:'#050505',border:'1px solid #2a2a2a'}}>
              <p className="text-purple-400">taxa = (valor × 0.03) + 1.00</p>
              <p className="text-gray-600 mt-2"># Exemplos:</p>
              <p className="text-gray-300">R$50.00  → taxa R$2,50  → líquido R$47,50</p>
              <p className="text-gray-300">R$100.00 → taxa R$4,00  → líquido R$96,00</p>
              <p className="text-gray-300">R$500.00 → taxa R$16,00 → líquido R$484,00</p>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Dúvidas? Fale com nosso suporte.</p>
          <div className="flex justify-center gap-4">
            <Link href="/suporte" className="inline-flex items-center gap-2 border border-[#A855F7]/40 text-gray-300 px-6 py-3 rounded-xl font-medium hover:text-white transition-colors">
              Abrir suporte
            </Link>
            <Link href="/register" className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-medium" style={{background:'#A855F7'}}>
              Criar conta grátis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { X, Download } from 'lucide-react'

export default function PwaInstallPrompt() {
  const [prompt, setPrompt] = useState<any>(null)
  const [show, setShow] = useState(false)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    const isIosDevice = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isInStandalone = (window.navigator as any).standalone === true
    const dismissed = localStorage.getItem('pwa-dismissed')

    if (dismissed) return

    if (isIosDevice && !isInStandalone) {
      setIsIos(true)
      setShow(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setShow(false)
  }

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('pwa-dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-fade-in md:left-auto md:right-4 md:w-80">
      <div className="rounded-2xl p-4 shadow-2xl border" style={{
        background: '#0d0d14',
        borderColor: 'rgba(168,85,247,0.3)',
        boxShadow: '0 0 30px rgba(168,85,247,0.2)'
      }}>
        <div className="flex items-start gap-3">
          <img src="/favicon-icon.png" alt="Razepag" className="w-12 h-12 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">Instalar Razepag</p>
            {isIos ? (
              <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                Toque em <strong className="text-gray-300">Compartilhar</strong> → <strong className="text-gray-300">Adicionar à Tela de Início</strong>
              </p>
            ) : (
              <p className="text-gray-400 text-xs mt-1">Acesse sua conta como um app</p>
            )}
          </div>
          <button onClick={handleDismiss} className="text-gray-600 hover:text-gray-400 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isIos ? (
          <div className="mt-3 rounded-xl p-3 text-xs text-gray-300 leading-relaxed" style={{background:'rgba(168,85,247,0.08)', border:'1px solid rgba(168,85,247,0.15)'}}>
            <p className="mb-1">1. Toque no ícone <strong className="text-white">⬆️ Compartilhar</strong> na barra inferior do Safari</p>
            <p>2. Role para baixo e toque em <strong className="text-white">Adicionar à Tela de Início</strong></p>
          </div>
        ) : (
          <button
            onClick={handleInstall}
            className="w-full mt-3 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            style={{ background: 'linear-gradient(135deg, #A855F7, #5e18a0)' }}
          >
            <Download className="w-4 h-4" />
            Instalar agora
          </button>
        )}
      </div>
    </div>
  )
}

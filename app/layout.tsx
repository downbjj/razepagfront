import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Razepag - Gateway de Pagamentos PIX',
  description: 'Receba pagamentos instantâneos. API completa e segura para integrar pagamentos no seu sistema. Simples, rápido e sem complicação.',
  icons: {
    icon: [
      { url: '/favicon-icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon-icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-icon.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon-icon.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon-icon.png',
    apple: { url: '/favicon-icon.png', sizes: '180x180' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        {/* Prevent theme flash on load */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('theme') || 'dark';
            document.documentElement.classList.remove('dark','light');
            document.documentElement.classList.add(t);
          } catch(e){}
        `}} />
      </head>
      <body className="antialiased" style={{background:'var(--background)',color:'var(--foreground)'}}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

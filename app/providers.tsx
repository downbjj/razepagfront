'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import { LanguageProvider } from '@/lib/i18n'
import { ThemeProvider } from '@/lib/theme'
import PwaInstallPrompt from '@/components/PwaInstallPrompt'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: (failureCount, error: any) => {
              const status = error?.response?.status
              if (status === 500 || status === 503 || status === 401 || status === 403) return false
              return failureCount < 2
            },
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
          },
        },
      })
  )

  return (
    <ThemeProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <PwaInstallPrompt />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-fg)',
                border: '1px solid var(--toast-border)',
                borderRadius: '8px',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#A855F7', secondary: '#0a0a0a' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' },
              },
            }}
          />
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

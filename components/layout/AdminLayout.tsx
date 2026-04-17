'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, ArrowUpDown, Settings, Webhook,
  Shield, LogOut, Menu, X, Zap, ChevronRight, FileText,
  Moon, Sun, ShoppingBag, Tag, ShoppingCart, Bell, Mail,
  Percent, Bitcoin, Sliders, FileCheck, FileClock, UserCheck,
  Wallet, ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { clearAuthTokens, getUser } from '@/lib/api'
import { useLanguage } from '@/lib/i18n'
import { useTheme } from '@/lib/theme'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { href: '/admin',                      icon: LayoutDashboard, label: 'Visão Geral',              group: 'main' },
  { href: '/admin/users',                icon: Users,           label: 'Usuários',                 group: 'main' },
  { href: '/admin/api-balances',         icon: Wallet,          label: 'Saldos API',               group: 'main' },
  { href: '/admin/transactions',         icon: ArrowUpDown,     label: 'Transações',               group: 'main' },
  { href: '/admin/documents',            icon: FileClock,       label: 'Documentos',               group: 'kyc'  },
  { href: '/admin/documents/approved',   icon: FileCheck,       label: 'Documentos Aprovados',     group: 'kyc'  },
  { href: '/admin/kyc',                  icon: UserCheck,       label: 'Sistema KYC',              group: 'kyc'  },
  { href: '/admin/config',               icon: Settings,        label: 'Configurações',            group: 'system' },
  { href: '/admin/products',             icon: ShoppingBag,     label: 'Produtos',                 group: 'store' },
  { href: '/admin/categories',           icon: Tag,             label: 'Categorias',               group: 'store' },
  { href: '/admin/purchases',            icon: ShoppingCart,    label: 'Compras',                  group: 'store' },
  { href: '/admin/popups',               icon: FileText,        label: 'Popups',                   group: 'comms' },
  { href: '/admin/notifications',        icon: Bell,            label: 'Enviar Notificações',      group: 'comms' },
  { href: '/admin/emails',               icon: Mail,            label: 'Enviar E-mails',           group: 'comms' },
  { href: '/admin/user-fees',            icon: Percent,         label: 'Taxas de Usuários',        group: 'finance' },
  { href: '/admin/crypto-withdrawals',   icon: Bitcoin,         label: 'Saques Cripto',            group: 'finance' },
  { href: '/admin/env-config',           icon: Sliders,         label: 'Config de Ambiente',       group: 'system' },
]

const GROUP_LABELS: Record<string, string> = {
  main:    'Principal',
  kyc:     'KYC',
  store:   'Loja',
  comms:   'Comunicação',
  finance: 'Financeiro',
  system:  'Sistema',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const u = getUser()
    if (!u || (u.role !== 'ADMIN' && u.role !== 'OWNER')) {
      router.push('/login')
      return
    }
    setUser(u)
  }, [])

  const handleLogout = () => {
    clearAuthTokens()
    toast.success(language === 'pt-BR' ? 'Até logo!' : 'Goodbye!')
    router.push('/login')
  }

  const bg          = theme === 'light' ? '#ffffff' : '#0d0d0d'
  const borderColor = theme === 'light' ? '#e0e0e8' : '#1f1f1f'
  const headerBg    = theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)'
  const textColor   = theme === 'light' ? '#111111' : 'white'
  const mutedColor  = theme === 'light' ? '#6b7280' : '#4b5563'

  // Group nav items
  const groups = Object.keys(GROUP_LABELS)

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 transition-transform duration-300 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:z-auto',
        )}
        style={{ background: bg, borderRight: `1px solid ${borderColor}` }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 flex-shrink-0" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)' }}>
            <Shield className="w-5 h-5" style={{ color: '#A855F7' }} />
          </div>
          <div>
            <span className="text-sm font-bold" style={{ color: textColor }}>Admin Panel</span>
            <p className="text-xs" style={{ color: '#A855F7' }}>RazePague</p>
          </div>
          {user?.role === 'OWNER' && (
            <span className="ml-auto text-[10px] border rounded-full px-1.5 py-0.5"
              style={{ borderColor: 'rgba(168,85,247,0.4)', color: '#c084fc', background: 'rgba(168,85,247,0.08)' }}>
              OWNER
            </span>
          )}
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav — scrollable */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {groups.map(group => {
            const items = NAV_ITEMS.filter(i => i.group === group)
            return (
              <div key={group}>
                <p className="text-[10px] uppercase tracking-widest font-semibold px-3 mb-1"
                  style={{ color: mutedColor }}>
                  {GROUP_LABELS[group]}
                </p>
                <div className="space-y-0.5">
                  {items.map(item => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/admin' && pathname.startsWith(item.href))
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                          isActive
                            ? 'text-[#c084fc]'
                            : theme === 'light'
                              ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                              : 'text-gray-500 hover:text-white hover:bg-white/5',
                        )}
                        style={isActive ? {
                          background: 'rgba(168,85,247,0.12)',
                          border: '1px solid rgba(168,85,247,0.25)',
                        } : {}}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0"
                          style={isActive ? { color: '#A855F7' } : {}} />
                        <span className="truncate">{item.label}</span>
                        {isActive && <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0" style={{ color: '#A855F7' }} />}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="flex-shrink-0 p-3 space-y-0.5" style={{ borderTop: `1px solid ${borderColor}` }}>
          <Link href="/dashboard"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
              theme === 'light' ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-500 hover:text-white hover:bg-white/5',
            )}>
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Painel
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* HEADER */}
        <header
          className="sticky top-0 z-30 backdrop-blur px-4 py-3 flex items-center gap-4"
          style={{ background: headerBg, borderBottom: `1px solid ${borderColor}` }}
        >
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {/* Language */}
            <button
              onClick={() => setLanguage(language === 'pt-BR' ? 'en' : 'pt-BR')}
              className="text-xs border rounded-full px-2.5 py-1 transition-all hover:border-purple-500/50"
              style={{ background: 'rgba(168,85,247,0.05)', borderColor: 'rgba(168,85,247,0.2)', color: '#a855f7' }}
            >
              {language === 'pt-BR' ? 'PT-Br' : 'EN-Us'}
            </button>

            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/10"
              style={{ color: '#a855f7' }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User badge */}
            <span
              className="text-xs border rounded-full px-3 py-1 hidden sm:inline-flex items-center gap-1.5"
              style={{ background: 'rgba(168,85,247,0.1)', borderColor: 'rgba(168,85,247,0.3)', color: '#a855f7' }}
            >
              <Shield className="w-3 h-3" />
              {user?.email}
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

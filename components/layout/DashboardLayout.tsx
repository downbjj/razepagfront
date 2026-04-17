'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, ArrowUpDown, ChevronDown, ChevronRight,
  QrCode, Send, Key, LogOut, Menu, X,
  Bell, MessageSquare, TrendingUp,
  Wallet, CheckCheck, Info, AlertTriangle, CheckCircle, Shield, User
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { clearAuthTokens, getUser } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

const META_GOAL = 100000

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [transferOpen, setTransferOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const qc = useQueryClient()

  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/users/dashboard').then(r => r.data.data),
    refetchInterval: 60000,
    enabled: !!user,
  })

  const { data: notifications = [] } = useQuery<any[]>({
    queryKey: ['notifications'],
    queryFn: () => api.get('/users/notifications').then(r => r.data.data),
    refetchInterval: 60000,
    enabled: !!user,
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/users/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const unreadCount = notifications.filter((n: any) => !n.readAt).length

  const monthlyReceived = dashboardData?.summary?.monthlyReceived ?? 0
  const metaPct = Math.min(100, (monthlyReceived / META_GOAL) * 100)

  useEffect(() => {
    const u = getUser()
    if (!u) { router.push('/login'); return }
    setUser(u)
  }, [])

  // Close notification dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Auto-open transfers section if on a transfer sub-route
  useEffect(() => {
    if (pathname.startsWith('/dashboard/pix') ||
        pathname.startsWith('/dashboard/transfer') ||
        pathname.startsWith('/dashboard/withdraw')) {
      setTransferOpen(true)
    }
  }, [pathname])

  const handleLogout = () => {
    clearAuthTokens()
    toast.success('Até logo!')
    router.push('/login')
  }

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : (pathname === href || pathname.startsWith(href + '/'))

  const transferItems = [
    { href: '/dashboard/pix',      icon: QrCode,  label: 'Receber via Pix' },
    { href: '/dashboard/transfer', icon: Send,     label: 'Transferir via Pix' },
    { href: '/dashboard/internal', icon: Wallet,   label: 'Transferência Interna' },
  ]

  const isTransferActive = transferItems.some(i => isActive(i.href))

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={cn(
        'fixed left-0 top-0 z-50 h-full w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )} style={{ background: '#0d0d14', borderRight: '1px solid rgba(168,85,247,0.15)' }}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: '1px solid rgba(168,85,247,0.1)' }}>
          <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
            <Image
              src="/logo.png"
              alt="Razepag"
              width={200}
              height={60}
              className="object-contain"
              style={{ maxHeight: 60 }}
            />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">

          {/* Dashboard */}
          <NavItem
            href="/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            active={isActive('/dashboard', true)}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Fale com Gerente */}
          <NavItem
            href="/dashboard/support"
            icon={MessageSquare}
            label="Fale com seu Gerente"
            active={isActive('/dashboard/support')}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Transferências (expandable) */}
          <div>
            <button
              onClick={() => setTransferOpen(o => !o)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isTransferActive
                  ? 'text-purple-300'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
              style={isTransferActive ? { background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' } : {}}
            >
              <ArrowUpDown className={cn('w-4 h-4 flex-shrink-0', isTransferActive ? 'text-purple-500' : 'text-gray-600')} />
              <span className="flex-1 text-left">Transferências</span>
              {transferOpen
                ? <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                : <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
              }
            </button>

            {transferOpen && (
              <div className="ml-3 mt-0.5 space-y-0.5 pl-3" style={{ borderLeft: '1px solid rgba(168,85,247,0.2)' }}>
                {transferItems.map(item => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    active={isActive(item.href)}
                    onClick={() => setSidebarOpen(false)}
                    small
                  />
                ))}
              </div>
            )}
          </div>

          {/* Relatórios */}
          <NavItem
            href="/dashboard/transactions"
            icon={TrendingUp}
            label="Relatórios"
            active={isActive('/dashboard/transactions')}
            onClick={() => setSidebarOpen(false)}
          />

          {/* API */}
          <NavItem
            href="/dashboard/api-keys"
            icon={Key}
            label="API"
            active={isActive('/dashboard/api-keys')}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Segurança */}
          <NavItem
            href="/dashboard/security"
            icon={Shield}
            label="Segurança"
            active={isActive('/dashboard/security')}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Perfil */}
          <NavItem
            href="/dashboard/profile"
            icon={User}
            label="Meu Perfil"
            active={isActive('/dashboard/profile')}
            onClick={() => setSidebarOpen(false)}
          />
        </nav>

        {/* User section */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(168,85,247,0.1)' }}>
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-1" style={{ background: 'rgba(168,85,247,0.06)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #A855F7, #5e18a0)' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-5 py-3"
          style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(168,85,247,0.12)' }}>

          {/* Mobile hamburger */}
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>

          {/* META progress */}
          <div className="flex-1 flex items-center gap-3 max-w-xs">
            <span className="text-xs text-gray-500 whitespace-nowrap">META</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${metaPct}%`,
                  background: 'linear-gradient(90deg, #A855F7, #c084fc)',
                  boxShadow: '0 0 8px rgba(168,85,247,0.6)'
                }}
              />
            </div>
            <span className="text-xs font-mono text-purple-400 whitespace-nowrap">
              {formatCurrency(monthlyReceived).replace('R$\u00a0','').replace('R$ ','')} / 100k
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notification bell */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(o => !o)}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all hover:bg-white/5"
                style={{ border: '1px solid rgba(168,85,247,0.2)' }}
              >
                <Bell className="w-4 h-4 text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-purple-500 text-white text-[9px] flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-11 w-80 rounded-2xl overflow-hidden z-50 shadow-2xl"
                  style={{ background: '#13131f', border: '1px solid rgba(168,85,247,0.2)' }}>
                  <div className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-semibold text-white">Notificações</p>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => notifications.filter((n:any) => !n.readAt).forEach((n:any) => markReadMutation.mutate(n.id))}
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <CheckCheck className="w-3 h-3" /> Marcar todas lidas
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-8 flex flex-col items-center gap-2">
                        <Bell className="w-8 h-8 text-gray-700" />
                        <p className="text-xs text-gray-600">Nenhuma notificação</p>
                      </div>
                    ) : (
                      notifications.slice(0, 15).map((n: any) => (
                        <div
                          key={n.id}
                          onClick={() => !n.readAt && markReadMutation.mutate(n.id)}
                          className={cn('px-4 py-3 cursor-pointer transition-colors', !n.readAt ? 'hover:bg-white/5' : 'opacity-60')}
                          style={!n.readAt ? { borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(168,85,247,0.04)' } : { borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex-shrink-0">
                              {n.type === 'SUCCESS' ? <CheckCircle className="w-4 h-4 text-green-400" />
                              : n.type === 'WARNING' ? <AlertTriangle className="w-4 h-4 text-yellow-400" />
                              : n.type === 'ERROR'   ? <AlertTriangle className="w-4 h-4 text-red-400" />
                              : <Info className="w-4 h-4 text-purple-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-white">{n.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                            </div>
                            {!n.readAt && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0 mt-1" />}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar → profile */}
            <Link
              href="/dashboard/profile"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #A855F7, #5e18a0)', border: '1px solid rgba(168,85,247,0.4)' }}
            >
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </Link>
          </div>
        </header>

        <main className="flex-1 p-5 overflow-auto" style={{ background: '#0a0a0f' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

function NavItem({
  href, icon: Icon, label, active, onClick, small = false
}: {
  href: string; icon: any; label: string; active: boolean; onClick: () => void; small?: boolean
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg text-sm font-medium transition-all group',
        small ? 'px-2.5 py-2' : 'px-3 py-2.5',
        active ? 'text-purple-300' : 'text-gray-400 hover:text-white hover:bg-white/5'
      )}
      style={active ? { background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)' } : {}}
    >
      <Icon className={cn(
        'flex-shrink-0',
        small ? 'w-3.5 h-3.5' : 'w-4 h-4',
        active ? 'text-purple-500' : 'text-gray-600 group-hover:text-gray-400'
      )} />
      {label}
    </Link>
  )
}

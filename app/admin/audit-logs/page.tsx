'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileText } from 'lucide-react'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const [action, setAction] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', page, action],
    queryFn: () => api.get('/admin/audit-logs', { params: { page, limit: 30, action: action || undefined } }).then(r => r.data.data),
  })

  const logs = data?.logs || []

  const actionColors: Record<string, string> = {
    FREEZE_USER: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    UNFREEZE_USER: 'bg-green-500/10 text-green-400 border-green-500/20',
    ADJUST_BALANCE: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    APPROVE_WITHDRAWAL: 'bg-green-500/10 text-green-400 border-green-500/20',
    UPDATE_CONFIG: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
        <p className="text-gray-500 text-sm mt-1">All admin actions are logged here</p>
      </div>

      <select value={action} onChange={e => { setAction(e.target.value); setPage(1) }}
        className="bg-surface border border-border text-white px-4 py-2 rounded-xl text-sm focus:border-red-500/50 transition-all">
        <option value="">All Actions</option>
        <option value="FREEZE_USER">Freeze User</option>
        <option value="UNFREEZE_USER">Unfreeze User</option>
        <option value="ADJUST_BALANCE">Adjust Balance</option>
        <option value="APPROVE_WITHDRAWAL">Approve Withdrawal</option>
        <option value="UPDATE_CONFIG">Update Config</option>
      </select>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full spinner" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No audit logs</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {logs.map((log: any) => (
              <div key={log.id} className="px-5 py-4">
                <div className="flex items-start gap-4">
                  <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 mt-0.5 ${actionColors[log.action] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                    {log.action.replace(/_/g, ' ')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      <span className="text-gray-400">By:</span> {log.user?.name || 'System'}
                      {log.entityId && <span className="text-gray-600 font-mono text-xs ml-2">→ {log.entityId.slice(0, 8)}...</span>}
                    </p>
                    {log.newValues && (
                      <p className="text-xs text-gray-600 mt-1 font-mono bg-surface-2 px-2 py-1 rounded inline-block">
                        {JSON.stringify(log.newValues).slice(0, 120)}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-1">{formatDate(log.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function AdminWebhooksPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-webhook-logs'],
    queryFn: () => api.get('/admin/webhook-logs').then(r => r.data.data),
    refetchInterval: 30000,
  })

  const logs = data?.logs || []

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Webhook Monitor</h1>
          <p className="text-gray-500 text-sm mt-1">All outbound webhook deliveries</p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <RefreshCw className="w-4 h-4" />Refresh
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full spinner" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-600">No webhook logs</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Status', 'User', 'Event', 'Response', 'Attempts', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log: any) => (
                  <tr key={log.id} className="table-row-hover">
                    <td className="px-5 py-3">
                      {log.success
                        ? <CheckCircle className="w-4 h-4 text-green-400" />
                        : <XCircle className="w-4 h-4 text-red-400" />}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-white">{log.user?.name}</p>
                      <p className="text-xs text-gray-600">{log.user?.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-purple-500/10 border border-purple-500/20 text-purple-300 px-2 py-1 rounded-full">{log.event}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        log.responseStatus >= 200 && log.responseStatus < 300
                          ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {log.responseStatus || 'Timeout'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-gray-400">{log.attempts}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-500">{formatDate(log.createdAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

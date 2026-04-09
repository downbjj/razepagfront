'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings, Save, Edit3 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function AdminConfigPage() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['admin-configs'],
    queryFn: () => api.get('/admin/configs').then(r => r.data.data),
  })

  const updateConfig = useMutation({
    mutationFn: ({ key, value }: any) => api.patch(`/admin/configs/${key}`, { value }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-configs'] })
      setEditing(null)
      toast.success('Configuration updated')
    },
    onError: (e: any) => toast.error(e.response?.data?.message),
  })

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">System Configuration</h1>
        <p className="text-gray-500 text-sm mt-1">Manage fees, limits, and platform settings</p>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full spinner" />
          </div>
        ) : (
          <div className="divide-y divide-border">
            {configs.map((cfg: any) => (
              <div key={cfg.key} className="px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white font-mono">{cfg.key}</p>
                    {cfg.description && <p className="text-xs text-gray-500 mt-0.5">{cfg.description}</p>}
                  </div>
                  {editing === cfg.key ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text" value={editValue} onChange={e => setEditValue(e.target.value)}
                        className="bg-surface-2 border border-purple-500/50 text-white px-3 py-1.5 rounded-lg text-sm w-40 focus:border-purple-400 transition-all"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') updateConfig.mutate({ key: cfg.key, value: editValue })
                          if (e.key === 'Escape') setEditing(null)
                        }}
                      />
                      <button onClick={() => updateConfig.mutate({ key: cfg.key, value: editValue })}
                        disabled={updateConfig.isPending}
                        className="p-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg hover:bg-green-500/20 transition-all">
                        <Save className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setEditing(null)}
                        className="p-1.5 border border-border text-gray-500 rounded-lg hover:text-white transition-all">
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono bg-surface-3 border border-border px-3 py-1.5 rounded-lg text-purple-300">
                        {cfg.value}
                      </span>
                      <button onClick={() => { setEditing(cfg.key); setEditValue(cfg.value) }}
                        className="p-1.5 border border-border text-gray-500 rounded-lg hover:text-white hover:border-purple-500/30 transition-all">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-700 mt-1">Updated: {formatDate(cfg.updatedAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-surface-2 border border-border/50 rounded-xl p-4 text-xs text-gray-600 space-y-1">
        <p className="text-gray-400 font-medium mb-2">Configuration Keys Reference:</p>
        <p>• <span className="text-gray-300 font-mono">pix_fee_percentage</span> — % fee on PIX charges (1.5 = 1.5%)</p>
        <p>• <span className="text-gray-300 font-mono">transfer_fee_flat</span> — Flat fee on internal transfers (in BRL)</p>
        <p>• <span className="text-gray-300 font-mono">withdrawal_fee_percentage</span> — % fee on withdrawals</p>
        <p>• <span className="text-gray-300 font-mono">max_daily_pix_out</span> — Max PIX out per user per day</p>
        <p>• <span className="text-gray-300 font-mono">min_withdrawal_amount</span> — Minimum withdrawal in BRL</p>
        <p>• <span className="text-gray-300 font-mono">maintenance_mode</span> — true/false to enable maintenance mode</p>
      </div>
    </div>
  )
}

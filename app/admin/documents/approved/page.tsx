'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function ApprovedDocumentsPage() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-documents-approved', page],
    queryFn: () => api.get('/admin/documents', {
      params: { page, limit: 20, status: 'APPROVED' },
    }).then(r => r.data.data),
  })

  const docs       = data?.documents  || []
  const totalPages = data?.totalPages || 1
  const total      = data?.total      || 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Documentos Aprovados</h1>
        <p className="text-gray-500 text-sm mt-1">{total} documentos aprovados</p>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full spinner" />
          </div>
        ) : docs.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <FileCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Nenhum documento aprovado ainda</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {['Usuário', 'Tipo', 'Arquivo', 'Revisado por', 'Observação', 'Aprovado em'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {docs.map((doc: any) => (
                    <tr key={doc.id} className="table-row-hover">
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-white font-medium">{doc.user?.name}</p>
                        <p className="text-xs text-gray-500">{doc.user?.email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-gray-300 font-mono">{doc.type}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-purple-400 hover:text-purple-300 underline">
                          {doc.fileName || 'Ver arquivo'}
                        </a>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-gray-500 font-mono truncate max-w-[80px] block">{doc.reviewedBy?.slice(0, 8) || '—'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-gray-500">{doc.reviewNote || '—'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-gray-500">{formatDate(doc.updatedAt)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                <p className="text-xs text-gray-500">Página {page} de {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-1.5 rounded-lg border border-border disabled:opacity-30 hover:border-purple-500/30 transition-all">
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="p-1.5 rounded-lg border border-border disabled:opacity-30 hover:border-purple-500/30 transition-all">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num || 0)
}

export function formatDate(date: string | Date): string {
  try {
    return format(new Date(date), 'dd/MM/yyyy HH:mm')
  } catch {
    return '-'
  }
}

export function formatDateShort(date: string | Date): string {
  try {
    return format(new Date(date), 'dd/MM', { locale: ptBR })
  } catch {
    return '-'
  }
}

export function formatDateRelative(date: string | Date): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR })
  } catch {
    return '-'
  }
}

export function truncate(str: string, maxLen = 30): string {
  if (!str) return ''
  return str.length > maxLen ? `${str.slice(0, maxLen)}...` : str
}

// ─── Matches TransactionType enum in Prisma schema ───────────────────────────
export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  DEPOSIT:    'PIX Recebido',
  WITHDRAW:   'Saque/PIX Enviado',
  TRANSFER:   'Transferência',
  ADJUSTMENT: 'Ajuste',
}

// ─── Matches TransactionStatus enum in Prisma schema ─────────────────────────
export const TRANSACTION_STATUS_LABELS: Record<string, string> = {
  PENDING:    'Pendente',
  PAID:       'Pago',
  PROCESSING: 'Processando',
  FAILED:     'Falhou',
  CANCELLED:  'Cancelado',
}

// ─── Credit types (increase balance) ─────────────────────────────────────────
export const CREDIT_TYPES = new Set(['DEPOSIT', 'ADJUSTMENT'])

export function isCredit(type: string): boolean {
  return CREDIT_TYPES.has(type)
}

export function getTransactionColor(type: string): string {
  if (isCredit(type)) return 'text-green-400'
  return 'text-red-400'
}

export function getTransactionSign(type: string): string {
  return isCredit(type) ? '+' : '-'
}

export function getStatusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    PENDING:    'badge-pending',
    PROCESSING: 'badge-processing',
    PAID:       'badge-completed',
    FAILED:     'badge-failed',
    CANCELLED:  'badge-cancelled',
  }
  return map[status] || 'badge-pending'
}

export function calculateFee(amount: number): number {
  return parseFloat((amount * 0.03 + 1.00).toFixed(2))
}

export function calculateNet(amount: number): number {
  return parseFloat((amount - calculateFee(amount)).toFixed(2))
}

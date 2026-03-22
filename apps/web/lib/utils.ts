import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'done':
      return 'text-emerald-400 bg-emerald-400/10'
    case 'processing':
      return 'text-amber-400 bg-amber-400/10'
    case 'pending':
      return 'text-blue-400 bg-blue-400/10'
    case 'failed':
      return 'text-red-400 bg-red-400/10'
    default:
      return 'text-gray-400 bg-gray-400/10'
  }
}

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diff = now.getTime() - then.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)

  const suffix = Math.random().toString(36).substring(2, 7)
  return `${base}-${suffix}`
}

export function getEventTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    wedding: 'Wedding',
    birthday: 'Birthday',
    baptism: 'Baptism',
    party: 'Party',
    corporate: 'Corporate',
    other: 'Event',
  }
  return labels[type] || 'Event'
}

export function getEventTypeEmoji(type: string): string {
  const emojis: Record<string, string> = {
    wedding: '💍',
    birthday: '🎂',
    baptism: '✝️',
    party: '🎉',
    corporate: '💼',
    other: '📅',
  }
  return emojis[type] || '📅'
}

export function bytesToGB(bytes: number): number {
  return bytes / (1024 * 1024 * 1024)
}

export function gbToBytes(gb: number): number {
  return gb * 1024 * 1024 * 1024
}

export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}

export function isVideoFile(mimeType: string): boolean {
  return mimeType.startsWith('video/')
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

export function getEventUploadUrl(slug: string): string {
  return `${getAppUrl()}/e/${slug}`
}

export function getEventGalleryUrl(slug: string): string {
  return `${getAppUrl()}/e/${slug}/gallery`
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

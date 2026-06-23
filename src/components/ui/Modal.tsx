'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-5xl',
}

export function Modal({ open, onClose, title, description, children, size = 'md', className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />
      <div
        className={cn(
          'relative w-full glass-card border border-white/20 shadow-2xl animate-scale-in',
          sizes[size],
          className
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between p-6 pb-4 border-b border-white/10">
            <div>
              {title && <h2 className="text-lg font-bold text-white">{title}</h2>}
              {description && <p className="text-sm text-white/50 mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white transition-colors ml-4 mt-0.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {!title && !description && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className={cn(!title && !description && 'pt-4')}>{children}</div>
      </div>
    </div>
  )
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  loading?: boolean
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="sm">
      <div className="flex gap-3 p-6 pt-4">
        <button
          onClick={onClose}
          className="flex-1 btn-secondary text-sm py-2.5"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            'flex-1 text-sm py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-95',
            danger
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'bg-brand-600 hover:bg-brand-500 text-white'
          )}
        >
          {loading ? 'Loading...' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

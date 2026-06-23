'use client'

import { useState, useCallback } from 'react'
import { CheckCircle, XCircle, Trash2, Download, Filter, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge, MediaStatusBadge } from '@/components/ui/Badge'
import { ConfirmModal } from '@/components/ui/Modal'
import { createClient } from '@/lib/supabase/client'
import { formatBytes, formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { MediaUpload } from '@/types'

interface Props {
  event: { id: string; name: string; slug: string }
  initialMedia: MediaUpload[]
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected'

export function ModerationPanel({ event, initialMedia }: Props) {
  const [media, setMedia] = useState<MediaUpload[]>(initialMedia)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<FilterStatus>('pending')
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video'>('all')
  const [loading, setLoading] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const supabase = createClient()

  const filtered = media.filter(m => {
    if (filter !== 'all' && m.status !== filter) return false
    if (typeFilter !== 'all' && m.file_type !== typeFilter) return false
    return true
  })

  const counts = {
    all: media.length,
    pending: media.filter(m => m.status === 'pending').length,
    approved: media.filter(m => m.status === 'approved').length,
    rejected: media.filter(m => m.status === 'rejected').length,
  }

  const updateStatus = async (ids: string[], status: 'approved' | 'rejected') => {
    setLoading(ids.join(','))
    try {
      const updates = { status, ...(status === 'approved' ? { approved_at: new Date().toISOString() } : { rejected_at: new Date().toISOString() }) }
      const { error } = await supabase.from('media_uploads').update(updates).in('id', ids)
      if (error) throw error
      setMedia(prev => prev.map(m => ids.includes(m.id) ? { ...m, ...updates } : m))
      setSelected(new Set())
      toast.success(`${ids.length} item(s) ${status}`)
    } catch {
      toast.error('Failed to update status')
    } finally {
      setLoading(null)
    }
  }

  const deleteMedia = async (id: string) => {
    setLoading(id)
    try {
      const m = media.find(x => x.id === id)
      if (m?.storage_path) {
        await supabase.storage.from('event-media').remove([m.storage_path])
      }
      const { error } = await supabase.from('media_uploads').delete().eq('id', id)
      if (error) throw error
      setMedia(prev => prev.filter(x => x.id !== id))
      toast.success('File deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setLoading(null)
      setDeleteTarget(null)
    }
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map(m => m.id)))
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Media Moderation</h1>
          <p className="text-white/50 mt-1">{event.name}</p>
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/50">{selected.size} selected</span>
            <Button
              variant="success"
              size="sm"
              icon={<CheckCircle className="w-4 h-4" />}
              onClick={() => updateStatus([...selected], 'approved')}
              loading={loading === [...selected].join(',')}
            >
              Approve all
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<XCircle className="w-4 h-4" />}
              onClick={() => updateStatus([...selected], 'rejected')}
            >
              Reject all
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1 glass p-1 rounded-xl">
          {(['all', 'pending', 'approved', 'rejected'] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize flex items-center gap-1.5 ${
                filter === f ? 'bg-brand-600 text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {f}
              <span className={`px-1.5 py-0.5 rounded-md text-xs ${filter === f ? 'bg-white/20' : 'bg-white/10'}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-1 glass p-1 rounded-xl">
          {(['all', 'image', 'video'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                typeFilter === t ? 'bg-brand-600 text-white' : 'text-white/50 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.length > 0 && (
          <button onClick={selectAll} className="text-xs text-brand-400 hover:text-brand-300 transition-colors ml-auto">
            {selected.size === filtered.length ? 'Deselect all' : 'Select all'}
          </button>
        )}
      </div>

      {/* Media grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <CheckCircle className="w-12 h-12 text-green-400/40 mx-auto mb-3" />
          <p className="font-bold text-white mb-1">All clear!</p>
          <p className="text-sm text-white/50">No {filter !== 'all' ? filter : ''} items to review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`relative group glass-card overflow-hidden cursor-pointer transition-all duration-200 ${
                selected.has(item.id) ? 'ring-2 ring-brand-500 border-brand-500/50' : ''
              }`}
              onClick={() => toggleSelect(item.id)}
            >
              {/* Media preview */}
              <div className="aspect-square relative bg-surface-700">
                {item.file_type === 'image' ? (
                  <img
                    src={item.file_url}
                    alt={item.file_name || 'Upload'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.file_url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play()}
                    onMouseLeave={e => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0 }}
                  />
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {item.status !== 'approved' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); updateStatus([item.id], 'approved') }}
                      className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </button>
                  )}
                  {item.status !== 'rejected' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); updateStatus([item.id], 'rejected') }}
                      className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <XCircle className="w-4 h-4 text-white" />
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(item.id) }}
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-2">
                <MediaStatusBadge status={item.status} />
                <p className="text-xs text-white/40 mt-1 truncate">
                  {item.is_anonymous ? 'Anonymous' : (item.uploader_name || 'User')}
                </p>
                <p className="text-xs text-white/30">
                  {formatRelativeTime(item.created_at)}
                </p>
              </div>

              {/* Select indicator */}
              {selected.has(item.id) && (
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMedia(deleteTarget)}
        title="Delete this file?"
        description="This action cannot be undone. The file will be permanently removed."
        confirmLabel="Delete"
        danger
        loading={loading === deleteTarget}
      />
    </div>
  )
}

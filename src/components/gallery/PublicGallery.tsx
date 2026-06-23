'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Camera, Film, Download, Share2, User, UserX,
  X, ChevronLeft, ChevronRight, ExternalLink, Upload
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getEventTypeEmoji, getEventTypeLabel, formatRelativeTime } from '@/lib/utils'
import type { MediaUpload } from '@/types'
import toast from 'react-hot-toast'

interface EventInfo {
  id: string
  name: string
  slug: string
  type: string
  description: string | null
  cover_image_url: string | null
  allow_guest_download: boolean
  status: string
}

interface Props {
  event: EventInfo
  media: MediaUpload[]
}

type FilterType = 'all' | 'photos' | 'videos' | 'named' | 'anonymous'

export function PublicGallery({ event, media }: Props) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const filtered = media.filter(m => {
    if (filter === 'photos') return m.file_type === 'image'
    if (filter === 'videos') return m.file_type === 'video'
    if (filter === 'named') return !m.is_anonymous
    if (filter === 'anonymous') return m.is_anonymous
    return true
  })

  const counts = {
    all: media.length,
    photos: media.filter(m => m.file_type === 'image').length,
    videos: media.filter(m => m.file_type === 'video').length,
    named: media.filter(m => !m.is_anonymous).length,
    anonymous: media.filter(m => m.is_anonymous).length,
  }

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: event.name, url })
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Gallery link copied!')
    }
  }

  const currentItem = lightboxIdx !== null ? filtered[lightboxIdx] : null

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative">
        {event.cover_image_url ? (
          <div className="h-64 sm:h-80 relative overflow-hidden">
            <Image src={event.cover_image_url} alt={event.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-surface-900" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-br from-brand-600/30 to-purple-600/20" />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              {getEventTypeEmoji(event.type)} {event.name}
            </h1>
            {event.description && (
              <p className="text-white/60 mt-2">{event.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Actions bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-2 text-sm text-white/50">
            <Camera className="w-4 h-4" />
            <span>{media.length} memories</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/e/${event.slug}`}>
              <Button variant="secondary" size="sm" icon={<Upload className="w-4 h-4" />}>
                Upload
              </Button>
            </Link>
            <Button variant="secondary" size="sm" icon={<Share2 className="w-4 h-4" />} onClick={share}>
              Share
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {([
            { key: 'all', label: 'All' },
            { key: 'photos', label: 'Photos' },
            { key: 'videos', label: 'Videos' },
            { key: 'named', label: 'Named' },
            { key: 'anonymous', label: 'Anonymous' },
          ] as { key: FilterType; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === key
                  ? 'bg-brand-600 text-white'
                  : 'glass text-white/50 hover:text-white'
              }`}
            >
              {label} <span className="text-xs opacity-60">({counts[key]})</span>
            </button>
          ))}
        </div>

        {/* Gallery */}
        {filtered.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <Camera className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-1">No approved media yet</h3>
            <p className="text-sm text-white/50 mb-6">
              Be the first to upload a photo or video!
            </p>
            <Link href={`/e/${event.slug}`}>
              <Button variant="primary" icon={<Upload className="w-4 h-4" />}>
                Upload now
              </Button>
            </Link>
          </div>
        ) : (
          <div className="masonry-grid">
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                className="masonry-item glass-card overflow-hidden cursor-pointer group hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300"
                onClick={() => setLightboxIdx(idx)}
              >
                {item.file_type === 'image' ? (
                  <img
                    src={item.file_url}
                    alt={item.file_name || 'Photo'}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="relative aspect-video bg-surface-700 flex items-center justify-center">
                    <video
                      src={item.file_url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Film className="w-10 h-10 text-white/80" />
                    </div>
                  </div>
                )}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.is_anonymous ? (
                      <UserX className="w-3.5 h-3.5 text-white/30" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-white/30" />
                    )}
                    <span className="text-xs text-white/40">
                      {item.is_anonymous ? 'Anonymous' : (item.uploader_name || 'User')}
                    </span>
                  </div>
                  <span className="text-xs text-white/30">{formatRelativeTime(item.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {currentItem && lightboxIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-xl glass flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {lightboxIdx > 0 && (
            <button
              onClick={() => setLightboxIdx(lightboxIdx - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl glass flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center">
            {currentItem.file_type === 'image' ? (
              <img
                src={currentItem.file_url}
                alt=""
                className="max-h-[75vh] max-w-full object-contain rounded-xl"
              />
            ) : (
              <video
                src={currentItem.file_url}
                controls
                autoPlay
                className="max-h-[75vh] max-w-full rounded-xl"
              />
            )}

            <div className="mt-4 flex items-center gap-4 text-sm text-white/50">
              <div className="flex items-center gap-1.5">
                {currentItem.is_anonymous ? <UserX className="w-4 h-4" /> : <User className="w-4 h-4" />}
                {currentItem.is_anonymous ? 'Anonymous upload' : `Uploaded by ${currentItem.uploader_name || 'User'}`}
              </div>
              <span>·</span>
              <span>{formatRelativeTime(currentItem.created_at)}</span>
              {event.allow_guest_download && (
                <>
                  <span>·</span>
                  <a
                    href={currentItem.file_url}
                    download
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1 text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                </>
              )}
            </div>
          </div>

          {lightboxIdx < filtered.length - 1 && (
            <button
              onClick={() => setLightboxIdx(lightboxIdx + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl glass flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

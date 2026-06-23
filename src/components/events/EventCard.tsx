'use client'

import Link from 'next/link'
import Image from 'next/image'
import { QrCode, Camera, Clock, MapPin, MoreVertical } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatDate, getEventTypeEmoji, getEventTypeLabel } from '@/lib/utils'
import type { Event } from '@/types'

interface Props {
  event: Event
  compact?: boolean
}

export function EventCard({ event, compact }: Props) {
  return (
    <Link href={`/events/${event.id}`} className="block group">
      <div className="glass-card overflow-hidden hover:border-brand-500/30 hover:-translate-y-0.5 transition-all duration-300">
        {/* Cover */}
        <div className="relative aspect-video bg-surface-700 overflow-hidden">
          {event.cover_image_url ? (
            <Image
              src={event.cover_image_url}
              alt={event.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 to-purple-600/20 flex items-center justify-center">
              <span className="text-4xl">{getEventTypeEmoji(event.type)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Status badge */}
          <div className="absolute top-2 right-2">
            <Badge variant={event.status === 'active' ? 'active' : 'default'} dot>
              {event.status}
            </Badge>
          </div>

          {/* Pending uploads indicator */}
          {event.pending_uploads > 0 && (
            <div className="absolute top-2 left-2">
              <Badge variant="pending" dot>
                {event.pending_uploads} pending
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-white truncate group-hover:text-brand-300 transition-colors">
              {event.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/40 mb-3">
            <span>{getEventTypeEmoji(event.type)} {getEventTypeLabel(event.type)}</span>
            {event.event_date && (
              <>
                <span>·</span>
                <span>{formatDate(event.event_date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </>
            )}
          </div>

          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-white/40 mb-3">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-4 pt-3 border-t border-white/5 text-xs text-white/50">
            <div className="flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              <span>{event.total_uploads}</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-400/70">
              <Clock className="w-3.5 h-3.5" />
              <span>{event.pending_uploads}</span>
            </div>
            <Link
              href={`/events/${event.id}?tab=qr`}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto flex items-center gap-1 hover:text-brand-400 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR</span>
            </Link>
          </div>
        </div>
      </div>
    </Link>
  )
}

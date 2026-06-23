'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  QrCode, Camera, Clock, CheckCircle, XCircle, Edit, Share2,
  ExternalLink, Download, Settings, BookOpen, Image as ImageIcon,
  Copy, Check
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge, MediaStatusBadge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { QRCodeDisplay } from '@/components/qr/QRCodeDisplay'
import {
  formatDate, formatBytes, getEventTypeEmoji, getEventTypeLabel,
  getEventUploadUrl, getEventGalleryUrl
} from '@/lib/utils'
import type { Event, MediaUpload } from '@/types'
import toast from 'react-hot-toast'

interface Props {
  event: Event
  recentMedia: MediaUpload[]
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: Settings },
  { id: 'moderation', label: 'Moderation', icon: Clock },
  { id: 'qr', label: 'QR Code', icon: QrCode },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'guestbook', label: 'Guestbook', icon: BookOpen },
]

export function EventDetailPage({ event, recentMedia }: Props) {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)

  const uploadUrl = getEventUploadUrl(event.slug)
  const galleryUrl = getEventGalleryUrl(event.slug)

  const copyLink = async () => {
    await navigator.clipboard.writeText(uploadUrl)
    setCopied(true)
    toast.success('Link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          {event.cover_image_url ? (
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
              <Image
                src={event.cover_image_url}
                alt={event.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-brand-600/20 flex items-center justify-center text-3xl flex-shrink-0">
              {getEventTypeEmoji(event.type)}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-black text-white">{event.name}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant={event.status === 'active' ? 'active' : 'default'} dot>
                {event.status}
              </Badge>
              <span className="text-sm text-white/40">{getEventTypeLabel(event.type)}</span>
              {event.event_date && (
                <span className="text-sm text-white/40">
                  {formatDate(event.event_date, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a href={galleryUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
              Gallery
            </Button>
          </a>
          <Link href={`/events/${event.id}/edit`}>
            <Button variant="secondary" size="sm" icon={<Edit className="w-4 h-4" />}>
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick links bar */}
      <Card className="p-4 flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/40 mb-0.5">Upload link</p>
          <p className="text-sm text-white/70 truncate font-mono">{uploadUrl}</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          onClick={copyLink}
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <a href={uploadUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
            Open
          </Button>
        </a>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-black text-white">{event.total_uploads}</p>
          <p className="text-xs text-white/50 mt-1">Total uploads</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-black text-yellow-400">{event.pending_uploads}</p>
          <p className="text-xs text-white/50 mt-1">Pending</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-black text-green-400">{event.approved_uploads}</p>
          <p className="text-xs text-white/50 mt-1">Approved</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-black text-white/70">{formatBytes(event.storage_used_bytes)}</p>
          <p className="text-xs text-white/50 mt-1">Storage used</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass p-1 rounded-2xl overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-white">Event settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between p-3 rounded-xl bg-white/3">
                <span className="text-white/50">Anonymous uploads</span>
                <Badge variant={event.allow_anonymous_upload ? 'approved' : 'rejected'}>
                  {event.allow_anonymous_upload ? 'Allowed' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-white/3">
                <span className="text-white/50">Require account</span>
                <Badge variant={event.require_account_upload ? 'approved' : 'default'}>
                  {event.require_account_upload ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-white/3">
                <span className="text-white/50">Guest download</span>
                <Badge variant={event.allow_guest_download ? 'approved' : 'default'}>
                  {event.allow_guest_download ? 'Allowed' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-white/3">
                <span className="text-white/50">Auto-approve</span>
                <Badge variant={event.auto_approve ? 'warning' : 'default'}>
                  {event.auto_approve ? 'On' : 'Off'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Recent uploads */}
          {recentMedia.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Recent uploads</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('moderation')}
                >
                  View all
                </Button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {recentMedia.slice(0, 12).map((m) => (
                  <div key={m.id} className="relative aspect-square rounded-xl overflow-hidden bg-surface-700">
                    {m.file_type === 'image' && (
                      <img src={m.file_url} alt="" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-1 right-1">
                      <MediaStatusBadge status={m.status} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'qr' && (
        <QRCodeDisplay event={event} />
      )}

      {activeTab === 'moderation' && (
        <Link href={`/events/${event.id}/moderation`}>
          <Card className="p-8 text-center hover:border-brand-500/30 transition-all cursor-pointer">
            <Clock className="w-12 h-12 text-brand-400 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-1">Open Media Moderation</h3>
            <p className="text-sm text-white/50">
              {event.pending_uploads} items pending review
            </p>
          </Card>
        </Link>
      )}

      {activeTab === 'gallery' && (
        <a href={galleryUrl} target="_blank" rel="noopener noreferrer">
          <Card className="p-8 text-center hover:border-brand-500/30 transition-all cursor-pointer">
            <ImageIcon className="w-12 h-12 text-brand-400 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-1">Open Public Gallery</h3>
            <p className="text-sm text-white/50">
              {event.approved_uploads} approved items
            </p>
          </Card>
        </a>
      )}

      {activeTab === 'guestbook' && (
        <Link href={`/events/${event.id}/guestbook`}>
          <Card className="p-8 text-center hover:border-brand-500/30 transition-all cursor-pointer">
            <BookOpen className="w-12 h-12 text-brand-400 mx-auto mb-3" />
            <h3 className="font-bold text-white mb-1">Manage Guestbook</h3>
            <p className="text-sm text-white/50">View and moderate guest messages</p>
          </Card>
        </Link>
      )}
    </div>
  )
}

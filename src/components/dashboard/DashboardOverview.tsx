'use client'

import Link from 'next/link'
import { Plus, Camera, Video, Clock, CheckCircle, XCircle, HardDrive, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/Card'
import { EventCard } from '@/components/events/EventCard'
import { StorageBar } from '@/components/ui/Progress'
import { formatBytes, formatDate } from '@/lib/utils'
import type { Profile, Event, Subscription, DashboardStats } from '@/types'

interface Props {
  profile: Profile | null
  stats: DashboardStats
  events: Event[]
  subscription: (Subscription & { plan?: { max_storage_gb: number } }) | null
}

export function DashboardOverview({ profile, stats, events, subscription }: Props) {
  const maxStorageBytes = (subscription?.plan?.max_storage_gb || 5) * 1024 * 1024 * 1024
  const recentEvents = events.slice(0, 4)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-white/50 mt-1">Here's an overview of your events.</p>
        </div>
        <Link href="/events/create" className="hidden sm:block">
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            New Event
          </Button>
        </Link>
      </div>

      {/* No subscription warning */}
      {!subscription && (
        <div className="glass-card border border-yellow-500/30 bg-yellow-500/5 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-yellow-400">No active plan</p>
            <p className="text-sm text-white/50 mt-0.5">Choose a plan to start creating events.</p>
          </div>
          <Link href="/billing">
            <Button variant="primary" size="sm">Choose plan</Button>
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Events"
          value={stats.totalEvents}
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatCard
          label="Total Uploads"
          value={stats.totalUploads}
          icon={<Camera className="w-5 h-5" />}
        />
        <StatCard
          label="Pending Review"
          value={stats.pendingUploads}
          icon={<Clock className="w-5 h-5" />}
        />
        <StatCard
          label="Approved"
          value={stats.approvedUploads}
          icon={<CheckCircle className="w-5 h-5" />}
        />
      </div>

      {/* Storage */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <HardDrive className="w-5 h-5 text-brand-400" />
          <h3 className="font-semibold text-white">Storage</h3>
          <span className="ml-auto text-sm text-white/50">
            {formatBytes(stats.storageUsedBytes)} of {subscription?.plan?.max_storage_gb || 5} GB used
          </span>
        </div>
        <StorageBar used={stats.storageUsedBytes} total={maxStorageBytes} />
      </div>

      {/* Recent events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Recent Events</h2>
          <Link href="/events" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
            View all →
          </Link>
        </div>

        {recentEvents.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-600/20 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-brand-400" />
            </div>
            <h3 className="font-bold text-white mb-2">No events yet</h3>
            <p className="text-sm text-white/50 mb-6">
              Create your first event and start collecting memories.
            </p>
            <Link href="/events/create">
              <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
                Create first event
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {recentEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

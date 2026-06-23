'use client'

import { Users, Calendar, Camera, CreditCard } from 'lucide-react'
import { StatCard } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatRelativeTime, getEventTypeEmoji } from '@/lib/utils'

interface Props {
  stats: {
    totalUsers: number
    totalEvents: number
    totalUploads: number
    activeSubscriptions: number
  }
  recentEvents: Array<{
    id: string
    name: string
    type: string
    status: string
    created_at: string
    organizer?: { email?: string; full_name?: string } | null
  }>
  recentUsers: Array<{
    id: string
    email: string
    full_name: string | null
    role: string
    created_at: string
  }>
}

export function AdminOverview({ stats, recentEvents, recentUsers }: Props) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
        <p className="text-white/50 mt-1">Platform overview and management.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon={<Users className="w-5 h-5" />} />
        <StatCard label="Total Events" value={stats.totalEvents} icon={<Calendar className="w-5 h-5" />} />
        <StatCard label="Total Uploads" value={stats.totalUploads} icon={<Camera className="w-5 h-5" />} />
        <StatCard label="Active Subs" value={stats.activeSubscriptions} icon={<CreditCard className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent events */}
        <div className="glass-card p-6">
          <h2 className="font-bold text-white mb-4">Recent Events</h2>
          <div className="space-y-3">
            {recentEvents.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg">{getEventTypeEmoji(e.type)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{e.name}</p>
                    <p className="text-xs text-white/40 truncate">
                      {e.organizer?.full_name || e.organizer?.email || 'Unknown organizer'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <Badge variant={e.status === 'active' ? 'active' : 'default'}>{e.status}</Badge>
                  <span className="text-xs text-white/30">{formatRelativeTime(e.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent users */}
        <div className="glass-card p-6">
          <h2 className="font-bold text-white mb-4">Recent Users</h2>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-brand-600/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-brand-400">
                      {(u.full_name || u.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{u.full_name || 'No name'}</p>
                    <p className="text-xs text-white/40 truncate">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                  <Badge variant={u.role === 'admin' ? 'warning' : u.role === 'organizer' ? 'active' : 'default'}>
                    {u.role}
                  </Badge>
                  <span className="text-xs text-white/30">{formatRelativeTime(u.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { Users, Calendar, Camera, CreditCard, TrendingUp, ArrowRight } from 'lucide-react'
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

const roleColor: Record<string, { bg: string; text: string }> = {
  admin:     { bg: 'rgba(123,47,247,0.15)', text: '#c084fc' },
  organizer: { bg: 'rgba(6,182,212,0.12)',  text: '#22d3ee' },
  user:      { bg: 'rgba(255,255,255,0.06)', text: '#888' },
}

const statusColor: Record<string, { bg: string; text: string }> = {
  active:    { bg: 'rgba(34,197,94,0.12)',  text: '#4ade80' },
  paused:    { bg: 'rgba(234,179,8,0.12)',  text: '#fbbf24' },
  ended:     { bg: 'rgba(255,255,255,0.06)', text: '#555' },
  suspended: { bg: 'rgba(239,68,68,0.12)',  text: '#f87171' },
}

export function AdminOverview({ stats, recentEvents, recentUsers }: Props) {
  const statCards = [
    { label: 'Total Users',    value: stats.totalUsers,          icon: Users,       color: '#7B2FF7', change: 'All registered accounts' },
    { label: 'Total Events',   value: stats.totalEvents,         icon: Calendar,    color: '#06b6d4', change: 'Galleries created' },
    { label: 'Media Uploads',  value: stats.totalUploads,        icon: Camera,      color: '#a855f7', change: 'Photos & videos' },
    { label: 'Active Plans',   value: stats.activeSubscriptions, icon: CreditCard,  color: '#4ade80', change: 'Paid event plans' },
  ]

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>Overview</h1>
          <p className="text-white/40 mt-1 text-sm">Platform stats and recent activity.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/25">
          <TrendingUp size={13} />
          Live data
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="rounded-2xl p-5"
              style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${s.color}18` }}
                >
                  <Icon size={16} style={{ color: s.color }} />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1" style={{ letterSpacing: '-0.02em' }}>
                {s.value.toLocaleString()}
              </div>
              <div className="text-xs text-white/40">{s.label}</div>
              <div className="text-[11px] text-white/20 mt-0.5">{s.change}</div>
            </div>
          )
        })}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Recent Users */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
            <h2 className="font-bold text-white text-sm">Recent Users</h2>
            <Link href="/admin/users" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentUsers.length === 0 && (
              <p className="text-center text-white/25 text-sm py-8">No users yet</p>
            )}
            {recentUsers.map((u) => {
              const rc = roleColor[u.role] || roleColor.user
              return (
                <div key={u.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold"
                      style={{ background: 'rgba(123,47,247,0.15)', color: '#c084fc' }}
                    >
                      {(u.full_name || u.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white/85 truncate">{u.full_name || '—'}</p>
                      <p className="text-xs text-white/35 truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: rc.bg, color: rc.text }}>
                      {u.role}
                    </span>
                    <span className="text-[11px] text-white/25">{formatRelativeTime(u.created_at)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Events */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
            <h2 className="font-bold text-white text-sm">Recent Events</h2>
            <Link href="/admin/events" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentEvents.length === 0 && (
              <p className="text-center text-white/25 text-sm py-8">No events yet</p>
            )}
            {recentEvents.map((e) => {
              const sc = statusColor[e.status] || statusColor.ended
              return (
                <div key={e.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl flex-shrink-0">{getEventTypeEmoji(e.type)}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white/85 truncate">{e.name}</p>
                      <p className="text-xs text-white/35 truncate">
                        {e.organizer?.full_name || e.organizer?.email || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>
                      {e.status}
                    </span>
                    <span className="text-[11px] text-white/25">{formatRelativeTime(e.created_at)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

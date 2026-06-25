'use client'

import { useState, useTransition } from 'react'
import { Users, Search, Shield, Ban, CheckCircle, ChevronDown, Loader2 } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import type { Profile } from '@/types'

interface Plan { id: string; name: string; slug: string; price_monthly: number }
interface Sub  { user_id: string; status: string; plan?: { name: string; slug: string } | null }

interface Props {
  users: Profile[]
  plans: Plan[]
  subscriptions: Sub[]
}

const roleOptions = ['user', 'organizer', 'admin'] as const
const roleColor: Record<string, { bg: string; text: string }> = {
  admin:     { bg: 'rgba(123,47,247,0.15)', text: '#c084fc' },
  organizer: { bg: 'rgba(6,182,212,0.12)',  text: '#22d3ee' },
  user:      { bg: 'rgba(255,255,255,0.06)', text: '#666' },
}

export function AdminUsersTable({ users, plans, subscriptions }: Props) {
  const [search, setSearch]   = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [localUsers, setLocalUsers] = useState(users)
  const [, startTransition] = useTransition()

  const subByUser = Object.fromEntries(subscriptions.map(s => [s.user_id, s]))

  const filtered = localUsers.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name || '').toLowerCase().includes(search.toLowerCase())
  )

  const updateUser = async (userId: string, patch: Record<string, unknown>) => {
    setUpdating(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (!res.ok) throw new Error('Failed')
      const updated = await res.json()
      startTransition(() => {
        setLocalUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updated } : u))
      })
      toast.success('User updated')
    } catch {
      toast.error('Update failed')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>Users</h1>
        <p className="text-white/40 mt-1 text-sm">{localUsers.length} registered accounts</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-9 text-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Header */}
        <div className="grid grid-cols-12 gap-3 px-6 py-3 text-[11px] font-semibold text-white/25 uppercase tracking-wider border-b border-white/[0.05]">
          <div className="col-span-4">User</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Plan</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Joined</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/[0.04]">
          {filtered.length === 0 && (
            <div className="flex items-center justify-center py-16 text-white/25 text-sm">
              <Users size={16} className="mr-2" /> No users found
            </div>
          )}
          {filtered.map((u) => {
            const rc = roleColor[u.role] || roleColor.user
            const sub = subByUser[u.id]
            const isUpdating = updating === u.id

            return (
              <div key={u.id} className="grid grid-cols-12 gap-3 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors">

                {/* User info */}
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold"
                    style={{ background: 'rgba(123,47,247,0.15)', color: '#c084fc' }}
                  >
                    {(u.full_name || u.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white/85 truncate">{u.full_name || '—'}</p>
                    <p className="text-xs text-white/35 truncate">{u.email}</p>
                  </div>
                </div>

                {/* Role select */}
                <div className="col-span-2">
                  <div className="relative inline-flex">
                    <select
                      value={u.role}
                      onChange={e => updateUser(u.id, { role: e.target.value })}
                      disabled={isUpdating}
                      className="appearance-none text-[11px] font-semibold px-2.5 py-1 pr-6 rounded-full cursor-pointer transition-colors"
                      style={{ background: rc.bg, color: rc.text, border: 'none', outline: 'none' }}
                    >
                      {roleOptions.map(r => (
                        <option key={r} value={r} style={{ background: '#111', color: '#fff' }}>{r}</option>
                      ))}
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: rc.text }} />
                  </div>
                </div>

                {/* Plan */}
                <div className="col-span-2">
                  {sub?.plan ? (
                    <span className="text-xs text-white/60">{sub.plan.name}</span>
                  ) : (
                    <span className="text-xs text-white/25">No plan</span>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  {u.is_banned ? (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>
                      Banned
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>
                      Active
                    </span>
                  )}
                </div>

                {/* Joined */}
                <div className="col-span-1">
                  <span className="text-xs text-white/30">{formatRelativeTime(u.created_at)}</span>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end gap-1">
                  {isUpdating ? (
                    <Loader2 size={14} className="animate-spin text-white/30" />
                  ) : (
                    <>
                      {u.is_banned ? (
                        <button
                          onClick={() => updateUser(u.id, { is_banned: false })}
                          title="Unban user"
                          className="p-1.5 rounded-lg hover:bg-green-400/10 text-white/25 hover:text-green-400 transition-colors"
                        >
                          <CheckCircle size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUser(u.id, { is_banned: true })}
                          title="Ban user"
                          className="p-1.5 rounded-lg hover:bg-red-400/10 text-white/25 hover:text-red-400 transition-colors"
                        >
                          <Ban size={14} />
                        </button>
                      )}
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => updateUser(u.id, { role: 'admin' })}
                          title="Make admin"
                          className="p-1.5 rounded-lg hover:bg-purple-400/10 text-white/25 hover:text-purple-400 transition-colors"
                        >
                          <Shield size={14} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

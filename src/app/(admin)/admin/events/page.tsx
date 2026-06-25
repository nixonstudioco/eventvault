import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { formatRelativeTime, getEventTypeEmoji } from '@/lib/utils'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = { title: 'Events — Admin' }

const statusColor: Record<string, { bg: string; text: string }> = {
  active:    { bg: 'rgba(34,197,94,0.12)',  text: '#4ade80' },
  paused:    { bg: 'rgba(234,179,8,0.12)',  text: '#fbbf24' },
  ended:     { bg: 'rgba(255,255,255,0.06)', text: '#555' },
  suspended: { bg: 'rgba(239,68,68,0.12)',  text: '#f87171' },
}

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: events } = await supabase
    .from('events')
    .select('*, organizer:profiles(email, full_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>Events</h1>
        <p className="text-white/40 mt-1 text-sm">{events?.length || 0} total galleries</p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="grid grid-cols-12 gap-3 px-6 py-3 text-[11px] font-semibold text-white/25 uppercase tracking-wider border-b border-white/[0.05]">
          <div className="col-span-4">Event</div>
          <div className="col-span-3">Organizer</div>
          <div className="col-span-1 text-center">Uploads</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Created</div>
          <div className="col-span-1 text-right">Link</div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {(!events || events.length === 0) && (
            <p className="text-center text-white/25 text-sm py-16">No events yet</p>
          )}
          {events?.map((e) => {
            const sc = statusColor[e.status] || statusColor.ended
            return (
              <div key={e.id} className="grid grid-cols-12 gap-3 items-center px-6 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <span className="text-lg flex-shrink-0">{getEventTypeEmoji(e.type)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white/85 truncate">{e.name}</p>
                    <p className="text-xs text-white/30 truncate">/{e.slug}</p>
                  </div>
                </div>
                <div className="col-span-3 min-w-0">
                  <p className="text-sm text-white/60 truncate">{e.organizer?.full_name || e.organizer?.email || '—'}</p>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-sm text-white/50">{e.total_uploads || 0}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>
                    {e.status}
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="text-xs text-white/25">{formatRelativeTime(e.created_at)}</span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Link href={`/e/${e.slug}`} target="_blank" className="p-1.5 rounded-lg text-white/20 hover:text-purple-400 hover:bg-purple-400/10 transition-colors">
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: events }, { data: subscription }, { data: profile }] = await Promise.all([
    supabase.from('events').select('*').eq('organizer_id', user.id).order('created_at', { ascending: false }),
    supabase.from('subscriptions').select('*, plan:plans(*)').eq('user_id', user.id).eq('status', 'active').maybeSingle(),
    supabase.from('profiles').select('*').eq('id', user.id).single(),
  ])

  const stats = {
    totalEvents: events?.length || 0,
    activeEvents: events?.filter(e => e.status === 'active').length || 0,
    totalUploads: events?.reduce((s, e) => s + (e.total_uploads || 0), 0) || 0,
    pendingUploads: events?.reduce((s, e) => s + (e.pending_uploads || 0), 0) || 0,
    approvedUploads: events?.reduce((s, e) => s + (e.approved_uploads || 0), 0) || 0,
    rejectedUploads: events?.reduce((s, e) => s + (e.rejected_uploads || 0), 0) || 0,
    storageUsedBytes: events?.reduce((s, e) => s + (e.storage_used_bytes || 0), 0) || 0,
    storageUsedGB: 0,
    totalParticipants: 0,
  }
  stats.storageUsedGB = stats.storageUsedBytes / 1024 / 1024 / 1024

  return (
    <DashboardOverview
      profile={profile}
      stats={stats}
      events={events || []}
      subscription={subscription}
    />
  )
}

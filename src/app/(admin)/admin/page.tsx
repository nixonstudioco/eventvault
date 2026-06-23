import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminOverview } from '@/components/admin/AdminOverview'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const [
    { count: totalUsers },
    { count: totalEvents },
    { count: totalUploads },
    { count: activeSubscriptions },
    { data: recentEvents },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('events').select('id', { count: 'exact', head: true }),
    supabase.from('media_uploads').select('id', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('events').select('*, organizer:profiles(email, full_name)').order('created_at', { ascending: false }).limit(10),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  return (
    <AdminOverview
      stats={{ totalUsers: totalUsers || 0, totalEvents: totalEvents || 0, totalUploads: totalUploads || 0, activeSubscriptions: activeSubscriptions || 0 }}
      recentEvents={recentEvents || []}
      recentUsers={recentUsers || []}
    />
  )
}

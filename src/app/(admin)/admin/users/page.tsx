import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { AdminUsersTable } from '@/components/admin/AdminUsersTable'

export const metadata: Metadata = { title: 'Users — Admin' }

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: plans } = await supabase
    .from('plans')
    .select('id, name, slug, price_monthly')
    .eq('is_active', true)
    .order('sort_order')

  // Get subscription per user
  const { data: subs } = await supabase
    .from('subscriptions')
    .select('user_id, status, plan:plans(name, slug)')

  return (
    <AdminUsersTable
      users={users || []}
      plans={plans || []}
      subscriptions={subs || []}
    />
  )
}

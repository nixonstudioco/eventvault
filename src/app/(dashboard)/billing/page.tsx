import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BillingPage } from '@/components/dashboard/BillingPage'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Billing & Plans' }

export default async function Billing() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: plans }, { data: subscription }] = await Promise.all([
    supabase.from('plans').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('subscriptions').select('*, plan:plans(*)').eq('user_id', user.id).maybeSingle(),
  ])

  return <BillingPage plans={plans || []} subscription={subscription} userId={user.id} />
}

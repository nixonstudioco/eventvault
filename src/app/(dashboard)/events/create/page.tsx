import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreateEventForm } from '@/components/events/CreateEventForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Create Event' }

export default async function CreateEventPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, plan:plans(*)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  // Count active events
  const { count: activeEventCount } = await supabase
    .from('events')
    .select('id', { count: 'exact' })
    .eq('organizer_id', user.id)
    .eq('status', 'active')

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Create New Event</h1>
        <p className="text-white/50 mt-1">Set up your event and get a unique QR code.</p>
      </div>
      <CreateEventForm
        subscription={subscription}
        activeEventCount={activeEventCount || 0}
      />
    </div>
  )
}

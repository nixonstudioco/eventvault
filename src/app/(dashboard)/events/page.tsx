import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { EventCard } from '@/components/events/EventCard'
import { Button } from '@/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Events' }

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">My Events</h1>
          <p className="text-white/50 mt-1">{events?.length || 0} events</p>
        </div>
        <Link href="/events/create">
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            New Event
          </Button>
        </Link>
      </div>

      {!events || events.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-white mb-2">No events yet</h3>
          <p className="text-white/50 mb-6">Create your first event to start collecting memories.</p>
          <Link href="/events/create">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Create first event
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

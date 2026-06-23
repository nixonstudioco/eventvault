import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { EventDetailPage } from '@/components/events/EventDetailPage'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('name').eq('id', id).single()
  return { title: data?.name || 'Event' }
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: event } = await supabase
    .from('events')
    .select('*, qr_code:event_qr_codes(*)')
    .eq('id', id)
    .eq('organizer_id', user.id)
    .single()

  if (!event) notFound()

  const { data: recentMedia } = await supabase
    .from('media_uploads')
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: false })
    .limit(12)

  return <EventDetailPage event={event} recentMedia={recentMedia || []} />
}

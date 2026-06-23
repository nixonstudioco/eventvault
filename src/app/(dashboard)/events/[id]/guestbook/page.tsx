import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { GuestbookManager } from '@/components/events/GuestbookManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Guestbook' }

export default async function GuestbookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: event } = await supabase
    .from('events')
    .select('id, name')
    .eq('id', id)
    .eq('organizer_id', user.id)
    .single()

  if (!event) notFound()

  const { data: messages } = await supabase
    .from('guestbook_messages')
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: false })

  return <GuestbookManager event={event} initialMessages={messages || []} />
}

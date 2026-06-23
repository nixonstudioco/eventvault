import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ModerationPanel } from '@/components/events/ModerationPanel'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Media Moderation' }

export default async function ModerationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: event } = await supabase
    .from('events')
    .select('id, name, slug')
    .eq('id', id)
    .eq('organizer_id', user.id)
    .single()

  if (!event) notFound()

  const { data: media } = await supabase
    .from('media_uploads')
    .select('*')
    .eq('event_id', id)
    .order('created_at', { ascending: false })

  return <ModerationPanel event={event} initialMedia={media || []} />
}

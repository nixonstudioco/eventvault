import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EventUploadPage } from '@/components/upload/EventUploadPage'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('name').eq('slug', slug).single()
  return {
    title: data ? `Upload to ${data.name}` : 'Event Upload',
  }
}

export default async function PublicUploadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('id, name, slug, type, description, cover_image_url, allow_anonymous_upload, require_account_upload, status')
    .eq('slug', slug)
    .eq('is_public', true)
    .single()

  if (!event || event.status === 'suspended') notFound()

  const { data: { user } } = await supabase.auth.getUser()

  return <EventUploadPage event={event} currentUser={user} />
}

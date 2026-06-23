import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PublicGallery } from '@/components/gallery/PublicGallery'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('name').eq('slug', slug).single()
  return { title: data ? `${data.name} — Gallery` : 'Event Gallery' }
}

export default async function PublicGalleryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('id, name, slug, type, description, cover_image_url, allow_guest_download, status')
    .eq('slug', slug)
    .eq('is_public', true)
    .single()

  if (!event || event.status === 'suspended') notFound()

  const { data: media } = await supabase
    .from('media_uploads')
    .select('*')
    .eq('event_id', event.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  return <PublicGallery event={event} media={media || []} />
}

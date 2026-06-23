import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { QRDesignEditor } from '@/components/qr/QRDesignEditor'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'QR Poster Designer' }

export default async function QRDesignPage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">QR Poster Designer</h1>
        <p className="text-white/50 mt-1">Create a beautiful QR poster for {event.name}</p>
      </div>
      <QRDesignEditor event={event} />
    </div>
  )
}

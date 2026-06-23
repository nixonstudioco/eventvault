'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Calendar, MapPin, Type, FileText, Image as ImageIcon, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Toggle } from '@/components/ui/Toggle'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { generateSlug } from '@/lib/utils'
import Link from 'next/link'

const schema = z.object({
  name: z.string().min(2, 'Event name must be at least 2 characters').max(100),
  type: z.enum(['wedding', 'birthday', 'baptism', 'party', 'corporate', 'other']),
  event_date: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  subscription: { plan?: { max_events: number; slug: string } } | null
  activeEventCount: number
}

export function CreateEventForm({ subscription, activeEventCount }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [allowAnonymous, setAllowAnonymous] = useState(true)
  const [requireAccount, setRequireAccount] = useState(false)
  const [allowGuestDownload, setAllowGuestDownload] = useState(false)
  const [autoApprove, setAutoApprove] = useState(false)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'wedding' },
  })

  const maxEvents = subscription?.plan?.max_events || 0
  const canCreate = subscription && activeEventCount < maxEvents

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const onSubmit = async (data: FormData) => {
    if (!canCreate) return
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const slug = generateSlug(data.name)
      let coverUrl: string | null = null

      // Upload cover if provided
      if (coverFile) {
        const ext = coverFile.name.split('.').pop()
        const path = `covers/${user.id}/${slug}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('event-covers')
          .upload(path, coverFile, { upsert: true })

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('event-covers').getPublicUrl(path)
          coverUrl = publicUrl
        }
      }

      const { data: event, error } = await supabase
        .from('events')
        .insert({
          organizer_id: user.id,
          name: data.name,
          slug,
          type: data.type,
          event_date: data.event_date || null,
          location: data.location || null,
          description: data.description || null,
          cover_image_url: coverUrl,
          allow_anonymous_upload: allowAnonymous,
          require_account_upload: requireAccount,
          allow_guest_download: allowGuestDownload,
          auto_approve: autoApprove,
        })
        .select()
        .single()

      if (error) throw error

      // Create default QR code entry
      await supabase.from('event_qr_codes').insert({
        event_id: event.id,
        template: 'default',
        title: data.name,
        subtitle: 'Scan & upload your memories',
      })

      toast.success('Event created! Your QR code is ready.')
      router.push(`/events/${event.id}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  if (!subscription) {
    return (
      <Card className="p-8 text-center border-yellow-500/20 bg-yellow-500/5">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-bold text-white mb-2">No active plan</h3>
        <p className="text-white/50 mb-6">You need an active plan to create events.</p>
        <Link href="/billing">
          <Button variant="primary">Choose a plan</Button>
        </Link>
      </Card>
    )
  }

  if (!canCreate) {
    return (
      <Card className="p-8 text-center border-red-500/20 bg-red-500/5">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-lg font-bold text-white mb-2">Event limit reached</h3>
        <p className="text-white/50 mb-6">
          Your {subscription.plan?.slug} plan allows {maxEvents} active event{maxEvents > 1 ? 's' : ''}.
          Upgrade to Premium for unlimited events.
        </p>
        <Link href="/billing">
          <Button variant="primary">Upgrade plan</Button>
        </Link>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic info */}
      <Card className="p-6 space-y-5">
        <h2 className="font-bold text-white flex items-center gap-2">
          <Type className="w-4 h-4 text-brand-400" />
          Event details
        </h2>

        <Input
          label="Event name *"
          placeholder="Maria & Alexandru's Wedding"
          error={errors.name?.message}
          {...register('name')}
        />

        <Select
          label="Event type *"
          options={[
            { value: 'wedding', label: '💍 Wedding' },
            { value: 'birthday', label: '🎂 Birthday / Majorat' },
            { value: 'baptism', label: '✝️ Baptism' },
            { value: 'party', label: '🎉 Private Party' },
            { value: 'corporate', label: '💼 Corporate Event' },
            { value: 'other', label: '📅 Other' },
          ]}
          error={errors.type?.message}
          {...register('type')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Event date"
            type="date"
            icon={<Calendar className="w-4 h-4" />}
            {...register('event_date')}
          />
          <Input
            label="Location"
            placeholder="Grand Palace Ballroom"
            icon={<MapPin className="w-4 h-4" />}
            {...register('location')}
          />
        </div>

        <Textarea
          label="Description"
          placeholder="Tell guests what this event is about..."
          rows={3}
          {...register('description')}
        />
      </Card>

      {/* Cover image */}
      <Card className="p-6">
        <h2 className="font-bold text-white flex items-center gap-2 mb-4">
          <ImageIcon className="w-4 h-4 text-brand-400" />
          Cover image
        </h2>

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
          {coverPreview ? (
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Change cover</span>
              </div>
            </div>
          ) : (
            <div className="aspect-video rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center hover:border-brand-500/40 transition-colors cursor-pointer">
              <ImageIcon className="w-10 h-10 text-white/20 mb-3" />
              <p className="text-sm font-medium text-white/40">Click to upload cover image</p>
              <p className="text-xs text-white/30 mt-1">PNG, JPG, WEBP up to 10MB</p>
            </div>
          )}
        </div>
      </Card>

      {/* Privacy settings */}
      <Card className="p-6 space-y-4">
        <h2 className="font-bold text-white flex items-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-brand-400" />
          Upload settings
        </h2>

        <Toggle
          checked={allowAnonymous}
          onChange={(v) => { setAllowAnonymous(v); if (v) setRequireAccount(false) }}
          label="Allow anonymous uploads"
          description="Guests can upload without creating an account"
        />

        <Toggle
          checked={requireAccount}
          onChange={(v) => { setRequireAccount(v); if (v) setAllowAnonymous(false) }}
          label="Require account for upload"
          description="Guests must sign in or create an account to upload"
        />

        <Toggle
          checked={allowGuestDownload}
          onChange={setAllowGuestDownload}
          label="Allow guests to download media"
          description="Gallery visitors can download approved photos and videos"
        />

        <Toggle
          checked={autoApprove}
          onChange={setAutoApprove}
          label="Auto-approve uploads"
          description="Uploads appear in the gallery immediately without moderation"
        />
      </Card>

      <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
        Create Event & Generate QR Code
      </Button>
    </form>
  )
}

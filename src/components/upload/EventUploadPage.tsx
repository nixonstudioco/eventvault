'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import Link from 'next/link'
import { Upload, CheckCircle, UserX, X, Loader2, Film } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Progress } from '@/components/ui/Progress'
import { createClient } from '@/lib/supabase/client'
import { getEventTypeEmoji, formatBytes } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface EventInfo {
  id: string
  name: string
  slug: string
  type: string
  description: string | null
  cover_image_url: string | null
  allow_anonymous_upload: boolean
  require_account_upload: boolean
  status: string
}

interface Props {
  event: EventInfo
  currentUser: SupabaseUser | null
}

interface FileItem {
  file: File
  preview: string
  type: 'image' | 'video'
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error'
}

export function EventUploadPage({ event, currentUser }: Props) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [uploaderName, setUploaderName] = useState('')
  const [uploadMode, setUploadMode] = useState<'idle' | 'uploading' | 'done'>('idle')
  const [authMode, setAuthMode] = useState<'choice' | 'anonymous' | 'account' | null>(
    event.require_account_upload ? 'account' :
    !event.allow_anonymous_upload ? 'account' :
    null
  )
  const [overallProgress, setOverallProgress] = useState(0)

  const onDrop = useCallback((accepted: File[]) => {
    const items: FileItem[] = accepted.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      progress: 0,
      status: 'pending' as const,
    }))
    setFiles(prev => [...prev, ...items])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
    },
    maxSize: 500 * 1024 * 1024,
  })

  const removeFile = (i: number) => {
    setFiles(prev => {
      URL.revokeObjectURL(prev[i].preview)
      return prev.filter((_, idx) => idx !== i)
    })
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    if (!authMode) {
      setAuthMode('choice')
      return
    }

    if (authMode === 'account' && !currentUser) {
      window.location.href = `/login?redirect=/e/${event.slug}`
      return
    }

    setUploadMode('uploading')
    const supabase = createClient()
    const total = files.length
    let done = 0

    for (let i = 0; i < files.length; i++) {
      const item = files[i]
      setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'uploading' as const } : f))

      try {
        const ext = item.file.name.split('.').pop()
        const filename = `${event.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('event-media')
          .upload(filename, item.file)

        if (uploadError) throw uploadError

        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, progress: 80 } : f))

        const { data: { publicUrl } } = supabase.storage.from('event-media').getPublicUrl(filename)

        await supabase.from('media_uploads').insert({
          event_id: event.id,
          uploader_id: currentUser?.id || null,
          uploader_name: currentUser ? null : (uploaderName || null),
          is_anonymous: authMode === 'anonymous',
          file_url: publicUrl,
          file_type: item.type,
          file_name: item.file.name,
          file_size: item.file.size,
          mime_type: item.file.type,
          storage_path: filename,
          status: 'pending',
        })

        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'done' as const, progress: 100 } : f))
      } catch {
        setFiles(prev => prev.map((f, idx) => idx === i ? { ...f, status: 'error' as const } : f))
      }

      done++
      setOverallProgress((done / total) * 100)
    }

    setUploadMode('done')
    toast.success('All files uploaded!')
  }

  const needsAuthChoice = files.length > 0 && !authMode && !event.require_account_upload && event.allow_anonymous_upload

  if (uploadMode === 'done') {
    return <UploadSuccess event={event} fileCount={files.length} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative">
        {event.cover_image_url ? (
          <div className="h-48 sm:h-64 relative overflow-hidden">
            <Image src={event.cover_image_url} alt={event.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-surface-900" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-br from-brand-600/30 to-purple-600/20" />
        )}
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-6">
        <div className="text-center">
          <div className="text-3xl mb-2">{getEventTypeEmoji(event.type)}</div>
          <h1 className="text-2xl font-black text-white">{event.name}</h1>
          {event.description && (
            <p className="text-sm text-white/50 mt-2">{event.description}</p>
          )}
        </div>

        {/* Auth choice */}
        {(needsAuthChoice || authMode === 'choice') && (
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-bold text-white text-center">How do you want to upload?</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAuthMode('anonymous')}
                className="glass-card p-4 text-center hover:border-brand-500/40 transition-all group"
              >
                <UserX className="w-8 h-8 text-white/50 group-hover:text-brand-400 transition-colors mx-auto mb-2" />
                <p className="font-semibold text-white text-sm">Anonymous</p>
                <p className="text-xs text-white/40 mt-1">No account needed</p>
              </button>
              <Link href={`/login?redirect=/e/${event.slug}`}>
                <div className="glass-card p-4 text-center hover:border-brand-500/40 transition-all group cursor-pointer">
                  <div className="w-8 h-8 text-white/50 group-hover:text-brand-400 transition-colors mx-auto mb-2 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="font-semibold text-white text-sm">With account</p>
                  <p className="text-xs text-white/40 mt-1">Your name will show</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Name input for anonymous */}
        {authMode === 'anonymous' && (
          <div className="glass-card p-4">
            <Input
              label="Your name (optional)"
              placeholder="e.g. Andrei"
              value={uploaderName}
              onChange={e => setUploaderName(e.target.value)}
            />
          </div>
        )}

        {/* Dropzone */}
        {!needsAuthChoice && authMode !== 'choice' && (
          <div
            {...getRootProps()}
            className={`glass-card p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive ? 'border-brand-500/60 bg-brand-600/10' : 'hover:border-white/30'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 rounded-2xl bg-brand-600/20 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-brand-400" />
            </div>
            <p className="font-bold text-white mb-1">
              {isDragActive ? 'Drop files here' : 'Upload photos & videos'}
            </p>
            <p className="text-sm text-white/50">
              Drag & drop or tap to select from your phone
            </p>
            <p className="text-xs text-white/30 mt-2">
              JPG, PNG, MP4, MOV · Max 500 MB per file
            </p>
          </div>
        )}

        {/* File list */}
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-white/50">{files.length} file{files.length > 1 ? 's' : ''} selected</p>
            <div className="grid grid-cols-3 gap-2">
              {files.map((f, i) => (
                <div key={i} className="relative aspect-square glass-card overflow-hidden">
                  {f.type === 'image' ? (
                    <img src={f.preview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-700">
                      <Film className="w-8 h-8 text-white/30" />
                    </div>
                  )}
                  {f.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                      <Loader2 className="w-6 h-6 text-brand-400 animate-spin mb-1" />
                      <span className="text-xs text-white">{f.progress.toFixed(0)}%</span>
                    </div>
                  )}
                  {f.status === 'done' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                  )}
                  {f.status === 'pending' && (
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center hover:bg-red-500/80 transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload progress */}
        {uploadMode === 'uploading' && (
          <Progress value={overallProgress} max={100} label="Uploading..." showLabel />
        )}

        {/* Upload button */}
        {files.length > 0 && uploadMode === 'idle' && authMode && authMode !== 'choice' && (
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            icon={<Upload className="w-5 h-5" />}
            onClick={uploadFiles}
          >
            Upload {files.length} file{files.length > 1 ? 's' : ''}
          </Button>
        )}

        {files.length === 0 && authMode && authMode !== 'choice' && (
          <p className="text-center text-sm text-white/40">
            Select files above to start uploading
          </p>
        )}
      </div>
    </div>
  )
}

function UploadSuccess({ event, fileCount }: { event: EventInfo; fileCount: number }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center">
        <div className="w-20 h-20 rounded-3xl bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">All uploaded!</h1>
        <p className="text-white/50 mb-2">
          {fileCount} file{fileCount > 1 ? 's' : ''} sent successfully.
        </p>
        <p className="text-sm text-white/40 mb-8">
          Your materials have been submitted to the organizer for approval.
        </p>
        <div className="space-y-3">
          <Link href={`/e/${event.slug}`}>
            <Button variant="secondary" className="w-full">Upload more</Button>
          </Link>
          <Link href={`/e/${event.slug}/gallery`}>
            <Button variant="ghost" className="w-full">View gallery</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

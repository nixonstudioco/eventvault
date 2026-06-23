'use client'

import { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Save, Palette, Type } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { getEventUploadUrl } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Event } from '@/types'

const TEMPLATES = [
  {
    id: 'wedding',
    label: '💍 Wedding',
    bg: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%)',
    accent: '#c084fc',
    text: '#faf5ff',
  },
  {
    id: 'birthday',
    label: '🎂 Birthday',
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    accent: '#f59e0b',
    text: '#fffbeb',
  },
  {
    id: 'baptism',
    label: '✝️ Baptism',
    bg: 'linear-gradient(135deg, #0f1f0f 0%, #1a3a1a 100%)',
    accent: '#86efac',
    text: '#f0fdf4',
  },
  {
    id: 'party',
    label: '🎉 Party',
    bg: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 100%)',
    accent: '#fb7185',
    text: '#fff1f2',
  },
  {
    id: 'corporate',
    label: '💼 Corporate',
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    accent: '#38bdf8',
    text: '#f0f9ff',
  },
  {
    id: 'default',
    label: '⚡ Default',
    bg: 'linear-gradient(135deg, #0a0a0f 0%, #151521 100%)',
    accent: '#6366f1',
    text: '#ffffff',
  },
]

interface Props {
  event: Event & { qr_code?: { id: string } }
}

export function QRDesignEditor({ event }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[5])
  const [title, setTitle] = useState(event.name)
  const [subtitle, setSubtitle] = useState('Scan & upload your memories')
  const [saving, setSaving] = useState(false)
  const posterRef = useRef<HTMLDivElement>(null)

  const uploadUrl = getEventUploadUrl(event.slug)

  const handleDownload = async () => {
    if (!posterRef.current) return
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(posterRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
    })
    const link = document.createElement('a')
    link.download = `${event.slug}-poster.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    toast.success('Poster downloaded!')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      if (event.qr_code?.id) {
        await supabase.from('event_qr_codes').update({
          template: selectedTemplate.id,
          title,
          subtitle,
          bg_color: selectedTemplate.bg,
          accent_color: selectedTemplate.accent,
          text_color: selectedTemplate.text,
        }).eq('id', event.qr_code.id)
      }
      toast.success('Design saved!')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Controls */}
      <div className="space-y-6">
        <Card className="p-6 space-y-5">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-brand-400" />
            Choose template
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`p-3 rounded-xl text-xs font-medium transition-all ${
                  selectedTemplate.id === t.id
                    ? 'ring-2 ring-brand-500 scale-105'
                    : 'hover:scale-102'
                }`}
                style={{ background: t.bg, color: t.text }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Type className="w-4 h-4 text-brand-400" />
            Text content
          </h3>
          <Input
            label="Main title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Input
            label="Subtitle / call to action"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
          />
        </Card>

        <div className="flex gap-3">
          <Button
            variant="primary"
            icon={<Download className="w-4 h-4" />}
            onClick={handleDownload}
            className="flex-1"
          >
            Download PNG
          </Button>
          <Button
            variant="secondary"
            icon={<Save className="w-4 h-4" />}
            onClick={handleSave}
            loading={saving}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Poster preview */}
      <div>
        <p className="text-sm text-white/40 mb-3">Preview</p>
        <div
          ref={posterRef}
          className="aspect-[3/4] rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8 text-center shadow-2xl"
          style={{ background: selectedTemplate.bg }}
        >
          {/* Decorative elements */}
          <div
            className="w-24 h-1 rounded-full mb-8 opacity-50"
            style={{ background: selectedTemplate.accent }}
          />

          <h2
            className="text-3xl font-black mb-2 leading-tight"
            style={{ color: selectedTemplate.text }}
          >
            {title || event.name}
          </h2>

          <p
            className="text-sm mb-8 opacity-70"
            style={{ color: selectedTemplate.text }}
          >
            {subtitle}
          </p>

          {/* QR Code */}
          <div
            className="rounded-2xl p-5 mb-6"
            style={{ background: 'rgba(255,255,255,0.95)' }}
          >
            <QRCodeCanvas
              value={uploadUrl}
              size={180}
              level="H"
              bgColor="transparent"
              fgColor="#0a0a0f"
            />
          </div>

          <p
            className="text-xs opacity-50 font-mono"
            style={{ color: selectedTemplate.text }}
          >
            {uploadUrl}
          </p>

          <div
            className="w-24 h-1 rounded-full mt-8 opacity-50"
            style={{ background: selectedTemplate.accent }}
          />
        </div>
      </div>
    </div>
  )
}

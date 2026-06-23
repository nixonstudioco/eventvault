'use client'

import { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Palette, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { getEventUploadUrl } from '@/lib/utils'
import type { Event } from '@/types'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Props {
  event: Event
}

export function QRCodeDisplay({ event }: Props) {
  const qrRef = useRef<HTMLCanvasElement>(null)
  const uploadUrl = getEventUploadUrl(event.slug)

  const downloadQR = () => {
    const canvas = document.querySelector('#qr-canvas canvas') as HTMLCanvasElement
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `${event.slug}-qr.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    toast.success('QR code downloaded!')
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(uploadUrl)
    toast.success('Upload link copied!')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* QR Code */}
      <Card className="p-8 flex flex-col items-center text-center">
        <h3 className="font-bold text-white mb-6">Event QR Code</h3>

        <div id="qr-canvas" className="bg-white p-6 rounded-2xl mb-6 shadow-2xl">
          <QRCodeCanvas
            value={uploadUrl}
            size={200}
            level="H"
            includeMargin={false}
            bgColor="#ffffff"
            fgColor="#0a0a0f"
          />
        </div>

        <p className="text-xs text-white/40 font-mono mb-6 break-all">{uploadUrl}</p>

        <div className="flex flex-col gap-3 w-full">
          <Button
            variant="primary"
            icon={<Download className="w-4 h-4" />}
            onClick={downloadQR}
            className="w-full"
          >
            Download QR Code (PNG)
          </Button>
          <Button
            variant="secondary"
            icon={<ExternalLink className="w-4 h-4" />}
            onClick={copyLink}
            className="w-full"
          >
            Copy upload link
          </Button>
          <Link href={`/events/${event.id}/qr-design`} className="w-full">
            <Button
              variant="secondary"
              icon={<Palette className="w-4 h-4" />}
              className="w-full"
            >
              Design QR poster
            </Button>
          </Link>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-6">
        <h3 className="font-bold text-white mb-4">How to share</h3>
        <div className="space-y-4">
          {[
            {
              emoji: '🖨️',
              title: 'Print it',
              desc: 'Download the QR and print it for table cards, photo walls, or signage.',
            },
            {
              emoji: '📱',
              title: 'Share digitally',
              desc: 'Copy the upload link and share via WhatsApp, email, or social media.',
            },
            {
              emoji: '🎨',
              title: 'Design a poster',
              desc: 'Use our QR poster designer to create beautiful branded designs.',
            },
            {
              emoji: '📺',
              title: 'Display on screen',
              desc: 'Show the QR code fullscreen on a TV or projector during your event.',
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="text-2xl flex-shrink-0">{item.emoji}</span>
              <div>
                <p className="font-semibold text-white text-sm">{item.title}</p>
                <p className="text-xs text-white/50 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-brand-600/10 border border-brand-500/20 rounded-xl">
          <p className="text-sm text-white/70">
            <strong className="text-brand-400">Tip:</strong> Guests can also access the upload page by visiting{' '}
            <span className="font-mono text-xs text-brand-400">{uploadUrl}</span> directly.
          </p>
        </div>
      </Card>
    </div>
  )
}

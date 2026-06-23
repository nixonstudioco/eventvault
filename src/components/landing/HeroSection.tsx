'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, QrCode, Camera, Shield, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

      {/* Subtle radial glow behind hero */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(123,47,247,0.6) 0%, transparent 65%)' }} />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.8) 0%, transparent 70%)' }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 lg:px-8 text-center">

        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/4 text-xs font-medium text-white/60 mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
          Now live — photo & video gallery with QR upload
          <ArrowRight className="w-3 h-3" />
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black leading-[1.06] tracking-tight text-white mb-6 animate-slide-up">
          Every moment.
          <br />
          <span className="gradient-text">Safe. Forever.</span>
        </h1>

        <p className="text-lg text-white/50 max-w-xl mx-auto mb-10 animate-slide-up font-normal leading-relaxed" style={{ animationDelay: '0.1s' }}>
          Create a private media gallery for your event. Guests upload via QR code — no app, no friction. You moderate, download, and share.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-14 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <Link href="/register">
            <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
              Create your first event
            </Button>
          </Link>
          <a href="#how-it-works" className="btn-ghost text-white/60 hover:text-white flex items-center gap-2 text-sm font-medium px-5 py-3">
            <Play className="w-4 h-4" />
            See how it works
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          {[
            { icon: QrCode,  label: 'Instant QR code' },
            { icon: Camera,  label: 'Photo & video upload' },
            { icon: Shield,  label: 'Moderated gallery' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/8 bg-white/3 text-xs font-medium text-white/55">
              <Icon className="w-3.5 h-3.5 text-brand-400" />
              {label}
            </div>
          ))}
        </div>

        {/* Hero mockup */}
        <div className="relative animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {/* Glow behind card */}
          <div className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(123,47,247,0.4) 0%, rgba(6,182,212,0.2) 100%)' }} />

          <div className="relative border border-white/10 rounded-3xl bg-[#0c0c20] overflow-hidden shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/15" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/8" />
              </div>
              <div className="flex-1 mx-3 h-6 rounded-md bg-white/5 flex items-center px-3">
                <span className="text-xs text-white/25 font-mono">eventvault.app/e/ana-stefan-2025</span>
              </div>
            </div>

            {/* Mock gallery grid */}
            <div className="p-5">
              <div className="grid grid-cols-4 gap-2.5 mb-4">
                {[
                  { bg: 'rgba(123,47,247,0.25)', label: 'ceremony_001.jpg' },
                  { bg: 'rgba(6,182,212,0.2)',   label: 'dance_floor.mp4' },
                  { bg: 'rgba(168,85,247,0.2)',   label: 'cake_cutting.jpg' },
                  { bg: 'rgba(123,47,247,0.18)',  label: 'group_photo.jpg' },
                  { bg: 'rgba(6,182,212,0.15)',   label: 'toast.mp4' },
                  { bg: 'rgba(168,85,247,0.22)',  label: 'first_dance.jpg' },
                  { bg: 'rgba(99,102,241,0.2)',   label: 'bouquet.jpg' },
                  { bg: 'rgba(6,182,212,0.18)',   label: 'dinner.jpg' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl flex items-end p-2 overflow-hidden"
                    style={{ background: item.bg }}
                  >
                    <span className="text-[8px] text-white/30 truncate w-full">{item.label}</span>
                  </div>
                ))}
              </div>
              {/* Stats bar */}
              <div className="flex items-center gap-4 pt-3 border-t border-white/6">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs text-white/40">124 photos approved</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="text-xs text-white/40">8 pending review</span>
                </div>
                <div className="ml-auto">
                  <span className="text-xs font-medium text-brand-400">Download all →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

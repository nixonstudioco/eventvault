'use client'

import Link from 'next/link'
import { ArrowRight, QrCode, Camera, Shield, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-900/20 rounded-full blur-3xl" />
      </div>

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium text-brand-400 border border-brand-500/30 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          Now with live gallery & custom QR posters
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 animate-slide-up">
          All event memories.
          <br />
          <span className="gradient-text">One QR away.</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Create a private media gallery for your wedding, birthday, baptism or party.
          Let guests upload photos and videos through a simple QR code — no app required.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link href="/register">
            <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-5 h-5" />}>
              Create your first event
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="secondary" size="lg">
              See how it works
            </Button>
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {[
            { icon: QrCode, label: 'Instant QR code' },
            { icon: Camera, label: 'Photo & video upload' },
            { icon: Shield, label: 'Moderated gallery' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm text-white/70">
              <Icon className="w-4 h-4 text-brand-400" />
              {label}
            </div>
          ))}
        </div>

        {/* Hero visual */}
        <div className="relative mt-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="glass-card border border-white/20 rounded-3xl p-4 sm:p-8 mx-auto max-w-4xl glow-brand">
            <div className="aspect-[16/9] bg-surface-700/50 rounded-2xl flex items-center justify-center relative overflow-hidden">
              {/* Mock dashboard preview */}
              <div className="absolute inset-0 grid grid-cols-3 gap-3 p-6">
                {/* Mock media grid */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-brand-600/10 border border-brand-500/10 flex items-center justify-center"
                    style={{
                      opacity: 0.4 + (i * 0.06),
                      background: i % 3 === 0
                        ? 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 100%)'
                        : i % 3 === 1
                        ? 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(99,102,241,0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(99,102,241,0.1) 100%)',
                    }}
                  >
                    {i % 4 === 0 && <Camera className="w-8 h-8 text-brand-400/50" />}
                  </div>
                ))}
              </div>
              {/* Central QR */}
              <div className="relative z-10 glass-card border border-white/20 p-6 rounded-2xl text-center">
                <div className="w-24 h-24 bg-white rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-surface-900" />
                </div>
                <p className="text-xs font-semibold text-white">Scan & upload memories</p>
                <p className="text-xs text-white/40 mt-1">eventvault.io/e/wedding-2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

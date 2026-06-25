'use client'

import { motion, type MotionProps } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Camera, Video, Heart, Star } from 'lucide-react'

const fadeUp = (delay = 0): MotionProps => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as number[], delay },
})

const mockPhotos = [
  { color: 'rgba(123,47,247,0.3)', icon: Camera },
  { color: 'rgba(6,182,212,0.25)', icon: Heart },
  { color: 'rgba(168,85,247,0.2)', icon: Camera },
  { color: 'rgba(6,182,212,0.3)', icon: Video },
  { color: 'rgba(59,130,246,0.25)', icon: Camera },
  { color: 'rgba(123,47,247,0.2)', icon: Heart },
  { color: 'rgba(6,182,212,0.2)', icon: Camera },
  { color: 'rgba(168,85,247,0.3)', icon: Video },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-5 overflow-hidden">

      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 900,
          height: 600,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(123,47,247,0.18) 0%, rgba(6,182,212,0.06) 50%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">

        {/* Badge */}
        <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
          <div className="badge badge-purple gap-2">
            <span className="dot-pulse" />
            Trusted by 500+ event organizers
          </div>
        </motion.div>

        {/* H1 */}
        <motion.h1
          {...fadeUp(0.08)}
          className="text-5xl sm:text-7xl lg:text-[88px] font-black tracking-tight leading-[1.02] mb-7"
          style={{ letterSpacing: '-0.03em' }}
        >
          Every memory,
          <br />
          <span className="gradient-text">perfectly captured.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.16)}
          className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Free to join. When you&apos;re ready, create a private gallery for your wedding, birthday, or any event — starting at €10. Guests upload via QR, no app needed.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.24)} className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
          <Link href="/register" className="btn-primary text-base py-3.5 px-7">
            Create free account
            <ArrowRight size={16} />
          </Link>
          <a href="#how-it-works" className="btn-secondary text-base py-3.5 px-7">
            See how it works
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div {...fadeUp(0.32)} className="flex flex-wrap justify-center gap-10 mb-16">
          {[
            { value: '500+', label: 'events created' },
            { value: '50K+', label: 'photos uploaded' },
            { value: '4.9★', label: 'average rating' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-white tracking-tight">{s.value}</div>
              <div className="text-xs text-white/35 mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* App Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
          className="relative mx-auto max-w-3xl"
        >
          <div
            className="absolute -inset-10 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(123,47,247,0.2) 0%, transparent 70%)' }}
          />

          <div
            className="relative rounded-2xl overflow-hidden border border-white/10"
            style={{ background: '#0d0d0d', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)' }}
          >
            {/* Window bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]" style={{ background: '#111' }}>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40" />
                </div>
                <span className="text-xs text-white/25 font-mono">eventvault.app/e/ana-stefan-wedding</span>
              </div>
              <div className="badge badge-green text-[11px] py-0.5">
                <span className="dot-pulse" style={{ width: 5, height: 5 }} />
                Live
              </div>
            </div>

            {/* Gallery header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/[0.04]">
              <div>
                <h3 className="text-sm font-semibold text-white">Ana &amp; Stefan Wedding</h3>
                <p className="text-xs text-white/35 mt-0.5">June 14, 2025 · Bucharest</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-white/45">132 guests</span>
                </div>
                <div className="btn-primary text-xs py-1.5 px-3 rounded-lg">Upload</div>
              </div>
            </div>

            {/* Photo grid */}
            <div className="grid grid-cols-4 gap-2 p-4" style={{ background: '#0a0a0a' }}>
              {mockPhotos.map((p, i) => {
                const Icon = p.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.55 + i * 0.05, duration: 0.4, ease: 'easeOut' }}
                    className="aspect-square rounded-xl flex items-center justify-center relative overflow-hidden"
                    style={{ background: p.color }}
                  >
                    <Icon size={20} className="text-white/20" />
                    {i === 0 && (
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-400" />
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Bottom bar */}
            <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between" style={{ background: '#111' }}>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-white/40">132 photos</span>
                <span className="text-white/15">·</span>
                <span className="text-white/40">8 videos</span>
                <span className="text-white/15">·</span>
                <span className="text-yellow-400/70">3 pending review</span>
              </div>
              <span className="text-xs text-white/25">5 GB / 50 GB</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

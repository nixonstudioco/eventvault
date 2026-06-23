'use client'

import { motion } from 'framer-motion'
import { QrCode, Shield, Download, Users, BookOpen, Zap, LayoutGrid, Bell } from 'lucide-react'

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

export function FeaturesSection() {
  return (
    <section id="features" className="py-10 lg:py-20 px-5 relative">
      <div className="section-divider mb-20" />

      <div className="max-w-6xl mx-auto">
        <motion.div {...inView(0)} className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-4">Features</p>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5"
            style={{ letterSpacing: '-0.025em' }}
          >
            Everything you need.
            <br />
            <span className="gradient-text">Nothing you don&apos;t.</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Card 1: QR Code — tall, spans 2 rows on LG */}
          <motion.div
            {...inView(0.05)}
            className="bento-card lg:row-span-2 flex flex-col justify-between min-h-[300px] lg:min-h-[480px]"
            style={{ background: 'linear-gradient(160deg, #0e0e1c 0%, #0d0d0d 100%)' }}
          >
            <div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: 'rgba(123,47,247,0.15)', border: '1px solid rgba(123,47,247,0.25)' }}
              >
                <QrCode size={22} className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Custom QR Magic</h3>
              <p className="text-sm text-white/45 leading-relaxed">
                Generate beautiful QR posters themed for weddings, birthdays, baptisms, and more.
                One scan is all your guests need — no friction, no downloads.
              </p>
            </div>

            {/* QR visual */}
            <div className="mt-8 flex justify-center">
              <div
                className="w-36 h-36 rounded-2xl flex items-center justify-center relative"
                style={{ background: 'rgba(123,47,247,0.08)', border: '1px solid rgba(123,47,247,0.18)' }}
              >
                <div className="grid grid-cols-5 gap-0.5">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-[2px]"
                      style={{
                        background: [0,1,2,5,7,10,11,12,14,17,18,22,23,24].includes(i)
                          ? 'rgba(168,85,247,0.85)'
                          : 'rgba(255,255,255,0.04)',
                      }}
                    />
                  ))}
                </div>
                <div
                  className="absolute inset-5 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.6)' }}
                >
                  <QrCode size={26} className="text-purple-400" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Moderation */}
          <motion.div {...inView(0.1)} className="bento-card">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}
            >
              <Shield size={20} className="text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Full Moderation Control</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Every upload goes to a pending queue. You approve or reject before anything goes public.
            </p>
          </motion.div>

          {/* Card 3: Bulk Download */}
          <motion.div
            {...inView(0.15)}
            className="bento-card"
            style={{ border: '1px solid rgba(123,47,247,0.18)' }}
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(123,47,247,0.12)', border: '1px solid rgba(123,47,247,0.25)' }}
            >
              <Download size={20} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">One-click Bulk Download</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Download your entire gallery in one archive. Every photo and video, instantly yours.
            </p>
          </motion.div>

          {/* Card 4: Live Gallery — wide on md+ */}
          <motion.div
            {...inView(0.2)}
            className="bento-card md:col-span-2 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
          >
            <div className="flex-shrink-0">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}
              >
                <LayoutGrid size={20} className="text-cyan-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">Live Gallery with Lightbox</h3>
              <p className="text-sm text-white/40 leading-relaxed">
                Beautiful masonry gallery with real-time updates and full lightbox viewer.
                Share the link — guests see new uploads as they happen.
              </p>
            </div>
            <div className="flex-shrink-0 grid grid-cols-3 gap-1.5">
              {[
                'rgba(123,47,247,0.5)', 'rgba(6,182,212,0.4)', 'rgba(168,85,247,0.45)',
                'rgba(6,182,212,0.35)', 'rgba(59,130,246,0.4)', 'rgba(123,47,247,0.35)',
              ].map((c, i) => (
                <div key={i} className="w-10 h-10 rounded-lg opacity-70" style={{ background: c }} />
              ))}
            </div>
          </motion.div>

          {/* Card 5: Guestbook */}
          <motion.div {...inView(0.25)} className="bento-card">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}
            >
              <BookOpen size={20} className="text-purple-300" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Guest Guestbook</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Let guests leave messages and well-wishes. Moderated by you, treasured forever.
            </p>
          </motion.div>

          {/* Card 6: Instant setup */}
          <motion.div {...inView(0.3)} className="bento-card">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}
            >
              <Zap size={20} className="text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Ready in 60 Seconds</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              From zero to a live gallery in under a minute. Your QR code is generated instantly.
            </p>
          </motion.div>

          {/* Card 7: Notifications */}
          <motion.div {...inView(0.35)} className="bento-card">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}
            >
              <Bell size={20} className="text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Email Notifications</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Get notified when guests upload or when media is pending your review.
            </p>
          </motion.div>

          {/* Card 8: Multi-role */}
          <motion.div {...inView(0.4)} className="bento-card md:col-span-2 lg:col-span-1">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(123,47,247,0.1)', border: '1px solid rgba(123,47,247,0.2)' }}
            >
              <Users size={20} className="text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Flexible Role System</h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Anonymous guests, registered users, organizers, and admins — each with exactly the right access.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

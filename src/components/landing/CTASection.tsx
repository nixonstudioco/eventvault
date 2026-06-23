'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Lock, RefreshCw, CreditCard } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-28 lg:py-36 px-5 relative overflow-hidden">
      <div className="section-divider mb-0" />

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(123,47,247,0.14) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6"
            style={{ letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            Ready to collect
            <br />
            <span className="gradient-text">every memory?</span>
          </h2>

          <p className="text-lg text-white/45 mb-10 max-w-lg mx-auto leading-relaxed">
            Create your first event gallery in 60 seconds. Your guests will love it.
          </p>

          <Link href="/register" className="btn-primary text-base py-4 px-9 inline-flex">
            Create your event free
            <ArrowRight size={18} />
          </Link>

          <div className="flex items-center justify-center gap-6 mt-8">
            {[
              { icon: CreditCard, label: 'No credit card required' },
              { icon: RefreshCw, label: 'Cancel anytime' },
              { icon: Lock, label: 'SSL encrypted' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-sm text-white/30">
                <Icon size={13} />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

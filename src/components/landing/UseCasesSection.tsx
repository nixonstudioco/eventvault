'use client'

import { motion } from 'framer-motion'

const cases = [
  { emoji: '💍', label: 'Weddings', desc: 'Collect photos from all your guests in one private gallery.' },
  { emoji: '🎂', label: 'Birthdays', desc: 'Let everyone contribute their favorite moments from the party.' },
  { emoji: '🕊️', label: 'Baptisms', desc: 'Preserve precious first memories with family and friends.' },
  { emoji: '🎓', label: 'Graduations', desc: 'Capture the day from every angle — friends, family, candids.' },
  { emoji: '🏢', label: 'Corporate', desc: 'Company events, retreats, and team celebrations.' },
  { emoji: '🎉', label: 'Any celebration', desc: 'Anniversaries, reunions, holidays — any event worth remembering.' },
]

export function UseCasesSection() {
  return (
    <section className="py-10 lg:py-16 px-5 relative">
      <div className="section-divider mb-20" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-4">Perfect for</p>
          <h2
            className="text-4xl sm:text-5xl font-black text-white"
            style={{ letterSpacing: '-0.025em' }}
          >
            Every occasion.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {cases.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: 'easeOut' }}
              className="rounded-2xl p-5 text-center group cursor-default transition-all duration-200 hover:bg-white/[0.03]"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="text-3xl mb-3">{c.emoji}</div>
              <div className="text-sm font-semibold text-white/80 mb-1">{c.label}</div>
              <div className="text-xs text-white/30 leading-relaxed">{c.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import { UserPlus, CreditCard, Settings, Sparkles } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: UserPlus,
    title: 'Create a free account',
    desc: 'Sign up in seconds. No credit card required. Your account is free — forever.',
    color: '#7B2FF7',
    tag: 'Free',
    tagColor: 'rgba(34,197,94,0.15)',
    tagText: '#4ade80',
  },
  {
    num: '02',
    icon: CreditCard,
    title: 'Choose your plan',
    desc: 'When you\'re ready to create an event gallery, pick Basic (€10) or Premium (€30). One flat fee — no subscriptions, no surprises.',
    color: '#8b5cf6',
    tag: 'One-time payment',
    tagColor: 'rgba(123,47,247,0.15)',
    tagText: '#c084fc',
  },
  {
    num: '03',
    icon: Settings,
    title: 'Configure & launch',
    desc: 'Set up your event, get your QR code instantly, and share it with your guests. Your gallery goes live immediately.',
    color: '#06b6d4',
    tag: '60 seconds setup',
    tagColor: 'rgba(6,182,212,0.15)',
    tagText: '#22d3ee',
  },
  {
    num: '04',
    icon: Sparkles,
    title: 'Enjoy the experience',
    desc: 'Guests scan, upload, and the memories pour in. You moderate, curate, and download everything. Yours forever.',
    color: '#a855f7',
    tag: 'Memories forever',
    tagColor: 'rgba(168,85,247,0.15)',
    tagText: '#d8b4fe',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 px-5 relative">
      <div className="section-divider" />

      <div className="max-w-6xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-4">How it works</p>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5"
            style={{ letterSpacing: '-0.025em' }}
          >
            Simple as it gets.
          </h2>
          <p className="text-lg text-white/45 max-w-lg mx-auto">
            From zero to a live event gallery — four steps, no complexity.
          </p>
        </motion.div>

        {/* 4-step grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {/* Connector line desktop */}
          <div
            className="hidden lg:block absolute top-[52px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px"
            style={{ background: 'linear-gradient(90deg, rgba(123,47,247,0.3) 0%, rgba(6,182,212,0.3) 100%)' }}
          />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as number[] }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className="flex justify-center mb-6 relative z-10">
                  <div
                    className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: '#0d0d0d', border: `1px solid ${step.color}30` }}
                  >
                    <Icon size={22} style={{ color: step.color }} />
                    <div
                      className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-black"
                      style={{ background: step.color }}
                    >
                      {i + 1}
                    </div>
                  </div>
                </div>

                {/* Tag */}
                <div
                  className="text-[11px] font-semibold px-3 py-1 rounded-full mb-4"
                  style={{ background: step.tagColor, color: step.tagText }}
                >
                  {step.tag}
                </div>

                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

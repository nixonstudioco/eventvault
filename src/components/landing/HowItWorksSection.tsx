'use client'

import { motion } from 'framer-motion'
import { QrCode, Upload, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: QrCode,
    title: 'Create your event',
    desc: 'Set up in under 60 seconds. Give it a name, pick your settings, and your unique QR code is ready instantly.',
    color: '#7B2FF7',
  },
  {
    num: '02',
    icon: Upload,
    title: 'Guests scan & upload',
    desc: 'Print or share the QR code. Guests scan with any phone and upload photos or videos directly — no app, no account required.',
    color: '#8b5cf6',
  },
  {
    num: '03',
    icon: CheckCircle2,
    title: 'You moderate & keep',
    desc: 'Review every upload before it goes public. Approve, reject, download everything in one click. The memories are yours forever.',
    color: '#06b6d4',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 lg:py-36 px-5 relative">
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
            Three steps from creation to a full gallery of memories.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Desktop connector */}
          <div
            className="hidden md:block absolute top-14 left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px"
            style={{ background: 'linear-gradient(90deg, rgba(123,47,247,0.35) 0%, rgba(6,182,212,0.35) 100%)' }}
          />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="flex justify-center mb-8">
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

                <div className="text-center px-2">
                  <div
                    className="text-[80px] font-black leading-none mb-2 select-none"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}25 0%, transparent 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

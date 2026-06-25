'use client'

import { motion, type MotionProps } from 'framer-motion'
import Link from 'next/link'
import { Check, Zap, Crown, Info } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    price: 10,
    currency: '€',
    icon: Zap,
    description: 'Everything you need for one event',
    badge: null,
    accent: 'rgba(255,255,255,0.08)',
    iconBg: 'rgba(255,255,255,0.06)',
    iconColor: '#888',
    features: [
      '1 active event',
      '5 GB storage',
      'Photo & video upload',
      'QR code included',
      'Public gallery',
      'Manual moderation',
      'Guest guestbook',
    ],
    cta: 'Create event — €10',
    href: '/register?plan=basic',
    highlight: false,
  },
  {
    name: 'Premium',
    price: 30,
    currency: '€',
    icon: Crown,
    description: 'The full experience, one event',
    badge: 'Most Popular',
    accent: 'rgba(123,47,247,0.35)',
    iconBg: 'rgba(123,47,247,0.15)',
    iconColor: '#c084fc',
    features: [
      '1 active event',
      '50 GB storage',
      'Photo & video upload',
      'Custom QR poster design',
      'Live gallery',
      'Guest guestbook',
      'Personal branding',
      'Bulk download all media',
      'Email notifications',
      'Priority support',
    ],
    cta: 'Create event — €30',
    href: '/register?plan=premium',
    highlight: true,
  },
]

const inView = (delay = 0): MotionProps => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] as number[] },
})

export function PricingSection() {
  return (
    <section id="pricing" className="py-10 lg:py-20 px-5 relative">
      <div className="section-divider mb-20" />

      <div className="max-w-5xl mx-auto">
        <motion.div {...inView(0)} className="text-center mb-6">
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-4">Pricing</p>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5"
            style={{ letterSpacing: '-0.025em' }}
          >
            Pay once.
            <br />
            <span className="gradient-text">Own the memory.</span>
          </h2>
          <p className="text-lg text-white/45 max-w-md mx-auto mb-4">
            No subscriptions. No monthly fees. Pay per event, keep it forever.
          </p>
        </motion.div>

        {/* Free account callout */}
        <motion.div {...inView(0.08)} className="flex justify-center mb-12">
          <div
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm"
            style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}
          >
            <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" style={{ boxShadow: '0 0 6px rgba(74,222,128,0.6)' }} />
            <span className="text-white/60">
              Account creation is <span className="text-green-400 font-semibold">always free</span> — you only pay when you create an event gallery.
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {plans.map((plan, i) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.name}
                {...inView(i * 0.1)}
                className="relative rounded-2xl p-8 flex flex-col"
                style={{
                  background: plan.highlight ? '#0d0d18' : '#0a0a0a',
                  border: `1px solid ${plan.accent}`,
                  boxShadow: plan.highlight ? '0 0 40px rgba(123,47,247,0.1)' : 'none',
                }}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="btn-primary text-xs py-1.5 px-4 rounded-full">{plan.badge}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: plan.iconBg }}
                  >
                    <Icon size={18} style={{ color: plan.iconColor }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-white/40">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>
                      {plan.currency}{plan.price}
                    </span>
                  </div>
                  <p className="text-xs text-white/30 mt-1.5 flex items-center gap-1">
                    <Info size={11} />
                    One-time flat fee per event · No recurring charges
                  </p>
                </div>

                <div className="my-6 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

                <Link
                  href={plan.href}
                  className={`${plan.highlight ? 'btn-primary' : 'btn-secondary'} w-full justify-center mb-6`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-3">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/65">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: plan.highlight ? 'rgba(123,47,247,0.2)' : 'rgba(255,255,255,0.06)' }}
                      >
                        <Check size={11} style={{ color: plan.highlight ? '#c084fc' : '#555' }} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom note */}
        <motion.div {...inView(0.3)} className="mt-10 text-center">
          <p className="text-sm text-white/25">
            All plans include SSL encryption · 99.9% uptime · Supabase-powered secure storage
          </p>
          <p className="text-xs text-white/15 mt-2">
            Need multiple events? Each event is purchased separately — pay only for what you need.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { motion, type MotionProps } from 'framer-motion'
import Link from 'next/link'
import { Check, Zap, Crown } from 'lucide-react'

const plans = [
  {
    name: 'Basic',
    price: 19,
    icon: Zap,
    description: 'Perfect for a single event',
    badge: null,
    accent: 'rgba(255,255,255,0.08)',
    iconBg: 'rgba(255,255,255,0.06)',
    iconColor: '#888',
    features: ['1 active event', '5 GB storage', 'Photo & video upload', 'QR code included', 'Public gallery', 'Manual moderation', 'Guest guestbook'],
    cta: 'Get started',
    href: '/register?plan=basic',
    highlight: false,
  },
  {
    name: 'Premium',
    price: 49,
    icon: Crown,
    description: 'For organizers who want everything',
    badge: 'Most Popular',
    accent: 'rgba(123,47,247,0.35)',
    iconBg: 'rgba(123,47,247,0.15)',
    iconColor: '#c084fc',
    features: [
      'Unlimited events', '50 GB storage', 'Photo & video upload',
      'Custom QR poster design', 'Live gallery', 'Guest guestbook',
      'Bulk download all media', 'Email notifications', 'Priority support',
    ],
    cta: 'Go Premium',
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
        <motion.div {...inView(0)} className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest text-white/30 uppercase mb-4">Pricing</p>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5"
            style={{ letterSpacing: '-0.025em' }}
          >
            Simple pricing.
            <br />
            <span className="gradient-text">No surprises.</span>
          </h2>
          <p className="text-lg text-white/45 max-w-md mx-auto">
            Pay per event. No subscriptions, no hidden fees.
          </p>
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

                <div className="mb-8">
                  <span className="text-6xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>
                    ${plan.price}
                  </span>
                  <span className="text-white/35 ml-2 text-sm">/event</span>
                </div>

                <Link
                  href={plan.href}
                  className={`${plan.highlight ? 'btn-primary' : 'btn-secondary'} w-full justify-center mb-8`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-3.5">
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

        <motion.p {...inView(0.3)} className="text-center text-sm text-white/25 mt-8">
          All plans include SSL encryption, 99.9% uptime, and Supabase-powered secure storage.
        </motion.p>
      </div>
    </section>
  )
}

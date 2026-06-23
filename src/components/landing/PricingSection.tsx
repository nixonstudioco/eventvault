import Link from 'next/link'
import { Check, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const plans = [
  {
    name: 'Basic Event',
    price: 19,
    icon: Zap,
    description: 'Perfect for a single memorable event',
    badge: null,
    features: [
      '1 active event',
      '5 GB storage',
      'Photo & video upload',
      'QR code included',
      'Public gallery',
      'Manual moderation',
      'Guestbook',
    ],
    notIncluded: [
      'Custom QR poster design',
      'Live gallery',
      'Bulk download',
      'Email notifications',
      'Personal branding',
    ],
    cta: 'Start with Basic',
    href: '/register?plan=basic',
    highlight: false,
  },
  {
    name: 'Premium Event',
    price: 49,
    icon: Crown,
    description: 'For organizers who want everything',
    badge: 'Most Popular',
    features: [
      'Unlimited events',
      '50 GB storage',
      'Photo & video upload',
      'Custom QR poster design',
      'Live gallery',
      'Guestbook',
      'Personal branding',
      'Bulk download all media',
      'Email notifications',
      'Priority support',
    ],
    notIncluded: [],
    cta: 'Go Premium',
    href: '/register?plan=premium',
    highlight: true,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-950/20 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Simple, honest <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto">
            Pay per event. No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative glass-card p-8 ${
                plan.highlight
                  ? 'border-brand-500/50 bg-brand-600/5 glow-brand-sm'
                  : 'border-white/10'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.highlight ? 'bg-brand-600 text-white' : 'bg-white/10 text-white/70'
                }`}>
                  <plan.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-white/50">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-5xl font-black text-white">${plan.price}</span>
                <span className="text-white/50 ml-2">/event</span>
              </div>

              <Link href={plan.href} className="block mb-8">
                <Button
                  variant={plan.highlight ? 'primary' : 'secondary'}
                  size="lg"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>

              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/30 line-through">
                    <div className="w-4 h-4 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-white/40 mt-8">
          All plans include SSL encryption, 99.9% uptime, and Supabase-powered secure storage.
        </p>
      </div>
    </section>
  )
}

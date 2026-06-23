import { LandingNav } from '@/components/landing/LandingNav'
import { PricingSection } from '@/components/landing/PricingSection'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/landing/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — EventVault',
  description: 'Simple, honest pricing for event memory galleries.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <div className="pt-24">
        <div className="text-center py-16">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Simple, honest <span className="gradient-text">pricing</span>
          </h1>
          <p className="text-lg text-white/50">No hidden fees. Cancel anytime.</p>
        </div>
        <PricingSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  )
}

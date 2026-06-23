import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-purple-600/10 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
          Your next event deserves
          <br />
          <span className="gradient-text">to be remembered.</span>
        </h2>
        <p className="text-lg text-white/50 mb-10">
          Create your first event in under 2 minutes. No credit card required to start.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-5 h-5" />}>
              Create your first event
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="secondary" size="lg">View pricing</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

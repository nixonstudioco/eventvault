import Link from 'next/link'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Logo } from '@/components/ui/Logo'

export const metadata: Metadata = { title: 'Create account — EventVault' }

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left visual */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0e0e2a 0%, #0a0a1e 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(123,47,247,0.2) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
        <div className="absolute bottom-0 right-0 w-[200px] h-[200px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

        <Logo size="sm" />

        <div className="space-y-4">
          {[
            { emoji: '📸', title: 'Guests upload instantly', desc: 'Via QR code, no app needed' },
            { emoji: '🛡️', title: 'You stay in control', desc: 'Moderate every photo before it goes public' },
            { emoji: '📥', title: 'Download everything', desc: 'Get all memories in one click' },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="text-xl">{f.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-white/80">{f.title}</p>
                <p className="text-xs text-white/35">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 text-xs text-white/25">
          <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8 lg:hidden">
            <Logo size="md" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-sm text-white/45 mt-1">Start collecting memories today</p>
          </div>

          <div className="card p-7">
            <Suspense fallback={<div className="h-64 shimmer-bg rounded-xl" />}>
              <RegisterForm />
            </Suspense>
          </div>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

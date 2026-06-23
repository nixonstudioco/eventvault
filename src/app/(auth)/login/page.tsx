import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Logo } from '@/components/ui/Logo'

export const metadata: Metadata = { title: 'Log in — EventVault' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left visual panel — hidden on mobile */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0e0e2a 0%, #0a0a1e 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Glow */}
        <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(123,47,247,0.2) 0%, transparent 70%)', transform: 'translate(-30%, -30%)' }} />
        <div className="absolute bottom-0 right-0 w-[200px] h-[200px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', transform: 'translate(30%, 30%)' }} />

        <Logo size="sm" />

        <div>
          <p className="text-2xl font-bold text-white leading-snug mb-4">
            "The easiest way to collect all event memories in one place."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-500/30 flex items-center justify-center text-sm font-bold text-brand-300">A</div>
            <div>
              <p className="text-sm font-semibold text-white/80">Ana & Stefan</p>
              <p className="text-xs text-white/35">Wedding · June 2025</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 text-xs text-white/25">
          <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Logo — mobile only */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Logo size="md" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-white/45 mt-1">Sign in to manage your events</p>
          </div>

          <div className="card p-7">
            <LoginForm />
          </div>

          <p className="text-center text-sm text-white/40 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Logo } from '@/components/ui/Logo'

export const metadata: Metadata = { title: 'Log in — EventVault' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-20" style={{ background: '#000' }}>
      {/* Subtle background glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 600,
          height: 400,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(123,47,247,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.025em' }}>
            Welcome back
          </h1>
          <p className="text-sm text-white/40">Sign in to manage your events</p>
        </div>

        <div
          className="rounded-2xl p-7"
          style={{
            background: '#0a0a0a',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
          }}
        >
          <LoginForm />
        </div>

        <p className="text-center text-sm text-white/35 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Sign up free
          </Link>
        </p>

        <p className="text-center mt-3">
          <Link href="/forgot-password" className="text-sm text-white/25 hover:text-white/50 transition-colors">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  )
}

import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'
import { Vault } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Log in' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center glow-brand-sm">
              <Vault className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">EventVault</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-white/50 mt-1">Sign in to manage your events</p>
        </div>

        <div className="glass-card border border-white/15 p-8">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-white/50 mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-brand-400 hover:text-brand-300 font-medium">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}

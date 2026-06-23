import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import Link from 'next/link'
import { Vault } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Reset password' }

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center">
              <Vault className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">EventVault</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Reset your password</h1>
          <p className="text-white/50 mt-1">We'll send a reset link to your email</p>
        </div>

        <div className="glass-card border border-white/15 p-8">
          <ForgotPasswordForm />
        </div>

        <p className="text-center text-sm text-white/50 mt-6">
          Remember it?{' '}
          <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

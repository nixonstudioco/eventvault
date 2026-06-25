'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, Shield, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/ui/Logo'

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Invalid credentials.')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user!.id).single()

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut()
      setError('This account does not have admin access.')
      setLoading(false)
      return
    }

    // Full page load — bypasses any client-side cache
    window.location.href = '/admin'
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ background: '#000' }}
    >
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{
        width: 500, height: 300,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(123,47,247,0.15) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        {/* Admin badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{
            background: 'rgba(123,47,247,0.12)', border: '1px solid rgba(123,47,247,0.25)',
          }}>
            <Shield size={13} className="text-purple-400" />
            <span className="text-xs font-semibold text-purple-400 tracking-wide">Admin Access</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white mb-1" style={{ letterSpacing: '-0.02em' }}>
            Admin login
          </h1>
          <p className="text-sm text-white/35">Restricted to administrators only.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-7 space-y-4"
          style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="input-field pl-9 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-field pl-9 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center mt-2"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Shield size={15} />}
            {loading ? 'Signing in…' : 'Sign in to Admin'}
          </button>
        </form>

        <p className="text-center text-xs text-white/20 mt-5">
          Not an admin?{' '}
          <a href="/login" className="text-white/40 hover:text-white/60 transition-colors">
            Regular login
          </a>
        </p>
      </div>
    </div>
  )
}

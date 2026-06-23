'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Vault } from 'lucide-react'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const schema = z.object({
  password: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export default function ResetPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = schema.safeParse({ password, confirmPassword })
    if (!result.success) {
      const fieldErrors: { password?: string; confirmPassword?: string } = {}
      result.error.errors.forEach(err => {
        if (err.path[0] === 'password') fieldErrors.password = err.message
        if (err.path[0] === 'confirmPassword') fieldErrors.confirmPassword = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast.success('Password reset successful!')
      router.push('/dashboard')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

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
          <h1 className="text-2xl font-bold text-white">Set new password</h1>
        </div>
        <div className="glass-card border border-white/15 p-8">
          <form onSubmit={onSubmit} className="space-y-5">
            <Input
              label="New password"
              type="password"
              placeholder="Min. 8 characters"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="Repeat password"
              icon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Reset password
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

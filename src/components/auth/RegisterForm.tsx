'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback?plan=${plan || ''}`,
        },
      })
      if (error) throw error
      setDone(true)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Check your email</h3>
        <p className="text-sm text-white/50">
          We sent a confirmation link to your email. Click it to activate your account and start creating events.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Full name"
        type="text"
        placeholder="Andrei Popescu"
        icon={<User className="w-4 h-4" />}
        error={errors.fullName?.message}
        {...register('fullName')}
      />

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        icon={<Mail className="w-4 h-4" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Min. 8 characters"
        icon={<Lock className="w-4 h-4" />}
        error={errors.password?.message}
        iconRight={
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
        {...register('password')}
      />

      <Input
        label="Confirm password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Repeat your password"
        icon={<Lock className="w-4 h-4" />}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
        Create account
      </Button>

      <p className="text-xs text-center text-white/30">
        By signing up you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  )
}

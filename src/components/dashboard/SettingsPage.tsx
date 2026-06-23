'use client'

import { useState } from 'react'
import { User, Mail, Lock, Trash2, AlertCircle } from 'lucide-react'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

const profileSchema = z.object({ full_name: z.string().min(2, 'Name too short') })
const passwordSchema = z.object({
  password: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match", path: ['confirmPassword'],
})

interface Props { profile: Profile | null }

export function SettingsPage({ profile }: Props) {
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [profileError, setProfileError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordErrors, setPasswordErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const supabase = createClient()

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = profileSchema.safeParse({ full_name: fullName })
    if (!r.success) { setProfileError(r.error.errors[0].message); return }
    setProfileError('')
    setSaving(true)
    try {
      await supabase.from('profiles').update({ full_name: fullName }).eq('id', profile!.id)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = passwordSchema.safeParse({ password, confirmPassword })
    if (!r.success) {
      const errs: { password?: string; confirmPassword?: string } = {}
      r.error.errors.forEach(err => {
        if (err.path[0] === 'password') errs.password = err.message
        if (err.path[0] === 'confirmPassword') errs.confirmPassword = err.message
      })
      setPasswordErrors(errs)
      return
    }
    setPasswordErrors({})
    setChangingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast.success('Password updated!')
      setPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-white">Settings</h1>
        <p className="text-white/50 mt-1">Manage your account preferences.</p>
      </div>

      <Card className="p-6">
        <h2 className="font-bold text-white flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-brand-400" />
          Profile
        </h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <Input label="Email" value={profile?.email || ''} disabled hint="Email cannot be changed" icon={<Mail className="w-4 h-4" />} />
          <Input
            label="Full name"
            error={profileError}
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
          <Button type="submit" variant="primary" loading={saving}>Save changes</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="font-bold text-white flex items-center gap-2 mb-5">
          <Lock className="w-4 h-4 text-brand-400" />
          Change Password
        </h2>
        <form onSubmit={changePassword} className="space-y-4">
          <Input
            label="New password"
            type="password"
            placeholder="Min. 8 characters"
            error={passwordErrors.password}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Input
            label="Confirm new password"
            type="password"
            placeholder="Repeat password"
            error={passwordErrors.confirmPassword}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" variant="primary" loading={changingPassword}>Update password</Button>
        </form>
      </Card>

      <Card className="p-6 border-red-500/20 bg-red-500/3">
        <h2 className="font-bold text-red-400 flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4" />
          Danger Zone
        </h2>
        <p className="text-sm text-white/50 mb-4">
          Deleting your account will permanently remove all your events, media, and data.
        </p>
        <Button
          variant="danger"
          icon={<Trash2 className="w-4 h-4" />}
          onClick={() => toast.error('Please contact support to delete your account.')}
        >
          Delete account
        </Button>
      </Card>
    </div>
  )
}

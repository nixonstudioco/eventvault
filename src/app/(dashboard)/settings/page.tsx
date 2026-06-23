import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SettingsPage } from '@/components/dashboard/SettingsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings' }

export default async function Settings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return <SettingsPage profile={profile} />
}

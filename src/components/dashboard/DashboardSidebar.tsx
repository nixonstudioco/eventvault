'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calendar, Plus, CreditCard, Settings,
  Vault, LogOut, Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Events', href: '/events', icon: Calendar },
  { label: 'Create Event', href: '/events/create', icon: Plus },
  { label: 'Billing', href: '/billing', icon: CreditCard },
  { label: 'Settings', href: '/settings', icon: Settings },
]

const adminItems = [
  { label: 'Admin Panel', href: '/admin', icon: Shield },
]

interface Props {
  profile: Profile | null
}

export function DashboardSidebar({ profile }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 glass border-r border-white/10 z-40 hidden lg:flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center glow-brand-sm group-hover:scale-105 transition-transform">
            <Vault className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">EventVault</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(active ? 'nav-item-active' : 'nav-item')}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
              {item.label === 'Create Event' && (
                <span className="ml-auto w-5 h-5 rounded-md bg-brand-600/40 flex items-center justify-center">
                  <Plus className="w-3 h-3 text-brand-400" />
                </span>
              )}
            </Link>
          )
        })}

        {profile?.role === 'admin' && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Admin</p>
            </div>
            {adminItems.map((item) => {
              const active = pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href} className={cn(active ? 'nav-item-active' : 'nav-item')}>
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
          <div className="w-9 h-9 rounded-full bg-brand-600/30 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-brand-400">
              {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs text-white/40 truncate">{profile?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-white/30 hover:text-red-400 transition-colors" title="Log out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

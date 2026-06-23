'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Calendar, Plus, CreditCard,
  Settings, LogOut, Shield, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'
import type { Profile } from '@/types'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'Dashboard',    href: '/dashboard',       icon: LayoutDashboard },
  { label: 'My Events',    href: '/events',           icon: Calendar },
  { label: 'New Event',    href: '/events/create',    icon: Plus, highlight: true },
  { label: 'Billing',      href: '/billing',          icon: CreditCard },
  { label: 'Settings',     href: '/settings',         icon: Settings },
]

const adminItems = [
  { label: 'Admin Panel', href: '/admin', icon: Shield },
]

interface Props { profile: Profile | null }

export function DashboardSidebar({ profile }: Props) {
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-60 z-40 hidden lg:flex flex-col"
      style={{ background: '#09091e', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Logo area */}
      <div className="px-5 py-5 border-b border-white/6">
        <Logo size="sm" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'nav-item group',
                active && 'nav-item-active',
                item.highlight && !active && 'text-brand-400/70 hover:text-brand-300'
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {item.highlight && !active && (
                <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(123,47,247,0.15)', color: '#a78bfa' }}>
                  NEW
                </span>
              )}
            </Link>
          )
        })}

        {profile?.role === 'admin' && (
          <>
            <div className="pt-5 pb-2">
              <p className="px-3 text-[10px] font-semibold text-white/25 uppercase tracking-widest">Admin</p>
            </div>
            {adminItems.map((item) => {
              const active = pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href}
                  className={cn('nav-item', active && 'nav-item-active')}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 pt-3 border-t border-white/6">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/4 transition-colors group">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, rgba(123,47,247,0.4) 0%, rgba(6,182,212,0.3) 100%)', color: '#c4b5fd' }}>
            {(profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white/85 truncate">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-[11px] text-white/35 truncate">{profile?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/25 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Users, Calendar, CreditCard,
  LogOut, Shield, BarChart3, Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'
import type { Profile } from '@/types'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { label: 'Overview',  href: '/admin',         icon: LayoutDashboard, exact: true },
  { label: 'Users',     href: '/admin/users',    icon: Users },
  { label: 'Events',    href: '/admin/events',   icon: Calendar },
  { label: 'Plans',     href: '/admin/plans',    icon: CreditCard },
  { label: 'Analytics', href: '/admin/analytics',icon: BarChart3 },
]

interface Props { profile: Profile | null }

export function AdminSidebar({ profile }: Props) {
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/')

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 w-60 z-40 hidden lg:flex flex-col"
      style={{ background: '#080808', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo + admin badge */}
      <div className="px-5 py-5 border-b border-white/[0.05]">
        <Logo size="sm" />
        <div className="mt-3 flex items-center gap-1.5 px-2 py-1.5 rounded-lg" style={{ background: 'rgba(123,47,247,0.1)', border: '1px solid rgba(123,47,247,0.2)' }}>
          <Shield size={11} className="text-purple-400" />
          <span className="text-[11px] font-semibold text-purple-400 tracking-wide">Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('sidebar-link', active && 'active')}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}

        <div className="pt-5 pb-2">
          <p className="px-3 text-[10px] font-semibold text-white/20 uppercase tracking-widest">Your account</p>
        </div>
        <Link
          href="/dashboard"
          className="sidebar-link"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          Dashboard
        </Link>
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 pt-3 border-t border-white/[0.05]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-white/[0.03]">
          <div
            className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, rgba(123,47,247,0.5), rgba(6,182,212,0.35))', color: '#c4b5fd' }}
          >
            {(profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'A').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white/80 truncate">{profile?.full_name || 'Admin'}</p>
            <p className="text-[11px] text-white/30 truncate">{profile?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/20 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}

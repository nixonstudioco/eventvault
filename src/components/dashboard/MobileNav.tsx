'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Plus, CreditCard, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Events', href: '/events', icon: Calendar },
  { label: 'Create', href: '/events/create', icon: Plus, special: true },
  { label: 'Billing', href: '/billing', icon: CreditCard },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10">
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 transition-colors',
                item.special
                  ? 'text-white'
                  : active ? 'text-brand-400' : 'text-white/40 hover:text-white/70'
              )}
            >
              {item.special ? (
                <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center -mt-4 shadow-lg glow-brand-sm">
                  <Plus className="w-5 h-5 text-white" />
                </div>
              ) : (
                <>
                  <item.icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

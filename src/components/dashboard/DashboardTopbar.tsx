'use client'

import { Bell, Search } from 'lucide-react'
import type { Profile } from '@/types'

interface Props {
  profile: Profile | null
}

export function DashboardTopbar({ profile }: Props) {
  return (
    <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1 max-w-sm">
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full bg-surface-700/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500/40 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 glass rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>

        <div className="w-9 h-9 rounded-full bg-brand-600/30 flex items-center justify-center lg:hidden">
          <span className="text-sm font-bold text-brand-400">
            {profile?.full_name?.charAt(0) || 'U'}
          </span>
        </div>
      </div>
    </header>
  )
}

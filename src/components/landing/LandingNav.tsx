'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Features',     href: '#features' },
  { label: 'Use cases',    href: '#use-cases' },
  { label: 'Pricing',      href: '#pricing' },
]

export function LandingNav() {
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-[#07071a]/90 backdrop-blur-xl border-b border-white/6'
        : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Logo size="sm" />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-white/55 hover:text-white/90 transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Get started free</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0c0c20]/95 backdrop-blur-xl border-t border-white/6 animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/6">
              <Link href="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="secondary" size="md" className="w-full">Log in</Button>
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" size="md" className="w-full">Get started free</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

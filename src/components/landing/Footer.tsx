import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-10 px-5">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo size="xs" />

        <div className="flex items-center gap-6 text-sm text-white/30">
          <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
          <a href="mailto:hello@eventvault.app" className="hover:text-white/60 transition-colors">Contact</a>
        </div>

        <p className="text-sm text-white/20">© 2025 EventVault</p>
      </div>
    </footer>
  )
}

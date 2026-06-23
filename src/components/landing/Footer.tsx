import Link from 'next/link'
import { Vault } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-12">
          <div className="sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
                <Vault className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">EventVault</span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed">
              Private media galleries for your most important moments.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Product</h4>
            <ul className="space-y-2">
              {['How it works', 'Features', 'Pricing', 'Use cases'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Account</h4>
            <ul className="space-y-2">
              {[
                { label: 'Sign up', href: '/register' },
                { label: 'Log in', href: '/login' },
                { label: 'Dashboard', href: '/dashboard' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/40 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            © 2025 EventVault. All rights reserved.
          </p>
          <p className="text-sm text-white/30">
            Built with ❤️ for event creators worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}

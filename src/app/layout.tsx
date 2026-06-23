import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'EventVault — All event memories. One QR away.',
    template: '%s | EventVault',
  },
  description:
    'Create a private media gallery for your wedding, birthday, baptism or party. Let guests upload photos and videos through a simple QR code.',
  keywords: ['event gallery', 'wedding photos', 'QR upload', 'event memories', 'photo sharing'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eventvault.io',
    siteName: 'EventVault',
    title: 'EventVault — All event memories. One QR away.',
    description: 'Private media galleries for your most important moments.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#fff',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#6366f1', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}

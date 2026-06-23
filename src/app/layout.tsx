import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'EventVault — Every moment. Safe. Forever.',
    template: '%s | EventVault',
  },
  description:
    'Create a private media gallery for your wedding, birthday, baptism or party. Let guests upload photos and videos through a simple QR code.',
  keywords: ['event gallery', 'wedding photos', 'QR upload', 'event memories', 'photo sharing'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'EventVault',
    title: 'EventVault — Every moment. Safe. Forever.',
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
              background: '#0c0c20',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '500',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
            success: { iconTheme: { primary: '#4ade80', secondary: '#0c0c20' } },
            error:   { iconTheme: { primary: '#f87171', secondary: '#0c0c20' } },
          }}
        />
      </body>
    </html>
  )
}
